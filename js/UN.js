const images = [
    './images/UN_1.jpg',
    './images/UN_2.jpg',
    './images/UN_3.jpg',
    './images/UN_4.jpg',
    './images/UN_5.jpg',
    './images/UN_6.jpg',
    './images/UN_7.jpg',
    './images/UN_8.jpg',
    './images/UN_9.jpg',
    './images/UN_10.jpg',
    './images/UN_11.jpg',
    './images/UN_12.jpg',
    './images/UN_13.jpg',
    './images/UN_14.jpg',
    './images/UN_15.jpg'
];

let currentIndex = 0;
const imageElement = document.querySelector('.gallery-image');
const counter = document.querySelector('.image-counter');
let touchStartX = null;
let touchStartY = null;

// Update image and counter
function updateImage() {
    imageElement.src = images[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

// Desktop navigation functions
function nextImage() {
    if (window.innerWidth > 600) {
        currentIndex = (currentIndex + 1) % images.length;
        updateImage();
    }
}

function prevImage() {
    if (window.innerWidth > 600) {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
    }
}

// Desktop fullscreen toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Mobile touch handling
function handleTouchStart(e) {
    if (window.innerWidth <= 600) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
}

function handleTouchMove(e) {
    if (window.innerWidth <= 600 && touchStartX !== null) {
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const deltaX = touchStartX - touchEndX;
        const deltaY = touchStartY - touchEndY;
        
        // Only handle horizontal swipes if they're more horizontal than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault(); // Prevent scrolling

            if (deltaX > 50) { // Swipe left
                if (currentIndex < images.length - 1) {
                    currentIndex++;
                    updateImage();
                }
            } else if (deltaX < -50) { // Swipe right
                if (currentIndex > 0) {
                    currentIndex--;
                    updateImage();
                }
            }
            
            touchStartX = null;
            touchStartY = null;
        }
    }
}

function handleTouchEnd() {
    touchStartX = null;
    touchStartY = null;
}

// Auto fullscreen in landscape mode for mobile
function handleOrientationChange() {
    if (window.innerWidth <= 600) {
        if (window.orientation === 90 || window.orientation === -90) {
            // Landscape mode
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            }
        } else {
            // Portrait mode
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Desktop keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (window.innerWidth > 600) {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape' && document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    });

    // Mobile touch events
    const swipeContainer = document.getElementById('swipeContainer');
    swipeContainer.addEventListener('touchstart', handleTouchStart, {passive: false});
    swipeContainer.addEventListener('touchmove', handleTouchMove, {passive: false});
    swipeContainer.addEventListener('touchend', handleTouchEnd);

    // Orientation change
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Initial setup
    updateImage();
    handleOrientationChange();
});
