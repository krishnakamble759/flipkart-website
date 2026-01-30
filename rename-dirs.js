import fs from 'fs';
import path from 'path';

const publicDirPath = 'public';
const entries = fs.readdirSync(publicDirPath);

entries.forEach(entry => {
    const fullPath = path.join(publicDirPath, entry);
    if (fs.lstatSync(fullPath).isDirectory()) {
        const lowerName = entry.toLowerCase();
        if (entry !== lowerName) {
            const tempPath = path.join(publicDirPath, entry + '_temp');
            const targetPath = path.join(publicDirPath, lowerName);

            fs.renameSync(fullPath, tempPath);
            fs.renameSync(tempPath, targetPath);
            console.log(`Renamed ${entry} to ${lowerName}`);
        }
    }
});
