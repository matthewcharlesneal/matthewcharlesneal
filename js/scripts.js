document.addEventListener('DOMContentLoaded', () => {
    const images = [
        { src: 'images/image1.jpg', orientation: 'landscape' },
        { src: 'images/image2.jpg', orientation: 'portrait' },
        { src: 'images/image8.jpg', orientation: 'landscape' },
        { src: 'images/image12.jpg', orientation: 'landscape' },
        { src: 'images/image13.jpg', orientation: 'portrait' },
        { src: 'images/image14.jpg', orientation: 'landscape' },
        { src: 'images/image15.jpg', orientation: 'landscape' },
        { src: 'images/image16.jpg', orientation: 'landscape' },
        { src: 'images/image17.jpg', orientation: 'landscape' },
        { src: 'images/image18.jpg', orientation: 'landscape' },
        { src: 'images/image19.jpg', orientation: 'portrait' },
        { src: 'images/image20.jpg', orientation: 'portrait' },
        { src: 'images/image22.jpg', orientation: 'landscape' },
        { src: 'images/image23.jpg', orientation: 'landscape' },
        { src: 'images/image24.jpg', orientation: 'landscape' },
        { src: 'images/image25.jpg', orientation: 'landscape' },
        { src: 'images/image26.jpg', orientation: 'landscape' },
        { src: 'images/image27.jpg', orientation: 'portrait' },
    ];
    let currentIndex = 0;

    const galleryImage = document.getElementById('galleryImage');
    const body = document.body;
    const menuLinks = document.querySelectorAll('.menu ul li a');

    const leftCursor = document.querySelector('.left-cursor');
    const rightCursor = document.querySelector('.right-cursor');

    function showImage(index) {
        galleryImage.src = images[index].src;
        galleryImage.style.transform = images[index].orientation === 'portrait' ? 'rotate(0deg)' : 'rotate(0deg)';
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
        const isLeft = event.pageX < window.innerWidth / 2;
        leftCursor.style.left = `${event.pageX}px`;
        leftCursor.style.top = `${event.pageY}px`;
        rightCursor.style.left = `${event.pageX}px`;
        rightCursor.style.top = `${event.pageY}px`;

        // Ensure cursor is hidden on body
        body.style.cursor = 'none';

        if (isLeft) {
            leftCursor.style.display = 'block';
            rightCursor.style.display = 'none';
        } else {
            leftCursor.style.display = 'none';
            rightCursor.style.display = 'block';
        }

        let overMenuLink = false;
        menuLinks.forEach(link => {
            const rect = link.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                overMenuLink = true;
            }
        });

        if (overMenuLink) {
            leftCursor.style.display = 'none';
            rightCursor.style.display = 'none';
        } else if (isLeft) {
            leftCursor.style.display = 'block';
            rightCursor.style.display = 'none';
        } else {
            leftCursor.style.display = 'none';
            rightCursor.style.display = 'block';
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

    showImage(currentIndex);

    const menuToggle = document.getElementById('menuToggle');
    const menuList = document.getElementById('menuList');
    const closeMenu = document.getElementById('closeMenu');

    menuToggle.addEventListener('click', () => {
        menuList.classList.toggle('show');
        closeMenu.classList.toggle('show');
    });

    closeMenu.addEventListener('click', () => {
        menuList.classList.remove('show');
        closeMenu.classList.remove('show');
    });
});