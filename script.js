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