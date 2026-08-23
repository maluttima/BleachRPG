const fs = require('fs');

let content = fs.readFileSync('generate_app.js', 'utf8');

// 1. Replace RARIDADES_COMUNS and RECOMPENSAS_ESPECIAIS definitions
const oldGachaDefStart = "// Gacha Rarities & Pools";
const oldGachaDefEnd = "// Official Kidō Catalog";

const newGachaDef = `// Gacha Rarities & Pools (Sistema Balanceado & Raro)
const RARIDADES_COMUNS = [
  { nome: "Comum (Básico)", peso: 650, min: 1, max: 2, cor: C.muted, desc: "+1 a +2 Pontos de Atributo ou recurso básico (65% de chance)", tipo: "pontos", chanceStr: "65%" },
  { nome: "Incomum", peso: 220, min: 3, max: 4, cor: C.green, desc: "+3 a +4 Pontos de Atributo ou tônico de Reishi (22% de chance)", tipo: "pontos", chanceStr: "22%" },
  { nome: "Rara", peso: 90, min: 5, max: 7, cor: C.blue, desc: "+5 a +7 Pontos de Atributo ou pergaminho de treino (9% de chance)", tipo: "pontos", chanceStr: "9%" },
  { nome: "Épica", peso: 35, min: 8, max: 11, cor: C.purple, desc: "+8 a +11 Pontos de Atributo ou essência condensada (3.5% de chance)", tipo: "pontos", chanceStr: "3.5%" },
  { nome: "Lendária", peso: 5, min: 14, max: 18, cor: C.yellow, desc: "+14 a +18 Pontos de Atributo ou bênção do Seireitei (0.5% de chance / 1 em 200)", tipo: "pontos", chanceStr: "0.5%" },
];

const RECOMPENSAS_ESPECIAIS = [
  // PRÊMIOS BÁSICOS / SIMPLES (60% do total)
  { 
    id: "esp-basico-1", 
    nome: "🌿 Frasco de Elixir do 4º Esquadrão", 
    raridade: "Comum Especial", 
    peso: 160, 
    cor: C.green, 
    desc: "Um frasco de Kaidō concentrado que revigora as fibras de Reiryoku (+4 pontos).", 
    tipo: "pontos", 
    valor: 4, 
    chanceStr: "16%" 
  },
  { 
    id: "esp-basico-2", 
    nome: "⚡ Pergaminho de Treino de Hohō", 
    raridade: "Comum Especial", 
    peso: 160, 
    cor: C.green, 
    desc: "Instruções táticas de passos relâmpago e mobilidade (+5 pontos).", 
    tipo: "pontos", 
    valor: 5, 
    chanceStr: "16%" 
  },
  { 
    id: "esp-basico-3", 
    nome: "🧪 Tônico de Reishi do 12º Esquadrão", 
    raridade: "Comum Especial", 
    peso: 150, 
    cor: C.green, 
    desc: "Um composto refinado pelo Departamento de Pesquisa e Desenvolvimento (+6 pontos).", 
    tipo: "pontos", 
    valor: 6, 
    chanceStr: "15%" 
  },
  { 
    id: "esp-basico-4", 
    nome: "🛡️ Selo Protetor da Sociedade das Almas", 
    raridade: "Comum Especial", 
    peso: 130, 
    cor: C.green, 
    desc: "Um amuleto defensivo que fortalece a estabilidade do Hakusui (+7 pontos).", 
    tipo: "pontos", 
    valor: 7, 
    chanceStr: "13%" 
  },

  // PRÊMIOS INTERMEDIÁRIOS (24% do total)
  { 
    id: "esp-inter-1", 
    nome: "💎 Fragmento Bruto de Cristal Espiritual", 
    raridade: "Incomum Especial", 
    peso: 90, 
    cor: C.blue, 
    desc: "Um cristal de alta densidade mineral que expande a reserva de Reiryoku (+8 pontos).", 
    tipo: "pontos", 
    valor: 8, 
    chanceStr: "9%" 
  },
  { 
    id: "esp-inter-2", 
    nome: "📜 Pergaminho de Zanjutsu de Elite", 
    raridade: "Incomum Especial", 
    peso: 80, 
    cor: C.blue, 
    desc: "Técnicas refinadas de esgrima de capitães ancestrais (+10 pontos).", 
    tipo: "pontos", 
    valor: 10, 
    chanceStr: "8%" 
  },
  { 
    id: "esp-inter-3", 
    nome: "🔮 Orbe de Condensação de Reiryoku", 
    raridade: "Incomum Especial", 
    peso: 70, 
    cor: C.blue, 
    desc: "Uma esfera perolada de energia espiritual pura concentrada (+12 pontos).", 
    tipo: "pontos", 
    valor: 12, 
    chanceStr: "7%" 
  },

  // PRÊMIOS RAROS (11% do total)
  { 
    id: "esp-raro-1", 
    nome: "✨ Super Bônus Espiritual de Classe Nobre", 
    raridade: "Rara Especial", 
    peso: 60, 
    cor: C.purple, 
    desc: "Uma expansão massiva de pressão espiritual digna de famílias nobres (+15 pontos livres).", 
    tipo: "pontos", 
    valor: 15, 
    chanceStr: "6%" 
  },
  { 
    id: "esp-raro-2", 
    nome: "📜 Fórmula de Kidō Avançado (Hadō #63 / Bakudō #62)", 
    raridade: "Rara Especial", 
    peso: 50, 
    cor: C.purple, 
    desc: "Fórmula de Kidō de alta patente concedendo 16 pontos livres para aprendizado ou atributos (+16 pontos).", 
    tipo: "kido", 
    valor: 16, 
    chanceStr: "5%" 
  },

  // PRÊMIOS LENDÁRIOS (4% do total / 1 em 25)
  { 
    id: "esp-lend-1", 
    nome: "⚔️ Comunicação Profunda — Despertar de Habilidade Shikai", 
    raridade: "Lendária", 
    peso: 25, 
    cor: C.orange, 
    desc: "Sintonia profunda com o espírito da Zanpakutō desbloqueando 20 pontos livres!", 
    tipo: "habilidade", 
    valor: 20, 
    chanceStr: "2.5%" 
  },
  { 
    id: "esp-lend-2", 
    nome: "📜 Pergaminho Proibido — Hadō Secreto #88 Hiryū Gekizoku", 
    raridade: "Lendária", 
    peso: 15, 
    cor: C.yellow, 
    desc: "Um dos feitiços mais destrutivos e restritos da Soul Society concedendo 24 pontos livres!", 
    tipo: "kido", 
    valor: 24, 
    chanceStr: "1.5%" 
  },

  // O GRANDE PRÊMIO TRANSCENDENTAL (EXATAMENTE 1% / 1 EM 100 ROLAGENS)
  { 
    id: "esp-transcendente", 
    nome: "🌟 MISSÃO NARRATIVA INDIVIDUAL — DESPERTAR DE PODER", 
    raridade: "Transcendente (1 em 100)", 
    peso: 10, 
    cor: "#FFFFFF", 
    desc: "O PRÊMIO MÁXIMO, MAIS DIFÍCIL E COBIÇADO DE TODO O RPG (Chance exata de 1 em 100 / 1%)! Uma missão narrativa individual exclusiva conduzida pessoalmente pela Administração para o seu personagem romper todos os limites e despertar um poder transcendental único!", 
    tipo: "missao_despertar", 
    valor: 35, 
    chanceStr: "1.0% (1 em 100)" 
  }
];

`;

