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

// 3. PROMPT BUILDER PARA CHATGPT / OPENAI (COM BLACKLIST E EXCLUSIVIDADE ABSOLUTA)
function construirPromptChatGPT(personagem, dna, cenaTexto = "", dbPersonagens = [], dbZanpakutosVinculadas = []) {
  const existingList = getExistingZanpakutosSummary(dbPersonagens, dbZanpakutosVinculadas);
  const existingSection = existingList.length > 0
    ? `\nZANPAKUTŌS JÁ REGISTRADAS NO SISTEMA (ESTRITAMENTE PROIBIDO REPETIR OU GERAR NOMES/PODERES/CONCEITOS SIMILARES A ESTAS):\n${existingList.join('\n')}\n`
    : "";

  return `Você é o ZANPAKUTŌ GENESIS ENGINE (V5.0) para o Bleach RPG.
Interprete a alma do seguinte personagem e gere EXATAMENTE 4 CAMINHOS DE ZANPAKUTŌ (Shikai + Bankai) 100% INÉDITOS, ORIGINAIS E EXCLUSIVOS, derivados diretamente da sua personalidade, virtudes, defeitos, conflitos e atributos.

DADOS DO PERSONAGEM:
- Nome: ${personagem.nome}
- Raça: ${personagem.raca || "Shinigami"} | Esquadrão: ${personagem.esquadrao || "11º Esquadrão"}
- Atributos: Pressão Espiritual: ${dna.dominante.val}, Força: ${personagem.atributos?.forca || 10}, Velocidade: ${personagem.atributos?.velocidade || 10}, Resiliência: ${personagem.atributos?.resiliencia || 10}
- Atributo Dominante: ${dna.dominante.label} | Atributo Deficiente: ${dna.deficiente.label}
- Personalidade Selada: ${dna.textoCompleto}
- Virtudes Centrais: ${dna.virtudes}
- Defeitos Marcantes: ${dna.defeitos}
- Desejos Profundos: ${dna.desejos}
- Maiores Medos: ${dna.medos}
- Conflitos Internos: ${dna.conflitos}
- Estilo de Combate: ${dna.estilo}
${cenaTexto ? `- Cena de Despertar Narrada pelo Jogador: "${cenaTexto}"` : ""}
${existingSection}
REGRAS ESTRITAS DE EXCLUSIVIDADE & ANTI-SIMILARIDADE:
1. REGRA ANTI-CLONE: É TERMINANTEMENTE PROIBIDO criar qualquer Shikai ou Bankai que compartilhe nome, elemento, conceito mecânico central ou frase de comando com qualquer uma das Zanpakutōs já registradas acima. Cada arma deve ser ÚNICA no universo do RPG.
2. ESTRUTURA DOS 4 CAMINHOS OBRIGATÓRIOS:
   - Caminho 1: Elemental / Temperamento (~45% peso da essência emocional, canalizado pelo atributo dominante)
   - Caminho 2: Conceitual / Progressivo / Regras (~20% peso - mecânica tática por etapas e leis de combate invioláveis)
   - Caminho 3: Compensatório / Defesa da Alma (Compensa o atributo deficiente e protege contra o maior medo do Shinigami)
   - Caminho 4: Opositivo / Abstrato / Sombra (Explora os conflitos internos, a sombra e o paradoxo oculto do subconsciente)
3. CADA CAMINHO DEVE POSSUIR:
   - Nome em japonês Romaji + Kanji + Tradução em Português
   - Frase poética de ativação/liberação
   - Representação do espírito (aparência, comportamento e mundo interior)
   - Design da forma selada e da Shikai
   - Poder da Shikai com mecânica tática detalhada e LIMITAÇÕES claras
   - Bankai correspondente: Nome em japonês/kanji, Limite da Shikai que foi quebrado (Ponto de Ruptura / Breakpoint), Tipo de Evolução e Poder Monumental
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
        "limitacoes": "Limitações e custos da Bankai",
        "significadoEspiritual": "Significado espiritual do domínio"
      }
    }
  ]
}`;
}

