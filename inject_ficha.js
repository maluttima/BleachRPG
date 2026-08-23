const fs = require('fs');

let rawJsx = fs.readFileSync('ficha_view_template.jsx', 'utf8');

// Properly escape backticks and ${} for insertion into generate_app.js's master template string
const escapedJsx = rawJsx
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

let genApp = fs.readFileSync('generate_app.js', 'utf8');

const startMarker = "// TAB: FICHA DO JOGADOR\nfunction FichaView({";
const endMarker = "// TAB: ADMIN CONTROL PANEL\nfunction AdminPanel({";

const idxStart = genApp.indexOf(startMarker);
const idxEnd = genApp.indexOf(endMarker);

if (idxStart === -1 || idxEnd === -1) {
  console.error("Start or End marker not found in generate_app.js!");
  process.exit(1);
}

genApp = genApp.slice(0, idxStart) + escapedJsx + "\n\n" + genApp.slice(idxEnd);

fs.writeFileSync('generate_app.js', genApp);
console.log("Successfully injected escaped FichaView into generate_app.js!");
