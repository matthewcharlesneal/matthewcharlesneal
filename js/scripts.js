document.addEventListener('DOMContentLoaded', () => {
    const images = Array.from(document.querySelectorAll('.image')).map(img => img.dataset.src);
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = false;
    let isScrollLocked = false;

    const imageContainer = document.querySelector('.image-container');
    const imagesElements = imageContainer.querySelectorAll('.image');
    const loadingScreen = document.querySelector('.loading-screen');

    function preloadImages(images) {
        const promises = images.map(src => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = src;
            });
        });

        return Promise.all(promises);
    }

    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        imagesElements[index].scrollIntoView({ behavior: "smooth", block: "start" });

        setTimeout(() => {
            isTransitioning = false;
        }, 1000);
    }

    function nextImage() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    }

    function previousImage() {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        } else {
            isTransitioning = false;
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedHandleScroll = debounce((event) => {
        if (scrollingEnabled && !isTransitioning && !isScrollLocked) {
            isScrollLocked = true;
            if (event.deltaY > 0) {
                nextImage();
            } else if (event.deltaY < 0) {
                previousImage();
            }
            setTimeout(() => { isScrollLocked = false; }, 1000);
        }
    }, 50);

    window.addEventListener('wheel', debouncedHandleScroll);

    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        touchEndY = event.touches[0].clientY;
    }

    function handleTouchEnd() {
        if (isTransitioning || !scrollingEnabled) return;

        const touchDelta = touchStartY - touchEndY;

        if (touchDelta > 50) {
            nextImage();
        } else if (touchDelta < -50) {
            previousImage();
        }

        touchStartY = 0;
        touchEndY = 0;
    }

    imageContainer.addEventListener('touchstart', handleTouchStart, false);
    imageContainer.addEventListener('touchmove', handleTouchMove, false);
    imageContainer.addEventListener('touchend', handleTouchEnd, false);

    // Mobile menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const menuList = document.getElementById('menuList');
    const closeMenu = document.getElementById('closeMenu');

    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('show');
        closeMenu.classList.toggle('show');
    });

    closeMenu.addEventListener('click', () => {
        menuList.classList.remove('show');
        closeMenu.classList.remove('show');
    });

    // Enable or disable scrolling based on cursor position
    document.addEventListener('mousemove', function(event) {
        if (event.clientX > 245) {
            scrollingEnabled = true;
            imageContainer.classList.add('scroll-snap');
        } else {
            scrollingEnabled = false;
            imageContainer.classList.remove('scroll-snap');
        }
    });

    // Preload images and initialize the gallery
    preloadImages(images).then(() => {
        loadingScreen.style.display = 'none';
        imagesElements.forEach((img, index) => {
            img.style.backgroundImage = `url('${images[index]}')`;
        });
        showImage(0);
        scrollingEnabled = true;
    }).catch(error => {
        console.error('Error loading images:', error);
    });

    // Ensure we start with the first image (image10)
    window.scrollTo(0, 0);
});
