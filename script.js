// script.js
let currentSlide = 0;
const slides = document.querySelectorAll('.slider a');

function showSlide(n) {
    if (n >= slides.length) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = n;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slides[currentSlide].style.display = 'block';
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function autoSlide() {
    nextSlide();
}

let slideInterval = setInterval(autoSlide, 3000); // Change slide every 3 seconds

// Pause the slider when hovering over the slider area
const slider = document.querySelector('.slider');
slider.addEventListener('mouseover', function() {
    clearInterval(slideInterval);
});

// Resume the slider when not hovering
slider.addEventListener('mouseout', function() {
    slideInterval = setInterval(autoSlide, 3000);
});
