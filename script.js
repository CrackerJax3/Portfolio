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