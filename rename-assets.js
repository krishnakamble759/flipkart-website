import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

// 1. Lowercase EVERYTHING in public folder recursively
const publicDir = 'public';
const allFiles = walk(publicDir);

// Sort files by depth (deepest first) to avoid renaming parent before child
allFiles.sort((a, b) => b.split(path.sep).length - a.split(path.sep).length);

allFiles.forEach(file => {
    const dir = path.dirname(file);
    const base = path.basename(file);
    const lowerBase = base.toLowerCase().replace(/ /g, '-'); // Also replace spaces with dashes for safety
    if (base !== lowerBase) {
        const newPath = path.join(dir, lowerBase);
        fs.renameSync(file, newPath);
        console.log(`Renamed file: ${file} -> ${newPath}`);
    }
});

// Now lowercase the directories
function walkDirs(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            results.push(fullPath);
            results = results.concat(walkDirs(fullPath));
        }
    });
    return results;
}

const allDirs = walkDirs(publicDir);
allDirs.sort((a, b) => b.split(path.sep).length - a.split(path.sep).length);

allDirs.forEach(dirPath => {
    const parent = path.dirname(dirPath);
    const base = path.basename(dirPath);
    const lowerBase = base.toLowerCase().replace(/ /g, '-');
    if (base !== lowerBase) {
        const newPath = path.join(parent, lowerBase);
        fs.renameSync(dirPath, newPath);
        console.log(`Renamed dir: ${dirPath} -> ${newPath}`);
    }
});
