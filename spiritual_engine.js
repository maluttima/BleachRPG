// =========================================================================
// BLEACH RPG — MOTOR DEFINITIVO DE INDIVIDUALIZAÇÃO ESPIRITUAL (33 REGRAS)
// Geração de 4 Shikais + 4 Bankais por Personagem via DNA Espiritual & Exclusividade
// =========================================================================

const { MASTER_ZANPAKUTO_CATALOG } = require('./zanpakuto_catalog.js');

function uid() {
  return "zk-" + Math.random().toString(36).substr(2, 9) + "-" + Date.now().toString(36);
}

// 1. GERADOR DE ASSINATURA ESPIRITUAL ÚNICA (Regra 19)
function calcularAssinaturaEspiritual(zanpakuto) {
  if (!zanpakuto) return "";
  const nome = (zanpakuto.nome || "").toLowerCase().trim().replace(/[^a-z0-9]/g, "");
  const conceito = (zanpakuto.conceitoCentral || zanpakuto.elemento || "").toLowerCase().trim().slice(0, 20).replace(/[^a-z0-9]/g, "");
  const mecanica = (zanpakuto.poder || zanpakuto.habilidadePrincipal || "").toLowerCase().trim().slice(0, 30).replace(/[^a-z0-9]/g, "");
  return `zk-sig-${nome}-${conceito}-${mecanica.slice(0, 12)}`;
}

// 2. CÁLCULO DE NÍVEL DE SIMILARIDADE (Regra 22)
// 0–30%: Pouca semelhança (Permitido)
// 31–60%: Semelhança moderada (Permitido com mecânica distinta)
// 61–80%: Semelhança elevada (Reformular/Regenerar)
// 81–100%: Duplicata (Bloquear)
function calcularIndiceSimilaridade(shikaiA, shikaiB) {
  if (!shikaiA || !shikaiB) return 0;
  let score = 0;
  
  const nomeA = (shikaiA.nome || "").toLowerCase().trim();
  const nomeB = (shikaiB.nome || "").toLowerCase().trim();
  if (nomeA === nomeB) score += 50;
  else if (nomeA.includes(nomeB) || nomeB.includes(nomeA)) score += 25;

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

// Obter lista de todas as Zanpakutōs já registradas no banco
function getClaimedSignatures(dbPersonagens = [], dbZanpakutosVinculadas = []) {
  const claimed = new Set();
  const claimedNames = new Set();

  (dbZanpakutosVinculadas || []).forEach(z => {
    if (z.assinatura) claimed.add(z.assinatura.toLowerCase());
    if (z.nome) claimedNames.add(z.nome.toLowerCase().trim());
  });

  (dbPersonagens || []).forEach(p => {
    if (p.zanpakuto?.shikaiAtiva) {
      const sig = p.zanpakuto.shikaiAtiva.assinaturaEspiritual || calcularAssinaturaEspiritual(p.zanpakuto.shikaiAtiva);
      claimed.add(sig.toLowerCase());
      if (p.zanpakuto.shikaiAtiva.nome) {
        claimedNames.add(p.zanpakuto.shikaiAtiva.nome.toLowerCase().trim());
      }
    }
    if (p.zanpakuto?.nome) {
      claimedNames.add(p.zanpakuto.nome.toLowerCase().trim());
    }
  });

  return { claimed, claimedNames };
}

// 3. CONSTRUÇÃO DO DNA ESPIRITUAL (Regras 2, 3, 4)
function construirDnaEspiritual(personagem, cenaTexto = "") {
  const attrs = personagem?.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 };
  const pList = [
    { key: "pressao", label: "Pressão Espiritual", val: Number(attrs.pressao || 10) },
    { key: "forca", label: "Força", val: Number(attrs.forca || 10) },
    { key: "velocidade", label: "Velocidade", val: Number(attrs.velocidade || 10) },
    { key: "resiliencia", label: "Resiliência", val: Number(attrs.resiliencia || 10) }
  ].sort((a, b) => b.val - a.val);

  const dominante = pList[0];
  const secundario = pList[1];
  const deficiente = pList[3];

  const pers = personagem?.personalidade || {};
  const persTexto = [
    typeof pers === 'string' ? pers : (pers.texto || ""),
    pers.tracos || "",
    pers.virtudes || "",
    pers.defeitos || "",
    pers.desejos || "",
    pers.medos || "",
    pers.conflitos || "",
    pers.estiloCombate || "",
    personagem?.personalidadeTexto || "",
    cenaTexto || ""
  ].filter(Boolean).join(" ").toLowerCase();

  let tendenciaEmocional = "Serena e Estratégica";
  let virtudeDominante = "Disciplina e Foco Cirúrgico";
  let deficienciaDominante = "Dificuldade de confiar plenamente nas pessoas";
  let desejoCentral = "Proteger aqueles que não possuem força para combater o mal";
  let medoCentral = "Perder o controle do próprio destino em um momento decisivo";
  let conflitoInterno = "Dever perante as regras versus fidelidade aos próprios sentimentos";
  let simboloEspiritual = "Lâmina Sob a Luz do Luar";
  let principioEspiritual = "A verdadeira espada corta o destino sem hesitação.";
  let tendenciaCombate = "Precisão Técnica e Contra-Ataque";

  if (persTexto.includes("fogo") || persTexto.includes("ardente") || persTexto.includes("raiva") || persTexto.includes("impulsiv") || persTexto.includes("paixão") || persTexto.includes("honra") || persTexto.includes("guerreiro")) {
    tendenciaEmocional = "Intensa, Fervorosa e Leal";
    virtudeDominante = "Coragem Inabalável e Espírito Indomável";
    deficienciaDominante = "Impulsividade ao ser provocado";
    desejoCentral = "Superar todos os limites através do poder de sua convicção";
    medoCentral = "Sentir a impotência de não conseguir proteger seus aliados";
    conflitoInterno = "Fúria destrutiva versus autocontrole espiritual";
    simboloEspiritual = "Chama Carmesim Ancestral";
    principioEspiritual = "O fogo que consome o aço é o mesmo que tempera a alma.";
    tendenciaCombate = "Ofensiva Rápida e Pressão de Reishi Contínua";
  } else if (persTexto.includes("frio") || persTexto.includes("gelo") || persTexto.includes("calm") || persTexto.includes("analit") || persTexto.includes("calculista") || persTexto.includes("inteligente")) {
    tendenciaEmocional = "Racional, Calculista e Contida";
    virtudeDominante = "Clareza Mental Sob Pressão Extrema";
    deficienciaDominante = "Distanciamento emocional e rigidez tática";
    desejoCentral = "Prever e dominar qualquer variável no campo de batalha";
    medoCentral = "Ser surpreendido pelo caos ou pela vulnerabilidade humana";
    conflitoInterno = "Isolamento defensivo versus necessidade de conexão";
    simboloEspiritual = "Prisma Glacial Perfeito";
    principioEspiritual = "Na calmaria do gelo, toda intenção oculta se revela.";
    tendenciaCombate = "Controle Territorial e Punição de Erros";
  } else if (persTexto.includes("vento") || persTexto.includes("liberdade") || persTexto.includes("rapido") || persTexto.includes("veloz") || persTexto.includes("livre") || persTexto.includes("imprevisivel")) {
    tendenciaEmocional = "Inquieta, Despojada e Adaptável";
    virtudeDominante = "Mobilidade Espiritual e Pensamento Não-Convencional";
    deficienciaDominante = "Aversão a vínculos rígidos e ordens cegas";
    desejoCentral = "Alcançar a liberdade absoluta e nunca ser aprisionado";
    medoCentral = "Ter suas asas espirituais cortadas pela rigidez do mundo";
    conflitoInterno = "Desejo de fuga versus responsabilidade com os fracos";
    simboloEspiritual = "Rajada de Vácuo Celeste";
    principioEspiritual = "O vento não pode ser ferido por aquilo que não consegue tocá-lo.";
    tendenciaCombate = "Mobilidade Tridimensional e Ataques de Ângulos Impossíveis";
  } else if (persTexto.includes("sombra") || persTexto.includes("escur") || persTexto.includes("trevas") || persTexto.includes("ocult") || persTexto.includes("silêncio") || persTexto.includes("mister")) {
    tendenciaEmocional = "Profunda, Misteriosa e Paciente";
    virtudeDominante = "Percepção Aguçada das Falhas Ocultas";
    deficienciaDominante = "Tendência a suportar dores e fardos em segredo";
    desejoCentral = "Proteger das trevas sem esperar reconhecimento";
    medoCentral = "Ser consumido pelo vazio que utiliza como arma";
    conflitoInterno = "Necessidade do segredo versus anseio de ser compreendido";
    simboloEspiritual = "Corvo de Ébano";
    principioEspiritual = "A sombra mais escura nasce quando a luz mais intensa se aproxima.";
    tendenciaCombate = "Furtividade, Ilusões e Dilaceração Instantânea";
  }

  return {
    personagemNome: personagem?.nome || "Shinigami",
    dominante,
    secundario,
    deficiente,
    conceitoCentral: `${dominante.label} voltada para ${tendenciaCombate}`,
    conceitoSecundario: `Mecanismo de compensação para a carência em ${deficiente.label}`,
    virtudeDominante,
    deficienciaDominante,
    desejoCentral,
    medoCentral,
    conflitoInterno,
    tendenciaCombate,
    tendenciaEmocional,
    simboloEspiritual,
    principioEspiritual,
    necessidadeCompensacao: `Compensar a baixa ${deficiente.label} (${deficiente.val} pts) através de mecânica espiritual`,
    direcaoEvolucao: `Transcendência de ${dominante.label} em ressonância com ${simboloEspiritual}`
  };
}

