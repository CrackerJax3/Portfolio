// Run with: npm run scan
// Scans Gallery/photos/ and hero-banner/ for media files and writes manifest.json
// Run this before pushing whenever you add or remove photos.

import { readdirSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { extname } from 'path';

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
console.log(`Gallery: ${galleryFiles.length} file(s) → Gallery/photos/manifest.json`);
if (galleryFiles.length) console.log('  ' + galleryFiles.join('\n  '));

// --- Hero Banner ---
const bannerFiles = scanDir('hero-banner');
const bannerMedia = bannerFiles.filter(f => MEDIA_EXTS.has(extname(f)));
writeFileSync('hero-banner/manifest.json', JSON.stringify(bannerMedia, null, 2));
console.log(`Hero banner: ${bannerMedia.length} file(s) → hero-banner/manifest.json`);
if (bannerMedia.length) console.log('  ' + bannerMedia[0] + (bannerMedia.length > 1 ? ` (using first of ${bannerMedia.length})` : ''));
