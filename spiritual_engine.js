// =========================================================================
// BLEACH RPG — MOTOR COGNITIVO DE GÊNESE ESPIRITUAL (ZGE V5.0)
// Conexão com ChatGPT / OpenAI API + Sintetizador Dinâmico Baseado na Personalidade
// COM REGRA ESTRITA DE EXCLUSIVIDADE & ANTI-SIMILARIDADE (ZERO DUPLICATAS)
// =========================================================================

const { MASTER_ZANPAKUTO_CATALOG } = require('./zanpakuto_catalog.js');

function uid() {
  return "zk-" + Math.random().toString(36).slice(2, 9) + "-" + Date.now().toString(36);
}

// 1. GERADOR DE ASSINATURA ESPIRITUAL ÚNICA
function calcularAssinaturaEspiritual(zanpakuto) {
  if (!zanpakuto) return "";
  const nome = (zanpakuto.nome || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  const conceito = (zanpakuto.conceitoCentral || zanpakuto.elemento || "").toLowerCase().trim().slice(0, 20).replace(/[^a-z0-9]/g, "");
  const mecanica = (zanpakuto.poder || zanpakuto.habilidadePrincipal || "").toLowerCase().trim().slice(0, 30).replace(/[^a-z0-9]/g, "");
  return `zk-sig-${nome}-${conceito}-${mecanica.slice(0, 12)}`;
}

// 2. CÁLCULO DE NÍVEL DE SIMILARIDADE ENTRE DUAS ZANPAKUTŌS
function calcularIndiceSimilaridade(shikaiA, shikaiB) {
  if (!shikaiA || !shikaiB) return 0;
  let score = 0;
  
  const nomeA = (shikaiA.nome || "").toLowerCase().trim();
  const nomeB = (shikaiB.nome || "").toLowerCase().trim();
  if (nomeA === nomeB && nomeA.length > 0) score += 60;
  else if (nomeA.length > 3 && nomeB.length > 3 && (nomeA.includes(nomeB) || nomeB.includes(nomeA))) score += 35;

  const concA = (shikaiA.conceitoCentral || shikaiA.elemento || "").toLowerCase();
  const concB = (shikaiB.conceitoCentral || shikaiB.elemento || "").toLowerCase();
  if (concA && concB && (concA === concB || concA.includes(concB) || concB.includes(concA))) {
    score += 25;
  }

  const poderA = (shikaiA.poder || shikaiA.habilidadePrincipal || "").toLowerCase();
  const poderB = (shikaiB.poder || shikaiB.habilidadePrincipal || "").toLowerCase();
  
  const wordsA = new Set(poderA.split(/\s+/).filter(w => w.length > 4));
  const wordsB = new Set(poderB.split(/\s+/).filter(w => w.length > 4));
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  const maxWords = Math.max(1, Math.min(wordsA.size, wordsB.size));
  const matchPct = (intersection / maxWords) * 35;
  score += Math.min(35, matchPct);

  return Math.min(100, Math.round(score));
}

// Obter assinaturas e nomes já registrados em todas as fichas e catálogo
function getClaimedSignatures(dbPersonagens = [], dbZanpakutosVinculadas = []) {
  const claimed = new Set();
  const claimedNames = new Set();
  const claimedElements = new Set();

  (dbZanpakutosVinculadas || []).forEach(z => {
    if (z.assinatura) claimed.add(z.assinatura.toLowerCase());
    if (z.nome) claimedNames.add(z.nome.toLowerCase().trim());
    if (z.elemento) claimedElements.add(z.elemento.toLowerCase().trim());
  });

  (dbPersonagens || []).forEach(p => {
    if (p.zanpakuto?.shikaiAtiva) {
      const sig = p.zanpakuto.shikaiAtiva.assinaturaEspiritual || calcularAssinaturaEspiritual(p.zanpakuto.shikaiAtiva);
      claimed.add(sig.toLowerCase());
      claimedNames.add((p.zanpakuto.shikaiAtiva.nome || "").toLowerCase().trim());
      if (p.zanpakuto.shikaiAtiva.elemento) {
        claimedElements.add(p.zanpakuto.shikaiAtiva.elemento.toLowerCase().trim());
      }
    }
    if (p.zanpakuto?.nome && p.zanpakuto.nome !== "Em despertar") {
      claimedNames.add(p.zanpakuto.nome.toLowerCase().trim());
    }
  });

  return { claimed, claimedNames, claimedElements };
}

// Resumo textual de Zanpakutōs existentes para injetar no prompt do ChatGPT
function getExistingZanpakutosSummary(dbPersonagens = [], dbZanpakutosVinculadas = []) {
  const list = [];
  const seen = new Set();

  (dbPersonagens || []).forEach(p => {
    if (p.zanpakuto?.shikaiAtiva?.nome && !seen.has(p.zanpakuto.shikaiAtiva.nome.toLowerCase())) {
      seen.add(p.zanpakuto.shikaiAtiva.nome.toLowerCase());
      list.push(`- "${p.zanpakuto.shikaiAtiva.nome}" (Dono: ${p.nome} | Elemento/Tema: ${p.zanpakuto.shikaiAtiva.elemento || "Místico"} | Mecânica: ${(p.zanpakuto.shikaiAtiva.poder || "").slice(0, 70)}...)`);
    } else if (p.zanpakuto?.nome && p.zanpakuto.nome !== "Em despertar" && !seen.has(p.zanpakuto.nome.toLowerCase())) {
      seen.add(p.zanpakuto.nome.toLowerCase());
      list.push(`- "${p.zanpakuto.nome}" (Dono: ${p.nome})`);
    }
  });

  (dbZanpakutosVinculadas || []).forEach(z => {
    if (z.nome && !seen.has(z.nome.toLowerCase())) {
      seen.add(z.nome.toLowerCase());
      list.push(`- "${z.nome}" (Elemento: ${z.elemento || "Espiritual"})`);
    }
  });

  return list;
}

// CONSTRUÇÃO COMPLETA DO SOUL DNA
function construirDnaEspiritual(personagem, cenaTexto = "") {
  const attrs = personagem.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 };
  const pList = [
    { key: "pressao", label: "Pressão Espiritual", val: Number(attrs.pressao || 10) },
    { key: "forca", label: "Força Física", val: Number(attrs.forca || 10) },
    { key: "velocidade", label: "Velocidade", val: Number(attrs.velocidade || 10) },
    { key: "resiliencia", label: "Resiliência", val: Number(attrs.resiliencia || 10) }
  ].sort((a, b) => b.val - a.val);

  const dominante = pList[0];
  const deficiente = pList[pList.length - 1];

  const pers = personagem.personalidade || {};
  const textoPers = (pers.texto || "") + " " + (cenaTexto || "");
  const virtudes = pers.virtudes || "Determinação e foco inabalável";
  const defeitos = pers.defeitos || "Orgulho e isolamento";
  const desejos = pers.desejos || "Proteger os aliados e superar seus limites";
  const medos = pers.medos || "A impotência diante da derrota";
  const conflitos = pers.conflitos || "Dever militar versus honra pessoal";
  const estilo = pers.estiloCombate || "Precisão técnica e velocidade";

  return {
    personagemNome: personagem.nome || "Shinigami",
    esquadrao: personagem.esquadrao || "11º Esquadrão",
    dominante,
    deficiente,
    virtudes,
    defeitos,
    desejos,
    medos,
    conflitos,
    estilo,
    textoCompleto: textoPers
  };
}

function getDefaultGeminiKey() {
  try {
    const b64 = "QVEuQWI4Uk42SXpRazdfV0x2OXVXaWtueUM5Mm0yYUJuNzg3endINzhyUG85SEFjLTBVaHc=";
    if (typeof atob !== 'undefined') return atob(b64);
    if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf8');
  } catch (e) {}
  return "";
}

// 3. PROMPT BUILDER PARA CHATGPT / GEMINI (COM BLACKLIST E EXCLUSIVIDADE ABSOLUTA)
function construirPromptChatGPT(personagem, dna, cenaTexto = "", dbPersonagens = [], dbZanpakutosVinculadas = []) {
  const existingList = getExistingZanpakutosSummary(dbPersonagens, dbZanpakutosVinculadas);
  const existingSection = existingList.length > 0
    ? `\nZANPAKUTŌS JÁ REGISTRADAS NO SISTEMA (ESTRITAMENTE PROIBIDO REPETIR OU GERAR NOMES/PODERES/CONCEITOS SIMILARES A ESTAS):\n${existingList.join('\n')}\n`
    : "";

  return `Você é o ZANPAKUTŌ GENESIS ENGINE (V5.0) para o Bleach RPG.
Sua missão é atuar como um criador autoral no mais alto nível de Tite Kubo (Bleach). Analise profundamente a alma do Shinigami e gere EXATAMENTE 4 CAMINHOS DE ZANPAKUTŌ (Shikai + Bankai) 100% INÉDITOS, CRIATIVOS, POÉTICOS E COMPLEXOS, matematicamente fundidos com seus traços de personalidade, virtudes, defeitos, conflitos internos e atributos.

DADOS DA ALMA DO SHINIGAMI:
- Nome: ${personagem.nome}
- Raça: ${personagem.raca || "Shinigami"} | Esquadrão: ${personagem.esquadrao || "11º Esquadrão"}
- Atributos Numéricos: Pressão Espiritual: ${dna.dominante.val}, Força: ${personagem.atributos?.forca || 10}, Velocidade: ${personagem.atributos?.velocidade || 10}, Resiliência: ${personagem.atributos?.resiliencia || 10}
- Atributo Mais Forte (Dominante): ${dna.dominante.label} (${dna.dominante.val} pts)
- Atributo Mais Fraco (Deficiente): ${dna.deficiente.label} (${dna.deficiente.val} pts)
- Descrição da Personalidade: ${dna.textoCompleto}
- Virtudes Centrais: ${dna.virtudes}
- Defeitos & Fraquezas: ${dna.defeitos}
- Desejos & Ambições: ${dna.desejos}
- Maiores Medos: ${dna.medos}
- Conflitos Internos / Paradoxos: ${dna.conflitos}
- Estilo de Combate: ${dna.estilo}
${cenaTexto ? `- Cena de Despertar Narrada pelo Jogador: "${cenaTexto}"` : ""}
${existingSection}
DIRETRIZES FUNDAMENTAIS DE QUALIDADE & ANTI-CLICHÊ:
1. PROIBIDO PODERES GENÉRICOS: Nunca gere poderes triviais como 'disparar rajadas de fogo comuns' ou 'apenas mover-se mais rápido'. Toda Shikai deve conter uma MECÂNICA TÁTICA ESPECÍFICA, REGRAS DE COMBATE INVENTIVAS, CONDIÇÕES DE ATIVAÇÃO e LIMITAÇÕES DE ALTO IMPACTO que façam sentido com a alma do Shinigami.
2. REGRA ANTI-CLONE: É proibido repetir nomes ou conceitos das Zanpakutōs já registradas acima.
3. ESTRUTURA DOS 4 CAMINHOS OBRIGATÓRIOS:
   - Caminho 1 (Elemental / Temperamento): Manifestação direta da essência emocional dominante canalizada pelo atributo mais alto (${dna.dominante.label}).
   - Caminho 2 (Conceitual / Progressivo / Regras): Uma lei tática inviolável, jogo mental, vetor espacial ou regra lógica progressiva por etapas de impacto.
   - Caminho 3 (Compensatório / Defesa da Alma): Protege o Shinigami contra o seu maior medo (${dna.medos}) e compensa seu atributo mais fraco (${dna.deficiente.label}).
   - Caminho 4 (Opositivo / Abstrato / Sombra): Explora a antítese oculta do subconsciente, o conflito interno (${dna.conflitos}) e a dualidade da mente em uma mecânica paradoxal.

CADA CAMINHO DEVE POSSUIR:
- Nome em japonês Romaji + Kanji + Tradução em Português
- Frase poética monumental de ativação/liberação
- Representação do espírito da lâmina (forma, comportamento e mundo interior)
- Forma da Shikai e design da lâmina
- Mecânica detalhada do poder e LIMITAÇÕES claras
- Bankai correspondente com Nome, Ponto de Ruptura (Breakpoint - qual limite da Shikai foi quebrado), Tipo de Evolução, Forma Monumental e Poder Transcendental.
- Índices de 1 a 10 para Potência, Abrangência, Complexidade, Versatilidade e Custo de Reiatsu.

RESPONDA OBRIGATORIAMENTE EM JSON VÁLIDO no seguinte formato:
{
  "caminhos": [
    {
      "caminhoNumero": 1,
      "tipoCaminho": "Opção 1 — Personalidade / Elemental",
      "subtitulo": "Manifestação Direta da Essência Emocional da Alma",
      "shikai": {
        "nome": "NomeRomaji",
        "kanji": "「漢字」",
        "traducao": "Tradução",
        "comando": "Frase de Ativação",
        "elemento": "Elemento/Tema Inédito",
        "espirito": "Descrição do espírito e mundo interior",
        "formaSelada": "Descrição da forma selada",
        "aparencia": "Aparência da Shikai",
        "poder": "Mecânica detalhada do poder",
        "limitacoes": "Limitações de combate",
        "custoReiatsu": "Baixo/Médio/Alto",
        "relacaoPersonalidade": "Como a personalidade gerou essa arma",
        "relacaoAtributos": "Como os atributos moldam o poder",
        "indices": { "potencia": 8, "abrangencia": 7, "complexidade": 6, "versatilidade": 7, "custo": 5 }
      },
      "bankai": {
        "nome": "NomeRomaji — Kanji",
        "tipoEvolucao": "Território / Amplificação / Regra / Inversão",
        "formaMonumental": "Forma monumental da Bankai",
        "pontoRuptura": "O limite da Shikai que foi superado",
        "poder": "Poder transcendental da Bankai",
        "pontoFraco": "Brecha estratégica clara e como um oponente inteligente pode lidar/contragolpear essa Bankai",
        "limitacoes": "Limitações e custos da Bankai",
        "significadoEspiritual": "Significado espiritual do domínio"
      }
    }
  ]
}`;
}

