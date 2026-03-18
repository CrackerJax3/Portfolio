document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Array of image filenames for the Fibonacci project
    const images = [
        '344878255_545286397791644_2687058708634910560_n.jpg',
        '344391446_2388595311310118_6454384877682181426_n.jpg',
        '344769375_1274162423219495_992468268086985814_n.jpg',
        '343592663_184589317369385_2956166460914760800_n.jpg',
        '343598771_6129982207118204_3650618705143123957_n.jpg',
        '343417721_2129336260574878_4090107282093014347_n.jpg',
        '343668678_919185302669689_7669866967775873732_n.jpg',
        '343967402_1568817193598581_7743026842652724454_n.jpg',
        '343985632_6846251285403191_7332624832448529679_n.jpg',
        '343773882_3088132358159116_4707861687206834075_n.jpg',
        '343961655_1707486999721207_8552372593067805069_n.jpg',
        '344938729_997855034464304_7437301155537497118_n.jpg',
        '344908352_205063175642796_1933106800906057638_n.jpg',
        '344556265_171547642510844_7803772306084289487_n.jpg',
        '344811890_1020471698921293_6185238209249815940_n.jpg',
        '370278303_10159302546826889_3004187721402757210_n.jpg',
        '343396261_529457012730059_1470875713016493569_n.jpg',
        '343062733_619881826680521_8499545223266358832_n.jpg',
        '343403541_1270189723588478_1846131235407264066_n.jpg',
        '343412955_786055912710511_1905961139155644393_n.jpg',
        '343056549_537969071846830_5102162152440316191_n.jpg',
        '343459078_746480180305224_8895145519143375269_n.jpg',
        'DJI_0908.JPG',
        'DJI_0876.JPG',
        'DJI_0846.JPG',
        'DJI_0842.JPG',
        'DJI_0836.JPG',
        'DJI_0820.JPG',
        'DJI_0813.JPG',
        'DJI_0774.JPG',
        'DJI_0770.JPG',
        'DJI_0762.JPG',
        'DJI_0758.JPG',
        'DJI_0752.JPG'
    ];

    // Create gallery items for each image
    images.forEach(filename => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = `../public/Fibonacci/${filename}`;
        img.alt = 'Fibonacci Visualization';
        
        const caption = document.createElement('p');
        caption.textContent = 'Fibonacci Visualization';
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(caption);
        galleryContainer.appendChild(galleryItem);
    });

    // Lightbox functionality
    let currentIndex = null;

    // Add click event to gallery images
    function openLightbox(index) {
        currentIndex = index;
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="../public/Fibonacci/${images[index]}" class="lightbox-img" alt="Fibonacci Visualization">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-arrow left">&#8592;</button>
                <button class="lightbox-arrow right">&#8594;</button>
            </div>
        `;
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        updateLightboxArrows();

        // Close button
        lightbox.querySelector('.lightbox-close').onclick = closeLightbox;
        // Arrow buttons
        lightbox.querySelector('.lightbox-arrow.left').onclick = () => navigateLightbox(-1);
        lightbox.querySelector('.lightbox-arrow.right').onclick = () => navigateLightbox(1);
        // Overlay click (outside image)
        lightbox.onclick = (e) => {
            if (e.target === lightbox) closeLightbox();
        };
        // Keyboard navigation
        document.addEventListener('keydown', lightboxKeyHandler);
        // Touch navigation
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
        if (img) img.src = `../public/Fibonacci/${images[currentIndex]}`;
        updateLightboxArrows();
    }

    function updateLightboxArrows() {
        const left = document.querySelector('.lightbox-arrow.left');
        const right = document.querySelector('.lightbox-arrow.right');
        if (!left || !right) return;
        left.style.display = images.length > 1 ? '' : 'none';
        right.style.display = images.length > 1 ? '' : 'none';
    }

    function lightboxKeyHandler(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    }

    function addTouchListeners(img) {
        let startY = null;
        img.ontouchstart = (e) => {
            if (e.touches.length === 1) startY = e.touches[0].clientY;
        };
        img.ontouchend = (e) => {
            if (startY === null) return;
            const endY = e.changedTouches[0].clientY;
            const diffY = endY - startY;
            if (Math.abs(diffY) > 50) {
                if (diffY < 0) navigateLightbox(1); // swipe up
                else navigateLightbox(-1); // swipe down
            }
            startY = null;
        };
    }

    // Attach click events to gallery items after they are created
    function attachGalleryClickEvents() {
        const items = document.querySelectorAll('.gallery-item img');
        items.forEach((img, idx) => {
            img.style.cursor = 'pointer';
            img.onclick = () => openLightbox(idx);
        });
    }

    // Call after images are loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachGalleryClickEvents);
    } else {
        attachGalleryClickEvents();
    }
}); 