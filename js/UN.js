document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    let scrollingEnabled = true;
    let lastScrollTime = Date.now();
    let scrollTimeout;
    let scrollLocked = false;

    function showImage(index) {
        if (isTransitioning || scrollLocked) return;
        
        // Clear any existing timeouts
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Lock scrolling immediately
        isTransitioning = true;
        scrollLocked = true;

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

        // Much slower scroll transition
        imageContainer.style.scrollBehavior = 'smooth';
        imageContainer.style.scrollDuration = '3.5s'; // Increased to 3.5 seconds
        
        imageContainer.scrollBy({
            top: scrollOffset,
            behavior: 'smooth'
        });

        // Extended transition lock
        scrollTimeout = setTimeout(() => {
            isTransitioning = false;
            // Add additional delay before completely unlocking scroll
            setTimeout(() => {
                scrollLocked = false;
            }, 500);
        }, 4000); // Increased to 4 seconds total
    }

    function handleDesktopScroll(event) {
        // Always prevent default scroll
        event.preventDefault();
        
        if (!scrollingEnabled || isTransitioning || scrollLocked) {
            return;
        }

        const now = Date.now();
        // Even longer debounce time
        if (now - lastScrollTime < 4000) { // Match the transition duration
            return;
        }
        
        // Only care about initial scroll direction
        const direction = Math.sign(event.deltaY);
        
        // Update last scroll time
        lastScrollTime = now;
        
        // Strict single image advancement
        if (direction > 0 && currentIndex < images.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        } else if (direction < 0 && currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }
    }

    // Rest of your code remains the same...
    let touchStartY = null;

    function handleTouchStart(event) {
        if (window.innerWidth > 600) return;
        touchStartY = event.touches[0].clientY;
    }

    function handleTouchMove(event) {
        if (window.innerWidth > 600 || !touchStartY || isTransitioning || scrollLocked) return;

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

    const observer = new IntersectionObserver((entries) => {
        if (isTransitioning || scrollLocked) return;
        
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

    initializeGallery();
});
