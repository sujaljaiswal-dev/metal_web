import { useEffect, useState } from 'react';
import '../styles/loader.css';

export default function Loader({ onFinished }) {
    const [visible, setVisible] = useState(true);
    const [finished, setFinished] = useState(false);
    const [progress, setProgress] = useState(6);

    useEffect(() => {
        const MIN_SHOW = 3000; // minimum loader display in ms
        const COMPLETE_HOLD = 500; // keep the full bar visible before sliding away
        const start = Date.now();
        let finishedCalled = false;
        let finishDelayTimeout = null;
        let fadeTimeout = null;
        let minTimeout = null;
        let progressInterval = null;
        let completeHoldTimeout = null;

        const doFinishNow = () => {
            if (finishedCalled) return;
            finishedCalled = true;
            setProgress(100);
            if (progressInterval) clearInterval(progressInterval);
            completeHoldTimeout = window.setTimeout(() => {
                onFinished?.();
                setFinished(true);
                fadeTimeout = window.setTimeout(() => setVisible(false), 1200);
            }, COMPLETE_HOLD);
        };

        const finish = () => {
            // If min timeout is still pending, clear it — we'll schedule remaining time instead
            if (minTimeout) {
                clearTimeout(minTimeout);
                minTimeout = null;
            }

            const elapsed = Date.now() - start;
            const remaining = Math.max(0, MIN_SHOW - elapsed);
            finishDelayTimeout = window.setTimeout(doFinishNow, remaining);
        };

        // Ensure loader always finishes at MIN_SHOW even if 'load' doesn't fire
        minTimeout = window.setTimeout(() => {
            // If page already loaded, finish will have been scheduled; force now otherwise
            if (!finishedCalled) doFinishNow();
        }, MIN_SHOW);

        if (document.readyState === 'complete') {
            finish();
        } else {
            window.addEventListener('load', finish, { once: true });
        }

        // Progress updater for visual smoothness
        progressInterval = window.setInterval(() => {
            const elapsed = Date.now() - start;
            const pct = Math.min(99, Math.round((elapsed / MIN_SHOW) * 100));
            setProgress(pct);
        }, 50);

        return () => {
            window.removeEventListener('load', finish);
            if (minTimeout) clearTimeout(minTimeout);
            if (finishDelayTimeout) clearTimeout(finishDelayTimeout);
            if (completeHoldTimeout) clearTimeout(completeHoldTimeout);
            if (fadeTimeout) clearTimeout(fadeTimeout);
            if (progressInterval) clearInterval(progressInterval);
        };
    }, []);

    if (!visible) return null;

    return (
        <div className={`site-loader ${finished ? 'finished' : ''}`} role="status" aria-hidden={!visible}>
            <div className="loader-container">
                <div className="loader-inner">
                    <div className="loader-top">
                        <span className="loader-logo" style={{ '--logo-fill': `${progress}%` }} data-text="METAL_WEB">
                            METAL_WEB
                        </span>
                    </div>
                    <div className="loader-bar" aria-hidden>
                        <div className="loader-progress" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="loader-percent" aria-hidden>{Math.min(100, Math.round(progress))}%</div>
                </div>

                <div className="loader-inner loader-reflection" aria-hidden="true">
                    <div className="loader-top">
                        <span className="loader-logo" style={{ '--logo-fill': `${progress}%` }} data-text="METAL_WEB">
                            METAL_WEB
                        </span>
                    </div>
                    <div className="loader-bar">
                        <div className="loader-progress" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="loader-percent">{Math.min(100, Math.round(progress))}%</div>
                </div>
            </div>
        </div>
    );
}
