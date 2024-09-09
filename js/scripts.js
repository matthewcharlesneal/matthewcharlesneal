document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.getElementById('imageContainer');
    const imagesElements = imageContainer.querySelectorAll('.image');
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;

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

    function nextImage() {
        if (currentIndex < imagesElements.length - 1) {
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
            if (event.deltaY > 0 && currentIndex < imagesElements.length - 1) {
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

        if (touchDelta > 20 && currentIndex < imagesElements.length - 1) {
            nextImage();
        } else if (touchDelta < -20 && currentIndex > 0) {
            previousImage();
        }

        initialTouchPos = null;
    }

    function initializeGallery() {
        currentIndex = 0;
        showImage(currentIndex);
        
        // Ensure the first image is scrolled into view on mobile
        if (window.innerWidth <= 600) {
            setTimeout(() => {
                imagesElements[0].scrollIntoView({ behavior: "auto", block: "start" });
            }, 100);
        }
    }

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    // Initialize the gallery
    initializeGallery();

    // Re-initialize on orientation change or resize
    window.addEventListener('orientationchange', initializeGallery);
    window.addEventListener('resize', initializeGallery);

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

    document.addEventListener('mousemove', function(event) {
        if (event.clientX > 245) {
            scrollingEnabled = true;
            imageContainer.classList.add('scroll-snap');
        } else {
            scrollingEnabled = false;
            imageContainer.classList.remove('scroll-snap');
        }
    });
});
