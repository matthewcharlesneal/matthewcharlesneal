// Disable automatic scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    const images = [
        { src: 'images/image10.jpg', orientation: 'portrait' },
        { src: 'images/image11.jpg', orientation: 'portrait' },
        { src: 'images/image12.jpg', orientation: 'portrait' },
        { src: 'images/image13.jpg', orientation: 'portrait' },
        { src: 'images/image14.jpg', orientation: 'portrait' },
        { src: 'images/image15.jpg', orientation: 'landscape' },
        { src: 'images/image16.jpg', orientation: 'landscape' },
        { src: 'images/image17.jpg', orientation: 'landscape' },
        { src: 'images/image18.jpg', orientation: 'landscape' },
        { src: 'images/image19.jpg', orientation: 'landscape' },
        { src: 'images/image20.jpg', orientation: 'landscape' }
    ];

    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;

    const imageContainer = document.querySelector('.image-container');
    const imagesElements = imageContainer.querySelectorAll('.image');

    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        imagesElements.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                img.classList.remove('inactive');
            } else {
                img.classList.remove('active');
                img.classList.add('inactive');
            }
        });

        setTimeout(() => {
            isTransitioning = false;
        }, 1250);

        scrollToImage(index);
    }

    function scrollToImage(index) {
        const targetImage = imagesElements[index];
        const targetRect = targetImage.getBoundingClientRect();
        const targetTop = window.pageYOffset + targetRect.top;

        window.scrollTo({
            top: targetTop,
            behavior: 'smooth'
        });

        // Force reflow to ensure scroll completes
        void targetImage.offsetWidth;
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
        }
    }

    function handleScroll(event) {
        if (window.innerWidth > 600 && scrollingEnabled && !isTransitioning) {
            if (event.deltaY > 0 && currentIndex < images.length - 1) {
                nextImage();
            } else if (event.deltaY < 0 && currentIndex > 0) {
                previousImage();
            }
        }
    }

    let initialTouchPos = null;

    function handleTouchStart(event) {
        initialTouchPos = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (isTransitioning || initialTouchPos === null) return;

        const currentTouchPos = event.touches[0].clientY;
        const touchDelta = initialTouchPos - currentTouchPos;

        if (touchDelta > 20 && currentIndex < images.length - 1) {
            nextImage();
        } else if (touchDelta < -20 && currentIndex > 0) {
            previousImage();
        }

        initialTouchPos = null;
    }

    function initializeGallery() {
        currentIndex = 0;
        showImage(currentIndex);
        
        // Ensure all images are loaded before scrolling
        Promise.all(Array.from(imagesElements).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => img.addEventListener('load', resolve));
        })).then(() => {
            forceInitialPosition();
        });
    }

    function forceInitialPosition() {
        // Reset scroll position
        window.scrollTo(0, 0);

        // Force browser to recognize new scroll position
        void document.documentElement.offsetHeight;

        // Scroll to first image
        scrollToImage(0);

        // Additional measures for mobile Safari
        setTimeout(() => {
            window.scrollTo(0, 0);
            scrollToImage(0);
        }, 100);

        // Final check after a longer delay
        setTimeout(() => {
            if (window.pageYOffset !== 0) {
                window.scrollTo(0, 0);
                scrollToImage(0);
            }
        }, 500);
    }

    // Event Listeners
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            // Page is loaded from bfcache
            forceInitialPosition();
        }
    });

    window.addEventListener('load', () => {
        // Ensure correct position after all resources are loaded
        forceInitialPosition();
    });

    window.addEventListener('orientationchange', () => {
        setTimeout(forceInitialPosition, 100);
    });

    window.addEventListener('resize', () => {
        scrollToImage(currentIndex);
    });

    document.addEventListener('mousemove', function(event) {
        if (event.clientX > 245) {
            scrollingEnabled = true;
            imageContainer.classList.add('scroll-snap');
        } else {
            scrollingEnabled = false;
            imageContainer.classList.remove('scroll-snap');
        }
    });

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

    // Initialize the gallery
    initializeGallery();
});
