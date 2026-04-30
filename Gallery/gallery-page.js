const VIDEO_EXTS = ['.mp4', '.webm'];

function isVideo(filename) {
    return VIDEO_EXTS.some(e => filename.toLowerCase().endsWith(e));
}

let items = [];
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    showLightboxItem();
    document.getElementById('lightbox').classList.add('open');
    document.getElementById('lightbox').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const video = document.getElementById('lb-video');
    video.pause();
    video.src = '';
}

function showLightboxItem() {
    const { src, vid: isVid } = items[currentIndex];
    const img = document.getElementById('lb-img');
    const video = document.getElementById('lb-video');
    const counter = document.getElementById('lb-counter');

    if (isVid) {
        video.src = src;
        video.classList.add('active');
        img.classList.remove('active');
        img.src = '';
    } else {
        img.src = src;
        img.alt = '';
        img.classList.add('active');
        video.classList.remove('active');
        video.pause();
        video.src = '';
    }

    counter.textContent = `${currentIndex + 1} / ${items.length}`;
}

function navigate(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    showLightboxItem();
}

function loadGallery() {
    const files = window.GALLERY_FILES;
    if (!files || !files.length) return;

    items = files.map(file => ({
        src: 'photos/' + encodeURIComponent(file),
        vid: isVideo(file),
    }));

    const collage = document.getElementById('gallery-collage');
    const emptyMsg = document.getElementById('gallery-empty');
    emptyMsg.remove();

    items.forEach(({ src, vid: isVid }, index) => {
        const div = document.createElement('div');
        div.className = 'collage-item';
        div.setAttribute('role', 'button');
        div.setAttribute('tabindex', '0');
        div.setAttribute('aria-label', `Open photo ${index + 1}`);

        if (isVid) {
            const vid = document.createElement('video');
            vid.src = src;
            vid.muted = true;
            vid.loop = true;
            vid.autoplay = true;
            vid.playsInline = true;
            div.appendChild(vid);
        } else {
            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.loading = 'lazy';
            div.appendChild(img);
        }

        div.addEventListener('click', () => openLightbox(index));
        div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(index); });
        collage.appendChild(div);
    });

    document.getElementById('lb-close').addEventListener('click', closeLightbox);
    document.getElementById('lb-prev').addEventListener('click', () => navigate(-1));
    document.getElementById('lb-next').addEventListener('click', () => navigate(1));

    document.getElementById('lightbox').addEventListener('click', e => {
        if (e.target === document.getElementById('lightbox')) closeLightbox();
    });

    document.addEventListener('keydown', e => {
        if (!document.getElementById('lightbox').classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
    });

    let touchStartX = 0;
    document.getElementById('lightbox').addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    document.getElementById('lightbox').addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', loadGallery);
