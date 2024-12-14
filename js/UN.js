document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isScrolling = false;
    let scrollTimeout;
    
    // Simple debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function updateActiveImage() {
        const containerRect = imageContainer.getBoundingClientRect();
        const containerCenter = containerRect.top + (containerRect.height / 2);

        let closestImage = images[0];
        let closestDistance = Infinity;

        images.forEach((image) => {
            const imageRect = image.getBoundingClientRect();
            const imageCenter = imageRect.top + (imageRect.height / 2);
            const distance = Math.abs(containerCenter - imageCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestImage = image;
            }
        });

        const newIndex = images.indexOf(closestImage);
        if (newIndex !== currentIndex) {
            currentIndex = newIndex;
            images.forEach((img, i) => {
                if (i === currentIndex) {
                    img.classList.add('active');
                    img.classList.remove('inactive');
                } else {
                    img.classList.remove('active');
                    img.classList.add('inactive');
                }
            });
        }
    }

    // Optimized scroll handler
    const handleScroll = debounce(() => {
        if (!isScrolling) {
            updateActiveImage();
        }
    }, 50);

    function scrollToImage(index) {
        if (isScrolling) return;
        isScrolling = true;

        const targetImage = images[index];
        targetImage.scrollIntoView({ behavior: 'smooth', block: 'start' });

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
            updateActiveImage();
        }, 500);
    }

    function handleWheelEvent(e) {
        if (window.innerWidth <= 600) return;
        
        e.preventDefault();
        
        if (isScrolling) return;

        if (e.deltaY > 0 && currentIndex < images.length - 1) {
            scrollToImage(currentIndex + 1);
        } else if (e.deltaY < 0 && currentIndex > 0) {
            scrollToImage(currentIndex - 1);
        }
    }

    // Mobile touch handling (keeping your original mobile implementation)
    let touchStartY = null;

    function handleTouchStart(e) {
        if (window.innerWidth > 600) return;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (window.innerWidth > 600 || !touchStartY || isScrolling) return;

        const touchY = e.touches[0].clientY;
        const touchDelta = touchStartY - touchY;

        if (Math.abs(touchDelta) > 20) {
            if (touchDelta > 0 && currentIndex < images.length - 1) {
                scrollToImage(currentIndex + 1);
            } else if (touchDelta < 0 && currentIndex > 0) {
                scrollToImage(currentIndex - 1);
            }
            touchStartY = null;
        }
    }

    // Event listeners
    window.addEventListener('wheel', handleWheelEvent, { passive: false });
    imageContainer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Menu handling (keeping your original implementation)
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
    images[0].classList.add('active');
    setTimeout(() => {
        window.scrollTo(0, 0);
        imageContainer.scrollTo(0, 0);
    }, 100);
});