const idx1 = content.indexOf(oldGachaDefStart);
const idx2 = content.indexOf(oldGachaDefEnd);

if (idx1 !== -1 && idx2 !== -1) {
  content = content.slice(0, idx1) + newGachaDef + content.slice(idx2);
  console.log("Updated Gacha drop tables and rarities!");
}

// 2. Replace girarSorteioEspecial logic with properly escaped template strings
const oldGirarStart = "function girarSorteioEspecial() {";
const oldGirarEnd = "function handleFotoUpload(e, tipo = \"perfil\") {";

const newGirarCode = `function girarSorteioEspecial() {
    if ((personagem.sorteiosEspeciaisRestantes || 0) <= 0) {
      alert("Você não possui giros de Sorteio Especial disponíveis.");
      return;
    }
    
    // Cálculo Ponderado Real com Base nos Pesos (Total = 1000)
    const totalPeso = RECOMPENSAS_ESPECIAIS.reduce((acc, r) => acc + (r.peso || 1), 0);
    let roll = Math.random() * totalPeso;
    let escolhida = RECOMPENSAS_ESPECIAIS[0];
    
    for (const r of RECOMPENSAS_ESPECIAIS) {
      if (roll < (r.peso || 1)) {
        escolhida = r;
        break;
      }
      roll -= (r.peso || 1);
    }
    
    const pontosGanhos = escolhida.valor || 0;
    
    let patch = {
      sorteiosEspeciaisRestantes: personagem.sorteiosEspeciaisRestantes - 1
    };
    if (pontosGanhos > 0) {
      patch.pontosDisponiveis = (personagem.pontosDisponiveis || 0) + pontosGanhos;
    }
    
    const drop = {
      id: uid(),
      data: nowStr(),
      nome: \\\`🌟 Sorteio Especial (\\\${escolhida.raridade}): \\\${escolhida.nome}\\\` + (pontosGanhos > 0 ? \\\` (+\\\${pontosGanhos} pts)\\\` : ''),
      cor: escolhida.cor
    };
    patch.sorteiosDrops = [drop, ...(personagem.sorteiosDrops || [])];
    
    updateChar(
      patch,
      \\\`🌟 Sorteio Especial: Conquistou [\\\${escolhida.nome}] (\\\${escolhida.raridade})!\\\`
    );
    
    setRewardModal({ 
      titulo: "SORTEIO DE CLASSE ESPECIAL!", 
      raridade: escolhida.raridade, 
      cor: escolhida.cor, 
      pontos: pontosGanhos, 
      desc: escolhida.desc, 
      nomeItem: escolhida.nome,
      chance: escolhida.chanceStr || ""
    });
    
    if (escolhida.tipo === 'missao_despertar') {
      playReiatsuSound('bankai');
    } else {
      playReiatsuSound('win');
    }
  }

  `;

const gIdx1 = content.indexOf(oldGirarStart);
const gIdx2 = content.indexOf(oldGirarEnd);

if (gIdx1 !== -1 && gIdx2 !== -1) {
  content = content.slice(0, gIdx1) + newGirarCode + content.slice(gIdx2);
  console.log("Updated girarSorteioEspecial with weighted probabilities!");
}

fs.writeFileSync('generate_app.js', content);
console.log("generate_app.js updated successfully!");