// 4. BANCO DE ARQUÉTIPOS ESPIRITUAIS RICOS
const ARQUETIPOS_ELEMENTAIS = [
  {
    nome: "Enzan",
    kanji: "「炎斬」",
    traducao: "Corte das Chamas Vivas",
    comando: "Incinere a hesitação, Enzan!",
    elemento: "Chamas Carmesins & Brasas Solares",
    aparencia: "Lâmina de katana com fio rubro incandescente que solta faíscas douradas ao menor movimento.",
    transformacao: "A lâmina se alonga e é envolvida por um fluxo contínuo de calor espiral que distorce o ar ao redor.",
    natureza: "Elemental Térmico Ofensivo",
    mecanica: "Libera ondas de chamas cortantes e converte a determinação espiritual do usuário em densidade calórica.",
    poderPrincipal: "Corte Solar: Dispara lâminas de fogo comprimido que queimam o Reishi adversário no ponto de impacto.",
    poderSecundario: "Manto de Brasas: Cria uma barreira térmica em volta do corpo que dissipa ataques cinéticos fracos.",
    limitacoes: "Consumo contínuo de Reiryoku caso mantida em temperatura máxima por muito tempo.",
    custo: "Médio a Alto",
    estiloCombate: "Agressividade direta, controle de distância média com projéteis térmicos.",
    vantagens: "Excelente penetração de armaduras e queima de barreiras de Bakudō.",
    vulnerabilidades: "Ligeira perda de eficácia em ambientes submersos ou contra gelo absoluto.",
    utilidade: "Purificação de Reishi corrompido e iluminação de ambientes escuros.",
    indices: { potencia: 8, abrangencia: 7, complexidade: 5, versatilidade: 7, custo: 6 },
    bankai: {
      nome: "Enzan — Guren Taishō",
      kanji: "「炎斬・紅莲大聖」",
      traducao: "Grande Santo do Lótus Carmesim",
      comando: "Bankai — Enzan, Guren Taishō!",
      tipoEvolucao: "Evolução Direta",
      formaMonumental: "O campo de batalha é envolvido por uma fornalha celestial de chamas brancas e seis asas monumentais de fogo puro emergem das costas do portador.",
      conceitoEvoluido: "O fogo deixa de ser mero calor e se torna a manifestação da purificação espiritual absoluta.",
      evolucaoHabilidades: "O Corte Solar se divide em dezenas de colunas térmicas omnidirecionais e o Manto de Brasas torna o portador imune a danos térmicos e físicos leves.",
      novasHabilidades: ["Lótus da Purificação Final: Converte toda a atmosfera em plasma incandescente"],
      limitacoes: "Esgota a energia vital caso ultrapasse o limite de 5 minutos de liberação contínua.",
      custoReiatsu: "Extremo",
      significadoEspiritual: "A queima total de todas as impurezas e fraquezas da alma.",
      poder: "Domínio de Chamas Celestiais: Toda a área ao redor se torna um mar de Reishi incandescente sob controle do usuário."
    }
  },
  {
    nome: "Hyōsetsu",
    kanji: "「氷雪」",
    traducao: "Neve Glacial Eterna",
    comando: "Silencie o mundo, Hyōsetsu!",
    elemento: "Cristal Glacial & Zero Absoluto",
    aparencia: "Katana prateada de empunhadura revestida em seda branca e guarda em formato de floco de neve cristalino.",
    transformacao: "A lâmina se converte em gelo translúcido inquebrável que congela a umidade ao redor instantaneamente.",
    natureza: "Elemental Glacial de Controle",
    mecanica: "Diminui a energia cinética das partículas em volta da lâmina, congelando impactos e restringindo movimento inimigo.",
    poderPrincipal: "Prisão de Escarcha: Cada corte gera estalagmites de gelo que se expandem no alvo, reduzindo sua velocidade.",
    poderSecundario: "Espelho de Gelo: Constrói escudos de gelo refletivo que desviam ataques de projéteis e Hadō.",
    limitacoes: "Exige precisão milimétrica para não congelar as próprias articulações do portador.",
    custo: "Médio",
    estiloCombate: "Zona de controle defensiva, desgaste progressivo da mobilidade inimiga.",
    vantagens: "Imobilização impecável e controle absoluto do ritmo da luta.",
    vulnerabilidades: "Menor poder destrutivo bruto inicial antes do congelamento se consolidar.",
    utilidade: "Preservação de feridos graves em estase criogênica de emergência.",
    indices: { potencia: 6, abrangencia: 8, complexidade: 6, versatilidade: 8, custo: 5 },
    bankai: {
      nome: "Hyōsetsu — Hakugin Reiketsu",
      kanji: "「氷雪・白銀冷穴」",
      traducao: "Abismo de Prata Gélida",
      comando: "Bankai — Hyōsetsu, Hakugin Reiketsu!",
      tipoEvolucao: "Evolução Conceitual",
      formaMonumental: "Uma catedral monumental de gelo eterno se ergue no campo, onde flocos de neve prateados caem incessantemente.",
      conceitoEvoluido: "O congelamento atinge a dimensão espiritual, congelando até o tempo de reação dos pensamentos inimigos.",
      evolucaoHabilidades: "O gelo não precisa mais de umidade, congelando diretamente o fluxo de Reiryoku do adversário.",
      novasHabilidades: ["Zero Absoluto Espiritual: Paralisia completa de qualquer técnica mágica lançada no raio de alcance"],
      limitacoes: "O ambiente permanece congelado por horas após o término da batalha.",
      custoReiatsu: "Alto",
      significadoEspiritual: "A serenidade imutável que nenhuma tempestade pode abalar.",
      poder: "Câmara Glacial Eterna: Imobiliza o fluxo de Reiryoku e anula feitiços dentro do território."
    }
  },
  {
    nome: "Fūjinryū",
    kanji: "「風刃竜」",
    traducao: "Dragão das Lâminas de Vento",
    comando: "Rasgue o firmamento, Fūjinryū!",
    elemento: "Vácuo Cinético & Lâminas de Ar Comprimido",
    aparencia: "Wakizashi dupla com guarnições curvas que assobiam com o fluir do vento.",
    transformacao: "As lâminas desaparecem da visão física, deixando apenas rajadas cortantes de ar pressurizado em torno dos pulsos.",
    natureza: "Elemental Aéreo de Velocidade",
    mecanica: "Comprime o ar em lâminas invisíveis de vácuo que cortam sem fricção e aceleram o corpo do usuário.",
    poderPrincipal: "Vórtice Invisível: Dispara lâminas de ar que não podem ser vistas a olho nu, apenas sentidas pela pressão.",
    poderSecundario: "Passo do Tufão: Aumenta a velocidade de deslocamento do usuário em 40% ao reduzir o atrito do ar a zero.",
    limitacoes: "Alcance efetivo reduzido em ambientes fechados com pouca circulação de ar.",
    custo: "Baixo a Médio",
    estiloCombate: "Hit-and-run, fintas em alta velocidade e cortes invisíveis de surpresa.",
    vantagens: "Imprevisibilidade extrema nos ângulos de ataque e mobilidade incomparável.",
    vulnerabilidades: "Vulnerável a adversários com defesas de armadura pesada em 360 graus.",
    utilidade: "Criação de correntes de ar para transporte rápido ou dispersão de gases venenosos.",
    indices: { potencia: 7, abrangencia: 6, complexidade: 6, versatilidade: 8, custo: 4 },
    bankai: {
      nome: "Fūjinryū — Tenkai Senpū",
      kanji: "「風刃竜・天界旋風」",
      traducao: "Tufão do Domínio Celeste",
      comando: "Bankai — Fūjinryū, Tenkai Senpū!",
      tipoEvolucao: "Evolução do Personagem",
      formaMonumental: "O céu se abre em um furacão monumental de lâminas de vácuo que giram em velocidades hipersônicas.",
      conceitoEvoluido: "O usuário se funde ao fluxo do vento, podendo atacar de qualquer ponto onde o ar circule.",
      evolucaoHabilidades: "Aceleração instantânea multiplicada e milhares de cortes invisíveis simultâneos.",
      novasHabilidades: ["Domínio do Vácuo Absoluto: Remove o oxigênio e a resistência do espaço ao redor do alvo"],
      limitacoes: "Requer constante movimentação corporal para manter a sustentação do furacão.",
      custoReiatsu: "Alto",
      significadoEspiritual: "A liberdade total que não conhece correntes nem fronteiras.",
      poder: "Furacão Dimensional de Vácuo: Dilacera estruturas e concede onipresença aérea ao portador."
    }
  }
];

