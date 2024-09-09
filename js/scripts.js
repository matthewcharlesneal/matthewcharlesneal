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
    const imageContainer = document.getElementById('imageContainer');
    const loadingScreen = document.querySelector('.loading-screen');

    // Preload images
    function preloadImages() {
        const imagePromises = images.map(image => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = reject;
                img.src = image.src;
            });
        });

        return Promise.all(imagePromises);
    }

    // Create image elements
    function createImageElements() {
        images.forEach((image, index) => {
            const div = document.createElement('div');
            div.className = `image ${image.orientation}`;
            div.style.backgroundImage = `url('${image.src}')`;
            imageContainer.appendChild(div);
        });
    }

    // Show image
    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        const imageElements = imageContainer.querySelectorAll('.image');
        imageElements.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                img.classList.remove('inactive');
            } else {
                img.classList.remove('active');
                img.classList.add('inactive');
            }
        });

        imageElements[index].scrollIntoView({ behavior: "smooth", block: "start" });

        setTimeout(() => {
            isTransitioning = false;
        }, 1250);
    }

    // Next image
    function nextImage() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    }

    // Previous image
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

    // Handle scroll
    const handleScroll = debounce((event) => {
        if (!isTransitioning) {
            if (event.deltaY > 0) {
                nextImage();
            } else if (event.deltaY < 0) {
                previousImage();
            }
        }
    }, 200);

    // Handle touch
    let touchStartY = 0;
    let touchEndY = 0;

    function handleTouchStart(event) {
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchEnd(event) {
        touchEndY = event.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                previousImage();
            }
        }
    }

    // Initialize gallery
    preloadImages().then(() => {
        createImageElements();
        showImage(currentIndex);
        loadingScreen.style.display = 'none';

        // Event listeners
        window.addEventListener('wheel', handleScroll, { passive: true });
        imageContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        imageContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const menuList = document.getElementById('menuList');

    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('show');
    });
});
