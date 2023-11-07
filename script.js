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

// Call the showSlide function with initial value to display the first slide
showSlide(0);

// Tabs section on site
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Service1").style.display = "block";
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