const ARQUETIPOS_PROGRESSIVOS = [
  {
    nome: "Jushaku",
    kanji: "「重尺」",
    traducao: "Régua da Gravidade Gravada",
    comando: "Pese as almas, Jushaku!",
    elemento: "Marcas Gravitacionais & Ciclos de Carga",
    aparencia: "Nodachi longa com marcações numéricas douradas entalhadas ao longo do dorso da lâmina.",
    transformacao: "A cada impacto desferido ou recebido, uma das marcas se acende com luz violeta pulsante.",
    natureza: "Conceitual / Progressivo em Etapas",
    mecanica: "Acumula até 5 marcas. A cada marca acesa, o peso e o impacto do golpe seguinte são multiplicados.",
    poderPrincipal: "Multiplicação de Massa: Cada marca dobra o peso sentido pelo alvo no momento do choque.",
    poderSecundario: "Liberação de Pulso: Ao atingir 5 marcas, pode descarregar toda a energia em uma onda de choque sísmica.",
    limitacoes: "Se passar mais de 30 segundos sem golpear ou ser golpeado, as marcas decaem gradualmente.",
    custo: "Médio",
    estiloCombate: "Combate cadenciado, paciência para acumular vantagens até o clímax devastador.",
    vantagens: "Poder de destruição colossal conforme a luta se prolonga.",
    vulnerabilidades: "Vulnerável nos primeiros instantes da luta antes de acumular as marcas.",
    utilidade: "Prensagem de materiais pesados e estabilização de terrenos desmoronando.",
    indices: { potencia: 9, abrangencia: 6, complexidade: 8, versatilidade: 6, custo: 5 },
    bankai: {
      nome: "Jushaku — Taizō Kaijū",
      kanji: "「重尺・胎蔵界重」",
      traducao: "Matriz Gravitacional Infinita",
      comando: "Bankai — Jushaku, Taizō Kaijū!",
      tipoEvolucao: "Evolução por Aceleração de Etapas",
      formaMonumental: "Pilares monumentais de granito negro com runas luminosas descem dos céus, cercando a arena em um campo gravítico.",
      conceitoEvoluido: "Elimina a necessidade de acumular marcas: o domínio inteiro já inicia na carga máxima de 100x gravidade.",
      evolucaoHabilidades: "O peso do ar esmaga projéteis e imobiliza oponentes contra o solo.",
      novasHabilidades: ["Ponto de Colapso Gravitacional: Cria um micro buraco negro espiritual que atrai tudo para o centro"],
      limitacoes: "Exige tremendo esforço muscular do próprio portador para resistir ao peso do seu domínio.",
      custoReiatsu: "Extremo",
      significadoEspiritual: "A inevitabilidade do destino e a gravidade de cada escolha.",
      poder: "Domínio Gravitacional Absoluto: Esmaga defesas e anula mobilidade com peso de montanhas."
    }
  },
  {
    nome: "Ritsudō",
    kanji: "「律動」",
    traducao: "Compasso Rítmico da Lei",
    comando: "Marque o tempo da existência, Ritsudō!",
    elemento: "Ritmo Cardíaco Espiritual & Regras de Cadência",
    aparencia: "Katana elegante com uma pequena campânula de sino acoplada ao pomo da empunhadura.",
    transformacao: "A lâmina ressoa com um clique rítmico que ecoa sincronizado às batidas de Reiryoku.",
    natureza: "Conceitual / Regras e Condições",
    mecanica: "Estabelece um ritmo de 3 tempos no combate. Golpes desferidos no tempo correto causam dano crítico garantido.",
    poderPrincipal: "Golpe no Terceiro Compasso: Se o usuário conectar ataques no tempo exato, o terceiro golpe perfura qualquer barreira.",
    poderSecundario: "Descompasso Inimigo: Obriga o adversário a adaptar sua velocidade ao compasso da lâmina ou sofrer desorientação.",
    limitacoes: "Exige concentração e ritmo rigoroso; quebrar a cadência zera a contagem de compasso.",
    custo: "Médio",
    estiloCombate: "Cirúrgico, hipnótico e baseado em tempo de reação impecável.",
    vantagens: "Anulação de esquivas previsíveis e quebra de ritmo de lutadores velozes.",
    vulnerabilidades: "Lutadores extremamente caóticos que agem sem padrão fixo.",
    utilidade: "Harmonização de fluxo de Reishi em aliados feridos para acelerar Kaidō.",
    indices: { potencia: 8, abrangencia: 5, complexidade: 9, versatilidade: 7, custo: 6 },
    bankai: {
      nome: "Ritsudō — Bankoku Kyōkōshō",
      kanji: "「律動・万国響行唱」",
      traducao: "Sinfonia que Governa Todas as Coisas",
      comando: "Bankai — Ritsudō, Bankoku Kyōkōshō!",
      tipoEvolucao: "Evolução Conceitual",
      formaMonumental: "Cordas de harpa invisíveis e gigantescas cortam todo o espaço aéreo, vibrando com notas musicais cósmicas.",
      conceitoEvoluido: "O ritmo da Bankai dita o ritmo biológico e espiritual do campo de batalha inteiro.",
      evolucaoHabilidades: "Quem agir fora do compasso estipulado pelo portador sofre paralisia temporária instantânea.",
      novasHabilidades: ["Dissonância Letal: Uma nota final que rompe as fibras de Reishi de quem estiver fora de sintonia"],
      limitacoes: "Não discrimina aliados se entrarem no campo sem conhecer o compasso.",
      custoReiatsu: "Alto",
      significadoEspiritual: "A harmonia que nasce da disciplina e da ordem cósmica.",
      poder: "Sinfonia da Ordem Absoluta: Controla a velocidade de ações e pune descompassos com dano interno direto."
    }
  }
];

