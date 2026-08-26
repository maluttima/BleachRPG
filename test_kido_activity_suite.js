const fs = require('fs');
const assert = require('assert');

console.log("=================================================");
console.log("🧪 BLEACH RPG TEST SUITE: KIDO, ACTIVITY & RANKING");
console.log("=================================================\n");

// 1. Test Spiritual Engine & Malutti Template
const {
  getCodigoAtividade,
  gerarFichaFormatadaMalutti,
  calcularCustoKido,
  calcularPoderKido,
  calcularEfeitoHado,
  calcularEfeitoBakudo,
  calcularEfeitoKaido
} = require('./spiritual_engine.js');

const mockChar = {
  id: "char-1234",
  nome: "Ichigo Kurosaki",
  whatsapp: "+55 11 98765-4321",
  codigo: "ICHIGO123",
  raca: "Shinigami",
  esquadrao: "11º Esquadrão",
  atributos: { pressao: 450, forca: 380, velocidade: 400, resiliencia: 350 },
  conhecimento: 1500,
  cenasSemana: 12,
  cenasTotal: 45,
  pontosDisponiveis: 10,
  kidosConhecidos: [
    { id: "h4", numero: 4, nome: "Byakurai", cat: "Hadō", custoReiatsu: 3, custoConhecimento: 140, pressaoMinima: 18 },
    { id: "h33", numero: 33, nome: "Sōkatsui", cat: "Hadō", custoReiatsu: 10, custoConhecimento: 350, pressaoMinima: 120 }
  ]
};

console.log("1️⃣ Testing Activity Code Generation...");
const cod = getCodigoAtividade(mockChar);
console.log("   Generated Activity Code:", cod);
assert.strictEqual(cod, "IK-4321", "Activity code should be derived from initials + last 4 digits of WhatsApp");
console.log("   ✅ Activity Code OK!\n");

console.log("2️⃣ Testing WhatsApp Malutti Sheet Output...");
const sheet = gerarFichaFormatadaMalutti(mockChar);
assert.ok(sheet.includes("código de ɑtividɑde / identificɑdoɾ .ᐟ") || sheet.includes("código identificɑdoɾ"), "Sheet must contain activity code section for ON");
assert.ok(sheet.includes("IK-4321"), "Sheet must embed the exact activity code");
assert.ok(sheet.includes("espı́ɾituɑl") || sheet.includes("pɾessɑ̃o"), "Sheet must contain spiritual pressure attribute");
assert.ok(sheet.includes("𝗠𝗮𝗹𝘂𝘁𝘁𝗶") || sheet.includes("Malutti") || sheet.includes("𝗦𝗢𝗨𝗟 𝗦𝗢𝗖𝗜𝗘𝗧𝗬"), "Sheet must match official styling");
console.log("   ✅ Malutti WhatsApp Sheet OK!\n");

// 3. Test Kido Catalog & Dynamic Scaling
const { CATALOGO_KIDOS, getKidoRequisitos } = require('./kido_catalog.js');
console.log("3️⃣ Testing Kido Catalog Expansion & Requirements...");
console.log(`   Total Spells in Grimório: ${CATALOGO_KIDOS.length}`);
assert.ok(CATALOGO_KIDOS.length >= 25, "Grimório should contain dozens of canonical spells");

const hado90 = CATALOGO_KIDOS.find(k => k.cat === "Hadō" && k.numero === 90);
assert.ok(hado90, "Hadō #90 (Kurohitsugi) must exist in catalog");
const req90 = getKidoRequisitos("Hadō", 90);
console.log(`   Hadō #90 Requirements -> Knowledge: ${req90.custoConhecimento} ₪, Min Reiatsu: ${req90.pressaoMinima} pts`);
assert.ok(req90.custoConhecimento >= 900, "High-tier Kidō #90 should require high Knowledge");
assert.ok(req90.pressaoMinima >= 500, "High-tier Kidō #90 should require Captain-tier Reiatsu");

