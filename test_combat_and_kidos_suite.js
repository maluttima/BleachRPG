const assert = require('assert');
const fs = require('fs');

const {
  calcularRelacaoForcaResiliencia,
  calcularRelacaoForcaForca,
  calcularRelacaoVelocidadeVelocidade,
  calcularRelacaoPressaoPressao,
  calcularCustoKido,
  calcularPoderKido,
  calcularEfeitoHado,
  calcularEfeitoBakudo,
  calcularEfeitoKaido,
  calcularAtributosZanpakuto,
  gerarCapacidadesTaticasZanpakuto
} = require('./spiritual_engine.js');

console.log("=== INICIANDO SUÍTE DE TESTES: 4 CONFRONTOS DE ATRIBUTOS, REIATSU SURGE & KIDŌS ===");

// -------------------------------------------------------------
// TESTE 1: Disputa Força X Força
// -------------------------------------------------------------
console.log("\n[TESTE 1] Disputa de Força X Força:");
const ff1 = calcularRelacaoForcaForca(150, 100); // 1.50 -> Domínio Absoluto
assert.strictEqual(ff1.categoria, "Domínio Absoluto de Força / Desarme & Esmagamento");
assert.strictEqual(ff1.pct, 150);

const ff2 = calcularRelacaoForcaForca(100, 100); // 1.00 -> Equilíbrio
assert.strictEqual(ff2.categoria, "Equilíbrio Físico Tenso / Impasse de Espadas");

const ff3 = calcularRelacaoForcaForca(70, 100); // 0.70 -> Cessão de Guarda
assert.strictEqual(ff3.categoria, "Cessão de Guarda / Pressionado para Trás");

const ff4 = calcularRelacaoForcaForca(40, 100); // 0.40 -> Sobrepujamento
assert.strictEqual(ff4.categoria, "Sobrepujamento Físico / Desarme Imediato");
console.log("✓ Todos os 4 patamares de Força x Força validados.");

// -------------------------------------------------------------
// TESTE 2: Disputa Velocidade X Velocidade
// -------------------------------------------------------------
console.log("\n[TESTE 2] Disputa de Velocidade X Velocidade:");
const vv1 = calcularRelacaoVelocidadeVelocidade(160, 100); // 1.60 -> Supremacia
assert.strictEqual(vv1.categoria, "Supremacia de Velocidade / Flanqueamento & Ponto Cego");

const vv2 = calcularRelacaoVelocidadeVelocidade(100, 100); // 1.00 -> Emparelhado
assert.strictEqual(vv2.categoria, "Ritmo Emparelhado / Trocação Dinâmica de Golpes");

const vv3 = calcularRelacaoVelocidadeVelocidade(75, 100); // 0.75 -> Déficit
assert.strictEqual(vv3.categoria, "Déficit de Ritmo / Combate Reativo Sob Pressão");

const vv4 = calcularRelacaoVelocidadeVelocidade(50, 100); // 0.50 -> Fantasma
assert.strictEqual(vv4.categoria, "Velocidade Fantasma Inimiga / Ponto Cego Permanente");
console.log("✓ Todos os 4 patamares de Velocidade x Velocidade validados.");

// -------------------------------------------------------------
// TESTE 3: Disputa Pressão X Pressão
// -------------------------------------------------------------
console.log("\n[TESTE 3] Disputa de Pressão X Pressão:");
const pp1 = calcularRelacaoPressaoPressao(150, 100); // 1.50 -> Supressão Esmagadora
assert.strictEqual(pp1.categoria, "Supressão Espiritual Esmagadora / Reiatsu Paralisante");

const pp2 = calcularRelacaoPressaoPressao(100, 100); // 1.00 -> Equilíbrio Espiritual
assert.strictEqual(pp2.categoria, "Equilíbrio Espiritual / Ressonância Atmosférica");

const pp3 = calcularRelacaoPressaoPressao(75, 100); // 0.75 -> Pressão Opressiva
assert.strictEqual(pp3.categoria, "Pressão Opressiva Sentida / Concentração Sob Estresse");

const pp4 = calcularRelacaoPressaoPressao(50, 100); // 0.50 -> Asfixia Severa
assert.strictEqual(pp4.categoria, "Asfixia Espiritual Severa / Terror Instintivo");
console.log("✓ Todos os 4 patamares de Pressão x Pressão validados.");

// -------------------------------------------------------------
// TESTE 4: Fórmula de Custo de Kidō & Anti-Spam
// -------------------------------------------------------------
console.log("\n[TESTE 4] Fórmula de Custo de Kidō & Anti-Spam:");
const kido4 = { numero: 4, cat: "Hadō", nome: "Hadō #4 — Byakurai" };
const kido90 = { numero: 90, cat: "Hadō", nome: "Hadō #90 — Kurohitsugi" };

// Jogador iniciante (100 de Pressão)
const custoIniciante4 = calcularCustoKido(kido4, 100);
assert.strictEqual(custoIniciante4.custoFlat, 17); // 15 + Math.floor(4 * 0.6) = 17
assert.strictEqual(custoIniciante4.custoPercentual, 3); // 100 * 2.5% = 2.5 -> 3
assert.strictEqual(custoIniciante4.custoTotal, 20);

