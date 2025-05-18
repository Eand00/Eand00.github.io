/**
 * Main JavaScript file for Caffè Duca website.
 * Handles mobile navigation, GSAP animations, sliders, and lightbox functionality.
 */

gsap.registerPlugin(ScrollTrigger); // Register GSAP ScrollTrigger plugin globally

/**
 * Initializes the mobile navigation menu (hamburger button and slide-in menu).
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    const navLinks = mobileMenu ? mobileMenu.querySelectorAll('nav a') : []; // Get links inside the mobile menu's nav

    if (!hamburger || !mobileMenu) {
        // console.warn('Mobile menu elements (hamburger or mobile-menu) not found.');
        return;
    }

    let isOpen = false;

    function closeMenu() {
        isOpen = false;
        hamburger.classList.remove('active');
        gsap.to(mobileMenu, { x: '100%', duration: 0.3, ease: "power3.in" });
        body.classList.remove('overflow-hidden');
    }

    function openMenu() {
        isOpen = true;
        hamburger.classList.add('active');
        gsap.to(mobileMenu, { x: 0, duration: 0.3, ease: "power3.out" });
        body.classList.add('overflow-hidden');
    }

    hamburger.addEventListener('click', () => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Smooth scroll to section if the link is an anchor, then close menu
            // (Assuming your links like #specialita are for same-page scrolling)
            // If they were external links, you might not always want to close.
            closeMenu();
        });
    });
}

/**
 * Initializes the scrolling logo animation using GSAP and ScrollTrigger.
 * The logo starts in the center and animates to the top-left corner on scroll.
 */
function initScrollingLogoAnimation() {
    const movingLogoContainer = document.getElementById('moving-logo-container');
    const navLogoImg = document.getElementById('nav-logo-img'); // The placeholder image in the nav

    if (!movingLogoContainer || !navLogoImg || typeof gsap === 'undefined') {
        // console.warn('Elements for logo animation not found or GSAP is not loaded.');
        return;
    }

    const finalWidth = 88; // px
    const finalTop = 16;   // px, from top of viewport
    const finalLeftMobile = 24; // px, from left for mobile (matches px-6)
    const finalLeftDesktop = 32; // px, from left for desktop (matches lg:px-8)

    // Initial state: Moving logo is visible, placeholder in nav is hidden.
    gsap.set(movingLogoContainer, { autoAlpha: 1 });
    gsap.set(navLogoImg, { autoAlpha: 0 });

    ScrollTrigger.matchMedia({
        // Small screens (up to 1023px)
        "(max-width: 1023px)": function() {
            gsap.to(movingLogoContainer, {
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "+=300", // Animation duration in scroll pixels
                    scrub: 1,    // Smooth scrubbing
                    onEnter: () => gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 }),
                    onLeave: () => gsap.to(navLogoImg, { autoAlpha: 1, duration: 0.2 }), // Show placeholder when animation ends
                    onEnterBack: () => gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 }),
                    onLeaveBack: () => gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 }) // Keep placeholder hidden if scrolling back to very top
                },
                top: finalTop,
                left: finalLeftMobile,
                width: finalWidth,
                transform: "translate(0%, 0%)", // Target transform
                ease: "power1.inOut"
            });
        },
        // Large screens (1024px and up)
        "(min-width: 1024px)": function() {
            gsap.to(movingLogoContainer, {
                scrollTrigger: {
                    trigger: "#hero",
                    start: "top top",
                    end: "+=400",
                    scrub: 1,
                    // markers: true, // For debugging ScrollTrigger
                    onEnter: () => gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 }),
                    onLeave: () => gsap.to(navLogoImg, { autoAlpha: 1, duration: 0.2 }),
                    onEnterBack: () => gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 }),
                    onLeaveBack: () => gsap.to(navLogoImg, { autoAlpha: 0, duration: 0.2 })
                },
                top: finalTop,
                left: finalLeftDesktop,
                width: finalWidth,
                transform: "translate(0%, 0%)",
                ease: "power1.inOut"
            });
        }
    });
    // After scroll animation completes (onLeave), the movingLogoContainer itself is not explicitly hidden by GSAP here.
    // Its visual role is taken over by navLogoImg becoming visible.
    // If you want movingLogoContainer to also hide, add it to onLeave:
    // onLeave: () => {
    //     gsap.to(navLogoImg, { autoAlpha: 1, duration: 0.2 });
    //     gsap.to(movingLogoContainer, { autoAlpha: 0, duration: 0.2 }); // Hide moving logo
    // },
    // And correspondingly for onEnterBack. For now, keeping it simpler as per original.
}


