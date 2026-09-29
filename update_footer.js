const fs = require('fs');
const path = require('path');

const root = __dirname;
let updatedCount = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.html')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      const updated = original
        .replace(/&copy;\s*2023\s+All Rights Reserved by\s*<a href="#" class="copyright-link">Vishwakarma Art<\/a>\./gi, '&copy; 2026 All Rights Reserved by <a href="#" class="copyright-link">Vishwakarma Arts</a>.')
        .replace(/&copy;\s*2024\s+All Rights Reserved by\s*<a href="#" class="copyright-link">Vishwakarma Art<\/a>\./gi, '&copy; 2026 All Rights Reserved by <a href="#" class="copyright-link">Vishwakarma Arts</a>.')
        .replace(/&copy;\s*2024\s+All Rights Reserved by\s*<a href="#" class="copyright-link">Vishwakarma Arts<\/a>\./gi, '&copy; 2026 All Rights Reserved by <a href="#" class="copyright-link">Vishwakarma Arts</a>.')
        .replace(/&copy;\s*2023\s+All Rights Reserved by\s*<a href="#" class="copyright-link">Vishwakarma Arts<\/a>\./gi, '&copy; 2026 All Rights Reserved by <a href="#" class="copyright-link">Vishwakarma Arts</a>.');

      if (updated !== original) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        updatedCount++;
      }
    }
  }
}

walk(root);
console.log('updated_footer_pages=' + updatedCount);
