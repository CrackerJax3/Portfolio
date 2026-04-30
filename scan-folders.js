// Run with: npm run scan
// Scans Gallery/photos/, each project's gallery/, and hero-banner/ for media files.
// Run this before pushing whenever you add or remove photos.

import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';

const MEDIA_EXTS = new Set([
    '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif',
    '.JPG', '.JPEG', '.PNG', '.WEBP', '.GIF',
    '.mp4', '.webm', '.MP4', '.WEBM',
]);

function scanDir(dir) {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        return [];
    }
    return readdirSync(dir)
        .filter(f => MEDIA_EXTS.has(extname(f)))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

// --- Gallery ---
const galleryFiles = scanDir('Gallery/photos');
writeFileSync('Gallery/photos/manifest.json', JSON.stringify(galleryFiles, null, 2));
writeFileSync('Gallery/gallery-data.js', `window.GALLERY_FILES=${JSON.stringify(galleryFiles)};\n`);
console.log(`Gallery: ${galleryFiles.length} file(s) → Gallery/photos/manifest.json + Gallery/gallery-data.js`);

// --- Per-project galleries ---
const PROJECTS = [
    'Nosecone Project',
    'Fibonacci Project',
    'SawySawy Robot Hand',
    'SawySawy CNC Plasma Cutter',
    'Floor Piano',
    'DIY Home Solar',
    'MOA Crew Painting with Reid Stowe',
    'Starship Schooner Anne',
    'Colossal Sculpture with Sergio Furnari',
    'Corbusier Saudi Style Sofa',
    'Life Sized Voronoi Arabian Leopard',
    '2m Tall Voronoi Camel',
];
for (const project of PROJECTS) {
    const dir = join(project, 'gallery');
    const files = scanDir(dir);
    if (!existsSync(dir)) continue;
    writeFileSync(join(dir, 'manifest.json'), JSON.stringify(files, null, 2));
    console.log(`${project}: ${files.length} file(s) → ${dir}/manifest.json`);
}

// --- Hero Banner ---
const bannerFiles = scanDir('hero-banner');
const bannerMedia = bannerFiles.filter(f => MEDIA_EXTS.has(extname(f)));
writeFileSync('hero-banner/manifest.json', JSON.stringify(bannerMedia, null, 2));
console.log(`Hero banner: ${bannerMedia.length} file(s) → hero-banner/manifest.json`);
if (bannerMedia.length) console.log('  ' + bannerMedia[0] + (bannerMedia.length > 1 ? ` (using first of ${bannerMedia.length})` : ''));
