const fs = require('fs');
const { MASTER_ZANPAKUTO_CATALOG } = require('./zanpakuto_catalog.js');

// We will read generate_app.js fresh or reconstruct it cleanly
// Let's inspect git status or restore generate_app.js from backup or fix it cleanly
const catalogJsonStr = JSON.stringify(MASTER_ZANPAKUTO_CATALOG).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');

let genAppContent = fs.readFileSync('generate_app.js', 'utf8');

// Let's replace the engine block with properly escaped template string code
const pStart = genAppContent.indexOf("// =========================================================================");
const pEnd = genAppContent.indexOf("const gerar3OpcoesBankaiAI = gerar4OpcoesBankaiAI;");

if (pStart === -1 || pEnd === -1) {
  console.error("Could not find delimiters!");
  process.exit(1);
}

const engineJsxCode = `// =========================================================================
// 100% ORIGINAL & AUTORIAL UNIQUE ZANPAKUTŌ ENGINE (MASTER POOL OF 60 BLADES)
// =========================================================================

const MASTER_ZANPAKUTO_CATALOG = ` + JSON.stringify(MASTER_ZANPAKUTO_CATALOG) + `;

const AUTORIAL_PREFIXES = [
  "Gekka", "Enkō", "Raimei", "Kageori", "Senritsu", "Dokugan", "Kōtetsu", 
  "Shippū", "Tenrin", "Kasumibane", "Rengetsu", "Shinbatsu", "Byakko", 
  "Kurogane", "Ryūsei", "Hakuryū", "Suzuran", "Mugen", "Tsukikage", "Hien",
  "Yatsukahada", "Reisō", "Kourinpou", "Sōun", "Genshō", "Kagayaki", "Yamikiri",
  "Seiryuu", "Rindō", "Gurenkō", "Kurokaze", "Hōōmaru", "Chirin", "Suikazan"
];

const AUTORIAL_SUFFIXES = [
  "kiri", "maru", "kiba", "ori", "hime", "zuru", "jin", "kō", "kage", 
  "bane", "tsume", "boshi", "tō", "ken", "ryū", "sō", "ya", "bana", "yari", "kaze",
  "ren", "shō", "getsu", "sen", "bi", "gumo", "ryo", "dan", "retsu", "ha"
];

const AUTORIAL_COMMANDS = [
  "Floresça no silêncio", "Forje aquilo que ainda não existe", "Olhe para si mesmo",
  "Desperte no céu", "Chore sobre este mundo", "Reflita aquilo que deveria ser esquecido",
  "Multiplique-se pelo caminho", "Permaneça onde ninguém pode tocar", "Faça o céu responder",
  "Pese aquilo que existe", "Trace os limites do abismo", "Abandone a forma passageira",
  "Revele as sombras da vigília", "Toque aquilo que não tem voz", "Prenda-se ao solo",
  "Estenda a fronteira do ar", "Engrene o tempo que resta", "Ecoa na mente vazia",
  "Asfixie o horizonte", "Acorde da montanha", "Tinja o caminho de carmesim",
  "Dance na geada suave", "Puxe as amarras do abismo", "Purifique a mácula"
];

const WEAPON_TYPES = [
  "Uma nodachi de lâmina enegrecida com fio duplo chanfrado e ranhuras que canalizam Reiryoku pura",
  "Duas adagas triangulares de aço gravado unidas por uma corrente de elos flutuantes de pura energia",
  "Uma elegante rapieira de cristal fosco com guarda em prisma triplo que refrata a luz em navalhas",
  "Uma foice de combate com dorso serrilhado e três sinos espirituais que ressoam frequências desestabilizadoras",
  "Um cutelo colossal de aço polido reforçado com faixas de seda branca na empunhadura para absorção de impacto",
  "Uma lança articulada em três segmentos de aço flexível que chicoteia no ar com lâminas retráteis",
  "Um machado leve de guerra de dois gumes com núcleo oco por onde pulsam arcos de pressão espiritual",
  "Duas cimitarras curvas de aço rubro brilhante com guarda em formato de meia-lua entrelaçada"
];

const PRIMARY_EFFECTS = [
  "projeta ondas cortantes de alta densidade capazes de fender barreiras espirituais e terra firme",
  "congela a circulação de Reiryoku do oponente ao menor corte, reduzindo reflexos e velocidade",
  "descarrega arcos voltaicos perfurantes que eletrocutam nervos motores causando paralisia instantânea",
  "permite ao Shinigami deslizar instantaneamente entre as sombras do terreno em ângulos impossíveis",
  "duplica a massa gravitacional da arma a cada colisão bem-sucedida, quebrando defesas de impacto",
  "expele uma névoa corrosiva que consome projéteis mágicos de Kidō antes que atinjam o portador",
  "cria círculos de ressonância no solo que aprisionam o peso corporal do inimigo em alta gravidade",
  "multiplica a velocidade do Shunpo do usuário gerando clones residuais táteis de pura pressão"
];

const SECONDARY_EFFECTS = [
  "Além disso, reveste o corpo com um manto defensivo que dissipa feitiços de dano cinético.",
  "Além disso, cada ataque bem-sucedido recupera uma fração da reserva de Reiatsu da lâmina.",
  "Além disso, permite disparar feitiços de Hadō canalizados diretamente através do fio da espada.",
  "Além disso, emite um zumbido subsônico que desorienta a percepção sensorial e equilíbrio do alvo."
];

function getClaimedZanpakutos(personagens = []) {
  const claimedNames = new Set();
  const claimedPowers = new Set();

  personagens.forEach(p => {
    if (p.zanpakuto?.nome) claimedNames.add(p.zanpakuto.nome.toLowerCase().trim());
    if (p.zanpakuto?.shikaiAtiva?.nome) claimedNames.add(p.zanpakuto.shikaiAtiva.nome.toLowerCase().trim());
    if (p.zanpakuto?.bankaiAtiva?.nome) claimedNames.add(p.zanpakuto.bankaiAtiva.nome.toLowerCase().trim());
    if (p.zanpakuto?.shikaiAtiva?.poder) claimedPowers.add(p.zanpakuto.shikaiAtiva.poder.trim());
    if (p.zanpakuto?.bankaiAtiva?.poder) claimedPowers.add(p.zanpakuto.bankaiAtiva.poder.trim());
  });

  return { claimedNames, claimedPowers };
}

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function gerarNomeAutorialUnico(claimedNames, usadosNoMomento) {
  let nome = "";
  let tentativas = 0;
  while (tentativas < 100) {
    const pfx = AUTORIAL_PREFIXES[Math.floor(Math.random() * AUTORIAL_PREFIXES.length)];
    const sfx = AUTORIAL_SUFFIXES[Math.floor(Math.random() * AUTORIAL_SUFFIXES.length)];
    nome = \\\`\\\${pfx}\\\${sfx}\\\`;
    const lower = nome.toLowerCase();
    if (!claimedNames.has(lower) && !usadosNoMomento.has(lower)) {
      usadosNoMomento.add(lower);
      return nome;
    }
    tentativas++;
  }
  nome = \\\`\\\${AUTORIAL_PREFIXES[0]}\\\${AUTORIAL_SUFFIXES[0]} \\\${uid().toUpperCase()}\\\`;
  usadosNoMomento.add(nome.toLowerCase());
  return nome;
}

function gerar4OpcoesShikaiAI(nomePersonagem, dbPersonagens = []) {
  const { claimedNames, claimedPowers } = getClaimedZanpakutos(dbPersonagens);
  const opcoes = [];
  const usadosNoMomento = new Set();
  
  const elementos = [
    "Chamas de Ébano & Brasas Solares",
    "Cristal Glacial & Zero Absoluto",
    "Relâmpago do Vórtice & Plasma Celeste",
    "Sombra Abissal & Distorção Dimensional",
    "Aço Puro & Alta Densidade Gravitacional",
    "Vento Cortante & Lâminas de Vácuo",
    "Veneno Espectral & Corrosão de Reiryoku",
    "Luz & Julgamento do Firmamento"
  ];

  // 1. Prioridade: Pegar do catálogo mestre de 60 Zanpakutōs ricas
  const disponiveisNoCatalogo = (typeof MASTER_ZANPAKUTO_CATALOG !== 'undefined' ? MASTER_ZANPAKUTO_CATALOG : []).filter(item => {
    const nomeNorm = item.nome.toLowerCase().trim();
    return !claimedNames.has(nomeNorm);
  });

  const embaralhados = shuffleArray(disponiveisNoCatalogo);

  for (const item of embaralhados) {
    if (opcoes.length >= 4) break;
    const nomeNorm = item.nome.toLowerCase().trim();
    if (!usadosNoMomento.has(nomeNorm)) {
      usadosNoMomento.add(nomeNorm);
      opcoes.push({
        id: uid(),
        nome: item.nome,
        nomeCompleto: item.nomeCompleto || (item.nome + " " + item.kanji + " — " + item.traducao),
        kanji: item.kanji,
        traducao: item.traducao,
        espirito: item.espirito,
        comando: item.comando,
        elemento: item.elemento,
        formatoArma: item.formatoArma,
        poder: item.poder,
        bankaiPadrao: item.bankai,
        foto: "assets/ichigo-orange.png"
      });
    }
  }

  // 2. Fallback procedural caso todo o catálogo mestre já esteja reivindicado
  while (opcoes.length < 4) {
    const nomeZk = gerarNomeAutorialUnico(claimedNames, usadosNoMomento);
    const elemento = elementos[opcoes.length % elementos.length];
    const comando = AUTORIAL_COMMANDS[Math.floor(Math.random() * AUTORIAL_COMMANDS.length)];
    const formatoArma = WEAPON_TYPES[Math.floor(Math.random() * WEAPON_TYPES.length)];
    const efeitoPrim = PRIMARY_EFFECTS[Math.floor(Math.random() * PRIMARY_EFFECTS.length)];
    const efeitoSec = SECONDARY_EFFECTS[Math.floor(Math.random() * SECONDARY_EFFECTS.length)];
    
    const poderDesc = \\\`Ao proferir o comando "\\\${comando}", a arma se manifesta. Em combate: Esta lâmina \\\${efeitoPrim}. \\\${efeitoSec}\\\`;

    if (claimedPowers.has(poderDesc)) continue;

    opcoes.push({
      id: uid(),
      nome: nomeZk,
      nomeCompleto: nomeZk + " — Lâmina Autoral Desperta",
      kanji: "「始解」",
      traducao: "Despertar Ancestral",
      espirito: "Um espírito guardião envolto em vestes de combate que canaliza a essência de Reiryoku única do usuário.",
      comando: comando + ", " + nomeZk + "!",
      elemento,
      formatoArma,
      poder: poderDesc,
      foto: "assets/ichigo-orange.png"
    });
  }

  return opcoes;
}

function gerar4OpcoesBankaiAI(nomePersonagem, shikaiAtiva, dbPersonagens = []) {
  const { claimedNames, claimedPowers } = getClaimedZanpakutos(dbPersonagens);
  const opcoes = [];
  const usadosNoMomento = new Set();
  const baseNome = shikaiAtiva?.nome || "Kurotsubaki";
  const elemento = shikaiAtiva?.elemento || "Vácuo Cinético & Pétalas Negras";

  // 1. Procurar Bankai canônico correspondente da Shikai ativa
  let bankaiCanonico = shikaiAtiva?.bankaiPadrao || null;
  if (!bankaiCanonico && typeof MASTER_ZANPAKUTO_CATALOG !== 'undefined') {
    const matched = MASTER_ZANPAKUTO_CATALOG.find(z => z.nome.toLowerCase().trim() === baseNome.toLowerCase().trim());
    if (matched && matched.bankai) {
      bankaiCanonico = matched.bankai;
    }
  }

  if (bankaiCanonico) {
    const nomeBk = bankaiCanonico.nomeCompleto || ("Bankai — " + bankaiCanonico.nome + " " + (bankaiCanonico.kanji || '') + " (" + (bankaiCanonico.traducao || '') + ")");
    usadosNoMomento.add(nomeBk.toLowerCase());
    opcoes.push({
      id: uid(),
      nome: bankaiCanonico.nome,
      nomeCompleto: nomeBk,
      kanji: bankaiCanonico.kanji || "「卍解」",
      traducao: bankaiCanonico.traducao || "Liberação Completa",
      comando: bankaiCanonico.comando || ("Bankai — " + bankaiCanonico.nome + "!"),
      elemento,
      formatoArma: bankaiCanonico.formatoArma,
      poder: bankaiCanonico.poder,
      espirito: shikaiAtiva?.espirito || "Ressonância transcendental entre a alma e o espírito ancestral da lâmina.",
      foto: "assets/ichigo-moon.png"
    });
  }

  // 2. Evoluções temáticas adicionais de altíssima qualidade
  const evolucoesTematicas = [
    {
      sufixo: "Shūen Teien (Jardim do Fim)",
      kanji: "「終焉庭園」",
      titulo: "Bankai — " + baseNome + "・Shūen Teien",
      formato: "O campo de batalha inteiro se transforma no domínio absoluto de " + baseNome + ". Monumentais manifestações espirituais emergem do solo e toda a atmosfera se sintoniza à pressão da lâmina.",
      poder: "Domínio de Redistribuição Absoluta: Todas as propriedades e acúmulos da Shikai são expandidos para escala territorial. O portador pode transferir instantaneamente qualquer desvantagem do combate em aceleração, dano concentrado ou anulação de técnicas inimigas."
    },
    {
      sufixo: "Kongō Taihō (Fornalha Celestial do Diamante)",
      kanji: "「金剛大鵬」",
      titulo: "Bankai — " + baseNome + "・Kongō Taihō",
      formato: "O usuário é revestido por uma armadura colossal de Reiryoku comprimida em camadas de diamante e metal espiritual, empunhando duas armas monumentais de alcance estendido.",
      poder: "Conversão Metabólica Transcendental: Cada choque de combate refina e multiplica a velocidade e a densidade de corte do usuário, concedendo imunidade progressiva a danos cinéticos e rompendo qualquer barreira mágica de Bakudō."
    },
    {
      sufixo: "Mugen Kairō (Corredor dos Mil Reflexos)",
      kanji: "「無限回廊」",
      titulo: "Bankai — " + baseNome + "・Mugen Kairō",
      formato: "O espaço ao redor se estilhaça em uma câmara dimensional espelhada onde dezenas de réplicas de Reiryoku tangíveis executam movimentos simultâneos.",
      poder: "Mobilidade & Ataque Omnidirecional: O portador pode translocar-se instantaneamente entre qualquer reflexo ativo, disparando estocadas a partir de múltiplos ângulos cegos enquanto dissipa o impacto de ataques sofridos em cópias residuais."
    },
    {
      sufixo: "Tenkan Gōtenritsu (Anel da Lei Celestial)",
      kanji: "「天環・轟天律」",
      titulo: "Bankai — " + baseNome + "・Tenkan Gōtenritsu",
      formato: "Anéis de atração gravitacional e relâmpagos cósmicos giram em torno de todo o perímetro da arena, gerando uma zona de alta densidade espiritual.",
      poder: "Controle Vetorial Absoluto: Todo ataque, feitiço ou combatente que entra no raio de ação da Bankai é submetido à trajetória das órbitas da lâmina, permitindo desviar investidas maciças e impor um ritmo de combate intransponível."
    }
  ];

  for (const evo of evolucoesTematicas) {
    if (opcoes.length >= 4) break;
    const nomeNorm = evo.titulo.toLowerCase();
    if (!usadosNoMomento.has(nomeNorm)) {
      usadosNoMomento.add(nomeNorm);
      opcoes.push({
        id: uid(),
        nome: baseNome + " — " + evo.sufixo,
        nomeCompleto: evo.titulo + " " + evo.kanji,
        kanji: evo.kanji,
        traducao: evo.sufixo,
        comando: evo.titulo + "!",
        elemento,
        formatoArma: evo.formato,
        poder: evo.poder,
        espirito: shikaiAtiva?.espirito || "Ressonância transcendental entre Shinigami e Zanpakutō.",
        foto: "assets/ichigo-moon.png"
      });
    }
  }

  return opcoes;
}

const gerar3OpcoesBankaiAI = gerar4OpcoesBankaiAI;`;

genAppContent = genAppContent.slice(0, pStart) + engineJsxCode + genAppContent.slice(pEnd + "const gerar3OpcoesBankaiAI = gerar4OpcoesBankaiAI;".length);

fs.writeFileSync('generate_app.js', genAppContent);
console.log("Rewritten generate_app.js cleanly with escaped template literals!");
