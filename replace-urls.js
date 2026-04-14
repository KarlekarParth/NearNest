const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'client', 'src');

function findAndReplaceJSX(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            findAndReplaceJSX(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('https://nearnest-yewm.onrender.com')) {
                // Determine relative path to config.js based on file depth
                let relativePath = '';
                if (fullPath.includes('pages') || fullPath.includes('components')) {
                    relativePath = '../config';
                } else {
                    relativePath = './config';
                }
                
                // Note: Only insert import if not present
                if (!content.includes(`import { API_BASE_URL }`)) {
                    // find last import and insert after
                    const lastImportIndex = content.lastIndexOf('import ');
                    let endOfLastImport = content.indexOf('\n', lastImportIndex);
                    if (endOfLastImport === -1) endOfLastImport = lastImportIndex;
                    
                    content = content.slice(0, endOfLastImport + 1) + `import { API_BASE_URL } from '${relativePath}';\n` + content.slice(endOfLastImport + 1);
                }

                // Replace all hardcoded parts with template literal or just string concatenation if already inside template literals
                // Example: `http://localhost:5000/api/listings` -> `${API_BASE_URL}/api/listings`
                content = content.replace(/https:\/\/nearnest-yewm\.onrender\.com/g, '${API_BASE_URL}');
                
                // Need to ensure replace didn't break strings that weren't backticked
                // If it was '"http://localhost:5000/abc"', it will now be '"${API_BASE_URL}/abc"', which won't interpolate. 
                // We'll replace matching quotes with backticks.
                content = content.replace(/(['"])\$\{API_BASE_URL\}(.*?)\1/g, '`${API_BASE_URL}$2`');

                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

findAndReplaceJSX(targetDir);
console.log('✅ Replacement Complete');
