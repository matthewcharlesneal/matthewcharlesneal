document.addEventListener('DOMContentLoaded', () => {
    const images = [
        { src: 'images/image5.jpg', orientation: 'landscape', label: 'Marblehead to Halifax Ocean Race 2023' },
        { src: 'images/image4.jpg', orientation: 'portrait', label: 'Block Island Race Week 2023' },
        { src: 'images/image9.jpg', orientation: 'portrait', label: 'Marblehead to Halifax Ocean Race 2023' },
	{ src: 'images/image10.jpg', orientation: 'landscape', label: 'Marblehead to Halifax Ocean Race 2023' },
	{ src: 'images/image28.jpg', orientation: 'landscape', label: 'Newport to Bermuda Race 2024' },
	{ src: 'images/image29.jpg', orientation: 'landscape', label: 'Newport to Bermuda Race 2024' },
        // Add more images as needed
    ];
    let currentIndex = 0;

    const galleryImage = document.getElementById('galleryImage');
    const imageLabel = document.getElementById('imageLabel');
    const body = document.body;
    const menuLinks = document.querySelectorAll('.menu ul li a, .menu h1 a'); // Include h1 a

    const cursor = document.createElement('div');
    cursor.classList.add('cursor');
    body.appendChild(cursor);

    function showImage(index) {
        galleryImage.src = images[index].src;
        imageLabel.textContent = images[index].label; // Update the label text
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function previousImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    document.addEventListener('mousemove', (event) => {
        cursor.style.left = `${event.pageX}px`;
        cursor.style.top = `${event.pageY}px`;

        if (event.pageX < window.innerWidth / 2) {
            cursor.classList.add('left');
            cursor.classList.remove('right');
        } else {
            cursor.classList.add('right');
            cursor.classList.remove('left');
        }

        // Check if the mouse is over a menu link or the name link
        let overMenuLink = false;
        menuLinks.forEach(link => {
            const rect = link.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                overMenuLink = true;
            }
        });

        if (overMenuLink) {
            cursor.style.display = 'none';
        } else {
            cursor.style.display = 'block';
        }
    });

    document.addEventListener('click', (event) => {
        if (event.pageX < window.innerWidth / 2) {
            previousImage();
        } else {
            nextImage();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            nextImage();
        } else if (event.key === 'ArrowLeft') {
            previousImage();
        }
    });

    // Initial image display
    showImage(currentIndex);
});
