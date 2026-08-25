const fs = require('fs');

console.log("=================================================");
console.log("🧪 BLEACH RPG TEST SUITE: AI SCENE ANALYSIS & PLOT ENGINE");
console.log("=================================================\n");

const engine = require('./spiritual_engine.js');

// 1. Test Individual Scene Semantic Analysis & 3-Branch Plots
console.log("1️⃣ Testing Individual Scene Semantic Analysis & Multi-Branch AI Generation...");

const testPlayer = {
  id: "ren-001",
  nome: "Kurosaki Ren",
  whatsapp: "11988887777",
  codigoAtividade: "ACT-7777",
  esquadrao: "11º Esquadrão",
  raca: "Shinigami",
  atributos: { pressao: 45, forca: 30, velocidade: 60, resiliencia: 25 },
  zanpakuto: {
    nome: "Zabimaru",
    shikaiAtiva: { nome: "Zabimaru", comando: "Uive" }
  }
};

const testCenas = [
  {
    id: "c1",
    titulo: "Batalha contra Hollows no Distrito 78 de Rukongai",
    texto: "A noite cobria o Distrito 78 de Rukongai com uma névoa densa. Das sombras das casas arruinadas, um Adjuchas mascarado rugiu disparando garras de trevas e corrosão. Kurosaki Ren saltou velozmente com seu Shunpo, desembainhou sua espada e gritou 'Uive Zabimaru!', desferindo um corte de aço flamejante que partiu a máscara do Hollow em pedaços!",
    data: "24/08/2026 às 22:30"
  }
];

const indivResult = engine.sintetizarTramaIndividualHeuristica(testPlayer, testCenas);

if (!indivResult || !indivResult.analiseCenas || !Array.isArray(indivResult.opcoesTramas)) {
  console.error("❌ Failed to synthesize individual plots!");
  process.exit(1);
}

console.log("   ✓ Scene Analysis Diagnostic:", indivResult.analiseCenas.oponentePrincipal, "em", indivResult.analiseCenas.localPrincipal);
console.log("   ✓ Extracted Elements:", indivResult.analiseCenas.elementosDetectados.join(", "));
console.log("   ✓ Generated Options Count:", indivResult.opcoesTramas.length);

if (indivResult.opcoesTramas.length !== 3) {
  console.error("❌ Expected 3 plot options, got:", indivResult.opcoesTramas.length);
  process.exit(1);
}

indivResult.opcoesTramas.forEach((op, idx) => {
  console.log(`   - Opção ${idx + 1}: ${op.nomeOpcao} (Eventos: ${op.eventos.length}, Antagonista: ${op.antagonista.nome})`);
  if (!op.briefingWhatsApp || !op.briefingWhatsApp.includes("𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗔𝗥𝗖𝗢")) {
    console.error("❌ WhatsApp briefing formatting error in option", idx + 1);
    process.exit(1);
  }
});
console.log("   ✅ Individual Plot Engine & Scene Analysis OK!\n");

// 2. Test Joint Multi-Player Plots
console.log("2️⃣ Testing Joint Multi-Player Plot Generation...");

const testPlayer2 = {
  id: "ken-002",
  nome: "Unohana Maya",
  whatsapp: "11999998888",
  codigoAtividade: "ACT-8888",
  esquadrao: "4º Esquadrão",
  raca: "Shinigami",
  atributos: { pressao: 80, forca: 15, velocidade: 40, resiliencia: 50 },
  zanpakuto: {
    nome: "Minazuki",
    shikaiAtiva: { nome: "Minazuki", comando: "Cure" }
  }
};

const jointCenas = [
  {
    id: "jc1",
    autorNome: "Kurosaki Ren",
    titulo: "Socorro em Karakura",
    texto: "Ren enfrentava múltiplos Menos Grande quando Maya chegou canalizando o Kaidō #6 Seika para purificar as toxinas do solo.",
    data: "24/08/2026"
  }
];

const jointResult = engine.sintetizarTramaConjuntaHeuristica([testPlayer, testPlayer2], jointCenas);

if (!jointResult || !Array.isArray(jointResult.opcoesTramas) || jointResult.opcoesTramas.length !== 3) {
  console.error("❌ Failed to synthesize joint plots!");
  process.exit(1);
}

console.log("   ✓ Joint Dynamic:", jointResult.opcoesTramas[0].dinamicaDupla);
console.log("   ✓ Generated Joint Options Count:", jointResult.opcoesTramas.length);
jointResult.opcoesTramas.forEach((op, idx) => {
  console.log(`   - Opção Conjunta ${idx + 1}: ${op.nomeOpcao} (Fases: ${op.eventosCruzados.length})`);
});
console.log("   ✅ Joint Plot Engine OK!\n");

// 3. Test Patch Notes 6.6
console.log("3️⃣ Testing Patch Notes Registry...");
const patchnotes = fs.readFileSync('patchnotes_data.js', 'utf8');
if (!patchnotes.includes('versao: "6.6"') && !patchnotes.includes("versao: '6.6'")) {
  console.error("❌ Patch Notes 6.6 not found!");
  process.exit(1);
}
console.log("   ✅ Patch Notes 6.6 verified!\n");

console.log("=================================================");
console.log("🌟 ALL AI PLOT & SCENE ANALYSIS TESTS PASSED WITH 100% SUCCESS!");
console.log("=================================================");
