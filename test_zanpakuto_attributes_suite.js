const assert = require('assert');
const vm = require('vm');
const fs = require('fs');

console.log("=== INICIANDO SUÍTE DE TESTES: ATRIBUTOS DA ZANPAKUTŌ & FORÇA X RESILIÊNCIA ===");

const {
  calcularAtributosZanpakuto,
  gerarCapacidadesTaticasZanpakuto,
  calcularRelacaoForcaResiliencia
} = require('./spiritual_engine.js');

// 1. TESTES DE CÁLCULO DE ATRIBUTOS DA ZANPAKUTO (SHIKAI)
console.log("\n[TESTE 1] Cálculo de Atributos da Zanpakutō (Shikai):");
const playerStats1 = { pressao: 50, forca: 40, velocidade: 60, resiliencia: 30 };
const zkStatsShikai = calcularAtributosZanpakuto(playerStats1, false);

assert.strictEqual(zkStatsShikai.controle, 152, "Controle Shikai incorreto");
assert.strictEqual(zkStatsShikai.alcance, 154, "Alcance Shikai incorreto");
assert.strictEqual(zkStatsShikai.corte, 144, "Corte Shikai incorreto");
assert.strictEqual(zkStatsShikai.resiliencia, 133, "Resiliência Shikai incorreta");
assert.strictEqual(zkStatsShikai.pressaoEspiritual, 146, "Pressão Espiritual Shikai incorreta");
assert.strictEqual(zkStatsShikai.isBankai, false, "Flag isBankai deve ser false");
assert.ok(zkStatsShikai.media >= 100, "Média Shikai deve ser >= 100");
assert.ok(zkStatsShikai.bonusAbsorcaoReiatsu > 0, "Bônus de absorção deve ser positivo");
assert.ok(zkStatsShikai.bonusDanoRessonancia > 0, "Bônus de ressonância deve ser positivo");
console.log("✓ Shikai Stats calculados perfeitamente:", zkStatsShikai);

// 2. TESTES DE CÁLCULO DE ATRIBUTOS DA ZANPAKUTO (BANKAI)
console.log("\n[TESTE 2] Cálculo de Atributos da Zanpakutō (Bankai):");
const zkStatsBankai = calcularAtributosZanpakuto(playerStats1, true);
assert.strictEqual(zkStatsBankai.isBankai, true, "Flag isBankai deve ser true");
assert.strictEqual(zkStatsBankai.controle, Math.round(152 * 2.8), "Controle Bankai incorreto");
assert.strictEqual(zkStatsBankai.alcance, Math.round(154 * 3.5), "Alcance Bankai incorreto");
assert.strictEqual(zkStatsBankai.corte, Math.round(144 * 3.2), "Corte Bankai incorreto");
assert.strictEqual(zkStatsBankai.resiliencia, Math.round(133 * 3.0), "Resiliência Bankai incorreta");
assert.strictEqual(zkStatsBankai.pressaoEspiritual, Math.round(146 * 3.5), "Pressão Espiritual Bankai incorreta");
console.log("✓ Bankai Stats calculados com escala correta:", zkStatsBankai);

// 3. TESTES DE PROGRESSÃO DE CAPACIDADES TÁTICAS (SHIKAI - ARCO / RANGED)
console.log("\n[TESTE 3] Progressão de Capacidades (Shikai Arco):");
const armaArco = { nome: "Gekkō Kyū", formatoArma: "Arco espiritual de Reishi lunar", elemento: "Luz Lunar" };

// Nível 1 apenas (média 150)
const capsShikai1 = gerarCapacidadesTaticasZanpakuto(armaArco, { media: 150 }, false);
assert.strictEqual(capsShikai1.totalNiveis, 5, "Total de níveis deve ser 5");
assert.strictEqual(capsShikai1.desbloqueadosCount, 1, "Apenas Nível 1 deve estar desbloqueado aos 150 pts");
assert.strictEqual(capsShikai1.niveis[0].desbloqueado, true, "Nível 1 deve estar desbloqueado");
assert.strictEqual(capsShikai1.niveis[1].desbloqueado, false, "Nível 2 deve estar bloqueado");
assert.ok(capsShikai1.niveis[1].descricao.includes("tipo de projétil") || capsShikai1.niveis[1].descricao.includes("flecha"), "Descrição tática do arco deve citar projétil/flecha");
console.log("✓ Shikai Arco Nível 1 desbloqueado e Nível 2 bloqueado corretamente.");

