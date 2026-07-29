const fs = require('fs');
const configStr = fs.readFileSync('tailwind.config.js', 'utf8');

const colorsBlockMatch = configStr.match(/"colors":\s*\{([\s\S]*?)\}/);
if (colorsBlockMatch) {
  const lines = colorsBlockMatch[1].split(',');
  const newLines = [];
  const rootVars = [];

  lines.forEach(line => {
    const match = line.match(/"([^"]+)":\s*"([^"]+)"/);
    if (match) {
      const key = match[1];
      const val = match[2];
      newLines.push(`        "${key}": "var(--color-${key})"`);
      rootVars.push(`  --color-${key}: ${val};`);
    }
  });

  const newColorsBlock = '"colors": {\n' + newLines.join(',\n') + '\n      }';
  const newConfigStr = configStr.replace(colorsBlockMatch[0], newColorsBlock);
  fs.writeFileSync('tailwind.config.js', newConfigStr);

  let cssStr = fs.readFileSync('src/index.css', 'utf8');
  cssStr = cssStr.replace('@theme {', ':root {\n' + rootVars.join('\n') + '\n}\n\n@theme {');
  fs.writeFileSync('src/index.css', cssStr);
  console.log('Successfully extracted colors to variables!');
}
