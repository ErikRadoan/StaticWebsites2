/* ============================================================
   PRESENTATION.JS — Slide engine
   Secure-Inf presentation
   ============================================================ */

(function () {
    'use strict';

    const slides       = Array.from(document.querySelectorAll('.slide'));
    const progressFill = document.getElementById('progress-fill');
    const currentEl    = document.getElementById('current-slide');
    const totalEl      = document.getElementById('total-slides');

    const TOTAL = slides.length;
    let current = 0;

    totalEl.textContent = TOTAL;
    readHash();
    activate(current);

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    });

    // Touch
    let touchStartX = 0, touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? next() : prev();
        }
    }, { passive: true });

    window.addEventListener('hashchange', () => { readHash(); activate(current); });

    function next() { if (current < TOTAL - 1) { current++; activate(current); writeHash(); } }
    function prev() { if (current > 0)         { current--; activate(current); writeHash(); } }

    function activate(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        currentEl.textContent = index + 1;
        const pct = (index / (TOTAL - 1)) * 100;
        progressFill.style.width = pct + '%';

        // Allow heavy visual modules to run only on the active slide.
        document.dispatchEvent(new CustomEvent('slidechange', {
            detail: { index, slide: slides[index] }
        }));
    }

    function readHash() {
        const match = location.hash.match(/slide=(\d+)/);
        if (match) {
            const n = parseInt(match[1], 10) - 1;
            if (n >= 0 && n < TOTAL) current = n;
        }
    }

    function writeHash() {
        history.replaceState(null, '', '#slide=' + (current + 1));
    }

})();