// Níveis 1, 2, 3 desbloqueados (média 450)
const capsShikai3 = gerarCapacidadesTaticasZanpakuto(armaArco, { media: 450 }, false);
assert.strictEqual(capsShikai3.desbloqueadosCount, 3, "Níveis 1, 2 e 3 devem estar desbloqueados aos 450 pts");
assert.strictEqual(capsShikai3.niveis[2].desbloqueado, true, "Nível 3 deve estar desbloqueado");
assert.strictEqual(capsShikai3.niveis[3].desbloqueado, false, "Nível 4 deve estar bloqueado");
console.log("✓ Shikai Arco Nível 3 desbloqueado aos 450 pts.");

// Todos os 5 níveis desbloqueados (média 1200)
const capsShikai5 = gerarCapacidadesTaticasZanpakuto(armaArco, { media: 1200 }, false);
assert.strictEqual(capsShikai5.desbloqueadosCount, 5, "Todos os 5 níveis devem estar desbloqueados aos 1200 pts");
assert.strictEqual(capsShikai5.proximoNivel, null, "Não deve haver próximo nível pendente no máximo");
console.log("✓ Shikai Maestria Máxima (5/5) desbloqueada.");

// 4. TESTES DE PROGRESSÃO DE CAPACIDADES TÁTICAS (BANKAI)
console.log("\n[TESTE 4] Progressão de Capacidades (Bankai):");
const bankaiArma = { nome: "Gekkō Kyū: Mugen Gekirin", elemento: "Luz Lunar Transcendental" };
const capsBankai = gerarCapacidadesTaticasZanpakuto(bankaiArma, { media: 650 }, true);
assert.strictEqual(capsBankai.totalNiveis, 4, "Bankai deve ter 4 níveis transcendentais");
assert.strictEqual(capsBankai.desbloqueadosCount, 2, "Níveis 1 e 2 devem estar desbloqueados aos 650 pts");
console.log("✓ Bankai Níveis 1 e 2 desbloqueados corretamente.");

// 5. TESTES DA RELAÇÃO FORÇA X RESILIÊNCIA
console.log("\n[TESTE 5] Relação Força X Resiliência:");
// Categoria 1: Bloqueio Perfeito (Resiliência >= Força)
const r1 = calcularRelacaoForcaResiliencia(100, 120);
assert.strictEqual(r1.categoria, "Bloqueio Perfeito / Absorção Total");
assert.strictEqual(r1.pct, 120);

// Categoria 2: Defesa Parcial (70% - 99%)
const r2 = calcularRelacaoForcaResiliencia(100, 80);
assert.strictEqual(r2.categoria, "Defesa Parcial / Dano Moderado");
assert.strictEqual(r2.pct, 80);

// Categoria 3: Ruptura de Guarda (40% - 69%)
const r3 = calcularRelacaoForcaResiliencia(100, 55);
assert.strictEqual(r3.categoria, "Ruptura de Guarda / Dano Severo");
assert.strictEqual(r3.pct, 55);

// Categoria 4: Colapso Devastador (< 40%)
const r4 = calcularRelacaoForcaResiliencia(100, 25);
assert.strictEqual(r4.categoria, "Sobrepujamento Devastador / Colapso Físico");
assert.strictEqual(r4.pct, 25);
console.log("✓ Todos os 4 patamares de Força x Resiliência validados com exatidão.");

// 6. TESTE DE INTEGRIDADE DO BUNDLE APP.JS
console.log("\n[TESTE 6] Validação de Execução do Bundle app.js:");
const appCode = fs.readFileSync('app.js', 'utf8');
assert.ok(appCode.length > 100000, "app.js deve ter conteúdo substancial");
assert.ok(appCode.includes("calcularAtributosZanpakuto"), "app.js deve conter calcularAtributosZanpakuto");
assert.ok(appCode.includes("gerarCapacidadesTaticasZanpakuto"), "app.js deve conter gerarCapacidadesTaticasZanpakuto");
assert.ok(appCode.includes("calcularRelacaoForcaResiliencia"), "app.js deve conter calcularRelacaoForcaResiliencia");
assert.ok(appCode.includes("CapacidadesZanpakutoModal"), "app.js deve conter CapacidadesZanpakutoModal");

console.log("✓ Bundle app.js contém todos os novos componentes e cálculos!");

console.log("\n=======================================================");
console.log("🎉 TODOS OS TESTES PASSARAM COM 100% DE SUCESSO!");
console.log("=======================================================");
