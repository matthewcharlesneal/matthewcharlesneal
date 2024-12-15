document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;
    let lastScrollTime = Date.now();
    let scrollTimeout;

    function showImage(index) {
        if (isTransitioning) return;
        isTransitioning = true;

        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                img.classList.remove('inactive');
            } else {
                img.classList.remove('active');
                img.classList.add('inactive');
            }
        });

        const targetImage = images[index];
        const containerTop = imageContainer.getBoundingClientRect().top;
        const targetTop = targetImage.getBoundingClientRect().top;
        const scrollOffset = targetTop - containerTop;

        imageContainer.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
        });

        // Wait for the scroll animation to complete
        scrollTimeout = setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    function handleDesktopScroll(event) {
        if (!scrollingEnabled || isTransitioning) {
            event.preventDefault();
            return;
        }
        
        const now = Date.now();
        if (now - lastScrollTime < 250) { // Increased from 50ms to 250ms
            event.preventDefault();
            return;
        }
        lastScrollTime = now;

        const direction = event.deltaY > 0 ? 1 : -1;
        const sensitivity = 25;

        if (Math.abs(event.deltaY) < sensitivity) {
            event.preventDefault();
            return;
        }

        // Prevent scrolling more than one image at a time
        if (direction > 0 && currentIndex < images.length - 1) {
            event.preventDefault();
            currentIndex++;
            showImage(currentIndex);
        } else if (direction < 0 && currentIndex > 0) {
            event.preventDefault();
            currentIndex--;
            showImage(currentIndex);
        }
    }

    let touchStartY = null;

    function handleTouchStart(event) {
        if (window.innerWidth > 600) return; // Only handle touch on mobile
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (window.innerWidth > 600 || !touchStartY || isTransitioning) return;

        const touchY = event.touches[0].clientY;
        const touchDelta = touchStartY - touchY;

        if (Math.abs(touchDelta) > 20) {
            if (touchDelta > 0 && currentIndex < images.length - 1) {
                currentIndex++;
                showImage(currentIndex);
                touchStartY = null;
            } else if (touchDelta < 0 && currentIndex > 0) {
                currentIndex--;
                showImage(currentIndex);
                touchStartY = null;
            }
        }
    }

    function initializeGallery() {
        currentIndex = 0;
        showImage(currentIndex);
        
        // Wait for all images to load
        Promise.all(Array.from(images).map(img => {
            const bgImage = img.style.backgroundImage;
            if (!bgImage) return Promise.resolve();
            
            return new Promise(resolve => {
                const image = new Image();
                image.onload = resolve;
                image.src = bgImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
            });
        })).then(() => {
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                images[0].scrollIntoView({ behavior: "auto", block: "start" });
            });
        });
    }

    // Intersection Observer for backup scroll detection
    const observer = new IntersectionObserver((entries) => {
        if (isTransitioning) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const index = images.indexOf(entry.target);
                if (index !== currentIndex) {
                    currentIndex = index;
                    images.forEach((img, i) => {
                        img.classList.toggle('active', i === index);
                        img.classList.toggle('inactive', i !== index);
                    });
                }
            }
        });
    }, {
        root: imageContainer,
        threshold: [0.5],
        rootMargin: '-10% 0px -10% 0px'
    });

    images.forEach(image => observer.observe(image));

    // Event Listeners
    window.addEventListener('wheel', handleDesktopScroll, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

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

    // Initialize
    initializeGallery();
});
