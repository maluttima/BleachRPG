// =========================================================================
// OFFICIAL SEIREITEI KIDŌ COMPENDIUM (HADŌ, BAKUDŌ & KAIDŌ)
// =========================================================================

const CATALOGO_KIDOS = [
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
    nome: "Hadō #4 — Raikō / Byakurai (Luz Trovejante)",
    incant: "Céu silencioso, rasgue o horizonte com sua luz.",
    desc: "Dispara um feixe concentrado e perfurante de energia elétrica em linha reta.",
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
    id: "h11-enjin",
    numero: 11,
    cat: "Hadō",
    nome: "Hadō #11 — Enjin (Lâmina de Fogo)",
    incant: "Fogo que não precisa de combustível, transforme minha intenção em corte.",
    desc: "Reveste a lâmina da Zanpakutō com chamas densas para amplificar o corte.",
    custoReiatsu: 5
  },
  {
    id: "h12-shoten",
    numero: 12,
    cat: "Hadō",
    nome: "Hadō #12 — Shōten (Ascensão)",
    incant: "Suba, energia que dorme abaixo do mundo.",
    desc: "Libera uma coluna vertical massiva de energia espiritual que se eleva do solo.",
    custoReiatsu: 6
  },
  {
    id: "h13-koha",
    numero: 13,
    cat: "Hadō",
    nome: "Hadō #13 — Kōha (Onda Carmesim)",
    incant: "Vermelho que nasce do espírito, avance como maré.",
    desc: "Projeta uma grande maré ondulante de energia espiritual destruidora.",
    custoReiatsu: 6
  },
  {
    id: "h14-rasenka",
    numero: 14,
    cat: "Hadō",
    nome: "Hadō #14 — Rasenka (Flor Espiral)",
    incant: "Gire, comprima, floresça. Transforme o caos em uma única direção.",
    desc: "Dispara uma broca espiral de energia espiritual de alto poder perfurante.",
    custoReiatsu: 6
  },
  {
    id: "h15-hoko",
    numero: 15,
    cat: "Hadō",
    nome: "Hadō #15 — Hōkō (Rugido)",
    incant: "Que minha voz atravesse o céu. Que meu espírito responda com força.",
    desc: "Libera uma poderosa onda de choque sônica e espiritual em cone à frente.",
    custoReiatsu: 7
  },
  {
    id: "h16-kagero",
    numero: 16,
    cat: "Hadō",
    nome: "Hadō #16 — Kagerō (Calor Distorcido)",
    incant: "Ardente o horizonte. Faça o espaço tremer diante do calor.",
    desc: "Cria uma onda térmica distorcida que embaça a visão e causa impacto escaldante.",
    custoReiatsu: 7
  },
  {
    id: "h17-shakunetsu",
    numero: 17,
    cat: "Hadō",
    nome: "Hadō #17 — Shakunetsu (Incandescência)",
    incant: "Consuma o frio, ilumine a noite, transforme energia em chama.",
    desc: "Concentra Reiatsu em uma esfera incandescente que explode com fúria ao contato.",
    custoReiatsu: 8
  },
  {
    id: "h18-tenrai",
    numero: 18,
    cat: "Hadō",
    nome: "Hadō #18 — Tenrai (Trovão Celestial)",
    incant: "Céu acima de mim, terra abaixo de mim. Entre ambos, faça nascer o trovão.",
    desc: "Invoca um raio espiritual fulminante que desaba dos céus sobre a área marcada.",
    custoReiatsu: 8
  },
  {
    id: "h19-ryuka",
    numero: 19,
    cat: "Hadō",
    nome: "Hadō #19 — Ryūka (Dragão de Fogo)",
    incant: "Chama sem forma, encontre um corpo. Céu sem voz, encontre um rugido.",
    desc: "Materializa uma serpente dragônica de chamas espirituais que persegue o alvo.",
    custoReiatsu: 9
  },
  {
    id: "h20-koten",
    numero: 20,
    cat: "Hadō",
    nome: "Hadō #20 — Kōten (Explosão Celeste)",
    incant: "Todo poder converge para um único ponto. Céu e terra, testemunhem o impacto.",
    desc: "Concentra densidade espiritual máxima em um ponto infinitesimal antes de detonar.",
    custoReiatsu: 10
  },
  // Feitiços Clássicos Avançados
  {
    id: "h31-shakkaho",
    numero: 31,
    cat: "Hadō",
    nome: "Hadō #31 — Shakkahō (Canhão de Fogo Vermelho)",
    incant: "Ó senhor! Máscara de sangue e carne, toda a criação, bater de asas, vós que carregais o nome de Homem! Inferno e pandemônio, a barreira marítima avança, marcha para o sul!",
    desc: "Dispara uma esfera carmesim de alta destruição térmica por concussão e chamas.",
    custoReiatsu: 7
  },
  {
    id: "h33-sokatsui",
    numero: 33,
    cat: "Hadō",
    nome: "Hadō #33 — Sōkatsui (Fogo Azul / Impacto Descontrolado)",
    incant: "Ó senhor! Máscara de carne e osso, bater de asas, vós que carregais o nome de Homem! Verdade e temperança, sobre esta muralha imaculada de sonhos, desencadeai apenas levemente a fúria de vossas garras.",
    desc: "Gera e dispara uma torrente de chamas azuis com impacto explosivo devastador.",
    custoReiatsu: 8
  },
  {
    id: "h73-soren-sokatsui",
    numero: 73,
    cat: "Hadō",
    nome: "Hadō #73 — Sōren Sōkatsui (Fogo Azul de Lótus Gêmea)",
    incant: "Ó senhor! Máscara de sangue e carne, toda a criação, bater de asas, vós que carregais o nome do Homem! Na parede de chamas azuis, inscreve um lótus duplo. No abismo da conflagração, aguarda nos céus distantes.",
    desc: "Forma avançada e dupla do Sōkatsui disparada com ambas as palmas, com o dobro da potência.",
    custoReiatsu: 14
  },
  {
    id: "h90-kurohitsugi",
    numero: 90,
    cat: "Hadō",
    nome: "Hadō #90 — Kurohitsugi (Caixão Negro)",
    incant: "A crista viscosa da corrupção. O arrogante receptáculo da loucura! Negue o impulso fervilhante! Atordoe e cintile! Perturbe o sono! A rainha rastejante de ferro! A boneca de lama eternamente autodestrutiva! Unam-se! Repilam! Preencham a Terra e reconheçam sua própria impotência!",
    desc: "Confinamento em caixão de gravidade negra perfurado por lanças de Reishi que distorcem o espaço.",
    custoReiatsu: 20
  },

  // --- BAKUDŌ (APRISIONAMENTO & DEFESA) ---
  {
    id: "b1-sai",
    numero: 1,
    cat: "Hadō",
    nome: "Bakudō #1 — Sai (Obstrução)",
    incant: "—",
    desc: "Prende os braços do alvo atrás das costas com fios invisíveis de Reiatsu.",
    custoReiatsu: 1
  },
  {
    id: "b4-hainawa",
    numero: 4,
    cat: "Bakudō",
    nome: "Bakudō #4 — Hainawa (Corda Rastejante)",
    incant: "—",
    desc: "Cria uma corda de energia amarela que laça e imobiliza os membros do adversário.",
    custoReiatsu: 2
  },
  {
    id: "b9-geki",
    numero: 9,
    cat: "Bakudō",
    nome: "Bakudō #9 — Geki (Golpe de Conquista)",
    incant: "Desintegre-se, cão negro de Rondanini! Olhe para si mesmo com terror e depois rasgue sua própria garganta!",
    desc: "Envolve o corpo do inimigo em uma luz vermelha paralisante que anula movimentos.",
    custoReiatsu: 3
  },
  {
    id: "b15-kagekake",
    numero: 15,
    cat: "Bakudō",
    nome: "Bakudō #15 — Kagekake (Amarras da Sombra)",
    incant: "A sombra nasce dos pés e retorna aos pés. Que nenhuma distância seja suficiente para escapar.",
    desc: "Prende parcialmente o alvo à própria sombra, impedindo locomoção rápida.",
    custoReiatsu: 4
  },
  {
    id: "b16-rasen-kusari",
    numero: 16,
    cat: "Bakudō",
    nome: "Bakudō #16 — Rasen Kusari (Corrente Espiral)",
    incant: "Gire, envolva, aperte. Quanto mais o prisioneiro luta, mais próximo fica o círculo.",
    desc: "Uma corrente espiritual gira ao redor do alvo e restringe progressivamente seus movimentos.",
    custoReiatsu: 4
  },
  {
    id: "b17-hakujo",
    numero: 17,
    cat: "Bakudō",
    nome: "Bakudō #17 — Hakujō (Manto Branco)",
    incant: "Cubra aquilo que desejo proteger. Torne-se abrigo contra o impacto.",
    desc: "Forma uma camada espiritual protetora e resiliente sobre o corpo do aliado.",
    custoReiatsu: 5
  },
  {
    id: "b18-tenmon",
    numero: 18,
    cat: "Bakudō",
    nome: "Bakudō #18 — Tenmon (Portão Celestial)",
    incant: "Entre dois mundos existe uma porta. Que ela se abra apenas diante daquele que reconheço.",
    desc: "Cria uma barreira seletiva que permite a passagem apenas de pessoas autorizadas.",
    custoReiatsu: 5
  },
  {
    id: "b19-metsubo-ori",
    numero: 19,
    cat: "Bakudō",
    nome: "Bakudō #19 — Metsubō no Ori (Gaiola da Ruína)",
    incant: "Círculo sobre círculo, parede sobre parede. Fechem-se sobre aquele que ousa permanecer.",
    desc: "Ergue várias camadas concêntricas de barreiras em jaula ao redor do inimigo.",
    custoReiatsu: 6
  },
  {
    id: "b20-hyakuren-kekkai",
    numero: 20,
    cat: "Bakudō",
    nome: "Bakudō #20 — Hyakuren Kekkai (Barreira das Cem Camadas)",
    incant: "Que cada camada seja uma muralha, que cada muralha seja uma promessa. Ergam-se e resistam.",
    desc: "Forma múltiplas barreiras espirituais sobrepostas de altíssima absorção de dano.",
    custoReiatsu: 6
  },
  {
    id: "b26-kyokko",
    numero: 26,
    cat: "Bakudō",
    nome: "Bakudō #26 — Kyokkō (Luz Curva)",
    incant: "—",
    desc: "Dobra a luz e a percepção espiritual ao redor do conjurador, tornando-o imperceptível.",
    custoReiatsu: 6
  },
  {
    id: "b30-shitotsu-sansen",
    numero: 30,
    cat: "Bakudō",
    nome: "Bakudō #30 — Shitotsu Sansen (Três Raios de Perfuração)",
    incant: "—",
    desc: "Dispara três feixes triangulares que cravam o alvo contra uma superfície pelos membros.",
    custoReiatsu: 7
  },
  {
    id: "b39-enkosen",
    numero: 39,
    cat: "Bakudō",
    nome: "Bakudō #39 — Enkōsen (Escudo Giratório)",
    incant: "—",
    desc: "Cria um escudo condensado e rotativo em forma de disco diante da mão.",
    custoReiatsu: 7
  },
  {
    id: "b61-rikujo-koro",
    numero: 61,
    cat: "Bakudō",
    nome: "Bakudō #61 — Rikujō Kōrō (Prisão das Seis Varas de Luz)",
    incant: "Carruagem do trovão, ponte da roda giratória. Com a luz, divida este em seis!",
    desc: "Seis feixes dourados de luz cravam-se na cintura do adversário, imobilizando-o totalmente.",
    custoReiatsu: 11
  },
  {
    id: "b81-danku",
    numero: 81,
    cat: "Bakudō",
    nome: "Bakudō #81 — Dankū (Muro de Rejeição)",
    incant: "—",
    desc: "Cria uma parede translúcida monumental capaz de anular qualquer Hadō de nível 89 ou inferior.",
    custoReiatsu: 16
  },

  // --- KAIDŌ (CURA & SUPORTE ESPIRITUAL) ---
  {
    id: "k1-shomei",
    numero: 1,
    cat: "Kaidō",
    nome: "Kaidō #1 — Shōmei (Iluminação)",
    incant: "Luz suave, encontre aquilo que foi ferido.",
    desc: "Revela ferimentos internos ocultos e perturbações no fluxo de Reishi do paciente.",
    custoReiatsu: 1
  },
  {
    id: "k2-yasuragi",
    numero: 2,
    cat: "Kaidō",
    nome: "Kaidō #2 — Yasuragi (Tranquilidade)",
    incant: "Respire. Silencie a dor. Deixe o espírito encontrar repouso.",
    desc: "Reduz dores agudas e choque físico, mantendo o aliado estável e consciente.",
    custoReiatsu: 2
  },
  {
    id: "k3-seimei-ito",
    numero: 3,
    cat: "Kaidō",
    nome: "Kaidō #3 — Seimei Ito (Fio Vital)",
    incant: "Fio que une corpo e alma, permaneça firme.",
    desc: "Estabiliza emergencialmente a conexão entre alma e corpo de um aliado ferido.",
    custoReiatsu: 2
  },
  {
    id: "k4-komyo",
    numero: 4,
    cat: "Kaidō",
    nome: "Kaidō #4 — Kōmyō (Luz Serena)",
    incant: "Onde existe ferida, que exista luz. Onde existe fraqueza, que exista calma.",
    desc: "Acelera a cicatrização de cortes leves e queimaduras superficiais.",
    custoReiatsu: 3
  },
  {
    id: "k5-shinkei",
    numero: 5,
    cat: "Kaidō",
    nome: "Kaidō #5 — Shinkei (Nervo)",
    incant: "Desperte os caminhos adormecidos e faça o corpo lembrar seus próprios movimentos.",
    desc: "Reativa conexões neurais e musculares prejudicadas por paralisia ou trauma.",
    custoReiatsu: 3
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
    id: "k7-kokyu",
    numero: 7,
    cat: "Kaidō",
    nome: "Kaidō #7 — Kokyū (Respiração)",
    incant: "Ar entre os mundos, entre neste corpo e devolva-lhe o ritmo.",
    desc: "Restaura o ritmo pulmonar e normaliza o fluxo de respiração espiritual.",
    custoReiatsu: 4
  },
  {
    id: "k8-shirohana",
    numero: 8,
    cat: "Kaidō",
    nome: "Kaidō #8 — Shirohana (Flor Branca)",
    incant: "Pequena flor, abra-se sobre a ferida e carregue consigo a dor.",
    desc: "Materializa uma aura floral sobre lesões pontuais para acelerar recuperação acelerada.",
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
    nome: "Kaidō #10 — Chiyu (Cura)",
    incant: "Corpo ferido, espírito cansado. Reúna aquilo que ainda permanece.",
    desc: "Acelera significativamente a regeneração de ferimentos moderados e lacerações.",
    custoReiatsu: 5
  },
  {
    id: "k11-seimei-koro",
    numero: 11,
    cat: "Kaidō",
    nome: "Kaidō #11 — Seimei Kōro (Caminho Vital)",
    incant: "Que cada caminho volte a encontrar seu destino. Que cada fluxo retorne ao seu curso.",
    desc: "Reorganiza o fluxo de Reishi nos canais espirituais após supressão ou choque.",
    custoReiatsu: 6
  },
  {
    id: "k12-koshin",
    numero: 12,
    cat: "Kaidō",
    nome: "Kaidō #12 — Kōshin (Renovação)",
    incant: "Aquilo que foi gasto, encontre repouso. Aquilo que foi quebrado, encontre forma.",
    desc: "Revitaliza o vigor físico e repõe parte da energia espiritual gasta.",
    custoReiatsu: 6
  },
  {
    id: "k13-reisho",
    numero: 13,
    cat: "Kaidō",
    nome: "Kaidō #13 — Reishō (Pulso Espiritual)",
    incant: "Um pulso chama outro. Que a alma encontre seu próprio ritmo.",
    desc: "Monitora e estabiliza arritmias e descompassos no Hakusui do paciente.",
    custoReiatsu: 6
  },
  {
    id: "k14-shoka-cura",
    numero: 14,
    cat: "Kaidō",
    nome: "Kaidō #14 — Shōka (Purificação da Ferida)",
    incant: "Dor que permanece, deixe o corpo. Energia estranha, abandone a carne.",
    desc: "Dissolve miasmas e resíduos corrosivos de Reiatsu hostil em ferimentos.",
    custoReiatsu: 7
  },
  {
    id: "k15-meimei",
    numero: 15,
    cat: "Kaidō",
    nome: "Kaidō #15 — Meimei (Pulso de Vida)",
    incant: "Enquanto houver chama, haverá caminho. Enquanto houver espírito, haverá retorno.",
    desc: "Estabiliza emergencialmente pacientes à beira da derrota ou inconsciência.",
    custoReiatsu: 7
  },
  {
    id: "k16-hikari-ito",
    numero: 16,
    cat: "Kaidō",
    nome: "Kaidō #16 — Hikari no Ito (Fios de Luz)",
    incant: "Fios de luz, atravessem a ferida. Unam aquilo que foi separado.",
    desc: "Tecelagem cirúrgica de Reishi que sutura músculos e tendões rompidos.",
    custoReiatsu: 8
  },
  {
    id: "k17-seishin-nagashi",
    numero: 17,
    cat: "Kaidō",
    nome: "Kaidō #17 — Seishin Nagashi (Fluxo Espiritual)",
    incant: "Que minha energia encontre teu caminho e leve consigo aquilo que pesa.",
    desc: "Transfere uma cota direta de Reiatsu purificada do conjurador para o receptor.",
    custoReiatsu: 8
  },
  {
    id: "k18-komyaku",
    numero: 18,
    cat: "Kaidō",
    nome: "Kaidō #18 — Kōmyaku (Veias de Luz)",
    incant: "Que a luz percorra cada caminho. Que nenhum fluxo permaneça perdido.",
    desc: "Restaura ramificações profundas do sistema circulatório espiritual.",
    custoReiatsu: 9
  },
  {
    id: "k19-saisei-hana",
    numero: 19,
    cat: "Kaidō",
    nome: "Kaidō #19 — Saisei Hana (Flor da Regeneração)",
    incant: "Daquilo que foi perdido, faça nascer novamente a forma.",
    desc: "Regenera ferimentos graves e tecidos destruídos sob concentração contínua.",
    custoReiatsu: 10
  },
  {
    id: "k20-shomei-seikai",
    numero: 20,
    cat: "Kaidō",
    nome: "Kaidō #20 — Shōmei Seikai (Luz da Vida)",
    incant: "Luz que atravessa corpo e alma, encontre aquilo que ainda pode ser salvo.",
    desc: "Feitiço supremo do 4º Esquadrão para salvar Shinigamis em estado crítico.",
    custoReiatsu: 12
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATALOGO_KIDOS };
}
