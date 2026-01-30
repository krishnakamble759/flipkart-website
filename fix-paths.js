import fs from 'fs';
import path from 'path';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.push('src/js/main.js');
files.push('src/js/search-manager.js');
files.push('src/js/cart-manager.js');

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace href="/...", src="/...", data-link='/...'
    // Handle both double and single quotes
    content = content.replace(/ href="\/(\w)/g, ' href="$1');
    content = content.replace(/ href='\/(\w)/g, " href='$1");
    content = content.replace(/ src="\/(\w)/g, ' src="$1');
    content = content.replace(/ src='\/(\w)/g, " src='$1");
    content = content.replace(/ data-link="\/(\w)/g, ' data-link="$1');
    content = content.replace(/ data-link='\/(\w)/g, " data-link='$1");

    // Specifically for JS files where it might be window.location.href = '/...'
    if (file.endsWith('.js')) {
        content = content.replace(/window\.location\.href\s*=\s*['"]\/(\w)/g, match => match.replace('/', ''));
    }

    // Fix the logo link specifically (if it's just href="/")
    content = content.replace(/ href="\/"/g, ' href="./index.html"');
    content = content.replace(/ href='\/'/g, " href='./index.html'");

    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
});
