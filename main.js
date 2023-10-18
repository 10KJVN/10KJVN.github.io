// Add a click event listener to the tabs
const tabs = document.querySelectorAll('.tab');
const features = document.querySelectorAll('.feature');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove 'active' class from all tabs and features
        tabs.forEach(t => t.classList.remove('active'));
        features.forEach(f => f.classList.remove('active'));

        // Add 'active' class to the clicked tab and corresponding feature
        const tabNumber = tab.getAttribute('data-tab');
        const feature = document.getElementById(`feature-${tabNumber}`);
        tab.classList.add('active');
        feature.classList.add('active');
    });
});

// JavaScript for the project image slider
const projectContainer = document.querySelector('.project-container');
const projects = document.querySelectorAll('.project');
const prevArrow = document.querySelector('.arrow.prev');
const nextArrow = document.querySelector('.arrow.next');
let projectIndex = 0;

function showProject(index) {
  projectContainer.style.transform = `translateX(-${100 * index}%)`;
}

prevArrow.addEventListener('click', () => {
  projectIndex = (projectIndex - 1 + projects.length) % projects.length; // Loop back to the end if at the beginning
  showProject(projectIndex);
});

nextArrow.addEventListener('click', () => {
  projectIndex = (projectIndex + 1) % projects.length; // Loop back to the beginning if at the end
  showProject(projectIndex);
});

function autoSlide() {
  projectIndex = (projectIndex + 1) % projects.length;
  showProject(projectIndex);
}

// Set an interval for automated sliding (change every 5 seconds)
setInterval(autoSlide, 5000);

// Show the first project initially
showProject(projectIndex);

