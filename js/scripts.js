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

        imagesElements.forEach((img, i) => {
            if (i === index) {
                img.style.display = 'block';
            } else {
                img.style.display = 'none';
            }
        });

        setTimeout(() => {
            isTransitioning = false;
        }, 100);

        imagesElements[index].scrollIntoView({ behavior: "auto", block: "start" });
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
        if (window.innerWidth > 600 && scrollingEnabled && !isTransitioning && !isScrollLocked) {
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

    let initialTouchPos = null;

    function handleTouchStart(event) {
        initialTouchPos = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (isTransitioning || initialTouchPos === null || !scrollingEnabled) return;

        const currentTouchPos = event.touches[0].clientY;
        const touchDelta = initialTouchPos - currentTouchPos;

        if (touchDelta > 20) {
            nextImage();
        } else if (touchDelta < -20) {
            previousImage();
        }

        initialTouchPos = null;
    }

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

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
        loadingScreen.textContent = 'Error loading images. Please refresh the page.';
    });

    // Ensure we start with the first image (image10)
    window.scrollTo(0, 0);
});
