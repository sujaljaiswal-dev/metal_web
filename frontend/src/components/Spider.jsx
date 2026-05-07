import { useEffect, useRef } from 'react';

const D2R = Math.PI / 180;
const THIGH = 20, CALF = 22;       // Longer bones for proper reach
const STEP_PERIOD = 200;           // ms between diagonal pair steps
const STEP_DUR    = 140;           // ms each foot travels

// Body-local configs
// lat: positive = spider's right side, fwd: positive = toward head
// rfLat/rfFwd: resting foot position (body-local)
// ks: knee bend direction for IK (+1 or -1)
const LEGS = [
  // Left side (ks=+1 bends knees outward-left)
  { lat:-6, fwd: 7,   rfLat:-26, rfFwd: 22, ks: 1 },  // L1 front
  { lat:-6, fwd: 2,   rfLat:-32, rfFwd:  4, ks: 1 },  // L2 mid-f
  { lat:-6, fwd:-2,   rfLat:-30, rfFwd:-12, ks: 1 },  // L3 mid-b
  { lat:-6, fwd:-7,   rfLat:-22, rfFwd:-26, ks: 1 },  // L4 rear
  // Right side (ks=-1 bends knees outward-right)
  { lat: 6, fwd: 7,   rfLat: 26, rfFwd: 22, ks:-1 },  // R1 front
  { lat: 6, fwd: 2,   rfLat: 32, rfFwd:  4, ks:-1 },  // R2 mid-f
  { lat: 6, fwd:-2,   rfLat: 30, rfFwd:-12, ks:-1 },  // R3 mid-b
  { lat: 6, fwd:-7,   rfLat: 22, rfFwd:-26, ks:-1 },  // R4 rear
];

// Diagonal gait pairs (alternating tripod-like)
const GAIT = [[0,5],[2,7],[4,1],[6,3]];

// Body-local → world coordinates
function b2w(px, py, rot, lat, fwd) {
  const r = rot * D2R;
  const cosR = Math.cos(r), sinR = Math.sin(r);
  return {
    x: px + cosR * lat - sinR * fwd,
    y: py + sinR * lat + cosR * fwd,
  };
}

// 2-bone IK: find knee position given shoulder and foot
function solveIK(sx, sy, fx, fy, T, C, ks) {
  const dx = fx - sx, dy = fy - sy;
  let d = Math.sqrt(dx * dx + dy * dy);
  // Clamp to valid range
  d = Math.max(Math.abs(T - C) + 0.5, Math.min(T + C - 0.5, d));
  const cosA = (T * T + d * d - C * C) / (2 * T * d);
  const a = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const base = Math.atan2(dy, dx);
  const knee = base + ks * a;
  return { kx: sx + Math.cos(knee) * T, ky: sy + Math.sin(knee) * T };
}

const easeIO  = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const easeOut = t => 1 - (1 - t) * (1 - t);