// 4. SINTETIZADOR DINÂMICO PROCEDURAL COGNITIVO COM COMBINATÓRIA AVANÇADA (ZERO REPETIÇÕES)
function sintetizarZanpakutosCognitivo(personagem, dna, cenaTexto = "", claimedNames = new Set(), claimedElements = new Set()) {
  const seedStr = `${personagem.nome}_${dna.textoCompleto}_${dna.virtudes}_${dna.defeitos}_${dna.desejos}_${dna.medos}_${dna.estilo}_${cenaTexto}_${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  let posHash = Math.abs(hash);

  const prefixosKanji = [
    { romaji: "Gō", kanji: "剛", sign: "Inquebrável" },
    { romaji: "En", kanji: "炎", sign: "Chama Voraz" },
    { romaji: "Rin", kanji: "凛", sign: "Gélido e Sereno" },
    { romaji: "Sen", kanji: "閃", sign: "Relâmpago Instantâneo" },
    { romaji: "Haku", kanji: "白", sign: "Alvo Puro" },
    { romaji: "Kuro", kanji: "黒", sign: "Sombra Abissal" },
    { romaji: "Shin", kanji: "神", sign: "Divino" },
    { romaji: "Ten", kanji: "天", sign: "Celestial" },
    { romaji: "Kyou", kanji: "狂", sign: "Fúria Espiritual" },
    { romaji: "Rai", kanji: "雷", sign: "Trovão" },
    { romaji: "Sei", kanji: "聖", sign: "Sacro" },
    { romaji: "Koku", kanji: "虚", sign: "Vazio Cósmico" },
    { romaji: "Kō", kanji: "光", sign: "Luz Radiante" },
    { romaji: "Jū", kanji: "重", sign: "Gravidade Intensa" },
    { romaji: "Sui", kanji: "水", sign: "Fluidez Hidráulica" },
    { romaji: "Fū", kanji: "風", sign: "Vendaval Cortante" }
  ];

  const sufixosKanji = [
    { romaji: "jin", kanji: "刃", sign: "Lâmina" },
    { romaji: "zan", kanji: "斬", sign: "Corte Preciso" },
    { romaji: "getsu", kanji: "月", sign: "Lua" },
    { romaji: "rin", kanji: "輪", sign: "Anel Espiritual" },
    { romaji: "kaze", kanji: "風", sign: "Vento" },
    { romaji: "ryū", kanji: "竜", sign: "Dragão" },
    { romaji: "mori", kanji: "森", sign: "Bastião" },
    { romaji: "chō", kanji: "蝶", sign: "Borboleta Espiritual" },
    { romaji: "hō", kanji: "鋒", sign: "Fio Cortante" },
    { romaji: "sen", kanji: "閃", sign: "Fagulha Instantânea" },
    { romaji: "maru", kanji: "丸", sign: "Círculo Perfeito" },
    { romaji: "kaku", kanji: "鶴", sign: "Garça Cerimonial" },
    { romaji: "ba", kanji: "羽", sign: "Asas da Alma" },
    { romaji: "sou", kanji: "槍", sign: "Lança Perfurante" }
  ];

  function gerarNomeDinamico(offset, temaElem) {
    for (let tryIdx = 0; tryIdx < 50; tryIdx++) {
      const p = prefixosKanji[(posHash + offset * 7 + tryIdx * 3) % prefixosKanji.length];
      const s = sufixosKanji[(posHash + offset * 11 + tryIdx * 5) % sufixosKanji.length];
      const candidate = `${p.romaji}${s.romaji}`;
      const kanji = `「${p.kanji}${s.kanji}」`;
      const trad = `${p.sign} de ${s.sign}`;
      if (!claimedNames.has(candidate.toLowerCase())) {
        return { nome: candidate, kanji, trad };
      }
    }
    const p = prefixosKanji[(posHash + offset) % prefixosKanji.length];
    const s = sufixosKanji[(posHash + offset * 3) % sufixosKanji.length];
    const uniqueNum = (posHash % 89 + 10);
    return { nome: `${p.romaji}${s.romaji} no Shin`, kanji: `「${p.kanji}${s.kanji}・真」`, trad: `${p.sign} de ${s.sign} (Transcendente)` };
  }

  // 1. CAMINHO 1: ELEMENTAL / TEMPERAMENTO
  const n1 = gerarNomeDinamico(0, "elemental");
  const elemPool = [
    { el: "Plasma Espiritual & Chamas Carmesim", arma: "Katana com lâmina de borda incandescente e tsuba em flor de lótus de fogo", pod: "Ao brandir a espada, ${personagem.nome} expele ondas de calor comprimido que aumentam a fricção do ar e cortam a armadura de Reishi adversária com estocadas explosivas.", lim: "O calor elevado desgasta o punho e exige pausas de resfriamento entre sequências de golpes intensos." },
    { el: "Eletromagnetismo & Relâmpagos Negros", arma: "Chokutō de aço fosco envolta em filamentos de plasma negro cintilante", pod: "A lâmina polariza o ar ao redor do alvo, fazendo com que cada corte dispare descargas cinéticas que aceleram a lâmina em trajetórias angulares imprevisíveis.", lim: "Descargas consecutivas reduzem temporariamente o tempo de reação motora do usuário." },
    { el: "Geada Primordial & Cristais Refratários", arma: "Tachi de cristal translúcido com reflexos glaciais que emitem névoa constante", pod: "Solidifica a umidade espiritual do perímetro em espinhos de gelo microscópicos que se alojam nas feridas e drenam o calor cinético do adversário.", lim: "Perde eficácia e alcance em ambientes de calor escaldante ou sem umidade." },
    { el: "Vácuo Espiritual & Lâminas de Vento Sônico", arma: "Wakizashi de dois gumes com micro-fendas acústicas na calha central", pod: "Cria bolsas de vácuo pressurizado que viajam na velocidade do som, desferindo múltiplos cortes invisíveis à distância sem produzir ruído sonoro.", lim: "O vento dispersa caso o usuário seja desestabilizado por impactos pesados diretos." }
  ];
  const elChoice = elemPool[(posHash) % elemPool.length];
  const c1 = {
    caminhoNumero: 1,
    tipoCaminho: "Opção 1 — Personalidade / Elemental",
    subtitulo: "Manifestação Direta da Essência Emocional da Alma",
    indiceExclusividade: 100,
    shikai: {
      id: uid(),
      nome: n1.nome,
      kanji: n1.kanji,
      traducao: n1.trad,
      comando: `Incendeie os céus e purifique a existência, ${n1.nome}!`,
      elemento: elChoice.el,
      aparencia: elChoice.arma,
      formatoArma: elChoice.arma,
      poder: elChoice.pod.replace("${personagem.nome}", personagem.nome),
      limitacoes: elChoice.lim,
      custoReiatsu: "Médio",
      relacaoPersonalidade: `Moldada pela virtude "${dna.virtudes}".`,
      relacaoAtributos: `Potencializada pelo atributo dominante (${dna.dominante.label}: ${dna.dominante.val} pts).`,
      indices: { potencia: 9, abrangencia: 8, complexidade: 6, versatilidade: 7, custo: 6 }
    },
    bankai: {
      nome: `${n1.nome}: Gōka Dai-Tenrin`,
      kanji: `「${n1.kanji.replace(/[^\\u4e00-\\u9faf]/g, '')}・業火大天輪」`,
      tipoEvolucao: "Amplificação & Domínio Territorial",
      formaMonumental: `O campo de batalha inteiro se transforma em um domínio cósmico onde gigantescas lâminas de ${elChoice.el} emergem da atmosfera.`,
      pontoRuptura: `Supera o limite de foco individual da Shikai, cobrindo um raio de 300 metros sob comando mental direto.`,
      poder: `Converte toda a pressão espiritual do ambiente em lâminas simultâneas teleguiadas que aniquilam investidas adversárias com estocadas em cadeia contínua.`,
      limitacoes: "Se mantida por mais de 5 minutos, impõe sobrecarga física severa nos circuitos de Reishi.",
      significadoEspiritual: `A consagração monumental da determinação de ${personagem.nome} em superar todos os obstáculos.`
    }
  };

  // 2. CAMINHO 2: CONCEITUAL / PROGRESSIVO / REGRAS
  const n2 = gerarNomeDinamico(1, "conceitual");
  const conceitualPool = [
    { el: "Controle de Vetores & Troca de Posição", arma: "Espada de lâmina bifurcada com guarda em compasso astronômico", pod: "Ao cruzar a lâmina com o inimigo, marca o ponto de contato com um vetor de força. O usuário pode inverter instantaneamente a direção cinética de qualquer projétil ou golpe subsequente que atinja a mesma marcação.", lim: "Requer contato prévio de lâminas para estabelecer cada vetor." },
    { el: "Contagem de Cadência & Supressão Sequencial", arma: "Lâmina reta graduada com 5 entalhes rúnicos dourados", pod: "Cada impacto consecutivo sem sofrer contra-ataque ativa um dos entalhes. A cada nível ativado, o peso espiritual da espada dobra e reduz o tempo de reação do adversário em 20%.", lim: "Se o usuário sofrer um golpe contundente, todos os entalhes se desfazem e a contagem reinicia." },
    { el: "Ressonância Harmônica & Vibração Molecular", arma: "Rapieira com empunhadura em diapasão duplo de prata celestial", pod: "Emite ondas vibratórias em alta frequência que sintonizam com a estrutura de Reishi do oponente, fragmentando defesas rígidas e dissipando barreiras espirituais no instante do choque.", lim: "Exige cálculo contínuo de distância e timing milimétrico para manter a ressonância." }
  ];
  const conChoice = conceitualPool[(posHash + 1) % conceitualPool.length];
  const c2 = {
    caminhoNumero: 2,
    tipoCaminho: "Opção 2 — Conceitual / Progressivo / Regras",
    subtitulo: "Mecânica Tática por Etapas e Leis Invioláveis",
    indiceExclusividade: 100,
    shikai: {
      id: uid(),
      nome: n2.nome,
      kanji: n2.kanji,
      traducao: n2.trad,
      comando: `Estabeleça a ordem no caos da alma, ${n2.nome}!`,
      elemento: conChoice.el,
      aparencia: conChoice.arma,
      formatoArma: conChoice.arma,
      poder: conChoice.pod,
      limitacoes: conChoice.lim,
      custoReiatsu: "Médio-Baixo",
      relacaoPersonalidade: `Reflete a mente calculista e o estilo de combate de ${personagem.nome}.`,
      relacaoAtributos: `Aproveita a precisão tática e o controle cirúrgico de movimentos.`,
      indices: { potencia: 8, abrangencia: 6, complexidade: 10, versatilidade: 9, custo: 5 }
    },
    bankai: {
      nome: `${n2.nome}: Jikū Kaiji no Judai`,
      kanji: `「${n2.kanji.replace(/[^\\u4e00-\\u9faf]/g, '')}・時空開示十代」`,
      tipoEvolucao: "Imposição Territorial de Leis Absolutas",
      formaMonumental: `O solo se converte em um gigantesco mostrador geométrico de círculos concêntricos de ouro e obsidiana.`,
      pontoRuptura: `Remove a necessidade de acertar o mesmo ponto: as regras conceituais passam a vigorar sobre todo o espaço dimensional do domínio.`,
      poder: `Impõe uma lei onde qualquer hostilidade desferida no território reflete 50% do impacto diretamente contra os canais de Reiatsu do atacante.`,
      limitacoes: "O próprio usuário está submetido às leis da arena e não pode atacar opositores que cessem o movimento.",
      significadoEspiritual: `O triunfo da estratégia lúcida sobre o caos cego da guerra.`
    }
  };

  // 3. CAMINHO 3: COMPENSATÓRIO / DEFESA DA ALMA
  const n3 = gerarNomeDinamico(2, "compensatorio");
  const compPool = [
    { el: "Fricção Gravitacional & Âncoras Cinéticas", arma: "Espada pesada de lâmina larga com placas segmentadas de aço de meteorito", pod: "Cria um campo gravitacional denso ao redor de ${personagem.nome} que desacelera projéteis e ataques de alta velocidade à medida que se aproximam, convertendo a força de colisão em estabilidade postural inabalável.", lim: "Reduz levemente a agilidade de deslocamento aéreo enquanto a âncora está ativada." },
    { el: "Prismas de Refração Espiritual & Dispersão de Impacto", arma: "Sabre prateado com tsuba espelhada e lâmina facetada como diamante", pod: "Fragmenta qualquer ataque espiritual recebido em feixes de luz inofensivos, redistribuindo o choque por toda a atmosfera ao redor e curando micro-fissuras no corpo do usuário.", lim: "Apenas dissipa energia espiritual; não anula ataques puramente físicos de massa sólida." },
    { el: "Névoa de Reishi Regenerativo & Alívio de Fadiga", arma: "Florete flexível com lâmina transparente e detalhes de pétalas esculpidas", pod: "Libera uma névoa aromática de partículas de cura que cicatriza ferimentos e restaura a estamina de ${personagem.nome} a cada corte bem-sucedido contra o oponente.", lim: "Não regenera órgãos vitais instantaneamente em caso de lesão fatal imediata." }
  ];
  const compChoice = compPool[(posHash + 2) % compPool.length];
  const c3 = {
    caminhoNumero: 3,
    tipoCaminho: "Opção 3 — Compensatório / Defesa da Alma",
    subtitulo: "Bastião Protetor e Mitigação de Vulnerabilidades",
    indiceExclusividade: 100,
    shikai: {
      id: uid(),
      nome: n3.nome,
      kanji: n3.kanji,
      traducao: n3.trad,
      comando: `Erga a barreira inexpugnável da alma, ${n3.nome}!`,
      elemento: compChoice.el,
      aparencia: compChoice.arma,
      formatoArma: compChoice.arma,
      poder: compChoice.pod.replace("${personagem.nome}", personagem.nome),
      limitacoes: compChoice.lim,
      custoReiatsu: "Baixo",
      relacaoPersonalidade: `Fortifica o espírito e ergue proteção inabalável para ${personagem.nome}.`,
      relacaoAtributos: `Fortalece o atributo mais vulnerável (${dna.deficiente.label}: ${dna.deficiente.val} pts).`,
      indices: { potencia: 7, abrangencia: 7, complexidade: 7, versatilidade: 9, custo: 4 }
    },
    bankai: {
      nome: `${n3.nome}: Fuyō Sōki no Aegis`,
      kanji: `「${n3.kanji.replace(/[^\\u4e00-\\u9faf]/g, '')}・不耀蒼輝之金剛」`,
      tipoEvolucao: "Fortaleza & Transcendência Defensiva",
      formaMonumental: `Uma monumental couraça de asas de aço espiritual e colunas de luz pura envolve ${personagem.nome} e seus aliados.`,
      pontoRuptura: `Extingue a fragilidade física da Shikai: qualquer dano catastrófico é dissipado em ondas concussivas no solo sem ferir o Shinigami.`,
      poder: `Ergue um santuário inviolável onde o fluxo de vitalidade é renovado continuamente enquanto a lâmina dispara contra-ataques autônomos de alta densidade.`,
      limitacoes: "O usuário atua como o pilar da fortaleza e não pode realizar esquivas acrobáticas de longa distância.",
      significadoEspiritual: `A transformação do dever de proteção na maior muralha inquebrável da Soul Society.`
    }
  };

  // 4. CAMINHO 4: OPOSITIVO / ABSTRATO / SOMBRA
  const n4 = gerarNomeDinamico(3, "opositivo");
  const oposPool = [
    { el: "Distorção Perceptiva & Espelhos do Vazio", arma: "Wakizashi de dois gumes com fio invertido e lâmina de vidro negro", pod: "Distorce a percepção sensorial do adversário, fazendo-o enxergar o ângulo dos cortes com um desvio angular de 30 graus em relação à trajetória física real.", lim: "Oponentes experientes com sentidos espirituais aguçados podem antecipar pelo som do deslocamento de ar." },
    { el: "Inversão de Causalidade & Absorção de Sombra", arma: "Kusarigama com corrente de sombra líquida e lâmina fosca sem brilho", pod: "Converte as sombras projetadas pelos combatentes em lâminas sólidas que atacam de surpresa a partir do chão, ignorando a postura defensiva frontal do alvo.", lim: "Requer fontes de luz no ambiente para que silhuetas e sombras sejam projetadas no solo." },
    { el: "Paradoxo Espacial & Supressão de Presença", arma: "Nodachi de lâmina cinzenta que parece vibrar entre duas posições no ar", pod: "Faz com que a espada atravesse defesas sólidas de Reishi como névoa intangível e só adquira massa física sólida no exato instante do corte contra o alvo.", lim: "Demanda serenidade absoluta; qualquer hesitação do usuário torna a espada tangível antes da hora." }
  ];
  const oposChoice = oposPool[(posHash + 3) % oposPool.length];
  const c4 = {
    caminhoNumero: 4,
    tipoCaminho: "Opção 4 — Opositivo / Abstrato / Sombra",
    subtitulo: "Exploração do Paradoxo e da Dualidade Oculta",
    indiceExclusividade: 100,
    shikai: {
      id: uid(),
      nome: n4.nome,
      kanji: n4.kanji,
      traducao: n4.trad,
      comando: `Inverta a verdade e devore o reflexo, ${n4.nome}!`,
      elemento: oposChoice.el,
      aparencia: oposChoice.arma,
      formatoArma: oposChoice.arma,
      poder: oposChoice.pod,
      limitacoes: oposChoice.lim,
      custoReiatsu: "Alto",
      relacaoPersonalidade: `Explora a sombra inconsciente e a dualidade profunda da alma de ${personagem.nome}.`,
      relacaoAtributos: `Manipula a densidade de Reiatsu em frequências contrárias à percepção comum.`,
      indices: { potencia: 10, abrangencia: 8, complexidade: 9, versatilidade: 8, custo: 8 }
    },
    bankai: {
      nome: `${n4.nome}: Muken Kōjin no Paradox`,
      kanji: `「${n4.kanji.replace(/[^\\u4e00-\\u9faf]/g, '')}・無間皇刃之悖論」`,
      tipoEvolucao: "Inversão da Realidade & Paradoxo",
      formaMonumental: `O cenário inverte suas cores em uma distorção monocromática onde miragens e sombras ganham massa física tangível.`,
      pontoRuptura: `Supera o limite de intangibilidade da Shikai: as sombras cortam a própria malha do espaço, invertendo causa e efeito no combate.`,
      poder: `Quando o adversário tenta esquivar, ele colide com o golpe; quando tenta bloquear, a lâmina o atravessa como fumaça e atinge pelas costas.`,
      limitacoes: "Exige autocontrole supremo para não ser desorientado pela distorção do próprio domínio.",
      significadoEspiritual: `A dominação plena da dualidade da alma: onde há a maior luz, reside a mais afiada das sombras.`
    }
  };

  return [c1, c2, c3, c4];
}

function getValidGeminiApiKey(apiKey = "") {
  const defaultKey = getDefaultGeminiKey();
  if (apiKey && apiKey.length > 20 && !apiKey.includes("AQ.Ab8RN6I0r1qN15nnRQd")) {
    return apiKey;
  }
  if (typeof localStorage !== 'undefined') {
    const local = localStorage.getItem("bleach_openai_key");
    if (local && local.includes("AQ.Ab8RN6I0r1qN15nnRQd")) {
      try { localStorage.removeItem("bleach_openai_key"); } catch(e) {}
      return defaultKey;
    }
    if (local && local.length > 20 && !local.includes("AQ.Ab8RN6I0r1qN15nnRQd")) {
      return local;
    }
  }
  if (typeof window !== 'undefined' && window.BLEACH_CONFIG?.openaiApiKey && window.BLEACH_CONFIG.openaiApiKey.length > 20 && !window.BLEACH_CONFIG.openaiApiKey.includes("AQ.Ab8RN6I0r1qN15nnRQd")) {
    return window.BLEACH_CONFIG.openaiApiKey;
  }
  return defaultKey;
}

// 5. FUNÇÃO CENTRAL ASSÍNCRONA DE GERAÇÃO COM IA (COM AUTO-RETRY E EXCLUSIVIDADE ABSOLUTA)
async function gerar4CaminhosZanpakutoAI_Async(personagem, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "", apiKey = "") {
  const { claimed, claimedNames, claimedElements } = getClaimedSignatures(dbPersonagens, dbZanpakutosVinculadas);
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  let keyToUse = getValidGeminiApiKey(apiKey);

  let caminhosResultantes = null;

  async function callGemini(key) {
    const prompt = construirPromptChatGPT(personagem, dna, cenaTexto, dbPersonagens, dbZanpakutosVinculadas);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt + "\n\nResponda ESTRITAMENTE em formato JSON válido conforme o esquema solicitado." }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.95
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed && Array.isArray(parsed.caminhos) && parsed.caminhos.length >= 4) {
          return parsed.caminhos.slice(0, 4).map((c, idx) => ({
            ...c,
            caminhoNumero: idx + 1,
            shikai: {
              ...c.shikai,
              id: uid(),
              assinaturaEspiritual: calcularAssinaturaEspiritual(c.shikai)
            }
          }));
        }
      }
    } else {
      console.warn("Gemini HTTP Error:", res.status, await res.text());
    }
    return null;
  }

  // 1. Tentar Google Gemini API (gemini-3.6-flash)
  if (keyToUse && !keyToUse.startsWith("sk-")) {
    try {
      console.log("Chamando Google Gemini 3.6 Flash para geração de Zanpakutō...");
      caminhosResultantes = await callGemini(keyToUse);
      if (!caminhosResultantes && keyToUse !== getDefaultGeminiKey()) {
        console.log("Tentando novamente com a chave padrão do Gemini...");
        caminhosResultantes = await callGemini(getDefaultGeminiKey());
      }
    } catch (err) {
      console.warn("Erro ao chamar Google Gemini API:", err);
      if (keyToUse !== getDefaultGeminiKey()) {
        try {
          caminhosResultantes = await callGemini(getDefaultGeminiKey());
        } catch (e) {}
      }
    }
  }

  // 2. Tentar OpenAI se chave for da OpenAI
  if (!caminhosResultantes && keyToUse && keyToUse.startsWith("sk-")) {
    try {
      console.log("Chamando OpenAI GPT-4o-mini...");
      const prompt = construirPromptChatGPT(personagem, dna, cenaTexto, dbPersonagens, dbZanpakutosVinculadas);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keyToUse}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Você é um mestre narrador de Bleach RPG especialista no Zanpakuto Genesis Engine v5.0. Responda APENAS em JSON válido." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.95
        })
      });

      if (res.ok) {
        const data = await res.json();
        const contentStr = data.choices?.[0]?.message?.content;
        if (contentStr) {
          const parsed = JSON.parse(contentStr);
          if (parsed && Array.isArray(parsed.caminhos) && parsed.caminhos.length >= 4) {
            caminhosResultantes = parsed.caminhos.slice(0, 4).map((c, idx) => ({
              ...c,
              caminhoNumero: idx + 1,
              shikai: {
                ...c.shikai,
                id: uid(),
                assinaturaEspiritual: calcularAssinaturaEspiritual(c.shikai)
              }
            }));
          }
        }
      }
    } catch (err) {
      console.warn("OpenAI fetch falhou:", err);
    }
  }

  // 2. Sintetizador Cognitivo Procedural (Filtra todas as duplicatas contra banco de dados)
  if (!caminhosResultantes) {
    console.log("Executando Sintetizador Cognitivo ZGE V5.0 baseado na personalidade com filtro anti-duplicatas...");
    caminhosResultantes = sintetizarZanpakutosCognitivo(personagem, dna, cenaTexto, claimedNames, claimedElements);
  }

  // 3. Validação rigorosa pós-geração: Cálculo de Similaridade contra todas as outras fichas
  const validatedCaminhos = caminhosResultantes.map((c) => {
    let maxSimilarity = 0;
    let similarWithChar = "";
    let similarWithZk = "";

    (dbPersonagens || []).forEach((otherP) => {
      if (otherP.id !== personagem.id && otherP.zanpakuto?.shikaiAtiva) {
        const sim = calcularIndiceSimilaridade(c.shikai, otherP.zanpakuto.shikaiAtiva);
        if (sim > maxSimilarity) {
          maxSimilarity = sim;
          similarWithChar = otherP.nome;
          similarWithZk = otherP.zanpakuto.shikaiAtiva.nome;
        }
      }
    });

    const isExclusivo = maxSimilarity < 40;
    const indiceExclusividade = Math.max(1, 100 - maxSimilarity);

    return {
      ...c,
      indiceExclusividade,
      isExclusivo,
      similaridadeMaxima: maxSimilarity,
      similarCom: maxSimilarity > 0 ? `${similarWithZk} (${similarWithChar})` : null,
      dnaEspiritual: {
        dominante: dna.dominante.label,
        deficiente: dna.deficiente.label,
        virtudePrincipal: dna.virtudes.split(',')[0],
        defeitoPrincipal: dna.defeitos.split(',')[0]
      }
    };
  });

  return validatedCaminhos;
}

// Compatibilidade Síncrona para Shikai
function gerar4CaminhosZanpakutoAI(personagem, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "") {
  const { claimedNames, claimedElements } = getClaimedSignatures(dbPersonagens, dbZanpakutosVinculadas);
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  return sintetizarZanpakutosCognitivo(personagem, dna, cenaTexto, claimedNames, claimedElements);
}

// =========================================================================
// 6. MÓDULO DE EVOLUÇÃO DE BANKAI (3 CAMINHOS A PARTIR DA SHIKAI ESCOLHIDA)
// =========================================================================

function construirPromptBankaiEvolucao(personagem, shikai, dna, cenaTexto = "", dbPersonagens = [], dbZanpakutosVinculadas = []) {
  const existingList = getExistingZanpakutosSummary(dbPersonagens, dbZanpakutosVinculadas);
  const existingSection = existingList.length > 0
    ? `\nZANPAKUTŌS JÁ REGISTRADAS NO SISTEMA (PROIBIDO REPETIR NOMES/PODERES/CONCEITOS):\n${existingList.join('\n')}\n`
    : "";

  const sNome = shikai?.nome || "Lâmina Espiritual";
  const sKanji = shikai?.kanji || "";
  const sTrad = shikai?.traducao || "Espada da Alma";
  const sCmd = shikai?.comando || "Libere-se";
  const sElem = shikai?.elemento || "Reiatsu Puro";
  const sApar = shikai?.aparencia || shikai?.formatoArma || "Katana cerimonial";
  const sPod = shikai?.poder || "Emissão de Reiatsu concentrado";
  const sLim = shikai?.limitacoes || "Consumo moderado de estamina";

  return `Você é o ZANPAKUTŌ GENESIS ENGINE (V5.0) — MÓDULO DE TRANSCENDÊNCIA DE BANKAI.
O Shinigami ${personagem.nome} já despertou e vinculou a sua Shikai: "${sNome}" ${sKanji ? `(${sKanji})` : ""}.
Sua missão é analisar esta Shikai ESCOLHIDA, a personalidade do Shinigami, seus atributos e a cena de despertar, gerando EXATAMENTE 3 OPÇÕES DE BANKAI que sejam evoluções diretas da Shikai.

DADOS DA SHIKAI ESCOLHIDA DO SHINIGAMI:
- Nome da Shikai: ${sNome} ${sKanji} (Tradução: ${sTrad})
- Frase de Comando: "${sCmd}"
- Elemento / Tema: ${sElem}
- Forma da Shikai: ${sApar}
- Mecânica & Poder da Shikai: ${sPod}
- Limitações da Shikai: ${sLim}

PERFIL & DNA ESPIRITUAL DO SHINIGAMI:
- Nome: ${personagem.nome} | Raça: ${personagem.raca || "Shinigami"} | Esquadrão: ${personagem.esquadrao || "11º Esquadrão"}
- Atributos: Pressão Espiritual: ${dna.dominante.val}, Força: ${personagem.atributos?.forca || 10}, Velocidade: ${personagem.atributos?.velocidade || 10}, Resiliência: ${personagem.atributos?.resiliencia || 10}
- Atributo Dominante: ${dna.dominante.label} | Atributo Deficiente: ${dna.deficiente.label}
- Personalidade Selada: ${dna.textoCompleto}
- Virtudes: ${dna.virtudes} | Defeitos: ${dna.defeitos}
- Desejos: ${dna.desejos} | Medos: ${dna.medos} | Conflitos: ${dna.conflitos} | Estilo: ${dna.estilo}
${cenaTexto ? `- Cena de Despertar de Bankai Narrada pelo Jogador: "${cenaTexto}"` : ""}
${existingSection}
REGRAS OBRIGATÓRIAS PARA AS 3 OPÇÕES DE BANKAI (EVOLUÇÕES DIRETAS):
Você DEVE gerar EXATAMENTE 3 ramificações evolutivas da Shikai "${sNome}":

1. OPÇÃO 1 — EVOLUÇÃO COMPLEMENTAR:
   - Amplificação e transcendência do princípio central da Shikai "${sNome}".
   - Quebra o limite de alcance e potência, expandindo o poder para nível territorial ou monumental.
2. OPÇÃO 2 — EVOLUÇÃO SUPLEMENTAR:
   - Adiciona uma camada tática de suporte, proteção ou mitigação das fraquezas da Shikai.
   - O poder básico é sustentado por novas propriedades espirituais (armaduras reativas, controle de terreno, regeneração de estamina).
3. OPÇÃO 3 — EVOLUÇÃO OPOSTA COMPLEMENTAR:
   - Inversão ou paradoxo do poder da Shikai, revelando o lado sombrio ou oculto da alma do Shinigami.
   - O poder atua na antítese surpreendente (ex: fogo vira combustão do vácuo frio; velocidade vira distorção de massa).

CADA UMA DAS 3 BANKAIS DEVE CONTER:
- Nome em japonês Romaji + Kanji + Tradução em Português
- Frase monumental de liberação ("Ban-kai! ...")
- Ponto de Ruptura (Breakpoint - qual limite específico da Shikai foi estilhaçado)
- Forma Monumental / Manifestação Visual
- Poder & Mecânica Transcendental
- Ponto Fraco & Brecha Estratégica: Uma forma lógica e clara de um oponente inteligente lidar/contragolpear essa Bankai (evitando poderes absolutos/invencíveis). Exemplo: se o poder corta quem bloqueia, quem ataca agressivamente sem defender consegue cruzar lâminas.
- Limitações de combate e custo de desgaste
- Significado Espiritual
- Índices de 1 a 10 para Potência, Abrangência, Complexidade, Versatilidade e Custo de Reiatsu.

RESPONDA OBRIGATORIAMENTE EM JSON VÁLIDO no seguinte formato:
{
  "bankais": [
    {
      "opcaoNumero": 1,
      "tipoEvolucao": "Evolução Complementar",
      "subtitulo": "Transcendência Direta & Amplificação Territorial",
      "nome": "${sNome} — NomeBankaiRomaji",
      "kanji": "「${sKanji ? sKanji.replace(/[^\\u4e00-\\u9faf]/g, '') : '卍'}・漢字」",
      "traducao": "Tradução em Português",
      "comando": "Ban-kai! Frase monumental de liberação",
      "pontoRuptura": "O limite específico da Shikai superado",
      "formaMonumental": "Descrição visual da manifestação monumental",
      "poder": "Mecânica transcendental do poder da Bankai",
      "pontoFraco": "Como o oponente pode lidar ou contragolpear essa Bankai estrategicamente",
      "limitacoes": "Limitações e custo de desgaste",
      "significadoEspiritual": "Significado filosófico do domínio",
      "shikaiBase": "${sNome}",
      "indices": { "potencia": 10, "abrangencia": 9, "complexidade": 8, "versatilidade": 8, "custo": 8 }
    },
    {
      "opcaoNumero": 2,
      "tipoEvolucao": "Evolução Suplementar",
      "subtitulo": "Expansão Tática & Mitigação de Fraquezas",
      "nome": "${sNome} — NomeBankaiRomaji",
      "kanji": "「${sKanji ? sKanji.replace(/[^\\u4e00-\\u9faf]/g, '') : '卍'}・漢字」",
      "traducao": "Tradução em Português",
      "comando": "Ban-kai! Frase monumental de liberação",
      "pontoRuptura": "O limite específico da Shikai superado",
      "formaMonumental": "Descrição visual da manifestação monumental",
      "poder": "Mecânica transcendental do poder da Bankai",
      "pontoFraco": "Como o oponente pode lidar ou contragolpear essa Bankai estrategicamente",
      "limitacoes": "Limitações e custo de desgaste",
      "significadoEspiritual": "Significado filosófico do domínio",
      "shikaiBase": "${sNome}",
      "indices": { "potencia": 9, "abrangencia": 8, "complexidade": 9, "versatilidade": 9, "custo": 7 }
    },
    {
      "opcaoNumero": 3,
      "tipoEvolucao": "Evolução Oposta Complementar",
      "subtitulo": "Inversão da Realidade & Paradoxo da Sombra",
      "nome": "${sNome} — NomeBankaiRomaji",
      "kanji": "「${sKanji ? sKanji.replace(/[^\\u4e00-\\u9faf]/g, '') : '卍'}・漢字」",
      "traducao": "Tradução em Português",
      "comando": "Ban-kai! Frase monumental de liberação",
      "pontoRuptura": "O limite específico da Shikai superado",
      "formaMonumental": "Descrição visual da manifestação monumental",
      "poder": "Mecânica transcendental do poder da Bankai",
      "pontoFraco": "Como o oponente pode lidar ou contragolpear essa Bankai estrategicamente",
      "limitacoes": "Limitações e custo de desgaste",
      "significadoEspiritual": "Significado filosófico do domínio",
      "shikaiBase": "${sNome}",
      "indices": { "potencia": 10, "abrangencia": 9, "complexidade": 10, "versatilidade": 8, "custo": 9 }
    }
  ]
}`;
}

function sintetizar3BankaisEvolucaoCognitivo(personagem, shikai, dna, cenaTexto = "") {
  const sNome = shikai?.nome || "Zanpakutō";
  const sKanji = shikai?.kanji || "";
  const sElem = shikai?.elemento || "Energia Espiritual";
  const sPod = shikai?.poder || "Cortes de alta densidade";
  const sLim = shikai?.limitacoes || "Alcance e consumo de estamina";
  const sCmd = shikai?.comando || "Libere";

  return [
    {
      opcaoNumero: 1,
      tipoEvolucao: "Evolução Complementar",
      subtitulo: "Transcendência Direta & Amplificação Territorial",
      nome: `${sNome}: Dai-Rinne Kaijin`,
      kanji: `「${sKanji ? sKanji.replace(/[^\\u4e00-\\u9faf]/g, '') : '卍'}・大輪廻界神」`,
      traducao: "Grande Roda da Transcendência Divina",
      comando: `Ban-kai! Desperte em tua glória primordial, ${sNome}!`,
      pontoRuptura: `Supera o limite de alcance e foco da Shikai: a mecânica de [${sElem}] agora permeia toda a atmosfera em um raio monumental de 300 metros sob o comando mental de ${personagem.nome}.`,
      formaMonumental: `O campo de batalha se transforma em um domínio absoluto onde lâminas monumentais e manifestações puras de ${sElem} emergem do ar, respondendo à virtude "${dna.virtudes}".`,
      poder: `Amplifica a mecânica da Shikai em escala soberana. O poder original (${sPod}) agora é projetado em dezenas de ângulos simultâneos sem necessidade de movimento corporal.`,
      pontoFraco: `Por ser uma manifestação territorial de longo alcance, se o oponente penetrar o perímetro em velocidade pura (Shunpo/Hohō) e lutar colado ao usuário em combate corpo a corpo frenético sem recuar, a densidade dos cortes perde precisão para não ferir o próprio conjurador.`,
      limitacoes: `Consumo massivo de Reiatsu proporcional à Pressão Espiritual (${dna.dominante.val} pts), exigindo foco absoluto para não sobrecarregar os circuitos da alma.`,
      significadoEspiritual: `A consagração definitiva da determinação inabalável de ${personagem.nome} em transcender seus limites.`,
      shikaiBase: sNome,
      indices: { potencia: 10, abrangencia: 9, complexidade: 8, versatilidade: 8, custo: 9 }
    },
    {
      opcaoNumero: 2,
      tipoEvolucao: "Evolução Suplementar",
      subtitulo: "Expansão Tática & Mitigação de Fraquezas",
      nome: `${sNome}: Shugo Shin’ei`,
      kanji: `「${sKanji ? sKanji.replace(/[^\\u4e00-\\u9faf]/g, '') : '卍'}・守護神影」`,
      traducao: "Bastião Protetor da Sombra Divina",
      comando: `Ban-kai! Erga o manto impenetrável da alma, ${sNome}!`,
      pontoRuptura: `Elimina a fraqueza declarada da Shikai ("${sLim}") e ergue um escudo impenetrável contra o maior medo do Shinigami: "${dna.medos}".`,
      formaMonumental: `Armadura cerimonial de Reishi e uma aura densa de ${sElem} envolvem ${personagem.nome}, gerando barreiras defensivas articuladas e esferas de controle tático.`,
      poder: `Integra propriedades de suporte supremo e controle espacial à Shikai. Absorve a Reiatsu dos ataques inimigos recebidos e a converte em regeneração de postura e fortalecimento do atributo ${dna.deficiente.label}.`,
      pontoFraco: `A barreira defensiva necessita de uma fração de segundo de recalibração após absorver um impacto pesado; se o adversário desferir ataques sequenciais duplos ou contínuos sem pausa, o segundo golpe atinge o corpo antes da barreira se recompor.`,
      limitacoes: "Requer controle tático contínuo para manter a estabilidade entre o ataque ofensivo e a barreira de suporte.",
      significadoEspiritual: `A maturidade espiritual de ${personagem.nome} em proteger não apenas sua vida, mas a honra e o destino de todos ao seu redor.`,
      shikaiBase: sNome,
      indices: { potencia: 9, abrangencia: 8, complexidade: 9, versatilidade: 10, custo: 7 }
    },
    {
      opcaoNumero: 3,
      tipoEvolucao: "Evolução Oposta Complementar",
      subtitulo: "Inversão da Realidade & Paradoxo da Sombra",
      nome: `${sNome}: Muken Paradox`,
      kanji: `「${sKanji ? sKanji.replace(/[^\\u4e00-\\u9faf]/g, '') : '卍'}・無間反理」`,
      traducao: "Paradoxo Infinito da Antítese",
      comando: `Ban-kai! Inverta a verdade e revele o abismo, ${sNome}!`,
      pontoRuptura: `Inverte a regra básica de funcionamento da Shikai: o que antes dependia de contato ou corte direto agora atua como uma lei cósmica paradoxal atrelada ao conflito interior ("${dna.conflitos}").`,
      formaMonumental: `O cenário escurece em tons monocromáticos onde as cores da Reiatsu de ${sElem} se invertem, criando distorções geométricas flutuantes de sombra e vazio.`,
      poder: `Manifesta o lado sombrio do poder: em vez do efeito direto da Shikai (${sPod}), impõe uma lei onde qualquer resistência calculada ou tentativa de defesa do oponente amplifica o dano recebido.`,
      pontoFraco: `A lei da Bankai é ativada exclusivamente pela intenção de defesa ou cálculo tático do alvo. Se o oponente desligar o raciocínio, agir por puro instinto animal e atacar com intenção irrefletida de destruição mútua sem nunca tentar bloquear, a inversão paradoxal não se ancora.`,
      limitacoes: `Risco de desestabilização da própria mente se o usuário sucumbir ao defeito "${dna.defeitos}".`,
      significadoEspiritual: `O domínio pleno da dualidade: ${personagem.nome} aceita sua sombra interior e a transforma na sua arma mais letal.`,
      shikaiBase: sNome,
      indices: { potencia: 10, abrangencia: 9, complexidade: 10, versatilidade: 8, custo: 9 }
    }
  ];
}

// Função Assíncrona de Geração de 3 Bankais com IA
async function gerar3BankaisEvolucaoAI_Async(personagem, shikai, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "", apiKey = "") {
  const shikaiBase = shikai || personagem.zanpakuto?.shikaiAtiva || { nome: "Zanpakutō", elemento: "Espiritual" };
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  let keyToUse = getValidGeminiApiKey(apiKey);

  let bankaisResultantes = null;

  async function callGeminiBankai(key) {
    const prompt = construirPromptBankaiEvolucao(personagem, shikaiBase, dna, cenaTexto, dbPersonagens, dbZanpakutosVinculadas);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt + "\n\nResponda ESTRITAMENTE em formato JSON válido conforme o esquema de 3 bankais solicitado." }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.95
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (parsed && Array.isArray(parsed.bankais) && parsed.bankais.length >= 3) {
          return parsed.bankais.slice(0, 3).map((b, idx) => ({
            ...b,
            opcaoNumero: idx + 1,
            id: uid(),
            shikaiBase: shikaiBase.nome
          }));
        }
      }
    } else {
      console.warn("Gemini Bankai HTTP Error:", res.status, await res.text());
    }
    return null;
  }

  // 1. Tentar Google Gemini API (gemini-3.6-flash)
  if (keyToUse && !keyToUse.startsWith("sk-")) {
    try {
      console.log("Chamando Google Gemini API (gemini-3.6-flash) para geração das 3 Evoluções de Bankai...");
      bankaisResultantes = await callGeminiBankai(keyToUse);
      if (!bankaisResultantes && keyToUse !== getDefaultGeminiKey()) {
        console.log("Tentando novamente Bankai com a chave padrão do Gemini...");
        bankaisResultantes = await callGeminiBankai(getDefaultGeminiKey());
      }
    } catch (err) {
      console.warn("Google Gemini API fetch failed for Bankai:", err);
      if (keyToUse !== getDefaultGeminiKey()) {
        try {
          bankaisResultantes = await callGeminiBankai(getDefaultGeminiKey());
        } catch(e) {}
      }
    }
  }

  // 2. Tentar OpenAI (ChatGPT)
  if (!bankaisResultantes && keyToUse && keyToUse.startsWith("sk-")) {
    try {
      console.log("Chamando OpenAI API (ChatGPT) para geração das 3 Evoluções de Bankai...");
      const prompt = construirPromptBankaiEvolucao(personagem, shikaiBase, dna, cenaTexto, dbPersonagens, dbZanpakutosVinculadas);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${keyToUse}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Você é um mestre narrador de Bleach RPG especialista em Bankai e no Zanpakuto Genesis Engine v5.0. Responda APENAS em JSON válido." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.88
        })
      });

      if (res.ok) {
        const data = await res.json();
        const contentStr = data.choices?.[0]?.message?.content;
        if (contentStr) {
          const parsed = JSON.parse(contentStr);
          if (parsed && Array.isArray(parsed.bankais) && parsed.bankais.length >= 3) {
            console.log("3 Evoluções de Bankai geradas com sucesso pelo ChatGPT!");
            bankaisResultantes = parsed.bankais.slice(0, 3).map((b, idx) => ({
              ...b,
              opcaoNumero: idx + 1,
              id: uid(),
              shikaiBase: shikaiBase.nome
            }));
          }
        }
      }
    } catch (err) {
      console.warn("OpenAI fetch failed for Bankai, falling back to Cognitive Engine:", err);
    }
  }

  // 3. Fallback Procedural Cognitivo
  if (!bankaisResultantes) {
    console.log("Executando Sintetizador Cognitivo de Bankai ZGE V5.0...");
    bankaisResultantes = sintetizar3BankaisEvolucaoCognitivo(personagem, shikaiBase, dna, cenaTexto);
  }

  // Mapeia para o formato de caminhos esperado pelo modal de seleção
  return bankaisResultantes.map((b, idx) => ({
    caminhoNumero: idx + 1,
    tipoCaminho: `Opção ${idx + 1} — ${b.tipoEvolucao}`,
    subtitulo: b.subtitulo || "Evolução Espiritual da Shikai",
    tipoEvolucao: b.tipoEvolucao,
    isBankaiEvolucao: true,
    shikai: shikaiBase,
    bankai: b,
    indiceExclusividade: 100,
    isExclusivo: true,
    dnaEspiritual: {
      dominante: dna.dominante.label,
      deficiente: dna.deficiente.label,
      virtudePrincipal: dna.virtudes.split(',')[0],
      defeitoPrincipal: dna.defeitos.split(',')[0]
    }
  }));
}

function gerar3BankaisEvolucaoAI(personagem, shikai, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "") {
  const shikaiBase = shikai || personagem.zanpakuto?.shikaiAtiva || { nome: "Zanpakutō", elemento: "Espiritual" };
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  const bankais = sintetizar3BankaisEvolucaoCognitivo(personagem, shikaiBase, dna, cenaTexto);
  return bankais.map((b, idx) => ({
    caminhoNumero: idx + 1,
    tipoCaminho: `Opção ${idx + 1} — ${b.tipoEvolucao}`,
    subtitulo: b.subtitulo,
    isBankaiEvolucao: true,
    shikai: shikaiBase,
    bankai: b,
    indiceExclusividade: 100,
    isExclusivo: true
  }));
}

// =========================================================================
// SISTEMA DE ATRIBUTOS DA ZANPAKUTŌ & PROGRESSÃO DE CAPACIDADES TÁTICAS
// =========================================================================

function calcularAtributosZanpakuto(playerAttrs, isBankai = false) {
  const p = Math.max(1, Number(playerAttrs?.pressao || 10));
  const f = Math.max(1, Number(playerAttrs?.forca || 10));
  const v = Math.max(1, Number(playerAttrs?.velocidade || 10));
  const r = Math.max(1, Number(playerAttrs?.resiliencia || 10));

  // Fórmulas Base 100
  let controle = 100 + Math.round((v * 0.4) + (p * 0.4) + (f * 0.2));
  let alcance = 100 + Math.round((p * 0.6) + (v * 0.4));
  let corte = 100 + Math.round((f * 0.6) + (p * 0.4));
  let resiliencia = 100 + Math.round((r * 0.7) + (f * 0.3));
  let pressaoEspiritual = 100 + Math.round((p * 0.8) + (r * 0.2));

  if (isBankai) {
    controle = Math.round(controle * 2.8);
    alcance = Math.round(alcance * 3.5);
    corte = Math.round(corte * 3.2);
    resiliencia = Math.round(resiliencia * 3.0);
    pressaoEspiritual = Math.round(pressaoEspiritual * 3.5);
  }

  const media = Math.round((controle + alcance + corte + resiliencia + pressaoEspiritual) / 5);

  let alcanceMetros = "10 a 25m (Curto Alcance / Projeção Direta)";
  if (!isBankai) {
    if (alcance >= 800) alcanceMetros = `${Math.round(alcance * 0.6)}m (Domínio de Área Expandida)`;
    else if (alcance >= 450) alcanceMetros = `${Math.round(alcance * 0.45)}m (Longo Alcance / Precisão Tática)`;
    else if (alcance >= 250) alcanceMetros = `${Math.round(alcance * 0.3)}m (Médio Alcance)`;
    else alcanceMetros = `${Math.round(alcance * 0.15 + 5)}m (Curto Alcance / Melee Espiritual)`;
  } else {
    if (alcance >= 2500) alcanceMetros = `${(alcance / 1000).toFixed(1)} km (Domínio Territorial Absoluto)`;
    else if (alcance >= 1200) alcanceMetros = `${Math.round(alcance * 0.8)}m (Domínio de Distrito)`;
    else alcanceMetros = `${Math.round(alcance * 0.5)}m (Domínio de Batalha Monumental)`;
  }

  // Modos de Pressão Espiritual da Zanpakutō
  const bonusAbsorcaoReiatsu = Math.round(pressaoEspiritual * (isBankai ? 0.35 : 0.25));
  const bonusDanoRessonancia = Math.round(pressaoEspiritual * (isBankai ? 0.55 : 0.40));

  return {
    controle,
    alcance,
    corte,
    resiliencia,
    pressaoEspiritual,
    media,
    alcanceMetros,
    bonusAbsorcaoReiatsu,
    bonusDanoRessonancia,
    isBankai
  };
}

function gerarCapacidadesTaticasZanpakuto(arma, statsZk, isBankai = false) {
  const nome = arma?.nome || (isBankai ? "Bankai Soberana" : "Shikai Desperta");
  const elemento = arma?.elemento || "Espiritual";
  const formato = (arma?.formatoArma || arma?.aparencia || "").toLowerCase();
  const poder = arma?.poder || "";

  const isRanged = formato.includes("arco") || formato.includes("flecha") || formato.includes("disparo") || formato.includes("projétil") || formato.includes("agulha") || formato.includes("pistola") || formato.includes("canhão") || formato.includes("orbe");
  const isHeavy = formato.includes("machado") || formato.includes("martelo") || formato.includes("nodachi") || formato.includes("pesad") || formato.includes("bastão") || formato.includes("montante");
  const isFlexible = formato.includes("chicote") || formato.includes("corrente") || formato.includes("fita") || formato.includes("fio") || formato.includes("líquid") || formato.includes("névoa") || formato.includes("vento");

  const reqShikai = [100, 200, 400, 700, 1100];
  const reqBankai = [300, 600, 1100, 1800, 2600];
  const reqs = isBankai ? reqBankai : reqShikai;

  let niveis = [];

  if (!isBankai) {
    // SHIKAI TACTICAL PROGRESSION
    niveis = [
      {
        nivel: 1,
        titulo: "Nível 1 — Fundamentos da Liberação & Projeção Primária",
        req: reqs[0],
        desbloqueado: statsZk.media >= reqs[0],
        atributoChave: "Controle & Corte",
        corAtributo: "#4FB3E8",
        icone: "🗡️",
        descricao: isRanged
          ? `Manifestação estável da forma de disparo de ${nome}. Permite projetar projéteis de ${elemento} em trajetória retilínea padrão, sincronizando o consumo de Reishi à cadência de respiração do Shinigami.`
          : `Canalização do fluxo de ${elemento} ao longo do corpo de ${nome}. Os golpes físicos agora transmitem a assinatura elemental básica, permitindo cortes estabilizados e defesa de postura.`,
        aplicacaoTatica: isRanged
          ? "Disparos diretos de média distância com cadência constante. Ideal para sondar defesas e medir reflexos do inimigo."
          : "Cortes diretos de Zanjutsu fortalecidos com a energia elemental da arma. Mantém a lâmina alinhada sem desvio."
      },
      {
        nivel: 2,
        titulo: "Nível 2 — Moldagem Dinâmica & Variação de Densidade",
        req: reqs[1],
        desbloqueado: statsZk.media >= reqs[1],
        atributoChave: "Controle",
        corAtributo: "#5FA96B",
        icone: "⚖️",
        descricao: isRanged
          ? `Controle refinado da geometria dos disparos de ${nome}. O Shinigami pode modular instantaneamente o tipo de projétil: aumentar a massa da flecha para gerar impacto esmagador de recuo, afilar a ponta para disparos ultrarrápidos de perfuração imediata, ou alterar a velocidade de disparo em combate.`
          : isFlexible
          ? `Maleabilidade fluida de ${nome}. O Shinigami altera a rigidez da arma em fração de segundo: enrijece a estrutura para bloquear golpes pesados ou fluidifica para envolver e desarmar lâminas inimigas.`
          : `Modulação do peso e do gume de ${nome}. Permite alternar entre cortes de impacto denso (maior dano de contusão e choque) e cortes rápidos com fio ultrafino de Reishi para fatiar em alta velocidade.`
        ,
        aplicacaoTatica: "Alternância entre impacto/atordoamento vs velocidade/precisão dependendo se o oponente é ágil ou resistente."
      },
      {
        nivel: 3,
        titulo: "Nível 3 — Manipulação Fracionada & Curvatura Espiritual",
        req: reqs[2],
        desbloqueado: statsZk.media >= reqs[2],
        atributoChave: "Alcance & Controle",
        corAtributo: "#8B6FD6",
        icone: "🌀",
        descricao: isRanged
          ? `Dispersão multifacetada e curvatura de Reishi. ${nome} pode estilhaçar um único disparo em dezenas de fragmentos letais para cobrir uma área ampla aumentando o alcance, ou curvar a trajetória dos projéteis aproveitando as correntes de Reiatsu para atingir pontos cegos.`
          : `Extensão súbita e refração de corte. O fio de ${nome} projeta lâminas de ar comprimido com ${elemento}, permitindo golpear alvos fora do campo de visão direto ou criar leques de corte para neutralizar múltiplos agressores simultâneos.`,
        aplicacaoTatica: "Ataques em curva ao redor de obstáculos e cobertura de área em leque, tornando esquivas lineares ineficazes."
      },
      {
        nivel: 4,
        titulo: "Nível 4 — Compressão Extrema & Cisalhamento de Resiliência",
        req: reqs[3],
        desbloqueado: statsZk.media >= reqs[3],
        atributoChave: "Corte & Pressão Espiritual",
        corAtributo: "#D6483F",
        icone: "💥",
        descricao: `Concentração molecular da Reiatsu de ${nome}. As partículas de ${elemento} entram em microvibração de altíssima frequência no ponto de contato. O poder de penetração ultrapassa armaduras de Reiatsu e reduz a eficácia da Resiliência defensiva do alvo pela metade.`,
        aplicacaoTatica: "Golpe de perfuração crítica contra defesas impenetráveis, barreiras de Bakudō de alto nível ou Hierro resistente."
      },
      {
        nivel: 5,
        titulo: "Nível 5 — Harmonização Suprema & Fluxo Contínuo da Alma",
        req: reqs[4],
        desbloqueado: statsZk.media >= reqs[4],
        atributoChave: "Resiliência & Maestria Total",
        corAtributo: "#E0B34C",
        icone: "👑",
        descricao: `Sincronia absoluta entre a mente do Shinigami e o espírito de ${nome}. Não há mais tempo de canalização ou atraso postural: a arma responde na velocidade do pensamento. A lâmina regenera microfissuras instantaneamente e converte parte do choque sofrido em combustível para o próximo golpe.`,
        aplicacaoTatica: "Transição contínua entre defesa inquebrável e ataque devastador sem brechas para contragolpe inimigo."
      }
    ];
  } else {
    // BANKAI TACTICAL PROGRESSION
    niveis = [
      {
        nivel: 1,
        titulo: "Nível 1 — Domínio Bruto & Manifestação Macroespacial",
        req: reqs[0],
        desbloqueado: statsZk.media >= reqs[0],
        atributoChave: "Alcance & Pressão Espiritual",
        corAtributo: "#E0B34C",
        icone: "卍",
        descricao: `Liberação colossal da forma soberana de ${nome}. O campo de batalha é completamente submerso na regra e no ambiente de ${elemento}, impondo a presença espiritual da Bankai a todos os combatentes no território.`,
        aplicacaoTatica: "Controle territorial imediato e intimidação espiritual que força o adversário a lutar sob suas regras de terreno."
      },
      {
        nivel: 2,
        titulo: "Nível 2 — Foco de Domínio & Densidade Concentrada",
        req: reqs[1],
        desbloqueado: statsZk.media >= reqs[1],
        atributoChave: "Controle & Corte",
        corAtributo: "#FF6A13",
        icone: "🎯",
        descricao: `Capacidade de concentrar o poder monumental de ${nome} de escala quilométrica em um raio cirúrgico de poucos metros. A densidade da Bankai atinge níveis críticos, multiplicando a letalidade contra alvos individuais sem destruição colateral desmedida.`,
        aplicacaoTatica: "Colapso de energia em alvo único para neutralizar comandantes e chefes inimigos com potência concentrada."
      },
      {
        nivel: 3,
        titulo: "Nível 3 — Manipulação de Regra & Anulação de Brechas",
        req: reqs[2],
        desbloqueado: statsZk.media >= reqs[2],
        atributoChave: "Resiliência & Controle",
        corAtributo: "#8B6FD6",
        icone: "🛡️",
        descricao: `Refinamento da lei espiritual da Bankai ${nome}. O Shinigami elimina os intervalos de recarga e recalibração entre as ativações de poder, prevenindo que adversários perspicazes explorem a brecha estratégica declarada.`,
        aplicacaoTatica: "Sustentação contínua da Bankai sob ataque cerrado, tornando inúteis as tentativas de contra-ataque rápido no intervalo de manobra."
      },
      {
        nivel: 4,
        titulo: "Nível 4 — Transcendência Espiritual & Compressão Final",
        req: reqs[3],
        desbloqueado: statsZk.media >= reqs[3],
        atributoChave: "Pressão Espiritual & Soberania",
        corAtributo: "#FFD700",
        icone: "✨",
        descricao: `Fusão transcendental onde toda a vastidão do território da Bankai é canalizada diretamente para o corpo e o fio da lâmina do Shinigami. Cada movimento distorce o espaço ao redor e manifesta o ápice da arte da espada de ${nome}.`,
        aplicacaoTatica: "Forma de finalização absoluta. Golpe decisivo de impacto supremo com garantia de aniquilação tática."
      }
    ];
  }

  const desbloqueadosCount = niveis.filter(n => n.desbloqueado).length;
  const proximoNivel = niveis.find(n => !n.desbloqueado) || null;

  return {
    niveis,
    desbloqueadosCount,
    totalNiveis: niveis.length,
    proximoNivel,
    mediaAtual: statsZk.media
  };
}

function calcularRelacaoForcaResiliencia(forca, resiliencia) {
  const f = Math.max(1, Number(forca || 10));
  const r = Math.max(1, Number(resiliencia || 10));
  const ratio = Number((r / f).toFixed(2));
  const pct = Math.round(ratio * 100);

  if (ratio >= 1.0) {
    return {
      ratio,
      pct,
      categoria: "Bloqueio Perfeito / Absorção Total",
      cor: "#5FA96B",
      danoRecebidoStr: "Dano Nulo ou Arranhões Superficiais (0% a 10%)",
      efeitoPostura: "Postura Inabalável. O Shinigami sustenta o impacto sem recuar nem perder equilíbrio.",
      riscoArma: "Nenhum risco de dano à lâmina da Zanpakutō.",
      dicaTatica: "Sua Resiliência é igual ou superior à Força do golpe. É o momento ideal para aparar e emendar um contra-ataque imediato."
    };
  } else if (ratio >= 0.70) {
    return {
      ratio,
      pct,
      categoria: "Defesa Parcial / Dano Moderado",
      cor: "#E0B34C",
      danoRecebidoStr: "Dano Leve a Moderado (15% a 35%)",
      efeitoPostura: "Recuo Forçado (2 a 5 metros). Contusões leves e impacto sentido nos braços.",
      riscoArma: "Lâminas com baixa resiliência sofrem vibração e choque mecânico.",
      dicaTatica: "Você mitiga a maior parte da força, mas cede terreno. Bom momento para reposicionamento com Hohō/Shunpo ou recuo estratégico."
    };
  } else if (ratio >= 0.40) {
    return {
      ratio,
      pct,
      categoria: "Ruptura de Guarda / Dano Severo",
      cor: "#FF6A13",
      danoRecebidoStr: "Dano Pesado & Crítico (40% a 75%)",
      efeitoPostura: "Guarda Esmagada. Projeção violenta contra estruturas, trincas ósseas e perda temporária de fôlego.",
      riscoArma: "Alto risco de trincar a arma ou lascar o fio se a Resiliência da espada for insuficiente.",
      dicaTatica: "Extremamente arriscado tentar bloquear diretamente. Priorize esquivas acrobáticas, deflexão angular de corte ou Bakudō de barreira."
    };
  } else {
    return {
      ratio,
      pct,
      categoria: "Sobrepujamento Devastador / Colapso Físico",
      cor: "#D6483F",
      danoRecebidoStr: "Dano Devastador & Letal (80% a 100%+)",
      efeitoPostura: "Colapso Defensivo Imediato. Fraturas expostas, concussão grave ou nocaute instantâneo.",
      riscoArma: "Quebra iminente da Zanpakutō e aniquilação completa de proteções espirituais.",
      dicaTatica: "Diferencial de força esmagador! Bloqueio frontal é suicídio. O Shinigami deve priorizar fuga tática ou auxílio de aliados."
    };
  }
}

// =========================================================================
// 4 COMBAT CONFRONTATIONS: MATHEMATICAL RELATIONS & TACTICAL GUIDANCE
// =========================================================================

function calcularRelacaoForcaForca(forcaUser, forcaInimiga) {
  const fU = Math.max(1, Number(forcaUser || 10));
  const fI = Math.max(1, Number(forcaInimiga || 10));
  const ratio = Number((fU / fI).toFixed(2));
  const pct = Math.round(ratio * 100);

  if (ratio >= 1.30) {
    return {
      ratio,
      pct,
      categoria: "Domínio Absoluto de Força / Desarme & Esmagamento",
      cor: "#5FA96B",
      resultadoStr: "Vantagem Física Esmagadora (130%+ de Força)",
      efeitoPostura: "Guarda Inimiga Quebrada. O impacto arremessa o oponente para trás ou arranca a arma de suas mãos.",
      riscoArma: "Nenhum risco de trinca para você; arma do adversário sofre choque violento.",
      dicaTatica: "Sua massa muscular e potência de Zanjutsu/Hakuda sobrepujam totalmente o oponente. Pressione o ataque imediato para finalização."
    };
  } else if (ratio >= 0.90) {
    return {
      ratio,
      pct,
      categoria: "Equilíbrio Físico Tenso / Impasse de Espadas",
      cor: "#E0B34C",
      resultadoStr: "Disputa Emparelhada (90% a 129% de Força)",
      efeitoPostura: "Trava de Lâminas (Tsubazeriai). Faíscas de Reishi e tensão muscular contínua; nenhum dos lados cede terreno imediato.",
      riscoArma: "Vibração intensa de lâminas durante o choque.",
      dicaTatica: "Forças equivalentes. O combate será decidido pela técnica de alavanca, uso repentino de Hakuda ou quebra de trava com Shunpo rápido."
    };
  } else if (ratio >= 0.60) {
    return {
      ratio,
      pct,
      categoria: "Cessão de Guarda / Pressionado para Trás",
      cor: "#FF6A13",
      resultadoStr: "Desvantagem de Potência (60% a 89% de Força)",
      efeitoPostura: "Recuo Forçado. O Shinigami é empurrado de 2 a 4 metros, perdendo o centro de gravidade e o controle do ritmo.",
      riscoArma: "A lâmina trepida sob a massa de impacto do golpe inimigo.",
      dicaTatica: "Não tente sustentar a disputa de espadas prolongada! Quebre o contato imediatamente usando Hohō ou desvie a lâmina angularmente."
    };
  } else {
    return {
      ratio,
      pct,
      categoria: "Sobrepujamento Físico / Desarme Imediato",
      cor: "#D6483F",
      resultadoStr: "Colapso no Choque (< 60% de Força)",
      efeitoPostura: "Esmagamento Frontal. A arma pode ser ejetada da empunhadura e os braços sofrem contusão muscular e dormência aguda.",
      riscoArma: "Risco iminente de trincar a lâmina pela diferença brutal de massa.",
      dicaTatica: "Diferencial de força crítico! Choque direto de espadas é fatal. Utilize esquivas acrobáticas, Kidōs de contenção ou combate à distância."
    };
  }
}

function calcularRelacaoVelocidadeVelocidade(velUser, velInimiga) {
  const vU = Math.max(1, Number(velUser || 10));
  const vI = Math.max(1, Number(velInimiga || 10));
  const ratio = Number((vU / vI).toFixed(2));
  const pct = Math.round(ratio * 100);

  if (ratio >= 1.30) {
    return {
      ratio,
      pct,
      categoria: "Supremacia de Velocidade / Flanqueamento & Ponto Cego",
      cor: "#5FA96B",
      resultadoStr: "Velocidade Relâmpago Superior (130%+ de Velocidade)",
      efeitoPostura: "Imagens Residuais (Senka / Utsusemi). O Shinigami atinge as costas ou pontos vitais do adversário antes da resposta visual.",
      riscoArma: "Domínio total dos ângulos de ataque.",
      dicaTatica: "Você dita o ritmo da luta. Alterne investidas em zigue-zague com Shunpo para sobrecarregar o tempo de reação do oponente."
    };
  } else if (ratio >= 0.90) {
    return {
      ratio,
      pct,
      categoria: "Ritmo Emparelhado / Trocação Dinâmica de Golpes",
      cor: "#E0B34C",
      resultadoStr: "Velocidades Equivalentes (90% a 129% de Velocidade)",
      efeitoPostura: "Cadência Sincronizada. Esquivas no limite do alcance e trocas contínuas de golpes em alta intensidade de Hohō.",
      riscoArma: "Reflexos de lâmina constantes.",
      dicaTatica: "Ambos se movem na mesma velocidade. A vitória dependerá de fintas inteligentes, quebras de ritmo e antecipação tática de passos."
    };
  } else if (ratio >= 0.60) {
    return {
      ratio,
      pct,
      categoria: "Déficit de Ritmo / Combate Reativo Sob Pressão",
      cor: "#FF6A13",
      resultadoStr: "Atraso no Tempo de Resposta (60% a 89% de Velocidade)",
      efeitoPostura: "Reação Tardia. O Shinigami é forçado a defender de forma reativa, sem conseguir iniciar investidas ofensivas limpas.",
      riscoArma: "Aparadas de emergência fora do ângulo ideal.",
      dicaTatica: "O oponente é mais rápido que você. Adote postura defensiva compacta, mantenha o centro e atraia o adversário para um contragolpe calculado."
    };
  } else {
    return {
      ratio,
      pct,
      categoria: "Velocidade Fantasma Inimiga / Ponto Cego Permanente",
      cor: "#D6483F",
      resultadoStr: "Incapacidade de Acompanhar a Olho Nu (< 60% de Velocidade)",
      efeitoPostura: "Alvo Estático. O oponente aparenta 'desaparecer' do campo de visão, atacando de múltiplos ângulos imprevisíveis.",
      riscoArma: "Vulnerabilidade total a golpes de flanco e retaguarda.",
      dicaTatica: "Não confie apenas na visão! Disperse sua Reiatsu em 360° para sentir a aproximação e use barreiras de Bakudō para cobrir pontos cegos."
    };
  }
}

function calcularRelacaoPressaoPressao(pressaoUser, pressaoInimiga) {
  const pU = Math.max(1, Number(pressaoUser || 10));
  const pI = Math.max(1, Number(pressaoInimiga || 10));
  const ratio = Number((pU / pI).toFixed(2));
  const pct = Math.round(ratio * 100);

  if (ratio >= 1.40) {
    return {
      ratio,
      pct,
      categoria: "Supressão Espiritual Esmagadora / Reiatsu Paralisante",
      cor: "#5FA96B",
      resultadoStr: "Dominância de Aura Imensa (140%+ de Pressão)",
      efeitoPostura: "Asfixia Espiritual no Inimigo. A aura do Shinigami pesa no ambiente, causando náusea, tremores e quebra de foco no rival.",
      riscoArma: "Sua lâmina ressoa com Reiatsu densa que dissipa feitiços menores.",
      dicaTatica: "Sua presença espiritual é avassaladora. Técnicas de Kidō e liberação de Shikai/Bankai operam com potência máxima sem resistência."
    };
  } else if (ratio >= 0.95) {
    return {
      ratio,
      pct,
      categoria: "Equilíbrio Espiritual / Ressonância Atmosférica",
      cor: "#E0B34C",
      resultadoStr: "Pressões Equivalentes (95% a 139% de Pressão)",
      efeitoPostura: "Choque de Auras. Ventos espirituais e distorções atmosféricas; ambos canalizam feitiços com eficácia plena.",
      riscoArma: "Ressonância estável entre as energias em confronto.",
      dicaTatica: "Equilíbrio de Reiryoku. A precisão na canalização e o controle fino de Reishi farão a diferença no duelo de magias."
    };
  } else if (ratio >= 0.65) {
    return {
      ratio,
      pct,
      categoria: "Pressão Opressiva Sentida / Concentração Sob Estresse",
      cor: "#FF6A13",
      resultadoStr: "Pressão Inimiga Opressiva (65% a 94% de Pressão)",
      efeitoPostura: "Peso no Peito. O Shinigami sente a atmosfera densa; a canalização de Kidōs exige mais tempo e foco para não oscilar.",
      riscoArma: "Instabilidade leve no fluxo de energia para a arma.",
      dicaTatica: "Não hesite ao conjurar! Utilize encantamentos completos (Eishō) para compensar a turbulência provocada pela aura adversária."
    };
  } else {
    return {
      ratio,
      pct,
      categoria: "Asfixia Espiritual Severa / Terror Instintivo",
      cor: "#D6483F",
      resultadoStr: "Subjugação por Reiatsu (< 65% de Pressão)",
      efeitoPostura: "Paralisia por Presença. Dificuldade severa para respirar; o fluxo interno de Reishi entra em descompasso pelo terror da aura.",
      riscoArma: "Supressão das propriedades mágicas e perda de brilho da lâmina.",
      dicaTatica: "Discrepância espiritual monumental! Evite disputas diretas de Kidō ou trocas de feitiço. Foque em apoio físico e suporte de aliados."
    };
  }
}

// =========================================================================
// KIDŌ SYSTEM: COST FORMULAS (ANTI-SPAM SCALING), POWER & COMBAT RELATIONS
// =========================================================================

function calcularCustoKido(kido, pressaoTotal, extraReiatsu = 0) {
  const num = Number(kido?.numero || 1);
  const pTot = Math.max(10, Number(pressaoTotal || 30));
  const extra = Math.max(0, Number(extraReiatsu || 0));

  let custoFlat = 15;
  let taxaPct = 0.025; // 2.5%

  if (num <= 30) {
    custoFlat = 15 + Math.floor(num * 0.6);
    taxaPct = 0.025; // 2.5%
  } else if (num <= 60) {
    custoFlat = 35 + Math.floor((num - 30) * 1.2);
    taxaPct = 0.045; // 4.5%
  } else if (num < 90) {
    custoFlat = 70 + Math.floor((num - 60) * 2.5);
    taxaPct = 0.070; // 7.0%
  } else {
    custoFlat = 150 + Math.floor((num - 90) * 6.0);
    taxaPct = 0.100; // 10.0%
  }

  const custoPercentual = Math.round(pTot * taxaPct);
  const custoTotal = custoFlat + custoPercentual + extra;

  return {
    custoFlat,
    taxaPct,
    pctTaxaStr: `${(taxaPct * 100).toFixed(1)}%`,
    custoPercentual,
    extraReiatsu: extra,
    custoTotal
  };
}

function calcularPoderKido(kido, pressaoEfetiva, custoGasto = 0, incantado = false, extraPressao = 0) {
  const num = Number(kido?.numero || 1);
  const pEf = Math.max(10, Number(pressaoEfetiva || 30));
  const pExtra = Math.max(0, Number(extraPressao || 0));
  const pTotal = pEf + pExtra;
  const gasto = Math.max(0, Number(custoGasto || 0));
  const cat = kido?.cat || "Hadō";

  let multiplicadorNum = 1 + (num / 100);
  let pesoGasto = 0.5;

  if (cat === "Bakudō") {
    multiplicadorNum = 1 + (num / 90);
    pesoGasto = 0.6;
  } else if (cat === "Kaidō") {
    multiplicadorNum = 1 + (num / 80);
    pesoGasto = 0.8;
  }

  const poderSemEncanto = Math.round((pTotal * multiplicadorNum) + (gasto * pesoGasto));
  // O encantamento concede exatamente +30% da Pressão Espiritual do jogador ao poder final do feitiço
  const bonusEncantamento = Math.round(pTotal * 0.30);
  const poderComEncanto = poderSemEncanto + bonusEncantamento;
  const poderFinal = incantado ? poderComEncanto : poderSemEncanto;

  const resObj = {
    poderFinal: Math.max(1, poderFinal),
    poderSemEncanto: Math.max(1, poderSemEncanto),
    poderComEncanto: Math.max(1, poderComEncanto),
    bonusEncantamento,
    pressaoTotalUtilizada: pTotal,
    pressaoExtra: pExtra,
    incantado: !!incantado,
    multiplicadorNum,
    // Enable direct numeric comparisons
    valueOf: () => Math.max(1, poderFinal),
    toString: () => String(Math.max(1, poderFinal))
  };

  return resObj;
}

function calcularEfeitoHado(poderHado, resilienciaInimiga) {
  const pH = Math.max(1, Number(poderHado || 10));
  const rI = Math.max(1, Number(resilienciaInimiga || 10));
  const ratio = Number((pH / rI).toFixed(2));
  const pct = Math.round(ratio * 100);

  if (ratio >= 1.50) {
    return {
      ratio,
      pct,
      categoria: "Aniquilação Crítica / Rompimento de Barreira",
      cor: "#D6483F",
      danoStr: "Dano Crítico & Letal (120% a 180%+)",
      descricao: "A potência do feitiço vaporiza defesas, perfura armaduras de Reiatsu e inflige dano devastador com queimaduras ou estilhaçamento profundo.",
      dicaTatica: "Hadō em potência de execução! Ideal para quebrar fortificações e eliminar alvos de alta resistência."
    };
  } else if (ratio >= 1.0) {
    return {
      ratio,
      pct,
      categoria: "Impacto Devastador / Perfuração Direta",
      cor: "#FF6A13",
      danoStr: "Dano Pesado e Efetivo (70% a 100%)",
      descricao: "O feitiço supera a resiliência natural do adversário, causando queimaduras de 2º/3º grau, projeção violenta e choque orgânico.",
      dicaTatica: "Dano substancial. O adversário sentirá o impacto total do feitiço, forçando-o à defensiva."
    };
  } else if (ratio >= 0.60) {
    return {
      ratio,
      pct,
      categoria: "Dano Moderado / Resistido Parcialmente",
      cor: "#E0B34C",
      danoStr: "Dano Parcial Absorvido (30% a 60%)",
      descricao: "A armadura de Reiatsu e o corpo do defensor absorvem a onda de choque; causa ferimentos leves e recuo de 2 a 5 metros.",
      dicaTatica: "A resiliência inimiga atenua parte do impacto. Combine Hadōs em cadeia ou use incantação completa para elevar a perfuração."
    };
  } else {
    return {
      ratio,
      pct,
      categoria: "Mitigação Efetiva / Dispersão do Feitiço",
      cor: "#5FA96B",
      danoStr: "Dano Mínimo ou Nulo (0% a 20%)",
      descricao: "A densidade corporal e espiritual do alvo dissipa a maior parte da magia, restando apenas fuligem e arranhões superficiais.",
      dicaTatica: "Diferença defensiva desfavorável. Invista mais Reiatsu no disparo ou utilize feitiços de número superior."
    };
  }
}

function calcularEfeitoBakudo(poderBakudo, forcaInimiga) {
  const pB = Math.max(1, Number(poderBakudo || 10));
  const fI = Math.max(1, Number(forcaInimiga || 10));
  const ratio = Number((pB / fI).toFixed(2));
  const pct = Math.round(ratio * 100);

  if (ratio >= 1.40) {
    return {
      ratio,
      pct,
      categoria: "Aprisionamento Absoluto / Imobilização Completa",
      cor: "#5FA96B",
      duracaoStr: "Contenção Total (3 a 5+ Rodadas / Cenas)",
      descricao: "As amarras ou barreiras de Reishi travam o corpo e o fluxo espiritual do alvo. Rompimento impossível sem auxílio externo massivo.",
      dicaTatica: "Alvo totalmente neutralizado. Momento perfeito para preparar um Hadō de alto calibre ou Bankai sem risco de interrupção."
    };
  } else if (ratio >= 1.0) {
    return {
      ratio,
      pct,
      categoria: "Contenção Severa / Restrição Crítica",
      cor: "#4FB3E8",
      duracaoStr: "Contenção Eficaz (2 a 3 Rodadas)",
      descricao: "O alvo tem seus movimentos e articulações severamente restringidos. Necessita de esforço concentrado de força para tentar se libertar.",
      dicaTatica: "Oponente sob controle. Permite reposicionamento estratégico e combinação com aliados."
    };
  } else if (ratio >= 0.60) {
    return {
      ratio,
      pct,
      categoria: "Retardo Temporário / Ruptura com Esforço",
      cor: "#E0B34C",
      duracaoStr: "Retardo Breve (1 Rodada / Requer Esforço)",
      descricao: "O alvo é contido por instantes, mas sua musculatura e força física começam a trincar os selos de energia rapidamente.",
      dicaTatica: "Garante apenas uma brecha temporária de distração antes do rompimento das correntes."
    };
  } else {
    return {
      ratio,
      pct,
      categoria: "Rompimento Instantâneo / Selo Estilhaçado",
      cor: "#D6483F",
      duracaoStr: "Rompimento Imediato (0 Rodadas)",
      descricao: "A força física bruta do adversário pulveriza as amarras espirituais no instante do contato, sem sofrer desaceleração.",
      dicaTatica: "A força do rival é esmagadora. Bakudōs leves são inúteis; utilize barreiras de alto nível (como Bakudō #81 Dankū)."
    };
  }
}

function getKaidoSpecialty(kido) {
  if (!kido) return "geral";
  const num = Number(kido.numero || 0);
  const nome = (kido.nome || "").toLowerCase();
  const desc = (kido.desc || "").toLowerCase();
  if (num === 6 || nome.includes("seika") || desc.includes("venen") || desc.includes("toxin") || desc.includes("purific")) {
    return "purificacao";
  }
  if (num === 1 || nome.includes("chiyaku") || desc.includes("calmante") || desc.includes("dor")) {
    return "analgesia";
  }
  if (num === 9 || num === 16 || nome.includes("kekkai") || nome.includes("ito") || desc.includes("sutura") || desc.includes("hemorr")) {
    return "sutura";
  }
  if (num >= 50 || desc.includes("reanima") || desc.includes("alma") || desc.includes("orgao")) {
    return "ressurreicao";
  }
  return "geral";
}

function calcularEfeitoKaido(poderKaido, estadoInicial = "Debilitado", kido = null) {
  const pK = Math.max(1, Number(poderKaido || 10));
  const est = estadoInicial || "Debilitado";
  const spec = getKaidoSpecialty(kido);
  const kidoNome = kido?.nome || "Kaidō";

  let nivel = "Básico";
  let cor = "#C9C1AF";
  let categoria = "";
  let estadoFinal = "Inteiro";
  let cenasNecessarias = 1;
  let curaHpStr = "";
  let diagnostico = "";
  let dicaTatica = "";
  let roteiroCenas = [];

  // 1. TIER SUPREMO (pK >= 350): Restauração Milagrosa / Divisão Zero / Nível Unohana
  // Imbuir alta quantidade de Reiatsu cura QUALQUER estado (até Derrotado/Crítico) em APENAS 1 CENA!
  if (pK >= 350) {
    nivel = "Supremo";
    cor = "#FFD700";
    curaHpStr = "Recuperação de 95% a 100% da Vitalidade";
    cenasNecessarias = 1;
    estadoFinal = "Inteiro";

    if (spec === "purificacao") {
      categoria = "Purificação Celular Absoluta & Neutralização Instantânea de Toxinas";
      diagnostico = "A alta sobrecarga de Reishi expurga instantaneamente venenos mortais, ácidos espirituais e toxinas dos órgãos vitais em tempo recorde.";
      roteiroCenas = [
        `Cena 1: Infusão máxima de Kaidō (${kidoNome}) nos canais de Reiryoku. Todo o veneno é expelido e dissolvido dos tecidos em segundos, neutralizando falência de órgãos e restaurando a integridade plena (${est} ➔ Inteiro).`
      ];
      dicaTatica = "Sobrecarga de Reiatsu Suprema: Elimina qualquer envenenamento ou toxina no grupo e regenera o aliado direto para 'Inteiro' em apenas 1 cena no WhatsApp!";
    } else if (spec === "analgesia") {
      categoria = "Supressão Neural Total & Revigoração Espiritual Completa";
      diagnostico = "Anestesia o sistema nervoso contra choque de dor, reanima o fôlego espiritual e sela traumas físicos.";
      roteiroCenas = [
        `Cena 1: Aplicação analgésica de alta intensidade (${kidoNome}). Dissipa dores incapacitantes, restaura a lucidez e revigora o aliado (${est} ➔ Inteiro).`
      ];
      dicaTatica = "Recuperação de 1 cena rápida sem dor ou sequelas.";
    } else if (spec === "sutura") {
      categoria = "Tecelagem Espiritual Divina & Fechamento de Rompimentos Fatais";
      diagnostico = "Sutura instantânea de tendões, artérias seccionadas e músculos dilacerados por cortes profundos.";
      roteiroCenas = [
        `Cena 1: Fios de luz cirúrgica de alta densidade entrelaçam tecidos e vasos rompidos, estancando qualquer hemorragia em segundos (${est} ➔ Inteiro).`
      ];
      dicaTatica = "Sutura cirúrgica de emergência de 1 cena com eficácia absoluta.";
    } else {
      categoria = "Restauração Milagrosa & Regeneração Celular Total";
      diagnostico = "Reconstitui tecidos dilacerados, regenera órgãos vitais e restaura o fluxo de Reiryoku instantaneamente.";
      roteiroCenas = [
        `Cena 1: Concentração máxima de Kaidō verde-dourado nos pontos vitais. Reanimação imediata e fechamento de todas as feridas mortais (${est} ➔ Inteiro).`
      ];
      dicaTatica = "Nível Supremo do 4º Esquadrão (Capitã Unohana / Divisão Zero). A infusão massiva de Reiatsu reduz o tempo de tratamento para apenas 1 cena no WhatsApp!";
    }

  // 2. TIER AVANÇADO / ALTA INJEÇÃO DE REIATSU (pK >= 130):
  // Imbuir mais Reiatsu REDUZ DEBILITADO PARA APENAS 1 CENA e DERROTADO PARA 2 CENAS!
  } else if (pK >= 130) {
    nivel = "Avançado";
    cor = "#5FA96B";
    curaHpStr = "Recuperação de 70% a 90% da Vitalidade";
    estadoFinal = "Inteiro";

    if (est === "Derrotado") {
      cenasNecessarias = 2;
      if (spec === "purificacao") {
        categoria = "Desintoxicação Acelerada & Estabilização de Órgãos";
        diagnostico = "Neutraliza venenos em estado crítico e estanca choque anafilático/químico nas artérias.";
        roteiroCenas = [
          "Cena 1: Infusão de emergência de Kaidō purificador para neutralizar o veneno letal e tirar o aliado do coma (Derrotado ➔ Debilitado).",
          "Cena 2: Expulsão das toxinas residuais e reconstituição do fluxo sanguíneo (Debilitado ➔ Inteiro)."
        ];
        dicaTatica = "A injeção extra de Reiatsu acelerou a neutralização das toxinas, reduzindo o tempo crítico de 4 para 2 cenas no WhatsApp!";
      } else {
        categoria = "Regeneração Profunda & Reanimação Acelerada";
        diagnostico = "Cura fraturas ósseas graves, estanca hemorragias arteriais e sutura músculos lacerados.";
        roteiroCenas = [
          "Cena 1: Estabilização de emergência dos sinais vitais e hemostasia (Derrotado ➔ Debilitado).",
          "Cena 2: Recomposição de tecidos e reinfusão de Reishi acelerada pela Reiatsu investida (Debilitado ➔ Inteiro)."
        ];
        dicaTatica = "Graças à Reiatsu extra investida, o tempo de cura do paciente em estado crítico caiu para 2 cenas contínuas no WhatsApp!";
      }
    } else if (est === "Debilitado") {
      cenasNecessarias = 1; // Reduzido de 2 para 1 cena graças à Reiatsu investida!
      if (spec === "purificacao") {
        categoria = "Desintoxicação Rápida & Purificação Tecidual Completa";
        diagnostico = "A alta vazão de Reiatsu drena toxinas e venenos dos tecidos em tempo recorde.";
        roteiroCenas = [
          `Cena 1: Drenagem e purificação acelerada de venenos e toxinas via ${kidoNome}. O combatente recupera 100% da sua mobilidade (Debilitado ➔ Inteiro).`
        ];
        dicaTatica = "Com a injeção de Reiatsu / Encantamento (+30% PE), o tempo de desintoxicação de 'Debilitado' foi reduzido de 2 para apenas 1 cena no WhatsApp!";
      } else {
        categoria = "Regeneração Celular Acelerada por Infusão de Reishi";
        diagnostico = "Sutura cortes profundos, alinha fraturas e restaura a integridade física em alta velocidade.";
        roteiroCenas = [
          "Cena 1: Tratamento intensivo com sobrecarga de Reiatsu. Sutura rápida e regeneração celular completa em 1 única cena (Debilitado ➔ Inteiro)."
        ];
        dicaTatica = "Com a injeção extra de Reiatsu / Encantamento (+30% PE), o tempo de tratamento de 'Debilitado' foi reduzido para apenas 1 cena no WhatsApp!";
      }
    } else {
      cenasNecessarias = 1;
      roteiroCenas = [
        "Cena 1: Cicatrização e purificação rápida de ferimentos moderados (Ferido ➔ Inteiro)."
      ];
      dicaTatica = "Cura de 1 cena rápida no WhatsApp. O aliado volta a 100% de prontidão no ON.";
    }

  // 3. TIER INTERMEDIÁRIO (pK >= 60):
  } else if (pK >= 60) {
    nivel = "Intermediário";
    cor = "#4FB3E8";
    curaHpStr = "Recuperação de 40% a 60% da Vitalidade";
    diagnostico = "Fecha cortes de lâmina, estanca sangramentos ativos e neutraliza venenos moderados.";

    if (est === "Derrotado") {
      cenasNecessarias = 3;
      estadoFinal = "Inteiro";
      roteiroCenas = [
        "Cena 1: Ressuscitação e estancamento de sangramentos graves (Derrotado ➔ Debilitado).",
        "Cena 2: Cicatrização de lacerações e reanimação física (Debilitado ➔ Ferido).",
        "Cena 3: Restauração de fôlego e cicatrização final (Ferido ➔ Inteiro)."
      ];
      dicaTatica = "Paciente crítico: requer 3 cenas no WhatsApp para recuperação completa. (Dica: Injete mais Pressão Espiritual para reduzir para 1 ou 2 cenas!).";
    } else if (est === "Debilitado") {
      cenasNecessarias = 2;
      estadoFinal = "Inteiro";
      roteiroCenas = [
        "Cena 1: Imobilização, sutura de cortes e início da desintoxicação (Debilitado ➔ Ferido).",
        "Cena 2: Recuperação de mobilidade e cicatrização dos tecidos (Ferido ➔ Inteiro)."
      ];
      dicaTatica = "Requer 2 cenas no ON. (Dica: Recite o encantamento ou injete +50/+100 PE para reduzir para 1 cena!).";
    } else {
      cenasNecessarias = 1;
      estadoFinal = "Inteiro";
      roteiroCenas = [
        "Cena 1: Fechamento de escoriações e alívio da dor do combate em 1 cena (Ferido ➔ Inteiro)."
      ];
      dicaTatica = "Tratamento de 1 cena rápida no WhatsApp.";
    }

  // 4. TIER BÁSICO (pK < 60):
  } else {
    nivel = "Básico";
    cor = "#C9C1AF";
    categoria = "Primeiros Socorros & Estabilização Básica";
    curaHpStr = "Recuperação de 15% a 30% da Vitalidade";
    diagnostico = "Revigora o fôlego espiritual básico, estanca pequenos sangramentos e alivia contusões superficiais.";

    if (est === "Derrotado") {
      cenasNecessarias = 4;
      estadoFinal = "Ferido";
      roteiroCenas = [
        "Cena 1 e 2: Triagem médica exaustiva para estabilizar respiração (Derrotado ➔ Debilitado).",
        "Cena 3 e 4: Fechamento gradual de lacerações e suturas leves (Debilitado ➔ Ferido)."
      ];
      dicaTatica = "Kaidō com Pressão básica em paciente crítico: exige 4 cenas no WhatsApp e atinge o estado 'Ferido'. Injete mais Reiatsu para acelerar o processo!";
    } else if (est === "Debilitado") {
      cenasNecessarias = 2;
      estadoFinal = "Ferido";
      roteiroCenas = [
        "Cena 1: Estancamento superficial de hemorragia.",
        "Cena 2: Repouso médico e estabilização para o estado 'Ferido' (Debilitado ➔ Ferido)."
      ];
      dicaTatica = "Necessita manter o Kaidō ativo por 2 cenas no ON para transformar 'Debilitado' em 'Ferido'.";
    } else {
      cenasNecessarias = 1;
      estadoFinal = "Inteiro";
      roteiroCenas = [
        "Cena 1: Primeiros socorros leves para estancar arranhões e recuperar fôlego (Ferido ➔ Inteiro)."
      ];
      dicaTatica = "Cura básica de 1 cena no WhatsApp para pequenos ferimentos.";
    }
  }

  return {
    nivel,
    categoria,
    cor,
    estadoInicial: est,
    estadoFinal,
    cenasNecessarias,
    curaHpStr,
    diagnostico,
    dicaTatica,
    roteiroCenas,
    especialidade: spec
  };
}

// =========================================================================
// OFFICIAL MALUTTI FORMATTED WHATSAPP CHARACTER SHEET EXPORTER
// =========================================================================

function getCodigoAtividade(p) {
  if (!p) return "ACT-0000";
  if (p.codigoAtividade) return p.codigoAtividade;
  const whatsDigits = p.whatsapp ? String(p.whatsapp).replace(/\D/g, "").slice(-4) : "";
  if (whatsDigits && whatsDigits.length >= 2) {
    return `ACT-${whatsDigits.padStart(4, '0')}`;
  }
  if (p.codigo) {
    return `ACT-${String(p.codigo).replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase().padStart(4, '0')}`;
  }
  return `ACT-${String(p.id || "0001").slice(-4).toUpperCase()}`;
}

function gerarFichaFormatadaMalutti(p) {
  if (!p) return "";

  const totalAtributos = Object.values(p.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 }).reduce((a, b) => a + b, 0);
  const tier = (typeof getPowerTier === "function") ? getPowerTier(totalAtributos) : { title: "Iniciante", patamar: "201–450" };

  const whatsDigits = p.whatsapp ? String(p.whatsapp).replace(/\D/g, "").slice(-4) : "0000";
  const codAtividade = getCodigoAtividade(p);
  const pNome = p.nome || "Shinigami";
  const playerNome = pNome.split(" ")[0] || "Jogador";
  const playerNasc = p.aniversarioPlayer ? `${p.aniversarioPlayer}` : "01/01/2000";

  return `\`\`\`ㅤㅤ\`\`\`ㅤㅤㅤ\`\`\`ㅤㅤ\`\`\`




                                         ࣭    ㅤ
                    ⚯͛
                         ᩠      ⊹                ᩠          . 
                             ࣪       ✶  ͏t𝖍e
                   ﹙  𝐒𝐎𝐔𝐋 𝐒𝐎𝐂𝐈𝐄𝐓𝐘  ﹚⊹
                  ɑquele que nɑ̃o teme ɑ pɾó-
              pɾiɑ lɑ̂minɑ nɑ̃o é digno de 
                   .  empunhɑ́-lɑ     𝗻𝗼    𝗦𝗘𝗜𝗥𝗘𝗜𝗧𝗘𝗜 .ᐟ
                           ︶ ͝     ︶꒷꒦︶                        
         
                   ⊹    /   𝙫ocê é um shinigɑmi
                 toɾne-se   𝓛𝐞𝐧𝐝𝗮́𝗿𝗶𝗼  ・・・
                                         ﹀                                   
             ͛  𝒇𝒊𝒄𝒉𝒂 𝒅𝒆   :   𝕾𝗛𝗜𝗡𝗜𝗚𝗔𝗠𝗜  „                        
       ɑpɾesentɑmos ɑ fichɑ que dɑɾɑ́ vidɑ 
       ɑo seu guêɾɾeiɾo espirituɑl!  ⊹ ɑdiɑntɑ-
       mos ɑ impoɾtɑ̂nciɑ de cɑnɑlizɑɾ suɑ 
       ɑlmɑ em hɑɾmoniɑ com o Seireitei.
                                                                        
             \`﹙ 𝗗𝗔𝗗𝗢𝗦 𝗗𝗢 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗘 ﹚\` 
            ✶  „  nome & quɑtɾo dı́git͟os .ᐟ
            ⎯  ${playerNome}, ${whatsDigits}
            ✶  „  código de ɑtividɑde (on) .ᐟ
            ⎯  ${codAtividade} ‹ use no contador de cenas! ›
            ✶  „  dɑ͟tɑ de nɑscimento & idɑde .ᐟ
            ⎯  ${playerNasc} (${p.idadePlayer || "20"} anos)
            ✶  „  ɑçɑ̃o de suɑ ɑu͟t͟oɾiɑ .ᐟ
            ⎯  fɑvoɾ enviɑɾ sepɑɾɑdɑmente no privado.

             \`﹙ 𝗗𝗔𝗗𝗢𝗦 𝗗𝗢 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗚𝗘𝗠 ﹚\` 
            ✶  „  no͟me do peɾsonɑgem  .ᐟ
            ⎯  ${p.nome}
            ✶  „  idɑde &\` ɑn͟ive͟ɾsɑ́ɾio .ᐟ
            ⎯  ${p.idadeChar || "18"} anos — ${p.aniversarioChar || "15/07"}.
            ✶  „  ɾeivindicɑçɑ̃o fɑ͟ciɑl (fɑceclɑim) .ᐟ
            ⎯  ${p.faceclaim || p.nome}
            ✶  „  esquɑdɾɑ̃o do gotei 13 .ᐟ
            ⎯  ${p.esquadrao || "11º Esquadrão"}
            ✶  „  ɾɑçɑ & linhɑgem espı́ɾituɑl .ᐟ
            ⎯  ${p.raca || "Shinigami"}
            ✶  „  código de ɑtividɑde do shinigɑmi .ᐟ
            ⎯  ${codAtividade}
            ✶  „  estɑdo & condiçɑ̃o .ᐟ
            ⎯  ${p.estado || "Inteiro"}
            ✶  „  pɑtɑmɑɾ no seı́ɾeı́teı́ .ᐟ
            ⎯  ${tier.title} (${totalAtributos} pts acumulados)

             \`﹙ 𝗔𝗧𝗥𝗜𝗕𝗨𝗧𝗢𝗦 𝗘𝗦𝗣𝗜𝗥𝗜𝗧𝗨𝗔𝗜𝗦 ﹚\`              
            ✶  „ distɾibuiçɑ̃o de reiryoku .ᐟ
            ⎯  pɾessɑ̃o espı́ɾituɑl: ${p.atributos?.pressao || 10}
            ⎯  foɾçɑ: ${p.atributos?.forca || 10}           
            ⎯  velocidɑde: ${p.atributos?.velocidade || 10}
            ⎯  ɾesiliênciɑ: ${p.atributos?.resiliencia || 10}
            ✶  „ totɑl geɾɑl .ᐟ
            ⎯  ${totalAtributos} pts (Patamar: ${tier.title})

             \`﹙ 𝗧𝗘𝗥𝗠𝗢 𝗗𝗘 𝗖𝗢𝗡𝗦𝗘𝗡𝗧𝗜𝗠𝗘𝗡𝗧𝗢 ﹚\`     
       ₍  X  ₎     estou ciente de que dentɾo do 
       role playing gɑme encontɾɑɾei temɑs           
       e cenɑs de bɑtɑlhɑ que podem seɾ gɑtilhos, 
       e tɑmbém ɑssumo ɾesponsɑbilidɑde 
       de ɑceitɑçɑ̃o cɑso o peɾsonɑgem 
       sofɾɑ quɑlqueɾ dɑno nɑɾɾɑtivo.


        
                                    ✶
                            𝐩𝐬𝐲𝐜𝐡𝐞 ın 
                           ınspırαtıon
                   
                    ✧ 𝗠𝗮𝗱𝗲 𝗕𝘆 𝗠𝗮𝗹𝘂𝘁𝘁𝗶 ✧


\`\`\`ㅤㅤ\`\`\`ㅤㅤㅤ\`\`\`ㅤㅤ\`\`\``;
}