/**
 * Initializes a generic slider component.
 * @param {string} containerId - The ID of the main slider flex container.
 * @param {string} slideSelector - The CSS selector for individual slide elements within the container.
 * @param {string} dotsId - The ID of the container for navigation dots.
 * @param {number} [autoSlideDelay=5000] - Delay in milliseconds for auto-sliding. Set to 0 or less to disable.
 */
function initializeSlider(containerId, slideSelector, dotsId, autoSlideDelay = 5000) {
    const sliderContainer = document.getElementById(containerId);
    const slides = sliderContainer ? sliderContainer.querySelectorAll(slideSelector) : [];
    const dotsWrapper = document.getElementById(dotsId);

    if (!sliderContainer || !dotsWrapper || slides.length === 0) {
        // console.warn(`Slider elements not found for: ${containerId}. Required: container, dots wrapper, and slides.`);
        return;
    }

    let currentSlideIndex = 0;
    const totalSlides = slides.length;
    const slideElementWidth = 100; // Assumes slides are min-w-full, so 100%
    let autoSlideInterval = null;
    let touchStartX, touchMoveX;
    let isDragging = false;

    // --- Create Dots ---
    dotsWrapper.innerHTML = ''; // Clear any pre-existing dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.className = 'w-3 h-3 bg-white rounded-full opacity-50 transition-opacity duration-300 focus:outline-none';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('opacity-100');
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoPlay();
        });
        dotsWrapper.appendChild(dot);
    }
    const navigationDots = dotsWrapper.querySelectorAll('button');

    /** Updates the slider's visual state (transform and active dot). */
    function updateSliderDisplay() {
        sliderContainer.style.transform = `translateX(-${currentSlideIndex * slideElementWidth}%)`;
        navigationDots.forEach((dot, index) => {
            dot.classList.toggle('opacity-100', index === currentSlideIndex);
            dot.classList.toggle('opacity-50', index !== currentSlideIndex);
        });
    }

    /**
     * Navigates to a specific slide.
     * @param {number} slideIndex - The index of the slide to navigate to.
     */
    function goToSlide(slideIndex) {
        currentSlideIndex = (slideIndex + totalSlides) % totalSlides; // Handles negative and overflow
        updateSliderDisplay();
    }

    /** Starts the auto-play functionality. */
    function startAutoPlay() {
        if (autoSlideDelay <= 0 || totalSlides <= 1) return; // No autoplay if disabled or single slide
        if (autoSlideInterval) clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            goToSlide(currentSlideIndex + 1);
        }, autoSlideDelay);
    }

    /** Stops the auto-play functionality. */
    function stopAutoPlay() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }

    /** Resets the auto-play timer. */
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // --- Event Handlers ---
    function handleTouchStart(e) {
        if (totalSlides <= 1) return;
        touchStartX = e.touches[0].clientX;
        stopAutoPlay();
    }

    function handleTouchMove(e) {
        if (totalSlides <= 1 || !touchStartX) return;
        touchMoveX = e.touches[0].clientX;
        const diff = touchMoveX - touchStartX;
        // Allow dragging preview, but transformation is handled on touchend
        sliderContainer.style.transform = `translateX(calc(-${currentSlideIndex * slideElementWidth}% + ${diff}px))`;
    }

    function handleTouchEnd() {
        if (totalSlides <= 1 || !touchStartX || !touchMoveX) {
            if (totalSlides > 1) startAutoPlay(); // Restart if it was stopped
            return;
        }
        const diff = touchMoveX - touchStartX;
        const threshold = sliderContainer.offsetWidth * 0.15; // 15% of slider width

        if (Math.abs(diff) > threshold) {
            goToSlide(currentSlideIndex + (diff < 0 ? 1 : -1));
        } else {
            updateSliderDisplay(); // Snap back
        }
        touchStartX = null;
        touchMoveX = null;
        startAutoPlay();
    }

    function handleMouseDown(e) {
        if (totalSlides <= 1) return;
        e.preventDefault();
        isDragging = true;
        touchStartX = e.clientX;
        sliderContainer.style.cursor = 'grabbing';
        stopAutoPlay();
    }

    function handleMouseMove(e) {
        if (totalSlides <= 1 || !isDragging) return;
        touchMoveX = e.clientX;
        const diff = touchMoveX - touchStartX;
        sliderContainer.style.transform = `translateX(calc(-${currentSlideIndex * slideElementWidth}% + ${diff}px))`;
    }

    function handleMouseUpOrLeave() { // Combined mouseup and mouseleave for document
        if (totalSlides <= 1 || !isDragging) return;

        if (touchStartX && touchMoveX) {
            const diff = touchMoveX - touchStartX;
            const threshold = sliderContainer.offsetWidth * 0.15;
            if (Math.abs(diff) > threshold) {
                goToSlide(currentSlideIndex + (diff < 0 ? 1 : -1));
            } else {
                updateSliderDisplay(); // Snap back
            }
        } else {
             updateSliderDisplay(); // Snap back if only a click without drag
        }

        isDragging = false;
        touchStartX = null;
        touchMoveX = null;
        sliderContainer.style.cursor = 'grab';
        startAutoPlay();
    }

    // Attach event listeners
    sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    sliderContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    sliderContainer.addEventListener('touchend', handleTouchEnd);

    sliderContainer.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove); // Listen on document
    document.addEventListener('mouseup', handleMouseUpOrLeave);   // Listen on document
    // sliderContainer.addEventListener('mouseleave', handleMouseUpOrLeave); // if mouse leaves slider while dragging

    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', () => { if (!isDragging) startAutoPlay(); });
    sliderContainer.addEventListener('contextmenu', e => { if (isDragging) e.preventDefault(); });


    // --- Initialisation ---
    if (totalSlides > 0) {
        sliderContainer.style.cursor = 'grab';
        updateSliderDisplay();
        startAutoPlay();
    }
}

