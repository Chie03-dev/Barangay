const fs = require('fs');
let s = fs.readFileSync('d:/Developers/Projects/Barangay/src/app/login/page.tsx', 'utf8');

// Fix 1: Remove blank line after tabIndex removal
s = s.replace(/\r?\n\s+\r?\n/g, '\r\n');

// Fix 2: Replace the broken className block with proper one
const oldBtn = `            className={cn(
                "group relative h-1 w-8 overflow-hidden rounded-full bg-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-white/25",
                i === slide && "bg-white/60 dark:bg-white/40"
              )}`;

const newBtn = `            className={cn(
                "group relative h-1 w-8 overflow-hidden rounded-full bg-white/45 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:bg-white/25",
                i === slide && "bg-white/60 dark:bg-white/40"
              )}`;

// Actually the above is the same - the issue is the code was already correct
// Let me just verify the file is valid TypeScript

console.log('done');
