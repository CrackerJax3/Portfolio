// Mobile Menu Toggle
const menuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Function to extract Etsy listing ID from URL
function getEtsyListingId(url) {
    const match = url.match(/listing\/(\d+)/);
    return match ? match[1] : null;
}

// Function to fetch Etsy product image
async function fetchEtsyProductImage(listingId) {
    try {
        // Using Etsy's public API endpoint
        const response = await fetch(`https://openapi.etsy.com/v3/application/listings/${listingId}/images`, {
            headers: {
                'x-api-key': 'x58yqz1v37j9oibd849re2tv' // You'll need to replace this with your actual Etsy API key
            }
        });
        const data = await response.json();
        return data.results[0].url_fullxfull; // Get the full-size image URL
    } catch (error) {
        console.error('Error fetching Etsy image:', error);
        return null;
    }
}

// Function to update product images
async function updateProductImages() {
    const productCards = document.querySelectorAll('.project-card');
    
    for (const card of productCards) {
        const link = card.querySelector('a.project-link');
        if (link && link.href.includes('etsy.com')) {
            const listingId = getEtsyListingId(link.href);
            if (listingId) {
                const img = card.querySelector('img');
                if (img) {
                    const imageUrl = await fetchEtsyProductImage(listingId);
                    if (imageUrl) {
                        img.src = imageUrl;
                        img.onerror = () => {
                            // Fallback to local image if Etsy image fails to load
                            img.src = img.getAttribute('data-fallback-src') || './public/placeholder.jpg';
                        };
                    }
                }
            }
        }
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateProductImages);

// Auto-load thumbnails from project thumbnail folders.
// Drop any file named "thumbnail.ext" into a project's thumbnail/ folder
// and it will appear automatically. Supported: jpg, jpeg, png, webp, gif, mp4, webm
const IMAGE_EXTS = ['jpg', 'JPG', 'jpeg', 'png', 'PNG', 'webp', 'gif'];
const VIDEO_EXTS = ['mp4', 'webm'];

async function findThumbnail(dir) {
    const exts = [...IMAGE_EXTS, ...VIDEO_EXTS];
    for (const ext of exts) {
        const src = `${dir}/thumbnail.${ext}`;
        try {
            const res = await fetch(src, { method: 'HEAD' });
            if (res.ok) return { src, isVideo: VIDEO_EXTS.includes(ext) };
        } catch {}
    }
    return null;
}

async function loadProjectThumbnails() {
    const cards = document.querySelectorAll('.project-card[data-thumbnail], .project-card[data-thumbnail-dir]');
    await Promise.all([...cards].map(async card => {
        let src, isVideo;

        const direct = card.getAttribute('data-thumbnail');
        if (direct) {
            src = direct;
            isVideo = VIDEO_EXTS.some(e => direct.toLowerCase().endsWith('.' + e));
        } else {
            const dir = card.getAttribute('data-thumbnail-dir');
            const result = await findThumbnail(dir);
            if (!result) return;
            src = result.src;
            isVideo = result.isVideo;
        }

        let media;
        if (isVideo) {
            media = document.createElement('video');
            media.loop = true;
            media.autoplay = true;
            media.muted = true;
            media.playsInline = true;
        } else {
            media = document.createElement('img');
            media.alt = card.querySelector('h3')?.textContent || '';
        }
        media.src = src;
        card.insertBefore(media, card.firstElementChild);
    }));
}

document.addEventListener('DOMContentLoaded', loadProjectThumbnails);

// Hero banner — drop a photo into hero-banner/ and run npm run scan
async function loadHeroBanner() {
    try {
        const res = await fetch('hero-banner/manifest.json');
        if (!res.ok) return;
        const files = await res.json();
        if (!files.length) return;
        const file = files[0];
        // Use absolute URL so it works when stored in sessionStorage and applied from any page
        const absoluteSrc = new URL('hero-banner/' + encodeURIComponent(file), location.href).href;
        const homeSection = document.getElementById('home');
        if (!homeSection) return;
        const overlay = 'linear-gradient(rgba(0,0,0,0.20), rgba(0,0,0,0.20))';
        const bgValue = `${overlay}, url('${absoluteSrc}')`;
        document.body.style.backgroundImage = bgValue;
        homeSection.style.backgroundImage = bgValue;
        homeSection.classList.add('has-banner');
        // Persist so the next page can apply it before first paint (no black flash)
        sessionStorage.setItem('page-bg', bgValue);
    } catch {}
}

document.addEventListener('DOMContentLoaded', loadHeroBanner);

// ── Swipe page transition (Home ↔ Gallery) ───────────────────────────────
// Slides only the HUD (content below nav). Background and nav stay fixed.
// Background is persisted in sessionStorage so the next page applies it
// synchronously before first paint, eliminating the black flash.
(function () {
    const DURATION = 400;

    function buildHUD() {
        const hud = document.createElement('div');
        hud.id = 'page-hud';
        [...document.body.children]
            .filter(el => el.id !== 'page-hud' && el.id !== 'project-bg' && el.tagName !== 'NAV')
            .forEach(el => hud.appendChild(el));
        document.body.appendChild(hud);
        return hud;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const hud = buildHUD();
        document.body.style.overflowX = 'hidden';

        const dir = sessionStorage.getItem('page-swipe');
        if (dir) {
            sessionStorage.removeItem('page-swipe');
            const startX = dir === 'left' ? '100%' : '-100%';
            // Lock inline style to the same offscreen position as the CSS init rule,
            // then remove the init style so only the inline style controls position.
            hud.style.cssText = `transform:translateX(${startX});transition:none`;
            const initStyle = document.getElementById('page-init');
            if (initStyle) initStyle.remove();

            requestAnimationFrame(() => requestAnimationFrame(() => {
                hud.style.transition = `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)`;
                hud.style.transform = 'translateX(0)';
                setTimeout(() => {
                    hud.style.cssText = '';
                    document.body.style.overflowX = '';
                }, DURATION + 20);
            }));
        } else {
            document.body.style.overflowX = '';
        }

        document.addEventListener('click', e => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || link.target === '_blank') return;
            if (/^https?:/.test(href)) return;

            const toGallery = /gallery/i.test(href);
            const toHome    = /index\.html/i.test(href) && !/gallery/i.test(href) && !/privacy/i.test(href);
            if (!toGallery && !toHome) return;

            e.preventDefault();
            sessionStorage.setItem('page-swipe', toGallery ? 'left' : 'right');
            document.body.style.overflowX = 'hidden';
            hud.style.transition = `transform ${DURATION}ms cubic-bezier(0.4,0,0.2,1)`;
            hud.style.transform = toGallery ? 'translateX(-100%)' : 'translateX(100%)';
            // Navigate after the first painted frame so the browser loads the
            // next page during the animation — it has the full DURATION to finish
            // loading before it needs to be visible.
            requestAnimationFrame(() => requestAnimationFrame(() => {
                window.location.href = href;
            }));
        });
    });
})();