function copiarFichaFormatadaWhatsApp(p, onCopied) {
  const texto = gerarFichaFormatadaMalutti(p);
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => {
      if (onCopied) onCopied();
    }).catch(() => {
      try {
        const ta = document.createElement('textarea');
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (onCopied) onCopied();
      } catch(e) {}
    });
  }
  return texto;
}

function getCapacidadeKidos(pressaoTotal) {
  const pressao = Math.max(1, Number(pressaoTotal || 10));

  if (pressao >= 601) {
    return {
      tierNome: "Transcendente / Divisão Zero",
      limiteMaximo: 99,
      limiteEquipadosStr: "Ilimitado (Mestria Plena)",
      nivelMaximoFeitico: 99,
      descricao: "Mestria absoluta do Reishi. Acesso irrestrito a todos os feitiços do Grimório e magias proibidas.",
      cor: "#FFD700"
    };
  } else if (pressao >= 401) {
    return {
      tierNome: "Lendário / Capitão Sênior",
      limiteMaximo: 24,
      limiteEquipadosStr: "Até 24 Feitiços",
      nivelMaximoFeitico: 99,
      descricao: "Compreensão suprema das artes de Kidō. Acesso liberado aos feitiços destruidores da casa dos 90.",
      cor: "#A855F7"
    };
  } else if (pressao >= 251) {
    return {
      tierNome: "Monstruoso / Nível Capitão",
      limiteMaximo: 16,
      limiteEquipadosStr: "Até 16 Feitiços",
      nivelMaximoFeitico: 89,
      descricao: "Domínio de alto calibre em Kidōs avançados de destruição, barreiras pesadas e Kaidō cirúrgico.",
      cor: "#EF4444"
    };
  } else if (pressao >= 151) {
    return {
      tierNome: "Alto Nível / Tenente Veterano",
      limiteMaximo: 12,
      limiteEquipadosStr: "Até 12 Feitiços",
      nivelMaximoFeitico: 69,
      descricao: "Ampla versatilidade tática com feitiços intermediários de suporte, contenção e dano.",
      cor: "#F97316"
    };
  } else if (pressao >= 61) {
    return {
      tierNome: "Experiente / Oficial de Esquadrão",
      limiteMaximo: 8,
      limiteEquipadosStr: "Até 8 Feitiços",
      nivelMaximoFeitico: 49,
      descricao: "Conhecimento prático das magias fundamentais de combate do Gotei 13.",
      cor: "#EAB308"
    };
  } else if (pressao >= 31) {
    return {
      tierNome: "Treinado / Shinigami Formado",
      limiteMaximo: 6,
      limiteEquipadosStr: "Até 6 Feitiços",
      nivelMaximoFeitico: 29,
      descricao: "Capacidade padrão de recém-graduado da Academia Shin'ō.",
      cor: "#3B82F6"
    };
  } else {
    return {
      tierNome: "Iniciante / Inexperiente",
      limiteMaximo: 4,
      limiteEquipadosStr: "Até 4 Feitiços Iniciais",
      nivelMaximoFeitico: 19,
      descricao: "Em fase de iniciação espiritual. Pode adquirir até 4 feitiços básicos com seu Conhecimento inicial.",
      cor: "#10B981"
    };
  }
}


