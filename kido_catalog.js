// =========================================================================
// OFFICIAL SEIREITEI KIDŌ COMPENDIUM (HADŌ, BAKUDŌ & KAIDŌ)
// Expanded with Canonical & Lore Spells, Knowledge Costs & Reiatsu Reqs
// =========================================================================

function getKidoRequisitos(cat, num) {
  let custoConhecimento = 100;
  let pressaoMinima = 15;

  if (cat === "Hadō" || cat === "Bakudō") {
    if (num <= 10) {
      custoConhecimento = 80 + num * 15;
      pressaoMinima = 10 + num * 2;
    } else if (num <= 30) {
      custoConhecimento = 250 + (num - 10) * 30;
      pressaoMinima = 30 + (num - 10) * 4;
    } else if (num <= 60) {
      custoConhecimento = 850 + (num - 30) * 55;
      pressaoMinima = 110 + (num - 30) * 8;
    } else if (num <= 89) {
      custoConhecimento = 2500 + (num - 60) * 100;
      pressaoMinima = 350 + (num - 60) * 15;
    } else {
      // 90 to 99 (Supreme & Forbidden Spells)
      custoConhecimento = 5500 + (num - 90) * 450;
      pressaoMinima = 800 + (num - 90) * 150;
    }
  } else {
    // Kaidō Healing
    if (num <= 10) {
      custoConhecimento = 90 + num * 20;
      pressaoMinima = 15 + num * 3;
    } else if (num <= 20) {
      custoConhecimento = 320 + (num - 10) * 65;
      pressaoMinima = 50 + (num - 10) * 12;
    } else if (num <= 50) {
      custoConhecimento = 1100 + (num - 20) * 70;
      pressaoMinima = 180 + (num - 20) * 10;
    } else if (num <= 80) {
      custoConhecimento = 3200 + (num - 50) * 80;
      pressaoMinima = 480 + (num - 50) * 15;
    } else {
      custoConhecimento = 6000 + (num - 80) * 200;
      pressaoMinima = 950 + (num - 80) * 50;
    }
  }

  return { custoConhecimento, pressaoMinima };
}