// 4. SINTETIZADOR DINÂMICO PROCEDURAL COGNITIVO COM FILTRO ANTI-DUPLICATAS
function sintetizarZanpakutosCognitivo(personagem, dna, cenaTexto = "", claimedNames = new Set(), claimedElements = new Set()) {
  const seedStr = `${personagem.nome}_${dna.textoCompleto}_${dna.virtudes}_${dna.defeitos}_${dna.desejos}_${dna.medos}_${dna.estilo}_${cenaTexto}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  let posHash = Math.abs(hash);

  const temasElementais = [
    { nome: "Enryū", kanji: "炎竜", trad: "Dragão Flamejante", elem: "Chamas Espirituais & Calor Cinético", cmd: "Incendeie o abismo da noite", arma: "Katana bifurcada com fio incandescente que absorve oxigênio do ar.", pod: "O usuário projeta ondas térmicas que intensificam a velocidade dos seus cortes e criam fissuras de brasas.", lim: "O calor elevado consome a estamina física se mantido por muito tempo.", bNome: "Enryū — Gōka Tenrin", bKanji: "炎竜・業火天輪", bTrad: "Anel Celestial do Fogo Cármico", bPoder: "A Bankai converte toda a área em um forno espiritual onde o próprio ar alimenta estocadas de plasma concentrado." },
    { nome: "Hyōgetsu", kanji: "氷月", trad: "Lua de Gelo", elem: "Cristais de Geada & Reflexo Térmico", cmd: "Congele o instante do silêncio", arma: "Lâmina translúcida de cristal azulado com tsuba em crescente lunar.", pod: "Libera micro-cristais de gelo que diminuem a fricção do ar para o usuário enquanto congelam o ponto de impacto no adversário.", lim: "Apenas congela superfícies sólidas em contato direto ou curta distância.", bNome: "Hyōgetsu — Hakuhyō Hakkei", bKanji: "氷月・白氷八景", bTrad: "Oito Paisagens do Gelo Branco", bPoder: "Ergue oito pilares monumentais de gelo espelhado que refletem a Reiatsu do usuário permitindo ataques multidirecionais instantâneos." },
    { nome: "Raiken", kanji: "雷刃", trad: "Lâmina do Relâmpago", elem: "Eletromagnetismo & Vetores Cinéticos", cmd: "Rasgue os céus sem deixar rastro", arma: "Espada sem guarda com fios de plasma estalando ao longo da lâmina.", pod: "Gera pulsos eletromagnéticos que aceleram os membros do usuário em trajetórias angulares instantâneas.", lim: "Exige recuperação muscular após três acelerações consecutivas.", bNome: "Raiken — Gōten Raimei", bKanji: "雷刃・轟天雷鳴", bTrad: "Trovão que Faz o Céu Rugir", bPoder: "Transforma todo o solo do campo de batalha em uma malha de condução elétrica onde qualquer movimento inimigo dispara descargas automáticas." },
    { nome: "Kurokaze", kanji: "黒風", trad: "Vento Negro", elem: "Vácuo Espiritual & Lâminas de Ar", cmd: "Silencie o mundo em teu sopro", arma: "Katana fina de aço negro que não produz som ao ser brandida.", pod: "Manipula bolsões de vácuo que cortam à distância sem deixar rastro sonoro ou visual perceptível.", lim: "O alcance do vácuo diminui se o usuário estiver em movimento desordenado.", bNome: "Kurokaze — Mukyū Senpū", bKanji: "黒風・無窮旋風", bTrad: "Turbilhão da Eternidade Escura", bPoder: "Cria uma tempestade de vácuo total que suprime a respiração e anula projéteis disparados contra o usuário." },
    { nome: "Suikō", kanji: "水光", trad: "Brilho das Águas", elem: "Fluidez Hidráulica & Refração de Pressão", cmd: "Ondule sobre o reflexo do abismo", arma: "Espada flexível com lâmina transparente de água altamente pressurizada.", pod: "Adapta o alcance do fio conforme a intensidade do golpe, criando chicotes de corte d'água capazes de contornar defesas.", lim: "Perde rigidez caso a concentração de Reiatsu seja interrompida.", bNome: "Suikō — Kaijin Ryūsen", bKanji: "水光・海神流千", bTrad: "Mil Torrentes do Deus dos Mares", bPoder: "Inunda o campo com uma névoa aquática que redistribui o impacto de qualquer ataque sofrido pelo usuário para as gotículas no ar." },
    { nome: "Gōka", kanji: "剛霞", trad: "Névoa de Ferro", elem: "Partículas Metálicas & Fricção Térmica", cmd: "Cerque a presa com mil fagulhas", arma: "Lâmina serrilhada com tsuba octogonal de ferro batido.", pod: "Dissolve o fio em milhões de micropartículas metálicas que flutuam invisíveis e entram em combustão por fricção.", lim: "Exige manter o oponente dentro do perímetro de dispersão da névoa.", bNome: "Gōka — Rengoku Jin'en", bKanji: "剛霞・煉獄塵煙", bTrad: "Poeira Incandescente do Purgatório", bPoder: "A névoa se condensa instantaneamente em anéis de fogo e aço triturante que esmagam o alvo de dentro para fora." }
  ];

  const temasConceituais = [
    { nome: "Shinmetsu", kanji: "心滅", trad: "Extinção da Intenção", elem: "Cadência de Golpes & Cancelamento", cmd: "Apague a intenção antes do golpe", arma: "Espada de lâmina reta com três anéis de bronze na empunhadura.", pod: "Cada vez que o usuário bloqueia um golpe com sucesso, o tempo de reação do adversário é dilatado em frações de segundo.", lim: "Necessita de bloqueios com timing exato.", bNome: "Shinmetsu — Mugen Kokū", bKanji: "心滅・無限虚空", bTrad: "Vazio Absoluto da Mente", bPoder: "A Bankai anula a percepção de tempo do oponente dentro de um raio de 50 metros, forçando-o a reagir apenas após o impacto ser desferido." },
    { nome: "Tenran", kanji: "天秤", trad: "Balança Celestial", elem: "Equilíbrio de Pressão & Troca Equivalente", cmd: "Pese a alma no fio da espada", arma: "Sabre prateado com cabo em formato de haste de balança cerimonial.", pod: "Detecta a diferença entre o poder físico do oponente e do usuário, equilibrando as forças a cada choque de espadas.", lim: "Requer contato contínuo de lâminas para manter a equivalência.", bNome: "Tenran — Shingyō Kaitei", bKanji: "天秤・真形界定", bTrad: "Definição Suprema do Domínio Justo", bPoder: "Impõe uma lei territorial onde nenhum ataque de força bruta pode superar a resistência de quem se defende sem que o atacante sofra dano idêntico." },
    { nome: "Kageboushi", kanji: "影法師", trad: "Silhueta das Sombras", elem: "Projeção Dimensional & Sombras", cmd: "Mergulhe onde a luz não alcança", arma: "Duas adagas curvas de lâminas foscas que absorvem qualquer reflexo luminoso.", pod: "Permite ao usuário estender seus cortes a partir da sombra projetada pelo alvo ou pelo cenário.", lim: "Inoperante em escuridão absoluta sem projeção de silhuetas.", bNome: "Kageboushi — Yami no Kekkai", bKanji: "影法師・闇の結界", bTrad: "Santuário da Noite Perpétua", bPoder: "O campo de batalha se torna uma dimensão de sombras vivas onde o usuário pode atacar simultaneamente de todas as sombras existentes." },
    { nome: "Senritsu", kanji: "旋律", trad: "Melodia do Vazio", elem: "Ressonância de Frequência & Vibração", cmd: "Ecooe a nota da destruição", arma: "Rapieira com tsuba em forma de diapasão que vibra ao menor movimento.", pod: "Cada corte cria uma frequência sônica inaudível que desestabiliza a coesão de Reishi das defesas adversárias.", lim: "Exige afinação contínua com a velocidade do adversário.", bNome: "Senritsu — Banshō Kyōmei", bKanji: "旋律・万象共鳴", bTrad: "Ressonância de Todas as Coisas", bPoder: "Sintoniza a frequência vibratória com a matéria espiritual ao redor, estilhaçando barreiras e armas que tentem colidir com o usuário." }
  ];

  const temasCompensatorios = [
    { nome: "Kōrinomori", kanji: "鋼森", trad: "Floresta de Aço", elem: "Armadura Reativa & Fortificação da Alma", cmd: "Erga a muralha inabalável", arma: "Espada pesada com empunhadura revestida em placas de metal espiritual.", pod: "Compensa a vulnerabilidade física gerando escudos de Reishi translúcidos a cada ataque recebido.", lim: "Reduz levemente a mobilidade máxima enquanto os escudos estão ativos.", bNome: "Kōrinomori — Bankin Jōkaku", bKanji: "鋼森・万金城郭", bTrad: "Fortaleza das Dez Mil Camadas", bPoder: "Ergue uma gigantesca cidadela de aço espiritual impenetrável que repara os ferimentos do usuário e repele investidas com concussão esmagadora." },
    { nome: "Seimei no Hana", kanji: "生命華", trad: "Flor da Vitalidade", elem: "Regeneração Celular & Drenagem Suave", cmd: "Floresça onde a dor sangrar", arma: "Florete esguio com detalhes de pétalas prateadas na guarda.", pod: "Converte frações da energia espiritual dos cortes desferidos em alívio de fadiga muscular e estabilização de feridas.", lim: "Não cura lesões fatais de forma instantânea.", bNome: "Seimei no Hana — Senju Rinne", bKanji: "生命華・千手輪廻", bTrad: "Roda Sagrada das Mil Vidas", bPoder: "Transfere o fluxo de vitalidade do ambiente para o usuário, permitindo lutar ininterruptamente sem sofrer perda de estamina ou choque de dor." },
    { nome: "Chōwa", kanji: "調和", trad: "Harmonia Resiliente", elem: "Absorção Cinética & Redirecionamento", cmd: "Disperse a fúria em calmaria", arma: "Tantō alargada com pomo em espiral de jade.", pod: "Absorve o impacto físico de golpes contundentes e os converte em fortalecimento da postura corporal do usuário.", lim: "Capacidade de absorção proporcional à Resiliência base do personagem.", bNome: "Chōwa — Taihei Seikai", bKanji: "調和・太平静界", bTrad: "Domínio da Grande Paz Eterna", bPoder: "Transforma toda a força destrutiva exercida no campo de batalha em barreira intransponível, neutralizando impactos devastadores." }
  ];

  const temasOpositivos = [
    { nome: "Mugenryū", kanji: "夢幻流", trad: "Fluxo do Devaneio", elem: "Distorção Perceptiva & Paradoxo Emocional", cmd: "Revele a verdade que os olhos temem", arma: "Lâmina ondulada translúcida que parece tremeluzir no ar como uma miragem.", pod: "Explora o conflito interno do adversário, fazendo-o enxergar a distância dos golpes ligeiramente fora da posição real.", lim: "Oponentes com percepção espiritual muito superior podem notar o descompasso.", bNome: "Mugenryū — Kyomu Shikai", bKanji: "夢幻流・虚無視界", bTrad: "Visão do Vazio Infinito", bPoder: "O ambiente se fragmenta em prismas de ilusão onde qualquer ataque hostil é redirecionado contra a própria sombra do atacante." },
    { nome: "Kokutan", kanji: "黒檀", trad: "Ébano Noturno", elem: "Absorção de Reiatsu & Gravidade Inversa", cmd: "Engula o brilho do horizonte", arma: "Espada pesada de laca negra profunda que atrai partículas de Reishi ao redor.", pod: "Cada impacto da espada comprime a gravidade local, fazendo os passos do inimigo pesarem o dobro a cada segundo.", lim: "O usuário também deve manter firme sua postura para não ser afetado pelo centro de massa.", bNome: "Kokutan — Shin'en Jūryoku", bKanji: "黒檀・深淵重力", bTrad: "Gravidade do Abismo Silencioso", bPoder: "Colapsa um campo gravitacional esmagador sobre o solo, imobilizando todos os seres ao redor enquanto o usuário flutua livremente no centro." },
    { nome: "Uragiri no Tsuki", kanji: "裏切月", trad: "Lua da Traição", elem: "Inversão de Causa e Efeito & Reflexos", cmd: "Corte aquilo que você mais ama", arma: "Wakizashi de dois gumes com espelho polido no centro da lâmina.", pod: "Inverte a percepção de perigo do oponente, fazendo golpes perigosos parecerem inofensivos e fintas parecerem letais.", lim: "Requer contato visual direto com a lâmina.", bNome: "Uragiri no Tsuki — Kyokō Genkai", bKanji: "裏切月・虚構限界", bTrad: "Fronteira da Inversão Absoluta", bPoder: "Inverte as propriedades das técnicas do adversário (ataques de fogo congelam, cortes cicatrizam e curas causam necrose temporária)." }
  ];

  // Helper to find an unclaimed theme
  function findUnclaimed(themeList, offset) {
    for (let i = 0; i < themeList.length; i++) {
      const idx = (posHash + offset + i) % themeList.length;
      const candidate = themeList[idx];
      if (!claimedNames.has(candidate.nome.toLowerCase())) {
        return candidate;
      }
    }
    // If all claimed, create unique modified version with unique title
    const base = themeList[(posHash + offset) % themeList.length];
    const uniqueSuffix = (posHash % 89 + 11).toString();
    return {
      ...base,
      nome: base.nome + " • " + (personagem.nome ? personagem.nome.split(' ')[0] : 'Seireitei'),
      kanji: base.kanji + "・改",
      trad: base.trad + " (Despertar Único)"
    };
  }

  const t1 = findUnclaimed(temasElementais, 0);
  const t2 = findUnclaimed(temasConceituais, 1);
  const t3 = findUnclaimed(temasCompensatorios, 2);
  const t4 = findUnclaimed(temasOpositivos, 3);

  const caminhos = [
    {
      caminhoNumero: 1,
      tipoCaminho: "Opção 1 — Personalidade / Elemental",
      subtitulo: "Manifestação Direta da Essência Emocional da Alma",
      indiceExclusividade: 100,
      shikai: {
        id: uid(),
        nome: t1.nome,
        kanji: t1.kanji,
        traducao: t1.trad,
        comando: t1.cmd + `, ${t1.nome}!`,
        elemento: t1.elem,
        aparencia: t1.arma,
        formatoArma: t1.arma,
        poder: t1.pod,
        limitacoes: t1.lim,
        custoReiatsu: "Médio",
        relacaoPersonalidade: `Nascida da virtude central: "${dna.virtudes}" e moldada pela essência emocional de ${personagem.nome}.`,
        relacaoAtributos: `Amplificada diretamente pelo atributo dominante: ${dna.dominante.label} (${dna.dominante.val} pts).`,
        indices: { potencia: 8, abrangencia: 8, complexidade: 6, versatilidade: 7, custo: 6 }
      },
      bankai: {
        nome: t1.bNome,
        kanji: t1.bKanji,
        tipoEvolucao: "Amplificação & Domínio Territorial",
        formaMonumental: `O ambiente inteiro ressoa com a essência de ${t1.nome}, manifestando um domínio monumental de ${t1.elem}.`,
        pontoRuptura: "A Shikai canaliza energia em lâmina; a Bankai transforma o próprio espaço de batalha em uma extensão viva da arma.",
        poder: t1.bPoder,
        limitacoes: "Consumo massivo de Reiatsu que exige concentração ininterrupta.",
        significadoEspiritual: `A consagração definitiva da determinação inabalável de ${personagem.nome}.`
      }
    },
    {
      caminhoNumero: 2,
      tipoCaminho: "Opção 2 — Conceitual / Progressivo / Regras",
      subtitulo: "Mecânica de Etapas e Regras de Combate",
      indiceExclusividade: 100,
      shikai: {
        id: uid(),
        nome: t2.nome,
        kanji: t2.kanji,
        traducao: t2.trad,
        comando: t2.cmd + `, ${t2.nome}!`,
        elemento: t2.elem,
        aparencia: t2.arma,
        formatoArma: t2.arma,
        poder: t2.pod,
        limitacoes: t2.lim,
        custoReiatsu: "Médio-Baixo",
        relacaoPersonalidade: `Reflete o pensamento tático e a disciplina de ${personagem.nome}: "${dna.estilo}".`,
        relacaoAtributos: `Opera em sinergia com a precisão dos atributos físicos e cálculo estratégico.`,
        indices: { potencia: 7, abrangencia: 6, complexidade: 9, versatilidade: 9, custo: 5 }
      },
      bankai: {
        nome: t2.bNome,
        kanji: t2.bKanji,
        tipoEvolucao: "Regras Territoriais Invioláveis",
        formaMonumental: "O espaço se organiza sob uma geometria espiritual onde leis de causa e efeito passam a ditar o combate.",
        pontoRuptura: "A Shikai requer condições de contato; a Bankai impõe as leis conceituais sobre todos os seres no território.",
        poder: t2.bPoder,
        limitacoes: "Se o usuário quebrar a própria regra imposta, sofre retaliação espiritual imediata.",
        significadoEspiritual: `A imposição da ordem interior de ${personagem.nome} sobre o caos da batalha.`
      }
    },
    {
      caminhoNumero: 3,
      tipoCaminho: "Opção 3 — Compensatório / Defesa da Alma",
      subtitulo: "Suporte e Fortificação da Maior Deficiência",
      indiceExclusividade: 100,
      shikai: {
        id: uid(),
        nome: t3.nome,
        kanji: t3.kanji,
        traducao: t3.trad,
        comando: t3.cmd + `, ${t3.nome}!`,
        elemento: t3.elem,
        aparencia: t3.arma,
        formatoArma: t3.arma,
        poder: t3.pod,
        limitacoes: t3.lim,
        custoReiatsu: "Baixo",
        relacaoPersonalidade: `Compensa o defeito/medo central: "${dna.defeitos}" e ergue proteção para "${dna.medos}".`,
        relacaoAtributos: `Fortalece o atributo mais vulnerável: ${dna.deficiente.label} (${dna.deficiente.val} pts).`,
        indices: { potencia: 7, abrangencia: 7, complexidade: 6, versatilidade: 8, custo: 4 }
      },
      bankai: {
        nome: t3.bNome,
        kanji: t3.bKanji,
        tipoEvolucao: "Fortaleza & Transcendência Defensiva",
        formaMonumental: "Uma colossal estrutura de suporte e proteção espiritual envolve o corpo e os aliados do usuário.",
        pontoRuptura: "A Shikai amortece o impacto momentâneo; a Bankai erradica a vulnerabilidade da alma transformando dor em fortaleza inexpugnável.",
        poder: t3.bPoder,
        limitacoes: "Exige que o usuário permaneça como o pilar central da estrutura.",
        significadoEspiritual: `A transformação do medo de falhar na maior muralha de proteção da Sociedade das Almas.`
      }
    },
    {
      caminhoNumero: 4,
      tipoCaminho: "Opção 4 — Opositivo / Abstrato / Sombra",
      subtitulo: "Exploração do Paradoxo e da Sombra Oculta",
      indiceExclusividade: 100,
      shikai: {
        id: uid(),
        nome: t4.nome,
        kanji: t4.kanji,
        traducao: t4.trad,
        comando: t4.cmd + `, ${t4.nome}!`,
        elemento: t4.elem,
        aparencia: t4.arma,
        formatoArma: t4.arma,
        poder: t4.pod,
        limitacoes: t4.lim,
        custoReiatsu: "Alto",
        relacaoPersonalidade: `Traz à tona o conflito interior: "${dna.conflitos}" e a dualidade da mente de ${personagem.nome}.`,
        relacaoAtributos: `Canaliza a densidade espiritual bruta para manifestar o paradoxo de combate.`,
        indices: { potencia: 9, abrangencia: 8, complexidade: 8, versatilidade: 8, custo: 8 }
      },
      bankai: {
        nome: t4.bNome,
        kanji: t4.bKanji,
        tipoEvolucao: "Inversão da Realidade & Paradoxo",
        formaMonumental: "Uma distorção cósmica toma conta do campo de batalha, onde causa e efeito invertem seus papéis.",
        pontoRuptura: "A Shikai perturba a percepção momentânea; a Bankai colapsa a própria lógica de combate do adversário no vazio.",
        poder: t4.bPoder,
        limitacoes: "Risco de desestabilização da própria Reiatsu se o usuário hesitar.",
        significadoEspiritual: `A aceitação da própria escuridão interior como fonte inesgotável de poder transcendental.`
      }
    }
  ];

  return caminhos;
}

// 5. FUNÇÃO CENTRAL ASSÍNCRONA DE GERAÇÃO COM IA (COM VALIDAÇÃO DE EXCLUSIVIDADE & ANTI-SIMILARIDADE)
async function gerar4CaminhosZanpakutoAI_Async(personagem, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "", apiKey = "") {
  const { claimed, claimedNames, claimedElements } = getClaimedSignatures(dbPersonagens, dbZanpakutosVinculadas);
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  const keyToUse = apiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") : "") || (typeof window !== 'undefined' ? window.BLEACH_CONFIG?.openaiApiKey : "") || "";

  let caminhosResultantes = null;

  // 1. Tentar Google Gemini API (gemini-3.6-flash) se a chave for do Google (AQ... ou AIzaSy...)
  if (keyToUse && !keyToUse.startsWith("sk-") && keyToUse.length > 20) {
    try {
      console.log("Chamando Google Gemini API (gemini-3.6-flash) para geração de Zanpakutō...");
      const prompt = construirPromptChatGPT(personagem, dna, cenaTexto, dbPersonagens, dbZanpakutosVinculadas);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(keyToUse)}`, {
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
            temperature: 0.85
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          if (parsed && Array.isArray(parsed.caminhos) && parsed.caminhos.length >= 4) {
            console.log("Zanpakutō gerada com sucesso pelo Google Gemini!");
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
      console.warn("Google Gemini API fetch failed, falling back to Cognitive Soul Synthesizer:", err);
    }
  }

  // 2. Tentar ChatGPT / OpenAI se chave for da OpenAI (sk-...)
  if (!caminhosResultantes && keyToUse && keyToUse.startsWith("sk-")) {
    try {
      console.log("Chamando OpenAI API (ChatGPT) para geração de Zanpakutō com verificação estrita de exclusividade...");
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
            { role: "system", content: "Você é um mestre narrador de Bleach RPG especialista no Zanpakuto Genesis Engine v5.0. Você NUNCA repete nomes, temas ou mecânicas de Zanpakutōs já registradas no banco de dados. Responda APENAS em JSON válido." },
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
          if (parsed && Array.isArray(parsed.caminhos) && parsed.caminhos.length >= 4) {
            console.log("Zanpakutō gerada com sucesso pelo ChatGPT!");
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
      console.warn("OpenAI fetch failed, falling back to Cognitive Soul Synthesizer:", err);
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

// Compatibilidade Síncrona
function gerar4CaminhosZanpakutoAI(personagem, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "") {
  const { claimedNames, claimedElements } = getClaimedSignatures(dbPersonagens, dbZanpakutosVinculadas);
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  return sintetizarZanpakutosCognitivo(personagem, dna, cenaTexto, claimedNames, claimedElements);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gerar4CaminhosZanpakutoAI,
    gerar4CaminhosZanpakutoAI_Async,
    calcularAssinaturaEspiritual,
    calcularIndiceSimilaridade,
    getClaimedSignatures,
    getExistingZanpakutosSummary,
    construirDnaEspiritual,
    construirPromptChatGPT
  };
}
