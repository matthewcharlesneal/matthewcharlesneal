thank you this makes sense. Do you think you can help me update my current website code to simplify it? I currently have a popup menu for 'Series' but I don't like how this works so I prefer just having a clickable link to the series page. I also want to change the full screen icon to the image attached. Additionally, when I use the arrows to navigate, there is a box that appears around the arrows and I do not want a box to be visible. Finally, all of the text and the icons at the top need to be in line with each other, they are not currently in line. Can you help me update this? Please keep the code modular to I can copy the html, css, and js separately. Here is my initial code that I want updated:

document.addEventListener('DOMContentLoaded', () => {
    const imageContainer = document.querySelector('.image-container');
    const images = Array.from(document.querySelectorAll('.image'));
    let currentIndex = 0;
    let isTransitioning = false;
    // Only for mobile devices
    function showImage(index) {
        if (window.innerWidth <= 600) {
            if (isTransitioning) return;
            isTransitioning = true;
            const targetImage = images[index];
            targetImage.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => {
                isTransitioning = false;
            }, 1250);
        }
    }
    // Mobile touch events
    let initialTouchPos = null;
    function handleTouchStart(event) {
        if (window.innerWidth <= 600) {
            initialTouchPos = event.touches[0].clientY;
        }
    }
    function handleTouchMove(event) {
        if (window.innerWidth <= 600) {
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
    }
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
    // Mobile event listeners
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
        if (window.innerWidth <= 600) {
            setTimeout(() => {
                window.scrollTo(0, 0);
                showImage(currentIndex);
            }, 100);
        }
    });
});
