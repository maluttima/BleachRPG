const fs = require('fs');

console.log("Reading parts...");

function extractCleanCode(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.split('\n');
  let lastLine = lines.length;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === '`;' || lines[i].includes('fs.writeFileSync')) {
      lastLine = i;
    }
  }
  return lines.slice(0, lastLine).join('\n');
}

const modalsCode = extractCleanCode('templates_builder.js');
const views1Code = extractCleanCode('templates_part1_builder.js');
const views2Code = extractCleanCode('templates_part2_builder.js');
const views3Code = extractCleanCode('templates_part3_builder.js');

const { MASTER_ZANPAKUTO_CATALOG } = require('./zanpakuto_catalog.js');
const { CATALOGO_KIDOS } = require('./kido_catalog.js');
let spiritualEngineCode = fs.readFileSync('spiritual_engine.js', 'utf8')
  .replace(/module\.exports\s*=[\s\S]*$/, '')
  .replace(/const\s*\{\s*MASTER_ZANPAKUTO_CATALOG\s*\}\s*=\s*require\([^)]+\);?/g, '')
  .replace(/function\s+uid\(\)\s*\{[\s\S]*?\}/, ''); // remove the first uid() in engine since we declare it globally

const headerCode = `
const { useState, useEffect, useMemo, useRef } = React;

// Design System Colors
const C = {
  bg: "#0A0908",
  bg2: "#0F0D0B",
  panel: "#16130F",
  panel2: "#1C1712",
  border: "#2E2519",
  borderSoft: "#221C15",
  orange: "#FF6A13",
  orangeDeep: "#C94E0A",
  cream: "#F3EEE3",
  creamDim: "#C9C1AF",
  blue: "#4FB3E8",
  blueDeep: "#1E4C63",
  muted: "#8C8375",
  red: "#D6483F",
  green: "#5FA96B",
  yellow: "#E0B34C",
  purple: "#8B6FD6",
};

// Primary Attributes
const ATTRS = [
  { key: "pressao", label: "Pressão Espiritual", color: C.blue, desc: "Reiatsu, controle espiritual e percepção" },
  { key: "forca", label: "Força", color: C.red, desc: "Potência física, Zanjutsu e Hakuda" },
  { key: "velocidade", label: "Velocidade", color: C.green, desc: "Deslocamento, reflexos e Hohō/Shunpo" },
  { key: "resiliencia", label: "Resiliência", color: C.purple, desc: "Resistência física, espiritual e vitalidade" },
];

const ATTRS_FISICOS = ["forca", "velocidade", "resiliencia"];
const CATEGORIAS_TECNICA = ["Hadō", "Bakudō", "Kaidō", "Zanjutsu", "Hakuda", "Hohō", "Outro"];

const ESTADOS = [
  { key: "Inteiro", color: C.green, label: "Condição Normal" },
  { key: "Ferido", color: C.yellow, label: "Com Danos" },
  { key: "Debilitado", color: C.orangeDeep, label: "Gravemente Prejudicado" },
  { key: "Derrotado", color: C.red, label: "Incapacitado" },
];

const TIPOS_RECOMPENSA = [
  "Treino em ON (30 linhas)",
  "Missão Principal (Garantido 15 pts + Giros)",
  "Miscelânea",
  "Cena de Arco (90 linhas / 15 pts + Giros)",
  "Combate em ON",
  "Sorteio Gacha Comum",
  "Sorteio Especial",
  "Avaliação de Cenas (ADM)",
  "Avaliação de Fichas (ADM)",
  "Outro"
];

// Gacha Pools
const RARIDADES_COMUNS = [
  { nome: "Comum (Básico)", peso: 650, min: 1, max: 2, cor: C.muted, desc: "+1 a +2 Pontos de Atributo ou recurso básico (65% de chance)", tipo: "pontos", chanceStr: "65%" },
  { nome: "Incomum", peso: 220, min: 3, max: 4, cor: C.green, desc: "+3 a +4 Pontos de Atributo ou tônico de Reishi (22% de chance)", tipo: "pontos", chanceStr: "22%" },
  { nome: "Rara", peso: 90, min: 5, max: 7, cor: C.blue, desc: "+5 a +7 Pontos de Atributo ou pergaminho de treino (9% de chance)", tipo: "pontos", chanceStr: "9%" },
  { nome: "Épica", peso: 35, min: 8, max: 11, cor: C.purple, desc: "+8 a +11 Pontos de Atributo ou essência condensada (3.5% de chance)", tipo: "pontos", chanceStr: "3.5%" },
  { nome: "Lendária", peso: 5, min: 14, max: 18, cor: C.yellow, desc: "+14 a +18 Pontos de Atributo ou bênção do Seireitei (0.5% de chance / 1 em 200)", tipo: "pontos", chanceStr: "0.5%" },
];

const RECOMPENSAS_ESPECIAIS = [
  { id: "esp-basico-1", nome: "🌿 Frasco de Elixir do 4º Esquadrão", raridade: "Comum Especial", peso: 160, cor: C.green, desc: "Um frasco de Kaidō concentrado que revigora as fibras de Reiryoku (+4 pontos).", tipo: "pontos", valor: 4, chanceStr: "16%" },
  { id: "esp-basico-2", nome: "⚡ Pergaminho de Treino de Hohō", raridade: "Comum Especial", peso: 160, cor: C.green, desc: "Instruções táticas de passos relâmpago e mobilidade (+5 pontos).", tipo: "pontos", valor: 5, chanceStr: "16%" },
  { id: "esp-basico-3", nome: "🧪 Tônico de Reishi do 12º Esquadrão", raridade: "Comum Especial", peso: 150, cor: C.green, desc: "Um composto refinado pelo Departamento de Pesquisa e Desenvolvimento (+6 pontos).", tipo: "pontos", valor: 6, chanceStr: "15%" },
  { id: "esp-basico-4", nome: "🛡️ Selo Protetor da Sociedade das Almas", raridade: "Comum Especial", peso: 130, cor: C.green, desc: "Um amuleto defensivo que fortalece a estabilidade do Hakusui (+7 pontos).", tipo: "pontos", valor: 7, chanceStr: "13%" },
  { id: "esp-inter-1", nome: "💎 Fragmento Bruto de Cristal Espiritual", raridade: "Incomum Especial", peso: 90, cor: C.blue, desc: "Um cristal translúcido que ressoa com o Reiryoku nativo (+8 pontos).", tipo: "pontos", valor: 8, chanceStr: "9%" },
  { id: "esp-inter-2", nome: "📜 Tomo Antigo de Hadō & Bakudō", raridade: "Incomum Especial", peso: 80, cor: C.blue, desc: "Anotações perdidas sobre o controle dos primeiros números de Kidō (+10 pontos).", tipo: "pontos", valor: 10, chanceStr: "8%" },
  { id: "esp-inter-3", nome: "🍵 Chá Imperial da Família Kuchiki", raridade: "Incomum Especial", peso: 70, cor: C.blue, desc: "Uma iguaria reservada aos nobres que acalma a mente e purifica a pressão (+12 pontos).", tipo: "pontos", valor: 12, chanceStr: "7%" },
  { id: "esp-raro-1", nome: "🔮 Orbe de Condensação do Departamento de Pesquisa", raridade: "Raro Nobre", peso: 60, cor: C.purple, desc: "Uma esfera densa de Reishi altamente purificado pelo 12º Esquadrão (+15 pontos).", tipo: "pontos", valor: 15, chanceStr: "6%" },
  { id: "esp-raro-2", nome: "⚜️ Relíquia Nobre da Grande Família Shihōin", raridade: "Raro Nobre", peso: 50, cor: C.purple, desc: "Um amuleto antigo tecido com os passos dos mestres de Shunpo (+16 pontos).", tipo: "pontos", valor: 16, chanceStr: "5%" },
  { id: "esp-lend-1", nome: "👑 Bênção Sagrada da Guarda Real (Divisão Zero)", raridade: "Lendário Supremo", peso: 25, cor: C.yellow, desc: "Um influxo transcendental de Reishi puro que ecoa as técnicas ancestrais do Palácio Real (+20 pontos).", tipo: "pontos", valor: 20, chanceStr: "2.5%" },
  { id: "esp-lend-2", nome: "☄️ Essência Primordial da Sociedade das Almas", raridade: "Lendário Supremo", peso: 15, cor: C.yellow, desc: "A própria matéria espiritual condensada antes da divisão dos mundos (+24 pontos).", tipo: "pontos", valor: 24, chanceStr: "1.5%" },
  { id: "esp-supremo-1", nome: "⚔️ Comunicação Profunda — Despertar de Habilidade Shikai", raridade: "Recompensa Narrativa Suprema", peso: 10, cor: "#FFD700", desc: "Seu espírito de Zanpakutō ressoa profundamente. O ADM concederá uma Missão Narrativa Individual de despertar de nova habilidade especial única!", tipo: "missao_despertar", valor: 0, chanceStr: "1.0% (1 em 100)" },
];

const MASTER_ZANPAKUTO_CATALOG = ${JSON.stringify(MASTER_ZANPAKUTO_CATALOG, null, 2)};
const CATALOGO_KIDOS = ${JSON.stringify(CATALOGO_KIDOS, null, 2)};

// =========================================================================
// MOTOR DE INDIVIDUALIZAÇÃO ESPIRITUAL (33 REGRAS)
// =========================================================================
${spiritualEngineCode}

function getPowerTier(statVal) {
  const val = statVal > 150 ? Math.round(statVal / 4) : statVal;
  if (val <= 10) return { title: "Inexperiente", patamar: "1–10", color: C.muted };
  if (val <= 30) return { title: "Iniciante", patamar: "11–30", color: C.green };
  if (val <= 60) return { title: "Treinado", patamar: "31–60", color: C.blue };
  if (val <= 100) return { title: "Veterano", patamar: "61–100", color: C.purple };
  if (val <= 150) return { title: "Mestre", patamar: "101–150", color: C.yellow };
  return { title: "Transcendental", patamar: "150+", color: "#FFD700" };
}

function nowStr() {
  const d = new Date();
  return \`\${d.getDate().toString().padStart(2, '0')}/\${(d.getMonth() + 1).toString().padStart(2, '0')}/\${d.getFullYear()} às \${d.getHours().toString().padStart(2, '0')}:\${d.getMinutes().toString().padStart(2, '0')}\`;
}

function uid() {
  return 'u_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function maskWhats(w) {
  if (!w) return "—";
  const cleaned = w.replace(/\\D/g, "");
  if (cleaned.length < 4) return cleaned;
  return "•••• " + cleaned.slice(-4);
}

// Advanced Web Audio API Sound Effects
function playReiatsuSound(type = 'roll') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'shikai_charge') {
      [330, 440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * 0.8, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12 / (i + 1), ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.45);
      });
    } else if (type === 'bankai_charge') {
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(80, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.5);
      subGain.gain.setValueAtTime(0.3, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start();
      sub.stop(ctx.currentTime + 0.55);

      [220, 277, 330, 440].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.45);
        g.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + 0.55);
      });
    } else if (type === 'shikai' || type === 'shikai_reveal') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.8);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);

      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, ctx.currentTime + 0.08 + i * 0.06);
        g.gain.setValueAtTime(0.2, ctx.currentTime + 0.08 + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08 + i * 0.06 + 0.9);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(ctx.currentTime + 0.08 + i * 0.06);
        o.stop(ctx.currentTime + 0.08 + i * 0.06 + 0.9);
      });
    } else if (type === 'bankai' || type === 'bankai_reveal') {
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(120, ctx.currentTime);
      sub.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);
      subGain.gain.setValueAtTime(0.45, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start();
      sub.stop(ctx.currentTime + 1.3);

      [130.81, 164.81, 196.00, 261.63, 329.63, 523.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i < 2 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25 / (i * 0.5 + 1), ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + 0.1);
        osc.stop(ctx.currentTime + 1.6);
      });
    } else if (type === 'gacha_box_charge') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } else if (type === 'gacha_box_suspense') {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      const g = ctx.createGain();

      lfo.frequency.setValueAtTime(18, ctx.currentTime);
      lfoG.gain.setValueAtTime(40, ctx.currentTime);
      lfo.connect(lfoG);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      lfoG.connect(osc.frequency);

      g.gain.setValueAtTime(0.18, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(g);
      g.connect(ctx.destination);
      lfo.start();
      osc.start();
      lfo.stop(ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'gacha_box_shatter') {
      [1200, 1800, 2400, 450].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = idx === 3 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(idx === 3 ? 60 : 300, ctx.currentTime + 0.45);
        g.gain.setValueAtTime(0.28, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      });
    } else if (type === 'hum') {
      const osc = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();

      lfo.frequency.setValueAtTime(14, ctx.currentTime);
      lfoGain.gain.setValueAtTime(25, ctx.currentTime);
      lfo.connect(lfoGain);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      lfoGain.connect(osc.frequency);

      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      lfo.start();
      osc.start();
      lfo.stop(ctx.currentTime + 0.35);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'shatter') {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(1600, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.45);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2200, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } else if (type === 'roll') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'win') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } else if (type === 'kido') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {}
}

const DEFAULT_DB = {
  superAdminUsuario: "Malu123",
  superAdminSenha: "Sociedade2026",
  superAdminNome: "ADM Máximo (Comandante Supremo)",
  firebaseUrl: "https://bleach-rpg-6894c-default-rtdb.firebaseio.com/",
  subAdms: [
    { id: "adm-kisuke", usuario: "kisuke", senha: "123", nome: "Mestre Kisuke", cargo: "Avaliador de Cenas & Fichas", charId: "rukia-002" }
  ],
  registrosTarefasAdm: [
    { id: "t1", admNome: "Mestre Kisuke", tarefa: "Avaliação de Cenas de Arco (+8 pontos)", pontosGanhos: 8, data: "21/08/2026 às 14:00" }
  ],
  combatesArena: [
    {
      id: "arena-1",
      p1Id: "ren-001",
      p2Id: "rukia-002",
      estadoP1: "Inteiro",
      estadoP2: "Ferido",
      logJuiz: [
        { id: "l1", autor: "Mestre Kisuke", texto: "Início do combate: Ren avança com Shunpo enquanto Rukia prepara Bakudō.", data: "22/08/2026 às 15:30" }
      ],
      finalizado: false
    }
  ],
  rolagensDadosPublicas: [
    { id: "d1", autor: "Mestre Kisuke", personagem: "Kurosaki Ren", dado: "d20", resultado: 18, categoria: "Extremo Sucesso (+80%)", data: "22/08/2026 às 15:35" }
  ],
  zanpakutosVinculadas: [],
  personagens: [
    {
      id: "ren-001",
      nome: "Kurosaki Ren",
      foto: "assets/ichigo-orange.png",
      whatsapp: "11988887777",
      codigo: "REN-8921",
      raca: "Shinigami",
      esquadrao: "11º Esquadrão",
      faceclaim: "Kurosaki Ichigo",
      idadePlayer: "22",
      aniversarioPlayer: "15/07",
      idadeChar: "18",
      aniversarioChar: "15/07",
      pontosDisponiveis: 5,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 1,
      sorteiosDrops: [],
      permissoes: { shikaiLiberada: true, bankaiLiberada: false },
      atributos: { pressao: 45, forca: 30, velocidade: 60, resiliencia: 25 },
      kidosConhecidos: [
        { id: "h4", numero: 4, nome: "Byakurai", cat: "Hadō", custoReiatsu: 3 },
        { id: "b1", numero: 1, nome: "Sai", cat: "Bakudō", custoReiatsu: 2 }
      ],
      tecnicas: [
        { id: "t-byak", nome: "Hadō #4 — Byakurai", categoria: "Hadō" },
        { id: "t-sai", nome: "Bakudō #1 — Sai", categoria: "Bakudō" }
      ],
      personalidade: {
        texto: "Guerreiro analítico e leal. Prefere combater com velocidade e inteligência tática, arriscando tudo para proteger seus companheiros.",
        virtudes: "Foco inabalável, determinação e lealdade",
        defeitos: "Dificuldade de confiar e pedir ajuda",
        desejos: "Tornar-se forte o bastante para que ninguém sob sua guarda caia",
        medos: "A impotência diante da morte de um amigo",
        conflitos: "Obedecer ordens militares versus seguir sua honra pessoal",
        estiloCombate: "Velocidade tridimensional e cortes precisos"
      },
      personalidadeTravada: false,
      cenaDespertarShikai: "",
      cenaDespertarBankai: "",
      zanpakuto: {
        nome: "Em despertar",
        fotoShikai: "assets/ichigo-orange.png",
        fotoBankai: "assets/ichigo-moon.png",
        shikaiAtiva: null,
        bankaiAtiva: null,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [
        { id: "h1", data: "20/08/2026 às 10:00", texto: "Ficha oficial aprovada pela Administração." }
      ],
    }
  ]
};

function calculateRankings(personagens) {
  const rankFisico = [...personagens].map(p => {
    const f = Number(p.atributos?.forca || 0);
    const v = Number(p.atributos?.velocidade || 0);
    const r = Number(p.atributos?.resiliencia || 0);
    const score = Number(((f + v + r) / 3).toFixed(1));
    return { id: p.id, nome: p.nome, foto: p.foto, score, forca: f, vel: v, res: r };
  }).sort((a, b) => b.score - a.score);

  const rankPressao = [...personagens].map(p => {
    const score = Number(p.atributos?.pressao || 0);
    return { id: p.id, nome: p.nome, foto: p.foto, score };
  }).sort((a, b) => b.score - a.score);

  return { rankFisico, rankPressao };
}
`;