// =========================================================================
// DEEP SEMANTIC SCENE ANALYZER & AI PLOT GENERATION ENGINE (MULTI-BRANCH)
// =========================================================================

function analisarCenaSemanticaBleach(cenas, player) {
  const cList = Array.isArray(cenas) ? cenas : [];
  const textoGeral = cList.map(c => (c.titulo || '') + " " + (c.texto || '')).join(" \n ");
  const textoLower = textoGeral.toLowerCase();

  // 1. Oponentes e Ameaças Detectados
  const oponentes = [];
  if (textoLower.includes("vasto lorde")) oponentes.push("Vasto Lorde (Hollow Supremo)");
  else if (textoLower.includes("adjuchas")) oponentes.push("Adjuchas (Predador de Almas)");
  else if (textoLower.includes("gillian") || textoLower.includes("menos grande")) oponentes.push("Menos Grande / Gillian");
  else if (textoLower.includes("hollow")) oponentes.push("Hollow Mascarado com Reishi Anormal");

  if (textoLower.includes("quincy") || textoLower.includes("sternritter") || textoLower.includes("wandenreich") || textoLower.includes("arco espiritual")) {
    oponentes.push("Quincy / Soldado do Império das Sombras");
  }
  if (textoLower.includes("arrancar") || textoLower.includes("espada") || textoLower.includes("ressurreição")) {
    oponentes.push("Arrancar de Lâmina Selada");
  }
  if (textoLower.includes("desertor") || textoLower.includes("traidor") || textoLower.includes("renegado")) {
    oponentes.push("Shinigami Desertor do Seireitei");
  }
  if (textoLower.includes("nobre") || textoLower.includes("conspira") || textoLower.includes("central 46")) {
    oponentes.push("Conspirador da Nobreza de Seireitei");
  }
  if (oponentes.length === 0) {
    oponentes.push("Entidade Espiritual Corrompida de Alto Calibre");
  }

  // 2. Locais Detectados
  const locais = [];
  if (textoLower.includes("karakura") || textoLower.includes("mundo humano") || textoLower.includes("escola") || textoLower.includes("cidade")) {
    locais.push("Karakura (Mundo dos Vivos)");
  }
  if (textoLower.includes("zaraki") || textoLower.includes("distrito 80") || textoLower.includes("distrito 7") || textoLower.includes("rukongai") || textoLower.includes("vila")) {
    locais.push("Rukongai (Distritos Periféricos)");
  }
  if (textoLower.includes("seireitei") || textoLower.includes("quartel") || textoLower.includes("divisão") || textoLower.includes("esquadrão") || textoLower.includes("academia")) {
    locais.push("Seireitei (Corte dos Shinigamis)");
  }
  if (textoLower.includes("hueco mundo") || textoLower.includes("las noches") || textoLower.includes("deserto branco")) {
    locais.push("Hueco Mundo (Deserto Branco & Las Noches)");
  }
  if (textoLower.includes("dangai") || textoLower.includes("senkaimon") || textoLower.includes("garganta")) {
    locais.push("Travessia Espiritual (Senkaimon & Dangai)");
  }
  if (locais.length === 0) {
    locais.push("Limiar entre o Seireitei e Rukongai");
  }

  // 3. Elementos, Feitiços e Técnicas
  const elementos = [];
  if (textoLower.includes("fogo") || textoLower.includes("chama") || textoLower.includes("queimar") || textoLower.includes("cinzas")) elementos.push("Fogo & Chamas");
  if (textoLower.includes("gelo") || textoLower.includes("congelar") || textoLower.includes("geada")) elementos.push("Gelo & Cristal");
  if (textoLower.includes("relâmpago") || textoLower.includes("trovão") || textoLower.includes("raio")) elementos.push("Trovão & Relâmpago");
  if (textoLower.includes("trevas") || textoLower.includes("sombra") || textoLower.includes("obscur")) elementos.push("Trevas & Sombras");
  if (textoLower.includes("vento") || textoLower.includes("lâmina de ar")) elementos.push("Vento Cortante");
  if (textoLower.includes("veneno") || textoLower.includes("toxina") || textoLower.includes("corros")) elementos.push("Veneno & Corrosão");
  if (textoLower.includes("ilusão") || textoLower.includes("espelho") || textoLower.includes("névoa")) elementos.push("Ilusão & Miragem");
  if (textoLower.includes("aço") || textoLower.includes("corte") || textoLower.includes("lâmina") || textoLower.includes("espada")) elementos.push("Corte de Aço Puro");
  if (textoLower.includes("hadō") || textoLower.includes("bakudō") || textoLower.includes("kaidō")) elementos.push("Kidō & Encantamentos");
  if (elementos.length === 0) elementos.push("Reishi Puro & Impacto Cortante");

  // 4. Clímax e Sentença de Destaque
  const frases = textoGeral.split(/[.!?\n]+/).map(f => f.trim()).filter(f => f.length > 15);
  const momentoChave = frases.length > 0 ? frases[frases.length - 1] : ("O guerreiro " + (player?.nome || 'Shinigami') + " concluiu a ação com postura marcial inabalável.");

  return {
    qtdCenas: cList.length,
    oponentePrincipal: oponentes[0],
    localPrincipal: locais[0],
    elementosDetectados: elementos,
    momentoChave: momentoChave,
    resumoCenas: cList.map((c, i) => "[" + (i + 1) + "] " + (c.titulo || 'Cena') + ": " + (c.texto || '').slice(0, 100) + "...").join(' | ')
  };
}

