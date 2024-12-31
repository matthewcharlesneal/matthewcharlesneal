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
let isMobile = window.innerWidth <= 600;

// Update image and counter
function updateImage() {
    imageElement.src = images[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

// Navigation functions
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
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
    if (isMobile) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }
}

function handleTouchMove(e) {
    if (!isMobile || !touchStartX) return;
    e.preventDefault(); // Prevent scrolling

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = Math.abs(touchStartY - e.touches[0].clientY);

    // Only handle horizontal swipes
    if (deltaY < 50) {
        if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                nextImage();
            } else {
                prevImage();
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

// Handle orientation changes
function handleOrientationChange() {
    if (isMobile) {
        if (window.matchMedia("(orientation: landscape)").matches) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen()
                    .catch(err => console.log('Fullscreen error:', err));
            }
        } else if (document.fullscreenElement) {
            document.exitFullscreen()
                .catch(err => console.log('Exit fullscreen error:', err));
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

    // Prevent default touch behavior on body
    document.body.addEventListener('touchmove', (e) => {
        if (isMobile) e.preventDefault();
    }, { passive: false });

    // Orientation change events
    window.addEventListener('orientationchange', () => {
        setTimeout(handleOrientationChange, 100);
    });
    window.addEventListener('resize', handleOrientationChange);

    // Initial setup
    updateImage();
    handleOrientationChange();
});