const appComponentCode = `
// MAIN APP COMPONENT
function App() {
  const [db, setDb] = useState(null);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);
  const [view, setView] = useState("sistemas");
  const [adminCharId, setAdminCharId] = useState(null);
  const [saveErr, setSaveErr] = useState("");
  const [cloudStatus, setCloudStatus] = useState("local");
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [activeCloudUrl, setActiveCloudUrl] = useState("");

  // Sync with cloud on startup
  useEffect(() => {
    async function initDb() {
      let initialData = DEFAULT_DB;
      try {
        const stored = localStorage.getItem("bleachDB");
        if (stored) {
          initialData = JSON.parse(stored);
        }
      } catch (e) {}

      let cloudUrl = "";
      try {
        const cfgRes = await fetch('config.json?t=' + Date.now());
        if (cfgRes.ok) {
          const cfg = await cfgRes.json();
          if (cfg && cfg.firebaseUrl) {
            cloudUrl = cfg.firebaseUrl.trim();
          }
        }
      } catch (e) {}

      if (!cloudUrl) {
        cloudUrl = initialData.firebaseUrl || localStorage.getItem("bleach_firebase_url") || "";
      }

      if (cloudUrl) {
        setActiveCloudUrl(cloudUrl);
        try {
          setCloudStatus("syncing");
          const cleanUrl = cloudUrl.endsWith('/') ? cloudUrl.slice(0, -1) : cloudUrl;
          const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
          const res = await fetch(endpoint + '?t=' + Date.now());
          if (res.ok) {
            const cloudData = await res.json();
            if (cloudData && typeof cloudData === 'object' && cloudData.personagens) {
              initialData = { ...initialData, ...cloudData, firebaseUrl: cloudUrl };
              localStorage.setItem("bleachDB", JSON.stringify(initialData));
              setCloudStatus("connected");
            }
          }
        } catch (err) {
          console.warn("Could not sync with cloud on startup, using local data", err);
          setCloudStatus("error");
        }
      }

      setDb(initialData);
      setReady(true);
    }

    initDb();
  }, []);

  // Periodic background cloud sync
  useEffect(() => {
    if (!activeCloudUrl || cloudStatus !== "connected") return;
    const interval = setInterval(async () => {
      try {
        const cleanUrl = activeCloudUrl.endsWith('/') ? activeCloudUrl.slice(0, -1) : activeCloudUrl;
        const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
        const res = await fetch(endpoint + '?t=' + Date.now());
        if (res.ok) {
          const cloudData = await res.json();
          if (cloudData && typeof cloudData === 'object' && cloudData.personagens) {
            setDb(prev => ({ ...prev, ...cloudData }));
          }
        }
      } catch (e) {}
    }, 10000);
    return () => clearInterval(interval);
  }, [activeCloudUrl, cloudStatus]);

  // Automatic session validation: If logged in as player and character was deleted, log out immediately!
  useEffect(() => {
    if (session && session.role === "jogador" && db && db.personagens) {
      const exists = db.personagens.some(p => p.id === session.charId);
      if (!exists) {
        setSession(null);
        setAdminCharId(null);
        setView("sistemas");
        alert("⚠️ Sua ficha de personagem foi excluída pelo Administrador. Sessão encerrada.");
      }
    }
  }, [db, session]);

  // Save DB to localStorage AND push to Cloud Firebase
  async function saveDb(next) {
    setDb(next);
    try {
      const minimalDb = {
        superAdminUsuario: next.superAdminUsuario || "Malu123",
        superAdminSenha: next.superAdminSenha || "Sociedade2026",
        superAdminNome: next.superAdminNome || "ADM Máximo (Comandante Supremo)",
        firebaseUrl: next.firebaseUrl || activeCloudUrl || "",
        subAdms: next.subAdms || [],
        registrosTarefasAdm: (next.registrosTarefasAdm || []).slice(0, 50),
        combatesArena: (next.combatesArena || []).slice(0, 20),
        rolagensDadosPublicas: (next.rolagensDadosPublicas || []).slice(0, 30),
        zanpakutosVinculadas: next.zanpakutosVinculadas || [],
        personagens: next.personagens || []
      };
      localStorage.setItem("bleachDB", JSON.stringify(minimalDb));
      setSaveErr("");
    } catch (e) {
      console.warn("Local storage warning:", e);
      setSaveErr("");
    }

    const cloudUrl = next.firebaseUrl || activeCloudUrl || localStorage.getItem("bleach_firebase_url");
    if (cloudUrl) {
      try {
        setCloudStatus("syncing");
        const cleanUrl = cloudUrl.endsWith('/') ? cloudUrl.slice(0, -1) : cloudUrl;
        const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
        await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next)
        });
        setCloudStatus("connected");
        setActiveCloudUrl(cloudUrl);
      } catch (err) {
        console.warn("Cloud save error:", err);
        setCloudStatus("error");
      }
    }
  }

  function logout() {
    setSession(null);
    setAdminCharId(null);
    setView("sistemas");
  }

  const myChar = useMemo(() => {
    if (!db || !session) return null;
    if (session.role === "jogador") return (db.personagens || []).find((p) => p.id === session.charId) || null;
    if ((session.role === "super_admin" || session.role === "sub_admin") && adminCharId) {
      return (db.personagens || []).find((p) => p.id === adminCharId) || null;
    }
    return null;
  }, [db, session, adminCharId]);

  const { rankFisico, rankPressao } = useMemo(() => {
    return calculateRankings(db?.personagens || []);
  }, [db?.personagens]);

  if (!ready || !db) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-bleach-creamDim">
        <div className="w-12 h-12 border-4 border-bleach-orange border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-title text-xl tracking-wider text-bleach-cream">CONECTANDO À SOCIEDADE DAS ALMAS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bleach-bg text-bleach-cream font-sans selection:bg-bleach-orange selection:text-black">
      <TopBar
        session={session}
        onLogout={logout}
        view={view}
        setView={(v) => {
          if (v !== "ficha") setAdminCharId(null);
          setView(v);
        }}
        nome={myChar?.nome || (session?.role === "super_admin" ? "Comandante Supremo" : session?.nome)}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        cloudStatus={cloudStatus}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {saveErr && (
          <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 text-xs rounded-xl text-center">
            {saveErr}
          </div>
        )}

        {view === "sistemas" && <SistemasView />}

        {view === "ficha" && (
          session?.role === "jogador" ? (
            <FichaView
              db={db}
              saveDb={saveDb}
              personagem={myChar}
              isAdmin={false}
              rankFisico={rankFisico}
              rankPressao={rankPressao}
            />
          ) : session?.role === "super_admin" || session?.role === "sub_admin" ? (
            adminCharId && myChar ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-yellow-950/40 border border-yellow-500/60 p-3 rounded-xl">
                  <span className="text-xs text-yellow-300 font-bold">
                    👑 Modo de Gestão Administrativa: Editando a ficha de <strong>{myChar.nome}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setAdminCharId(null);
                      setView("admin");
                    }}
                    className="px-3 py-1 bg-bleach-panel2 border border-bleach-border text-xs text-white rounded hover:border-yellow-400"
                  >
                    ← Voltar ao Painel ADM
                  </button>
                </div>
                <FichaView
                  db={db}
                  saveDb={saveDb}
                  personagem={myChar}
                  isAdmin={true}
                  rankFisico={rankFisico}
                  rankPressao={rankPressao}
                />
              </div>
            ) : (
              <div className="text-center py-12 text-bleach-muted">
                <p>Nenhum personagem selecionado para gerenciar.</p>
                <button
                  onClick={() => setView("admin")}
                  className="mt-3 px-4 py-2 bg-bleach-orange text-black font-bold rounded-lg text-xs"
                >
                  Ir para Lista de Fichas
                </button>
              </div>
            )
          ) : (
            <LoginScreen
              db={db}
              activeCloudUrl={activeCloudUrl}
              setDb={setDb}
              onLogin={(p) => {
                setSession({ role: "jogador", charId: p.id, nome: p.nome });
                setView("ficha");
              }}
              onOpenAdminModal={() => setShowAdminLoginModal(true)}
            />
          )
        )}

        {view === "rankings" && (
          <RankingsView
            rankFisico={rankFisico}
            rankPressao={rankPressao}
            myCharId={myChar?.id}
          />
        )}

        {view === "kidos" && (
          <KidosView
            personagem={myChar}
            isAdmin={session?.role === "super_admin" || session?.role === "sub_admin"}
          />
        )}

        {view === "arena" && (
          <ArenaView
            db={db}
            saveDb={saveDb}
            session={session}
            myChar={myChar}
          />
        )}

        {view === "admin" && (
          session?.role === "super_admin" || session?.role === "sub_admin" ? (
            <AdminPanel
              db={db}
              saveDb={saveDb}
              session={session}
              cloudStatus={cloudStatus}
              onAbrirFicha={(charId) => {
                setAdminCharId(charId);
                setView("ficha");
              }}
            />
          ) : (
            <AdminLoginScreen
              db={db}
              onLoginAdmin={(role, subAdmObj) => {
                setSession({ role, ...(subAdmObj || {}) });
                setView("admin");
              }}
            />
          )
        )}
      </main>

      {showAdminLoginModal && (
        <AdminLoginModal
          db={db}
          onClose={() => setShowAdminLoginModal(false)}
          onSuccess={(role, subAdmObj) => {
            setSession({ role, ...(subAdmObj || {}) });
            setShowAdminLoginModal(false);
            setView("admin");
          }}
        />
      )}
    </div>
  );
}
`;

const completeSource = [
  headerCode,
  modalsCode,
  views1Code,
  views2Code,
  views3Code,
  appComponentCode
].join('\n\n');

fs.writeFileSync('app_source.jsx', completeSource);
console.log("app_source.jsx assembled successfully! Size:", completeSource.length);
