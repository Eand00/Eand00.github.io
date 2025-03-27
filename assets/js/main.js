document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const navHamburger = document.getElementById('navHamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Toggle menu when hamburger is clicked
    if (navHamburger && navMenu) {
        navHamburger.addEventListener('click', function() {
            navMenu.classList.toggle('show');
            // Optional: Toggle a class on the hamburger for visual change
            navHamburger.classList.toggle('active');
        });
    }
    
    // Close menu when clicking a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            navHamburger.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !navHamburger.contains(event.target) && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navHamburger.classList.remove('active');
        }
    });
    
    //Close menu when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            navHamburger.classList.remove('active');
        }
    });
});
// Add to your JS (after the carousel HTML in your document)
const carousel = document.querySelector('.photo-carousel');
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');

let currentIndex = 0;

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

nextButton.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

prevButton.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

// Initialize carousel
updateCarousel();