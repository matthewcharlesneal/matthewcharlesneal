document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isScrolling = false;
    let scrollingEnabled = true;
    let lastScrollTime = Date.now();

    function showImage(index) {
        if (isScrolling) return;
        
        isScrolling = true;
        currentIndex = index;

        const targetImage = images[index];
        
        targetImage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });

        // Update active states
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
            img.classList.toggle('inactive', i !== index);
        });

        // Allow next scroll after animation
        setTimeout(() => {
            isScrolling = false;
        }, 500);
    }

    function handleScroll(event) {
        if (!scrollingEnabled || isScrolling) {
            event.preventDefault();
            return;
        }

        const now = Date.now();
        if (now - lastScrollTime < 500) {
            event.preventDefault();
            return;
        }
        lastScrollTime = now;

        const direction = Math.sign(event.deltaY);
        
        if (direction > 0 && currentIndex < images.length - 1) {
            event.preventDefault();
            showImage(currentIndex + 1);
        } else if (direction < 0 && currentIndex > 0) {
            event.preventDefault();
            showImage(currentIndex - 1);
        }
    }

    function initializeGallery() {
        currentIndex = 0;
        showImage(currentIndex);
        
        // Wait for images to load
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

    // Simpler intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isScrolling) {
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
        threshold: 0.5
    });

    images.forEach(image => observer.observe(image));

    // Event Listeners
    window.addEventListener('wheel', handleScroll, { passive: false });

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
