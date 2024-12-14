document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;
    let lastScrollTime = 0;
    const scrollCooldown = 800; // Minimum time between scrolls

    function updateImagePositions() {
        if (window.innerWidth <= 600) return; // Don't apply to mobile

        images.forEach((img, index) => {
            const offset = (index - currentIndex) * 100;
            img.style.transform = `translateY(${offset}vh)`;
            
            // Update active/inactive states
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
        if (window.innerWidth <= 600 || !scrollingEnabled || isTransitioning) return;

        const now = Date.now();
        if (now - lastScrollTime < scrollCooldown) return;

        const direction = e.deltaY > 0 ? 1 : -1;

        if ((direction > 0 && currentIndex < images.length - 1) ||
            (direction < 0 && currentIndex > 0)) {
            
            e.preventDefault();
            isTransitioning = true;
            lastScrollTime = now;
            
            currentIndex = Math.max(0, Math.min(images.length - 1, currentIndex + direction));
            updateImagePositions();

            setTimeout(() => {
                isTransitioning = false;
            }, scrollCooldown);
        }
    }

    // Mobile touch handling remains the same
    let touchStartY = null;
    let touchStartTime = null;

    function handleTouchStart(e) {
        if (window.innerWidth > 600) return;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }

    function handleTouchMove(e) {
        if (window.innerWidth > 600 || !touchStartY || isTransitioning) return;

        const touchY = e.touches[0].clientY;
        const touchDelta = touchStartY - touchY;
        const timeElapsed = Date.now() - touchStartTime;

        if (Math.abs(touchDelta) > 20 && timeElapsed < 300) {
            if (touchDelta > 0 && currentIndex < images.length - 1) {
                currentIndex++;
            } else if (touchDelta < 0 && currentIndex > 0) {
                currentIndex--;
            }

            isTransitioning = true;
            updateImagePositions();
            
            setTimeout(() => {
                isTransitioning = false;
            }, scrollCooldown);

            touchStartY = null;
            touchStartTime = null;
        }
    }

    function initializeGallery() {
        currentIndex = 0;
        updateImagePositions();
    }

    // Event Listeners
    window.addEventListener('wheel', handleDesktopScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', updateImagePositions);

    document.addEventListener('mousemove', (event) => {
        if (window.innerWidth <= 600) return;
        
        scrollingEnabled = event.clientX > 245;
        imageContainer.classList.toggle('scroll-enabled', scrollingEnabled);
    });

    // Menu functionality remains the same
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

    // Initialize
    initializeGallery();
});