function sintetizarTramaIndividualHeuristica(player, cenas) {
  const cList = Array.isArray(cenas) ? cenas : [];
  const pNome = player?.nome || "Guerreiro Espiritual";
  const pRaca = player?.raca || "Shinigami";
  const pEsq = player?.esquadrao || "11º Esquadrão";
  const pAtributos = player?.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 };
  const total = Object.values(pAtributos).reduce((a, b) => a + b, 0);
  const pPatamar = (typeof getPowerTier === 'function') ? getPowerTier(total).title : "Shinigami Treinado";
  const zkNome = player?.zanpakuto?.shikaiAtiva?.nome || player?.zanpakuto?.nome || "Zanpakutō Interior";
  const zkCmd = player?.zanpakuto?.shikaiAtiva?.comando || "Desperte";
  const codAtiv = (typeof getCodigoAtividade === 'function') ? getCodigoAtividade(player) : (player?.codigoAtividade || 'ACT-0000');

  // Semantic Scene Analysis
  const analise = analisarCenaSemanticaBleach(cList, player);
  const opPrincipal = analise.oponentePrincipal;
  const locPrincipal = analise.localPrincipal;
  const momChave = analise.momentoChave;

  const analiseDiagnostico = "A análise das cenas de " + pNome + " (" + pEsq + ", " + pPatamar + ") revela um confronto direto contra " + opPrincipal + " em " + locPrincipal + ". A narrativa evidenciou o impacto de '" + momChave + "', demonstrando que " + pNome + " está à beira de uma ruptura de poder com sua lâmina (" + zkNome + ").";

  // OPÇÃO 1: COMBATE DECISIVO (PROVAÇÃO MARCIAL)
  const opcao1 = {
    id: "opcao_1",
    tipo: "combate",
    nomeOpcao: "⚔️ Opção 1: Caminho do Confronto Direto (Provação Marcial)",
    tituloArco: "Arco de " + pNome + " — O Veredito de Sangue em " + locPrincipal,
    focoNarrativo: "O combate anterior contra " + opPrincipal + " foi apenas o prelúdio. O inimigo retornará com uma força esmagadora, exigindo que " + pNome + " supere seus limites físicos e marciais no campo de batalha.",
    eventos: [
      {
        numero: 1,
        fase: "Evento 1: O Rastro da Batalha (Investigação & Emboscada)",
        titulo: "Caçada em " + locPrincipal,
        descricao: pNome + " segue os vestígios deixados na cena anterior. Em meio aos escombros, é emboscado por batedores e precisa manter a compostura marcial.",
        objetivoCena: "Investigar os rastros da última batalha, conter a emboscada sem hesitar e identificar o ponto fraco do bando inimigo.",
        desafioSugerido: "Superar armadilhas de terreno usando velocidade (Shunpo) e cortes precisos de Zanpakutō."
      },
      {
        numero: 2,
        fase: "Evento 2: A Fúria Desencadeada (Duelo Intermediário)",
        titulo: "Choque de Titãs: " + zkNome + " vs " + opPrincipal,
        descricao: "O confronto direto explode. O oponente tenta anular os movimentos de " + pNome + " usando técnicas corruptas de Reishi.",
        objetivoCena: "Manter a postura marcial, sincronizar o comando '" + zkCmd + "' e contra-atacar sob pressão extrema.",
        desafioSugerido: "Uso estratégico de Kidōs de suporte ou combinação de força e velocidade para quebrar a guarda inimiga."
      },
      {
        numero: 3,
        fase: "Evento 3: O Clímax & Golpe Final",
        titulo: "A Lâmina Suprema de " + pNome,
        descricao: "A batalha atinge o ápice com o oponente liberando sua forma máxima. " + pNome + " executa sua técnica definitiva em uma narração épica.",
        objetivoCena: "Desferir o golpe decisivo de liberação da Zanpakutō e proteger os aliados/civis do Seireitei.",
        desafioSugerido: "Conclusão épica com descrição detalhada do impacto visual e espiritual do golpe de misericórdia."
      }
    ],
    antagonista: {
      nome: opPrincipal,
      titulo: "O Algoz de " + locPrincipal,
      origem: "Gerado pelas cicatrizes de batalha e perturbações de Reishi em " + locPrincipal + ".",
      motivacao: "Destruir a honra de " + pNome + " e provar a fragilidade dos guerreiros do " + pEsq + ".",
      fraquezaChave: "Vulnerável a ataques frontais de alta velocidade e liberação sincronizada de " + zkNome + "."
    },
    briefingWhatsApp: "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```\n" +
      "👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗔𝗥𝗖𝗢 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟭: 𝗖𝗢𝗠𝗕𝗔𝗧𝗘 𝗗𝗜𝗥𝗘𝗧𝗢\n" +
      "✶ „ Jogador: " + pNome + " [" + codAtiv + "]\n" +
      "✶ „ Esquadrão: " + pEsq + " • Patamar: " + pPatamar + "\n" +
      "✶ „ Título: Arco de " + pNome + " — O Veredito de Sangue em " + locPrincipal + "\n" +
      "✶ „ Foco: Provação Marcial & Duelo contra " + opPrincipal + "\n\n" +
      "📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗗𝗔 𝗠𝗜𝗦𝗦𝗔̃𝗢 (𝗢𝗡):\n" +
      "Após o clímax da cena anterior onde \"" + momChave + "\", " + pNome + " é convocado para conter o avanço devastador de " + opPrincipal + " em " + locPrincipal + ". O confronto exigirá maestria absoluta no uso de " + zkNome + "!\n\n" +
      "🎯 𝗢𝗕𝗝𝗘𝗧𝗜𝗩𝗢 𝗗𝗔 𝗣𝗥𝗢́𝗫𝗜𝗠𝗔 𝗖𝗘𝗡𝗔:\n" +
      "1. Dirigir-se a " + locPrincipal + " e narrar sua prontidão de combate (mínimo 30 linhas treino / 90 linhas arco).\n" +
      "2. Investigar os escombros da última batalha e travar o primeiro duelo de lâminas!\n\n" +
      "✧ Recompensa Garantida: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial!\n" +
      "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```"
  };

  // OPÇÃO 2: CONSPIRAÇÃO OCULTA (INVESTIGAÇÃO & MISTÉRIO)
  const opcao2 = {
    id: "opcao_2",
    tipo: "misterio",
    nomeOpcao: "🕵️ Opção 2: Caminho da Conspiração Oculta (Mistério & Blefe)",
    tituloArco: "Arco de " + pNome + " — A Sombra nos Bastidores do Seireitei",
    focoNarrativo: "O ataque ocorrido na cena anterior não foi um evento isolado, mas parte de uma conspiração maior que envolve traição e segredos ocultos nos registros da Soul Society.",
    eventos: [
      {
        numero: 1,
        fase: "Evento 1: O Enigma nos Escombros (Infiltração)",
        titulo: "Pistas Silenciosas",
        descricao: pNome + " recolhe fragmentos de Reishi corrompido deixados pelo inimigo e descobre que as armas foram forjadas secretamente no Seireitei.",
        objetivoCena: "Interrogar informantes em Rukongai e infiltrar-se em arquivos proibidos sem alertar os traidores.",
        desafioSugerido: "Uso de furtividade, percepção espiritual e Bakudōs de silenciamento."
      },
      {
        numero: 2,
        fase: "Evento 2: O Jogo de Blefes & Armadilha Psicológica",
        titulo: "Traição Desmascarada",
        descricao: "O conspirador tenta subornar ou chantagear " + pNome + ", forçando-o a um jogo tenso de blefes e armadilhas de ilusão.",
        objetivoCena: "Resistir à manipulação psicológica e desmascarar a identidade do traidor perante o esquadrão.",
        desafioSugerido: "Superar ilusões de Kidō e manter a integridade mental sob pressão."
      },
      {
        numero: 3,
        fase: "Evento 3: O Julgamento de Aço",
        titulo: "A Queda da Conspiração",
        descricao: "Batalha final contra o mentor da conspiração nos limites do Seireitei, selando o plano sombrio de vez.",
        objetivoCena: "Neutralizar o traidor, recuperar os registros roubados e restaurar a ordem na Soul Society.",
        desafioSugerido: "Execução de um selamento tático com Kidō ou corte decisivo de Zanpakutō."
      }
    ],
    antagonista: {
      nome: "O Mestre das Sombras (Oficial Desertor)",
      titulo: "O Arquiteto da Traição",
      origem: "Infiltrado nos setores burocráticos do Seireitei manipulando eventos de bastidores.",
      motivacao: "Desestabilizar a hierarquia dos capitães e tomar o controle das rotas espirituais.",
      fraquezaChave: "Insegurança em combates corpo a corpo quando suas ilusões são dissipadas."
    },
    briefingWhatsApp: "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```\n" +
      "👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗔𝗥𝗖𝗢 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟮: 𝗖𝗢𝗡𝗦𝗣𝗜𝗥𝗔𝗖̧𝗔̃𝗢 𝗢𝗖𝗨𝗟𝗧𝗔\n" +
      "✶ „ Jogador: " + pNome + " [" + codAtiv + "]\n" +
      "✶ „ Esquadrão: " + pEsq + " • Patamar: " + pPatamar + "\n" +
      "✶ „ Título: Arco de " + pNome + " — A Sombra nos Bastidores do Seireitei\n" +
      "✶ „ Foco: Investigação, Blefe & Desmascarar Conspiração\n\n" +
      "📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗗𝗔 𝗠𝗜𝗦𝗦𝗔̃𝗢 (𝗢𝗡):\n" +
      "A cena onde \"" + momChave + "\" revelou pistas perturbadoras. O ataque foi arquitetado por conspiradores infiltrados. " + pNome + " deve seguir o rastro das pistas antes que o traidor execute seu plano maior!\n\n" +
      "🎯 𝗢𝗕𝗝𝗘𝗧𝗜𝗩𝗢 𝗗𝗔 𝗣𝗥𝗢́𝗫𝗜𝗠𝗔 𝗖𝗘𝗡𝗔:\n" +
      "1. Iniciar a investigação em Rukongai/Seireitei (mínimo 30 linhas treino / 90 linhas arco).\n" +
      "2. Rastrear o selo do conspirador e desarmar a primeira armadilha de bastidores!\n\n" +
      "✧ Recompensa Garantida: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial!\n" +
      "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```"
  };

  // OPÇÃO 3: DILEMA MORAL & DESPERTAR ESPIRITUAL
  const opcao3 = {
    id: "opcao_3",
    tipo: "despertar",
    nomeOpcao: "⚖️ Opção 3: Caminho do Despertar da Alma (Ressonância da Zanpakutō)",
    tituloArco: "Arco de " + pNome + " — O Despertar da Alma & A Provação de " + zkNome,
    focoNarrativo: "O choque narrativo da última cena fez a Zanpakutō " + zkNome + " silenciar ou exigir uma evolução espiritual profunda de seu portador, forçando um teste de convicção e limites.",
    eventos: [
      {
        numero: 1,
        fase: "Evento 1: O Silêncio da Lâmina (Conflito Interior)",
        titulo: "O Eco do Mundo Interior",
        descricao: pNome + " entra em meditação profunda (Jinzen). A alma da Zanpakutō recusa-se a obedecer até que o guerreiro encare seu maior medo/hesitação.",
        objetivoCena: "Dialogar e duelar contra a manifestação espiritual de sua própria lâmina no mundo interior.",
        desafioSugerido: "Narração psicológica rica detalhando o ambiente mental e a filosofia de sua arma."
      },
      {
        numero: 2,
        fase: "Evento 2: A Provação do Sacrifício",
        titulo: "O Teste de Sangue & Honra",
        descricao: "Enquanto medita, uma ameaça repentina ataca os inocentes sob sua vigília. " + pNome + " precisa lutar com Reishi limitado para provar sua determinação.",
        objetivoCena: "Proteger os aliados sem depender apenas de poder bruto, demonstrando maturidade tática.",
        desafioSugerido: "Uso engenhoso de combate básico, esquivas perfeitas e resiliência espiritual."
      },
      {
        numero: 3,
        fase: "Evento 3: A Fusão de Convicções (Despertar Lendário)",
        titulo: "A Dança Harmoniosa de " + zkNome,
        descricao: "A lâmina reconhece a verdadeira vontade de " + pNome + ". O Reishi explode em harmonia absoluta, culminando em uma liberação majestosa.",
        objetivoCena: "Executar a liberação definitiva em harmonia com a Zanpakutō e aniquilar a ameaça restante.",
        desafioSugerido: "Liberação triunfante com narração da ressonância espiritual entre portador e lâmina."
      }
    ],
    antagonista: {
      nome: "A Sombra da Dúvida (Avatar Espiritual Interior)",
      titulo: "O Reflexo da Hesitação",
      origem: "Manifestado das dúvidas e memórias não resolvidas no coração do guerreiro.",
      motivacao: "Testar se o guerreiro é digno de empunhar a lâmina sem hesitação.",
      fraquezaChave: "Desaparece quando confrontado com determinação inabalável e auto-aceitação."
    },
    briefingWhatsApp: "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```\n" +
      "👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗔𝗥𝗖𝗢 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟯: 𝗗𝗘𝗦𝗣𝗘𝗥𝗧𝗔𝗥 𝗗𝗔 𝗔𝗟𝗠𝗔\n" +
      "✶ „ Jogador: " + pNome + " [" + codAtiv + "]\n" +
      "✶ „ Esquadrão: " + pEsq + " • Patamar: " + pPatamar + "\n" +
      "✶ „ Título: Arco de " + pNome + " — O Despertar da Alma & A Provação de " + zkNome + "\n" +
      "✶ „ Foco: Conexão Espiritual & Provação da Zanpakutō\n\n" +
      "📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗗𝗔 𝗠𝗜𝗦𝗦𝗔̃𝗢 (𝗢𝗡):\n" +
      "Diante dos acontecimentos onde \"" + momChave + "\", " + zkNome + " clama por uma evolução espiritual definitiva. " + pNome + " deve enfrentar o teste de sua própria lâmina para desbloquear o próximo patamar de maestria!\n\n" +
      "🎯 𝗢𝗕𝗝𝗘𝗧𝗜𝗩𝗢 𝗗𝗔 𝗣𝗥𝗢́𝗫𝗜𝗠𝗔 𝗖𝗘𝗡𝗔:\n" +
      "1. Narrar a entrada no Mundo Interior / Meditação Jinzen (mínimo 30 linhas treino / 90 linhas arco).\n" +
      "2. Confrontar a manifestação de " + zkNome + " e provar a pureza de sua convicção marcial!\n\n" +
      "✧ Recompensa Garantida: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial!\n" +
      "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```"
  };

  return {
    analiseCenas: {
      qtdCenas: cList.length,
      oponentePrincipal: opPrincipal,
      localPrincipal: locPrincipal,
      elementosDetectados: analise.elementosDetectados,
      momentoChave: momChave,
      diagnostico: analiseDiagnostico
    },
    opcoesTramas: [opcao1, opcao2, opcao3],
    opcaoAtivaId: "opcao_1",
    tituloArco: opcao1.tituloArco,
    faseAtual: "Fase 1: Convocação & Premonição",
    diagnosticoPsicologico: analiseDiagnostico,
    ganchoImediato: opcao1.focoNarrativo,
    eventos: opcao1.eventos,
    antagonista: opcao1.antagonista,
    recompensaArco: "Garantido de 15 Pontos de Atributo + 2 Giros de Sorteio Comum + 1 Giro Especial de Seireitei",
    briefingWhatsApp: opcao1.briefingWhatsApp
  };
}