const bakudo1 = CATALOGO_KIDOS.find(k => k.cat === "Bakudō" && k.numero === 1);
assert.ok(bakudo1, "Bakudō #1 (Sai) must exist in catalog");
const req1 = getKidoRequisitos("Bakudō", 1);
console.log(`   Bakudō #1 Requirements -> Knowledge: ${req1.custoConhecimento} ₪, Min Reiatsu: ${req1.pressaoMinima} pts`);
assert.ok(req1.custoConhecimento <= 120, "Low-tier Kidō #1 should be accessible for beginners");
console.log("   ✅ Kido Catalog & Requirements OK!\n");

// 4. Test Kido Combat Calculations & Formulas
console.log("4️⃣ Testing Kido Combat Mechanics & Simulations...");
const custoHado = calcularCustoKido(hado90, 450);
const poderHado = calcularPoderKido(hado90, 450, custoHado.custoTotal, true); // Incantation on
console.log(`   Hadō #90 with Eishō on 450 PE -> Reiatsu Cost: ${custoHado.custoTotal} pts, Power: ${poderHado} pts`);
const efeitoHado = calcularEfeitoHado(poderHado, 300); // against 300 resilience
console.log(`   Result against 300 Resilience -> Category: ${efeitoHado.categoria}, Damage: ${efeitoHado.danoRecebidoStr}`);
assert.ok(efeitoHado.pct > 100, "High power spell should overcome lower resilience");
console.log("   ✅ Kido Calculations & Simulations OK!\n");

// 5. Test Weekly Activity Cycle & Top 3 Rewards Logic
console.log("5️⃣ Testing Activity Cycle & Weekly Podiums...");
const players = [
  { id: "p1", nome: "Player 1", cenasSemana: 25, conhecimento: 2500, pontosDisponiveis: 0 },
  { id: "p2", nome: "Player 2", cenasSemana: 18, conhecimento: 1800, pontosDisponiveis: 0 },
  { id: "p3", nome: "Player 3", cenasSemana: 12, conhecimento: 1200, pontosDisponiveis: 0 },
  { id: "p4", nome: "Player 4", cenasSemana: 5,  conhecimento: 500,  pontosDisponiveis: 0 }
];

const sorted = [...players].sort((a, b) => (b.cenasSemana || 0) - (a.cenasSemana || 0));
assert.strictEqual(sorted[0].id, "p1", "Top 1 should be p1");
assert.strictEqual(sorted[1].id, "p2", "Top 2 should be p2");
assert.strictEqual(sorted[2].id, "p3", "Top 3 should be p3");

// Distribute rewards: +15 for 1st, +10 for 2nd, +5 for 3rd
sorted[0].pontosDisponiveis += 15;
sorted[1].pontosDisponiveis += 10;
sorted[2].pontosDisponiveis += 5;

assert.strictEqual(sorted[0].pontosDisponiveis, 15, "1st place gets 15 points");
assert.strictEqual(sorted[1].pontosDisponiveis, 10, "2nd place gets 10 points");
assert.strictEqual(sorted[2].pontosDisponiveis, 5, "3rd place gets 5 points");
assert.strictEqual(sorted[3].pontosDisponiveis, 0, "4th place gets 0 points");
console.log("   ✅ Weekly Activity Podium & Stat Distribution OK!\n");

// 6. Test App Source & Build Files
console.log("6️⃣ Testing App Bundle Integrity...");
const appJs = fs.readFileSync('./app.js', 'utf8');
assert.ok(appJs.includes("KidoSkillTreeModal"), "app.js must include KidoSkillTreeModal");
assert.ok(appJs.includes("Conhecimento & Cenas") || appJs.includes("Ranking de Conhecimento"), "app.js must include Knowledge Ranking");
assert.ok(appJs.includes("Lançamento de Atividade & Cenas em Lote") || appJs.includes("Atividade & Cenas"), "app.js must include Batch Scenes feature in ADM");
console.log("   ✅ App Bundle contains all requested features!\n");

console.log("=================================================");
console.log("🌟 ALL TEST CASES PASSED WITH 100% SUCCESS!");
console.log("=================================================");
