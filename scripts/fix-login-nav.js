const fs = require('fs');
let s = fs.readFileSync('d:/Developers/Projects/Barangay/src/app/login/page.tsx', 'utf8');

// Remove the empty line left after deleting tabIndex
s = s.replace(/\n\s+\r?\n/g, '\r\n');

// Replace the button className with the enhanced version
const oldBtn = `            className="group relative h-1 w-8 overflow-hidden rounded-full bg-white/45 transition-all dark:bg-white/25"`;
const newBtn = `            className={cn(
                "group relative h-1 w-8 overflow-hidden rounded-full bg-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-white/25",
                i === slide && "bg-white/60 dark:bg-white/40"
              )}`;

s = s.replace(oldBtn, newBtn);

fs.writeFileSync('d:/Developers/Projects/Barangay/src/app/login/page.tsx', s);
console.log('done');