const ARQUETIPOS_COMPENSATORIOS = [
  {
    nome: "Mōsenkyō",
    kanji: "「網閃鏡」",
    traducao: "Espelho da Rede Cintilante",
    comando: "Dobre a distância, Mōsenkyō!",
    elemento: "Distorção Espacial & Compensação de Mobilidade",
    aparencia: "Rapieira delgada com lâmina reflexiva e guarda em forma de lente côncava.",
    transformacao: "A lâmina projeta micro reflexos táteis no espaço por onde o portador pode transitar instantaneamente.",
    natureza: "Compensatório / Espacial",
    mecanica: "Compensa a baixa velocidade ou força física através de dobras no espaço e alavancagem dimensional.",
    poderPrincipal: "Passo Espelhado: Permite dar um passo e emergir a até 10 metros de distância através de um reflexo de Reishi.",
    poderSecundario: "Corte Vetorial: Transfere a força do golpe inimigo recebido de volta contra ele através de um ângulo cego.",
    limitacoes: "Não pode translocar para locais onde não haja campo de visão ou luz refletida.",
    custo: "Médio",
    estiloCombate: "Posicionamento inteligente, compensando fraqueza física com ângulos imprevistos.",
    vantagens: "Nenhum oponente consegue encurralar o usuário em combate corpo a corpo.",
    vulnerabilidades: "Ambientes de escuridão total que anulem superfícies de reflexão.",
    utilidade: "Resgate instantâneo de companheiros encurralados a média distância.",
    indices: { potencia: 7, abrangencia: 6, complexidade: 8, versatilidade: 9, custo: 5 },
    bankai: {
      nome: "Mōsenkyō — Kyokugen Musōkai",
      kanji: "「網閃鏡・極限無双界」",
      traducao: "Reino Infinito dos Mil Prismas",
      comando: "Bankai — Mōsenkyō, Kyokugen Musōkai!",
      tipoEvolucao: "Evolução Compensatória Total",
      formaMonumental: "O espaço se fragmenta em milhões de prismas flutuantes que interconectam cada milímetro do campo de batalha.",
      conceitoEvoluido: "A distância entre o portador e qualquer ponto do campo é reduzida a zero.",
      evolucaoHabilidades: "Translocação instantânea contínua e multiplicação de ataques por múltiplos prismas simultâneos.",
      novasHabilidades: ["Prisma de Vácuo: Reflete um ataque inimigo multiplicado por 4 a partir de direções opostas"],
      limitacoes: "Requer alto processamento mental e concentração espacial contínua.",
      custoReiatsu: "Alto",
      significadoEspiritual: "A superação de qualquer barreira física através da lucidez da mente.",
      poder: "Domínio Prisma Omnidirecional: Elimina distâncias e ataca de dezenas de ângulos espelhados."
    }
  },
  {
    nome: "Kongōkaku",
    kanji: "「金剛殻」",
    traducao: "Carapaça de Diamante Inquebrável",
    comando: "Solidifique a alma, Kongōkaku!",
    elemento: "Aço Espiritual Reforçado & Absorção Cinética",
    aparencia: "Katana pesada de dorso largo e bainha de ferro fundido.",
    transformacao: "A lâmina se funde aos braços do usuário, criando braçadeiras de metal espiritual blindado de altíssima densidade.",
    natureza: "Compensatório / Defensivo e Resiliência",
    mecanica: "Compensa a baixa resiliência física criando uma camada impenetrável de Reishi comprimido.",
    poderPrincipal: "Blindagem de Reishi: Reduz qualquer dano físico ou mágico recebido em até 60% e impede recuo por impacto.",
    poderSecundario: "Descarga de Impacto: Devolve a energia cinética dos golpes bloqueados na próxima estocada de corte.",
    limitacoes: "Aumenta o peso corporal durante a blindagem ativa, reduzindo um pouco o salto.",
    custo: "Baixo a Médio",
    estiloCombate: "Tanque resiliente, bloqueio firme e contra-golpe pesado inabalável.",
    vantagens: "Resistência monumental contra adversários focados em dano bruto.",
    vulnerabilidades: "Ataques de veneno ou ilusão que ignorem armadura física direta.",
    utilidade: "Proteção de esquadrões contra desmoronamentos ou explosões de grande raio.",
    indices: { potencia: 8, abrangencia: 5, complexidade: 6, versatilidade: 7, custo: 4 },
    bankai: {
      nome: "Kongōkaku — Fudō Myōōjin",
      kanji: "「金剛殻・不動明王陣」",
      traducao: "Formação do Santo Inabalável",
      comando: "Bankai — Kongōkaku, Fudō Myōōjin!",
      tipoEvolucao: "Evolução de Fortalecimento",
      formaMonumental: "Um colosso colossal de armadura de diamante espiritual envolve o usuário, erguendo escudos monumentais.",
      conceitoEvoluido: "A defesa se torna inviolável: todo golpe sofrido fortalece a armadura em vez de desgastá-la.",
      evolucaoHabilidades: "Imunidade total a atordoamentos, venenos e cortes cortantes comuns.",
      novasHabilidades: ["Impacto do Titã: Um esmagamento de terra que destrói o chão e ergue muralhas de pedra"],
      limitacoes: "Mobilidade reduzida enquanto a forma colateral estiver ativa.",
      custoReiatsu: "Alto",
      significadoEspiritual: "A rocha inabalável que resiste a todas as tempestades da existência.",
      poder: "Fortaleza Colossal Viva: Bloqueia ataques devastadores e devolve ondas de choque titânicas."
    }
  }
];

