document.addEventListener('DOMContentLoaded', function () {
    const galleryContainer = document.querySelector('.gallery-container');

    const media = [
        { file: 'Furnari_sculpture.mp4', type: 'video' },
        { file: 'WhatsApp Image 2026-04-19 at 21.40.36.jpeg', type: 'image' },
    ];

    const imageFiles = media.filter(m => m.type === 'image').map(m => m.file);
    let imageIndex = 0;

    media.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';

        let el;
        if (item.type === 'video') {
            el = document.createElement('video');
            el.src = `./gallery/${encodeURIComponent(item.file)}`;
            el.controls = true;
            el.muted = true;
            el.playsInline = true;
            el.style.width = '100%';
            el.style.height = '300px';
            el.style.objectFit = 'cover';
            el.style.display = 'block';
        } else {
            el = document.createElement('img');
            el.src = `./gallery/${encodeURIComponent(item.file)}`;
            el.alt = 'Colossal Sculpture with Sergio Furnari';
            const idx = imageIndex++;
            el.style.cursor = 'pointer';
            el.onclick = () => openLightbox(idx);
        }

        galleryItem.appendChild(el);
        galleryContainer.appendChild(galleryItem);
    });

    function openLightbox(idx) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <div class="lightbox-content">
                <img src="./gallery/${encodeURIComponent(imageFiles[idx])}" class="lightbox-img" alt="">
                <button class="lightbox-close">&times;</button>
                ${imageFiles.length > 1 ? '<button class="lightbox-arrow left">&#8592;</button><button class="lightbox-arrow right">&#8594;</button>' : ''}
            </div>`;
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        let current = idx;

        overlay.querySelector('.lightbox-close').onclick = close;
        overlay.onclick = e => { if (e.target === overlay) close(); };

        const left = overlay.querySelector('.lightbox-arrow.left');
        const right = overlay.querySelector('.lightbox-arrow.right');
        if (left) left.onclick = () => navigate(-1);
        if (right) right.onclick = () => navigate(1);

        document.addEventListener('keydown', keyHandler);

        function navigate(dir) {
            current = (current + dir + imageFiles.length) % imageFiles.length;
            overlay.querySelector('.lightbox-img').src = `./gallery/${encodeURIComponent(imageFiles[current])}`;
        }
        function close() {
            overlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', keyHandler);
        }
        function keyHandler(e) {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'ArrowRight') navigate(1);
        }
    }
});
