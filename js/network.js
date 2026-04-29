/* ============================================================
   NETWORK.JS — Animated particle network background
   Used on section title slides
   ============================================================ */

(function () {
    'use strict';

    const NODE_COLOR = 'rgba(0,212,170,0.7)';
    const NODE_COUNT = 26;
    const CONNECTION_DIST = 160;
    const CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST;
    const SPEED = 0.28;

    function initCanvas(canvas) {
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');

        function resize() {
            // Use innerWidth/innerHeight — the canvas always covers the full viewport
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Nodes
        const nodes = Array.from({ length: NODE_COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            r: Math.random() * 1.8 + 0.8,
        }));

        let animId = null;
        let running = false;

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Move
            nodes.forEach(n => {
                n.x += n.vx;
                n.y += n.vy;
                if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
            });

            // Lines
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < CONNECTION_DIST_SQ) {
                        const dist = Math.sqrt(distSq);
                        const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
                        ctx.strokeStyle = `rgba(0,212,170,${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Nodes
            nodes.forEach(n => {
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = NODE_COLOR;
                ctx.fill();
            });

            if (running) {
                animId = requestAnimationFrame(draw);
            }
        }

        function start() {
            if (running) return;
            running = true;
            draw();
        }

        function stop() {
            running = false;
            if (animId !== null) {
                cancelAnimationFrame(animId);
                animId = null;
            }
        }

        return {
            canvas,
            start,
            stop,
            destroy() {
                stop();
                window.removeEventListener('resize', resize);
            }
        };
    }

    const instances = Array.from(document.querySelectorAll('.particle-canvas'))
        .map(c => initCanvas(c))
        .filter(Boolean);

    function syncCanvases() {
        instances.forEach((inst) => {
            const slide = inst.canvas.closest('.slide');
            const isActive = !!slide && slide.classList.contains('active');
            if (isActive && !document.hidden) inst.start();
            else inst.stop();
        });
    }

    document.addEventListener('slidechange', syncCanvases);
    document.addEventListener('visibilitychange', syncCanvases);
    window.addEventListener('beforeunload', () => instances.forEach((inst) => inst.destroy()));

    // Initial state after scripts load.
    syncCanvases();

})();

