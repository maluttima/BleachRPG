const fs = require('fs');

['templates_builder.js', 'templates_part1_builder.js', 'templates_part2_builder.js', 'templates_part3_builder.js'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace \` with `
  content = content.replace(/\\`/g, '`');
  // Replace \${ with ${
  content = content.replace(/\\\${/g, '${');
  fs.writeFileSync(file, content);
  console.log(`Cleaned escaping in ${file}`);
});
