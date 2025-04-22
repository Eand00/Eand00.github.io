gsap.registerPlugin(ScrollTrigger);

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const body = document.body;
const navLinks = document.querySelectorAll('#mobile-menu a');

let isOpen = false;

function closeMobileMenu() {
    isOpen = false;
    hamburger.classList.remove('active');
    gsap.to(mobileMenu, { x: '100%', duration: 0.3, ease: "power3.in" });
    body.classList.remove('overflow-hidden');
}

hamburger.addEventListener('click', () => {
    isOpen = !isOpen;

    if (isOpen) {
        hamburger.classList.add('active');
        gsap.to(mobileMenu, { x: 0, duration: 0.3, ease: "power3.out" });
        body.classList.add('overflow-hidden');
    } else {
        closeMobileMenu(); // Close menu if already open
    }
});

// Close the mobile menu when clicking on a navigation link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMobileMenu();
    });
});

// --- Scrolling Logo Animation ---
const movingLogoContainer = document.getElementById('moving-logo-container');
const navLogoPlaceholder = document.getElementById('nav-logo-placeholder'); // The <a> tag
const navLogoImg = document.getElementById('nav-logo-img');           // The <img> inside the placeholder
const mainNav = document.getElementById('main-nav');                 // The main nav element

if (movingLogoContainer && navLogoPlaceholder && navLogoImg && mainNav && typeof gsap !== 'undefined') {

    // --- Configuration ---
    const finalWidth = 88; 
    const finalTop = 16; // px
    const finalLeft = 24; // px (start with mobile padding)
    const finalLeftLarge = 32; // px (for lg screens)

    // Use matchMedia for responsive final positions
    ScrollTrigger.matchMedia({
        // Small screens
        "(max-width: 1023px)": function() {
            gsap.to(movingLogoContainer, {
                scrollTrigger: {
                    trigger: "#hero", // Start animation when hero section starts
                    start: "top top", // When the top of hero hits the top of viewport
                    end: "+=950", // Animate over 300px of scroll
                    scrub: 1, // Smooth scrubbing (takes 1 second to catch up)
                    onEnter: () => { // Scrolling down past start
                        gsap.to(movingLogoContainer, { autoAlpha: 1, duration: 0.2 }); // Make sure moving logo is visible
                        gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 }); // Make sure placeholder is hidden
                    },
                    onLeave: () => { // Scrolling down past end
                        gsap.to(movingLogoContainer, { autoAlpha: 0, duration: 0.2 }); // Hide moving logo
                        gsap.to(navLogoImg, { autoAlpha: 1, duration: 0.2 }); // Show placeholder
                    },
                    onEnterBack: () => { // Scrolling up past end
                        gsap.to(movingLogoContainer, { autoAlpha: 1, duration: 0.2 }); // Show moving logo
                        gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 }); // Hide placeholder
                    },
                    onLeaveBack: () => { // Scrolling up past start
                         gsap.to(movingLogoContainer, { autoAlpha: 1, duration: 0.2 });
                         gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 });
                    }
                },
                top: finalTop,
                left: finalLeft,
                width: finalWidth,
                transform: "translate(0%, 0%)", // Animate transform from -50%/-50% to 0%/0%
                ease: "power1.inOut"
            });
        },

        // Large screens (lg breakpoint in Tailwind is 1024px)
        "(min-width: 1024px)": function() {
            gsap.to(movingLogoContainer, {
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "+=400", // Maybe slightly longer animation on desktop
                    scrub: 1,
                    // markers: true, // Uncomment for debugging
                     onEnter: () => {
                        gsap.to(movingLogoContainer, { autoAlpha: 1, duration: 0.2 });
                        gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 });
                    },
                    onLeave: () => {
                        gsap.to(movingLogoContainer, { autoAlpha: 0, duration: 0.2 });
                        gsap.to(navLogoImg, { autoAlpha: 1, duration: 0.2 });
                    },
                    onEnterBack: () => {
                        gsap.to(movingLogoContainer, { autoAlpha: 1, duration: 0.2 });
                        gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 });
                    },
                    onLeaveBack: () => {
                         gsap.to(movingLogoContainer, { autoAlpha: 1, duration: 0.2 });
                         gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 });
                    }
                },
                top: finalTop,
                left: finalLeftLarge, // Use the large screen left padding
                width: finalWidth,
                transform: "translate(0%, 0%)",
                ease: "power1.inOut"
            });
        }
    });

     // Initial setup: Make sure moving logo is visible and placeholder is hidden on load
     gsap.set(movingLogoContainer, { autoAlpha: 1 });
     gsap.set(navLogoImg, { autoAlpha: 0 });


} else {
    console.error("One or more elements for logo animation not found, or GSAP is not loaded.");
}



