document.addEventListener('DOMContentLoaded', () => {
    const prev = document.getElementById('prevSlideBtn');
    const next = document.getElementById('nextSlideBtn');

    if (prev) prev.addEventListener('click', () => { pauseSlider(); prevSlide(); });
    if (next) next.addEventListener('click', () => { pauseSlider(); nextSlide(); });

    // Optional: keyboard arrows
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { pauseSlider(); prevSlide(); }
        if (e.key === 'ArrowRight') { pauseSlider(); nextSlide(); }
    });

    // Optional: basic touch swipe
    const area = document.getElementById('highlightSlider');
    if (area) {
        let startX = 0;
        area.addEventListener('touchstart', e => startX = e.changedTouches[0].clientX, {passive:true});
        area.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) {
                pauseSlider();
                if (dx > 0) prevSlide(); else nextSlide();
            }
        }, {passive:true});
    }
});
