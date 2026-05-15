import { useEffect, useRef } from 'react';

const D2R = Math.PI / 180;
const THIGH = 22, CALF = 24;
const STEP_DUR = 150;
const STEP_HEIGHT = 12;
const STRIDE_DIST = 20;
const ROT_THRESHOLD = 10;
const BOUNDARY_INSET = 45;

const LEGS = [
  { id: 0, lat: -6, fwd: 10, rfLat: -28, rfFwd: 24, ks: 1, adj: [1, 4] },
  { id: 1, lat: -6.5, fwd: 4, rfLat: -34, rfFwd: 6, ks: 1, adj: [0, 2, 5] },
  { id: 2, lat: -6.5, fwd: -2, rfLat: -32, rfFwd: -14, ks: 1, adj: [1, 3, 6] },
  { id: 3, lat: -6, fwd: -9, rfLat: -24, rfFwd: -28, ks: 1, adj: [2, 7] },
  { id: 4, lat: 6, fwd: 10, rfLat: 28, rfFwd: 24, ks: -1, adj: [0, 5] },
  { id: 5, lat: 6.5, fwd: 4, rfLat: 34, rfFwd: 6, ks: -1, adj: [4, 6, 1] },
  { id: 6, lat: 6.5, fwd: -2, rfLat: 32, rfFwd: -14, ks: -1, adj: [5, 7, 2] },
  { id: 7, lat: 6, fwd: -9, rfLat: 24, rfFwd: -28, ks: -1, adj: [6, 3] },
];

function b2w(px, py, rot, lat, fwd) {
  const r = rot * D2R;
  const c = Math.cos(r), s = Math.sin(r);
  return { x: px + c * fwd - s * lat, y: py + s * fwd + c * lat };
}

function solveIK(sx, sy, fx, fy, T, C, ks) {
  const dx = fx - sx, dy = fy - sy;
  let d = Math.sqrt(dx * dx + dy * dy);
  const minD = Math.abs(T - C) + 0.1;
  const maxD = T + C - 0.1;
  d = Math.max(minD, Math.min(maxD, d));
  const cosA = (T * T + d * d - C * C) / (2 * T * d);
  const a = Math.acos(Math.max(-1, Math.min(1, cosA)));
  const base = Math.atan2(dy, dx);
  const knee = base + ks * a;
  return { kx: sx + Math.cos(knee) * T, ky: sy + Math.sin(knee) * T };
}

const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const easeOutCirc = t => Math.sqrt(1 - Math.pow(t - 1, 2));

