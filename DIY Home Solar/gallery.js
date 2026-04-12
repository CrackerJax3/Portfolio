document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');

    const images = [
        '503375921_10162628790619158_4045464847724443903_n.jpg',
        '510431734_10162719775894158_6059875296883201995_n.jpg',
        'Capture.PNG'
    ];

    const imagePromises = images.map(filename => {
        return new Promise(resolve => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            const img = document.createElement('img');
            img.src = `./gallery/${filename}`;
            img.alt = 'DIY Home Solar';
            galleryItem.appendChild(img);
            galleryContainer.appendChild(galleryItem);
            img.onload = () => resolve();
            img.onerror = () => resolve();
        });
    });

    Promise.all(imagePromises).then(() => attachGalleryClickEvents());

    let currentIndex = null;

    function openLightbox(index) {
        currentIndex = index;
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="./gallery/${images[index]}" class="lightbox-img" alt="DIY Home Solar">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-arrow left">&#8592;</button>
                <button class="lightbox-arrow right">&#8594;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lightbox-close').onclick = closeLightbox;
        lightbox.querySelector('.lightbox-arrow.left').onclick = () => navigateLightbox(-1);
        lightbox.querySelector('.lightbox-arrow.right').onclick = () => navigateLightbox(1);
        lightbox.onclick = e => { if (e.target === lightbox) closeLightbox(); };
        document.addEventListener('keydown', lightboxKeyHandler);
        addTouchListeners(lightbox.querySelector('.lightbox-img'));
    }

    function closeLightbox() {
        const lightbox = document.querySelector('.lightbox-overlay');
        if (lightbox) lightbox.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', lightboxKeyHandler);
    }

    function navigateLightbox(direction) {
        if (currentIndex === null) return;
        currentIndex = (currentIndex + direction + images.length) % images.length;
        const img = document.querySelector('.lightbox-img');
        if (img) img.src = `./gallery/${images[currentIndex]}`;
    }

    function lightboxKeyHandler(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    }

    function addTouchListeners(img) {
        let startX = null;
        img.ontouchstart = e => { if (e.touches.length === 1) startX = e.touches[0].clientX; };
        img.ontouchend = e => {
            if (startX === null) return;
            const diff = e.changedTouches[0].clientX - startX;
            if (Math.abs(diff) > 50) navigateLightbox(diff < 0 ? 1 : -1);
            startX = null;
        };
    }

    function attachGalleryClickEvents() {
        document.querySelectorAll('.gallery-item img').forEach((img, idx) => {
            img.style.cursor = 'pointer';
            img.onclick = () => openLightbox(idx);
        });
    }
});
