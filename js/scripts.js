document.addEventListener('DOMContentLoaded', () => {
    const images = [
        { src: 'images/image1.jpg', orientation: 'landscape' },
        { src: 'images/image2.jpg', orientation: 'landscape' },
        { src: 'images/image3.jpg', orientation: 'landscape' },
        { src: 'images/image4.jpg', orientation: 'landscape' },
        { src: 'images/image5.jpg', orientation: 'landscape' },
        { src: 'images/image6.jpg', orientation: 'landscape' },
        { src: 'images/image7.jpg', orientation: 'landscape' },
        { src: 'images/image8.jpg', orientation: 'landscape' },
        { src: 'images/image9.jpg', orientation: 'landscape' },
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

    const imageContainer = document.querySelector('.image-container');
    const imagesElements = imageContainer.querySelectorAll('.image');

    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        imagesElements.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                img.classList.remove('inactive');
                // Scroll to the active image
                img.scrollIntoView({ behavior: 'auto', block: 'start' });
            } else {
                img.classList.remove('active');
                img.classList.add('inactive');
            }
        });

        setTimeout(() => {
            isTransitioning = false;
        }, 1250);
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function previousImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
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

        if (Math.abs(touchDelta) > 20) {
            if (touchDelta > 0) {
                nextImage();
            } else {
                previousImage();
            }
            initialTouchPos = null;
        }
    }

    function handleTouchEnd() {
        initialTouchPos = null;
    }

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

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

    // Ensure the first image is shown and scrolled to when the page loads
    currentIndex = 0;
    showImage(currentIndex);
    imageContainer.scrollTop = 0;
    imageContainer.offsetHeight; // Force layout recalculation
});