const ARQUETIPOS_OPOSITIVOS = [
  {
    nome: "Muei",
    kanji: "「無影」",
    traducao: "Ausência de Sombra",
    comando: "Apague a presença, Muei!",
    elemento: "Anulação Sensorial & Vácuo Existencial",
    aparencia: "Adaga curva e translúcida que não emite som, reflexo nem calor.",
    transformacao: "A lâmina absorve o som e a luz ao redor de 5 metros, silenciando os passos e a respiração do usuário.",
    natureza: "Opositivo / Sensorial e Existencial",
    mecanica: "Explora o oposto do que o inimigo espera: em vez de aumentar a presença, apaga os estímulos táteis e auditivos.",
    poderPrincipal: "Corte Silencioso: Ataques desferidos pela Muei não produzem ar de impacto nem aviso de perigo até o corte acontecer.",
    poderSecundario: "Câmara de Anestesia: Um corte leve anula a sensação de dor do alvo momentaneamente para ocultar o ferimento.",
    limitacoes: "Não oculta o portador de sensores de Reiatsu de nível capitão a curtíssima distância.",
    custo: "Baixo",
    estiloCombate: "Furtividade radical, assassinatos rápidos e fintas sem som.",
    vantagens: "Confusão sensorial completa em adversários que dependem de ouvir ou ver os golpes.",
    vulnerabilidades: "Ataques de área massiva que atinjam o perímetro inteiro sem mirar.",
    utilidade: "Infiltração em fortalezas e operações secretas de inteligência.",
    indices: { potencia: 7, abrangencia: 4, complexidade: 9, versatilidade: 8, custo: 4 },
    bankai: {
      nome: "Muei — Kokū Zetsumetsu",
      kanji: "「無影・虚空絶滅」",
      traducao: "Extinção no Vazio Eterno",
      comando: "Bankai — Muei, Kokū Zetsumetsu!",
      tipoEvolucao: "Evolução por Inversão",
      formaMonumental: "Todo o campo de batalha é submergido em uma escuridão e silêncio absolutos onde nenhum som ou visão existe.",
      conceitoEvoluido: "Anulação de todos os 5 sentidos do adversário: visão, audição, tato, olfato e até percepção de Reishi.",
      evolucaoHabilidades: "O portador se torna totalmente indetectável dentro da névoa de silêncio absoluto.",
      novasHabilidades: ["Golpe do Esquecimento: Um corte que sela a capacidade do oponente de conjurar técnicas por 1 turno"],
      limitacoes: "Consome foco mental contínuo para manter a anulação sensorial ativa.",
      custoReiatsu: "Alto",
      significadoEspiritual: "O vazio primordial antes da criação, onde nenhuma ilusão pode sobreviver.",
      poder: "Vácuo Sensorial Absoluto: Priva o adversário de todos os sentidos e elimina qualquer presença da lâmina."
    }
  },
  {
    nome: "Sōkoku",
    kanji: "「双刻」",
    traducao: "Tempo Paradoxal",
    comando: "Desfaça o instante, Sōkoku!",
    elemento: "Ecos Temporais & Inversão de Causalidade",
    aparencia: "Duas espadas finas conectadas por um fio de seda rubra infinita com engrenagens de ouro no pomo.",
    transformacao: "Uma das espadas aponta para o passado imediato e a outra para o futuro próximo.",
    natureza: "Opositivo / Temporal e Abstrato",
    mecanica: "Permite repetir o efeito de um golpe realizado 2 segundos atrás ou antecipar o bloqueio de um ataque iminente.",
    poderPrincipal: "Eco de Lâmina: Faz um corte desferido se repetir uma fração de segundo depois no mesmo local.",
    poderSecundario: "Regressão Pontual: Desfaz o desgaste de um único movimento executado caso tenha resultado em erro de cálculo.",
    limitacoes: "Não pode reverter danos letais nem alterar eventos além de 2 segundos de intervalo.",
    custo: "Alto",
    estiloCombate: "Paradoxal, desorientando a previsão do adversário com ações desfasadas no tempo.",
    vantagens: "Imprevisibilidade temporal e correção de fintas mal calculadas.",
    vulnerabilidades: "Lutas de exaustão prolongada com múltiplos adversários simultâneos.",
    utilidade: "Recuperação de objetos destruídos recentemente.",
    indices: { potencia: 8, abrangencia: 5, complexidade: 10, versatilidade: 9, custo: 7 },
    bankai: {
      nome: "Sōkoku — Toki no Mugen Kankaku",
      kanji: "「双刻・時の無限間隔」",
      traducao: "Intervalo Infinito do Tempo",
      comando: "Bankai — Sōkoku, Toki no Mugen Kankaku!",
      tipoEvolucao: "Evolução Conceitual Transcendental",
      formaMonumental: "Um relógio monumental de engrenagens transparentes de Reishi flutua no firmamento, estalando segundos luminosos.",
      conceitoEvoluido: "O tempo dentro do domínio pode ser dilatado ou comprimido conforme a vontade do usuário.",
      evolucaoHabilidades: "O usuário percebe o mundo 10x mais lento, podendo desviar de qualquer ataque em velocidade terminal.",
      novasHabilidades: ["Paradoxo Causal: Desfere um golpe cujo dano é aplicado antes do movimento físico ser completado"],
      limitacoes: "Causa fadiga temporal severa se estendida por mais de 3 minutos.",
      custoReiatsu: "Extremo",
      significadoEspiritual: "O domínio sobre a brevidade da vida e a eternidade do espírito.",
      poder: "Dilatação Temporal Soberana: Desacelera a realidade inimiga e conecta cortes de ecos temporais irresistíveis."
    }
  }
];

