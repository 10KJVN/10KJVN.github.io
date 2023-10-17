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

// JavaScript for the project slider
const projectSlider = document.querySelector('.project-slider');
const projects = document.querySelectorAll('.project');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let projectIndex = 0;

function showProject(index) {
  projects.forEach((project, i) => {
    project.style.transform = `translateX(-${100 * (i - index)}%)`;
  });
}

prevBtn.addEventListener('click', () => {
  projectIndex = Math.max(0, projectIndex - 1);
  showProject(projectIndex);
});

nextBtn.addEventListener('click', () => {
  projectIndex = Math.min(projects.length - 1, projectIndex + 1);
  showProject(projectIndex);
});

// Show the first project initially
showProject(projectIndex);
