document.addEventListener('DOMContentLoaded', () => {
    const images = Array.from(document.querySelectorAll('.image'));
    const imageContainer = document.querySelector('.image-container');
    const loadingScreen = document.getElementById('loading-screen');
    let currentIndex = 0;
    let isTransitioning = false;

    // Preload images
    function preloadImages() {
        const imagePromises = images.map(img => {
            return new Promise((resolve, reject) => {
                const imgSrc = img.getAttribute('data-src');
                const image = new Image();
                image.onload = resolve;
                image.onerror = reject;
                image.src = imgSrc;
            });
        });

        return Promise.all(imagePromises);
    }

    // Initialize gallery
    function initGallery() {
        preloadImages().then(() => {
            loadingScreen.style.display = 'none';
            images.forEach(img => {
                img.style.backgroundImage = `url(${img.getAttribute('data-src')})`;
            });
            showImage(currentIndex);
        }).catch(error => {
            console.error('Error loading images:', error);
            loadingScreen.style.display = 'none';
        });
    }

    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                img.classList.remove('inactive');
            } else {
                img.classList.remove('active');
                img.classList.add('inactive');
            }
        });

        images[index].scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
            isTransitioning = false;
        }, 500);
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

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Scroll event handler
    const handleScroll = debounce((event) => {
        if (!isTransitioning) {
            if (event.deltaY > 0 && currentIndex < images.length - 1) {
                nextImage();
            } else if (event.deltaY < 0 && currentIndex > 0) {
                previousImage();
            }
        }
    }, 100);

    // Touch event handlers
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchStartY - touchEndY;

        if (Math.abs(touchDiff) > 50) { // Threshold for swipe
            if (touchDiff > 0 && currentIndex < images.length - 1) {
                nextImage();
            } else if (touchDiff < 0 && currentIndex > 0) {
                previousImage();
            }
        }
    }

    // Event listeners
    window.addEventListener('wheel', handleScroll, { passive: true });
    imageContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    imageContainer.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Menu toggle functionality
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
    initGallery();
});
