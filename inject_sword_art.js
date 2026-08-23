const fs = require('fs');

let rawJsx = fs.readFileSync('bleach_sword_art_template.jsx', 'utf8');

// Escape backticks and ${}
const escapedJsx = rawJsx
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

let genApp = fs.readFileSync('generate_app.js', 'utf8');

const targetBeforeFicha = "// TAB: FICHA DO JOGADOR\nfunction FichaView({";

if (!genApp.includes("function BleachSwordArt({")) {
  const idx = genApp.indexOf(targetBeforeFicha);
  if (idx === -1) {
    console.error("Target marker for FichaView not found in generate_app.js!");
    process.exit(1);
  }
  genApp = genApp.slice(0, idx) + escapedJsx + "\n\n" + genApp.slice(idx);
  fs.writeFileSync('generate_app.js', genApp);
  console.log("Successfully injected BleachSwordArt before FichaView in generate_app.js!");
} else {
  console.log("BleachSwordArt is already defined in generate_app.js");
}
