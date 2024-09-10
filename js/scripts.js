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

        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
            imagesElements[index].scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    // ... (rest of the functions remain the same: nextImage, previousImage, handleScroll, handleTouchStart, handleTouchMove)

    // Function to initialize the gallery
    function initializeGallery() {
        currentIndex = 0;
        showImage(currentIndex);
        
        // Ensure all images are loaded before scrolling
        Promise.all(Array.from(imagesElements).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => img.addEventListener('load', resolve));
        })).then(() => {
            // Use requestAnimationFrame for smoother initial positioning
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                imagesElements[0].scrollIntoView({ behavior: "auto", block: "start" });
            });
        });
    }

    // Initialize the gallery
    initializeGallery();

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
            showImage(currentIndex);
        }, 100);
    });

    // Force start at image10 (index 0) on page load and resize
    function forceStartAtFirstImage() {
        currentIndex = 0;
        showImage(currentIndex);
        window.scrollTo(0, 0);
        imagesElements[0].scrollIntoView({ behavior: "auto", block: "start" });
    }

    // Call forceStartAtFirstImage on page load
    forceStartAtFirstImage();

    // Also call forceStartAtFirstImage on window resize
    window.addEventListener('resize', forceStartAtFirstImage);
});
