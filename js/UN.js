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

function updateImage() {
    imageElement.src = images[currentIndex];
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// Event Listeners
document.querySelector('.next').addEventListener('click', nextImage);
document.querySelector('.prev').addEventListener('click', prevImage);
document.querySelector('.fullscreen-btn').addEventListener('click', toggleFullscreen);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// Initial load
updateImage();
