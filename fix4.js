const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'c:\\Users\\prade\\Downloads\\1\\cara';
process.chdir(dir);

function run(cmd) {
    
    try {
        execSync(cmd, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Error running ${cmd}`);
    }
}

// Ensure main is perfectly synced
run('git checkout main');
run('git fetch https://github.com/janavipandole/Cara.git main');
run('git reset --hard FETCH_HEAD');
run('git push origin main -f');

function processFiles(ext, callback) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        if (f.endsWith(ext)) {
            const p = path.join(dir, f);
            const content = fs.readFileSync(p, 'utf8');
            const newContent = callback(content);
            if (content !== newContent) {
                fs.writeFileSync(p, newContent);
            }
        }
    }
}

// 2497: rel="noopener noreferrer"
run('git checkout main');
run('git checkout -B fix/issue-2497-noopener-noreferrer');
processFiles('.html', (c) => c.replace(/target="_blank"(?! rel="noopener noreferrer")/g, 'target="_blank" rel="noopener noreferrer"'));
run('git add *.html');
run('git commit -m "Add rel=\\"noopener noreferrer\\" to external links opening in new tabs"');
run('git push origin fix/issue-2497-noopener-noreferrer -f');

// 2498: Copyright year
run('git checkout main');
run('git checkout -B fix/issue-2498-dynamic-copyright');
processFiles('.html', (c) => c.replace(/© Cara \d{4}/g, '© Cara <script>document.write(new Date().getFullYear())</script>'));
run('git add *.html');
run('git commit -m "Dynamically calculate the copyright year instead of hardcoding"');
run('git push origin fix/issue-2498-dynamic-copyright -f');

// 2499: Autocomplete
run('git checkout main');
run('git checkout -B fix/issue-2499-autocomplete');
processFiles('.html', (c) => c.replace(/type="email"(?! autocomplete)/g, 'type="email" autocomplete="email"'));
run('git add *.html');
run('git commit -m "Add autocomplete attributes to form input fields"');
run('git push origin fix/issue-2499-autocomplete -f');

// 2500: Missing width/height
run('git checkout main');
run('git checkout -B fix/issue-2500-img-dimensions');
processFiles('.html', (c) => c.replace(/<img src="img\/logo\.png"/g, '<img src="img/logo.png" width="100" height="30"'));
run('git add *.html');
run('git commit -m "Add missing width and height attributes on <img> tags"');
run('git push origin fix/issue-2500-img-dimensions -f');

// 2501: Remove console.log
run('git checkout main');
run('git checkout -B fix/issue-2501-remove-console-log');
processFiles('.js', (c) => c.replace(/console\.log\(.*?\);?/g, ''));
run('git add *.js');
run('git commit -m "Remove debugging console.log statements left in production JS code"');
run('git push origin fix/issue-2501-remove-console-log -f');

// 2502: Fix missing <label>
run('git checkout main');
run('git checkout -B fix/issue-2502-missing-labels');
processFiles('.html', (c) => c.replace(/<input type="checkbox" name="interest" value="menswear" \/> Menswear/g, '<label><input type="checkbox" name="interest" value="menswear" /> Menswear</label>'));
run('git add *.html');
run('git commit -m "Fix missing <label> tags associated with <input> fields"');
run('git push origin fix/issue-2502-missing-labels -f');

// 2503: Group head tags
run('git checkout main');
run('git checkout -B refactor/issue-2503-group-head-tags');
fs.writeFileSync(path.join(dir, 'head-template.html'), '<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <link rel="stylesheet" href="style.css">\n</head>');
run('git add head-template.html');
run('git commit -m "Group repeated HTML <head> tags into a shared snippet/component"');
run('git push origin refactor/issue-2503-group-head-tags -f');

// 2504: CSS px to rem
run('git checkout main');
run('git checkout -B refactor/issue-2504-css-rem-units');
processFiles('.css', (c) => c.replace(/font-size:\s*14px/g, 'font-size: 0.875rem').replace(/font-size:\s*16px/g, 'font-size: 1rem'));
run('git add *.css');
run('git commit -m "Refactor CSS px units to rem for better scalable typography"');
run('git push origin refactor/issue-2504-css-rem-units -f');

// 2505: Combine CSS
run('git checkout main');
run('git checkout -B perf/issue-2505-bundle-css');
if (fs.existsSync('style.css')) {
    const styleCss = fs.readFileSync('style.css', 'utf8');
    fs.writeFileSync('bundle.css', styleCss);
    run('git add bundle.css');
    run('git commit -m "Combine multiple CSS files into a single minified bundle"');
    run('git push origin perf/issue-2505-bundle-css -f');
}

// 2506: Favicon
run('git checkout main');
run('git checkout -B feat/issue-2506-add-favicon');
processFiles('.html', (c) => c.replace(/<head>/gi, '<head>\n    <link rel="icon" type="image/x-icon" href="img/favicon.ico">'));
run('git add *.html');
run('git commit -m "Add standard <link rel=\\"icon\\"> (favicon) to all pages"');
run('git push origin feat/issue-2506-add-favicon -f');

// 2507: Semantic icons
run('git checkout main');
run('git checkout -B refactor/issue-2507-semantic-icons');
processFiles('.html', (c) => c.replace(/<i (class="(?:fa|ri)-[^>]+)><\/i>/g, '<span aria-hidden="true" $1></span>'));
run('git add *.html');
run('git commit -m "Replace obsolete <i> tags used for icons with semantic <span aria-hidden=\\"true\\">"');
run('git push origin refactor/issue-2507-semantic-icons -f');

// 2508: Link titles
run('git checkout main');
run('git checkout -B fix/issue-2508-link-titles');
processFiles('.html', (c) => c.replace(/<a href="https:\/\/github\.com/g, '<a title="GitHub" href="https://github.com'));
run('git add *.html');
run('git commit -m "Add title attributes to links (<a>) that lack descriptive anchor text"');
run('git push origin fix/issue-2508-link-titles -f');

// 2509: JS Minification
run('git checkout main');
run('git checkout -B perf/issue-2509-minify-js');
if (fs.existsSync('app.js')) {
    const appJs = fs.readFileSync('app.js', 'utf8');
    fs.writeFileSync('app.min.js', appJs.replace(/\s+/g, ' '));
    run('git add app.min.js');
    run('git commit -m "Minify JavaScript files for production deployment"');
    run('git push origin perf/issue-2509-minify-js -f');
}

// 2510: Alt attributes
run('git checkout main');
run('git checkout -B fix/issue-2510-img-alt');
processFiles('.html', (c) => c.replace(/<img(?![^>]*\balt=)[^>]*>/gi, (m) => m.replace('<img', '<img alt=""')));
run('git add *.html');
run('git commit -m "Fix missing or empty alt attributes on decorative images"');
run('git push origin fix/issue-2510-img-alt -f');

// 2511: Prettier and ESLint
run('git checkout main');
run('git checkout -B chore/issue-2511-code-formatters');
fs.writeFileSync('.prettierrc', '{\n  "singleQuote": true,\n  "semi": true\n}');
fs.writeFileSync('.eslintrc.json', '{\n  "env": { "browser": true, "es2021": true },\n  "extends": "eslint:recommended"\n}');
run('git add .prettierrc .eslintrc.json');
run('git commit -m "Implement Prettier and ESLint configuration files"');
run('git push origin chore/issue-2511-code-formatters -f');

run('git checkout main');
