(function () {
    const IMAGE_EXTS = ['jpg', 'JPG', 'jpeg', 'png', 'PNG', 'webp', 'gif'];

    function applyBackground(src) {
        const el = document.createElement('div');
        el.id = 'project-bg';
        el.style.cssText = [
            'position:fixed', 'inset:0', 'z-index:-1',
            "background-image:url('" + src + "')",
            'background-size:cover',
            'background-position:center',
            'background-repeat:no-repeat',
            'filter:blur(12px)',
            'opacity:0.5',
            'transform:scale(1.08)',
            'pointer-events:none'
        ].join(';');
        document.body.appendChild(el);
    }

    async function init() {
        // Manifest meta: fetch a JSON array and use the first entry
        const manifestMeta = document.querySelector('meta[name="thumbnail-manifest"]');
        if (manifestMeta) {
            try {
                const manifestPath = manifestMeta.getAttribute('content');
                const res = await fetch(manifestPath);
                const files = await res.json();
                if (files.length) {
                    const dir = manifestPath.replace(/[^/]+$/, '');
                    applyBackground(dir + encodeURIComponent(files[0]));
                }
            } catch {}
            return;
        }
        // Direct path meta tag for non-standard thumbnail filenames
        const meta = document.querySelector('meta[name="thumbnail"]');
        if (meta && meta.getAttribute('content')) {
            applyBackground(meta.getAttribute('content'));
            return;
        }
        // Fall back to probing standard thumbnail.ext in ./thumbnail/
        for (const ext of IMAGE_EXTS) {
            const src = './thumbnail/thumbnail.' + ext;
            try {
                const res = await fetch(src, { method: 'HEAD' });
                if (res.ok) { applyBackground(src); return; }
            } catch {}
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Mobile nav toggle — works on all project pages
    document.addEventListener('DOMContentLoaded', function () {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        if (!menuBtn || !navLinks) return;
        menuBtn.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
        document.addEventListener('click', function (e) {
            if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });
    });
})();
