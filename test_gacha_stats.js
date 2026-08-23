const fs = require('fs');

const code = fs.readFileSync('generate_app.js', 'utf8');
const match = code.match(/const RECOMPENSAS_ESPECIAIS = (\[[\s\S]*?\]);/);
const C = { green: '#5FA96B', blue: '#4FB3E8', purple: '#8B6FD6', yellow: '#E0B34C', orange: '#FF6A13' };
const RECOMPENSAS_ESPECIAIS = eval(match[1]);

const totalPeso = RECOMPENSAS_ESPECIAIS.reduce((acc, r) => acc + (r.peso || 1), 0);
console.log('Total weight sum:', totalPeso);

const counts = {};
RECOMPENSAS_ESPECIAIS.forEach(r => counts[r.id] = 0);

const TRIALS = 100000;
for (let i = 0; i < TRIALS; i++) {
  let roll = Math.random() * totalPeso;
  let escolhida = RECOMPENSAS_ESPECIAIS[0];
  for (const r of RECOMPENSAS_ESPECIAIS) {
    if (roll < (r.peso || 1)) {
      escolhida = r;
      break;
    }
    roll -= (r.peso || 1);
  }
  counts[escolhida.id]++;
}

console.log('--- GACHA ESPECIAL: SIMULAÇÃO DE 100.000 ROLAGENS ---');
RECOMPENSAS_ESPECIAIS.forEach(r => {
  const pct = (counts[r.id] / TRIALS * 100).toFixed(2);
  const expected = (r.peso / totalPeso * 100).toFixed(2);
  console.log(`[${r.raridade}] ${r.nome}: ${pct}% (Esperado: ${expected}%)`);
});
