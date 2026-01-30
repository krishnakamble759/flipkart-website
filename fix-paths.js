import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.push('src/js/main.js');
files.push('src/js/search-manager.js');
files.push('src/js/cart-manager.js');
files.push('src/js/product-list.js');
files.push('src/js/product-detail.js');

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Fix absolute slashes first
    content = content.replace(/(href|src|data-link)=["']\/(\w)/g, '$1="./$2"');
    content = content.replace(/window\.location\.href\s*=\s*['"]\/(\w)/g, "window.location.href = './$1");

    // Add ./ to rel links in HTML attributes
    content = content.replace(/(href|src|data-link)=["'](?!http|https|#|mailto|tel|\.|\/)([\w\-\.\?\&%=]+)["']/g, '$1="./$2"');

    // Add ./ to window.location.href strings that don't have it
    content = content.replace(/window\.location\.href\s*=\s*['"](?!http|https|\.|\/)([\w\-\.\?\&%=]+)["']/g, "window.location.href = './$1'");

    // Specifically fix home link
    content = content.replace(/href=["']\/["']/g, 'href="./index.html"');

    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
});