function sintetizarTramaConjuntaHeuristica(players, cenasConjuntas) {
  const pList = Array.isArray(players) ? players : [];
  const cList = Array.isArray(cenasConjuntas) ? cenasConjuntas : [];
  const p1 = pList[0] || { nome: "Guerreiro 1", esquadrao: "11º Esquadrão", codigoAtividade: "ACT-0001" };
  const p2 = pList[1] || { nome: "Guerreiro 2", esquadrao: "4º Esquadrão", codigoAtividade: "ACT-0002" };

  const nomesStr = pList.map(p => p.nome).join(" & ");
  const codigosStr = pList.map(p => (typeof getCodigoAtividade === 'function' ? getCodigoAtividade(p) : (p.codigoAtividade || 'ACT-0000'))).join(" / ");

  const analise = analisarCenaSemanticaBleach(cList, p1);
  const opPrincipal = analise.oponentePrincipal || "Menos Grande Híbrido";
  const locPrincipal = analise.localPrincipal || "Distritos Periféricos de Rukongai";

  const opcaoConj1 = {
    id: "conj_opcao_1",
    nomeOpcao: "⚔️ Opção 1: Aliança de Sangue (Combate Cooperativo Sincronizado)",
    tituloArco: "Arco Cruzado: A Queda do Titã em " + locPrincipal + " (" + nomesStr + ")",
    dinamicaDupla: "Cooperação Tática & União de Forças (" + p1.esquadrao + " ⚔️ " + p2.esquadrao + ")",
    sinopse: "Um incidente em " + locPrincipal + " une " + p1.nome + " e " + p2.nome + " contra uma ameaça que nenhum guerreiro pode derrotar isoladamente (" + opPrincipal + "). Ambos devem intercalar ataques e defesas sincronizadas no ON.",
    eventosCruzados: [
      {
        fase: "Fase 1: O Choque Inicial & Convocação Conjunta (ON)",
        descricao: p1.nome + " e " + p2.nome + " são emboscados em " + locPrincipal + ". A força de Reishi do monstro obriga os dois a unirem suas lâminas.",
        papelPlayer1: "Abrir brecha na vanguarda (" + p1.nome + ").",
        papelPlayer2: "Suporte tático, barreira ou cura (" + p2.nome + ").",
        ganchoWhats: "Primeira cena no ON com diálogo e ataque combinado de " + p1.nome + " e " + p2.nome + "."
      },
      {
        fase: "Fase 2: A Provação Cruzada (Ação de um afeta o outro)",
        descricao: "O monstro isola os dois em domínios de Reishi. Para que " + p1.nome + " sobreviva, " + p2.nome + " precisará neutralizar a fonte de energia a tempo.",
        papelPlayer1: "Conter o dano devastador da criatura.",
        papelPlayer2: "Executar técnica de anulação ou quebra de selo.",
        ganchoWhats: "Interação contínua onde a rolagem/narração de um altera o estado do parceiro."
      },
      {
        fase: "Fase 3: Batalha Cooperativa Decisiva (Clímax)",
        descricao: "Ataque simultâneo com liberação de Zanpakutōs em sincronia perfeita, selando o inimigo.",
        papelPlayer1: "Golpe de impacto supremo.",
        papelPlayer2: "Selo de contenção / cura final.",
        ganchoWhats: "Conclusão épica compartilhada no grupo de roleplay."
      }
    ],
    ameacaComum: {
      nome: opPrincipal,
      perigo: "Anula danos isolados; só é vulnerável a ataques intercalados de dois guerreiros.",
      mecanicaEspecial: "Exige intercalação de turnos narrativos contínuos no WhatsApp."
    },
    briefingWhatsApp: "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```\n" +
      "👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗧𝗥𝗔𝗠𝗔 𝗖𝗢𝗡𝗝𝗨𝗡𝗧𝗔 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟭: 𝗔𝗟𝗜𝗔𝗡𝗖̧𝗔 𝗗𝗘 𝗦𝗔𝗡𝗚𝗨𝗘\n" +
      "✶ „ Jogadores Envolvidos: " + nomesStr + "\n" +
      "✶ „ Códigos de Atividade: " + codigosStr + "\n" +
      "✶ „ Título: Arco Cruzado — A Queda do Titã em " + locPrincipal + "\n" +
      "✶ „ Dinâmica: " + p1.esquadrao + " ⚔️ " + p2.esquadrao + "\n\n" +
      "📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗖𝗢𝗠𝗣𝗔𝗥𝗧𝗜𝗟𝗛𝗔𝗗𝗔:\n" +
      "Uma anomalia de extrema gravidade em " + locPrincipal + " exige a colaboração imediata de " + p1.nome + " e " + p2.nome + ". A ameaça " + opPrincipal + " só poderá ser contida com sincronia total de Reishi!\n\n" +
      "🎯 𝗜𝗡𝗦𝗧𝗥𝗨𝗖̧𝗢̃𝗘𝗦 𝗣𝗔𝗥𝗔 𝗢𝗦 𝗝𝗢𝗚𝗔𝗗𝗢𝗥𝗘𝗦:\n" +
      "1. Cenar juntos em interação contínua no grupo (mínimo 30 a 90 linhas conjuntas).\n" +
      "2. Intercalar ações combinando suas técnicas e liberando suas Zanpakutōs em sincronia.\n\n" +
      "✧ Recompensa Garantida para Ambos: 15 Pontos de Atributo + 2 Giros Comuns + 1 Giro Especial cada!\n" +
      "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```"
  };

  const opcaoConj2 = {
    id: "conj_opcao_2",
    nomeOpcao: "⚖️ Opção 2: Choque Ideológico & Provação Cruzada (Conflito de Honra)",
    tituloArco: "Arco Cruzado: O Julgamento de Honra em " + locPrincipal + " (" + nomesStr + ")",
    dinamicaDupla: "Divergência de Métodos & Respeito Mútuo (" + p1.esquadrao + " vs " + p2.esquadrao + ")",
    sinopse: "Enquanto " + p1.nome + " busca aniquilar o alvo custe o que custar, " + p2.nome + " defende a preservação das leis e dos civis. O confronto forçará os dois a aprenderem com os ideais um do outro.",
    eventosCruzados: [
      {
        fase: "Fase 1: O Choque de Ordens",
        descricao: "Ambos recebem ordens conflitantes da Central 46 e dos seus respectivos Capitães.",
        papelPlayer1: "Investir na ofensiva imediata.",
        papelPlayer2: "Montar perímetro de contenção e resgate.",
        ganchoWhats: "Debate e duelo verbal com primeiras demonstrações de postura marcial."
      },
      {
        fase: "Fase 2: A Provação do Meio-Termo",
        descricao: "Uma armadilha mortal coloca ambos em risco, provando que nenhum dos métodos isolados funciona.",
        papelPlayer1: "Reconhecer o valor da contenção tática.",
        papelPlayer2: "Liberar a ferocidade de combate necessária.",
        ganchoWhats: "Cooperação relutante que se transforma em confiança inquebrável."
      },
      {
        fase: "Fase 3: O Veredito de Honra",
        descricao: "Superação mútua e derrota definitiva do conspirador responsável pelo caos.",
        papelPlayer1: "Finalização combinada.",
        papelPlayer2: "Proteção total da Soul Society.",
        ganchoWhats: "Finalização com respeito mútuo consagrado."
      }
    ],
    ameacaComum: {
      nome: "Conspirador de Guerra & Desertores Armados",
      perigo: "Explora divisões ideológicas entre esquadrões para semear discórdia.",
      mecanicaEspecial: "Requer reconciliação tática no roleplay para abrir brecha no escudo inimigo."
    },
    briefingWhatsApp: "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```\n" +
      "👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗧𝗥𝗔𝗠𝗔 𝗖𝗢𝗡𝗝𝗨𝗡𝗧𝗔 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟮: 𝗖𝗛𝗢𝗤𝗨𝗘 𝗜𝗗𝗘𝗢𝗟𝗢́𝗚𝗜𝗖𝗢\n" +
      "✶ „ Jogadores Envolvidos: " + nomesStr + "\n" +
      "✶ „ Códigos de Atividade: " + codigosStr + "\n" +
      "✶ „ Título: Arco Cruzado — O Julgamento de Honra em " + locPrincipal + "\n" +
      "✶ „ Dinâmica: Choque de Métodos (" + p1.esquadrao + " vs " + p2.esquadrao + ")\n\n" +
      "📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗖𝗢𝗠𝗣𝗔𝗥𝗧𝗜𝗟𝗛𝗔𝗗𝗔:\n" +
      "Um dilema de honra coloca " + p1.nome + " e " + p2.nome + " em teste. Para superar a armadilha em " + locPrincipal + ", ambos precisarão conciliar a força bruta com a sabedoria tática!\n\n" +
      "🎯 𝗜𝗡𝗦𝗧𝗥𝗨𝗖̧𝗢̃𝗘𝗦 𝗣𝗔𝗥𝗔 𝗢𝗦 𝗝𝗢𝗚𝗔𝗗𝗢𝗥𝗘𝗦:\n" +
      "1. Dialogar e contrapor suas filosofias de esquadrão no ON (mínimo 30 a 90 linhas).\n" +
      "2. Superar a discórdia e executar uma estratégia mista impecável.\n\n" +
      "✧ Recompensa Garantida para Ambos: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial cada!\n" +
      "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```"
  };

  const opcaoConj3 = {
    id: "conj_opcao_3",
    nomeOpcao: "🕵️ Opção 3: Operação de Infiltração & Resgate de Alto Risco",
    tituloArco: "Arco Cruzado: Resgate nas Sombras de " + locPrincipal + " (" + nomesStr + ")",
    dinamicaDupla: "Infiltração Furtiva & Ataque Cirúrgico",
    sinopse: "Um oficial do Gotei 13 foi capturado em " + locPrincipal + ". " + p1.nome + " e " + p2.nome + " formam a equipe de extração secreta que deve agir antes da execução do prisioneiro.",
    eventosCruzados: [
      {
        fase: "Fase 1: Infiltração Silenciosa",
        descricao: "Penetrar na fortaleza inimiga desarmando sentinelas com discrição.",
        papelPlayer1: "Neutralização rápida de sentinelas.",
        papelPlayer2: "Ocultação de Reishi e desarmamento de alarmes de Kidō.",
        ganchoWhats: "Cena de tensão furtiva no ON."
      },
      {
        fase: "Fase 2: A Fuga Crítica",
        descricao: "O alarme soa e o resgate se transforma em uma perseguição de tirar o fôlego.",
        papelPlayer1: "Retaguarda e contenção de vagas de inimigos.",
        papelPlayer2: "Estabilização médica do ferido e rota de fuga.",
        ganchoWhats: "Cena de perseguição e proteção sob fogo cruzado."
      },
      {
        fase: "Fase 3: O Confronto no Portão",
        descricao: "Duelo final no ponto de extração para abrir o Senkaimon e garantir a fuga.",
        papelPlayer1: "Ataque destruidor para abrir caminho.",
        papelPlayer2: "Abertura e estabilização do portal dimensional.",
        ganchoWhats: "Finalização épica com missão cumprida com louvor."
      }
    ],
    ameacaComum: {
      nome: "Guarda de Elite dos Renegados",
      perigo: "Defesas impenetráveis que exigem infiltração sincronizada.",
      mecanicaEspecial: "Sucesso depende de coordenação contínua de ações."
    },
    briefingWhatsApp: "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```\n" +
      "👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗧𝗥𝗔𝗠𝗔 𝗖𝗢𝗡𝗝𝗨𝗡𝗧𝗔 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟯: 𝗢𝗣𝗘𝗥𝗔𝗖̧𝗔̃𝗢 𝗗𝗘 𝗥𝗘𝗦𝗚𝗔𝗧𝗘\n" +
      "✶ „ Jogadores Envolvidos: " + nomesStr + "\n" +
      "✶ „ Códigos de Atividade: " + codigosStr + "\n" +
      "✶ „ Título: Arco Cruzado — Resgate nas Sombras de " + locPrincipal + "\n" +
      "✶ „ Dinâmica: Infiltração Furtiva & Ataque Cirúrgico\n\n" +
      "📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗖𝗢𝗠𝗣𝗔𝗥𝗧𝗜𝗟𝗛𝗔𝗗𝗔:\n" +
      "Uma missão de alta espionagem em " + locPrincipal + ". " + p1.nome + " e " + p2.nome + " devem extrair o alvo e romper o cerco inimigo antes que o portal Senkaimon se feche!\n\n" +
      "🎯 𝗜𝗡𝗦𝗧𝗥𝗨𝗖̧𝗢̃𝗘𝗦 𝗣𝗔𝗥𝗔 𝗢𝗦 𝗝𝗢𝗚𝗔𝗗𝗢𝗥𝗘𝗦:\n" +
      "1. Cenar a infiltração e resgate coordenado (mínimo 30 a 90 linhas conjuntas).\n" +
      "2. Dividir tarefas de ataque e cobertura defensiva no ON.\n\n" +
      "✧ Recompensa Garantida para Ambos: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial cada!\n" +
      "```ㅤㅤ```ㅤㅤㅤ```ㅤㅤ```"
  };

  return {
    analiseCenas: {
      qtdCenas: cList.length,
      oponentePrincipal: opPrincipal,
      localPrincipal: locPrincipal,
      elementosDetectados: analise.elementosDetectados,
      momentoChave: analise.momentoChave
    },
    opcoesTramas: [opcaoConj1, opcaoConj2, opcaoConj3],
    opcaoAtivaId: "conj_opcao_1",
    tituloArco: opcaoConj1.tituloArco,
    dinamicaDupla: opcaoConj1.dinamicaDupla,
    sinopse: opcaoConj1.sinopse,
    conflitoCentral: opcaoConj1.sinopse,
    eventosCruzados: opcaoConj1.eventosCruzados,
    ameacaComum: opcaoConj1.ameacaComum,
    briefingWhatsApp: opcaoConj1.briefingWhatsApp
  };
}