const CATALOGO_KIDOS_RAW = [
  // --- HADŌ (DESTRUIÇÃO) ---
  {
    id: "h1-hibana",
    numero: 1,
    cat: "Hadō",
    nome: "Hadō #1 — Hibana (Faísca)",
    incant: "Pequena chama, desperte em minha mão.",
    desc: "Dispara uma pequena explosão de energia espiritual concentrada na ponta dos dedos.",
    custoReiatsu: 1
  },
  {
    id: "h2-rekka",
    numero: 2,
    cat: "Hadō",
    nome: "Hadō #2 — Rekka (Lâmina Flamejante)",
    incant: "Chama comprimida, torne-se lâmina e atravesse o caminho.",
    desc: "Projeta uma lâmina de energia flamejante que corta a média distância.",
    custoReiatsu: 2
  },
  {
    id: "h3-shoge",
    numero: 3,
    cat: "Hadō",
    nome: "Hadō #3 — Shōgekiha (Onda de Impacto)",
    incant: "Espírito acumulado, transforme-se em força. Avance.",
    desc: "Dispara uma onda curta e densa de pressão espiritual de impacto cinético.",
    custoReiatsu: 2
  },
  {
    id: "h4-raiko",
    numero: 4,
    cat: "Hadō",
    nome: "Hadō #4 — Byakurai (Raio Branco)",
    incant: "Céu silencioso, rasgue o horizonte com sua luz prateada.",
    desc: "Dispara um feixe concentrado e perfurante de energia elétrica em linha reta a partir do dedo indicador.",
    custoReiatsu: 3
  },
  {
    id: "h5-kazan",
    numero: 5,
    cat: "Hadō",
    nome: "Hadō #5 — Kazan (Vulcão)",
    incant: "Sob a terra existe fogo. Rompa o silêncio e desperte.",
    desc: "Projeta uma explosão ascendente de energia a partir do solo sob os pés do alvo.",
    custoReiatsu: 3
  },
  {
    id: "h6-getsumen",
    numero: 6,
    cat: "Hadō",
    nome: "Hadō #6 — Getsumen (Crescente Lunar)",
    incant: "Lua partida, desenha teu arco e corta o caminho diante de mim.",
    desc: "Dispara uma lâmina curva e cortante de pura energia espiritual.",
    custoReiatsu: 4
  },
  {
    id: "h7-enko",
    numero: 7,
    cat: "Hadō",
    nome: "Hadō #7 — Enkō (Arco Flamejante)",
    incant: "Fogo que dança no ar, siga meu gesto e avance.",
    desc: "Cria uma rajada curva e envolvente de energia flamejante.",
    custoReiatsu: 4
  },
  {
    id: "h8-retsufu",
    numero: 8,
    cat: "Hadō",
    nome: "Hadō #8 — Retsufū (Vento Violento)",
    incant: "Ar que dorme, desperte. Céu que observa, desça.",
    desc: "Dispara uma rajada concentrada de vento espiritual comprimido capaz de arremessar inimigos.",
    custoReiatsu: 4
  },
  {
    id: "h9-raimeisen",
    numero: 9,
    cat: "Hadō",
    nome: "Hadō #9 — Raimei Sen (Linha do Trovão)",
    incant: "Entre céu e terra existe apenas um instante. Atravesse-o.",
    desc: "Dispara uma linha extremamente rápida e relampejante de energia elétrica contínua.",
    custoReiatsu: 5
  },
  {
    id: "h10-gekka",
    numero: 10,
    cat: "Hadō",
    nome: "Hadō #10 — Gekka (Flor Lunar)",
    incant: "Abra suas pétalas na escuridão e faça a noite florescer.",
    desc: "Cria vários projéteis espirituais que se espalham pelo ar e convergem sobre o alvo como pétalas.",
    custoReiatsu: 5
  },
  {
    id: "h11-tsuzuri",
    numero: 11,
    cat: "Hadō",
    nome: "Hadō #11 — Tsuzuri Raiden (Leitura Relâmpago)",
    incant: "Corrente que flui no metal, percorra o fio e eletrifique a existência.",
    desc: "Conduz uma corrente elétrica potente através de qualquer objeto condutor ou arma empunhada.",
    custoReiatsu: 5
  },
  {
    id: "h12-fushibi",
    numero: 12,
    cat: "Hadō",
    nome: "Hadō #12 — Fushibi (Chama Escondida)",
    incant: "Fios invisíveis que tecem o solo, inflamem-se no momento da colisão.",
    desc: "Cria uma rede oculta de linhas de Reishi que se incendeia subitamente em uma armadilha explosiva.",
    custoReiatsu: 6
  },
  {
    id: "h20-fumi",
    numero: 20,
    cat: "Hadō",
    nome: "Hadō #20 — Fumi (Passo de Trovão)",
    incant: "Pise no abismo e faça o solo ribombar.",
    desc: "Descarrega um choque de impacto no chão que gera ondas elétricas concussivas em 360 graus.",
    custoReiatsu: 6
  },
  {
    id: "h31-shakkaho",
    numero: 31,
    cat: "Hadō",
    nome: "Hadō #31 — Shakkahō (Canhão de Fogo Vermelho)",
    incant: "Ó senhor! Máscara de carne e osso, toda a criação, o bater de asas, aquele que ostenta o nome do Homem! Na parede de chamas escarlates, grave o grande lótus no topo dos céus ardentes!",
    desc: "Dispara uma esfera massiva de chamas carmesim altamente destrutiva contra o alvo.",
    custoReiatsu: 7
  },
  {
    id: "h32-okisen",
    numero: 32,
    cat: "Hadō",
    nome: "Hadō #32 — Ōkisen (Lampejo Dourado)",
    incant: "Luz amarela que rasga o horizonte, faça brilhar a tempestade solar.",
    desc: "Dispara uma lâmina horizontal em forma de arco dourado de alta velocidade e poder de cisalhamento.",
    custoReiatsu: 7
  },
  {
    id: "h33-sokatsui",
    numero: 33,
    cat: "Hadō",
    nome: "Hadō #33 — Sōkatsui (Chuva Azul do Vazio)",
    incant: "Ó senhor! Máscara de carne e osso, toda a criação, o bater de asas, aquele que ostenta o nome do Homem! Verdade e temperança, sobre as paredes do pecado sem culpa, solte tuas garras!",
    desc: "Dispara uma poderosa torrente torrencial de chamas azuis com amplo raio de destruição em cone.",
    custoReiatsu: 8
  },
  {
    id: "h40-shinren",
    numero: 40,
    cat: "Hadō",
    nome: "Hadō #40 — Shinren (Lótus da Verdade)",
    incant: "Queime a ilusão e revele a essência do espírito.",
    desc: "Manifesta três orbes concêntricos de fogo espiritual que colidem em cadeia provocando combustão contínua.",
    custoReiatsu: 8
  },
  {
    id: "h54-haien",
    numero: 54,
    cat: "Hadō",
    nome: "Hadō #54 — Haien (Chama Extintora)",
    incant: "Queime até que nada reste, nem mesmo as cinzas do nome.",
    desc: "Dispara uma chama roxa obliviante que incinera completamente a matéria e a energia do alvo em contato.",
    custoReiatsu: 9
  },
  {
    id: "h58-tenran",
    numero: 58,
    cat: "Hadō",
    nome: "Hadō #58 — Tenran (Orquídea Silenciosa)",
    incant: "Gire, furacão dos céus, e devore tudo à sua frente.",
    desc: "Gera um tornado devastador em vórtice cônico a partir da Zanpakutō que arremessa e dilacera estruturas.",
    custoReiatsu: 9
  },
  {
    id: "h63-raikoho",
    numero: 63,
    cat: "Hadō",
    nome: "Hadō #63 — Raikōhō (Canhão do Rugido do Trovão)",
    incant: "Salpique nos ossos da besta! Torre afiada, cristal vermelho, anel de aço. Mova-se e torne-se o vento, pare e torne-se a calma. O som das lanças que se chocam enche o castelo vazio!",
    desc: "Dispara uma gigantesca e ensurdecedora coluna de eletricidade dourada de poder catastrófico.",
    custoReiatsu: 10
  },
  {
    id: "h73-soren-sokatsui",
    numero: 73,
    cat: "Hadō",
    nome: "Hadō #73 — Sōren Sōkatsui (Chuva Azul Gêmea do Vazio)",
    incant: "Máscara de carne e osso, toda criação, o bater de asas, aquele que ostenta o nome do Homem! Na parede de chamas azuis, una a coroa dupla nos céus do abismo!",
    desc: "Versão duplicada e exponencial do Sōkatsui, disparada com ambas as mãos em uma onda colossal de fogo azul.",
    custoReiatsu: 12
  },
  {
    id: "h78-zangerin",
    numero: 78,
    cat: "Hadō",
    nome: "Hadō #78 — Zangerin (Anel Cortante)",
    incant: "Lâminas concêntricas da destruição, girem até cortar o próprio espaço.",
    desc: "Gera e arremessa dezenas de anéis de energia cortante altamente afiados que despedaçam defesas sólidas.",
    custoReiatsu: 13
  },
  {
    id: "h88-hiryu",
    numero: 88,
    cat: "Hadō",
    nome: "Hadō #88 — Hiryū Gekizoku Shinten Raihō (Canhão do Trovão do Dragão Voador)",
    incant: "Dragão dos céus relampejantes, desça com a fúria da tempestade primordial e engula a terra!",
    desc: "Dispara um feixe colossal de energia elétrica pura com a forma de um dragão que desintegra defesas em escala de montanha.",
    custoReiatsu: 15
  },
  {
    id: "h90-kurohitsugi",
    numero: 90,
    cat: "Hadō",
    nome: "Hadō #90 — Kurohitsugi (Sarcófago Negro)",
    incant: "Transborde, criatura da loucura! Vaso de orgulho oculto! Ferva, negue, entorpeça, pisque, perturbe o sono! A princesa rastejante de ferro! A boneca de lama autodestrutiva! Junte-se! Oponha-se! Preencha a terra e conheça sua própria impotência!",
    desc: "Cria uma imensa caixa negra de gravidade distorcida que empala o inimigo com centenas de lanças de Reishi em um colapso gravitacional.",
    custoReiatsu: 18
  },
  {
    id: "h91-senju",
    numero: 91,
    cat: "Hadō",
    nome: "Hadō #91 — Senju Kōten Taihō (Canhão das Mil Mãos do Céu Brilhante)",
    incant: "Limite das mil mãos, mão da escuridão não tocada pelo brilho, mão que não reflete o céu! O caminho que espalha a luz, o vento que sopra a chama! Não hesite, obedeça ao meu comando! Balas de luz, oito corpos, nove tiras, livro das dez relíquias, anel do relâmpago, roda do mundo, chama vermelha, canhão estelar!",
    desc: "Gera dez pontas de lança de energia pura ao redor do conjurador que convergem em uma saraivada aniquiladora sobre o alvo.",
    custoReiatsu: 20
  },
  {
    id: "h96-itto-kaso",
    numero: 96,
    cat: "Hadō",
    nome: "Hadō #96 — Ittō Kasō (Cremação de Espada Solitária)",
    incant: "Feitiço Proibido. Sacrifício do próprio corpo como catalisador de destruição absoluta.",
    desc: "Uma pilar titânico de chamas vermelhas em forma de lâmina de katana que se ergue do solo incinerando tudo em seu rastro.",
    custoReiatsu: 25
  },
  {
    id: "h99-goryutenbo",
    numero: 99,
    cat: "Hadō",
    nome: "Hadō #99 — Goryūtenbō (Cinco Dragões da Destruição Voraz)",
    incant: "Feitiço Supremo do Seireitei. O ápice inquestionável da arte da destruição espiritual.",
    desc: "Invoca cinco gigantescos dragões de pura energia espiritual que emergem da terra devorando toda a Reiatsu do ambiente e aniquilando exércitos.",
    custoReiatsu: 30
  },

  // --- BAKUDŌ (APRISIONAMENTO & DEFESA) ---
  {
    id: "b1-sai",
    numero: 1,
    cat: "Bakudō",
    nome: "Bakudō #1 — Sai (Restrição)",
    incant: "Prenda os braços e curve a intenção.",
    desc: "Imobiliza os braços do oponente atrás das costas com uma força invisível de Reishi comprimido.",
    custoReiatsu: 1
  },
  {
    id: "b4-hainawa",
    numero: 4,
    cat: "Bakudō",
    nome: "Bakudō #4 — Hainawa (Corda Rastejante)",
    incant: "Corda que não se vê, enlace o caminho e prenda o passo.",
    desc: "Lança uma corda de energia luminosa e flexível que se enrola firmemente nos membros do oponente.",
    custoReiatsu: 2
  },
  {
    id: "b8-seki",
    numero: 8,
    cat: "Bakudō",
    nome: "Bakudō #8 — Seki (Repulsão)",
    incant: "Escudo circular, rejeite o toque e empurre a ameaça.",
    desc: "Gera um escudo redondo de energia no punho que repele ataques físicos e atordoa o atacante.",
    custoReiatsu: 2
  },
  {
    id: "b9-geki",
    numero: 9,
    cat: "Bakudō",
    nome: "Bakudō #9 — Geki (Golpe Paralisante)",
    incant: "Desintegre-se, cão negro de Rondanini! Olhe para si mesmo com pavor e rasgue a própria garganta!",
    desc: "Envolve o alvo em uma aura vermelha brilhante que paralisa completamente suas articulações e sistema nervoso.",
    custoReiatsu: 3
  },
  {
    id: "b9-horin",
    numero: 9,
    cat: "Bakudō",
    nome: "Bakudō #9 — Hōrin (Anel Desintegrador)",
    incant: "Desintegre-se, cão negro de Rondanini! Torne-se a corda da prisão!",
    desc: "Dispara uma teia de feixes de luz laranja a partir dos dedos que prende e eletrocuta o alvo com Reishi condensado.",
    custoReiatsu: 3
  },
  {
    id: "b21-sekienton",
    numero: 21,
    cat: "Bakudō",
    nome: "Bakudō #21 — Sekienton (Fumaça Vermelha Ocultante)",
    incant: "Fumaça carmesim, cubra a visão e apague o rastro.",
    desc: "Dispara uma densa cortina de fumaça vermelha espiritual do solo que mascara presença e cega os arredores.",
    custoReiatsu: 4
  },
  {
    id: "b26-kyokko",
    numero: 26,
    cat: "Bakudō",
    nome: "Bakudō #26 — Kyokkō (Luz Curva)",
    incant: "Curve a luz ao redor da forma e esconda a essência.",
    desc: "Refrata a luz ao redor do usuário, tornando-o completamente invisível a olhos nus e camuflando sua assinatura de Reiatsu.",
    custoReiatsu: 5
  },
  {
    id: "b30-shitotsu",
    numero: 30,
    cat: "Bakudō",
    nome: "Bakudō #30 — Shitotsu Sanshin (Três Pontas Radiantes)",
    incant: "Grave os três cantos do triângulo e tranque o movimento.",
    desc: "Dispara três estacas afiadas de luz que prendem os braços e o tronco do alvo contra paredes ou o solo em formato triangular.",
    custoReiatsu: 6
  },
  {
    id: "b37-tsuriboshi",
    numero: 37,
    cat: "Bakudō",
    nome: "Bakudō #37 — Tsuriboshi (Estrela Suspensa)",
    incant: "Estrela do firmamento, estenda teus laços e sustente o peso.",
    desc: "Cria uma rede elástica de Reishi em forma de estrela ancorada em seis pontos capaz de amortecer quedas de grande impacto.",
    custoReiatsu: 6
  },
  {
    id: "b39-enkosen",
    numero: 39,
    cat: "Bakudō",
    nome: "Bakudō #39 — Enkōsen (Escudo Giratório)",
    incant: "Gire, disco de Reishi, e bloqueie o corte que se aproxima.",
    desc: "Materializa um escudo circular condensado e translúcido de energia espiritual diante do usuário capaz de bloquear golpes pesados.",
    custoReiatsu: 7
  },
  {
    id: "b58-kakushitsujaku",
    numero: 58,
    cat: "Bakudō",
    nome: "Bakudō #58 — Kakushitsujaku (Pardal Oculto)",
    incant: "Coração do sul, olho do norte, dedo do leste, calcanhar do oeste. Reúnam-se e alcancem o horizonte!",
    desc: "Rastreia e localiza a assinatura exata de Reiatsu de qualquer indivíduo em um raio de dezenas de quilômetros.",
    custoReiatsu: 8
  },
  {
    id: "b61-rikujokoro",
    numero: 61,
    cat: "Bakudō",
    nome: "Bakudō #61 — Rikujōkōrō (Prisão de Seis Bastões de Luz)",
    incant: "Carruagem do trovão, ponte da roda giratória, com luz divida isto em seis!",
    desc: "Invoca seis feixes de luz rígidos e brilhantes que cravam na cintura do alvo, paralisando completamente seus movimentos e fluxo de Reishi.",
    custoReiatsu: 9
  },
  {
    id: "b62-hyapporankan",
    numero: 62,
    cat: "Bakudō",
    nome: "Bakudō #62 — Hyapporankan (Cem Hastes Trancadas)",
    incant: "Multiplique-se em cem pontas e crave a terra sem deixar fresta!",
    desc: "O usuário arremessa uma haste luminosa que se divide em uma chuva de cem estacas de contenção prendendo o alvo no solo.",
    custoReiatsu: 9
  },
  {
    id: "b63-sajo-sabaku",
    numero: 63,
    cat: "Bakudō",
    nome: "Bakudō #63 — Sajō Sabaku (Correntes da Prisão de Areia)",
    incant: "Correntes de ferro espiritual, apertem o corpo e restrinjam a alma.",
    desc: "Materializa grossas correntes douradas de Reishi que envolvem o corpo do inimigo do pescoço aos pés impedindo qualquer reação física.",
    custoReiatsu: 10
  },
  {
    id: "b73-tozansho",
    numero: 73,
    cat: "Bakudō",
    nome: "Bakudō #73 — Tozanshō (Pirâmide Invertida de Refúgio)",
    incant: "Erga os quatro cantos e sele o espaço sob a cúpula inviolável.",
    desc: "Gera uma gigantesca barreira em formato de pirâmide invertida para proteção de grupos ou contenção de explosões de alta intensidade.",
    custoReiatsu: 11
  },
  {
    id: "b75-gochutekkan",
    numero: 75,
    cat: "Bakudō",
    nome: "Bakudō #75 — Gochūtekkan (Cinco Pilares de Aço)",
    incant: "Paredes de areia de ferro, torre de cinco andares, fumaça ardente. Cinco pilares de aço, desçam e prendam o dragão!",
    desc: "Invoca cinco colossais pilares de ferro espiritual ligados por correntes pesadas que caem do céu esmagando e imobilizando o alvo.",
    custoReiatsu: 12
  },
  {
    id: "b77-tenteikura",
    numero: 77,
    cat: "Bakudō",
    nome: "Bakudō #77 — Tenteikūra (Rede Celestial de Transmissão)",
    incant: "Rede preta e branca! Vinte e dois canais! Cinquenta e sete anéis de ferro! Sons que ecoam na escuridão, transmitam a mensagem para além do horizonte!",
    desc: "Conecta telepaticamente a mente do conjurador a múltiplos alvos simultâneos transmitindo mensagens de voz e coordenadas táticas.",
    custoReiatsu: 12
  },
  {
    id: "b79-kuyo-shibari",
    numero: 79,
    cat: "Bakudō",
    nome: "Bakudō #79 — Kuyō Shibari (Nove Armadilhas Solares)",
    incant: "Nove sóis do firmamento, cerquem o vazio e tranquem a respiração.",
    desc: "Manifesta nove orbes de buracos negros de Reishi que cercam o oponente em 360 graus travando toda a sua musculatura e circulação espiritual.",
    custoReiatsu: 14
  },
  {
    id: "b81-danku",
    numero: 81,
    cat: "Bakudō",
    nome: "Bakudō #81 — Dankū (Corte no Vazio)",
    incant: "Parede translúcida que separa os mundos. Nenhuma destruição abaixo de oitenta e nove tocará este espaço.",
    desc: "Cria uma parede retangular de energia que bloqueia e anula completamente qualquer Hadō de nível 89 ou inferior.",
    custoReiatsu: 15
  },
  {
    id: "b99-kin",
    numero: 99,
    cat: "Bakudō",
    nome: "Bakudō #99 — Kin (Selo Proibido Parte 1)",
    incant: "Feitiço Supremo de Aprisionamento. Primeira Canção: Shiryū (Corrente da Paralisia).",
    desc: "Prende os braços do oponente com tiras de tecido espiritual reforçadas por estacas de ferro nos membros.",
    custoReiatsu: 20
  },
  {
    id: "b99-bankin",
    numero: 99,
    cat: "Bakudō",
    nome: "Bakudō #99 — Bankin (Grande Selo Final Parte 2)",
    incant: "Primeira Canção: Shiryū (Faixas Espirituais)! Segunda Canção: Hyakurensan (Cem Pregos de Ferro)! Canção Final: Bankin Taihō (Monólito Esmagador da Eternidade)!",
    desc: "O ápice do aprisionamento: envolve o alvo em faixas mágicas, crava cem parafusos de aço espiritual e esmaga o ser sob um monólito titânico.",
    custoReiatsu: 25
  },

  // --- KAIDŌ (CURA & SUPORTE ESPIRITUAL) ---
  {
    id: "k1-chiyaku",
    numero: 1,
    cat: "Kaidō",
    nome: "Kaidō #1 — Chiyaku (Remédio Calmante)",
    incant: "Acalme a respiração e tranquilize a agitação do espírito.",
    desc: "Restaura o fôlego espiritual e ameniza dores leves de combate superficial.",
    custoReiatsu: 2
  },
  {
    id: "k6-seika",
    numero: 6,
    cat: "Kaidō",
    nome: "Kaidō #6 — Seika (Purificação)",
    incant: "Aquilo que não pertence ao corpo, deixe-o. Aquilo que pertence, permaneça.",
    desc: "Remove toxinas, venenos e impurezas espirituais retidas nos tecidos.",
    custoReiatsu: 4
  },
  {
    id: "k9-kekkai-seimei",
    numero: 9,
    cat: "Kaidō",
    nome: "Kaidō #9 — Kekkai Seimei (Barreira Vital)",
    incant: "Erga-se ao redor da vida. Não permita que a ferida avance.",
    desc: "Cria um selo estéril ao redor do ferimento, estancando hemorragias e impedindo infecções.",
    custoReiatsu: 5
  },
  {
    id: "k10-chiyu",
    numero: 10,
    cat: "Kaidō",
    nome: "Kaidō #10 — Chiyu (Cura Celular)",
    incant: "Corpo ferido, espírito cansado. Reúna aquilo que ainda permanece.",
    desc: "Acelera significativamente a regeneração de ferimentos moderados e lacerações de lâmina.",
    custoReiatsu: 5
  },
  {
    id: "k15-meimei",
    numero: 15,
    cat: "Kaidō",
    nome: "Kaidō #15 — Meimei (Pulso de Vida)",
    incant: "Enquanto houver chama, haverá caminho. Enquanto houver espírito, haverá retorno.",
    desc: "Estabiliza emergencialmente pacientes à beira da derrota ou inconsciência reanimando o fluxo do Hakusui.",
    custoReiatsu: 7
  },
  {
    id: "k16-hikari-ito",
    numero: 16,
    cat: "Kaidō",
    nome: "Kaidō #16 — Hikari no Ito (Fios de Luz Cirúrgica)",
    incant: "Fios de luz, atravessem a ferida. Unam aquilo que foi separado.",
    desc: "Tecelagem cirúrgica de Reishi que sutura músculos, vasos sanguíneos e tendões rompidos.",
    custoReiatsu: 8
  },
  {
    id: "k20-shomei",
    numero: 20,
    cat: "Kaidō",
    nome: "Kaidō #20 — Shōmei Seikai (Luz da Vida)",
    incant: "Luz que atravessa corpo e alma, encontre aquilo que ainda pode ser salvo.",
    desc: "Regenera tecidos profundos e fraturas ósseas estabilizando ferimentos graves.",
    custoReiatsu: 10
  },
  {
    id: "k30-sosho",
    numero: 30,
    cat: "Kaidō",
    nome: "Kaidō #30 — Sōshō Kōkei (Regeneração Tecidual Avançada)",
    incant: "Fluxo verdejante da alma, reconstrua a carne e purifique as cicatrizes.",
    desc: "Restaura grandes perdas musculares e queimaduras espirituais severas restaurando a mobilidade do combatente.",
    custoReiatsu: 12
  },
  {
    id: "k50-hansho",
    numero: 50,
    cat: "Kaidō",
    nome: "Kaidō #50 — Hanshō no Ibuki (Sopro da Reanimação Celular)",
    incant: "Desperte a semente do espírito nos confins do corpo exausto.",
    desc: "Restaura membros paralisados por veneno ou choque de Reiatsu restabelecendo 60% da vitalidade total.",
    custoReiatsu: 15
  },
  {
    id: "k70-saisei",
    numero: 70,
    cat: "Kaidō",
    nome: "Kaidō #70 — Saisei no Izumi (Fonte da Ressonância Regenerativa)",
    incant: "Fonte eterna do Seireitei, regenere a fibra da alma e feche o abismo da morte.",
    desc: "Regenera órgãos internos e repara danos críticos de Bankai ou perfurações fatais.",
    custoReiatsu: 18
  },
  {
    id: "k90-shokatsu",
    numero: 90,
    cat: "Kaidō",
    nome: "Kaidō #90 — Shōkatsu Rinne (Milagre da Recomposição da Alma)",
    incant: "Ápice supremo do Kaidō. Transcendência médica da 4ª Divisão. A vida sobrepuja o fim.",
    desc: "Restaura completamente o paciente do estado 'Derrotado' ou 'Debilitado' para 'Inteiro', reconstituindo circulação e tecido espiritual por completo.",
    custoReiatsu: 24
  }
];

// Enrich every kido with calculated knowledge cost & minimum spiritual pressure
const CATALOGO_KIDOS = CATALOGO_KIDOS_RAW.map(k => {
  const reqs = getKidoRequisitos(k.cat, k.numero);
  return {
    ...k,
    custoConhecimento: k.custoConhecimento || reqs.custoConhecimento,
    pressaoMinima: k.pressaoMinima || reqs.pressaoMinima
  };
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATALOGO_KIDOS, getKidoRequisitos };
}
