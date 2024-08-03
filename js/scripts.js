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

    let currentIndex = 0; // Start with image10 (index 0)
    let isTransitioning = false;

    const imageContainer = document.querySelector('.image-container');
    const imagesElements = imageContainer.querySelectorAll('.image');

    // Preload images
    let imagesLoaded = 0;
    images.forEach((image, index) => {
        const img = new Image();
        img.src = image.src;
        img.onload = () => {
            imagesLoaded++;
            // Once all images are loaded, initialize the slideshow
            if (imagesLoaded === images.length) {
                initializeSlideshow();
            }
        };
    });

    function initializeSlideshow() {
        // Initial display
        showImage(currentIndex);

        window.addEventListener('wheel', handleScroll);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
    }

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
        }, 1250); // Match this timeout with the CSS transition duration (1250ms)

        // Scroll the current image into view
        imagesElements[index].scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function previousImage() {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        } else {
            isTransitioning = false; // Reset flag if no more images to go back
        }
    }

    // Scroll functionality for desktop
    function handleScroll(event) {
        if (window.innerWidth > 600 && !isTransitioning) {
            if (event.deltaY > 0) {
                nextImage();
            } else if (event.deltaY < 0) {
                previousImage();
            }
        }
    }

    // Swipe functionality for mobile
    let initialTouchPos = null;

    function handleTouchStart(event) {
        initialTouchPos = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (isTransitioning || initialTouchPos === null) return;

        const currentTouchPos = event.touches[0].clientY;
        const touchDelta = initialTouchPos - currentTouchPos;

        if (touchDelta > 20) {
            nextImage();
        } else if (touchDelta < -20) {
            previousImage();
        }

        initialTouchPos = null; // Reset the touch position after handling
    }

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
});
