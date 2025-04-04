document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo');
    const hero = document.getElementById('hero');
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;

    // --- Hamburger Menu Toggle ---
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

        // Toggle ARIA attributes
        menuToggle.setAttribute('aria-expanded', !isOpen);

        // Toggle class on body to trigger CSS changes
        body.classList.toggle('menu-open');
    });

    // Optional: Close menu when clicking a link inside it
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (body.classList.contains('menu-open')) {
                body.classList.remove('menu-open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Optional: Close menu when clicking outside of it (if needed)
    document.addEventListener('click', (event) => {
        if (body.classList.contains('menu-open') &&
            !mainNav.contains(event.target) &&
            !menuToggle.contains(event.target)) {
            body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Initialize GSAP animation
    if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial logo position (centered in hero)
        gsap.set("#logo", { 
            xPercent: -50, 
            yPercent: -50, 
            top: '50%', 
            left: '50%', 
            position: 'absolute',
            scale: 1
        });
        
        // Create the scroll animation
        gsap.timeline({
            scrollTrigger: {
                trigger: "#hero",
                start: "top top", 
                end: "bottom top", 
                scrub: true,
                pin: false,
                // markers: true, // Uncomment for debugging
                onLeave: () => {
                    logo.classList.add('is-fixed');
                    // Immediately set final position with GSAP to prevent flickering
                    gsap.set("#logo", {
                        scale: 0.6,
                        top: "20px",
                        left: "20px",
                        xPercent: 0,
                        yPercent: 0,
                        position: "fixed" // Explicitly set fixed position
                    });
                },
                onEnterBack: () => {
                    logo.classList.remove('is-fixed');
                    // Reset to the animation control when scrolling back up
                }
            }
        })
        .to("#logo", {
            scale: 0.6,
            x: "0",
            y: "0", 
            top: "20px",
            left: "20px",
            xPercent: 0,
            yPercent: 0,
            duration: 1
        });
    } else {
        console.error("GSAP or ScrollTrigger not loaded");
    }
});