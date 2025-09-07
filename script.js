let currentSlide = 0;
const slides = document.querySelectorAll('.slide-content');

function showSlide(n) {
    slides.forEach(s => s.style.display = 'none');
    if (n >= slides.length) currentSlide = 0;
    else if (n < 0) currentSlide = slides.length - 1;
    else currentSlide = n;
    slides[currentSlide].style.display = 'flex';
}

function prevSlide() { showSlide(currentSlide - 1); }
function nextSlide() { showSlide(currentSlide + 1); }

function autoSlide() { nextSlide(); }

const SLIDE_MS = 5000;
let slideInterval = setInterval(autoSlide, SLIDE_MS);

function pauseSlider() {
    clearInterval(slideInterval);
    slideInterval = null;
}
function resumeSlider() {
    if (!slideInterval) slideInterval = setInterval(autoSlide, SLIDE_MS);
}

// Fix: bind to ALL containers (or the wrapper if present)
const sliderWrapper = document.getElementById('highlightSlider');
if (sliderWrapper) {
    sliderWrapper.addEventListener('mouseenter', pauseSlider);
    sliderWrapper.addEventListener('mouseleave', resumeSlider);
} else {
    document.querySelectorAll('.slider-container').forEach(el => {
        el.addEventListener('mouseenter', pauseSlider);
        el.addEventListener('mouseleave', resumeSlider);
    });
}

// optional: pause when tab hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseSlider();
    else resumeSlider();
});

showSlide(0);

// Tabs section on site
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Service1").style.display = "block";
    document.getElementById("Service2").style.display = "none";
    document.getElementById("Service3").style.display = "none";
    document.getElementById("Service4").style.display = "none";
});

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
