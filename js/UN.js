document.addEventListener('DOMContentLoaded', () => {
    const images = [
        { src: 'images/UN_1.jpg', orientation: 'landscape' },
        { src: 'images/UN_2.jpg', orientation: 'landscape' },
        { src: 'images/UN_3.jpg', orientation: 'landscape' },
        { src: 'images/UN_4.jpg', orientation: 'landscape' },
        { src: 'images/UN_5.jpg', orientation: 'landscape' },
        { src: 'images/UN_6.jpg', orientation: 'landscape' },
        { src: 'images/UN_7.jpg', orientation: 'landscape' },
        { src: 'images/UN_8.jpg', orientation: 'landscape' },
        { src: 'images/UN_9.jpg', orientation: 'landscape' },
        { src: 'images/UN_10.jpg', orientation: 'landscape' },
        { src: 'images/UN_11.jpg', orientation: 'landscape' },
        { src: 'images/UN_12.jpg', orientation: 'landscape' },
        { src: 'images/UN_13.jpg', orientation: 'landscape' },
        { src: 'images/UN_14.jpg', orientation: 'landscape' },
        { src: 'images/UN_15.jpg', orientation: 'landscape' },
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

        requestAnimationFrame(() => {
            imagesElements[index].scrollIntoView({ behavior: "smooth", block: "start" });
        });
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
        
        Promise.all(Array.from(imagesElements).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => img.addEventListener('load', resolve));
        })).then(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                imagesElements[0].scrollIntoView({ behavior: "auto", block: "start" });
            });
        });
    }

    function forceStartAtFirstImage() {
        currentIndex = 0;
        showImage(currentIndex);
        window.scrollTo(0, 0);
        imagesElements[0].scrollIntoView({ behavior: "auto", block: "start" });
    }

    // Event Listeners
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, 0);
            showImage(currentIndex);
        }, 100);
    });

    window.addEventListener('resize', forceStartAtFirstImage);

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

    // Force start at image10 (index 0) on page load
    forceStartAtFirstImage();
});