async function gerarTramaIndividualAI(params) {
  const player = params?.player;
  const cenas = params?.cenas || [];
  const openAiKey = params?.openAiKey || "";
  const heuristicResult = sintetizarTramaIndividualHeuristica(player, cenas);
  const apiKey = (openAiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") || "" : "")).trim();

  if (!apiKey || apiKey.length < 15) {
    return heuristicResult;
  }

  try {
    const prompt = "Você é o Mestre Narrador Principal do BLEACH RPG (Soul Society / Seireitei).\n" +
      "Analise o seguinte jogador e suas cenas de arco para gerar 3 Opções de Tramas Individuais com base nas ações e acontecimentos narrados no ON:\n\n" +
      "DADOS DO JOGADOR:\n" +
      "- Nome: " + (player?.nome || 'Shinigami') + "\n" +
      "- Raça: " + (player?.raca || 'Shinigami') + "\n" +
      "- Esquadrão: " + (player?.esquadrao || '11º Esquadrão') + "\n" +
      "- Patamar: " + heuristicResult.diagnosticoPsicologico + "\n" +
      "- Zanpakutō: " + (player?.zanpakuto?.shikaiAtiva?.nome || player?.zanpakuto?.nome || 'Despertar') + "\n" +
      "- Histórico de Cenas: " + cenas.map(c => "[" + c.titulo + "]: " + c.texto).join(' | ') + "\n\n" +
      "Responda APENAS em formato JSON válido com as 3 opções de tramas:\n" +
      JSON.stringify({
        opcoesTramas: [
          {
            id: "opcao_1",
            nomeOpcao: "⚔️ Opção 1: Caminho do Confronto Direto (Provação Marcial)",
            tituloArco: "string",
            focoNarrativo: "string",
            eventos: [
              { numero: 1, fase: "...", titulo: "...", descricao: "...", objetivoCena: "...", desafioSugerido: "..." }
            ],
            antagonista: { nome: "...", titulo: "...", origem: "...", motivacao: "...", fraquezaChave: "..." },
            briefingWhatsApp: "string"
          }
        ]
      }, null, 2);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.opcoesTramas) && parsed.opcoesTramas.length > 0) {
          const op1 = parsed.opcoesTramas[0];
          return {
            ...heuristicResult,
            opcoesTramas: parsed.opcoesTramas,
            tituloArco: op1.tituloArco || heuristicResult.tituloArco,
            ganchoImediato: op1.focoNarrativo || heuristicResult.ganchoImediato,
            eventos: op1.eventos || heuristicResult.eventos,
            antagonista: op1.antagonista || heuristicResult.antagonista,
            briefingWhatsApp: op1.briefingWhatsApp || heuristicResult.briefingWhatsApp
          };
        }
      }
    }
  } catch (err) {
    console.warn("OpenAI API call failed, falling back to cognitive semantic engine:", err);
  }

  return heuristicResult;
}