document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.getElementById('gallery-container');
    const slides = document.querySelectorAll('.gallery-slide');
    const dotsContainer = document.getElementById('gallery-dots');

    if (!galleryContainer || !dotsContainer || slides.length === 0) return;

    let currentSlide = 0;
    let slideWidth = 100; // 100% of container width
    let autoSlideInterval = null;
    const autoSlideDelay = 5000; // 5 seconds
    let startX, moveX;
    let isDragging = false;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('w-3', 'h-3', 'bg-white', 'rounded-full', 'opacity-50');
        if (index === 0) dot.classList.add('opacity-100');

        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });

        dotsContainer.appendChild(dot);
    });

    // Update gallery position and active dot
    function updateGallery() {
        // Update transform to show current slide
        galleryContainer.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

        // Update active dot
        const dots = dotsContainer.querySelectorAll('button');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('opacity-100');
                dot.classList.remove('opacity-50');
            } else {
                dot.classList.add('opacity-50');
                dot.classList.remove('opacity-100');
            }
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentSlide = index;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        updateGallery();
    }

    // Start auto sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            goToSlide(currentSlide + 1);
        }, autoSlideDelay);
    }

    // Reset auto slide timer
    function resetAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
    }

    // Touch events (for mobile)
    galleryContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoSlide();
    }, { passive: true });

    galleryContainer.addEventListener('touchmove', (e) => {
        if (!startX) return;

        moveX = e.touches[0].clientX;
        const diff = moveX - startX;

        // Don't slide too far past the first or last slide
        if ((currentSlide === 0 && diff > 0) ||
            (currentSlide === slides.length - 1 && diff < 0)) {
            return;
        }

        // Create a dragging effect with resistance
        const dragOffset = diff / 2;
        galleryContainer.style.transform = `translateX(calc(-${currentSlide * slideWidth}% + ${dragOffset}px))`;
    }, { passive: true });

    galleryContainer.addEventListener('touchend', () => {
        if (!startX || !moveX) return;

        const diff = moveX - startX;
        const threshold = window.innerWidth * 0.15; // 15% of screen width

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSlide(currentSlide - 1);
            } else {
                goToSlide(currentSlide + 1);
            }
        } else {
            // Return to current slide if swipe wasn't strong enough
            updateGallery();
        }

        // Reset values
        startX = null;
        moveX = null;
        startAutoSlide();
    }, { passive: true });

    // Mouse events (for desktop)
    galleryContainer.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        isDragging = true;
        galleryContainer.style.cursor = 'grabbing';
        stopAutoSlide();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        moveX = e.clientX;
        const diff = moveX - startX;

        // Don't slide too far past the first or last slide
        if ((currentSlide === 0 && diff > 0) ||
            (currentSlide === slides.length - 1 && diff < 0)) {
            return;
        }

        // Create a dragging effect with resistance
        const dragOffset = diff / 2;
        galleryContainer.style.transform = `translateX(calc(-${currentSlide * slideWidth}% + ${dragOffset}px))`;
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;

        if (startX && moveX) {
            const diff = moveX - startX;
            const threshold = window.innerWidth * 0.15; // 15% of screen width

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    goToSlide(currentSlide - 1);
                } else {
                    goToSlide(currentSlide + 1);
                }
            } else {
                // Return to current slide if drag wasn't strong enough
                updateGallery();
            }
        }

        // Reset values
        startX = null;
        moveX = null;
        isDragging = false;
        galleryContainer.style.cursor = 'grab';
        startAutoSlide();
    });

    // Stop auto-sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    // Prevent context menu on right-click during dragging
    galleryContainer.addEventListener('contextmenu', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });

    // Initialize
    galleryContainer.style.cursor = 'grab';
    updateGallery();
    startAutoSlide();

    // Stop auto-sliding when user hovers over the gallery
    galleryContainer.addEventListener('mouseenter', stopAutoSlide);

    // Resume auto-sliding when user leaves the gallery
    galleryContainer.addEventListener('mouseleave', () => {
        if (!isDragging) {
            startAutoSlide();
        }
    });
});