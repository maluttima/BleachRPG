// =========================================================================
// BLEACH RPG — MASTER KIDŌ & GRIMOIRE CATALOG (75+ SPELLS)
// =========================================================================

const CATALOGO_KIDOS = [
  // -----------------------------------------------------------------------
  // 📕 BAKUDŌ (Feitiços de Contenção, Defesa, Imobilização e Selamento)
  // -----------------------------------------------------------------------
  {
    id: "b1_u",
    numero: 1,
    nome: "Bakudō #1 — Kusari no Yume (Correntes do Sonho)",
    cat: "Bakudō",
    custoReiatsu: 2,
    nivel: "Básico",
    desc: "Cria correntes espirituais que se enrolam ao redor dos membros do alvo, dificultando seus movimentos.",
    incant: "Do vazio desperte, corrente que não conhece fuga. Envolva o alvo e silencie seus passos."
  },
  {
    id: "b1_c",
    numero: 1,
    nome: "Bakudō #1 — Sai (Obstrução)",
    cat: "Bakudō",
    custoReiatsu: 2,
    nivel: "Básico",
    desc: "Prende os braços do alvo atrás das costas com uma força magnética invisível.",
    incant: "—"
  },
  {
    id: "b2",
    numero: 2,
    nome: "Bakudō #2 — Shizukesa (Silêncio)",
    cat: "Bakudō",
    custoReiatsu: 2,
    nivel: "Básico",
    desc: "Cria uma pequena área onde sons são fortemente abafados, impedindo escuta e comunicação.",
    incant: "Que a voz desapareça, que o som se perca, que o silêncio ocupe este espaço."
  },
  {
    id: "b3",
    numero: 3,
    nome: "Bakudō #3 — Kōri no Kusari (Correntes de Gelo)",
    cat: "Bakudō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Forma correntes espirituais rígidas de frio gélido que prendem os membros do alvo.",
    incant: "Frio que nasce da alma, cristalize o caminho daquele que diante de mim permanece."
  },
  {
    id: "b4_u",
    numero: 4,
    nome: "Bakudō #4 — Kabe (Muralha)",
    cat: "Bakudō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Cria uma barreira espiritual frontal capaz de bloquear ataques físicos e feitiços leves.",
    incant: "Terra sem forma, céu sem fim. Erga-se diante de mim e torne-se barreira."
  },
  {
    id: "b4_c",
    numero: 4,
    nome: "Bakudō #4 — Hainawa (Corda de Rastejamento)",
    cat: "Bakudō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Gera uma corda de energia crepitante amarela que amarra o corpo e os pulsos do oponente.",
    incant: "—"
  },
  {
    id: "b5",
    numero: 5,
    nome: "Bakudō #5 — Meikyū (Labirinto)",
    cat: "Bakudō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Distorce a percepção espacial do alvo, dificultando sua orientação e senso de direção.",
    incant: "Caminho se torne caminho nenhum. Direção se perca. Prenda o viajante em seu próprio passo."
  },
  {
    id: "b6",
    numero: 6,
    nome: "Bakudō #6 — Hikari Ito (Fios de Luz)",
    cat: "Bakudō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Cria fios luminosos no ar que podem prender objetos em queda, projéteis ou membros do alvo.",
    incant: "Mil fios atravessam o espaço. Prendam aquilo que minha visão alcançar."
  },
  {
    id: "b7",
    numero: 7,
    nome: "Bakudō #7 — Kekkai (Barreira Circular)",
    cat: "Bakudō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Forma uma barreira circular curta ao redor do usuário para amortecer investidas corpo a corpo.",
    incant: "Entre mim e o perigo, estabeleça-se a fronteira."
  },
  {
    id: "b8_u",
    numero: 8,
    nome: "Bakudō #8 — Kagebari (Agulhas da Sombra)",
    cat: "Bakudō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Cria pequenas estacas espirituais que prendem temporariamente o alvo ao chão ou a uma superfície.",
    incant: "Sombra que acompanha todo ser, transforme-se em agulha e fixe aquilo que ela toca."
  },
  {
    id: "b8_c",
    numero: 8,
    nome: "Bakudō #8 — Seki (Repulsão)",
    cat: "Bakudō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Cria um escudo redondo e brilhante no antebraço que repele projéteis e atordoa o atacante.",
    incant: "—"
  },
  {
    id: "b9",
    numero: 9,
    nome: "Bakudō #9 — Fūsa (Selamento Articular)",
    cat: "Bakudō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Cria uma marca espiritual que dificulta e trava determinado movimento ou postura do alvo.",
    incant: "Feche a passagem, cerre o caminho, faça do movimento uma lembrança."
  },
  {
    id: "b10",
    numero: 10,
    nome: "Bakudō #10 — Hagane Ori (Gaiola de Aço)",
    cat: "Bakudō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Cria uma gaiola espiritual cúbica de barras de energia densa ao redor de um alvo.",
    incant: "Quatro lados, quatro limites. Ergam-se e aprisionem aquilo que está dentro."
  },
  {
    id: "b11",
    numero: 11,
    nome: "Bakudō #11 — Kōsen (Linha de Luz)",
    cat: "Bakudō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Cria uma linha espiritual luminosa que funciona como uma barreira linear intransponível.",
    incant: "Uma linha separa o mundo. Que ninguém atravesse sua fronteira."
  },
  {
    id: "b12",
    numero: 12,
    nome: "Bakudō #12 — Jūryoku (Peso Gravitacional)",
    cat: "Bakudō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Aumenta temporariamente a pressão espiritual sobre um alvo, tornando seus movimentos mais pesados.",
    incant: "O céu desça, a terra se levante. Faça o corpo lembrar o peso de existir."
  },
  {
    id: "b13",
    numero: 13,
    nome: "Bakudō #13 — Mizu Kagami (Espelho d'Água)",
    cat: "Bakudō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Cria uma superfície espiritual translúcida capaz de refletir imagens, movimentos e feitiços leves.",
    incant: "Água que não corre, superfície que não quebra. Mostre aquilo que diante de ti permanece."
  },
  {
    id: "b14",
    numero: 14,
    nome: "Bakudō #14 — Tōmei Kabe (Muralha Transparente)",
    cat: "Bakudō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Cria uma barreira completamente invisível que surpreende atacantes em alta velocidade.",
    incant: "Aquilo que os olhos não encontram ainda pode permanecer de pé. Erga-se."
  },
  {
    id: "b15",
    numero: 15,
    nome: "Bakudō #15 — Shibari no Kage (Prisão da Sombra)",
    cat: "Bakudō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Prende parcialmente o alvo à própria sombra, impedindo saltos e translocações por Shunpo.",
    incant: "A sombra nasce dos pés e retorna aos pés. Que nenhuma distância seja suficiente para escapar."
  },
  {
    id: "b16",
    numero: 16,
    nome: "Bakudō #16 — Rasen Kusari (Corrente Espiral)",
    cat: "Bakudō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Uma corrente espiritual gira ao redor do alvo e restringe progressivamente seus movimentos.",
    incant: "Gire, envolva, aperte. Quanto mais o prisioneiro luta, mais próximo fica o círculo."
  },
  {
    id: "b17",
    numero: 17,
    nome: "Bakudō #17 — Hakujō (Manto Branco)",
    cat: "Bakudō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Forma uma camada espiritual protetora e amortecedora sobre o corpo do usuário ou de um aliado.",
    incant: "Cubra aquilo que desejo proteger. Torne-se abrigo contra o impacto."
  },
  {
    id: "b18",
    numero: 18,
    nome: "Bakudō #18 — Tenmon (Portão Celestial)",
    cat: "Bakudō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Cria uma barreira seletiva que permite apenas a passagem de pessoas autorizadas pelo conjurador.",
    incant: "Entre dois mundos existe uma porta. Que ela se abra apenas diante daquele que reconheço."
  },
  {
    id: "b19",
    numero: 19,
    nome: "Bakudō #19 — Metsubō no Ori (Gaiola da Ruína)",
    cat: "Bakudō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Cria várias camadas de barreiras prismáticas concêntricas ao redor de um alvo em fuga.",
    incant: "Círculo sobre círculo, parede sobre parede. Fechem-se sobre aquele que ousa permanecer."
  },
  {
    id: "b20",
    numero: 20,
    nome: "Bakudō #20 — Hyakuren Kekkai (Barreira das Cem Camadas)",
    cat: "Bakudō",
    custoReiatsu: 8,
    nivel: "Intermediário",
    desc: "Forma múltiplas camadas de barreiras espirituais sobrepostas para absorver impactos devastadores.",
    incant: "Que cada camada seja uma muralha, que cada muralha seja uma promessa. Ergam-se e resistam."
  },
  {
    id: "b26",
    numero: 26,
    nome: "Bakudō #26 — Kyokkō (Luz Curvada)",
    cat: "Bakudō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Dobra a luz e a percepção de Reiatsu ao redor do usuário, tornando-o completamente invisível.",
    incant: "—"
  },
  {
    id: "b39",
    numero: 39,
    nome: "Bakudō #39 — Enkōsen (Escudo Giratório de Lótus)",
    cat: "Bakudō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Cria um escudo condensado de energia rotatória para absorver ataques diretos e projéteis.",
    incant: "—"
  },
  {
    id: "b61",
    numero: 61,
    nome: "Bakudō #61 — Rikujō Kōrō (Prisão das Seis Varas de Luz)",
    cat: "Bakudō",
    custoReiatsu: 12,
    nivel: "Avançado",
    desc: "Seis lâminas reluzentes de luz dourada perfuram a cintura do alvo, paralisando-o totalmente.",
    incant: "Carruagem do trovão, ponte da roda giratória, com a luz dividida em seis!"
  },
  {
    id: "b62",
    numero: 62,
    nome: "Bakudō #62 — Hyapporankan (Cem Estacas de Luz)",
    cat: "Bakudō",
    custoReiatsu: 13,
    nivel: "Avançado",
    desc: "Uma vara de luz se multiplica em uma centena de estacas lançadas para cravar o oponente no chão.",
    incant: "—"
  },
  {
    id: "b75",
    numero: 75,
    nome: "Bakudō #75 — Gochūtekkan (Cinco Pilares de Ferro)",
    cat: "Bakudō",
    custoReiatsu: 16,
    nivel: "Mestre",
    desc: "Invoca cinco gigantescos pilares de ferro conectados por correntes que esmagam e selam o alvo.",
    incant: "Muralha de areia de ferro, torre de monge, lâmpada de ferro incandescente!"
  },
  {
    id: "b81",
    numero: 81,
    nome: "Bakudō #81 — Dankū (Fenda de Ar)",
    cat: "Bakudō",
    custoReiatsu: 18,
    nivel: "Mestre",
    desc: "Ergue uma barreira translúcida gigantesca que anula completamente qualquer Hadō até o #89.",
    incant: "—"
  },
  {
    id: "b99",
    numero: 99,
    nome: "Bakudō #99 — Kin / Bankin (Grande Selamento)",
    cat: "Bakudō",
    custoReiatsu: 25,
    nivel: "Classe Especial",
    desc: "O selamento supremo em três canções: ataduras espirituais, estacas de aço e bloco monumental.",
    incant: "Primeira Canção: Shiryū! Segunda Canção: Hyakurenzan! Canção Final: Bankin Taihō!"
  },

  // -----------------------------------------------------------------------
  // 🔥 HADŌ (Feitiços Ofensivos e de Destruição Espiritual)
  // -----------------------------------------------------------------------
  {
    id: "h1_u",
    numero: 1,
    nome: "Hadō #1 — Hibana (Faísca)",
    cat: "Hadō",
    custoReiatsu: 2,
    nivel: "Básico",
    desc: "Dispara uma pequena explosão concentrada de energia espiritual a partir da ponta dos dedos.",
    incant: "Pequena chama, desperte em minha mão."
  },
  {
    id: "h1_c",
    numero: 1,
    nome: "Hadō #1 — Shō (Empurrão Cinético)",
    cat: "Hadō",
    custoReiatsu: 2,
    nivel: "Básico",
    desc: "Dispara uma força cinética invisível a partir da ponta do dedo para repelir alvos e projéteis.",
    incant: "—"
  },
  {
    id: "h2",
    numero: 2,
    nome: "Hadō #2 — Rekka (Lâmina Flamejante)",
    cat: "Hadō",
    custoReiatsu: 2,
    nivel: "Básico",
    desc: "Projeta uma lâmina de energia flamejante que corta o ar em média distância.",
    incant: "Chama comprimida, torne-se lâmina e atravesse o caminho."
  },
  {
    id: "h3",
    numero: 3,
    nome: "Hadō #3 — Shōgekiha (Onda de Impacto)",
    cat: "Hadō",
    custoReiatsu: 2,
    nivel: "Básico",
    desc: "Dispara uma onda curta de pressão espiritual de impacto contundente.",
    incant: "Espírito acumulado, transforme-se em força. Avance."
  },
  {
    id: "h4_u",
    numero: 4,
    nome: "Hadō #4 — Raikō (Luz Trovejante)",
    cat: "Hadō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Dispara um feixe concentrado de energia elétrica que viaja em linha reta.",
    incant: "Céu silencioso, rasgue o horizonte com sua luz."
  },
  {
    id: "h4_c",
    numero: 4,
    nome: "Hadō #4 — Byakurai (Raio Branco)",
    cat: "Hadō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Dispara um raio concentrado de eletricidade branca perfurante a partir do dedo indicador.",
    incant: "—"
  },
  {
    id: "h5",
    numero: 5,
    nome: "Hadō #5 — Kazan (Vulcão)",
    cat: "Hadō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Projeta uma erupção de energia térmica para cima a partir do solo sob o alvo.",
    incant: "Sob a terra existe fogo. Rompa o silêncio e desperte."
  },
  {
    id: "h6",
    numero: 6,
    nome: "Hadō #6 — Getsumen (Crescente Lunar)",
    cat: "Hadō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Dispara uma lâmina curva de energia espiritual em formato de foice lunar.",
    incant: "Lua partida, desenha teu arco e corta o caminho diante de mim."
  },
  {
    id: "h7",
    numero: 7,
    nome: "Hadō #7 — Enkō (Arco Flamejante)",
    cat: "Hadō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Cria uma rajada curva de energia flamejante que contorna obstáculos.",
    incant: "Fogo que dança no ar, siga meu gesto e avance."
  },
  {
    id: "h8",
    numero: 8,
    nome: "Hadō #8 — Retsufū (Vento Violento)",
    cat: "Hadō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Dispara uma rajada de vento espiritual comprimido capaz de arremessar adversários.",
    incant: "Ar que dorme, desperte. Céu que observa, desça."
  },
  {
    id: "h9",
    numero: 9,
    nome: "Hadō #9 — Raimei Sen (Linha do Trovão)",
    cat: "Hadō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Dispara uma linha instantânea e extremamente rápida de energia elétrica perfurante.",
    incant: "Entre céu e terra existe apenas um instante. Atravesse-o."
  },
  {
    id: "h10",
    numero: 10,
    nome: "Hadō #10 — Gekka (Flor Lunar)",
    cat: "Hadō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Cria vários projéteis espirituais que se espalham como pétalas cortantes no ar.",
    incant: "Abra suas pétalas na escuridão e faça a noite florescer."
  },
  {
    id: "h11_u",
    numero: 11,
    nome: "Hadō #11 — Enjin (Lâmina de Fogo)",
    cat: "Hadō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Reveste uma arma ou membro com energia flamejante de alto poder de incineração.",
    incant: "Fogo que não precisa de combustível, transforme minha intenção em corte."
  },
  {
    id: "h11_c",
    numero: 11,
    nome: "Hadō #11 — Tsuzuri Raiden (Raio Conduzido)",
    cat: "Hadō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Canaliza uma corrente elétrica através de qualquer objeto condutor ou lâmina de Zanpakutō.",
    incant: "—"
  },
  {
    id: "h12",
    numero: 12,
    nome: "Hadō #12 — Shōten (Ascensão)",
    cat: "Hadō",
    custoReiatsu: 5,
    nivel: "Intermediário",
    desc: "Libera uma coluna vertical colossal de energia espiritual que eleva e quebra o solo.",
    incant: "Suba, energia que dorme abaixo do mundo."
  },
  {
    id: "h13",
    numero: 13,
    nome: "Hadō #13 — Kōha (Onda Carmesim)",
    cat: "Hadō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Projeta uma maré maciça de energia espiritual vermelha em cone frontal.",
    incant: "Vermelho que nasce do espírito, avance como maré."
  },
  {
    id: "h14",
    numero: 14,
    nome: "Hadō #14 — Rasenka (Flor Espiral)",
    cat: "Hadō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Dispara um projétil espiral perfurante de energia concentrada em rotação.",
    incant: "Gire, comprima, floresça. Transforme o caos em uma única direção."
  },
  {
    id: "h15",
    numero: 15,
    nome: "Hadō #15 — Hōkō (Rugido Espiritual)",
    cat: "Hadō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Libera uma poderosa onda sonora e espiritual que atordoa e repele múltiplos atacantes.",
    incant: "Que minha voz atravesse o céu. Que meu espírito responda com força."
  },
  {
    id: "h16",
    numero: 16,
    nome: "Hadō #16 — Kagerō (Calor Distorcido)",
    cat: "Hadō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Cria uma onda de calor espiritual que distorce a visão e queima o ar ao redor do oponente.",
    incant: "Ardance o horizonte. Faça o espaço tremer diante do calor."
  },
  {
    id: "h17",
    numero: 17,
    nome: "Hadō #17 — Shakunetsu (Incandescência)",
    cat: "Hadō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Concentra energia espiritual em uma esfera incandescente que explode em estilhaços de calor.",
    incant: "Consuma o frio, ilumine a noite, transforme energia em chama."
  },
  {
    id: "h18",
    numero: 18,
    nome: "Hadō #18 — Tenrai (Trovão Celestial)",
    cat: "Hadō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Invoca um raio espiritual denso que cai dos céus sobre a coordenada do alvo.",
    incant: "Céu acima de mim, terra abaixo de mim. Entre ambos, faça nascer o trovão."
  },
  {
    id: "h19",
    numero: 19,
    nome: "Hadō #19 — Ryūka (Dragão de Fogo)",
    cat: "Hadō",
    custoReiatsu: 8,
    nivel: "Intermediário",
    desc: "Cria uma grande massa de fogo espiritual com formato serpentino que persegue o oponente.",
    incant: "Chama sem forma, encontre um corpo. Céu sem voz, encontre um rugido."
  },
  {
    id: "h20",
    numero: 20,
    nome: "Hadō #20 — Kōten (Explosão Celeste)",
    cat: "Hadō",
    custoReiatsu: 8,
    nivel: "Intermediário",
    desc: "Concentra uma grande quantidade de energia espiritual em um ponto e libera uma detonação esférica.",
    incant: "Todo poder converge para um único ponto. Céu e terra, testemunhem o impacto."
  },
  {
    id: "h31",
    numero: 31,
    nome: "Hadō #31 — Shakkahō (Tiro de Fogo Vermelho)",
    cat: "Hadō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Gera e dispara uma esfera de chamas vermelhas de alta potência e raio explosivo.",
    incant: "Ó, praticante! Dispersai-vos, rastejai! Queimai a terra e tragai a cinza!"
  },
  {
    id: "h33",
    numero: 33,
    nome: "Hadō #33 — Sōkatsui (Chuva Azul do Vazio)",
    cat: "Hadō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Dispara uma torrente avassaladora de energia espiritual azul a partir da palma aberta.",
    incant: "Ó, governante! Máscara de carne e sangue, toda a criação, o bater de asas..."
  },
  {
    id: "h54",
    numero: 54,
    nome: "Hadō #54 — Haien (Chamas da Abolição)",
    cat: "Hadō",
    custoReiatsu: 10,
    nivel: "Avançado",
    desc: "Dispara uma onda de fogo roxo que incinera e desintegra a matéria ao menor contato.",
    incant: "—"
  },
  {
    id: "h63",
    numero: 63,
    nome: "Hadō #63 — Raikōhō (Canhão do Trovão)",
    cat: "Hadō",
    custoReiatsu: 13,
    nivel: "Avançado",
    desc: "Invoca um gigantesco trovão amarelo concentrado que explode com estrondo sísmico.",
    incant: "Salpicado nos ossos da besta! Torre afiada, cristal vermelho, anel de aço..."
  },
  {
    id: "h73",
    numero: 73,
    nome: "Hadō #73 — Sōren Sōkatsui (Lótus Azul Gêmeo)",
    cat: "Hadō",
    custoReiatsu: 16,
    nivel: "Mestre",
    desc: "Versão dupla e devastadora do Sōkatsui disparada com ambas as mãos em sincronia.",
    incant: "Máscara de carne e sangue... Coroai com o nome de humano o abismo sem fim!"
  },
  {
    id: "h88",
    numero: 88,
    nome: "Hadō #88 — Hiryū Gekizoku Shinten Raihō",
    cat: "Hadō",
    custoReiatsu: 20,
    nivel: "Classe Especial",
    desc: "Um colossal canhão de relâmpagos espirituais capaz de perfurar fortalezas inteiras.",
    incant: "Rugido do dragão celeste, queime o firmamento até a última partícula!"
  },
  {
    id: "h90",
    numero: 90,
    nome: "Hadō #90 — Kurohitsugi (Caixão Negro)",
    cat: "Hadō",
    custoReiatsu: 25,
    nivel: "Classe Especial",
    desc: "Cria uma caixa cúbica de gravidade negra ao redor do alvo perfurando-o com incontáveis lanças espirituais.",
    incant: "Transborde, recipiente do caos! Cão louco e insolente, perca a razão..."
  },

  // -----------------------------------------------------------------------
  // 🌿 KAIDŌ (Feitiços de Cura, Estabilização e Suporte Espiritual)
  // -----------------------------------------------------------------------
  {
    id: "k1",
    numero: 1,
    nome: "Kaidō #1 — Shōmei (Iluminação Diagnóstica)",
    cat: "Kaidō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Revela ferimentos ocultos, venenos e perturbações espirituais no corpo do paciente.",
    incant: "Luz suave, encontre aquilo que foi ferido."
  },
  {
    id: "k2",
    numero: 2,
    nome: "Kaidō #2 — Yasuragi (Tranquilidade)",
    cat: "Kaidō",
    custoReiatsu: 3,
    nivel: "Básico",
    desc: "Reduz dores e desconforto, ajudando o paciente a permanecer consciente e estável.",
    incant: "Respire. Silencie a dor. Deixe o espírito encontrar repouso."
  },
  {
    id: "k3",
    numero: 3,
    nome: "Kaidō #3 — Seimei Ito (Fio Vital)",
    cat: "Kaidō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Estabiliza temporariamente a condição espiritual e o pulso de uma pessoa ferida.",
    incant: "Fio que une corpo e alma, permaneça firme."
  },
  {
    id: "k4",
    numero: 4,
    nome: "Kaidō #4 — Kōmyō (Luz Serena)",
    cat: "Kaidō",
    custoReiatsu: 4,
    nivel: "Básico",
    desc: "Acelera a regeneração de cortes superficiais, escoriações e sangramentos rápidos.",
    incant: "Onde existe ferida, que exista luz. Onde existe fraqueza, que exista calma."
  },
  {
    id: "k5",
    numero: 5,
    nome: "Kaidō #5 — Shinkei (Restauração Neural)",
    cat: "Kaidō",
    custoReiatsu: 5,
    nivel: "Básico",
    desc: "Ajuda a reanimar terminações nervosas e recuperar movimentos prejudicados por lesões ou dormência.",
    incant: "Desperte os caminhos adormecidos e faça o corpo lembrar seus próprios movimentos."
  },
  {
    id: "k6",
    numero: 6,
    nome: "Kaidō #6 — Seika (Purificação de Impurezas)",
    cat: "Kaidō",
    custoReiatsu: 5,
    nivel: "Básico",
    desc: "Remove pequenas impurezas espirituais, toxinas leves e energia residual acumulada.",
    incant: "Aquilo que não pertence ao corpo, deixe-o. Aquilo que pertence, permaneça."
  },
  {
    id: "k7",
    numero: 7,
    nome: "Kaidō #7 — Kokyū (Respiração Guiada)",
    cat: "Kaidō",
    custoReiatsu: 5,
    nivel: "Básico",
    desc: "Auxilia na recuperação da respiração e estabiliza o fluxo de ar e Reiryoku nos pulmões.",
    incant: "Ar entre os mundos, entre neste corpo e devolva-lhe o ritmo."
  },
  {
    id: "k8",
    numero: 8,
    nome: "Kaidō #8 — Shirohana (Flor Branca de Cura)",
    cat: "Kaidō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Cria uma pequena flor espiritual sobre o ferimento que absorve a dor e acelera a cicatrização.",
    incant: "Pequena flor, abra-se sobre a ferida e carregue consigo a dor."
  },
  {
    id: "k9",
    numero: 9,
    nome: "Kaidō #9 — Kekkai Seimei (Barreira Vital)",
    cat: "Kaidō",
    custoReiatsu: 6,
    nivel: "Intermediário",
    desc: "Cria uma película espiritual protetora ao redor de uma lesão grave, impedindo hemorragias.",
    incant: "Erga-se ao redor da vida. Não permita que a ferida avance."
  },
  {
    id: "k10",
    numero: 10,
    nome: "Kaidō #10 — Chiyu (Cura de Tecidos Profundos)",
    cat: "Kaidō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Acelera significativamente a recuperação de ferimentos musculares moderados e fraturas parciais.",
    incant: "Corpo ferido, espírito cansado. Reúna aquilo que ainda permanece."
  },
  {
    id: "k11",
    numero: 11,
    nome: "Kaidō #11 — Seimei Kōro (Caminho Vital)",
    cat: "Kaidō",
    custoReiatsu: 7,
    nivel: "Intermediário",
    desc: "Reorganiza os meridianos e o fluxo espiritual do paciente após sofrer choques de Reiatsu.",
    incant: "Que cada caminho volte a encontrar seu destino. Que cada fluxo retorne ao seu curso."
  },
  {
    id: "k12",
    numero: 12,
    nome: "Kaidō #12 — Kōshin (Renovação de Vigor)",
    cat: "Kaidō",
    custoReiatsu: 8,
    nivel: "Intermediário",
    desc: "Revigora a estamina e devolve energia física a guerreiros exaustos após combates longos.",
    incant: "Aquilo que foi gasto, encontre repouso. Aquilo que foi quebrado, encontre forma."
  },
  {
    id: "k13",
    numero: 13,
    nome: "Kaidō #13 — Reishō (Pulso Espiritual)",
    cat: "Kaidō",
    custoReiatsu: 8,
    nivel: "Intermediário",
    desc: "Sincroniza o batimento cardíaco da alma com a Reiatsu pura, revertendo quadros de choque.",
    incant: "Um pulso chama outro. Que a alma encontre seu próprio ritmo."
  },
  {
    id: "k14",
    numero: 14,
    nome: "Kaidō #14 — Shōka (Purificação Residual)",
    cat: "Kaidō",
    custoReiatsu: 9,
    nivel: "Avançado",
    desc: "Extrai e purifica resíduos cáusticos de venenos complexos e energias corrosivas de Hadō.",
    incant: "Dor que permanece, deixe o corpo. Energia estranha, abandone a carne."
  },
  {
    id: "k15",
    numero: 15,
    nome: "Kaidō #15 — Meimei (Pulso de Vida Emergencial)",
    cat: "Kaidō",
    custoReiatsu: 10,
    nivel: "Avançado",
    desc: "Estabiliza alguém em estado físico gravemente debilitado, impedindo a morte iminente.",
    incant: "Enquanto houver chama, haverá caminho. Enquanto houver espírito, haverá retorno."
  },
  {
    id: "k16",
    numero: 16,
    nome: "Kaidō #16 — Hikari no Ito (Sutura de Luz)",
    cat: "Kaidō",
    custoReiatsu: 11,
    nivel: "Avançado",
    desc: "Fios espirituais de luz ligam tendões rompidos, vasos e tecidos danificados com precisão cirúrgica.",
    incant: "Fios de luz, atravessem a ferida. Unam aquilo que foi separado."
  },
  {
    id: "k17",
    numero: 17,
    nome: "Kaidō #17 — Seishin Nagashi (Transfusão de Reiryoku)",
    cat: "Kaidō",
    custoReiatsu: 12,
    nivel: "Avançado",
    desc: "Transfere uma quantidade controlada e segura de energia espiritual pura para reanimar um aliado.",
    incant: "Que minha energia encontre teu caminho e leve consigo aquilo que pesa."
  },
  {
    id: "k18",
    numero: 18,
    nome: "Kaidō #18 — Kōmyaku (Veias de Luz)",
    cat: "Kaidō",
    custoReiatsu: 14,
    nivel: "Avançado",
    desc: "Restaura redes neurais e espirituais destruídas por técnicas de alta voltagem ou veneno.",
    incant: "Que a luz percorra cada caminho. Que nenhum fluxo permaneça perdido."
  },
  {
    id: "k19",
    numero: 19,
    nome: "Kaidō #19 — Saisei Hana (Lótus da Regeneração)",
    cat: "Kaidō",
    custoReiatsu: 16,
    nivel: "Mestre",
    desc: "Acelera profundamente a reconstrução celular de ossos e órgãos vitais com Reiryoku sustentado.",
    incant: "Daquilo que foi perdido, faça nascer novamente a forma."
  },
  {
    id: "k20",
    numero: 20,
    nome: "Kaidō #20 — Shōmei Seikai (Luz da Vida Primordial)",
    cat: "Kaidō",
    custoReiatsu: 20,
    nivel: "Classe Especial",
    desc: "O pináculo da medicina espiritual do 4º Esquadrão capaz de salvar um guerreiro à beira do abismo.",
    incant: "Luz que atravessa corpo e alma, encontre aquilo que ainda pode ser salvo."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATALOGO_KIDOS };
}
