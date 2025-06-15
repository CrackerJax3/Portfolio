document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Array of all image filenames
    const images = [
        '337235988_3507917809492107_7084059905580813201_n.jpg',
        '336766782_163514952859167_2820009482603508318_n.jpg',
        '336326658_556855966540490_6895742282765095521_n.jpg',
        '336149557_901506387730370_3260809657403884049_n.jpg',
        '337225063_187322484011832_3828319070119984664_n.jpg',
        '336740989_203497722301307_3266177143135336462_n.jpg',
        '336235795_946245973042856_5958054226144199393_n.jpg',
        '335886588_774433973766288_7617954282809419204_n.jpg',
        '336021597_509452394720250_2645995240988962696_n.jpg',
        '335888435_521966926550408_905870869801410654_n.jpg',
        '336305459_3541695492731796_4383790613617624755_n.jpg',
        '336259343_166700662867070_2415820310120932247_n.jpg',
        '336669642_754464056054744_4787600406017385124_n.jpg',
        '336227807_612900313523575_7888562576105186589_n.jpg',
        '336012522_596425069174077_3474819791506399875_n.jpg',
        '336257006_934116741124468_2038568449405240711_n.jpg',
        '336641300_1512483789242831_3786155797649233583_n.jpg',
        '336739648_768691677938195_6185107148938674065_n.jpg',
        '336667132_187087790733293_3359148898310531847_n.jpg',
        '335861477_690019052810362_3417778243338813007_n.jpg',
        '336866855_768920608166781_1242626014491537909_n.jpg',
        '337113556_120059854295848_717407258752134404_n.jpg',
        '336737179_952043542818288_7675506978334378673_n.jpg',
        '336179208_728347012230046_5852188391101757254_n.jpg',
        '330303397_191606450269407_4947574545727952765_n.jpg',
        '336804965_1603121090155104_4106459137854267786_n.jpg',
        '336778279_237054528714979_1521240017993401454_n.jpg',
        '336667950_119612614383911_8062325474585159772_n.jpg',
        '336656236_766126878150860_9098380707681105040_n.jpg',
        '336667696_234988298908273_1641758200639588369_n.jpg',
        '336684780_142675165398110_8067823562962813756_n.jpg',
        '336266183_915385683119304_3861849276144916421_n.jpg',
        '336666346_4707202412737781_6215629370125263687_n.jpg',
        '336684975_1913471345658354_3154895588881033500_n.jpg',
        '335961604_604650441210152_7106128039696942614_n.jpg',
        '335882310_3449070515362794_3280548594294685753_n.jpg',
        '336316586_750359263205051_2756312997443357644_n.jpg',
        '336674250_753327662814846_2641523332568055451_n.jpg',
        '336297530_950047819355936_4517284952849741471_n.jpg',
        '336691355_632290118736519_6503142910494485489_n.jpg',
        '335901939_766052431732612_5875466340999170832_n.jpg',
        '336711580_1585184991965159_4310689622540273203_n.jpg',
        '337162944_185358050911977_5900616430987483259_n.jpg',
        '336789099_660116592587266_9002399811374199872_n.jpg',
        '336685013_2302718406555401_567330633126317268_n.jpg',
        '336171877_239527908638853_1096718506812585601_n.jpg',
        '336715633_607204857567441_3351945680486592313_n.jpg',
        '336687822_139079575508074_8200155295119646176_n.jpg',
        '336718239_673877984743886_6622770382029739492_n.jpg',
        '336680479_3343132115949655_2981124215613708119_n.jpg',
        '336750062_913389329702518_5984372052677442701_n.jpg',
        '336063097_2113461725528403_2661058489504430332_n.jpg',
        '336729171_166611779529696_699877176901384714_n.jpg',
        '336290819_952966539401261_2441153009911748360_n.jpg',
        '336808079_199663719358442_1804192263172700662_n.jpg',
        '336015509_968208324343240_2519319371531513531_n.jpg',
        '336701624_961678514993372_7240169707729838171_n.jpg',
        '337041158_1295296694669897_568436624742438446_n.jpg',
        '336672873_221674877020978_5301409951323108800_n.jpg',
        '336369273_2162709050606076_2712177000947236947_n.jpg',
        '336258596_225185590023651_4422392049451372602_n.jpg',
        '335212617_1158952644791169_7515966396538519910_n.jpg',
        '336185582_570276584900402_215336482550033137_n.jpg',
        '337553733_1567698557068023_5253580134123767824_n.jpg',
        '336858716_168689662670014_3133368358322794688_n.jpg',
        '336703270_533167062065088_4731392396248999060_n.jpg',
        '336764452_176660378068233_1533643561167049393_n.jpg',
        '336784602_738615721141920_3192213748489380200_n.jpg',
        '336243264_723378926188473_8521992839631096549_n.jpg',
        '334260880_228007996407132_6627816081018148531_n.jpg',
        '336887228_5992593707528436_79540977491608117_n.jpg',
        '335468670_1260237594891001_8091418490563382215_n.jpg',
        '335604270_210969164850025_2156326593373455715_n.jpg',
        '335435572_722770172732168_2662793417605641538_n.jpg',
        '336359702_177949441682647_3586049748775209708_n.jpg',
        '335475717_948058113037392_3601966367815037939_n.jpg',
        '335505692_236204028774178_33620599541174331_n.jpg',
        '335321530_916862912787875_8436336489668926643_n.jpg',
        '335643687_749887093154860_1980544170864213629_n.jpg',
        '335491533_599155735121785_7255118923199963865_n.jpg',
        '335618485_930689711506133_7688934387040500483_n.jpg',
        '335591842_917499266113127_5949732012956730407_n.jpg',
        '335386015_793931171572557_6238388878188696181_n.jpg',
        '336380214_2590644861098895_4420323264036266998_n.jpg',
        '335630218_1822432318156662_922523340009815959_n.jpg',
        '335467019_883670979590858_7143618453487451052_n.jpg',
        '335601638_912798633324405_4258960558168466384_n.jpg',
        '336245252_1172048103506437_3215116668220757235_n.jpg',
        '335446895_6469974826365748_4115457297585428536_n.jpg',
        '335199756_236050518875063_8636652643979224631_n.jpg',
        '335438646_1215021832707213_4759952898870754928_n.jpg',
        '335385508_178586494964100_2307436057003651005_n.jpg',
        '335373417_228167643109830_6909950894335291895_n.jpg',
        '335410640_546339497481106_5567147376646784205_n.jpg',
        '335082757_1586156858518830_7703954453739625493_n.jpg',
        '336295428_234780985665411_4637742604443611801_n.jpg',
        '335314019_668803108385404_2952001363731207542_n.jpg',
        '335495706_875280920585820_509566660378290563_n.jpg',
        '335469065_733939661441567_724949036845814446_n.jpg',
        '336169033_146380085020438_5293134724950868824_n.jpg'
    ];

    // Create gallery items for each image
    const imagePromises = images.map(filename => {
        return new Promise((resolve) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = `../public/Nosecone/${filename}`;
            img.alt = 'Nosecone Sculpture';
            
            const caption = document.createElement('p');
            caption.textContent = 'Nosecone Sculpture';
            
            galleryItem.appendChild(img);
            galleryItem.appendChild(caption);
            galleryContainer.appendChild(galleryItem);

            // Resolve the promise when the image is loaded
            img.onload = () => resolve();
            img.onerror = () => resolve(); // Resolve even if image fails to load
        });
    });

    // Wait for all images to load before attaching click events
    Promise.all(imagePromises).then(() => {
        attachGalleryClickEvents();
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
                <img src="../public/Nosecone/${images[index]}" class="lightbox-img" alt="Nosecone Sculpture">
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
        if (img) img.src = `../public/Nosecone/${images[currentIndex]}`;
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
}); 