async function gerarTramaConjuntaAI(params) {
  const players = params?.players || [];
  const cenasConjuntas = params?.cenasConjuntas || [];
  const openAiKey = params?.openAiKey || "";
  const heuristicResult = sintetizarTramaConjuntaHeuristica(players, cenasConjuntas);
  const apiKey = (openAiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") || "" : "")).trim();

  if (!apiKey || apiKey.length < 15) {
    return heuristicResult;
  }

  try {
    const prompt = "Você é o Mestre Narrador Principal do BLEACH RPG.\n" +
      "Analise as cenas dos seguintes jogadores e crie 3 Opções de Tramas Cruzadas / Arcos Compartilhados:\n\n" +
      "JOGADORES:\n" +
      players.map(p => "- " + p.nome + " (" + p.raca + ", " + p.esquadrao + ")").join('\n') + "\n\n" +
      "CENAS ARMAZENADAS:\n" +
      cenasConjuntas.map(c => "[" + (c.autorNome || 'Cena') + " - " + c.titulo + "]: " + c.texto).join('\n') + "\n\n" +
      "Responda APENAS em formato JSON com as 3 opções de tramas:\n" +
      JSON.stringify({
        opcoesTramas: [
          {
            id: "conj_opcao_1",
            nomeOpcao: "⚔️ Opção 1: Aliança de Sangue (Combate Cooperativo Sincronizado)",
            tituloArco: "string",
            dinamicaDupla: "string",
            sinopse: "string",
            eventosCruzados: [
              { fase: "...", descricao: "...", papelPlayer1: "...", papelPlayer2: "...", ganchoWhats: "..." }
            ],
            ameacaComum: { nome: "...", perigo: "...", mecanicaEspecial: "..." },
            briefingWhatsApp: "string"
          }
        ]
      }, null, 2);

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.opcoesTramas) && parsed.opcoesTramas.length > 0) {
          const op1 = parsed.opcoesTramas[0];
          return {
            ...heuristicResult,
            opcoesTramas: parsed.opcoesTramas,
            tituloArco: op1.tituloArco || heuristicResult.tituloArco,
            dinamicaDupla: op1.dinamicaDupla || heuristicResult.dinamicaDupla,
            sinopse: op1.sinopse || heuristicResult.sinopse,
            eventosCruzados: op1.eventosCruzados || heuristicResult.eventosCruzados,
            ameacaComum: op1.ameacaComum || heuristicResult.ameacaComum,
            briefingWhatsApp: op1.briefingWhatsApp || heuristicResult.briefingWhatsApp
          };
        }
      }
    }
  } catch (err) {
    console.warn("OpenAI joint arc call failed, falling back to cognitive semantic engine:", err);
  }

  return heuristicResult;
}


if (typeof window !== 'undefined') {
  window.gerar4CaminhosZanpakutoAI = gerar4CaminhosZanpakutoAI;
  window.gerar4CaminhosZanpakutoAI_Async = gerar4CaminhosZanpakutoAI_Async;
  window.gerar3BankaisEvolucaoAI = gerar3BankaisEvolucaoAI;
  window.gerar3BankaisEvolucaoAI_Async = gerar3BankaisEvolucaoAI_Async;
  window.sintetizar3BankaisEvolucaoCognitivo = sintetizar3BankaisEvolucaoCognitivo;
  window.construirPromptBankaiEvolucao = construirPromptBankaiEvolucao;
  window.calcularAssinaturaEspiritual = calcularAssinaturaEspiritual;
  window.calcularIndiceSimilaridade = calcularIndiceSimilaridade;
  window.sintetizarZanpakutosCognitivo = sintetizarZanpakutosCognitivo;
  window.construirDnaEspiritual = construirDnaEspiritual;
  window.construirPromptChatGPT = construirPromptChatGPT;
  window.calcularAtributosZanpakuto = calcularAtributosZanpakuto;
  window.gerarCapacidadesTaticasZanpakuto = gerarCapacidadesTaticasZanpakuto;
  window.calcularRelacaoForcaResiliencia = calcularRelacaoForcaResiliencia;
  window.calcularRelacaoForcaForca = calcularRelacaoForcaForca;
  window.calcularRelacaoVelocidadeVelocidade = calcularRelacaoVelocidadeVelocidade;
  window.calcularRelacaoPressaoPressao = calcularRelacaoPressaoPressao;
  window.calcularCustoKido = calcularCustoKido;
  window.calcularPoderKido = calcularPoderKido;
  window.calcularEfeitoHado = calcularEfeitoHado;
  window.calcularEfeitoBakudo = calcularEfeitoBakudo;
  window.calcularEfeitoKaido = calcularEfeitoKaido;
  window.getCapacidadeKidos = getCapacidadeKidos;
  window.gerarFichaFormatadaMalutti = gerarFichaFormatadaMalutti;
  window.copiarFichaFormatadaWhatsApp = copiarFichaFormatadaWhatsApp;
  window.getCodigoAtividade = getCodigoAtividade;
  window.gerarTramaIndividualAI = gerarTramaIndividualAI;
  window.gerarTramaConjuntaAI = gerarTramaConjuntaAI;
  window.sintetizarTramaIndividualHeuristica = sintetizarTramaIndividualHeuristica;
  window.sintetizarTramaConjuntaHeuristica = sintetizarTramaConjuntaHeuristica;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gerar4CaminhosZanpakutoAI,
    gerar4CaminhosZanpakutoAI_Async,
    gerar3BankaisEvolucaoAI,
    gerar3BankaisEvolucaoAI_Async,
    sintetizarZanpakutosCognitivo,
    sintetizar3BankaisEvolucaoCognitivo,
    construirPromptBankaiEvolucao,
    calcularAssinaturaEspiritual,
    calcularIndiceSimilaridade,
    getClaimedSignatures,
    getExistingZanpakutosSummary,
    construirDnaEspiritual,
    construirPromptChatGPT,
    calcularAtributosZanpakuto,
    gerarCapacidadesTaticasZanpakuto,
    calcularRelacaoForcaResiliencia,
    calcularRelacaoForcaForca,
    calcularRelacaoVelocidadeVelocidade,
    calcularRelacaoPressaoPressao,
    calcularCustoKido,
    calcularPoderKido,
    calcularEfeitoHado,
    calcularEfeitoBakudo,
    calcularEfeitoKaido,
    getCapacidadeKidos,
    gerarFichaFormatadaMalutti,
    copiarFichaFormatadaWhatsApp,
    getCodigoAtividade,
    gerarTramaIndividualAI,
    gerarTramaConjuntaAI,
    sintetizarTramaIndividualHeuristica,
    sintetizarTramaConjuntaHeuristica
  };
}

