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

        imagesElements[index].scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // ... (keep all other functions unchanged)

    // Modified initializeGallery function
    function initializeGallery() {
        currentIndex = 0;
        
        // Set initial styles
        imageContainer.style.opacity = '0';
        imageContainer.style.transition = 'opacity 0.5s ease-in-out';
        
        // Show all images initially to ensure proper loading
        imagesElements.forEach(img => {
            img.style.display = 'block';
        });

        // Ensure all images are loaded before proceeding
        Promise.all(Array.from(imagesElements).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => img.addEventListener('load', resolve));
        })).then(() => {
            // Reset image visibility
            imagesElements.forEach((img, i) => {
                if (i === currentIndex) {
                    img.classList.add('active');
                    img.classList.remove('inactive');
                } else {
                    img.classList.remove('active');
                    img.classList.add('inactive');
                }
            });

            // Delay the scroll and fade-in
            setTimeout(() => {
                window.scrollTo(0, 0);
                imagesElements[0].scrollIntoView({ behavior: "auto", block: "start" });
                
                // Fade in the image container
                imageContainer.style.opacity = '1';
            }, 300);
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
});
