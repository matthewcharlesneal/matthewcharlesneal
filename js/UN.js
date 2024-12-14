document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;

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

        requestAnimationFrame(() => {
            images[index].scrollIntoView({ behavior: "smooth", block: "start" });
        });

        setTimeout(() => {
            isTransitioning = false;
        }, 1250);
    }

    function handleScroll(event) {
        if (window.innerWidth > 600 && scrollingEnabled && !isTransitioning) {
            if (event.deltaY > 0 && currentIndex < images.length - 1) {
                currentIndex++;
                showImage(currentIndex);
            } else if (event.deltaY < 0 && currentIndex > 0) {
                currentIndex--;
                showImage(currentIndex);
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
            currentIndex++;
            showImage(currentIndex);
        } else if (touchDelta < -20 && currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }

        initialTouchPos = null;
    }

    function initializeGallery() {
        currentIndex = 0;
        showImage(currentIndex);
        
        Promise.all(Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => img.addEventListener('load', resolve));
        })).then(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                images[0].scrollIntoView({ behavior: "auto", block: "start" });
            });
        });
    }

    function forceStartAtFirstImage() {
        currentIndex = 0;
        showImage(currentIndex);
        window.scrollTo(0, 0);
        images[0].scrollIntoView({ behavior: "auto", block: "start" });
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

    // Menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const menuList = document.getElementById('menuList');
    const closeMenu = document.getElementById('closeMenu');

    menuToggle?.addEventListener('click', () => {
        menuList.classList.toggle('show');
        closeMenu.classList.toggle('show');
    });

    closeMenu?.addEventListener('click', () => {
        menuList.classList.remove('show');
        closeMenu.classList.remove('show');
    });

    // Initialize the gallery
    initializeGallery();

    // Force start at first image on page load
    forceStartAtFirstImage();
});
