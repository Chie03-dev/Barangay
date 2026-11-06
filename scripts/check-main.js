const fs = require('fs');
const pages = ['src/app/login/page.tsx','src/app/dashboard/page.tsx','src/app/contact/page.tsx','src/app/profile/page.tsx','src/app/officials/page.tsx','src/app/reports/page.tsx','src/app/services/page.tsx','src/app/track/page.tsx'];
pages.forEach(p => {
  try {
    let s = fs.readFileSync(p, 'utf8');
    let m = s.match(/<main[^>]*>/g);
    console.log(p + ':' + (m ? m.length : 0) + ' main elements');
    if (m) {
      m.forEach((x, i) => console.log('  match ' + i + ': ' + x.substring(0, 100)));
    }
  } catch (e) {
    console.log(p + ': ERROR - ' + e.message);
  }
});