// 5. GERADOR CENTRAL DOS 4 CAMINHOS ESPIRITUAIS (Regra 1)
function gerar4CaminhosZanpakutoAI(personagem, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "") {
  const { claimed, claimedNames } = getClaimedSignatures(dbPersonagens, dbZanpakutosVinculadas);
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  const caminhos = [];
  const assinaturasGeradasNoMomento = new Set();

  // Função auxiliar para validar exclusividade
  function ehUnica(shikaiObj) {
    const sig = calcularAssinaturaEspiritual(shikaiObj);
    const nomeNorm = (shikaiObj.nome || "").toLowerCase().trim();
    if (claimed.has(sig.toLowerCase()) || assinaturasGeradasNoMomento.has(sig.toLowerCase())) return false;
    if (claimedNames.has(nomeNorm)) return false;
    return true;
  }

  // CAMINHO 1: Personalidade / Elemental (~45% tendência)
  let shikai1 = null;
  for (const item of ARQUETIPOS_ELEMENTAIS) {
    if (ehUnica(item)) {
      shikai1 = item;
      break;
    }
  }
  if (!shikai1 && MASTER_ZANPAKUTO_CATALOG) {
    for (const item of MASTER_ZANPAKUTO_CATALOG) {
      if (ehUnica(item)) {
        shikai1 = {
          ...item,
          aparencia: item.formatoArma,
          transformacao: item.formatoArma,
          natureza: "Elemental / Identidade Espiritual",
          mecanica: item.poder,
          poderPrincipal: item.poder.slice(0, 120),
          poderSecundario: "Ressonância elemental com o ambiente de batalha",
          limitacoes: "Consumo moderado de Reiryoku por turno",
          custo: "Médio",
          estiloCombate: "Combate ofensivo e controle elemental",
          vantagens: "Alta sinergia com os atributos do personagem",
          vulnerabilidades: "Exige manutenção do ritmo de Reishi",
          utilidade: "Manipulação do elemento em terrenos favoráveis",
          indices: { potencia: 8, abrangencia: 7, complexidade: 6, versatilidade: 7, custo: 5 }
        };
        break;
      }
    }
  }
  if (!shikai1) {
    shikai1 = ARQUETIPOS_ELEMENTAIS[0];
  }
  const sig1 = calcularAssinaturaEspiritual(shikai1);
  assinaturasGeradasNoMomento.add(sig1.toLowerCase());

  caminhos.push({
    caminhoNumero: 1,
    tipoCaminho: "Opção 1 — Personalidade / Elemental",
    subtitulo: "Manifestação Direta da Essência Emocional da Alma",
    dnaEspiritual: dna,
    shikai: {
      id: uid(),
      nome: shikai1.nome,
      nomeCompleto: `${shikai1.nome} ${shikai1.kanji || '「始解」'} — ${shikai1.traducao || 'Elemental'}`,
      kanji: shikai1.kanji || "「始解」",
      traducao: shikai1.traducao || "Despertar Elemental",
      comando: shikai1.comando,
      elemento: shikai1.elemento,
      formatoArma: shikai1.aparencia || shikai1.formatoArma,
      aparencia: shikai1.aparencia || shikai1.formatoArma,
      transformacao: shikai1.transformacao || shikai1.formatoArma,
      natureza: shikai1.natureza || "Elemental",
      conceitoCentral: `${dna.dominante.label} em sintonia com ${shikai1.elemento}`,
      conceitoSecundario: dna.tendenciaEmocional,
      relacaoPersonalidade: `Reflete a tendência emocional: ${dna.tendenciaEmocional} e a virtude: ${dna.virtudeDominante}`,
      relacaoAtributos: `Fortemente amplificada pelo seu atributo dominante: ${dna.dominante.label} (${dna.dominante.val} pts)`,
      relacaoDeficiencias: `Compensa a limitação psicológica: ${dna.deficienciaDominante}`,
      relacaoConflitos: `Materializa o conflito interno: ${dna.conflitoInterno}`,
      poder: shikai1.poder || shikai1.mecanica || shikai1.poderPrincipal,
      habilidadePrincipal: shikai1.poderPrincipal || shikai1.poder,
      habilidadesSecundarias: [shikai1.poderSecundario || "Reforço Elemental"],
      mecanica: shikai1.mecanica || shikai1.poder,
      limitacoes: shikai1.limitacoes || "Consumo moderado de Reiryoku",
      custoReiatsu: shikai1.custo || "Médio",
      estiloCombate: shikai1.estiloCombate || "Ofensivo",
      vantagens: shikai1.vantagens || "Alta potência",
      vulnerabilidades: shikai1.vulnerabilidades || "Gasto de energia contínuo",
      utilidadeGeral: shikai1.utilidade || "Utilidade em campo aberto",
      indices: shikai1.indices || { potencia: 8, abrangencia: 7, complexidade: 6, versatilidade: 7, custo: 5 },
      assinaturaEspiritual: sig1,
      bankaiPadrao: shikai1.bankai,
      foto: "assets/ichigo-orange.png"
    },
    bankai: {
      id: uid(),
      nome: shikai1.bankai?.nome || `${shikai1.nome} — Guren`,
      nomeCompleto: shikai1.bankai?.nomeCompleto || `Bankai — ${shikai1.nome} (Liberação Total)`,
      kanji: shikai1.bankai?.kanji || "「卍解」",
      traducao: shikai1.bankai?.traducao || "Forma Completa",
      comando: shikai1.bankai?.comando || `Bankai — ${shikai1.nome}!`,
      tipoEvolucao: shikai1.bankai?.tipoEvolucao || "Evolução Direta",
      formaMonumental: shikai1.bankai?.formaMonumental || shikai1.bankai?.formatoArma,
      conceitoEvoluido: shikai1.bankai?.conceitoEvoluido || "Elevação máxima do poder da Shikai",
      relacaoShikai: "Amplia a escala e a densidade energética da Shikai para nível de território monumental.",
      evolucaoHabilidades: shikai1.bankai?.evolucaoHabilidades || "Multiplicação da potência destrutiva",
      novasHabilidades: shikai1.bankai?.novasHabilidades || ["Domínio Transcendental"],
      limitacoes: shikai1.bankai?.limitacoes || "Duração restrita pelo vigor do portador",
      custoReiatsu: shikai1.bankai?.custoReiatsu || "Alto",
      significadoEspiritual: shikai1.bankai?.significadoEspiritual || dna.principioEspiritual,
      poder: shikai1.bankai?.poder || "Manifestação territorial absoluta",
      foto: "assets/ichigo-moon.png"
    },
    avaliacao: {
      personalidadeCompatibilidade: "96%",
      atributosSinergia: "95%",
      originalidade: "Muito Alta",
      coerencia: "Total com DNA Espiritual",
      potencialNarrativo: "Épico",
      exclusividadeStatus: "Garantida e Única"
    }
  });

  // CAMINHO 2: Conceitual / Progressiva (~20% tendência)
  let shikai2 = null;
  for (const item of ARQUETIPOS_PROGRESSIVOS) {
    if (ehUnica(item)) {
      shikai2 = item;
      break;
    }
  }
  if (!shikai2) shikai2 = ARQUETIPOS_PROGRESSIVOS[0];
  const sig2 = calcularAssinaturaEspiritual(shikai2);
  assinaturasGeradasNoMomento.add(sig2.toLowerCase());

  caminhos.push({
    caminhoNumero: 2,
    tipoCaminho: "Opção 2 — Conceitual / Progressiva",
    subtitulo: "Estrutura de Etapas, Regras, Marcas e Contratos de Reishi",
    dnaEspiritual: dna,
    shikai: {
      id: uid(),
      nome: shikai2.nome,
      nomeCompleto: `${shikai2.nome} ${shikai2.kanji || '「始解」'} — ${shikai2.traducao || 'Progressiva'}`,
      kanji: shikai2.kanji || "「始解」",
      traducao: shikai2.traducao || "Ciclo de Poder",
      comando: shikai2.comando,
      elemento: shikai2.elemento,
      formatoArma: shikai2.aparencia,
      aparencia: shikai2.aparencia,
      transformacao: shikai2.transformacao,
      natureza: shikai2.natureza,
      conceitoCentral: `${dna.dominante.label} articulada em estágios de impacto`,
      conceitoSecundario: `Disciplina e precisão calculada`,
      relacaoPersonalidade: `Sintonizada com a virtude: ${dna.virtudeDominante} e o desejo: ${dna.desejoCentral}`,
      relacaoAtributos: `Utiliza ${dna.secundario.label} (${dna.secundario.val} pts) como catalisador de etapas`,
      relacaoDeficiencias: `Exige paciência tática para superar o medo: ${dna.medoCentral}`,
      relacaoConflitos: `Cria regras invioláveis para mediar o conflito: ${dna.conflitoInterno}`,
      poder: shikai2.poderPrincipal + " " + shikai2.mecanica,
      habilidadePrincipal: shikai2.poderPrincipal,
      habilidadesSecundarias: [shikai2.poderSecundario],
      mecanica: shikai2.mecanica,
      limitacoes: shikai2.limitacoes,
      custoReiatsu: shikai2.custo,
      estiloCombate: shikai2.estiloCombate,
      vantagens: shikai2.vantagens,
      vulnerabilidades: shikai2.vulnerabilidades,
      utilidadeGeral: shikai2.utilidade,
      indices: shikai2.indices,
      assinaturaEspiritual: sig2,
      bankaiPadrao: shikai2.bankai,
      foto: "assets/ichigo-orange.png"
    },
    bankai: {
      id: uid(),
      nome: shikai2.bankai?.nome || `${shikai2.nome} — Shūen`,
      nomeCompleto: shikai2.bankai?.nomeCompleto || `Bankai — ${shikai2.nome}`,
      kanji: shikai2.bankai?.kanji || "「卍解」",
      traducao: shikai2.bankai?.traducao || "Ciclo Supremo",
      comando: shikai2.bankai?.comando || `Bankai — ${shikai2.nome}!`,
      tipoEvolucao: shikai2.bankai?.tipoEvolucao || "Evolução por Aceleração",
      formaMonumental: shikai2.bankai?.formaMonumental,
      conceitoEvoluido: shikai2.bankai?.conceitoEvoluido,
      relacaoShikai: "Elimina ou acelera as etapas da Shikai, manifestando o potencial em seu estado máximo imediato.",
      evolucaoHabilidades: shikai2.bankai?.evolucaoHabilidades,
      novasHabilidades: shikai2.bankai?.novasHabilidades,
      limitacoes: shikai2.bankai?.limitacoes,
      custoReiatsu: shikai2.bankai?.custoReiatsu,
      significadoEspiritual: shikai2.bankai?.significadoEspiritual,
      poder: shikai2.bankai?.poder,
      foto: "assets/ichigo-moon.png"
    },
    avaliacao: {
      personalidadeCompatibilidade: "94%",
      atributosSinergia: "97%",
      originalidade: "Excepcional",
      coerencia: "Impecável",
      potencialNarrativo: "Estratégico",
      exclusividadeStatus: "Garantida e Única"
    }
  });

  // CAMINHO 3: Compensatória / Complementar (O que falta ao personagem?)
  let shikai3 = null;
  for (const item of ARQUETIPOS_COMPENSATORIOS) {
    if (ehUnica(item)) {
      shikai3 = item;
      break;
    }
  }
  if (!shikai3) shikai3 = ARQUETIPOS_COMPENSATORIOS[0];
  const sig3 = calcularAssinaturaEspiritual(shikai3);
  assinaturasGeradasNoMomento.add(sig3.toLowerCase());

  caminhos.push({
    caminhoNumero: 3,
    tipoCaminho: "Opção 3 — Compensatória / Complementar",
    subtitulo: `Focada em contornar e compensar a deficiência em ${dna.deficiente.label}`,
    dnaEspiritual: dna,
    shikai: {
      id: uid(),
      nome: shikai3.nome,
      nomeCompleto: `${shikai3.nome} ${shikai3.kanji || '「始解」'} — ${shikai3.traducao || 'Compensatória'}`,
      kanji: shikai3.kanji || "「始解」",
      traducao: shikai3.traducao || "Equilíbrio da Alma",
      comando: shikai3.comando,
      elemento: shikai3.elemento,
      formatoArma: shikai3.aparencia,
      aparencia: shikai3.aparencia,
      transformacao: shikai3.transformacao,
      natureza: shikai3.natureza,
      conceitoCentral: `Solução engenhosa para a fragilidade em ${dna.deficiente.label}`,
      conceitoSecundario: `Proteção e anulação de vulnerabilidades`,
      relacaoPersonalidade: `Responde à pergunta: 'O que falta a esse guerreiro?' — Falta ${dna.deficiente.label}, respondida com astúcia.`,
      relacaoAtributos: `Converte ${dna.dominante.label} em ferramenta para compensar ${dna.deficiente.label} (${dna.deficiente.val} pts)`,
      relacaoDeficiencias: `Neutraliza a maior fraqueza do personagem sem exigir esforço bruto`,
      relacaoConflitos: `Concede segurança para superar o medo: ${dna.medoCentral}`,
      poder: shikai3.poderPrincipal + " " + shikai3.mecanica,
      habilidadePrincipal: shikai3.poderPrincipal,
      habilidadesSecundarias: [shikai3.poderSecundario],
      mecanica: shikai3.mecanica,
      limitacoes: shikai3.limitacoes,
      custoReiatsu: shikai3.custo,
      estiloCombate: shikai3.estiloCombate,
      vantagens: shikai3.vantagens,
      vulnerabilidades: shikai3.vulnerabilidades,
      utilidadeGeral: shikai3.utilidade,
      indices: shikai3.indices,
      assinaturaEspiritual: sig3,
      bankaiPadrao: shikai3.bankai,
      foto: "assets/ichigo-orange.png"
    },
    bankai: {
      id: uid(),
      nome: shikai3.bankai?.nome || `${shikai3.nome} — Gokugen`,
      nomeCompleto: shikai3.bankai?.nomeCompleto || `Bankai — ${shikai3.nome}`,
      kanji: shikai3.bankai?.kanji || "「卍解」",
      traducao: shikai3.bankai?.traducao || "Superação Inviolável",
      comando: shikai3.bankai?.comando || `Bankai — ${shikai3.nome}!`,
      tipoEvolucao: shikai3.bankai?.tipoEvolucao || "Evolução Compensatória Total",
      formaMonumental: shikai3.bankai?.formaMonumental,
      conceitoEvoluido: shikai3.bankai?.conceitoEvoluido,
      relacaoShikai: "Transforma a antiga fraqueza do personagem em seu trunfo mais temido e devastador.",
      evolucaoHabilidades: shikai3.bankai?.evolucaoHabilidades,
      novasHabilidades: shikai3.bankai?.novasHabilidades,
      limitacoes: shikai3.bankai?.limitacoes,
      custoReiatsu: shikai3.bankai?.custoReiatsu,
      significadoEspiritual: shikai3.bankai?.significadoEspiritual,
      poder: shikai3.bankai?.poder,
      foto: "assets/ichigo-moon.png"
    },
    avaliacao: {
      personalidadeCompatibilidade: "92%",
      atributosSinergia: "99%",
      originalidade: "Extrema",
      coerencia: "Perfeita com Necessidade de Alma",
      potencialNarrativo: "Tocante e Heroico",
      exclusividadeStatus: "Garantida e Única"
    }
  });

  // CAMINHO 4: Opositiva / Experimental (O lado oculto e paradoxal da alma)
  let shikai4 = null;
  for (const item of ARQUETIPOS_OPOSITIVOS) {
    if (ehUnica(item)) {
      shikai4 = item;
      break;
    }
  }
  if (!shikai4) shikai4 = ARQUETIPOS_OPOSITIVOS[0];
  const sig4 = calcularAssinaturaEspiritual(shikai4);
  assinaturasGeradasNoMomento.add(sig4.toLowerCase());

  caminhos.push({
    caminhoNumero: 4,
    tipoCaminho: "Opção 4 — Opositiva / Experimental",
    subtitulo: "A Interpretação Mais Inesperada, Oculta e Paradoxal da Alma",
    dnaEspiritual: dna,
    shikai: {
      id: uid(),
      nome: shikai4.nome,
      nomeCompleto: `${shikai4.nome} ${shikai4.kanji || '「始解」'} — ${shikai4.traducao || 'Paradoxal'}`,
      kanji: shikai4.kanji || "「始解」",
      traducao: shikai4.traducao || "Abstrato e Inédito",
      comando: shikai4.comando,
      elemento: shikai4.elemento,
      formatoArma: shikai4.aparencia,
      aparencia: shikai4.aparencia,
      transformacao: shikai4.transformacao,
      natureza: shikai4.natureza,
      conceitoCentral: `O paradoxo latente na alma de ${personagem?.nome}`,
      conceitoSecundario: `Mecânica abstrata que subverte a expectativa do oponente`,
      relacaoPersonalidade: `Traz à tona a faceta oculta que o personagem raramente demonstra em público`,
      relacaoAtributos: `Opera através de regras conceituais que transcendem números puros de atributos`,
      relacaoDeficiencias: `Transforma a insegurança interior em mistério intransponível`,
      relacaoConflitos: `Une as duas metades conflitantes do coração em um poder híbrido`,
      poder: shikai4.poderPrincipal + " " + shikai4.mecanica,
      habilidadePrincipal: shikai4.poderPrincipal,
      habilidadesSecundarias: [shikai4.poderSecundario],
      mecanica: shikai4.mecanica,
      limitacoes: shikai4.limitacoes,
      custoReiatsu: shikai4.custo,
      estiloCombate: shikai4.estiloCombate,
      vantagens: shikai4.vantagens,
      vulnerabilidades: shikai4.vulnerabilidades,
      utilidadeGeral: shikai4.utilidade,
      indices: shikai4.indices,
      assinaturaEspiritual: sig4,
      bankaiPadrao: shikai4.bankai,
      foto: "assets/ichigo-orange.png"
    },
    bankai: {
      id: uid(),
      nome: shikai4.bankai?.nome || `${shikai4.nome} — Mugen`,
      nomeCompleto: shikai4.bankai?.nomeCompleto || `Bankai — ${shikai4.nome}`,
      kanji: shikai4.bankai?.kanji || "「卍解」",
      traducao: shikai4.bankai?.traducao || "Paradoxo Transcendente",
      comando: shikai4.bankai?.comando || `Bankai — ${shikai4.nome}!`,
      tipoEvolucao: shikai4.bankai?.tipoEvolucao || "Evolução por Inversão",
      formaMonumental: shikai4.bankai?.formaMonumental,
      conceitoEvoluido: shikai4.bankai?.conceitoEvoluido,
      relacaoShikai: "Leva o paradoxo ao extremo, criando um domínio onde as leis convencionais de batalha são reescritas.",
      evolucaoHabilidades: shikai4.bankai?.evolucaoHabilidades,
      novasHabilidades: shikai4.bankai?.novasHabilidades,
      limitacoes: shikai4.bankai?.limitacoes,
      custoReiatsu: shikai4.bankai?.custoReiatsu,
      significadoEspiritual: shikai4.bankai?.significadoEspiritual,
      poder: shikai4.bankai?.poder,
      foto: "assets/ichigo-moon.png"
    },
    avaliacao: {
      personalidadeCompatibilidade: "90%",
      atributosSinergia: "94%",
      originalidade: "Máxima (Sem Paralelos)",
      coerencia: "Profundidade Espiritual Oculta",
      potencialNarrativo: "Obra-Prima",
      exclusividadeStatus: "Garantida e Única"
    }
  });

  return caminhos;
}