export default function Spider() {
  const spiderRef = useRef(null);
  const svgRef    = useRef(null);
  const webRef    = useRef(null);
  const legRefs   = useRef([]);
  const curTarget = useRef(null);

  useEffect(() => {
    const spider = spiderRef.current;
    const svgEl  = svgRef.current;
    const web    = webRef.current;
    const legEls = legRefs.current;

    let raf, timeout;
    // rot: 0 = facing right, 90 = facing down, 180 = facing left, 270 = facing up
    let pos = { x: -130, y: -530, rot: 270 };

    // Gait state
    let footPos     = null;
    let stepping    = Array(8).fill(false);
    let stepFrom    = Array(8).fill(null);
    let stepTo      = Array(8).fill(null);
    let stepStartT  = Array(8).fill(0);
    let gaitIdx     = 0;
    let lastStepT   = 0;
    let inCrawl     = false;

    // ── Helpers ────────────────────────────────────────────

    const setPos = (x, y) => {
      pos.x = x; pos.y = y;
      spider.style.transform = `translate(${x - 30}px,${y - 30}px)`;
    };

    const setRot = r => {
      pos.rot = r;
      // SVG artwork has head at top (y=34), so rotate(0) = head-right
      // We subtract 90 so that rot=0 in our system (facing right) maps to CSS rotate(-90deg)
      // which turns the up-facing head to face right
      svgEl.style.transform = `rotate(${r - 90}deg)`;
    };

    const showWeb = (x1, y1, x2, y2) => {
      web.setAttribute('x1', x1); web.setAttribute('y1', y1);
      web.setAttribute('x2', x2); web.setAttribute('y2', y2);
      web.style.opacity = 1;
    };
    const hideWeb = () => { web.style.opacity = 0; };

    const getIdeal    = (i, x, y, r) => b2w(x, y, r, LEGS[i].rfLat, LEGS[i].rfFwd);
    const getShoulder = (i, x, y, r) => b2w(x, y, r, LEGS[i].lat,   LEGS[i].fwd);

    const initFeet = (x, y, r) => {
      footPos = LEGS.map((_, i) => getIdeal(i, x, y, r));
      stepping.fill(false);
    };

    // Draw all 8 legs using IK
    const drawLegs = (x, y, r) => {
      const fp = footPos || LEGS.map((_, i) => getIdeal(i, x, y, r));
      LEGS.forEach((leg, i) => {
        const s = getShoulder(i, x, y, r);
        const f = fp[i];
        const { kx, ky } = solveIK(s.x, s.y, f.x, f.y, THIGH, CALF, leg.ks);
        const el = legEls[i];
        if (el) {
          el.setAttribute('points',
            `${s.x.toFixed(1)},${s.y.toFixed(1)} ${kx.toFixed(1)},${ky.toFixed(1)} ${f.x.toFixed(1)},${f.y.toFixed(1)}`
          );
        }
      });
    };

    // Advance gait — step next diagonal pair
    const tickGait = (now, x, y, r) => {
      if (now - lastStepT < STEP_PERIOD) return;
      lastStepT = now;
      const group = GAIT[gaitIdx % GAIT.length];
      group.forEach(i => {
        stepFrom[i]   = { ...footPos[i] };
        stepTo[i]     = getIdeal(i, x, y, r);
        stepping[i]   = true;
        stepStartT[i] = now;
      });
      gaitIdx++;
    };

    // Update positions of feet that are mid-step
    const updateFeet = now => {
      LEGS.forEach((_, i) => {
        if (!stepping[i]) return;
        const t = Math.min((now - stepStartT[i]) / STEP_DUR, 1);
        const e = easeOut(t);
        footPos[i] = {
          x: stepFrom[i].x + (stepTo[i].x - stepFrom[i].x) * e,
          y: stepFrom[i].y + (stepTo[i].y - stepFrom[i].y) * e,
        };
        if (t >= 1) stepping[i] = false;
      });
    };

    // ── Idle draw loop ────────────────────────────────────
    let idleRaf;
    const startIdleDraw = () => {
      cancelAnimationFrame(idleRaf);
      const loop = () => {
        if (inCrawl) return;
        drawLegs(pos.x, pos.y, pos.rot);
        idleRaf = requestAnimationFrame(loop);
      };
      idleRaf = requestAnimationFrame(loop);
    };

    // ── Movement helpers ──────────────────────────────────

    const calcRot = (dx, dy) => Math.atan2(dy, dx) * (180 / Math.PI);

    const shortestRotTo = target => {
      let diff = target - pos.rot;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      return pos.rot + diff;
    };

    const pickEdgePoint = (rect, gr) => {
      const edges = ['top', 'right', 'bottom', 'left'];
      const edge = edges[Math.floor(Math.random() * 4)];
      let x = rect.left - gr.left, y = rect.top - gr.top;
      if      (edge === 'top')    x += Math.random() * rect.width;
      else if (edge === 'bottom') { x += Math.random() * rect.width; y += rect.height; }
      else if (edge === 'left')   y += Math.random() * rect.height;
      else                        { x += rect.width; y += Math.random() * rect.height; }
      return { x, y };
    };

    // ── Phase: Drop ───────────────────────────────────────

    const performDrop = () => {
      const grid   = document.querySelector('.hero-grid');
      const blocks = document.querySelectorAll('.hero-main,.stat-cell');
      if (!grid || !blocks.length) return;
      const gr  = grid.getBoundingClientRect();
      const tgt = blocks[Math.floor(Math.random() * blocks.length)];
      curTarget.current = tgt;
      const rect = tgt.getBoundingClientRect();
      const tx = rect.left - gr.left + Math.random() * rect.width;
      const ty = rect.top - gr.top;

      setPos(tx, -500);
      setRot(90); // facing down
      initFeet(tx, -500, 90);
      startIdleDraw();

      let t0;
      const drop = t => {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / 1200, 1);
        const y = -500 + (ty + 500) * easeIO(p);
        footPos = LEGS.map((_, i) => getIdeal(i, tx, y, 90));
        setPos(tx, y);
        showWeb(tx, -500, tx, y);
        if (p < 1) { raf = requestAnimationFrame(drop); }
        else {
          hideWeb();
          initFeet(tx, ty, 90);
          timeout = setTimeout(actionCycle, 2000 + Math.random() * 1500);
        }
      };
      raf = requestAnimationFrame(drop);
    };

    // ── Phase: Swing ──────────────────────────────────────

    const doSwing = (gr, blocks) => {
      let tgt;
      do { tgt = blocks[Math.floor(Math.random() * blocks.length)]; }
      while (blocks.length > 1 && tgt === curTarget.current);
      curTarget.current = tgt;

      const rect = tgt.getBoundingClientRect();
      const { x: tx, y: ty } = pickEdgePoint(rect, gr);

      const sx = pos.x, sy = pos.y;
      const pvtX = (sx + tx) / 2, pvtY = Math.min(sy, ty) - 400;
      const dx = tx - sx, dy = ty - sy;

      const tRot = shortestRotTo(calcRot(dx, dy));
      setRot(tRot);
      footPos = null; // legs go to ideal "splayed" pose

      setTimeout(() => {
        let wt0;
        const shootWeb = t => {
          if (!wt0) wt0 = t;
          const p = Math.min((t - wt0) / 200, 1);
          showWeb(sx + (pvtX - sx) * p, sy + (pvtY - sy) * p, sx, sy);
          if (p < 1) { raf = requestAnimationFrame(shootWeb); return; }

          const low = (sy + ty) / 2;
          const arc = Math.max(0, Math.min(150, gr.height - 30 - low));
          let st0;
          const swingArc = t2 => {
            if (!st0) st0 = t2;
            const p2 = Math.min((t2 - st0) / 1000, 1);
            const e = easeIO(p2);
            const cx = sx + (tx - sx) * e;
            const cy = sy + (ty - sy) * e + Math.sin(p2 * Math.PI) * arc;
            setPos(cx, cy);
            showWeb(pvtX, pvtY, cx, cy);
            if (p2 < 1) { raf = requestAnimationFrame(swingArc); }
            else {
              hideWeb();
              initFeet(cx, cy, pos.rot);
              timeout = setTimeout(actionCycle, 2000 + Math.random() * 2000);
            }
          };
          raf = requestAnimationFrame(swingArc);
        };
        raf = requestAnimationFrame(shootWeb);
      }, 350);
    };

    // ── Phase: Crawl ──────────────────────────────────────

    const doCrawl = (gr, blocks) => {
      const rect = curTarget.current.getBoundingClientRect();
      const { x: tx, y: ty } = pickEdgePoint(rect, gr);

      const sx = pos.x, sy = pos.y;
      const dx = tx - sx, dy = ty - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 30) { doSwing(gr, blocks); return; }

      const tRot = shortestRotTo(calcRot(dx, dy));
      setRot(tRot);

      setTimeout(() => {
        cancelAnimationFrame(idleRaf);
        inCrawl = true;
        if (!footPos) initFeet(sx, sy, pos.rot);
        gaitIdx = 0; lastStepT = 0;
        const dur = Math.max(900, dist * 9);
        let ct0;

        const crawlLoop = t => {
          if (!ct0) { ct0 = t; lastStepT = t; }
          const p = Math.min((t - ct0) / dur, 1);
          const cx = sx + dx * p, cy = sy + dy * p;
          setPos(cx, cy);
          tickGait(t, cx, cy, pos.rot);
          updateFeet(t);
          drawLegs(cx, cy, pos.rot);
          if (p < 1) { raf = requestAnimationFrame(crawlLoop); }
          else {
            inCrawl = false;
            startIdleDraw();
            timeout = setTimeout(() => doSwing(gr, blocks), 600 + Math.random() * 800);
          }
        };
        raf = requestAnimationFrame(crawlLoop);
      }, 300);
    };

    // ── Decision loop ─────────────────────────────────────

    const actionCycle = () => {
      const grid   = document.querySelector('.hero-grid');
      const blocks = document.querySelectorAll('.hero-main,.stat-cell');
      if (!grid || !blocks.length) return;
      const gr = grid.getBoundingClientRect();
      if (curTarget.current && Math.random() > 0.3) doCrawl(grid, gr, blocks);
      else doSwing(gr, blocks);
    };

    const onLoaded = () => { timeout = setTimeout(performDrop, 500); };
    if (document.body.classList.contains('loader-animation-done')) onLoaded();
    else window.addEventListener('loaderFinished', onLoaded, { once: true });

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(idleRaf);
      window.removeEventListener('loaderFinished', onLoaded);
    };
  }, []);

  return (
    <>
      {/* World-space overlay: web line + 8 IK legs */}
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 49, overflow: 'visible' }}>
        <line ref={webRef} x1="0" y1="0" x2="0" y2="0"
          stroke="rgba(0,0,0,0.8)" strokeWidth="2.5"
          style={{ opacity: 0, transition: 'opacity 0.15s' }} />
        {Array.from({ length: 8 }, (_, i) => (
          <polyline key={i} ref={el => legRefs.current[i] = el}
            points="" fill="none"
            stroke="#0d1b2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>

      {/* Spider body */}
      <div ref={spiderRef} className="cyber-spider" style={{ transform: 'translate(-160px,-560px)' }}>
        <svg ref={svgRef} width="60" height="60" viewBox="0 0 100 100" fill="none"
          style={{ transform: 'rotate(180deg)', transition: 'transform 0.3s cubic-bezier(0.25,1,0.5,1)' }}>
          {/* Glow */}
          <circle cx="50" cy="50" r="24" fill="var(--y)" opacity="0.2" filter="blur(8px)" />
          {/* Thorax */}
          <ellipse cx="50" cy="40" rx="9" ry="13" fill="#0d1b2a" />
          {/* Abdomen */}
          <circle cx="50" cy="66" r="15" fill="#0d1b2a" />
          {/* Abdomen pattern */}
          <ellipse cx="50" cy="66" rx="7" ry="9" fill="#111f2e" opacity="0.6" />
          {/* Eyes */}
          <circle cx="46" cy="34" r="3" fill="var(--y)" filter="drop-shadow(0 0 4px var(--y))" />
          <circle cx="54" cy="34" r="3" fill="var(--y)" filter="drop-shadow(0 0 4px var(--y))" />
          {/* Fang hints */}
          <ellipse cx="47" cy="29" rx="1.5" ry="2" fill="#0d1b2a" />
          <ellipse cx="53" cy="29" rx="1.5" ry="2" fill="#0d1b2a" />
        </svg>
      </div>
    </>
  );
}
