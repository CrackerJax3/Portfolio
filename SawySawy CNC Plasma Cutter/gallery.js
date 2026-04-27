const VIDEO_EXTS = new Set(['.mp4', '.webm', '.MP4', '.WEBM']);

function isVideo(f) { return VIDEO_EXTS.has(f.slice(f.lastIndexOf('.'))); }

document.addEventListener('DOMContentLoaded', async function () {
    const container = document.querySelector('.gallery-container');
    if (!container) return;

    let files;
    try {
        const res = await fetch('./gallery/manifest.json');
        files = await res.json();
    } catch {
        return;
    }
    if (!files.length) return;

    const projectName = document.querySelector('h1')?.textContent?.trim() || '';
    // Manifest entries can be plain strings or {file, caption} objects
    const normalised = files.map(f => typeof f === 'string' ? { file: f, caption: projectName } : f);
    const imageFiles = normalised.filter(e => !isVideo(e.file)).map(e => e.file);
    let currentIndex = null;

    normalised.forEach(({ file, caption }) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';

        if (isVideo(file)) {
            const vid = document.createElement('video');
            vid.src = `./gallery/${encodeURIComponent(file)}`;
            vid.controls = true;
            vid.loop = true;
            vid.playsInline = true;
            vid.style.width = '100%';
            item.appendChild(vid);
        } else {
            const img = document.createElement('img');
            img.src = `./gallery/${encodeURIComponent(file)}`;
            img.alt = caption || file;
            img.loading = 'lazy';
            img.style.cursor = 'pointer';
            img.onclick = () => openLightbox(imageFiles.indexOf(file));
            item.appendChild(img);

            if (caption) {
                const cap = document.createElement('div');
                cap.className = 'gallery-caption';
                cap.textContent = caption;
                item.appendChild(cap);
            }
        }

        container.appendChild(item);
    });

    function openLightbox(index) {
        currentIndex = index;
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';

        const img = document.createElement('img');
        img.className = 'lightbox-img';
        img.src = `./gallery/${encodeURIComponent(imageFiles[index])}`;
        img.alt = projectName;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'lightbox-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = close;

        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        overlay.onclick = e => { if (e.target === overlay) close(); };
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', keyHandler);

        let tx = 0;
        overlay.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
        overlay.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].screenX - tx;
            if (Math.abs(dx) > 50) nav(dx < 0 ? 1 : -1);
        }, { passive: true });
    }

    function close() {
        document.querySelector('.lightbox-overlay')?.remove();
        document.body.style.overflow = '';
        document.removeEventListener('keydown', keyHandler);
    }

    function nav(dir) {
        currentIndex = (currentIndex + dir + imageFiles.length) % imageFiles.length;
        const img = document.querySelector('.lightbox-img');
        if (img) img.src = `./gallery/${encodeURIComponent(imageFiles[currentIndex])}`;
    }

    function keyHandler(e) {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') nav(-1);
        if (e.key === 'ArrowRight') nav(1);
    }
});
