document.addEventListener('DOMContentLoaded', () => {
    const images = [
        { src: 'images/image1.jpg', orientation: 'landscape' },
        { src: 'images/image2.jpg', orientation: 'portrait' },
        { src: 'images/image8.jpg', orientation: 'landscape' },
        { src: 'images/image12.jpg', orientation: 'landscape' },
        { src: 'images/image13.jpg', orientation: 'portrait' },
        { src: 'images/image14.jpg', orientation: 'landscape' },
        { src: 'images/image15.jpg', orientation: 'landscape' },
        { src: 'images/image16.jpg', orientation: 'landscape' },
        { src: 'images/image17.jpg', orientation: 'landscape' },
        { src: 'images/image18.jpg', orientation: 'landscape' },
        { src: 'images/image19.jpg', orientation: 'portrait' },
        { src: 'images/image20.jpg', orientation: 'portrait' },
        { src: 'images/image22.jpg', orientation: 'landscape' },
        { src: 'images/image23.jpg', orientation: 'landscape' },
        { src: 'images/image24.jpg', orientation: 'landscape' },
        { src: 'images/image25.jpg', orientation: 'landscape' },
        { src: 'images/image26.jpg', orientation: 'landscape' },
        { src: 'images/image27.jpg', orientation: 'portrait' },
    ];
    let currentIndex = 0;
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;

    const galleryImage = document.getElementById('galleryImage');
    const galleryImageMobile = document.getElementById('galleryImageMobile');

    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Set a temporary image to handle the load event
        const tempImage = new Image();
        tempImage.src = images[index].src;
        tempImage.onload = () => {
            galleryImage.src = images[index].src;
            galleryImageMobile.src = images[index].src;
            galleryImage.style.transform = images[index].orientation === 'portrait' ? 'rotate(0deg)' : 'rotate(0deg)';
            galleryImageMobile.style.transform = images[index].orientation === 'portrait' ? 'rotate(0deg)' : 'rotate(0deg)';

            // Set a timeout to reset the transition flag after the transition duration
            setTimeout(() => {
                isTransitioning = false;
            }, 1250); // Match this timeout with the CSS transition duration (1250ms)
        };
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

    // Keydown functionality for keyboard
    function handleKeydown(event) {
        if (!isTransitioning) {
            if (event.key === 'ArrowRight') {
                nextImage();
            } else if (event.key === 'ArrowLeft') {
                previousImage();
            }
        }
    }

    // Click functionality for advancing images on desktop and mobile
    function handleClick(event) {
        if (!isTransitioning) {
            if (window.innerWidth > 600 || event.type === 'click') {
                if (event.clientX > window.innerWidth / 2) {
                    nextImage();
                } else {
                    previousImage();
                }
            }
        }
    }

    // Touch start event for mobile swipe
    function handleTouchStart(event) {
        touchStartX = event.changedTouches[0].screenX;
    }

    // Touch end event for mobile swipe
    function handleTouchEnd(event) {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        if (!isTransitioning) {
            if (touchEndX < touchStartX) {
                nextImage();
            }
            if (touchEndX > touchStartX) {
                previousImage();
            }
        }
    }

    // Tap functionality for mobile
    function handleTap(event) {
        if (!isTransitioning && window.innerWidth <= 600) {
            if (event.changedTouches[0].clientX > window.innerWidth / 2) {
                nextImage();
            } else {
                previousImage();
            }
        }
    }

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchend', handleTap);

    showImage(currentIndex);

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
