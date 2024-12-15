document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;
    let lastScrollTime = Date.now();
    const TRANSITION_DURATION = 1000; // Duration of transition in milliseconds

    function updateImagePositions() {
        if (window.innerWidth <= 600) return; // Don't apply to mobile

        images.forEach((img, index) => {
            const offset = (index - currentIndex) * 100;
            img.style.transform = `translateY(${offset}vh)`;
            
            if (index === currentIndex) {
                img.classList.add('active');
                img.classList.remove('inactive');
            } else {
                img.classList.remove('active');
                img.classList.add('inactive');
            }
        });
    }

    function handleDesktopScroll(e) {
        // Only proceed if we're on desktop, scrolling is enabled, and not currently transitioning
        if (window.innerWidth <= 600 || !scrollingEnabled || isTransitioning) {
            e.preventDefault();
            return;
        }

        // Get the current time
        const now = Date.now();
        
        // If we're within the transition duration, prevent scroll
        if (now - lastScrollTime < TRANSITION_DURATION) {
            e.preventDefault();
            return;
        }

        // Determine scroll direction, ignoring intensity
        const direction = e.deltaY > 0 ? 1 : -1;

        // Check if we can move in the desired direction
        if ((direction > 0 && currentIndex < images.length - 1) ||
            (direction < 0 && currentIndex > 0)) {
            
            e.preventDefault();
            isTransitioning = true;
            lastScrollTime = now;
            
            // Update index by exactly one
            currentIndex = Math.max(0, Math.min(images.length - 1, currentIndex + direction));
            
            // Update positions
            updateImagePositions();

            // Reset transition state after animation completes
            setTimeout(() => {
                isTransitioning = false;
            }, TRANSITION_DURATION);
        }
    }

    // Mobile touch handling
    let touchStartY = null;

    function handleTouchStart(e) {
        if (window.innerWidth > 600) return;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (window.innerWidth > 600 || !touchStartY || isTransitioning) return;

        const touchY = e.touches[0].clientY;
        const touchDelta = touchStartY - touchY;

        if (Math.abs(touchDelta) > 20) {
            if (touchDelta > 0 && currentIndex < images.length - 1) {
                currentIndex++;
            } else if (touchDelta < 0 && currentIndex > 0) {
                currentIndex--;
            }

            updateImagePositions();
            touchStartY = null;
        }
    }

    // Prevent default on wheel event to avoid any native scrolling
    window.addEventListener('wheel', (e) => {
        if (window.innerWidth > 600) {
            e.preventDefault();
        }
    }, { passive: false });

    // Add event listeners with proper options
    window.addEventListener('wheel', handleDesktopScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', updateImagePositions);

    // Mouse position for enabling/disabling scroll
    document.addEventListener('mousemove', (event) => {
        if (window.innerWidth <= 600) return;
        scrollingEnabled = event.clientX > 245;
    });

    // Menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const menuList = document.getElementById('menuList');
    const closeMenu = document.getElementById('closeMenu');

    menuToggle?.addEventListener('click', () => {
        menuList.classList.toggle('show');
        closeMenu.classList.toggle('show');
    });

    closeMenu?.addEventListener('click', () => {
        menuList.classList.remove('show');
        closeMenu.classList.remove('show');
    });

    // Initialize gallery
    initializeGallery();

    function initializeGallery() {
        currentIndex = 0;
        updateImagePositions();
    }
});