export default function Spider() {
  const spiderRef = useRef(null);
  const svgRef = useRef(null);
  const webRef = useRef(null);
  const legRefs = useRef([]);
  const curTarget = useRef(null);

  // Animation State & Clock
  const isVisible = useRef(true);
  const isTabActive = useRef(true);
  const activeTime = useRef(0);
  const lastRawT = useRef(0);

  useEffect(() => {
    const spider = spiderRef.current;
    const web = webRef.current;
    const grid = document.querySelector('.hero-grid');

    let raf, timeout;
    let pos = { x: -200, y: -200, rot: 90, vRot: 90 };
    let lastPos = { x: -200, y: -200 };
    let lastTickRot = 90;

    let footPos = LEGS.map(() => ({ x: 0, y: 0 }));
    let stepFrom = LEGS.map(() => ({ x: 0, y: 0 }));
    let stepTo = LEGS.map(() => ({ x: 0, y: 0 }));
    let stepT = Array(8).fill(1);
    let stepStartT = Array(8).fill(0);
    let plantRot = Array(8).fill(90);
    let inAction = false;

    // Intersection Observer to pause when off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    if (grid) observer.observe(grid);

    // Tab visibility handling
    const handleVisibilityChange = () => {
      isTabActive.current = !document.hidden;
      if (isTabActive.current) {
        lastRawT.current = 0; // Reset delta on resume to avoid jump
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const updateClock = (rawT) => {
      if (lastRawT.current === 0) {
        lastRawT.current = rawT;
        return activeTime.current;
      }
      const dt = rawT - lastRawT.current;
      lastRawT.current = rawT;

      // Only advance internal clock if tab is active (browser throttles RAF anyway)
      if (isTabActive.current) {
        activeTime.current += dt;
      }
      return activeTime.current;
    };

    const setPos = (x, y) => {
      pos.x = x; pos.y = y;
      if (spider) spider.style.transform = `translate(${x - 30}px,${y - 30}px)`;
    };

    const updateVRot = () => {
      let diff = pos.rot - pos.vRot;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      pos.vRot += diff * 0.18;
      const svgBody = svgRef.current;
      if (svgBody) svgBody.style.transform = `rotate(${pos.vRot + 90}deg)`;
    };

    const showWeb = (x1, y1, x2, y2) => {
      if (!web) return;
      web.setAttribute('x1', x1); web.setAttribute('y1', y1);
      web.setAttribute('x2', x2); web.setAttribute('y2', y2);
      web.style.opacity = 1;
    };
    const hideWeb = () => { if (web) web.style.opacity = 0; };

    const getIdeal = (i, x, y, r, scale = 1) => {
      let reachScale = scale;
      if (scale > 1.1) {
        reachScale = i === 0 || i === 4 ? 1.5 :
          i === 3 || i === 7 ? 1.5 :
            1.2;
      }
      return b2w(x, y, r, LEGS[i].rfLat * reachScale, LEGS[i].rfFwd * reachScale);
    };

    const getShoulder = (i, x, y, r) => b2w(x, y, r, LEGS[i].lat, LEGS[i].fwd);

    const initFeet = (x, y, r, scale = 1) => {
      footPos = LEGS.map((_, i) => getIdeal(i, x, y, r, scale));
      stepT.fill(1); plantRot.fill(r);
    };

    const drawLegs = (x, y, r, jitterScale = 0.2) => {
      if (!isVisible.current || !isTabActive.current) return;
      LEGS.forEach((leg, i) => {
        const s = getShoulder(i, x, y, r);
        const f = footPos[i];
        const { kx, ky } = solveIK(s.x, s.y, f.x, f.y, THIGH, CALF, leg.ks);
        const el = legRefs.current[i];
        if (el && isFinite(kx)) {
          const j = (Math.random() - 0.5) * jitterScale;
          el.setAttribute('points', `${(s.x + j).toFixed(1)},${(s.y + j).toFixed(1)} ${(kx + j).toFixed(1)},${(ky + j).toFixed(1)} ${(f.x + j).toFixed(1)},${(f.y + j).toFixed(1)}`);
        }
      });
    };

    const updateGait = (now, x, y, r, vx, vy, dr) => {
      LEGS.forEach((leg, i) => {
        const ideal = getIdeal(i, x, y, r);
        if (stepT[i] < 1) {
          const t = Math.min((now - stepStartT[i]) / STEP_DUR, 1);
          const e = easeOutCirc(t);
          let nx = stepFrom[i].x + (stepTo[i].x - stepFrom[i].x) * e;
          let ny = stepFrom[i].y + (stepTo[i].y - stepFrom[i].y) * e;
          const lift = Math.sin(t * Math.PI) * STEP_HEIGHT;
          const side = i < 4 ? -1 : 1;
          const rRad = r * D2R;
          nx -= Math.sin(rRad) * lift * side; ny += Math.cos(rRad) * lift * side;
          footPos[i] = { x: nx, y: ny };
          stepT[i] = t;
          if (t >= 1) plantRot[i] = r;
        } else {
          const dist = Math.sqrt(Math.pow(ideal.x - footPos[i].x, 2) + Math.pow(ideal.y - footPos[i].y, 2));
          let rotDiff = r - plantRot[i];
          while (rotDiff > 180) rotDiff -= 360;
          while (rotDiff < -180) rotDiff += 360;
          if (dist > STRIDE_DIST || Math.abs(rotDiff) > ROT_THRESHOLD) {
            // Safety: if leg is EXTREMELY far, ignore adjacency to prevent getting stuck
            const isExtremelyFar = dist > STRIDE_DIST * 1.5;
            if (isExtremelyFar || !leg.adj.some(nid => stepT[nid] < 1)) {
              stepFrom[i] = { ...footPos[i] };
              const proj = 2.0;
              stepTo[i] = getIdeal(i, x + vx * proj, y + vy * proj, r + dr * proj);
              stepT[i] = 0; stepStartT[i] = now;
            }
          }
        }
      });
    };

    let idleRaf;
    const startIdleDraw = () => {
      cancelAnimationFrame(idleRaf);
      const loop = rawT => {
        const now = updateClock(rawT);
        if (inAction) return;
        if (isVisible.current && isTabActive.current) {
          const dr = pos.vRot - lastTickRot;
          lastTickRot = pos.vRot;
          updateVRot();
          updateGait(now, pos.x, pos.y, pos.vRot, 0, 0, dr);
          drawLegs(pos.x, pos.y, pos.vRot, 0.2);
        }
        idleRaf = requestAnimationFrame(loop);
      };
      idleRaf = requestAnimationFrame(loop);
    };

    const calcRot = (dx, dy) => Math.atan2(dy, dx) * (180 / Math.PI);
    const shortestRot = target => {
      let diff = target - pos.rot;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      return pos.rot + diff;
    };

    const pickPoint = (rect, gr) => {
      const minX = rect.left - gr.left + BOUNDARY_INSET;
      const maxX = rect.right - gr.left - BOUNDARY_INSET;
      const minY = rect.top - gr.top + BOUNDARY_INSET;
      const maxY = rect.bottom - gr.top - BOUNDARY_INSET;
      return { x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY) };
    };

    const performDrop = () => {
      const gridRect = grid.getBoundingClientRect();
      const blocks = document.querySelectorAll('.hero-main,.stat-cell');
      if (!blocks.length) return;
      const tgt = blocks[Math.floor(Math.random() * blocks.length)];
      curTarget.current = tgt;
      const { x: tx, y: ty } = pickPoint(tgt.getBoundingClientRect(), gridRect);
      setPos(tx, -50); pos.rot = 90; pos.vRot = 90;
      initFeet(tx, -50, 90); startIdleDraw();
      let t0 = -1;
      const drop = rawT => {
        const now = updateClock(rawT);
        if (!isVisible.current || !isTabActive.current) { raf = requestAnimationFrame(drop); return; }
        if (t0 < 0) t0 = now;
        const p = Math.min((now - t0) / 1000, 1);
        const y = -50 + (ty + 50) * easeInOut(p);
        setPos(tx, y); initFeet(tx, y, 90, 1.3);
        drawLegs(tx, y, 90, 0.5); showWeb(tx, -50, tx, y);
        if (p < 1) raf = requestAnimationFrame(drop);
        else { hideWeb(); timeout = setTimeout(actionCycle, 2000); }
      };
      raf = requestAnimationFrame(drop);
    };

    const doSwing = (gr, blocks) => {
      let tgt;
      do { tgt = blocks[Math.floor(Math.random() * blocks.length)]; }
      while (blocks.length > 1 && tgt === curTarget.current);
      curTarget.current = tgt;
      const { x: tx, y: ty } = pickPoint(tgt.getBoundingClientRect(), gr);
      const sx = pos.x, sy = pos.y;
      const px = (sx + tx) / 2, py = Math.min(sy, ty) - 250;
      pos.rot = shortestRot(calcRot(tx - sx, ty - sy));

      timeout = setTimeout(() => {
        cancelAnimationFrame(idleRaf); inAction = true;
        let wt0 = -1;
        const swingDepth = 150 + Math.random() * 200;
        const shoot = rawT => {
          const now = updateClock(rawT);
          if (!isVisible.current || !isTabActive.current) { raf = requestAnimationFrame(shoot); return; }
          if (wt0 < 0) wt0 = now;
          const p = Math.min((now - wt0) / 200, 1);
          showWeb(sx + (px - sx) * p, sy + (py - sy) * p, sx, sy);
          if (p < 1) { raf = requestAnimationFrame(shoot); return; }
          let st0 = -1;
          const swing = rawT2 => {
            const now2 = updateClock(rawT2);
            if (!isVisible.current || !isTabActive.current) { raf = requestAnimationFrame(swing); return; }
            if (st0 < 0) st0 = now2;
            const p2 = Math.min((now2 - st0) / 900, 1);
            const e = easeInOut(p2);
            const cx = sx + (tx - sx) * e;
            const cy = sy + (ty - sy) * e + Math.sin(p2 * Math.PI) * swingDepth;
            const cvx = cx - pos.x, cvy = cy - pos.y;
            if (Math.abs(cvx) + Math.abs(cvy) > 0.1) pos.rot = shortestRot(calcRot(cvx, cvy));
            setPos(cx, cy); updateVRot();
            initFeet(cx, cy, pos.vRot, 1.4);
            drawLegs(cx, cy, pos.vRot, 1.2);
            showWeb(px, py, cx, cy);
            if (p2 < 1) raf = requestAnimationFrame(swing);
            else { inAction = false; hideWeb(); startIdleDraw(); timeout = setTimeout(actionCycle, 2000); }
          };
          raf = requestAnimationFrame(swing);
        };
        raf = requestAnimationFrame(shoot);
      }, 300);
    };

    const doCrawl = (gr, blocks) => {
      const { x: tx, y: ty } = pickPoint(curTarget.current.getBoundingClientRect(), gr);
      const dx = tx - pos.x, dy = ty - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) { doSwing(gr, blocks); return; }
      pos.rot = shortestRot(calcRot(dx, dy));
      timeout = setTimeout(() => {
        cancelAnimationFrame(idleRaf); inAction = true;
        initFeet(pos.x, pos.y, pos.rot);
        let ct0 = -1;
        const dur = Math.max(800, dist * 8);
        const startX = pos.x, startY = pos.y;
        lastPos = { x: startX, y: startY };
        let iterLastRot = pos.vRot;
        const loop = rawT => {
          const now = updateClock(rawT);
          if (!isVisible.current || !isTabActive.current) { raf = requestAnimationFrame(loop); return; }
          if (ct0 < 0) ct0 = now;
          const p = Math.min((now - ct0) / dur, 1);
          const cx = startX + dx * p, cy = startY + dy * p;
          const vx = cx - lastPos.x, vy = cy - lastPos.y;
          const dr = pos.vRot - iterLastRot;
          lastPos = { x: cx, y: cy }; iterLastRot = pos.vRot;
          if (Math.abs(vx) + Math.abs(vy) > 0.1) pos.rot = shortestRot(calcRot(vx, vy));
          setPos(cx, cy); updateVRot();
          updateGait(now, cx, cy, pos.vRot, vx, vy, dr);
          drawLegs(cx, cy, pos.vRot, 0.2);
          if (p < 1) raf = requestAnimationFrame(loop);
          else { inAction = false; startIdleDraw(); timeout = setTimeout(actionCycle, 1000); }
        };
        raf = requestAnimationFrame(loop);
      }, 300);
    };

    const actionCycle = () => {
      if (!isTabActive.current || !isVisible.current) {
        timeout = setTimeout(actionCycle, 1000);
        return;
      }
      const currentGrid = document.querySelector('.hero-grid');
      const currentBlocks = document.querySelectorAll('.hero-main,.stat-cell');
      if (!currentGrid || !currentBlocks.length) return;
      if (curTarget.current && Math.random() > 0.45) doCrawl(currentGrid.getBoundingClientRect(), currentBlocks);
      else doSwing(currentGrid.getBoundingClientRect(), currentBlocks);
    };

    const onLoaded = () => { timeout = setTimeout(performDrop, 500); };
    if (document.body.classList.contains('loader-animation-done')) onLoaded();
    else window.addEventListener('loaderFinished', onLoaded, { once: true });

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(idleRaf);
      window.removeEventListener('loaderFinished', onLoaded);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999, overflow: 'visible' }}>
        <line ref={webRef} x1="0" y1="0" x2="0" y2="0" stroke="rgba(13, 27, 42, 0.3)" strokeWidth="1.2" style={{ opacity: 0 }} />
        {Array.from({ length: 8 }, (_, i) => (
          <polyline key={i} ref={el => legRefs.current[i] = el} points="" fill="none" stroke="#0d1b2a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
      <div ref={spiderRef} className="cyber-spider" style={{ position: 'absolute', width: 60, height: 60, transform: 'translate(-100px,-100px)', overflow: 'visible', zIndex: 999 }}>
        <svg ref={svgRef} width="60" height="60" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="24" fill="var(--y)" opacity="0.15" filter="blur(8px)" />
          <ellipse cx="50" cy="40" rx="11" ry="14" fill="#0d1b2a" />
          <circle cx="50" cy="66" r="15" fill="#0d1b2a" />
          <ellipse cx="50" cy="66" rx="7" ry="9" fill="#111f2e" opacity="0.6" />
          <circle cx="46" cy="34" r="3" fill="var(--y)" filter="drop-shadow(0 0 4px var(--y))" />
          <circle cx="54" cy="34" r="3" fill="var(--y)" filter="drop-shadow(0 0 4px var(--y))" />
        </svg>
      </div>
    </>
  );
}
