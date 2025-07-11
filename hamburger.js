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