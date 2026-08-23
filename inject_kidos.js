const fs = require('fs');

let rawJsx = fs.readFileSync('kidos_view_template.jsx', 'utf8');

// Escape backticks and ${}
const escapedJsx = rawJsx
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

let genApp = fs.readFileSync('generate_app.js', 'utf8');

const startMarker = "// TAB: KIDŌS CATALOG & ZANPAKUTŌ SWORD VISUALIZER\nfunction KidosView({";
const endMarker = "// TAB: ARENA PVP VIEW\nfunction ArenaView({";

const idxStart = genApp.indexOf(startMarker);
const idxEnd = genApp.indexOf(endMarker);

if (idxStart === -1 || idxEnd === -1) {
  console.error("Start or End marker not found in generate_app.js!", { idxStart, idxEnd });
  process.exit(1);
}

genApp = genApp.slice(0, idxStart) + escapedJsx + "\n\n" + genApp.slice(idxEnd);

// Fix any leftover unsafe references
genApp = genApp.replace(/personagem\.zanpakuto\.shikaiAtiva\.espirito/g, 'personagem?.zanpakuto?.shikaiAtiva?.espirito');
genApp = genApp.replace(/personagem\.zanpakuto\.bankaiAtiva\.espirito/g, 'personagem?.zanpakuto?.bankaiAtiva?.espirito');

fs.writeFileSync('generate_app.js', genApp);
console.log("Successfully replaced KidosView with the clean, protected 75+ Kidō component!");
