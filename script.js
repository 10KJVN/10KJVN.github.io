let currentSlide = 0;
const slides = document.querySelectorAll('.slide-content');

function showSlide(n) {
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    if (n >= slides.length) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = n;
    }
    slides[currentSlide].style.display = 'flex';
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
const sliderContainer = document.querySelector('.slider-container');
sliderContainer.addEventListener('mouseover', function() {
    clearInterval(slideInterval);
});

// Resume the slider when not hovering
sliderContainer.addEventListener('mouseout', function() {
    slideInterval = setInterval(autoSlide, 3000);
});

// Call the showSlide function with initial value to display the first slide
showSlide(0);

// Tabs section on site
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("Service1").style.display = "block";
    document.getElementById("Service2").style.display = "none"; // Hide Service2
    document.getElementById("Service3").style.display = "none"; // Hide Service3
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

// =============================
// Hamburger Menu Toggle
// =============================

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    console.log('Hamburger:', hamburger);
    console.log('Menu:', menu);

    if (hamburger && menu) {
        hamburger.addEventListener('click', function() {
            console.log('Hamburger clicked');
            menu.classList.toggle('show');
            hamburger.classList.toggle('is-active'); // for animation classes like 'hamburger--spin'
        });
    }
});

