const fs = require('fs');

let content = fs.readFileSync('generate_app.js', 'utf8');

const target = `            </div>

          </div>
        </Section>
      )}

      {/* GACHA REVEAL */}`;

const replacement = `            </div>

          </div>
        </Section>
        </div>
      )}

      {/* GACHA REVEAL */}`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('generate_app.js', content);
  console.log("Successfully fixed unclosed div in PerfilCharView!");
} else {
  console.log("Target pattern not found, checking with regex...");
  content = content.replace(/<\/Section>\s*\n\s*\)\}\s*\n\s*{\/\* GACHA REVEAL \*\//, `</Section>\n        </div>\n      }\n\n      {/* GACHA REVEAL */`);
  fs.writeFileSync('generate_app.js', content);
}
