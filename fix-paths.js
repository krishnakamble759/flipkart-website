import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const jsFiles = [
    'src/js/main.js',
    'src/js/search-manager.js',
    'src/js/cart-manager.js',
    'src/js/product-list.js',
    'src/js/product-detail.js',
    'src/js/cart-handler.js'
];
files.push(...jsFiles);

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Fix broken window.location.href quotes in HTML attributes
    content = content.replace(/onclick="window\.location\.href\s*=\s*(['"]?)([^"]+)\1"/g, (match, p1, p2) => {
        let target = p2.toLowerCase().replace(/ /g, '-');
        if (target.startsWith('/')) target = '.' + target;
        if (!target.startsWith('.') && !target.startsWith('http')) target = './' + target;
        return `onclick="window.location.href='${target}'"`;
    });

    // 2. Fix src, href, data-link in HTML
    content = content.replace(/(src|href|data-link)=["']([^"']+)["']/g, (match, attr, path) => {
        // Skip external URLs and hashes
        if (path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto') || path.startsWith('tel') || path.startsWith('data:')) {
            return match;
        }

        let newPath = path.toLowerCase().replace(/ /g, '-');
        if (newPath.startsWith('/')) newPath = '.' + newPath;
        if (!newPath.startsWith('.') && !newPath.startsWith('http')) newPath = './' + newPath;

        return `${attr}="${newPath}"`;
    });

    // 3. Fix JS window.location.href assignments
    content = content.replace(/window\.location\.href\s*=\s*['"]([^'"]+)['"]/g, (match, path) => {
        if (path.startsWith('http')) return match;
        let newPath = path.toLowerCase().replace(/ /g, '-');
        if (newPath.startsWith('/')) newPath = '.' + newPath;
        if (!newPath.startsWith('.')) newPath = './' + newPath;
        return `window.location.href = '${newPath}'`;
    });

    // 4. Specifically fix home link for logo (incase it was index.html and got ./ added)
    // Actually the generic logic handles index.html -> ./index.html which is fine.

    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
});
