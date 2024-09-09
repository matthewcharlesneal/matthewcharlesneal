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
    let isScrollLocked = false;

    const imageContainer = document.querySelector('.image-container');
    const imagesElements = imageContainer.querySelectorAll('.image');

    function preloadImages(images) {
        return Promise.all(images.map(img => {
            return new Promise((resolve, reject) => {
                const image = new Image();
                image.onload = resolve;
                image.onerror = reject;
                image.src = img.src;
            });
        }));
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
        }, 1250);

        imagesElements[index].scrollIntoView({ behavior: "smooth", block: "start" });
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
        } else {
            isTransitioning = false;
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedHandleScroll = debounce((event) => {
        if (window.innerWidth > 600 && scrollingEnabled && !isTransitioning && !isScrollLocked) {
            isScrollLocked = true;
            if (event.deltaY > 0) {
                nextImage();
            } else if (event.deltaY < 0) {
                previousImage();
            }
            setTimeout(() => { isScrollLocked = false; }, 1000);
        }
    }, 50);

    window.addEventListener('wheel', debouncedHandleScroll);

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

        initialTouchPos = null;
    }

    window.addEventListener('touchstart', handleTouchStart);
