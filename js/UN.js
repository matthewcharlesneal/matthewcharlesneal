document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 600) return; // Don't apply to mobile

    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;
    const TRANSITION_DURATION = 1500; // 1.5 seconds to match CSS
    let lastScrollTime = Date.now();
    let scrollTimeout;
    
    // Create scroll container
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'scroll-container';
    while (imageContainer.firstChild) {
        scrollContainer.appendChild(imageContainer.firstChild);
    }
    imageContainer.appendChild(scrollContainer);

    function showImage(index) {
        if (isTransitioning) return;
        
        isTransitioning = true;
        clearTimeout(scrollTimeout);

        // Update classes
        images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                img.classList.remove('inactive');
            } else {
                img.classList.remove('active');
                img.classList.add('inactive');
            }
        });

        // Update position
        scrollContainer.style.transform = `translateY(-${index * 100}vh)`;

        // Reset transition state
        scrollTimeout = setTimeout(() => {
            isTransitioning = false;
        }, TRANSITION_DURATION + 100); // Add small buffer
    }

    function handleScroll(event) {
        if (!scrollingEnabled || isTransitioning) {
            event.preventDefault();
            return;
        }

        const now = Date.now();
        if (now - lastScrollTime < TRANSITION_DURATION) {
            event.preventDefault();
            return;
        }

        // Determine scroll direction
        const direction = event.deltaY > 0 ? 1 : -1;

        // Check boundaries
        if ((direction > 0 && currentIndex < images.length - 1) ||
            (direction < 0 && currentIndex > 0)) {
            
            event.preventDefault();
            lastScrollTime = now;

            // Update index by exactly one
            currentIndex = Math.max(0, Math.min(images.length - 1, currentIndex + direction));
            showImage(currentIndex);
        }
    }

    // Prevent any default scroll behavior
    const preventScroll = (e) => {
        if (window.innerWidth > 600) {
            e.preventDefault();
        }
    };

    // Event Listeners
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('wheel', handleScroll, { passive: false });

    // Mouse position for enabling/disabling scroll
    document.addEventListener('mousemove', (event) => {
        if (window.innerWidth <= 600) return;
        scrollingEnabled = event.clientX > 245;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            showImage(currentIndex);
        }
    });

    // Initialize
    images[0].classList.add('active');

    // Keep existing menu functionality
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
});
