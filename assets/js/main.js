const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('overlay');
const body = document.body;
const navLinks = document.querySelectorAll('#mobile-menu a'); // Select all links in the mobile menu

if (typeof gsap !== 'undefined') {
    let isOpen = false; // Track the menu state

    function closeMobileMenu() {
        isOpen = false;
        hamburger.classList.remove('active');
        gsap.to(mobileMenu, { x: '100%', duration: 0.3, ease: "power3.in" });
        menuOverlay.classList.add('hidden');
        body.classList.remove('overflow-hidden');
    }

    hamburger.addEventListener('click', () => {
        isOpen = !isOpen;

        if (isOpen) {
            hamburger.classList.add('active');
            gsap.to(mobileMenu, { x: 0, duration: 0.3, ease: "power3.out" });
            menuOverlay.classList.remove('hidden');
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

    // Close the mobile menu when clicking outside the menu (on the overlay)
    menuOverlay.addEventListener('click', () => {
        closeMobileMenu();
    });
} else {
    console.error("GSAP is not loaded. Animations will not work.");
}

document.addEventListener('DOMContentLoaded', function() {
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
    }, {passive: true});
    
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
    }, {passive: true});
    
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
    }, {passive: true});
    
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