document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;

    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        const targetImage = images[index];
        targetImage.scrollIntoView({ behavior: "smooth", block: "start" });

        setTimeout(() => {
            isTransitioning = false;
        }, 1250);
    }

    function handleMobileScroll(index) {
        if (window.innerWidth <= 600) {
            currentIndex = index;
            showImage(currentIndex);
        }
    }

    // Handle mobile touch events
    let initialTouchPos = null;

    function handleTouchStart(event) {
        if (window.innerWidth <= 600) {
            initialTouchPos = event.touches[0].clientY;
        }
    }

    function handleTouchMove(event) {
        if (window.innerWidth <= 600) {
            if (isTransitioning || initialTouchPos === null) return;

            const currentTouchPos = event.touches[0].clientY;
            const touchDelta = initialTouchPos - currentTouchPos;

            if (touchDelta > 20 && currentIndex < images.length - 1) {
                currentIndex++;
                showImage(currentIndex);
            } else if (touchDelta < -20 && currentIndex > 0) {
                currentIndex--;
                showImage(currentIndex);
            }

            initialTouchPos = null;
        }
    }

    function initializeGallery() {
        Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => img.addEventListener('load', resolve));
        })).then(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                images[0].scrollIntoView({ behavior: "auto", block: "start" });
            });
        });
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && window.innerWidth <= 600) {
                const index = images.indexOf(entry.target);
                if (index !== -1) {
                    currentIndex = index;
                }
            }
        });
    }

    // Set up intersection observer for mobile
    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.5
    });

    images.forEach(image => {
        observer.observe(image);
    });

    // Event Listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
            if (window.innerWidth <= 600) {
                showImage(currentIndex);
            }
        }, 100);
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

    // Initialize the gallery
    initializeGallery();
});
