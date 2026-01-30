import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.push('src/js/main.js');
files.push('src/js/search-manager.js');
files.push('src/js/cart-manager.js');
files.push('src/js/product-list.js');
files.push('src/js/product-detail.js');

const assetFolders = ['Electronics', 'HP', 'Helmets', 'Lights', 'Microphone', 'Monitors', 'Monsoon', 'Namkeen', 'Toys'];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // 1. Fix absolute slashes to relative
    content = content.replace(/(href|src|data-link)=["']\/(\w)/g, '$1="./$2"');
    content = content.replace(/window\.location\.href\s*=\s*['"]\/(\w)/g, "window.location.href = './$1");

    // 2. Add ./ to relative links that don't have it
    content = content.replace(/(href|src|data-link)=["'](?!http|https|#|mailto|tel|\.|\/)([\w\-\.\?\&%=/]+)["']/g, '$1="./$2"');
    content = content.replace(/window\.location\.href\s*=\s*['"](?!http|https|\.|\/)([\w\-\.\?\&%=/]+)["']/g, "window.location.href = './$1'");

    // 3. Lowercase asset folder names in paths
    assetFolders.forEach(folder => {
        const regex = new RegExp(`(["'\\/])${folder}\\/`, 'gi'); // Case insensitive search
        content = content.replace(regex, (match, p1) => p1 + folder.toLowerCase() + '/');
    });

    // 4. Specifically fix home link
    content = content.replace(/href=["']\/["']/g, 'href="./index.html"');

    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
});
