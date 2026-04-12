document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');

    const images = [
        '20250417_092619.jpg',
        '20250417_092621.jpg',
        '20250417_092624.jpg',
        '20250417_093433.jpg',
        '20250417_093435(0).jpg',
        '20250417_093435.jpg',
        '20250417_105245.jpg',
        '20250417_105246.jpg',
        '20250417_105248.jpg',
        '20250417_115854.jpg',
        '20250417_121214.jpg',
        '20250417_121215.jpg',
        '20250417_180908.jpg',
        '20250417_181053.jpg',
        '20250417_181056.jpg',
        'DJI_0610.JPG',
        'DJI_0622.jpg',
    ];

    const imagePromises = images.map(filename => {
        return new Promise(resolve => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            const img = document.createElement('img');
            img.src = `./gallery/${encodeURIComponent(filename)}`;
            img.alt = 'Starship Schooner Anne';
            galleryItem.appendChild(img);
            galleryContainer.appendChild(galleryItem);
            img.onload = () => resolve();
            img.onerror = () => { galleryItem.remove(); resolve(); };
        });
    });

    Promise.all(imagePromises).then(() => attachGalleryClickEvents());

    let currentIndex = null;
    let visibleImages = [];

    function openLightbox(index) {
        currentIndex = index;
        visibleImages = [...document.querySelectorAll('.gallery-item img')].map(i => i.src);
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${visibleImages[index]}" class="lightbox-img" alt="Starship Schooner Anne">
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
        currentIndex = (currentIndex + direction + visibleImages.length) % visibleImages.length;
        const img = document.querySelector('.lightbox-img');
        if (img) img.src = visibleImages[currentIndex];
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