/**
 * Initializes a simple lightbox for gallery images.
 */
function initLightbox() {
    const lightboxElement = document.getElementById('lightbox');
    const lightboxImageElement = document.getElementById('lightbox-image');
    const closeButton = document.getElementById('lightbox-close');
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');
    const pageBody = document.body;

    // Target thumbnails specifically within #main-photo-gallery
    const thumbnailElements = document.querySelectorAll('#main-photo-gallery .gallery-thumbnail');
    
    if (!lightboxElement || !lightboxImageElement || !closeButton || !prevButton || !nextButton || thumbnailElements.length === 0) {
        // console.warn('Lightbox elements or gallery thumbnails not found.');
        return;
    }

    const imageSources = Array.from(thumbnailElements).map(thumb => thumb.dataset.lightboxSrc || thumb.src);
    let currentImageIndex = 0;

    /**
     * Opens the lightbox with the specified image.
     * @param {number} index - The index of the image to display.
     */
    function openImage(index) {
        currentImageIndex = index;
        lightboxImageElement.src = imageSources[currentImageIndex];
        lightboxElement.classList.remove('hidden', 'opacity-0');
        lightboxElement.classList.add('flex'); // Or 'block' if you prefer
        setTimeout(() => lightboxElement.classList.add('opacity-100'), 10); // For fade-in
        pageBody.classList.add('overflow-hidden');
        updateNavigationButtons();
    }

    /** Closes the lightbox. */
    function closeImage() {
        lightboxElement.classList.remove('opacity-100');
        lightboxElement.classList.add('opacity-0');
        setTimeout(() => {
            lightboxElement.classList.add('hidden');
            lightboxElement.classList.remove('flex');
            lightboxImageElement.src = ""; // Clear src for performance/safety
        }, 300); // Match CSS transition duration
        pageBody.classList.remove('overflow-hidden');
    }

    /** Shows the previous image in the lightbox. */
    function showPreviousImage() {
        openImage((currentImageIndex - 1 + imageSources.length) % imageSources.length);
    }

    /** Shows the next image in the lightbox. */
    function showNextImage() {
        openImage((currentImageIndex + 1) % imageSources.length);
    }

    /** Updates the visibility of prev/next navigation buttons. */
    function updateNavigationButtons() {
        const showNav = imageSources.length > 1;
        prevButton.classList.toggle('hidden', !showNav);
        nextButton.classList.toggle('hidden', !showNav);
    }

    // Add click listeners to thumbnails
    thumbnailElements.forEach((thumb, index) => {
        thumb.addEventListener('click', () => openImage(index));
    });

    // Add listeners for lightbox controls
    closeButton.addEventListener('click', closeImage);
    prevButton.addEventListener('click', showPreviousImage);
    nextButton.addEventListener('click', showNextImage);

    // Close lightbox on overlay click
    lightboxElement.addEventListener('click', (e) => {
        if (e.target === lightboxElement) { // Clicked on the backdrop itself
            closeImage();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightboxElement.classList.contains('hidden')) return; // Lightbox not visible

        if (e.key === 'Escape') closeImage();
        if (imageSources.length > 1) {
            if (e.key === 'ArrowLeft') showPreviousImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
}


// --- Main Event Listener for DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initScrollingLogoAnimation();

    // Initialize sliders
    initializeSlider('gallery-container', '.gallery-slide', 'gallery-dots', 5000);
    initializeSlider('about-cards-container', '.about-card-slide', 'about-cards-dots', 7000);

    // Initialize lightbox
    initLightbox();
});