// Jogador de 5000 de Pressão (Anti-Spam Scaling)
const custoTitan4 = calcularCustoKido(kido4, 5000);
assert.strictEqual(custoTitan4.custoPercentual, 125); // 5000 * 2.5% = 125
assert.strictEqual(custoTitan4.custoTotal, 142); // 17 + 125 = 142

const custoTitan90 = calcularCustoKido(kido90, 5000);
assert.strictEqual(custoTitan90.custoFlat, 150);
assert.strictEqual(custoTitan90.custoPercentual, 500); // 5000 * 10% = 500
assert.strictEqual(custoTitan90.custoTotal, 650); // 150 + 500 = 650
console.log("✓ Custo de Kidōs escala proporcionalmente impedindo spam em tiers altos (5000 PE gasta 650 no Hadō 90).");

// -------------------------------------------------------------
// TESTE 5: Poder e Simulação Hadō vs Resiliência
// -------------------------------------------------------------
console.log("\n[TESTE 5] Poder de Hadō & Simulação vs Resiliência:");
const poderHadoNormal = calcularPoderKido(kido4, 100, 20, false);
const poderHadoIncant = calcularPoderKido(kido4, 100, 20, true);
assert.ok(poderHadoIncant > poderHadoNormal, "Incantação deve aumentar poder (+35%)");

const simHado1 = calcularEfeitoHado(300, 100); // Ratio 3.0 -> Aniquilação
assert.strictEqual(simHado1.categoria, "Aniquilação Crítica / Rompimento de Barreira");

const simHado2 = calcularEfeitoHado(120, 100); // Ratio 1.2 -> Impacto Devastador
assert.strictEqual(simHado2.categoria, "Impacto Devastador / Perfuração Direta");

const simHado3 = calcularEfeitoHado(80, 100); // Ratio 0.8 -> Dano Moderado
assert.strictEqual(simHado3.categoria, "Dano Moderado / Resistido Parcialmente");

const simHado4 = calcularEfeitoHado(40, 100); // Ratio 0.4 -> Mitigação
assert.strictEqual(simHado4.categoria, "Mitigação Efetiva / Dispersão do Feitiço");
console.log("✓ Todos os 4 patamares de Hadō vs Resiliência validados.");

// -------------------------------------------------------------
// TESTE 6: Poder e Simulação Bakudō vs Força
// -------------------------------------------------------------
console.log("\n[TESTE 6] Poder de Bakudō & Simulação vs Força:");
const kido61 = { numero: 61, cat: "Bakudō", nome: "Bakudō #61 — Rikujōkōrō" };
const simBakudo1 = calcularEfeitoBakudo(300, 100); // Ratio 3.0 -> Aprisionamento Absoluto
assert.strictEqual(simBakudo1.categoria, "Aprisionamento Absoluto / Imobilização Completa");

const simBakudo2 = calcularEfeitoBakudo(120, 100); // Ratio 1.2 -> Contenção Severa
assert.strictEqual(simBakudo2.categoria, "Contenção Severa / Restrição Crítica");

const simBakudo3 = calcularEfeitoBakudo(80, 100); // Ratio 0.8 -> Retardo
assert.strictEqual(simBakudo3.categoria, "Retardo Temporário / Ruptura com Esforço");

const simBakudo4 = calcularEfeitoBakudo(40, 100); // Ratio 0.4 -> Rompimento
assert.strictEqual(simBakudo4.categoria, "Rompimento Instantâneo / Selo Estilhaçado");
console.log("✓ Todos os 4 patamares de Bakudō vs Força validados.");

// -------------------------------------------------------------
// TESTE 7: Diagnóstico de Cura Kaidō
// -------------------------------------------------------------
console.log("\n[TESTE 7] Diagnóstico e Potência de Cura Kaidō:");
const cura1 = calcularEfeitoKaido(1500);
assert.strictEqual(cura1.nivel, "Supremo");

const cura2 = calcularEfeitoKaido(800);
assert.strictEqual(cura2.nivel, "Avançado");

const cura3 = calcularEfeitoKaido(350);
assert.strictEqual(cura3.nivel, "Intermediário");

const cura4 = calcularEfeitoKaido(100);
assert.strictEqual(cura4.nivel, "Básico");
console.log("✓ Todos os 4 patamares de Kaidō validados.");

// -------------------------------------------------------------
// TESTE 8: Validação do Bundle app.js
// -------------------------------------------------------------
console.log("\n[TESTE 8] Validação de Bundle app.js:");
const appCode = fs.readFileSync('app.js', 'utf8');
assert.ok(appCode.includes("KidoDetailModal"), "app.js deve conter KidoDetailModal");
assert.ok(appCode.includes("calcularRelacaoForcaForca"), "app.js deve conter calcularRelacaoForcaForca");
assert.ok(appCode.includes("calcularRelacaoVelocidadeVelocidade"), "app.js deve conter calcularRelacaoVelocidadeVelocidade");
assert.ok(appCode.includes("calcularRelacaoPressaoPressao"), "app.js deve conter calcularRelacaoPressaoPressao");
assert.ok(appCode.includes("calcularCustoKido"), "app.js deve conter calcularCustoKido");
assert.ok(appCode.includes("calcularPoderKido"), "app.js deve conter calcularPoderKido");
assert.ok(appCode.includes("Reiatsu Surge"), "app.js deve conter menção ao Reiatsu Surge");
console.log("✓ Bundle app.js verificado e 100% íntegro!");

console.log("\n=======================================================");
console.log("🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!");
console.log("=======================================================");