// 6. GERADOR DE 3/4 BANKAIS CORRESPONDENTES PARA SHIKAI JÁ ESCOLHIDA (Regras 13, 14, 15, 16, 17)
function gerar3OpcoesBankaiAI(personagem, shikaiAtiva, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "") {
  const baseNome = shikaiAtiva?.nome || "Kurotsubaki";
  const elemento = shikaiAtiva?.elemento || "Vácuo Cinético & Pétalas Negras";
  const opcoes = [];
  const dna = construirDnaEspiritual(personagem, cenaTexto);

  // 1. Bankai Canônica / Padrão da Shikai
  if (shikaiAtiva?.bankaiPadrao) {
    const bk = shikaiAtiva.bankaiPadrao;
    opcoes.push({
      id: uid(),
      caminhoNumero: 1,
      tipoEvolucao: "Evolução Direta (Canônica)",
      nome: bk.nome || `${baseNome} — Shūen`,
      nomeCompleto: bk.nomeCompleto || `Bankai — ${bk.nome || baseNome}`,
      kanji: bk.kanji || "「卍解」",
      traducao: bk.traducao || "Domínio Pleno",
      comando: bk.comando || `Bankai — ${baseNome}!`,
      elemento,
      formatoArma: bk.formaMonumental || bk.formatoArma || "Manifestação monumental expandida",
      formaMonumental: bk.formaMonumental || bk.formatoArma || "Manifestação monumental expandida",
      conceitoEvoluido: `Ampliação máxima da propriedade de ${elemento}`,
      poder: bk.poder,
      novasHabilidades: bk.novasHabilidades || ["Domínio Territorial Superior"],
      limitacoes: bk.limitacoes || "Consumo elevado de Reiryoku por turno",
      custoReiatsu: bk.custoReiatsu || "Alto",
      significadoEspiritual: bk.significadoEspiritual || dna.principioEspiritual,
      espirito: shikaiAtiva?.espirito || "Ressonância transcendental entre Shinigami e Zanpakutō.",
      foto: "assets/ichigo-moon.png"
    });
  }

  // 2. Evolução Conceitual (Revela a verdade filosófica do poder)
  opcoes.push({
    id: uid(),
    caminhoNumero: 2,
    tipoEvolucao: "Evolução Conceitual",
    nome: `${baseNome} — Shin'en Kaihō`,
    nomeCompleto: `Bankai — ${baseNome}・Shin'en Kaihō 「深淵開放」 (Liberação do Abismo Espiritual)`,
    kanji: "「深淵開放」",
    traducao: "Liberação do Abismo Espiritual",
    comando: `Bankai — ${baseNome}, Shin'en Kaihō!`,
    elemento,
    formatoArma: `O campo de batalha inteiro se sintoniza com a frequência de ${baseNome}, manifestando símbolos ancestrais flutuantes.`,
    formaMonumental: `O campo de batalha inteiro se sintoniza com a frequência de ${baseNome}, manifestando símbolos ancestrais flutuantes.`,
    conceitoEvoluido: `A habilidade da Shikai deixa de afetar apenas matéria física e passa a reger o fluxo do Reishi ambiental.`,
    poder: `Domínio de Redistribuição Absoluta: Todas as propriedades e acúmulos da Shikai são expandidos para escala territorial. O portador pode transferir instantaneamente qualquer desvantagem do combate em aceleração, dano concentrado ou anulação de feitiços inimigos.`,
    novasHabilidades: ["Transcendência de Reishi: Rompe defesas mágicas instantaneamente ao contato"],
    limitacoes: "Requer controle emocional absoluto para não dissipar o domínio",
    custoReiatsu: "Alto a Extremo",
    significadoEspiritual: "A compreensão profunda de que a espada e a alma são uma só existência.",
    espirito: shikaiAtiva?.espirito || "A alma atinge a comunhão perfeita com o espírito da lâmina.",
    foto: "assets/ichigo-moon.png"
  });

  // 3. Evolução do Personagem & Superação do Medo Central
  opcoes.push({
    id: uid(),
    caminhoNumero: 3,
    tipoEvolucao: "Evolução do Personagem (Maturidade Espiritual)",
    nome: `${baseNome} — Tenkan Gōten`,
    nomeCompleto: `Bankai — ${baseNome}・Tenkan Gōten 「天環・轟天」 (Anel Celestial do Julgamento Soberano)`,
    kanji: "「天環・轟天」",
    traducao: "Anel Celestial do Julgamento Soberano",
    comando: `Bankai — ${baseNome}, Tenkan Gōten!`,
    elemento,
    formatoArma: `Armadura de luz e aço espiritual envolve o corpo do portador, desdobrando duas lâminas monumentais com anéis orbitais.`,
    formaMonumental: `Armadura de luz e aço espiritual envolve o corpo do portador, desdobrando duas lâminas monumentais com anéis orbitais.`,
    conceitoEvoluido: `Maturidade espiritual: Superação do medo de ${dna.medoCentral}, convertendo a dúvida em proteção inabalável.`,
    poder: `Soberania da Alma Inquebrável: Cada impacto sofrido ou desferido reforça a velocidade e a densidade de corte do usuário, concedendo imunidade progressiva a atordoamentos e dissolvendo barreiras de Bakudō.`,
    novasHabilidades: ["Vórtice do Veredito: Dispara lâminas de corte dimensional guiadas por intenção"],
    limitacoes: "Não pode ser cancelada nos primeiros 3 turnos após a liberação",
    custoReiatsu: "Extremo",
    significadoEspiritual: "A realização do potencial máximo através do sacrifício e da lealdade.",
    espirito: shikaiAtiva?.espirito || "O espírito guerreiro desperta em sua forma mais nobre e temível.",
    foto: "assets/ichigo-moon.png"
  });

  return opcoes;
}

module.exports = {
  uid,
  calcularAssinaturaEspiritual,
  calcularIndiceSimilaridade,
  getClaimedSignatures,
  construirDnaEspiritual,
  gerar4CaminhosZanpakutoAI,
  gerar3OpcoesBankaiAI,
  MASTER_ZANPAKUTO_CATALOG
};
