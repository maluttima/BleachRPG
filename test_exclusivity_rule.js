const spiritualEngine = require('./spiritual_engine.js');

console.log("=========================================================================");
console.log("TESTING ZANPAKUTO EXCLUSIVITY & ANTI-SIMILARITY FILTERS");
console.log("=========================================================================");

// Mock existing characters in DB with claimed Zanpakutōs
const existingChars = [
  {
    id: "p-01",
    nome: "Kuchiki Byakuya",
    zanpakuto: {
      shikaiAtiva: {
        nome: "Senbonzakura",
        elemento: "Lâminas em Pétalas de Cerejeira & Vácuo",
        poder: "A lâmina se divide em mil pequenas lâminas que refletem a luz como pétalas de cerejeira."
      }
    }
  },
  {
    id: "p-02",
    nome: "Hitsugaya Tōshirō",
    zanpakuto: {
      shikaiAtiva: {
        nome: "Hyōrinmaru",
        elemento: "Gelo Espiritual & Dragão de Geada",
        poder: "Cria um dragão colossal de gelo e água que congela tudo o que toca."
      }
    }
  },
  {
    id: "p-03",
    nome: "Abarai Renji",
    zanpakuto: {
      shikaiAtiva: {
        nome: "Zabimaru",
        elemento: "Aço Articulado & Chicote Dentado",
        poder: "A lâmina se divide em seis segmentos que se estendem como chicote de longo alcance."
      }
    }
  }
];

const newChar = {
  id: "p-new",
  nome: "Kurosaki Shin",
  atributos: { pressao: 70, forca: 50, velocidade: 65, resiliencia: 40 },
  personalidade: {
    texto: "Guerreiro focado, leal e veloz.",
    virtudes: "Determinação inabalável",
    defeitos: "Orgulho",
    desejos: "Superar limites",
    medos: "Perder quem ama",
    conflitos: "Honra vs Dever",
    estiloCombate: "Precisão e velocidade"
  }
};

// 1. Test prompt generation with blacklist
const dna = spiritualEngine.construirDnaEspiritual(newChar);
const prompt = spiritualEngine.construirPromptChatGPT(newChar, dna, "Despertar sob a chuva", existingChars, []);

console.log("✓ Prompt includes existing blacklist check:", prompt.includes("Senbonzakura") && prompt.includes("Hyōrinmaru") && prompt.includes("Zabimaru"));

// 2. Test generation and similarity scores
const caminhos = spiritualEngine.gerar4CaminhosZanpakutoAI(newChar, existingChars, [], "Despertar sob a chuva");
console.log(`✓ 4 Caminhos Gerados: ${caminhos.length}`);

let allUnique = true;
caminhos.forEach((c, idx) => {
  existingChars.forEach(ex => {
    const sim = spiritualEngine.calcularIndiceSimilaridade(c.shikai, ex.zanpakuto.shikaiAtiva);
    console.log(`  Opção ${idx + 1} (${c.shikai.nome}) vs ${ex.zanpakuto.shikaiAtiva.nome}: Similaridade = ${sim}%`);
    if (sim >= 50) allUnique = false;
  });
});

if (allUnique) {
  console.log("\n=========================================================================");
  console.log("✓ SUCCESS: 100% EXCLUSIVITY CONFIRMED! Zero duplicate concepts or names.");
  console.log("=========================================================================");
} else {
  console.error("✗ FAILURE: Detected high similarity!");
  process.exit(1);
}
