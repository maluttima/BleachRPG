const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;

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
  purple: "#8B6FD6"
};

// Primary Attributes
const ATTRS = [{
  key: "pressao",
  label: "Pressão Espiritual",
  color: C.blue,
  desc: "Reiatsu, controle espiritual e percepção"
}, {
  key: "forca",
  label: "Força",
  color: C.red,
  desc: "Potência física, Zanjutsu e Hakuda"
}, {
  key: "velocidade",
  label: "Velocidade",
  color: C.green,
  desc: "Deslocamento, reflexos e Hohō/Shunpo"
}, {
  key: "resiliencia",
  label: "Resiliência",
  color: C.purple,
  desc: "Resistência física, espiritual e vitalidade"
}];
const ATTRS_FISICOS = ["forca", "velocidade", "resiliencia"];
const CATEGORIAS_TECNICA = ["Hadō", "Bakudō", "Kaidō", "Zanjutsu", "Hakuda", "Hohō", "Outro"];
const ESTADOS = [{
  key: "Inteiro",
  color: C.green,
  label: "Condição Normal"
}, {
  key: "Ferido",
  color: C.yellow,
  label: "Com Danos"
}, {
  key: "Debilitado",
  color: C.orangeDeep,
  label: "Gravemente Prejudicado"
}, {
  key: "Derrotado",
  color: C.red,
  label: "Incapacitado"
}];
const TIPOS_RECOMPENSA = ["Treino em ON (30 linhas)", "Missão Principal (Garantido 15 pts + Giros)", "Miscelânea", "Cena de Arco (90 linhas / 15 pts + Giros)", "Combate em ON", "Sorteio Gacha Comum", "Sorteio Especial", "Avaliação de Cenas (ADM)", "Avaliação de Fichas (ADM)", "Outro"];

// Gacha Rarities & Pools (Sistema Balanceado & Raro)
const RARIDADES_COMUNS = [{
  nome: "Comum (Básico)",
  peso: 650,
  min: 1,
  max: 2,
  cor: C.muted,
  desc: "+1 a +2 Pontos de Atributo ou recurso básico (65% de chance)",
  tipo: "pontos",
  chanceStr: "65%"
}, {
  nome: "Incomum",
  peso: 220,
  min: 3,
  max: 4,
  cor: C.green,
  desc: "+3 a +4 Pontos de Atributo ou tônico de Reishi (22% de chance)",
  tipo: "pontos",
  chanceStr: "22%"
}, {
  nome: "Rara",
  peso: 90,
  min: 5,
  max: 7,
  cor: C.blue,
  desc: "+5 a +7 Pontos de Atributo ou pergaminho de treino (9% de chance)",
  tipo: "pontos",
  chanceStr: "9%"
}, {
  nome: "Épica",
  peso: 35,
  min: 8,
  max: 11,
  cor: C.purple,
  desc: "+8 a +11 Pontos de Atributo ou essência condensada (3.5% de chance)",
  tipo: "pontos",
  chanceStr: "3.5%"
}, {
  nome: "Lendária",
  peso: 5,
  min: 14,
  max: 18,
  cor: C.yellow,
  desc: "+14 a +18 Pontos de Atributo ou bênção do Seireitei (0.5% de chance / 1 em 200)",
  tipo: "pontos",
  chanceStr: "0.5%"
}];
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
}, {
  id: "esp-basico-2",
  nome: "⚡ Pergaminho de Treino de Hohō",
  raridade: "Comum Especial",
  peso: 160,
  cor: C.green,
  desc: "Instruções táticas de passos relâmpago e mobilidade (+5 pontos).",
  tipo: "pontos",
  valor: 5,
  chanceStr: "16%"
}, {
  id: "esp-basico-3",
  nome: "🧪 Tônico de Reishi do 12º Esquadrão",
  raridade: "Comum Especial",
  peso: 150,
  cor: C.green,
  desc: "Um composto refinado pelo Departamento de Pesquisa e Desenvolvimento (+6 pontos).",
  tipo: "pontos",
  valor: 6,
  chanceStr: "15%"
}, {
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
}, {
  id: "esp-inter-2",
  nome: "📜 Pergaminho de Zanjutsu de Elite",
  raridade: "Incomum Especial",
  peso: 80,
  cor: C.blue,
  desc: "Técnicas refinadas de esgrima de capitães ancestrais (+10 pontos).",
  tipo: "pontos",
  valor: 10,
  chanceStr: "8%"
}, {
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
}, {
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
}, {
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
}];

// Official Kidō Catalog (75+ Spells with Incantations & Effects)
const CATALOGO_KIDOS = [{
  "id": "b1_u",
  "numero": 1,
  "nome": "Bakudō #1 — Kusari no Yume (Correntes do Sonho)",
  "cat": "Bakudō",
  "custoReiatsu": 2,
  "nivel": "Básico",
  "desc": "Cria correntes espirituais que se enrolam ao redor dos membros do alvo, dificultando seus movimentos.",
  "incant": "Do vazio desperte, corrente que não conhece fuga. Envolva o alvo e silencie seus passos."
}, {
  "id": "b1_c",
  "numero": 1,
  "nome": "Bakudō #1 — Sai (Obstrução)",
  "cat": "Bakudō",
  "custoReiatsu": 2,
  "nivel": "Básico",
  "desc": "Prende os braços do alvo atrás das costas com uma força magnética invisível.",
  "incant": "—"
}, {
  "id": "b2",
  "numero": 2,
  "nome": "Bakudō #2 — Shizukesa (Silêncio)",
  "cat": "Bakudō",
  "custoReiatsu": 2,
  "nivel": "Básico",
  "desc": "Cria uma pequena área onde sons são fortemente abafados, impedindo escuta e comunicação.",
  "incant": "Que a voz desapareça, que o som se perca, que o silêncio ocupe este espaço."
}, {
  "id": "b3",
  "numero": 3,
  "nome": "Bakudō #3 — Kōri no Kusari (Correntes de Gelo)",
  "cat": "Bakudō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Forma correntes espirituais rígidas de frio gélido que prendem os membros do alvo.",
  "incant": "Frio que nasce da alma, cristalize o caminho daquele que diante de mim permanece."
}, {
  "id": "b4_u",
  "numero": 4,
  "nome": "Bakudō #4 — Kabe (Muralha)",
  "cat": "Bakudō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Cria uma barreira espiritual frontal capaz de bloquear ataques físicos e feitiços leves.",
  "incant": "Terra sem forma, céu sem fim. Erga-se diante de mim e torne-se barreira."
}, {
  "id": "b4_c",
  "numero": 4,
  "nome": "Bakudō #4 — Hainawa (Corda de Rastejamento)",
  "cat": "Bakudō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Gera uma corda de energia crepitante amarela que amarra o corpo e os pulsos do oponente.",
  "incant": "—"
}, {
  "id": "b5",
  "numero": 5,
  "nome": "Bakudō #5 — Meikyū (Labirinto)",
  "cat": "Bakudō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Distorce a percepção espacial do alvo, dificultando sua orientação e senso de direção.",
  "incant": "Caminho se torne caminho nenhum. Direção se perca. Prenda o viajante em seu próprio passo."
}, {
  "id": "b6",
  "numero": 6,
  "nome": "Bakudō #6 — Hikari Ito (Fios de Luz)",
  "cat": "Bakudō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Cria fios luminosos no ar que podem prender objetos em queda, projéteis ou membros do alvo.",
  "incant": "Mil fios atravessam o espaço. Prendam aquilo que minha visão alcançar."
}, {
  "id": "b7",
  "numero": 7,
  "nome": "Bakudō #7 — Kekkai (Barreira Circular)",
  "cat": "Bakudō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Forma uma barreira circular curta ao redor do usuário para amortecer investidas corpo a corpo.",
  "incant": "Entre mim e o perigo, estabeleça-se a fronteira."
}, {
  "id": "b8_u",
  "numero": 8,
  "nome": "Bakudō #8 — Kagebari (Agulhas da Sombra)",
  "cat": "Bakudō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Cria pequenas estacas espirituais que prendem temporariamente o alvo ao chão ou a uma superfície.",
  "incant": "Sombra que acompanha todo ser, transforme-se em agulha e fixe aquilo que ela toca."
}, {
  "id": "b8_c",
  "numero": 8,
  "nome": "Bakudō #8 — Seki (Repulsão)",
  "cat": "Bakudō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Cria um escudo redondo e brilhante no antebraço que repele projéteis e atordoa o atacante.",
  "incant": "—"
}, {
  "id": "b9",
  "numero": 9,
  "nome": "Bakudō #9 — Fūsa (Selamento Articular)",
  "cat": "Bakudō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Cria uma marca espiritual que dificulta e trava determinado movimento ou postura do alvo.",
  "incant": "Feche a passagem, cerre o caminho, faça do movimento uma lembrança."
}, {
  "id": "b10",
  "numero": 10,
  "nome": "Bakudō #10 — Hagane Ori (Gaiola de Aço)",
  "cat": "Bakudō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Cria uma gaiola espiritual cúbica de barras de energia densa ao redor de um alvo.",
  "incant": "Quatro lados, quatro limites. Ergam-se e aprisionem aquilo que está dentro."
}, {
  "id": "b11",
  "numero": 11,
  "nome": "Bakudō #11 — Kōsen (Linha de Luz)",
  "cat": "Bakudō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Cria uma linha espiritual luminosa que funciona como uma barreira linear intransponível.",
  "incant": "Uma linha separa o mundo. Que ninguém atravesse sua fronteira."
}, {
  "id": "b12",
  "numero": 12,
  "nome": "Bakudō #12 — Jūryoku (Peso Gravitacional)",
  "cat": "Bakudō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Aumenta temporariamente a pressão espiritual sobre um alvo, tornando seus movimentos mais pesados.",
  "incant": "O céu desça, a terra se levante. Faça o corpo lembrar o peso de existir."
}, {
  "id": "b13",
  "numero": 13,
  "nome": "Bakudō #13 — Mizu Kagami (Espelho d'Água)",
  "cat": "Bakudō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Cria uma superfície espiritual translúcida capaz de refletir imagens, movimentos e feitiços leves.",
  "incant": "Água que não corre, superfície que não quebra. Mostre aquilo que diante de ti permanece."
}, {
  "id": "b14",
  "numero": 14,
  "nome": "Bakudō #14 — Tōmei Kabe (Muralha Transparente)",
  "cat": "Bakudō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Cria uma barreira completamente invisível que surpreende atacantes em alta velocidade.",
  "incant": "Aquilo que os olhos não encontram ainda pode permanecer de pé. Erga-se."
}, {
  "id": "b15",
  "numero": 15,
  "nome": "Bakudō #15 — Shibari no Kage (Prisão da Sombra)",
  "cat": "Bakudō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Prende parcialmente o alvo à própria sombra, impedindo saltos e translocações por Shunpo.",
  "incant": "A sombra nasce dos pés e retorna aos pés. Que nenhuma distância seja suficiente para escapar."
}, {
  "id": "b16",
  "numero": 16,
  "nome": "Bakudō #16 — Rasen Kusari (Corrente Espiral)",
  "cat": "Bakudō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Uma corrente espiritual gira ao redor do alvo e restringe progressivamente seus movimentos.",
  "incant": "Gire, envolva, aperte. Quanto mais o prisioneiro luta, mais próximo fica o círculo."
}, {
  "id": "b17",
  "numero": 17,
  "nome": "Bakudō #17 — Hakujō (Manto Branco)",
  "cat": "Bakudō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Forma uma camada espiritual protetora e amortecedora sobre o corpo do usuário ou de um aliado.",
  "incant": "Cubra aquilo que desejo proteger. Torne-se abrigo contra o impacto."
}, {
  "id": "b18",
  "numero": 18,
  "nome": "Bakudō #18 — Tenmon (Portão Celestial)",
  "cat": "Bakudō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Cria uma barreira seletiva que permite apenas a passagem de pessoas autorizadas pelo conjurador.",
  "incant": "Entre dois mundos existe uma porta. Que ela se abra apenas diante daquele que reconheço."
}, {
  "id": "b19",
  "numero": 19,
  "nome": "Bakudō #19 — Metsubō no Ori (Gaiola da Ruína)",
  "cat": "Bakudō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Cria várias camadas de barreiras prismáticas concêntricas ao redor de um alvo em fuga.",
  "incant": "Círculo sobre círculo, parede sobre parede. Fechem-se sobre aquele que ousa permanecer."
}, {
  "id": "b20",
  "numero": 20,
  "nome": "Bakudō #20 — Hyakuren Kekkai (Barreira das Cem Camadas)",
  "cat": "Bakudō",
  "custoReiatsu": 8,
  "nivel": "Intermediário",
  "desc": "Forma múltiplas camadas de barreiras espirituais sobrepostas para absorver impactos devastadores.",
  "incant": "Que cada camada seja uma muralha, que cada muralha seja uma promessa. Ergam-se e resistam."
}, {
  "id": "b26",
  "numero": 26,
  "nome": "Bakudō #26 — Kyokkō (Luz Curvada)",
  "cat": "Bakudō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Dobra a luz e a percepção de Reiatsu ao redor do usuário, tornando-o completamente invisível.",
  "incant": "—"
}, {
  "id": "b39",
  "numero": 39,
  "nome": "Bakudō #39 — Enkōsen (Escudo Giratório de Lótus)",
  "cat": "Bakudō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Cria um escudo condensado de energia rotatória para absorver ataques diretos e projéteis.",
  "incant": "—"
}, {
  "id": "b61",
  "numero": 61,
  "nome": "Bakudō #61 — Rikujō Kōrō (Prisão das Seis Varas de Luz)",
  "cat": "Bakudō",
  "custoReiatsu": 12,
  "nivel": "Avançado",
  "desc": "Seis lâminas reluzentes de luz dourada perfuram a cintura do alvo, paralisando-o totalmente.",
  "incant": "Carruagem do trovão, ponte da roda giratória, com a luz dividida em seis!"
}, {
  "id": "b62",
  "numero": 62,
  "nome": "Bakudō #62 — Hyapporankan (Cem Estacas de Luz)",
  "cat": "Bakudō",
  "custoReiatsu": 13,
  "nivel": "Avançado",
  "desc": "Uma vara de luz se multiplica em uma centena de estacas lançadas para cravar o oponente no chão.",
  "incant": "—"
}, {
  "id": "b75",
  "numero": 75,
  "nome": "Bakudō #75 — Gochūtekkan (Cinco Pilares de Ferro)",
  "cat": "Bakudō",
  "custoReiatsu": 16,
  "nivel": "Mestre",
  "desc": "Invoca cinco gigantescos pilares de ferro conectados por correntes que esmagam e selam o alvo.",
  "incant": "Muralha de areia de ferro, torre de monge, lâmpada de ferro incandescente!"
}, {
  "id": "b81",
  "numero": 81,
  "nome": "Bakudō #81 — Dankū (Fenda de Ar)",
  "cat": "Bakudō",
  "custoReiatsu": 18,
  "nivel": "Mestre",
  "desc": "Ergue uma barreira translúcida gigantesca que anula completamente qualquer Hadō até o #89.",
  "incant": "—"
}, {
  "id": "b99",
  "numero": 99,
  "nome": "Bakudō #99 — Kin / Bankin (Grande Selamento)",
  "cat": "Bakudō",
  "custoReiatsu": 25,
  "nivel": "Classe Especial",
  "desc": "O selamento supremo em três canções: ataduras espirituais, estacas de aço e bloco monumental.",
  "incant": "Primeira Canção: Shiryū! Segunda Canção: Hyakurenzan! Canção Final: Bankin Taihō!"
}, {
  "id": "h1_u",
  "numero": 1,
  "nome": "Hadō #1 — Hibana (Faísca)",
  "cat": "Hadō",
  "custoReiatsu": 2,
  "nivel": "Básico",
  "desc": "Dispara uma pequena explosão concentrada de energia espiritual a partir da ponta dos dedos.",
  "incant": "Pequena chama, desperte em minha mão."
}, {
  "id": "h1_c",
  "numero": 1,
  "nome": "Hadō #1 — Shō (Empurrão Cinético)",
  "cat": "Hadō",
  "custoReiatsu": 2,
  "nivel": "Básico",
  "desc": "Dispara uma força cinética invisível a partir da ponta do dedo para repelir alvos e projéteis.",
  "incant": "—"
}, {
  "id": "h2",
  "numero": 2,
  "nome": "Hadō #2 — Rekka (Lâmina Flamejante)",
  "cat": "Hadō",
  "custoReiatsu": 2,
  "nivel": "Básico",
  "desc": "Projeta uma lâmina de energia flamejante que corta o ar em média distância.",
  "incant": "Chama comprimida, torne-se lâmina e atravesse o caminho."
}, {
  "id": "h3",
  "numero": 3,
  "nome": "Hadō #3 — Shōgekiha (Onda de Impacto)",
  "cat": "Hadō",
  "custoReiatsu": 2,
  "nivel": "Básico",
  "desc": "Dispara uma onda curta de pressão espiritual de impacto contundente.",
  "incant": "Espírito acumulado, transforme-se em força. Avance."
}, {
  "id": "h4_u",
  "numero": 4,
  "nome": "Hadō #4 — Raikō (Luz Trovejante)",
  "cat": "Hadō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Dispara um feixe concentrado de energia elétrica que viaja em linha reta.",
  "incant": "Céu silencioso, rasgue o horizonte com sua luz."
}, {
  "id": "h4_c",
  "numero": 4,
  "nome": "Hadō #4 — Byakurai (Raio Branco)",
  "cat": "Hadō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Dispara um raio concentrado de eletricidade branca perfurante a partir do dedo indicador.",
  "incant": "—"
}, {
  "id": "h5",
  "numero": 5,
  "nome": "Hadō #5 — Kazan (Vulcão)",
  "cat": "Hadō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Projeta uma erupção de energia térmica para cima a partir do solo sob o alvo.",
  "incant": "Sob a terra existe fogo. Rompa o silêncio e desperte."
}, {
  "id": "h6",
  "numero": 6,
  "nome": "Hadō #6 — Getsumen (Crescente Lunar)",
  "cat": "Hadō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Dispara uma lâmina curva de energia espiritual em formato de foice lunar.",
  "incant": "Lua partida, desenha teu arco e corta o caminho diante de mim."
}, {
  "id": "h7",
  "numero": 7,
  "nome": "Hadō #7 — Enkō (Arco Flamejante)",
  "cat": "Hadō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Cria uma rajada curva de energia flamejante que contorna obstáculos.",
  "incant": "Fogo que dança no ar, siga meu gesto e avance."
}, {
  "id": "h8",
  "numero": 8,
  "nome": "Hadō #8 — Retsufū (Vento Violento)",
  "cat": "Hadō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Dispara uma rajada de vento espiritual comprimido capaz de arremessar adversários.",
  "incant": "Ar que dorme, desperte. Céu que observa, desça."
}, {
  "id": "h9",
  "numero": 9,
  "nome": "Hadō #9 — Raimei Sen (Linha do Trovão)",
  "cat": "Hadō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Dispara uma linha instantânea e extremamente rápida de energia elétrica perfurante.",
  "incant": "Entre céu e terra existe apenas um instante. Atravesse-o."
}, {
  "id": "h10",
  "numero": 10,
  "nome": "Hadō #10 — Gekka (Flor Lunar)",
  "cat": "Hadō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Cria vários projéteis espirituais que se espalham como pétalas cortantes no ar.",
  "incant": "Abra suas pétalas na escuridão e faça a noite florescer."
}, {
  "id": "h11_u",
  "numero": 11,
  "nome": "Hadō #11 — Enjin (Lâmina de Fogo)",
  "cat": "Hadō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Reveste uma arma ou membro com energia flamejante de alto poder de incineração.",
  "incant": "Fogo que não precisa de combustível, transforme minha intenção em corte."
}, {
  "id": "h11_c",
  "numero": 11,
  "nome": "Hadō #11 — Tsuzuri Raiden (Raio Conduzido)",
  "cat": "Hadō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Canaliza uma corrente elétrica através de qualquer objeto condutor ou lâmina de Zanpakutō.",
  "incant": "—"
}, {
  "id": "h12",
  "numero": 12,
  "nome": "Hadō #12 — Shōten (Ascensão)",
  "cat": "Hadō",
  "custoReiatsu": 5,
  "nivel": "Intermediário",
  "desc": "Libera uma coluna vertical colossal de energia espiritual que eleva e quebra o solo.",
  "incant": "Suba, energia que dorme abaixo do mundo."
}, {
  "id": "h13",
  "numero": 13,
  "nome": "Hadō #13 — Kōha (Onda Carmesim)",
  "cat": "Hadō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Projeta uma maré maciça de energia espiritual vermelha em cone frontal.",
  "incant": "Vermelho que nasce do espírito, avance como maré."
}, {
  "id": "h14",
  "numero": 14,
  "nome": "Hadō #14 — Rasenka (Flor Espiral)",
  "cat": "Hadō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Dispara um projétil espiral perfurante de energia concentrada em rotação.",
  "incant": "Gire, comprima, floresça. Transforme o caos em uma única direção."
}, {
  "id": "h15",
  "numero": 15,
  "nome": "Hadō #15 — Hōkō (Rugido Espiritual)",
  "cat": "Hadō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Libera uma poderosa onda sonora e espiritual que atordoa e repele múltiplos atacantes.",
  "incant": "Que minha voz atravesse o céu. Que meu espírito responda com força."
}, {
  "id": "h16",
  "numero": 16,
  "nome": "Hadō #16 — Kagerō (Calor Distorcido)",
  "cat": "Hadō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Cria uma onda de calor espiritual que distorce a visão e queima o ar ao redor do oponente.",
  "incant": "Ardance o horizonte. Faça o espaço tremer diante do calor."
}, {
  "id": "h17",
  "numero": 17,
  "nome": "Hadō #17 — Shakunetsu (Incandescência)",
  "cat": "Hadō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Concentra energia espiritual em uma esfera incandescente que explode em estilhaços de calor.",
  "incant": "Consuma o frio, ilumine a noite, transforme energia em chama."
}, {
  "id": "h18",
  "numero": 18,
  "nome": "Hadō #18 — Tenrai (Trovão Celestial)",
  "cat": "Hadō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Invoca um raio espiritual denso que cai dos céus sobre a coordenada do alvo.",
  "incant": "Céu acima de mim, terra abaixo de mim. Entre ambos, faça nascer o trovão."
}, {
  "id": "h19",
  "numero": 19,
  "nome": "Hadō #19 — Ryūka (Dragão de Fogo)",
  "cat": "Hadō",
  "custoReiatsu": 8,
  "nivel": "Intermediário",
  "desc": "Cria uma grande massa de fogo espiritual com formato serpentino que persegue o oponente.",
  "incant": "Chama sem forma, encontre um corpo. Céu sem voz, encontre um rugido."
}, {
  "id": "h20",
  "numero": 20,
  "nome": "Hadō #20 — Kōten (Explosão Celeste)",
  "cat": "Hadō",
  "custoReiatsu": 8,
  "nivel": "Intermediário",
  "desc": "Concentra uma grande quantidade de energia espiritual em um ponto e libera uma detonação esférica.",
  "incant": "Todo poder converge para um único ponto. Céu e terra, testemunhem o impacto."
}, {
  "id": "h31",
  "numero": 31,
  "nome": "Hadō #31 — Shakkahō (Tiro de Fogo Vermelho)",
  "cat": "Hadō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Gera e dispara uma esfera de chamas vermelhas de alta potência e raio explosivo.",
  "incant": "Ó, praticante! Dispersai-vos, rastejai! Queimai a terra e tragai a cinza!"
}, {
  "id": "h33",
  "numero": 33,
  "nome": "Hadō #33 — Sōkatsui (Chuva Azul do Vazio)",
  "cat": "Hadō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Dispara uma torrente avassaladora de energia espiritual azul a partir da palma aberta.",
  "incant": "Ó, governante! Máscara de carne e sangue, toda a criação, o bater de asas..."
}, {
  "id": "h54",
  "numero": 54,
  "nome": "Hadō #54 — Haien (Chamas da Abolição)",
  "cat": "Hadō",
  "custoReiatsu": 10,
  "nivel": "Avançado",
  "desc": "Dispara uma onda de fogo roxo que incinera e desintegra a matéria ao menor contato.",
  "incant": "—"
}, {
  "id": "h63",
  "numero": 63,
  "nome": "Hadō #63 — Raikōhō (Canhão do Trovão)",
  "cat": "Hadō",
  "custoReiatsu": 13,
  "nivel": "Avançado",
  "desc": "Invoca um gigantesco trovão amarelo concentrado que explode com estrondo sísmico.",
  "incant": "Salpicado nos ossos da besta! Torre afiada, cristal vermelho, anel de aço..."
}, {
  "id": "h73",
  "numero": 73,
  "nome": "Hadō #73 — Sōren Sōkatsui (Lótus Azul Gêmeo)",
  "cat": "Hadō",
  "custoReiatsu": 16,
  "nivel": "Mestre",
  "desc": "Versão dupla e devastadora do Sōkatsui disparada com ambas as mãos em sincronia.",
  "incant": "Máscara de carne e sangue... Coroai com o nome de humano o abismo sem fim!"
}, {
  "id": "h88",
  "numero": 88,
  "nome": "Hadō #88 — Hiryū Gekizoku Shinten Raihō",
  "cat": "Hadō",
  "custoReiatsu": 20,
  "nivel": "Classe Especial",
  "desc": "Um colossal canhão de relâmpagos espirituais capaz de perfurar fortalezas inteiras.",
  "incant": "Rugido do dragão celeste, queime o firmamento até a última partícula!"
}, {
  "id": "h90",
  "numero": 90,
  "nome": "Hadō #90 — Kurohitsugi (Caixão Negro)",
  "cat": "Hadō",
  "custoReiatsu": 25,
  "nivel": "Classe Especial",
  "desc": "Cria uma caixa cúbica de gravidade negra ao redor do alvo perfurando-o com incontáveis lanças espirituais.",
  "incant": "Transborde, recipiente do caos! Cão louco e insolente, perca a razão..."
}, {
  "id": "k1",
  "numero": 1,
  "nome": "Kaidō #1 — Shōmei (Iluminação Diagnóstica)",
  "cat": "Kaidō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Revela ferimentos ocultos, venenos e perturbações espirituais no corpo do paciente.",
  "incant": "Luz suave, encontre aquilo que foi ferido."
}, {
  "id": "k2",
  "numero": 2,
  "nome": "Kaidō #2 — Yasuragi (Tranquilidade)",
  "cat": "Kaidō",
  "custoReiatsu": 3,
  "nivel": "Básico",
  "desc": "Reduz dores e desconforto, ajudando o paciente a permanecer consciente e estável.",
  "incant": "Respire. Silencie a dor. Deixe o espírito encontrar repouso."
}, {
  "id": "k3",
  "numero": 3,
  "nome": "Kaidō #3 — Seimei Ito (Fio Vital)",
  "cat": "Kaidō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Estabiliza temporariamente a condição espiritual e o pulso de uma pessoa ferida.",
  "incant": "Fio que une corpo e alma, permaneça firme."
}, {
  "id": "k4",
  "numero": 4,
  "nome": "Kaidō #4 — Kōmyō (Luz Serena)",
  "cat": "Kaidō",
  "custoReiatsu": 4,
  "nivel": "Básico",
  "desc": "Acelera a regeneração de cortes superficiais, escoriações e sangramentos rápidos.",
  "incant": "Onde existe ferida, que exista luz. Onde existe fraqueza, que exista calma."
}, {
  "id": "k5",
  "numero": 5,
  "nome": "Kaidō #5 — Shinkei (Restauração Neural)",
  "cat": "Kaidō",
  "custoReiatsu": 5,
  "nivel": "Básico",
  "desc": "Ajuda a reanimar terminações nervosas e recuperar movimentos prejudicados por lesões ou dormência.",
  "incant": "Desperte os caminhos adormecidos e faça o corpo lembrar seus próprios movimentos."
}, {
  "id": "k6",
  "numero": 6,
  "nome": "Kaidō #6 — Seika (Purificação de Impurezas)",
  "cat": "Kaidō",
  "custoReiatsu": 5,
  "nivel": "Básico",
  "desc": "Remove pequenas impurezas espirituais, toxinas leves e energia residual acumulada.",
  "incant": "Aquilo que não pertence ao corpo, deixe-o. Aquilo que pertence, permaneça."
}, {
  "id": "k7",
  "numero": 7,
  "nome": "Kaidō #7 — Kokyū (Respiração Guiada)",
  "cat": "Kaidō",
  "custoReiatsu": 5,
  "nivel": "Básico",
  "desc": "Auxilia na recuperação da respiração e estabiliza o fluxo de ar e Reiryoku nos pulmões.",
  "incant": "Ar entre os mundos, entre neste corpo e devolva-lhe o ritmo."
}, {
  "id": "k8",
  "numero": 8,
  "nome": "Kaidō #8 — Shirohana (Flor Branca de Cura)",
  "cat": "Kaidō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Cria uma pequena flor espiritual sobre o ferimento que absorve a dor e acelera a cicatrização.",
  "incant": "Pequena flor, abra-se sobre a ferida e carregue consigo a dor."
}, {
  "id": "k9",
  "numero": 9,
  "nome": "Kaidō #9 — Kekkai Seimei (Barreira Vital)",
  "cat": "Kaidō",
  "custoReiatsu": 6,
  "nivel": "Intermediário",
  "desc": "Cria uma película espiritual protetora ao redor de uma lesão grave, impedindo hemorragias.",
  "incant": "Erga-se ao redor da vida. Não permita que a ferida avance."
}, {
  "id": "k10",
  "numero": 10,
  "nome": "Kaidō #10 — Chiyu (Cura de Tecidos Profundos)",
  "cat": "Kaidō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Acelera significativamente a recuperação de ferimentos musculares moderados e fraturas parciais.",
  "incant": "Corpo ferido, espírito cansado. Reúna aquilo que ainda permanece."
}, {
  "id": "k11",
  "numero": 11,
  "nome": "Kaidō #11 — Seimei Kōro (Caminho Vital)",
  "cat": "Kaidō",
  "custoReiatsu": 7,
  "nivel": "Intermediário",
  "desc": "Reorganiza os meridianos e o fluxo espiritual do paciente após sofrer choques de Reiatsu.",
  "incant": "Que cada caminho volte a encontrar seu destino. Que cada fluxo retorne ao seu curso."
}, {
  "id": "k12",
  "numero": 12,
  "nome": "Kaidō #12 — Kōshin (Renovação de Vigor)",
  "cat": "Kaidō",
  "custoReiatsu": 8,
  "nivel": "Intermediário",
  "desc": "Revigora a estamina e devolve energia física a guerreiros exaustos após combates longos.",
  "incant": "Aquilo que foi gasto, encontre repouso. Aquilo que foi quebrado, encontre forma."
}, {
  "id": "k13",
  "numero": 13,
  "nome": "Kaidō #13 — Reishō (Pulso Espiritual)",
  "cat": "Kaidō",
  "custoReiatsu": 8,
  "nivel": "Intermediário",
  "desc": "Sincroniza o batimento cardíaco da alma com a Reiatsu pura, revertendo quadros de choque.",
  "incant": "Um pulso chama outro. Que a alma encontre seu próprio ritmo."
}, {
  "id": "k14",
  "numero": 14,
  "nome": "Kaidō #14 — Shōka (Purificação Residual)",
  "cat": "Kaidō",
  "custoReiatsu": 9,
  "nivel": "Avançado",
  "desc": "Extrai e purifica resíduos cáusticos de venenos complexos e energias corrosivas de Hadō.",
  "incant": "Dor que permanece, deixe o corpo. Energia estranha, abandone a carne."
}, {
  "id": "k15",
  "numero": 15,
  "nome": "Kaidō #15 — Meimei (Pulso de Vida Emergencial)",
  "cat": "Kaidō",
  "custoReiatsu": 10,
  "nivel": "Avançado",
  "desc": "Estabiliza alguém em estado físico gravemente debilitado, impedindo a morte iminente.",
  "incant": "Enquanto houver chama, haverá caminho. Enquanto houver espírito, haverá retorno."
}, {
  "id": "k16",
  "numero": 16,
  "nome": "Kaidō #16 — Hikari no Ito (Sutura de Luz)",
  "cat": "Kaidō",
  "custoReiatsu": 11,
  "nivel": "Avançado",
  "desc": "Fios espirituais de luz ligam tendões rompidos, vasos e tecidos danificados com precisão cirúrgica.",
  "incant": "Fios de luz, atravessem a ferida. Unam aquilo que foi separado."
}, {
  "id": "k17",
  "numero": 17,
  "nome": "Kaidō #17 — Seishin Nagashi (Transfusão de Reiryoku)",
  "cat": "Kaidō",
  "custoReiatsu": 12,
  "nivel": "Avançado",
  "desc": "Transfere uma quantidade controlada e segura de energia espiritual pura para reanimar um aliado.",
  "incant": "Que minha energia encontre teu caminho e leve consigo aquilo que pesa."
}, {
  "id": "k18",
  "numero": 18,
  "nome": "Kaidō #18 — Kōmyaku (Veias de Luz)",
  "cat": "Kaidō",
  "custoReiatsu": 14,
  "nivel": "Avançado",
  "desc": "Restaura redes neurais e espirituais destruídas por técnicas de alta voltagem ou veneno.",
  "incant": "Que a luz percorra cada caminho. Que nenhum fluxo permaneça perdido."
}, {
  "id": "k19",
  "numero": 19,
  "nome": "Kaidō #19 — Saisei Hana (Lótus da Regeneração)",
  "cat": "Kaidō",
  "custoReiatsu": 16,
  "nivel": "Mestre",
  "desc": "Acelera profundamente a reconstrução celular de ossos e órgãos vitais com Reiryoku sustentado.",
  "incant": "Daquilo que foi perdido, faça nascer novamente a forma."
}, {
  "id": "k20",
  "numero": 20,
  "nome": "Kaidō #20 — Shōmei Seikai (Luz da Vida Primordial)",
  "cat": "Kaidō",
  "custoReiatsu": 20,
  "nivel": "Classe Especial",
  "desc": "O pináculo da medicina espiritual do 4º Esquadrão capaz de salvar um guerreiro à beira do abismo.",
  "incant": "Luz que atravessa corpo e alma, encontre aquilo que ainda pode ser salvo."
}];

// =========================================================================
// 100% ORIGINAL & AUTORIAL UNIQUE ZANPAKUTŌ ENGINE (MASTER POOL OF 60 BLADES)
// =========================================================================

const MASTER_ZANPAKUTO_CATALOG = [{
  "id": "zk-01",
  "numero": "01",
  "nome": "Kurotsubaki",
  "kanji": "「黒椿」",
  "traducao": "A Camélia Negra",
  "nomeCompleto": "Kurotsubaki 「黒椿」— A Camélia Negra",
  "espirito": "Uma mulher alta, de aparência madura, vestida com um quimono preto coberto por pétalas de camélia. Seu rosto é parcialmente escondido por um véu. Ela passa a maior parte do tempo sentada em um jardim completamente sem cor, cuidando de uma única árvore.",
  "comando": "Floresça no silêncio, Kurotsubaki.",
  "elemento": "Vácuo Cinético & Pétalas Negras",
  "formatoArma": "A katana perde a lâmina tradicional e se transforma em uma espada fina, negra, com uma guarda circular semelhante a uma flor. Pequenas pétalas negras começam a surgir ao redor do usuário sempre que ele movimenta a espada. As pétalas não são simplesmente decorativas: elas permanecem suspensas no ambiente por alguns segundos.",
  "poder": "Jardim do Último Instante: O usuário pode fazer as pétalas absorverem o movimento de qualquer coisa que toquem. Uma pessoa que atravessa uma pétala sente seu movimento diminuir brevemente. Um golpe pode perder velocidade. Uma flecha pode praticamente parar. Limitação: as pétalas só conseguem armazenar uma quantidade limitada de movimento. Quando o limite é atingido, elas desaparecem.",
  "bankai": {
    "nome": "Kurotsubaki — Shūen Teien",
    "kanji": "「黒椿・終焉庭園」",
    "traducao": "Jardim do Fim",
    "nomeCompleto": "Bankai — Kurotsubaki 「黒椿・終焉庭園」 (Shūen Teien — Jardim do Fim)",
    "comando": "Bankai — Kurotsubaki, Shūen Teien!",
    "formatoArma": "Todas as pétalas existentes se transformam em árvores negras gigantescas. O campo de batalha inteiro vira um jardim silencioso e monocromático sob uma penumbra espiritual.",
    "poder": "Redistribuição Absoluta do Movimento: O usuário agora pode redistribuir o movimento armazenado. Pode retirar velocidade de uma coisa e transferi-la para outra. Por exemplo: uma espada inimiga perde velocidade → uma estocada do usuário recebe essa velocidade. A grande evolução é que a Shikai armazena, enquanto a Bankai redistribui livremente no domínio do jardim."
  }
}, {
  "id": "zk-02",
  "numero": "02",
  "nome": "Akagane",
  "kanji": "「赤鋼」",
  "traducao": "Aço Vermelho",
  "nomeCompleto": "Akagane 「赤鋼」— Aço Vermelho",
  "espirito": "Um ferreiro gigantesco sem rosto, com o corpo coberto por placas metálicas e um enorme avental. Em vez de mãos, possui martelos. Ele nunca fala; responde apenas golpeando uma bigorna espiritual ancestral.",
  "comando": "Forje aquilo que ainda não existe, Akagane.",
  "elemento": "Aço Carmesim & Refinamento Cinético",
  "formatoArma": "A espada se desfaz em várias placas metálicas vermelhas que envolvem o braço direito do usuário, formando uma manopla reforçada e antebraço blindado de combate pesado.",
  "poder": "Memória do Impacto: Cada golpe recebido pela armadura é parcialmente armazenado. Quanto mais impactos recebe, mais energia cinética a armadura acumula. O usuário pode liberar essa energia através do próximo golpe. Limitação: se acumular energia demais além da sua capacidade física, a própria armadura começa a sobreaquecer e prejudicar o usuário.",
  "bankai": {
    "nome": "Akagane — Hyakurenro",
    "kanji": "「赤鋼・百錬炉」",
    "traducao": "Forja das Cem Temperas",
    "nomeCompleto": "Bankai — Akagane 「赤鋼・百錬炉」 (Hyakurenro — Forja das Cem Temperas)",
    "comando": "Bankai — Akagane, Hyakurenro!",
    "formatoArma": "A armadura de aço vermelho cobre todo o corpo do usuário e surge uma enorme fornalha espiritual incandescente flutuando atrás dele.",
    "poder": "Refinamento & Conversão Metabólica de Energia: Os impactos agora são refinados pela fornalha. Cada golpe recebido ou trocado consecutivamente transforma a energia acumulada em bônus direto de força, velocidade, resistência ou impulso destrutivo. Requer que o usuário mantenha o ritmo de combate contínuo; se parar de lutar por muito tempo, a energia refinada se dissipa."
  }
}, {
  "id": "zk-03",
  "numero": "03",
  "nome": "Suisen",
  "kanji": "「水仙」",
  "traducao": "Narciso",
  "nomeCompleto": "Suisen 「水仙」— Narciso",
  "espirito": "Um garoto extremamente pálido, vestido como um bailarino clássico, que vive em um salão imenso cheio de espelhos cobertos por água rasa e pétalas brancas.",
  "comando": "Olhe para si mesmo, Suisen.",
  "elemento": "Espelhos Líquidos & Translocação",
  "formatoArma": "A lâmina se transforma em uma espada extremamente fina e prateada de superfície fluida e líquida. Sempre que alguém olha diretamente para ela, vê seu próprio reflexo distorcido em ondas aquáticas.",
  "poder": "Reflexo Falso: O usuário pode criar cópias ilusórias táteis de movimentos que acabou de realizar. Se ele atacar para a esquerda, um reflexo pode repetir o movimento simultaneamente pela direita para confundir a percepção e tempo de reação do oponente.",
  "bankai": {
    "nome": "Suisen — Senkyō Kairō",
    "kanji": "「水仙・千鏡回廊」",
    "traducao": "Corredor das Mil Imagens",
    "nomeCompleto": "Bankai — Suisen 「水仙・千鏡回廊」 (Senkyō Kairō — Corredor das Mil Imagens)",
    "comando": "Bankai — Suisen, Senkyō Kairō!",
    "formatoArma": "O campo inteiro se transforma em um labirinto monumental de espelhos líquidos flutuantes que refletem a luz e a imagem do usuário em 360 graus.",
    "poder": "Translocação Reflexiva Instantânea: A Bankai se torna uma técnica suprema de mobilidade e reposicionamento. O usuário pode trocar de posição instantaneamente com qualquer reflexo ativo no campo. Limitação: cada troca consome e destrói o espelho reflexivo utilizado."
  }
}, {
  "id": "zk-04",
  "numero": "04",
  "nome": "Hoshikuzu",
  "kanji": "「星屑」",
  "traducao": "Poeira Estelar",
  "nomeCompleto": "Hoshikuzu 「星屑」— Poeira Estelar",
  "espirito": "Uma pequena criatura humanoide coberta por um manto azul-escuro cósmico. Seu corpo parece conter uma galáxia de estrelas reluzentes. Ela fala como uma criança curiosa e habita uma ilha flutuante no vazio celestial.",
  "comando": "Desperte no céu, Hoshikuzu.",
  "elemento": "Gravidade Orbital & Luz Cósmica",
  "formatoArma": "A espada se fragmenta em dezenas de pequenos cristais luminosos azulados que orbitam em círculos contínuos ao redor do portador.",
  "poder": "Órbita Curvilínea: Os fragmentos podem alterar bruscamente sua trajetória no ar sem perder aceleração. O usuário pode arremessar cristais que realizam curvas impossíveis em torno de obstáculos e criam pontos de ancoragem para saltos aéreos.",
  "bankai": {
    "nome": "Hoshikuzu — Tenkan",
    "kanji": "「星屑・天環」",
    "traducao": "Anel Celestial",
    "nomeCompleto": "Bankai — Hoshikuzu 「星屑・天環」 (Tenkan — Anel Celestial)",
    "comando": "Bankai — Hoshikuzu, Tenkan!",
    "formatoArma": "Os fragmentos de cristal se multiplicam em milhares e formam gigantescos anéis luminosos concêntricos que giram por todo o perímetro da arena.",
    "poder": "Controle Absoluto de Trajetórias: O usuário define eixos de atração gravitacional. Qualquer projétil, técnica de Reiryoku ou adversário que entre em uma das órbitas é forçado a seguir a trajetória circular do anel, permitindo defletir ataques maciços e reposicionar inimigos à vontade."
  }
}, {
  "id": "zk-05",
  "numero": "05",
  "nome": "Kōriame",
  "kanji": "「氷雨」",
  "traducao": "Chuva Congelada",
  "nomeCompleto": "Kōriame 「氷雨」— Chuva Congelada",
  "espirito": "Uma senhora idosa de olhar triste e passos lentos carregando um guarda-chuva de seda branca, habitando uma cidade melancólica onde chove sem parar.",
  "comando": "Chore sobre este mundo, Kōriame.",
  "elemento": "Água Pesada & Inércia Glacial",
  "formatoArma": "A espada vira um guarda-chuva metálico branco reforçado com uma lâmina de estocada na ponta. Quando aberto, uma fina chuva espiritual começa a precipitar continuamente sobre a área.",
  "poder": "Gotas de Peso Inercial: Cada gota de chuva que toca um objeto ou pessoa aumenta progressivamente sua inércia física. O alvo atinge cada vez mais resistência para acelerar, saltar ou mudar bruscamente de rumo durante a movimentação.",
  "bankai": {
    "nome": "Kōriame — Hakusōten",
    "kanji": "「氷雨・白葬天」",
    "traducao": "Céu do Funeral Branco",
    "nomeCompleto": "Bankai — Kōriame 「氷雨・白葬天」 (Hakusōten — Céu do Funeral Branco)",
    "comando": "Bankai — Kōriame, Hakusōten!",
    "formatoArma": "O firmamento escurece sob nuvens cinzentas colossais e uma tempestade torrencial de gotas prateadas cobre quilômetros de distância.",
    "poder": "Manipulação Vetorial da Resistência Espacial: O usuário dita qual direção do espaço sofrerá maior resistência hidrostática. Pode fazer avanços frontais ficarem dez vezes mais lentos, golpes verticais perderem impacto e passos de fuga se tornarem exaustivos, ditando o ritmo da batalha."
  }
}, {
  "id": "zk-06",
  "numero": "06",
  "nome": "Kagamibana",
  "kanji": "「鏡花」",
  "traducao": "Flor do Espelho",
  "nomeCompleto": "Kagamibana 「鏡花」— Flor do Espelho",
  "espirito": "Uma mulher sem olhos com flores de vidro e cristais crescendo pelos longos cabelos escuros, vivendo dentro de uma estufa repleta de espelhos estilhaçados.",
  "comando": "Reflita aquilo que deveria ser esquecido, Kagamibana.",
  "elemento": "Distorção de Probabilidade & Vidro",
  "formatoArma": "A lâmina se torna transparente como vidro puro, com uma superfície que parece um mosaico de espelhos trincados.",
  "poder": "Fragmento de Possibilidade: Quando um ataque inimigo passa a curta distância, o usuário pode criar uma réplica alternativa daquele instante. Por alguns segundos, ele pode optar por validar o acontecimento real ou o fragmento alternativo criado, mitigando golpes fatais.",
  "bankai": {
    "nome": "Kagamibana — Banshō Shakai",
    "kanji": "「鏡花・万象写界」",
    "traducao": "Mundo que Copia Todas as Coisas",
    "nomeCompleto": "Bankai — Kagamibana 「鏡花・万象写界」 (Banshō Shakai — Mundo que Copia Todas as Coisas)",
    "comando": "Bankai — Kagamibana, Banshō Shakai!",
    "formatoArma": "Todo o chão, céu e atmosfera ganham o reflexo límpido de espelhos planos perfeitos.",
    "poder": "Divergência Quântica de Realidade: O usuário manifesta múltiplos caminhos de ação simultâneos para um mesmo ataque ou esquiva. Ele ataca por 3 ângulos distintos ao mesmo tempo e escolhe qual deles colidirá fisicamente com o oponente no momento do impacto."
  }
}, {
  "id": "zk-07",
  "numero": "07",
  "nome": "Mukade",
  "kanji": "「百足」",
  "traducao": "Centopeia",
  "nomeCompleto": "Mukade 「百足」— Centopeia",
  "espirito": "Uma criatura esguia e longa com dezenas de braços articulados segurando pequenas adagas serrilhadas e vestindo uma máscara de osso que lembra um exoesqueleto de inseto.",
  "comando": "Multiplique-se pelo caminho, Mukade.",
  "elemento": "Lâminas Articuladas & Encadear Contínuo",
  "formatoArma": "A katana se divide em múltiplas lâminas segmentadas unidas por correntes de elos flexíveis de aço, controláveis individualmente através da empunhadura.",
  "poder": "Ataque Encadeado: Cada golpe consecutivo bem-sucedido permite reposicionar outra lâmina sem tempo de recuo. Quanto maior a sequência contínua de acertos, mais ângulos de ataque se abrem simultaneamente. Limitação: errar um golpe quebra a cadeia e recolhe as lâminas.",
  "bankai": {
    "nome": "Mukade — Mukyū Renjin",
    "kanji": "「百足・無窮連刃」",
    "traducao": "Lâminas da Corrente Infinita",
    "nomeCompleto": "Bankai — Mukade 「百足・無窮連刃」 (Mukyū Renjin — Lâminas da Corrente Infinita)",
    "comando": "Bankai — Mukade, Mukyū Renjin!",
    "formatoArma": "As lâminas se multiplicam em centenas de gumes segmentados formando uma rede viva e autônoma de aço ao redor da arena.",
    "poder": "Cadeia Autônoma de Resposta Cinética: O usuário não precisa controlar cada lâmina manualmente. A Bankai lê o último vetor de impacto e projeta automaticamente sucessões de cortes em cascata prevendo as rotas de fuga do oponente."
  }
}, {
  "id": "zk-08",
  "numero": "08",
  "nome": "Yūreiishi",
  "kanji": "「幽霊石」",
  "traducao": "Pedra Fantasma",
  "nomeCompleto": "Yūreiishi 「幽霊石」— Pedra Fantasma",
  "espirito": "Uma criança parcialmente translúcida de olhar calmo sentada sobre uma enorme rocha negra que flutua no vazio, sempre cercada por pequenas almas errantes.",
  "comando": "Permaneça onde ninguém pode tocar, Yūreiishi.",
  "elemento": "Âncoras Espaciais & Teletransporte",
  "formatoArma": "A lâmina da espada desaparece por completo. No lugar dela, pequenas pedras negras de densidade nula orbitam suavemente as mãos do portador.",
  "poder": "Âncoras Espirituais: O usuário pode posicionar as pedras no espaço como âncoras fixas e saltar instantaneamente até a coordenada de qualquer pedra ativa (possui limite de distância e quantidade de âncoras simultâneas).",
  "bankai": {
    "nome": "Yūreiishi — Hyakki Kyō",
    "kanji": "「幽霊石・百鬼境」",
    "traducao": "Território das Cem Almas",
    "nomeCompleto": "Bankai — Yūreiishi 「幽霊石・百鬼境」 (Hyakki Kyō — Território das Cem Almas)",
    "comando": "Bankai — Yūreiishi, Hyakki Kyō!",
    "formatoArma": "Centenas de pedras negras monumentais flutuam em toda a extensão do campo de batalha como um labirinto suspenso.",
    "poder": "Malha Espacial Transcendente: O usuário pode translocar-se instantaneamente entre qualquer uma das pedras sem atraso de movimento, criando sequências de ataque de ângulos omnidirecionais. Custo de Reiryoku escala com o número de saltos contínuos."
  }
}, {
  "id": "zk-09",
  "numero": "09",
  "nome": "Raimei",
  "kanji": "「雷鳴」",
  "traducao": "Trovão",
  "nomeCompleto": "Raimei 「雷鳴」— Trovão",
  "espirito": "Um guerreiro colossal com máscara tradicional de teatro Noh, cujo corpo de bronze é percorrido por fissuras luminosas pulsantes como eletricidade crua.",
  "comando": "Faça o céu responder, Raimei.",
  "elemento": "Ressonância Sísmico-Elétrica",
  "formatoArma": "A lâmina adquire formato em zigue-zague irregular e a empunhadura emite pulsos de vibração sonora e elétrica em frequências constantes.",
  "poder": "Ressonância Harmônica: Cada movimento ritmado do portador gera uma onda de vibração cumulativa. Manter a cadência de golpes faz o Reiryoku entrar em ressonância, permitindo que o golpe seguinte descarregue toda a energia acumulada em uma explosão de choque.",
  "bankai": {
    "nome": "Raimei — Gōtenritsu",
    "kanji": "「雷鳴・轟天律」",
    "traducao": "Lei do Céu Trovejante",
    "nomeCompleto": "Bankai — Raimei 「雷鳴・轟天律」 (Gōtenritsu — Lei do Céu Trovejante)",
    "comando": "Bankai — Raimei, Gōtenritsu!",
    "formatoArma": "O campo é coberto por pilares de trovão que ressoam como um metrônomo cósmico em compassos visíveis de relâmpago.",
    "poder": "Cadência Absoluta de Combate: A Bankai premia a sincronização rítmica. Ações executadas precisamente dentro do pulso do trovão ganham o dobro de velocidade e poder perfurante; atacar fora do compasso dissipa a ressonância e atordoa o usuário."
  }
}, {
  "id": "zk-10",
  "numero": "10",
  "nome": "Shirogane",
  "kanji": "「白銀」",
  "traducao": "Prata Branca",
  "nomeCompleto": "Shirogane 「白銀」— Prata Branca",
  "espirito": "Um cavaleiro sem rosto com armadura de prata imaculada e polida que carrega uma gigantesca balança de pratos no lugar de uma espada de guerra.",
  "comando": "Pese aquilo que existe, Shirogane.",
  "elemento": "Equilíbrio & Redistribuição de Vantagens",
  "formatoArma": "Uma espada longa prateada de gume reto cuja guarda possui o formato esculpido de uma balança de precisão.",
  "poder": "Equilíbrio Proporcional: Detecta a disparidade física ou espiritual no choque de armas. O portador pode reduzir temporariamente uma vantagem do oponente (como força bruta), mas deve abrir mão de uma fração proporcional de outra vantagem própria para manter o equilíbrio.",
  "bankai": {
    "nome": "Shirogane — Tenbin Kai",
    "kanji": "「白銀・天秤界」",
    "traducao": "Domínio da Balança Celestial",
    "nomeCompleto": "Bankai — Shirogane 「白銀・天秤界」 (Tenbin Kai — Domínio da Balança Celestial)",
    "comando": "Bankai — Shirogane, Tenbin Kai!",
    "formatoArma": "Uma monumental balança espiritual dourada e prateada surge sobre as nuvens dominando todo o campo de batalha.",
    "poder": "Gerenciamento Universal de Atributos: O usuário pode comparar e redistribuir parâmetros (força, velocidade, pressão espiritual e resistência). Pode sacrificar sua velocidade para aumentar drasticamente sua resistência física, ou equalizar a força do inimigo à sua própria."
  }
}, {
  "id": "zk-11",
  "numero": "11",
  "nome": "Suminawa",
  "kanji": "「墨縄」",
  "traducao": "Corda de Nanquim",
  "nomeCompleto": "Suminawa 「墨縄」— Corda de Nanquim",
  "espirito": "Um calígrafo cego de longas vestes manchadas que traça kanjis no ar com um pincel gigante feito de cabelos de espíritos antigos.",
  "comando": "Trace os limites do abismo, Suminawa.",
  "elemento": "Nanquim Espiritual & Contenção Espacial",
  "formatoArma": "A lâmina se transforma em uma espada com ranhuras que liberam nanquim negro viscoso. Cada golpe no ar deixa traços de tinta sólida suspensos que atuam como cordas tensionadas de retenção.",
  "poder": "Traço Restritivo: Os traços de nanquim no ar endurecem como cabos de aço ao menor contato de corpos ou lâminas, travando a trajetória de golpes e membros do inimigo. Limitação: as cordas de tinta se desfazem após absorverem impactos de alta Reiryoku.",
  "bankai": {
    "nome": "Suminawa — Banshō Emaki",
    "kanji": "「墨縄・万象絵巻」",
    "traducao": "Rolo Pintado de Todas as Coisas",
    "nomeCompleto": "Bankai — Suminawa 「墨縄・万象絵巻」 (Banshō Emaki — Rolo Pintado de Todas as Coisas)",
    "comando": "Bankai — Suminawa, Banshō Emaki!",
    "formatoArma": "O campo se torna um gigantesco pergaminho tridimensional em preto e branco onde o portador empunha uma espada-pincel colossal de nanquim puro.",
    "poder": "Corte Bidimensional no Espaço Tridimensional: Qualquer corte ou traço feito no ar pelo usuário se manifesta instantaneamente em qualquer superfície ou corpo que esteja alinhado na perspectiva visual do pergaminho, ignorando distância física."
  }
}, {
  "id": "zk-12",
  "numero": "12",
  "nome": "Utsusemi",
  "kanji": "「空蝉」",
  "traducao": "Casca da Cigarra",
  "nomeCompleto": "Utsusemi 「空蝉」— Casca da Cigarra",
  "espirito": "Um monge silencioso coberto por túnicas de seda ressecada e folhas quebradiças que se despedaçam ao menor toque, revelando vazio em seu interior.",
  "comando": "Abandone a forma passageira, Utsusemi.",
  "elemento": "Muda Corporal & Evasão Residual",
  "formatoArma": "A lâmina se torna translúcida com tonalidade âmbar, emitindo um estalido oco e seco a cada oscilação no ar.",
  "poder": "Casca Oca Residual: Ao receber um golpe direto que causaria ferimento grave, o usuário deixa para trás uma casca perfeita de Reiryoku que absorve o impacto total enquanto seu corpo real recua 3 metros ileso (uma vez por confronto próximo).",
  "bankai": {
    "nome": "Utsusemi — Senkaku Zankyō",
    "kanji": "「空蝉・千殻残響」",
    "traducao": "Ecos dos Mil Casulos Vazios",
    "nomeCompleto": "Bankai — Utsusemi 「空蝉・千殻残響」 (Senkaku Zankyō — Ecos dos Mil Casulos Vazios)",
    "comando": "Bankai — Utsusemi, Senkaku Zankyō!",
    "formatoArma": "Dezenas de casulos âmbar translúcidos flutuam por toda a área como estátuas ocas perfeitas do portador.",
    "poder": "Retenção e Refração de Impacto: Cada casulo acumula a memória cinética e espiritual dos golpes que o atingiram. O usuário pode detonar ou rebater a força armazenada nesses casulos diretamente contra quem se aproximar deles."
  }
}, {
  "id": "zk-13",
  "numero": "13",
  "nome": "Kagaribi",
  "kanji": "「篝火」",
  "traducao": "Fogueira Noturna",
  "nomeCompleto": "Kagaribi 「篝火」— Fogueira Noturna",
  "espirito": "Um sentinela com elmo de ferro antigo segurando uma lanterna sem chama onde ardem apenas fagulhas de cinza espiritual imortal.",
  "comando": "Revele as sombras da vigília, Kagaribi.",
  "elemento": "Brasas Reveladoras & Consumo Mágico",
  "formatoArma": "Uma lâmina curva acoplada a um pequeno braseiro de ferro no pomo que desprende fagulhas douradas contínuas.",
  "poder": "Luz da Intenção: Qualquer fonte de Reiryoku, ataque invisível ou preparação de feitiço dentro do raio iluminado pelas fagulhas tem sua densidade e trajetória expostas antes de ser desferido.",
  "bankai": {
    "nome": "Kagaribi — Yahan Enjin",
    "kanji": "「篝火・夜半炎陣」",
    "traducao": "Círculo de Chamas da Meia-Noite",
    "nomeCompleto": "Bankai — Kagaribi 「篝火・夜半炎陣」 (Yahan Enjin — Círculo de Chamas da Meia-Noite)",
    "comando": "Bankai — Kagaribi, Yahan Enjin!",
    "formatoArma": "Uma colossal fogueira espiritual arde no centro da arena projetando pilares de chamas translúcidas.",
    "poder": "Combustão de Feitiços & Dreno de Kidō: As chamas não queimam matéria orgânica, mas consomem vorazmente qualquer Reiryoku moldado em técnicas mágicas (Hadō/Bakudō), reduzindo o poder de feitiços inimigos proporcionalmente ao tempo gasto na luz."
  }
}, {
  "id": "zk-14",
  "numero": "14",
  "nome": "Senritsu",
  "kanji": "「旋律」",
  "traducao": "Melodia Silenciosa",
  "nomeCompleto": "Senritsu 「旋律」— Melodia Silenciosa",
  "espirito": "Uma dama etérea sentada sobre um lago sereno tocando uma cítara cujas cordas invisíveis vibram na frequência do vento.",
  "comando": "Toque aquilo que não tem voz, Senritsu.",
  "elemento": "Frequência Acústica & Interferência Neural",
  "formatoArma": "Uma espada esguia e brilhante com pequenas aberturas ao longo do dorso que assobiam em notas musicais precisas ao golpear.",
  "poder": "Harmonia Desestabilizadora: Cada defesa ou aparo com a lâmina produz um tom sonoro que ressoa nas terminações nervosas do braço atacante, causando dormência passageira e perda temporária de empunhadura.",
  "bankai": {
    "nome": "Senritsu — Zekkyō Shūkyoku",
    "kanji": "「旋律・絶響終曲」",
    "traducao": "Réquiem da Ressonância Final",
    "nomeCompleto": "Bankai — Senritsu 「旋律・絶響終曲」 (Zekkyō Shūkyoku — Réquiem da Ressonância Final)",
    "comando": "Bankai — Senritsu, Zekkyō Shūkyoku!",
    "formatoArma": "O ar do ambiente inteiro vibra como uma caixa de ressonância com cordas de luz prateada cruzando a atmosfera.",
    "poder": "Sincronização Cardiopulmonar Obrigatória: A Bankai sintoniza a respiração e os batimentos cardíacos do oponente com o andamento musical da espada. Qualquer ataque ou movimento brusco fora do ritmo imposto causa contração dolorosa nos órgãos internos."
  }
}, {
  "id": "zk-15",
  "numero": "15",
  "nome": "Kagehōshi",
  "kanji": "「影法師」",
  "traducao": "Silhueta na Sombra",
  "nomeCompleto": "Kagehōshi 「影法師」— Silhueta na Sombra",
  "espirito": "Uma silhueta sombria sem traços faciais definidos que projeta dois olhos de âmbar fixos no solo e nunca emerge para onde há luz direta.",
  "comando": "Prenda-se ao solo, Kagehōshi.",
  "elemento": "Sombras Vivas & Paralisia Simpática",
  "formatoArma": "Uma katana escura cuja lâmina projeta uma sombra alongada no solo com o dobro do comprimento da espada real.",
  "poder": "Corte da Sombra: Cortar ou cravar a espada na sombra projetada do oponente no chão imobiliza a parte do corpo correspondente pelo tempo em que a lâmina estiver sobre a sombra.",
  "bankai": {
    "nome": "Kagehōshi — Shikkoku Bakukai",
    "kanji": "「影法師・漆黒縛界」",
    "traducao": "Domínio Aprisionador do Ébano",
    "nomeCompleto": "Bankai — Kagehōshi 「影法師・漆黒縛界」 (Shikkoku Bakukai — Domínio Aprisionador do Ébano)",
    "comando": "Bankai — Kagehōshi, Shikkoku Bakukai!",
    "formatoArma": "O chão de toda a arena se liquefaz em um pântano de sombras profundas que refletem as armas dos combatentes.",
    "poder": "Mimetismo Sombrio Agressivo: As sombras projetadas no solo criam cópias independentes das armas e membros dos próprios oponentes, atacando-os a partir de seus próprios pés e restringindo movimentos com tentáculos de Reiryoku negro."
  }
}, {
  "id": "zk-16",
  "numero": "16",
  "nome": "Hakumaku",
  "kanji": "「薄膜」",
  "traducao": "Membrana Translúcida",
  "nomeCompleto": "Hakumaku 「薄膜」— Membrana Translúcida",
  "espirito": "Uma tecelã de vestes alvas que fia véus transparentes e elásticos em uma sala repleta de neblina e gotas de orvalho.",
  "comando": "Estenda a fronteira do ar, Hakumaku.",
  "elemento": "Películas Refratárias & Vetor Elástico",
  "formatoArma": "Uma espada de lâmina polida como água que deixa películas espirituais translúcidas suspensas no ar a cada corte.",
  "poder": "Membrana Defletora: As películas criadas no ar funcionam como superfícies hiperelásticas capazes de desviar projéteis e servir como trampolins de aceleração para mudanças angulares imediatas no Shunpo.",
  "bankai": {
    "nome": "Hakumaku — Tenkyō Shōheki",
    "kanji": "「薄膜・天鏡障壁」",
    "traducao": "Barreira do Espelho Celestial",
    "nomeCompleto": "Bankai — Hakumaku 「薄膜・天鏡障壁」 (Tenkyō Shōheki — Barreira do Espelho Celestial)",
    "comando": "Bankai — Hakumaku, Tenkyō Shōheki!",
    "formatoArma": "Uma monumental bolha translúcida multifacetada encapsula toda a área de combate.",
    "poder": "Inversão Vetorial Total: Qualquer golpe, corpo ou feitiço que colide contra as paredes da membrana externa tem sua velocidade e direção invertidas em 180° com a mesma energia com que tentou romper a barreira."
  }
}, {
  "id": "zk-17",
  "numero": "17",
  "nome": "Haguruma",
  "kanji": "「歯車」",
  "traducao": "Engrenagem do Destino",
  "nomeCompleto": "Haguruma 「歯車」— Engrenagem do Destino",
  "espirito": "Um autômato ancestral de bronze polido com engrenagens e ponteiros expostos no peito que giram ritmicamente marcando segundos silenciosos.",
  "comando": "Engrene o tempo que resta, Haguruma.",
  "elemento": "Mecânica Rotacional & Intervalos Discretos",
  "formatoArma": "Uma espada pesada com gume dentado articulado em engrenagens que giram e acumulam torque a cada contato de aço.",
  "poder": "Torque Acumulativo: Cada colisão bem-sucedida faz as engrenagens girarem mais rápido, aumentando progressivamente a aceleração de corte do golpe seguinte.",
  "bankai": {
    "nome": "Haguruma — Banshō Kokukai",
    "kanji": "「歯車・万象刻界」",
    "traducao": "Mundo dos Ponteiros Eternos",
    "nomeCompleto": "Bankai — Haguruma 「歯車・万象刻界」 (Banshō Kokukai — Mundo dos Ponteiros Eternos)",
    "comando": "Bankai — Haguruma, Banshō Kokukai!",
    "formatoArma": "Monumentais rodas dentadas de bronze e mostradores de relógio flutuam no céu e no solo da arena.",
    "poder": "Ajuste de Intervalos de Ação: O usuário pode retardar ou acelerar os intervalos entre a decisão motora e a execução física do adversário, fazendo com que o inimigo sofra atrasos de frações de segundo na recuperação após cada ataque."
  }
}, {
  "id": "zk-18",
  "numero": "18",
  "nome": "Sasayaki",
  "kanji": "「囁き」",
  "traducao": "Sussurro Noturno",
  "nomeCompleto": "Sasayaki 「囁き」— Sussurro Noturno",
  "espirito": "Uma figura misteriosa com máscara de porcelana sem boca que fala através de ecos simultâneos e sussurros reverberantes.",
  "comando": "Ecoa na mente vazia, Sasayaki.",
  "elemento": "Ruído Psíquico & Supressão de Cânticos",
  "formatoArma": "Uma lâmina de acabamento cinza fosco que não produz som de corte nem reflete luz.",
  "poder": "Interferência Acústica: O choque do aço transmite uma vibração subsônica direta no ouvido interno do oponente, gerando desorientação espacial momentânea.",
  "bankai": {
    "nome": "Sasayaki — Muon Kyōsō",
    "kanji": "「囁き・無音狂噪」",
    "traducao": "Frenesi do Silêncio Enlouquecedor",
    "nomeCompleto": "Bankai — Sasayaki 「囁き・無音狂噪」 (Muon Kyōsō — Frenesi do Silêncio Enlouquecedor)",
    "comando": "Bankai — Sasayaki, Muon Kyōsō!",
    "formatoArma": "Todo o ruído da atmosfera é completamente anulado gerando um vácuo acústico absoluto.",
    "poder": "Bloqueio de Concentração & Encantamentos: Um turbilhão de sussurros psíquicos é projetado diretamente no fluxo mental do inimigo, tornando impossível manter a concentração requerida para cânticos de Kidō ou cálculos táticos refinados."
  }
}, {
  "id": "zk-19",
  "numero": "19",
  "nome": "Enbaku",
  "kanji": "「煙幕」",
  "traducao": "Cortina de Cinzas",
  "nomeCompleto": "Enbaku 「煙幕」— Cortina de Cinzas",
  "espirito": "Um eremita com olhos cor de brasa fumando um cachimbo de bambu escurecido, cercado por cinzas que flutuam sem jamais tocar o chão.",
  "comando": "Asfixie o horizonte, Enbaku.",
  "elemento": "Fumaça Pesada & Asfixia Espiritual",
  "formatoArma": "Uma espada curta que expele continuamente uma névoa espessa de fumaça cinzenta e pesada que rasteja sobre o terreno.",
  "poder": "Fumaça Asfixiante: A fumaça drena a concentração de oxigênio e Reiryoku puro ao redor, dificultando a respiração e enfraquecendo feitiços de Hadō disparados através dela.",
  "bankai": {
    "nome": "Enbaku — Kaijin Tengai",
    "kanji": "「煙幕・灰燼天蓋」",
    "traducao": "Domo das Cinzas Eternas",
    "nomeCompleto": "Bankai — Enbaku 「煙幕・灰燼天蓋」 (Kaijin Tengai — Domo das Cinzas Eternas)",
    "comando": "Bankai — Enbaku, Kaijin Tengai!",
    "formatoArma": "Uma cúpula monumental de cinzas incandescentes cobre toda a arena de combate.",
    "poder": "Solidificação Instantânea de Fumaça: Toda a fumaça ambiente pode ser condensada instantaneamente em agulhas sólidas afiadas, paredes de contenção ou lâminas de impacto sob o comando do usuário."
  }
}, {
  "id": "zk-20",
  "numero": "20",
  "nome": "Garyū",
  "kanji": "「臥竜」",
  "traducao": "Dragão Adormecido",
  "nomeCompleto": "Garyū 「臥竜」— Dragão Adormecido",
  "espirito": "Um monge sereno sentado sobre a crista de um dragão esculpido em rocha sedimentar milenar que respira poeira de terra.",
  "comando": "Acorde da montanha, Garyū.",
  "elemento": "Densidade Sísmica & Massa Inercial",
  "formatoArma": "Uma espada larga, pesada e de gume rombudo que não possui fio de corte tradicional, mas tem densidade descomunal.",
  "poder": "Massa Cumulativa: A cada golpe bloqueado com a espada, sua densidade aumenta sem sobrecarregar os braços do portador, esmagando defesas pela pura inércia do impacto.",
  "bankai": {
    "nome": "Garyū — Tenhō Chiretsu",
    "kanji": "「臥竜・天崩地裂」",
    "traducao": "Colapso do Céu e Fratura da Terra",
    "nomeCompleto": "Bankai — Garyū 「臥竜・天崩地裂」 (Tenhō Chiretsu — Colapso do Céu e Fratura da Terra)",
    "comando": "Bankai — Garyū, Tenhō Chiretsu!",
    "formatoArma": "A carapaça de pedra se parte liberando uma espada titânica de lâmina negra reluzente com aura gravitacional densa.",
    "poder": "Onda de Ruptura Tectônica: Cada golpe desferido gera uma pressão gravitacional vertical capaz de quebrar o solo em crateras de dezenas de metros e estilhaçar qualquer barreira de Bakudō convencional."
  }
}, {
  "id": "zk-21",
  "numero": "21",
  "nome": "Chizome",
  "kanji": "「血染」",
  "traducao": "Fios de Sangue",
  "nomeCompleto": "Chizome 「血染」— Fios de Sangue",
  "espirito": "Uma nobre vestida com quimono carmesim que costura tapeçarias usando agulhas de osso e fios tingidos de sangue fresco.",
  "comando": "Tinja o caminho de carmesim, Chizome.",
  "elemento": "Coagulação Espiritual & Fios Carmesins",
  "formatoArma": "Uma adaga curva de aço polido com uma ranhura central que atrai e cristaliza fluidos em micro-agulhas afiadas.",
  "poder": "Cristalização Sanguínea: Permite ao usuário endurecer gotas de sangue no ar ou no chão em agulhas e lâminas cortantes arremessáveis.",
  "bankai": {
    "nome": "Chizome — Senshi Senketsukai",
    "kanji": "「血染・千糸鮮血界」",
    "traducao": "Mundo dos Mil Fios de Sangue",
    "nomeCompleto": "Bankai — Chizome 「血染・千糸鮮血界」 (Senshi Senketsukai — Mundo dos Mil Fios de Sangue)",
    "comando": "Bankai — Chizome, Senshi Senketsukai!",
    "formatoArma": "O ambiente se cruza com milhares de fios escarlates suspensos que brilham com Reiryoku vivo.",
    "poder": "Rede Sensora & Guilhotina: Os fios no ar reagem automaticamente a qualquer vibração ou deslocamento veloz, tensionando-se para fatiar quem tentar cruzar a rede em alta velocidade."
  }
}, {
  "id": "zk-22",
  "numero": "22",
  "nome": "Kazahana",
  "kanji": "「風花」",
  "traducao": "Pétalas da Nevasca",
  "nomeCompleto": "Kazahana 「風花」— Pétalas da Nevasca",
  "espirito": "Uma criança vestida de branco que sopra delicadas flores de gelo enquanto caminha descalça sobre a neve virgem.",
  "comando": "Dance na geada suave, Kazahana.",
  "elemento": "Gelo Suave & Flocos Entorpecentes",
  "formatoArma": "Uma katana fina prateada que liberta pequenos flocos hexagonais de gelo que flutuam ao redor da lâmina.",
  "poder": "Geada Entorpecente: Os flocos de gelo grudam nas roupas e pele do alvo, drenando o calor corporal e reduzindo o tempo de resposta neuromuscular a cada golpe.",
  "bankai": {
    "nome": "Kazahana — Byakuya Hanafubuki",
    "kanji": "「風花・白夜花吹雪」",
    "traducao": "Nevasca Floral da Noite Branca",
    "nomeCompleto": "Bankai — Kazahana 「風花・白夜花吹雪」 (Byakuya Hanafubuki — Nevasca Floral da Noite Branca)",
    "comando": "Bankai — Kazahana, Byakuya Hanafubuki!",
    "formatoArma": "Um turbilhão colossal de pétalas de gelo cortantes envolve toda a arena sob uma tempestade de frio extremo.",
    "poder": "Ausência de Atrito & Corte Gélido: As lâminas de gelo cortam o ar anulando o atrito do solo e reduzindo a temperatura a níveis que congelam faíscas de Reiryoku e aprisionam o inimigo em geada perpétua."
  }
}, {
  "id": "zk-23",
  "numero": "23",
  "nome": "Bankō",
  "kanji": "「万綱」",
  "traducao": "Rede das Profundezas",
  "nomeCompleto": "Bankō 「万綱」— Rede das Profundezas",
  "espirito": "Um pescador silencioso em um barco de junco no centro de um oceano infinito coberto por névoa cinzenta.",
  "comando": "Puxe as amarras do abismo, Bankō.",
  "elemento": "Cabos de Aço & Tensão de Longo Alcance",
  "formatoArma": "A lâmina se estende em múltiplos fios de aço flexíveis de altíssima tensão equipados com ganchos farpados nas pontas.",
  "poder": "Puxão Angulado: Permite laçar membros, armas ou pontos do terreno para projetar o usuário ou desarmar oponentes a longas distâncias.",
  "bankai": {
    "nome": "Bankō — Kaitei Bakusamō",
    "kanji": "「万綱・海底縛鎖網」",
    "traducao": "Rede de Correntes do Fundo do Oceano",
    "nomeCompleto": "Bankai — Bankō 「万綱・海底縛鎖網」 (Kaitei Bakusamō — Rede de Correntes do Fundo do Oceano)",
    "comando": "Bankai — Bankō, Kaitei Bakusamō!",
    "formatoArma": "Milhares de correntes e cabos de aço cobrem o céu e o solo como uma teia monumental de cerco.",
    "poder": "Contração & Condução Sísmica: O usuário sente qualquer vibração no campo e pode contrair a teia instantaneamente para esmagar ou aprisionar múltiplos alvos em um cofre de correntes."
  }
}, {
  "id": "zk-24",
  "numero": "24",
  "nome": "Shiratama",
  "kanji": "「白玉」",
  "traducao": "Esferas de Jade Sagrada",
  "nomeCompleto": "Shiratama 「白玉」— Esferas de Jade Sagrada",
  "espirito": "Um sacerdote em estado de iluminação que levita sereno cercado por três esferas peroladas que emitem luz pura.",
  "comando": "Purifique a mácula, Shiratama.",
  "elemento": "Luz Sagrada & Absorção Purificadora",
  "formatoArma": "A espada gera três esferas luminosas de Reiryoku puro que giram em volta da empunhadura e protegem o portador.",
  "poder": "Orbes de Defesa Absoluta: Cada esfera absorve integralmente um ataque mágico de Kidō ou impacto de energia elemental direta, dissipando-se em seguida (até 3 cargas).",
  "bankai": {
    "nome": "Shiratama — Sangai Jōkarin",
    "kanji": "「白玉・三界浄化輪」",
    "traducao": "Três Anéis da Purificação Celestial",
    "nomeCompleto": "Bankai — Shiratama 「白玉・三界浄化輪」 (Sangai Jōkarin — Três Anéis da Purificação Celestial)",
    "comando": "Bankai — Shiratama, Sangai Jōkarin!",
    "formatoArma": "As esferas se expandem em três anéis de luz solar gigantescos que descem sobre o campo de batalha.",
    "poder": "Supressão de Energias Caóticas: Impõe uma zona de purificação contínua onde técnicas de energia impura ou venenos são neutralizados, enquanto recupera o fluxo de Reiryoku do portador."
  }
}, {
  "id": "zk-25",
  "numero": "25",
  "nome": "Tsukikage",
  "kanji": "「月影」",
  "traducao": "Sombra da Lua",
  "nomeCompleto": "Tsukikage 「月影」— Sombra da Lua",
  "espirito": "Uma arqueira de olhar calmo vestida de azul-noite sentada sobre a foice de uma lua prateada brilhando no escuro.",
  "comando": "Oculte-se no luar, Tsukikage.",
  "elemento": "Ilusão Óptica & Refração Lunar",
  "formatoArma": "Uma lâmina curva e fosca cuja borda parece cintilar em ondas de luz prateada.",
  "poder": "Distorção de Alcance: A refração luminosa ao longo do fio faz a espada parecer mais curta ou mais longa do que realmente é, enganando o tempo de bloqueio do inimigo.",
  "bankai": {
    "nome": "Tsukikage — Gengetsu Mueikai",
    "kanji": "「月影・幻月無影界」",
    "traducao": "Domínio Sem Sombra da Lua Ilusória",
    "nomeCompleto": "Bankai — Tsukikage 「月影・幻月無影界」 (Gengetsu Mueikai — Domínio Sem Sombra da Lua Ilusória)",
    "comando": "Bankai — Tsukikage, Gengetsu Mueikai!",
    "formatoArma": "A noite desce e a arena é banhada pela luz de uma lua cheia colossal prateada.",
    "poder": "Ataque por Feixes de Luz: O usuário dissocia seu corpo físico da sua imagem visível, podendo projetar estocadas e cortes reais a partir de qualquer raio de luar refletido no terreno."
  }
}, {
  "id": "zk-26",
  "numero": "26",
  "nome": "Jigokubana",
  "kanji": "「地獄花」",
  "traducao": "Lírio do Submundo",
  "nomeCompleto": "Jigokubana 「地獄花」— Lírio do Submundo",
  "espirito": "Uma mulher com coroa de espinhos negros e lágrimas vermelhas cujos passos no solo fazem brotar flores escarlates de ferro.",
  "comando": "Enraíze no solo dos mortos, Jigokubana.",
  "elemento": "Raízes de Ferro & Dreno Telúrico",
  "formatoArma": "Uma espada cuja ponta, ao tocar o solo, faz brotar raízes afiadas de metal que avançam em direção ao oponente.",
  "poder": "Espinhos de Solo: Cria fendas subterrâneas com espinhos de Reiryoku que brotam sob os pés do alvo para empalar ou restringir seus passos.",
  "bankai": {
    "nome": "Jigokubana — Guren Jukai",
    "kanji": "「地獄花・紅蓮樹海」",
    "traducao": "Floresta de Espinhos do Abismo Carmesim",
    "nomeCompleto": "Bankai — Jigokubana 「地獄花・紅蓮樹海」 (Guren Jukai — Floresta de Espinhos do Abismo Carmesim)",
    "comando": "Bankai — Jigokubana, Guren Jukai!",
    "formatoArma": "Uma floresta colossal de videiras espinhosas de ferro carmesim brota cobrindo toda a arena.",
    "poder": "Domínio Asfixiante de Raízes: As vinhas se movem autonomamente buscando fontes de Reiryoku, estrangulando defesas e drenando energia vital de qualquer um que encostar no solo."
  }
}, {
  "id": "zk-27",
  "numero": "27",
  "nome": "Hikariba",
  "kanji": "「光刃」",
  "traducao": "Lâmina de Prisma Solar",
  "nomeCompleto": "Hikariba 「光刃」— Lâmina de Prisma Solar",
  "espirito": "Um escultor de lentes de cristal puro que lapida raios solares em ângulos geométricos perfeitos.",
  "comando": "Refrate a chama pura, Hikariba.",
  "elemento": "Luz Solar Concentrada & Alta Temperatura",
  "formatoArma": "Uma espada de cristal facetado que concentra a luz ambiente em feixes cortantes de alta temperatura.",
  "poder": "Feixes Prismáticos: Permite refletir e curvar disparos luminosos em ângulos retos para atingir o oponente em seus pontos cegos.",
  "bankai": {
    "nome": "Hikariba — Banshō Shōnetsukai",
    "kanji": "「光刃・万象焦熱界」",
    "traducao": "Domínio da Incineração Prismática",
    "nomeCompleto": "Bankai — Hikariba 「光刃・万象焦熱界」 (Banshō Shōnetsukai — Domínio da Incineração Prismática)",
    "comando": "Bankai — Hikariba, Banshō Shōnetsukai!",
    "formatoArma": "Pilares gigantes de cristal facetado cercam o campo de batalha como espelhos monumentais.",
    "poder": "Feixe Omnidirecional de Incineração: A luz concentrada pelos prismas dispara simultaneamente em dezenas de eixos térmicos, incinerando defesas físicas e barreiras mágicas com calor extremo."
  }
}, {
  "id": "zk-28",
  "numero": "28",
  "nome": "Ryūshin",
  "kanji": "「竜心」",
  "traducao": "Coração de Dragão",
  "nomeCompleto": "Ryūshin 「竜心」— Coração de Dragão",
  "espirito": "Um guerreiro imponente com marcas de escamas ardentes no peito e olhar penetrante de chamas douradas.",
  "comando": "Queime no pulso da alma, Ryūshin.",
  "elemento": "Calor Interno & Plasma Espiritual",
  "formatoArma": "Uma katana de gume avermelhado que absorve o calor do próprio usuário para intensificar o poder de corte.",
  "poder": "Combustão Contínua: Quanto mais longa a trocação direta de golpes, mais incandescente fica a lâmina, descarregando ondas térmicas a cada balanço.",
  "bankai": {
    "nome": "Ryūshin — Gōka Tenshō",
    "kanji": "「竜心・劫火天衝」",
    "traducao": "Impacto Celestial do Fogo Cósmico",
    "nomeCompleto": "Bankai — Ryūshin 「竜心・劫火天衝」 (Gōka Tenshō — Impacto Celestial do Fogo Cósmico)",
    "comando": "Bankai — Ryūshin, Gōka Tenshō!",
    "formatoArma": "O portador é envolto em uma armadura dracônica de plasma incandescente com asas de fogo espiritual.",
    "poder": "Devastação em Plasma Puro: Libera explosões monumentais de calor contínuo que derretem o solo sob os pés dos combatentes e transformam o ar em uma fornalha inescapável."
  }
}, {
  "id": "zk-29",
  "numero": "29",
  "nome": "Mumyō",
  "kanji": "「無明」",
  "traducao": "Noite da Cegueira",
  "nomeCompleto": "Mumyō 「無明」— Noite da Cegueira",
  "espirito": "Um monge ancião de olhos vendados por seda negra que caminha com um cajado de ébano sem emitir vibração alguma.",
  "comando": "Apague a centelha do olhar, Mumyō.",
  "elemento": "Privação Sensorial & Penumbra Espiritual",
  "formatoArma": "Uma espada que absorve o reflexo da luz ao seu redor, criando uma aura de escuridão opaca de 2 metros em torno do usuário.",
  "poder": "Cegueira Momentânea: Ao cruzar lâminas, a visão periférica do adversário é apagada por 1 segundo, impedindo leitura de contra-ataques imediatos.",
  "bankai": {
    "nome": "Mumyō — Tokoyami Meifu",
    "kanji": "「無明・常闇冥府」",
    "traducao": "Submundo das Trevas Eternas",
    "nomeCompleto": "Bankai — Mumyō 「無明・常闇冥府」 (Tokoyami Meifu — Submundo das Trevas Eternas)",
    "comando": "Bankai — Mumyō, Tokoyami Meifu!",
    "formatoArma": "Todo o campo de batalha é engolido por uma escuridão absoluta impenetrável.",
    "poder": "Anulação de Percepção & Detecção: Suprime completamente a visão e a detecção de Reiryoku à distância, forçando o adversário a lutar exclusivamente por sensações táteis imediatas enquanto o usuário se move com precisão instintiva."
  }
}, {
  "id": "zk-30",
  "numero": "30",
  "nome": "Haganeito",
  "kanji": "「鋼糸」",
  "traducao": "Fios de Aço",
  "nomeCompleto": "Haganeito 「鋼糸」— Fios de Aço",
  "espirito": "Um mestre marionetista com feições de porcelana lisa e dedos estendidos em longos filamentos prateados de Reiryoku.",
  "comando": "Costure os passos do destino, Haganeito.",
  "elemento": "Microfilamentos & Controle Articular",
  "formatoArma": "A ponta da espada solta micro-fios de aço quase invisíveis que se prendem às armas e punhos dos adversários.",
  "poder": "Desvio Tátil: Permite tensionar os filamentos no último instante para puxar ou desviar a lâmina inimiga para fora da rota letal.",
  "bankai": {
    "nome": "Haganeito — Kugutsu Gigakan",
    "kanji": "「鋼糸・傀儡戯画館」",
    "traducao": "Teatro das Marionetes Espirituais",
    "nomeCompleto": "Bankai — Haganeito 「鋼糸・傀儡戯画館」 (Kugutsu Gigakan — Teatro das Marionetes Espirituais)",
    "comando": "Bankai — Haganeito, Kugutsu Gigakan!",
    "formatoArma": "Uma imensa estrutura de palco celestial se ergue com milhares de fios cruzando o ar.",
    "poder": "Manipulação de Articulações Inertes: Os fios tomam o controle das armas caídas, escombros e músculos fatigados do adversário, forçando bloqueios imperfeitos ou travando membros inteiros."
  }
}, {
  "id": "zk-31",
  "numero": "31",
  "nome": "Mizuchi",
  "kanji": "「蛟」",
  "traducao": "Serpente das Torrentes",
  "nomeCompleto": "Mizuchi 「蛟」— Serpente das Torrentes",
  "espirito": "Uma serpente d'água albina com chifres prateados repousando serenamente no fundo de um poço cristalino milenar.",
  "comando": "Transborde em correnteza pura, Mizuchi.",
  "elemento": "Água Pressurizada & Fluidez Cortante",
  "formatoArma": "A lâmina de aço se desfaz em um fluxo de água pressurizada contínua de altíssima densidade capaz de cortar rochas.",
  "poder": "Lâmina Fluida: Pode estender seu alcance instantaneamente ou perder solidez para passar através de defesas antes de se solidificar no corte.",
  "bankai": {
    "nome": "Mizuchi — Suiten Daikōzui",
    "kanji": "「蛟・水天大洪水」",
    "traducao": "Tsunami do Domínio Celestial das Águas",
    "nomeCompleto": "Bankai — Mizuchi 「蛟・水天大洪水」 (Suiten Daikōzui — Tsunami do Domínio Celestial das Águas)",
    "comando": "Bankai — Mizuchi, Suiten Daikōzui!",
    "formatoArma": "Uma colossal cúpula de água espiritual pura submerge toda a arena de batalha.",
    "poder": "Hidrodinâmica Perfeita: Dentro do domo aquático, apenas o portador se move com velocidade sem atrito, disparando lâminas de vácuo hidrostático que esmagam o oponente pela pressão da água."
  }
}, {
  "id": "zk-32",
  "numero": "32",
  "nome": "Dokuga",
  "kanji": "「毒蛾」",
  "traducao": "Mariposa Venenosa",
  "nomeCompleto": "Dokuga 「毒蛾」— Mariposa Venenosa",
  "espirito": "Uma mulher graciosa com asas de mariposa aveludadas cobertas por escamas arroxeadas brilhantes que desprendem pólen ao bater.",
  "comando": "Disperse o sono eterno, Dokuga.",
  "elemento": "Pólen Tóxico & Entorpecimento Neural",
  "formatoArma": "Uma lâmina fina e curva com guarda em formato de asas de mariposa que libera uma névoa arroxeada de escamas finas.",
  "poder": "Pólen Entorpecente: O contato com as escamas entorpece a sensibilidade tátil e a velocidade de resposta reflexa do adversário a cada inalação.",
  "bankai": {
    "nome": "Dokuga — Shigettsu Gendokurō",
    "kanji": "「毒蛾・紫月幻毒牢」",
    "traducao": "Gaiola do Veneno Ilusório da Lua Púrpura",
    "nomeCompleto": "Bankai — Dokuga 「毒蛾・紫月幻毒牢」 (Shigettsu Gendokurō — Gaiola do Veneno Ilusório da Lua Púrpura)",
    "comando": "Bankai — Dokuga, Shigettsu Gendokurō!",
    "formatoArma": "O céu se torna violeta e uma tempestade contínua de pólen corrosivo envolve a arena.",
    "poder": "Corrosão de Barreiras & Alucinação Sensorial: O veneno no ar dissolve barreiras de Kidō e induz alucinações visuais e auditivas que impedem o oponente de discernir a posição real do usuário."
  }
}, {
  "id": "zk-33",
  "numero": "33",
  "nome": "Tessen",
  "kanji": "「鉄扇」",
  "traducao": "Vento da Muralha de Aço",
  "nomeCompleto": "Tessen 「鉄扇」— Vento da Muralha de Aço",
  "espirito": "Um nobre cortesão com máscara cerimonial que empunha dois pesados leques metálicos com lâminas afiadas nas dobras.",
  "comando": "Dobre o sopro do céu, Tessen.",
  "elemento": "Vento Gravitacional & Deflexão",
  "formatoArma": "A espada se desdobra em um grande leque de placas de aço afiadas como navalhas.",
  "poder": "Vento Descendente: Cada balanço do leque gera rajadas de ar comprimido que empurram o adversário para o chão com força gravitacional multiplicada.",
  "bankai": {
    "nome": "Tessen — Tenshō Hadanran",
    "kanji": "「鉄扇・天衝破断嵐」",
    "traducao": "Vendaval de Ruptura Celestial",
    "nomeCompleto": "Bankai — Tessen 「鉄扇・天衝破断嵐」 (Tenshō Hadanran — Vendaval de Ruptura Celestial)",
    "comando": "Bankai — Tessen, Tenshō Hadanran!",
    "formatoArma": "Dois gigantescos leques de aço flutuam ao lado do usuário gerando ciclones contínuos.",
    "poder": "Gaiola de Vácuo Cortante: Cria furacões verticais que suspendem o adversário no ar enquanto desferem milhares de cortes de vácuo em alta rotação."
  }
}, {
  "id": "zk-34",
  "numero": "34",
  "nome": "Kasumikiri",
  "kanji": "「霞斬」",
  "traducao": "Navalha na Bruma",
  "nomeCompleto": "Kasumikiri 「霞斬」— Navalha na Bruma",
  "espirito": "Um samurai espectral cujos contornos ondulam e se desfazem como vapor aquecido sob a chuva fina.",
  "comando": "Desvaneça na bruma da manhã, Kasumikiri.",
  "elemento": "Intangibilidade Gasosa & Bruma",
  "formatoArma": "Uma lâmina cujos contornos parecem desfocados e trêmulos como miragem de calor.",
  "poder": "Corte Osmótico: A lâmina pode passar através de objetos sólidos finos e solidificar-se apenas no instante do contato interno com o alvo.",
  "bankai": {
    "nome": "Kasumikiri — Mugen Genmukai",
    "kanji": "「霞斬・無限幻霧界」",
    "traducao": "Domínio da Névoa Impenetrável",
    "nomeCompleto": "Bankai — Kasumikiri 「霞斬・無限幻霧界」 (Mugen Genmukai — Domínio da Névoa Impenetrável)",
    "comando": "Bankai — Kasumikiri, Mugen Genmukai!",
    "formatoArma": "Uma névoa branca densa e impenetrável toma conta de todo o cenário de batalha.",
    "poder": "Dissolução Corpórea & Clones de Vapor: O usuário pode se dissolver completamente na bruma e surgir atrás do inimigo em múltiplos corpos de vapor que alternam solidez conforme atacam."
  }
}, {
  "id": "zk-35",
  "numero": "35",
  "nome": "Gōkaku",
  "kanji": "「剛角」",
  "traducao": "Chifre Inquebrável",
  "nomeCompleto": "Gōkaku 「剛角」— Chifre Inquebrável",
  "espirito": "Uma fera titânica de obsidiana e pedra com dois chifres monumentais capazes de fender montanhas.",
  "comando": "Esmague sem piedade, Gōkaku.",
  "elemento": "Obsidiana Pura & Perfuração Pesada",
  "formatoArma": "A espada ganha o formato de uma pesada lança curta com ponta triangular de obsidiana de dureza extrema.",
  "poder": "Ponta Inflexível: Golpes desferidos em investida reta possuem poder perfurante multiplicado, atravessando defesas rígidas e armaduras pesadas.",
  "bankai": {
    "nome": "Gōkaku — Kongō Saizangeki",
    "kanji": "「剛角・金剛砕山撃」",
    "traducao": "Impacto Devastador do Diamante Titânico",
    "nomeCompleto": "Bankai — Gōkaku 「剛角・金剛砕山撃」 (Kongō Saizangeki — Impacto Devastador do Diamante Titânico)",
    "comando": "Bankai — Gōkaku, Kongō Saizangeki!",
    "formatoArma": "Pilares monumentais de rocha sólida e obsidiana emergem do solo ao redor da arena.",
    "poder": "Bombardeio de Monólitos Cinéticos: O usuário pode disparar e colidir esses blocos gigantescos contra o oponente como meteoros guiados por impacto de Reiryoku concentrado."
  }
}, {
  "id": "zk-36",
  "numero": "36",
  "nome": "Hibachi",
  "kanji": "「火鉢」",
  "traducao": "Braseiro Ardente",
  "nomeCompleto": "Hibachi 「火鉢」— Braseiro Ardente",
  "espirito": "Um anão ferreiro de pele cinzenta que molda brasas e carvão ardente com as próprias mãos desprotegidas.",
  "comando": "Aqueça o ferro dormente, Hibachi.",
  "elemento": "Brasas Espirituais & Transferência Térmica",
  "formatoArma": "Uma lâmina reta que acumula o calor do atrito com o ar e espadas inimigas, mantendo seu fio em brasa constante.",
  "poder": "Fogo Retido: As brasas da lâmina passam para as armas do oponente, aquecendo os cabos a ponto de queimar as mãos do adversário e forçar o desarmamento.",
  "bankai": {
    "nome": "Hibachi — Shōnetsu Shōdojin",
    "kanji": "「火鉢・焦熱焦土陣」",
    "traducao": "Matriz do Purgatório em Brasas",
    "nomeCompleto": "Bankai — Hibachi 「火鉢・焦熱焦土陣」 (Shōnetsu Shōdojin — Matriz do Purgatório em Brasas)",
    "comando": "Bankai — Hibachi, Shōnetsu Shōdojin!",
    "formatoArma": "O solo inteiro do campo se transforma em uma grelha incandescente com fissuras de lava espiritual.",
    "poder": "Gêiseres de Brasas Ocultas: Qualquer passo do oponente sobre o solo incandescente dispara jatos verticais de fogo espiritual que queimam armaduras e consomem o oxigênio ao redor."
  }
}, {
  "id": "zk-37",
  "numero": "37",
  "nome": "Oshimaru",
  "kanji": "「推丸」",
  "traducao": "Impulso Perfeito",
  "nomeCompleto": "Oshimaru 「推丸」— Impulso Perfeito",
  "espirito": "Um atleta divino com braceletes dourados que salta entre as nuvens sem tocar o solo e sem deixar rastros.",
  "comando": "Devolva a força aplicada, Oshimaru.",
  "elemento": "Absorção de Recuo & Onda de Choque",
  "formatoArma": "Uma espada curta com guarda circular pesada que absorve a energia do recuo ao aparar ataques.",
  "poder": "Vetor Invertido: O recuo de um golpe bloqueado é convertido em velocidade imediata de avanço para o contra-ataque seguinte.",
  "bankai": {
    "nome": "Oshimaru — Hakū Suiryokukai",
    "kanji": "「推丸・破空推力界」",
    "traducao": "Domínio do Impulso Absoluto",
    "nomeCompleto": "Bankai — Oshimaru 「推丸・破空推力界」 (Hakū Suiryokukai — Domínio do Impulso Absoluto)",
    "comando": "Bankai — Oshimaru, Hakū Suiryokukai!",
    "formatoArma": "Duas manoplas de Reiryoku comprimido com anéis de vácuo nos antebraços.",
    "poder": "Onda de Choque Cinético: O portador pode emitir ondas massivas de pressão de ar capazes de empurrar fortificações, repelir investidas e anular feitiços de impacto a dezenas de metros."
  }
}, {
  "id": "zk-38",
  "numero": "38",
  "nome": "Hōsekiba",
  "kanji": "「宝石刃」",
  "traducao": "Lâmina de Joias",
  "nomeCompleto": "Hōsekiba 「宝石刃」— Lâmina de Joias",
  "espirito": "Uma rainha de cristal reluzente com lágrimas de pedras preciosas que reflete todas as cores do prisma.",
  "comando": "Lapide a lâmina eterna, Hōsekiba.",
  "elemento": "Cristais Preciosos & Lâminas Facetadas",
  "formatoArma": "A lâmina se decompõe em centenas de pequenos cristais afiados como navalhas que flutuam ao redor da empunhadura.",
  "poder": "Enxame Facetado: Os cristais podem ser controlados mentalmente em trajetórias cortantes de alta precisão ou formarem pequenos escudos refletores.",
  "bankai": {
    "nome": "Hōsekiba — Hyakka Kesshōkyū",
    "kanji": "「宝石刃・百華結晶宮」",
    "traducao": "Palácio dos Mil Cristais Reluzentes",
    "nomeCompleto": "Bankai — Hōsekiba 「宝石刃・百華結晶宮」 (Hyakka Kesshōkyū — Palácio dos Mil Cristais Reluzentes)",
    "comando": "Bankai — Hōsekiba, Hyakka Kesshōkyū!",
    "formatoArma": "Monumentais florestas de cristais multicoloridos brotam da terra cobrindo a arena.",
    "poder": "Prisma de Confinamento: Os cristais gigantes refratam a energia espiritual em feixes convergentes e podem aprisionar o adversário em caixões de cristal com dureza equivalente a diamante."
  }
}, {
  "id": "zk-39",
  "numero": "39",
  "nome": "Yamainu",
  "kanji": "「山狗」",
  "traducao": "Cão Selvagem da Montanha",
  "nomeCompleto": "Yamainu 「山狗」— Cão Selvagem da Montanha",
  "espirito": "Um lobo cinzento ancestral com marcas tribais vermelhas que espreita nas florestas e caça pelo cheiro da alma.",
  "comando": "Cace no rastro do medo, Yamainu.",
  "elemento": "Rastreamento de Reiryoku & Presas Serrilhadas",
  "formatoArma": "Uma lâmina curva e serrilhada que aumenta a sensibilidade do portador ao calor e cheiro de Reiryoku do oponente.",
  "poder": "Faro Predador: Permite antecipar deslocamentos em Shunpo e detectar oponentes mesmo dentro de ilusões, fumaça ou invisibilidade.",
  "bankai": {
    "nome": "Yamainu — Yūmei Rōgagun",
    "kanji": "「山狗・幽冥狼牙群」",
    "traducao": "Alcateia dos Lobos Espectrais",
    "nomeCompleto": "Bankai — Yamainu 「山狗・幽冥狼牙群」 (Yūmei Rōgagun — Alcateia dos Lobos Espectrais)",
    "comando": "Bankai — Yamainu, Yūmei Rōgagun!",
    "formatoArma": "Uma matilha de dezenas de lobos gigantescos formados por puro Reiryoku negro cerca os oponentes.",
    "poder": "Cerco Predatório Coordenado: Os lobos atacam de múltiplos pontos cegos simultaneamente, sincronizando suas investidas com os movimentos da espada do portador."
  }
}, {
  "id": "zk-40",
  "numero": "40",
  "nome": "Chiryaku",
  "kanji": "「地脈」",
  "traducao": "Pulso da Terra",
  "nomeCompleto": "Chiryaku 「地脈」— Pulso da Terra",
  "espirito": "Um monge feito de barro e raízes que encosta o ouvido no solo para escutar as vibrações mais profundas da terra.",
  "comando": "Faça o chão estremecer, Chiryaku.",
  "elemento": "Vibrações Sísmicas & Equilíbrio Corporal",
  "formatoArma": "Uma espada pesada de cabo longo que transmite pulsos sísmicos de baixa frequência ao tocar o solo.",
  "poder": "Desestabilização Telúrica: Cada impacto no chão gera microfissuras que desequilibram a postura de quem estiver pisando na área de efeito.",
  "bankai": {
    "nome": "Chiryaku — Tendō Hōkōchi",
    "kanji": "「地脈・天動崩落地」",
    "traducao": "Ruptura das Placas Celestiais",
    "nomeCompleto": "Bankai — Chiryaku 「地脈・天動崩落地」 (Tendō Hōkōchi — Ruptura das Placas Celestiais)",
    "comando": "Bankai — Chiryaku, Tendō Hōkōchi!",
    "formatoArma": "O terreno se racha em imensas placas tectônicas flutuantes sob controle gravitacional do portador.",
    "poder": "Manipulação de Placas Flutuantes: O usuário pode erguer, inclinar ou colidir as plataformas de rocha em alta velocidade, alterando toda a topografia do campo de batalha."
  }
}, {
  "id": "zk-41",
  "numero": "41",
  "nome": "Sōgetsu",
  "kanji": "「双月」",
  "traducao": "Luas Gêmeas",
  "nomeCompleto": "Sōgetsu 「双月」— Luas Gêmeas",
  "espirito": "Duas sacerdotisas de prata idênticas unidas pelas mãos, uma sob a lua cheia e outra sob a lua nova.",
  "comando": "Cruzem o horizonte da noite, Sōgetsu.",
  "elemento": "Foices Curvas & Foco Duplo de Dano",
  "formatoArma": "A katana se divide em duas foices curvas prateadas unidas por um halo de luz lunar.",
  "poder": "Corte Sincronizado: Ataques combinados das duas foices convergem no mesmo ponto gerando o dobro de penetração de corte.",
  "bankai": {
    "nome": "Sōgetsu — Sōei Nisshokukai",
    "kanji": "「双月・双影日食界」",
    "traducao": "Eclipse das Luas Gêmeas",
    "nomeCompleto": "Bankai — Sōgetsu 「双月・双影日食界」 (Sōei Nisshokukai — Eclipse das Luas Gêmeas)",
    "comando": "Bankai — Sōgetsu, Sōei Nisshokukai!",
    "formatoArma": "Duas luas monumentais (uma prateada e uma negra) surgem nos polos opostos do céu.",
    "poder": "Gravidade Dupla Divergente: Cria dois centros de gravidade opostos que puxam o corpo e a espada do oponente em direções contrárias, desmantelando sua postura defensiva."
  }
}, {
  "id": "zk-42",
  "numero": "42",
  "nome": "Kyūketsu",
  "kanji": "「吸血」",
  "traducao": "Vórtice Carmesim",
  "nomeCompleto": "Kyūketsu 「吸血」— Vórtice Carmesim",
  "espirito": "Um morcego espectral com asas de lâminas polidas e olhos vermelhos brilhantes que caça no escuro.",
  "comando": "Drene o sopro da vida, Kyūketsu.",
  "elemento": "Absorção Vital & Lanças Escarlates",
  "formatoArma": "Uma espada esguia com dentes finos que drena uma fração minúscula de vitalidade ao ferir o alvo para restaurar o fôlego do usuário.",
  "poder": "Restauração por Corte: Fecha pequenos cortes no próprio corpo do portador à medida que causa danos superficiais no inimigo.",
  "bankai": {
    "nome": "Kyūketsu — Senketsu Kyōshikyoku",
    "kanji": "「吸血・鮮血狂詩曲」",
    "traducao": "Rapsódia da Sede Carmesim",
    "nomeCompleto": "Bankai — Kyūketsu 「吸血・鮮血狂詩曲」 (Senketsu Kyōshikyoku — Rapsódia da Sede Carmesim)",
    "comando": "Bankai — Kyūketsu, Senketsu Kyōshikyoku!",
    "formatoArma": "Todo o sangue exposto na atmosfera condensa em lanças escarlates flutuantes de Reiryoku puro.",
    "poder": "Chuva de Lanças Sangrentas: As lanças teleguiadas perseguem o adversário automaticamente com altíssimo poder perfurante e devolvem Reiryoku drenado ao usuário."
  }
}, {
  "id": "zk-43",
  "numero": "43",
  "nome": "Raijū",
  "kanji": "「雷獣」",
  "traducao": "Tigre dos Raios Azuis",
  "nomeCompleto": "Raijū 「雷獣」— Tigre dos Raios Azuis",
  "espirito": "Um tigre de pelos azuis e garras elétricas envolto em arcos de plasma faiscante.",
  "comando": "Ruge no coração da tempestade, Raijū.",
  "elemento": "Eletricidade Azul & Arcos Condutores",
  "formatoArma": "A lâmina se cobre de arcos de plasma azul que saltam para qualquer objeto metálico próximo.",
  "poder": "Choque Eletrostático: Conduz corrente elétrica através de armas ao cruzar aço, causando espasmos musculares nas mãos do adversário.",
  "bankai": {
    "nome": "Raijū — Tenrai Hōkōkai",
    "kanji": "「雷獣・天雷咆哮界」",
    "traducao": "Domínio do Rugido do Trovão Primordial",
    "nomeCompleto": "Bankai — Raijū 「雷獣・天雷咆哮界」 (Tenrai Hōkōkai — Domínio do Rugido do Trovão Primordial)",
    "comando": "Bankai — Raijū, Tenrai Hōkōkai!",
    "formatoArma": "O portador se funde a uma armadura colossal de plasma azul vivo com velocidade quase instantânea.",
    "poder": "Velocidade de Relâmpago Puro: O usuário atinge velocidades extremas em curtos trajetos, desferindo golpes envoltos em ondas de choque capazes de desintegrar defesas rígidas."
  }
}, {
  "id": "zk-44",
  "numero": "44",
  "nome": "Suzumechi",
  "kanji": "「雀千」",
  "traducao": "Mil Penas Douradas",
  "nomeCompleto": "Suzumechi 「雀千」— Mil Penas Douradas",
  "espirito": "Uma nobre vestida com manto de penas douradas que se comunica através do canto de bandos de pássaros luminosos.",
  "comando": "Alce voo na luz do ouro, Suzumechi.",
  "elemento": "Penas Metálicas & Enxame Aéreo",
  "formatoArma": "A espada se dispersa em centenas de pequenas lâminas em formato de penas douradas flutuantes.",
  "poder": "Revoada de Penas: As penas voam em leque teleguiado e podem se agrupar como uma barreira rotatória esférica.",
  "bankai": {
    "nome": "Suzumechi — Senba Ōgonran",
    "kanji": "「雀千・千羽黄金嵐」",
    "traducao": "Tempestade das Mil Asas Douradas",
    "nomeCompleto": "Bankai — Suzumechi 「雀千・千羽黄金嵐」 (Senba Ōgonran — Tempestade das Mil Asas Douradas)",
    "comando": "Bankai — Suzumechi, Senba Ōgonran!",
    "formatoArma": "Milhares de lâminas douradas formam um turbilhão cósmico em 360° em volta da arena.",
    "poder": "Corte Omnidirecional em Enxame: As penas desferem milhares de microcortes simultâneos que atingem todos os pontos cegos do adversário sem deixar rotas de esquiva."
  }
}, {
  "id": "zk-45",
  "numero": "45",
  "nome": "Karatake",
  "kanji": "「唐竹」",
  "traducao": "Bambu Imortal",
  "nomeCompleto": "Karatake 「唐竹」— Bambu Imortal",
  "espirito": "Um lenhador cego de bambu com chapéu cônico que caminha sereno por um bosque verdejante interminável.",
  "comando": "Flecta sem jamais quebrar, Karatake.",
  "elemento": "Elasticidade Vegetal & Lâmina Chicote",
  "formatoArma": "A lâmina ganha a flexibilidade e tenacidade do bambu maduro, curvando-se como um chicote afiado.",
  "poder": "Elasticidade Cortante: Permite desferir golpes que contornam escudos e defesas retas para atingir os flancos do inimigo.",
  "bankai": {
    "nome": "Karatake — Suichiku Senbonrin",
    "kanji": "「唐竹・翠竹千本林」",
    "traducao": "Floresta dos Mil Bambus de Jade",
    "nomeCompleto": "Bankai — Karatake 「唐竹・翠竹千本林」 (Suichiku Senbonrin — Floresta dos Mil Bambus de Jade)",
    "comando": "Bankai — Karatake, Suichiku Senbonrin!",
    "formatoArma": "Estacas gigantescas de bambu espiritual verde brotam do solo em centenas de colunas impenetráveis.",
    "poder": "Empalamento em Floresta Viva: Os bambus crescem em alta velocidade como lanças sob comando do usuário, empalando e encurralando alvos em um labirinto fechado."
  }
}, {
  "id": "zk-46",
  "numero": "46",
  "nome": "Hyōga",
  "kanji": "「氷河」",
  "traducao": "Geleira Ancestral",
  "nomeCompleto": "Hyōga 「氷河」— Geleira Ancestral",
  "espirito": "Um gigante de gelo azul milenar com barba de estalactites e olhar fixo no horizonte gélido do norte.",
  "comando": "Congele o fluxo dos tempos, Hyōga.",
  "elemento": "Zero Absoluto & Calota Glacial",
  "formatoArma": "Uma espada pesada de gelo translúcido que resfria a superfície de qualquer coisa com que entre em contato.",
  "poder": "Resfriamento por Impacto: Cada colisão forma uma crosta de gelo rígida nas armas inimigas aumentando seu peso e reduzindo a agilidade do atacante.",
  "bankai": {
    "nome": "Hyōga — Zettai Reido Tōkai",
    "kanji": "「氷河・絶対零度凍界」",
    "traducao": "Mundo Congelado do Zero Absoluto",
    "nomeCompleto": "Bankai — Hyōga 「氷河・絶対零度凍界」 (Zettai Reido Tōkai — Mundo Congelado do Zero Absoluto)",
    "comando": "Bankai — Hyōga, Zettai Reido Tōkai!",
    "formatoArma": "Todo o terreno e o ar se congelam instantaneamente em uma calota sólida inquebrável de gelo puro.",
    "poder": "Paralisia Molecular & Térmica: O frio extremo anula o fluxo de Reiryoku no ar e desacelera as reações do corpo do oponente, congelando qualquer feitiço em formação."
  }
}, {
  "id": "zk-47",
  "numero": "47",
  "nome": "Gen'ō",
  "kanji": "「幻影」",
  "traducao": "Monarca das Miragens",
  "nomeCompleto": "Gen'ō 「幻影」— Monarca das Miragens",
  "espirito": "Um ilusionista mascarado com capa de veludo púrpura que move peças de xadrez de cristal no ar com gestos sutis.",
  "comando": "Engane até a própria luz, Gen'ō.",
  "elemento": "Descompasso Temporal & Ilusão Neural",
  "formatoArma": "Uma espada de lâmina esguia que altera a percepção do tempo no cérebro do adversário em 0,3 segundo a cada corte raspão.",
  "poder": "Descompasso Neural: Faz o oponente antecipar ou atrasar suas reações defensivas, errando os tempos de bloqueio e esquiva.",
  "bankai": {
    "nome": "Gen'ō — Senjū Kyozōkai",
    "kanji": "「幻影・千重虚像界」",
    "traducao": "Domínio dos Mil Cenários Ilusórios",
    "nomeCompleto": "Bankai — Gen'ō 「幻影・千重虚像界」 (Senjū Kyozōkai — Domínio dos Mil Cenários Ilusórios)",
    "comando": "Bankai — Gen'ō, Senjū Kyozōkai!",
    "formatoArma": "O ambiente se estilhaça em milhares de reflexos que projetam cenários de combate simultâneos.",
    "poder": "Sobrecarga Cognitiva: O cérebro do oponente processa dezenas de combates imaginários ao mesmo tempo enquanto seu corpo físico fica paralisado e vulnerável ao golpe real."
  }
}, {
  "id": "zk-48",
  "numero": "48",
  "nome": "Enkō",
  "kanji": "「円光」",
  "traducao": "Halo Sagrado",
  "nomeCompleto": "Enkō 「円光」— Halo Sagrado",
  "espirito": "Uma entidade budista serena com auréola de chamas douradas flutuando sobre a cabeça e vestes brancas imaculadas.",
  "comando": "Ilumine o caminho do julgamento, Enkō.",
  "elemento": "Chamas Solares & Discos Giratórios",
  "formatoArma": "A espada projeta discos cortantes de fogo solar giratório que ricocheteiam no ar e retornam à mão do usuário.",
  "poder": "Halos Solares: Dispara anéis de calor extremo de alta velocidade capazes de cortar e queimar barreiras defensivas à distância.",
  "bankai": {
    "nome": "Enkō — Dainichi Kinrinjin",
    "kanji": "「円光・大日金輪陣」",
    "traducao": "Aliança dos Sete Halos Solares",
    "nomeCompleto": "Bankai — Enkō 「円光・大日金輪陣」 (Dainichi Kinrinjin — Aliança dos Sete Halos Solares)",
    "comando": "Bankai — Enkō, Dainichi Kinrinjin!",
    "formatoArma": "Sete anéis monumentais de fogo dourado descem do céu sobre a arena de combate.",
    "poder": "Convergência Solar Absoluta: Os sete halos convergem feixes de luz e calor solar no centro do campo, incinerando tudo dentro de seu ponto focal com calor puro."
  }
}, {
  "id": "zk-49",
  "numero": "49",
  "nome": "Mugenba",
  "kanji": "「無限刃」",
  "traducao": "Forja das Dez Mil Lâminas",
  "nomeCompleto": "Mugenba 「無限刃」— Forja das Dez Mil Lâminas",
  "espirito": "Um ferreiro lendário sentado no pico de uma montanha cercado por incontáveis espadas antigas cravadas na terra.",
  "comando": "Renasça do fio quebrado, Mugenba.",
  "elemento": "Regeneração de Lâminas & Tempestade de Aço",
  "formatoArma": "Caso a lâmina se quebre em combate, ela se regenera instantaneamente com um gume novo e mais afiado do que o anterior.",
  "poder": "Regeneração de Fio: A destruição física da arma fortalece a lâmina subsequente com maior densidade espiritual.",
  "bankai": {
    "nome": "Mugenba — Banjinzuka",
    "kanji": "「無限刃・万刃塚」",
    "traducao": "Cemitério das Dez Mil Lâminas",
    "nomeCompleto": "Bankai — Mugenba 「無限刃・万刃塚」 (Banjinzuka — Cemitério das Dez Mil Lâminas)",
    "comando": "Bankai — Mugenba, Banjinzuka!",
    "formatoArma": "Milhares de espadas espirituais emergem do solo e flutuam na atmosfera ao redor do portador.",
    "poder": "Controle Telecinético de Tempestade de Aço: O usuário comanda mentalmente o enxame de milhares de espadas para atacar em rajadas contínuas ou formarem barreiras sólidas de contenção."
  }
}, {
  "id": "zk-50",
  "numero": "50",
  "nome": "Kurotsume",
  "kanji": "「黒爪」",
  "traducao": "Garras da Pantera Negra",
  "nomeCompleto": "Kurotsume 「黒爪」— Garras da Pantera Negra",
  "espirito": "Uma pantera negra com olhos escarlates que se camufla perfeitamente na escuridão entre as árvores sem produzir som.",
  "comando": "Despedace na penumbra, Kurotsume.",
  "elemento": "Garras Triplas & Sangramento Contínuo",
  "formatoArma": "A espada se divide em três garras retráteis de aço negro em cada punho do portador.",
  "poder": "Ferida Aberta: Os cortes causados pelas garras dificultam a coagulação rápida e retardam a regeneração acelerada por Kaidō básico durante a luta.",
  "bankai": {
    "nome": "Kurotsume — An'ya Shuryōkai",
    "kanji": "「黒爪・暗夜狩猟界」",
    "traducao": "Território da Caçada na Noite Escura",
    "nomeCompleto": "Bankai — Kurotsume 「黒爪・暗夜狩猟界」 (An'ya Shuryōkai — Território da Caçada na Noite Escura)",
    "comando": "Bankai — Kurotsume, An'ya Shuryōkai!",
    "formatoArma": "A arena inteira mergulha em uma penumbra viva e o portador ganha carapaça predatória de sombras.",
    "poder": "Caçada Oculta Instantânea: O usuário se funde às sombras do ambiente, atacando com velocidade predatória silenciosa a partir de qualquer ponto escuro sem revelar sua presença."
  }
}, {
  "id": "zk-51",
  "numero": "51",
  "nome": "Jinrai",
  "kanji": "「迅雷」",
  "traducao": "Clarão do Trovão Instantâneo",
  "nomeCompleto": "Jinrai 「迅雷」— Clarão do Trovão Instantâneo",
  "espirito": "Um guerreiro com elmo em formato de raio e pés envoltos em correntes elétricas reluzentes.",
  "comando": "Corte antes do estrondo, Jinrai.",
  "elemento": "Sinapses Iônicas & Velocidade Extrema",
  "formatoArma": "Uma lâmina fina que emite pulsos de microcorrentes acelerando as sinapses nervosas do próprio portador.",
  "poder": "Sinapse Relâmpago: Multiplica a velocidade de reação e de saque da espada em combates a curta distância.",
  "bankai": {
    "nome": "Jinrai — Banrai Shinsokukai",
    "kanji": "「迅雷・万雷神速界」",
    "traducao": "Domínio da Velocidade Divina dos Cem Raios",
    "nomeCompleto": "Bankai — Jinrai 「迅雷・万雷神速界」 (Banrai Shinsokukai — Domínio da Velocidade Divina dos Cem Raios)",
    "comando": "Bankai — Jinrai, Banrai Shinsokukai!",
    "formatoArma": "O campo se torna uma câmara selada por arcos voltaicos amarelos e relâmpagos contínuos.",
    "poder": "Translocação Sônica Contínua: Cada passo do usuário viaja na velocidade do relâmpago, deixando para trás ondas de choque que atordoam o adversário enquanto desfere cortes sucessivos."
  }
}, {
  "id": "zk-52",
  "numero": "52",
  "nome": "Senbiki",
  "kanji": "「千匹」",
  "traducao": "Ninho das Serpentes de Jade",
  "nomeCompleto": "Senbiki 「千匹」— Ninho das Serpentes de Jade",
  "espirito": "Um encantador de serpentes com corpo coberto de escamas esmeralda e olhos reptilianos profundos.",
  "comando": "Rasteje e dê o bote, Senbiki.",
  "elemento": "Lâmina Sinuosa & Veneno Corrosivo",
  "formatoArma": "A lâmina se contorce como uma cobra viva, capaz de esticar e contornar esquinas para morder o alvo.",
  "poder": "Bote Articulado: Desfere estocadas em trajetórias curvas e sinuosas totalmente imprevisíveis.",
  "bankai": {
    "nome": "Senbiki — Banja Dokukutsu",
    "kanji": "「千匹・万蛇毒窟」",
    "traducao": "Caverna das Dez Mil Serpentes Venenosas",
    "nomeCompleto": "Bankai — Senbiki 「千匹・万蛇毒窟」 (Banja Dokukutsu — Caverna das Dez Mil Serpentes Venenosas)",
    "comando": "Bankai — Senbiki, Banja Dokukutsu!",
    "formatoArma": "O solo se liquefaz em uma massa viva de serpentes gigantescas de puro Reiryoku verde esmeralda.",
    "poder": "Estrangulamento & Inoculação Venenosa: As serpentes engolem e asfixiam o oponente inoculando toxinas que corroem armaduras e drenam o fluxo espiritual."
  }
}, {
  "id": "zk-53",
  "numero": "53",
  "nome": "Fuenshō",
  "kanji": "「浮烟」",
  "traducao": "Fumaça Flutuante",
  "nomeCompleto": "Fuenshō 「浮烟」— Fumaça Flutuante",
  "espirito": "Uma donzela de véus de seda branca que sopra cinzas mornas que nunca caem no chão.",
  "comando": "Disperse o peso do mundo, Fuenshō.",
  "elemento": "Fumaça Mágica & Amortecimento de Hadō",
  "formatoArma": "Uma espada que deixa para trás um rastro espesso de fumaça translúcida que dissipa ataques mágicos.",
  "poder": "Distorção Mágica: Amortece e dissipa a energia de projéteis de Hadō que passem através da fumaça.",
  "bankai": {
    "nome": "Fuenshō — Kūgen Shinkirō",
    "kanji": "「浮烟・空幻蜃気楼」",
    "traducao": "Miragem Celestial do Céu Vazio",
    "nomeCompleto": "Bankai — Fuenshō 「浮烟・空幻蜃気楼」 (Kūgen Shinkirō — Miragem Celestial do Céu Vazio)",
    "comando": "Bankai — Fuenshō, Kūgen Shinkirō!",
    "formatoArma": "Uma névoa colossal cobre quilômetros de distância criando miragens táteis perfeitas.",
    "poder": "Refração Mágica & Retorno de Projéteis: Desvia a trajetória de feitiços disparados na névoa, fazendo-os retornarem automaticamente contra os seus próprios conjuradores."
  }
}, {
  "id": "zk-54",
  "numero": "54",
  "nome": "Hagakure",
  "kanji": "「葉隠」",
  "traducao": "Oculto nas Folhas",
  "nomeCompleto": "Hagakure 「葉隠」— Oculto nas Folhas",
  "espirito": "Um shinobi ancestral com manto de folhagem de outono que se funde com os troncos das árvores sem emitir ruído.",
  "comando": "Desapareça no outono, Hagakure.",
  "elemento": "Camuflagem Tática & Folhas Cortantes",
  "formatoArma": "Uma lâmina fosca que adquire a textura e cor do ambiente ao redor ao menor contato com vegetação ou solo.",
  "poder": "Camuflagem Tática: Anula a presença visual e o calor corporal enquanto o portador estiver encostado em superfícies naturais.",
  "bankai": {
    "nome": "Hagakure — Konoha Hyakujin Ranbu",
    "kanji": "「葉隠・木葉百刃乱舞」",
    "traducao": "Dança das Mil Lâminas das Folhas de Outono",
    "nomeCompleto": "Bankai — Hagakure 「葉隠・木葉百刃乱舞」 (Konoha Hyakujin Ranbu — Dança das Mil Lâminas das Folhas de Outono)",
    "comando": "Bankai — Hagakure, Konoha Hyakujin Ranbu!",
    "formatoArma": "Todas as folhas e folhagens do ambiente se transformam em navalhas afiadas sob o comando mental do portador.",
    "poder": "Turbilhão das Folhas Afiadas: As folhas voam em vórtices cortantes que fatiam defesas inimigas enquanto ocultam a posição real do usuário."
  }
}, {
  "id": "zk-55",
  "numero": "55",
  "nome": "Tōbaku",
  "kanji": "「凍縛」",
  "traducao": "Amarração Glacial",
  "nomeCompleto": "Tōbaku 「凍縛」— Amarração Glacial",
  "espirito": "Uma sacerdotisa aprisionada em um caixão de gelo transparente cujos olhos continuam abertos e vigilantes.",
  "comando": "Aprisione no frio sem fim, Tōbaku.",
  "elemento": "Congelamento de Pontos de Apoio & Pilares",
  "formatoArma": "Uma espada curta que congela instantaneamente qualquer umidade ou poça de água tocada pela ponta.",
  "poder": "Amarração Glacial: Cria laços de gelo ao redor dos pés do adversário assim que ele pisa em solo umedecido pela lâmina.",
  "bankai": {
    "nome": "Tōbaku — Hakutei Hyōchūrō",
    "kanji": "「凍縛・白帝氷柱牢」",
    "traducao": "Prisão dos Pilares de Gelo do Imperador Branco",
    "nomeCompleto": "Bankai — Tōbaku 「凍縛・白帝氷柱牢」 (Hakutei Hyōchūrō — Prisão dos Pilares de Gelo do Imperador Branco)",
    "comando": "Bankai — Tōbaku, Hakutei Hyōchūrō!",
    "formatoArma": "Pilares monumentais de gelo sólido erguem-se do solo encadeando o oponente.",
    "poder": "Encarceramento Glacial: Encerra o adversário em uma câmara de pilares de gelo que drenam continuamente o calor corporal e o vigor espiritual."
  }
}, {
  "id": "zk-56",
  "numero": "56",
  "nome": "Kaimetsu",
  "kanji": "「壊滅」",
  "traducao": "Martelo da Ruína",
  "nomeCompleto": "Kaimetsu 「壊滅」— Martelo da Ruína",
  "espirito": "Um titã de armadura rachada e martelo colossal que caminha sobre escombros de cidades antigas.",
  "comando": "Reduza tudo a escombros, Kaimetsu.",
  "elemento": "Ondas de Choque Estruturais & Trituração",
  "formatoArma": "Uma espada pesada de dorso reforçado que transmite vibrações de esmagamento através de defesas e armaduras.",
  "poder": "Dano Estrutural: Quebra a integridade física de armas e escudos mesmo quando o golpe é bloqueado pelo oponente.",
  "bankai": {
    "nome": "Kaimetsu — Tenhō Chimetsukai",
    "kanji": "「壊滅・天崩地滅壊」",
    "traducao": "Aniquilação da Ruína do Céu e da Terra",
    "nomeCompleto": "Bankai — Kaimetsu 「壊滅・天崩地滅壊」 (Tenhō Chimetsukai — Aniquilação da Ruína do Céu e da Terra)",
    "comando": "Bankai — Kaimetsu, Tenhō Chimetsukai!",
    "formatoArma": "A lâmina se torna um martelo de guerra colossal de Reiryoku negro comprimido.",
    "poder": "Colapso Sísmico Estrutural: Cada golpe no solo gera ondas de choque devastadoras que trituram rochas, racham montanhas e anulam defesas rígidas por impacto."
  }
}, {
  "id": "zk-57",
  "numero": "57",
  "nome": "Akatsuki",
  "kanji": "「暁」",
  "traducao": "Alvorecer Carmesim",
  "nomeCompleto": "Akatsuki 「暁」— Alvorecer Carmesim",
  "espirito": "Uma deusa guerreira com vestes douradas e vermelhas segurando uma tocha acesa com o primeiro raio da aurora.",
  "comando": "Rompa a escuridão do mundo, Akatsuki.",
  "elemento": "Luz Solar Nascente & Calor Progressivo",
  "formatoArma": "Uma espada de lâmina avermelhada que brilha com intensidade e calor crescentes conforme o combate se prolonga.",
  "poder": "Calor Progressivo: Aumenta a temperatura do fio da espada a cada golpe consecutivo desferido.",
  "bankai": {
    "nome": "Akatsuki — Guren Kyokujitsushō",
    "kanji": "「暁・紅蓮旭日昇」",
    "traducao": "Ascensão do Sol Nascente Carmesim",
    "nomeCompleto": "Bankai — Akatsuki 「暁・紅蓮旭日昇」 (Guren Kyokujitsushō — Ascensão do Sol Nascente Carmesim)",
    "comando": "Bankai — Akatsuki, Guren Kyokujitsushō!",
    "formatoArma": "Um sol nascente carmesim monumental se projeta atrás do portador.",
    "poder": "Feixe da Aurora Solar: Dispara feixes concentrados de luz e calor solar que purificam e vaporizam obstáculos em linha reta."
  }
}, {
  "id": "zk-58",
  "numero": "58",
  "nome": "Yūgure",
  "kanji": "「夕暮」",
  "traducao": "Crepúsculo",
  "nomeCompleto": "Yūgure 「夕暮」— Crepúsculo",
  "espirito": "Um viajante solitário com um lampião violeta que caminha na estrada no momento exato em que o sol se põe.",
  "comando": "Desça sobre a luz cansada, Yūgure.",
  "elemento": "Penumbra Crepuscular & Desfase Temporal",
  "formatoArma": "Uma espada envolta em uma penumbra violeta que retarda a percepção do tempo de quem estiver próximo.",
  "poder": "Crepúsculo dos Sentidos: Golpes desferidos na penumbra parecem chegar antes do som da lâmina ser emitido.",
  "bankai": {
    "nome": "Yūgure — Tasokare Higankai",
    "kanji": "「夕暮・黄昏彼岸界」",
    "traducao": "Fronteira da Penumbra do Outro Mundo",
    "nomeCompleto": "Bankai — Yūgure 「夕暮・黄昏彼岸界」 (Tasokare Higankai — Fronteira da Penumbra do Outro Mundo)",
    "comando": "Bankai — Yūgure, Tasokare Higankai!",
    "formatoArma": "O campo de batalha entra em um crepúsculo perpétuo de luz violeta suave.",
    "poder": "Intervalo Temporal do Crepúsculo: Os ataques do portador viajam em um intervalo entre o passado imediato e o presente, tornando previsões ou esquivas quase impossíveis."
  }
}, {
  "id": "zk-59",
  "numero": "59",
  "nome": "Seirō",
  "kanji": "「青狼」",
  "traducao": "Lobo das Chamas Glaciais",
  "nomeCompleto": "Seirō 「青狼」— Lobo das Chamas Glaciais",
  "espirito": "Um lobo espectral com cauda de chamas azuis espirituais e presas de gelo translúcido.",
  "comando": "Uive nas chamas frias, Seirō.",
  "elemento": "Fogo Azul Gélido & Paralisia Térmica",
  "formatoArma": "Uma lâmina curva que emite um fogo azul que não queima matéria, mas congela nervos e o fluxo de Reiryoku.",
  "poder": "Chama Fria: Queima a energia espiritual do alvo na área atingida causando paralisia sem carbonização.",
  "bankai": {
    "nome": "Seirō — Sōen Hyōsetsugoku",
    "kanji": "「青狼・蒼炎氷雪獄」",
    "traducao": "Inferno de Chamas Azuis e Neve Eterna",
    "nomeCompleto": "Bankai — Seirō 「青狼・蒼炎氷雪獄」 (Sōen Hyōsetsugoku — Inferno de Chamas Azuis e Neve Eterna)",
    "comando": "Bankai — Seirō, Sōen Hyōsetsugoku!",
    "formatoArma": "Uma tempestade monumental de fogo azul e gelo cobre toda a arena de batalha.",
    "poder": "Incineração Glacial de Reiryoku: As chamas azuis congelam feitiços no ar e drenam o ímpeto e vigor do oponente simultaneamente."
  }
}, {
  "id": "zk-60",
  "numero": "60",
  "nome": "Tenbinzuru",
  "kanji": "「天秤鶴」",
  "traducao": "Garça da Balança Celestial",
  "nomeCompleto": "Tenbinzuru 「天秤鶴」— Garça da Balança Celestial",
  "espirito": "Uma garça branca de penas metálicas polidas pousada serenamente sobre o prato de uma balança dourada.",
  "comando": "Harmonize o peso das almas, Tenbinzuru.",
  "elemento": "Equilíbrio Energético & Espelhamento",
  "formatoArma": "Uma espada prateada com guarda em forma de garça que equilibra o gasto de Reiryoku do usuário com o do adversário.",
  "poder": "Ressonância Proporcional: Reduz o desgaste energético do usuário em proporção ao esforço exercido pelo inimigo.",
  "bankai": {
    "nome": "Tenbinzuru — Gokuraku Jōdo Tenbin",
    "kanji": "「天秤鶴・極楽浄土天秤」",
    "traducao": "Balança do Santuário Puro",
    "nomeCompleto": "Bankai — Tenbinzuru 「天秤鶴・極楽浄土天秤」 (Gokuraku Jōdo Tenbin — Balança do Santuário Puro)",
    "comando": "Bankai — Tenbinzuru, Gokuraku Jōdo Tenbin!",
    "formatoArma": "Um santuário celestial inviolável surge no céu com duas balanças monumentais de ouro e prata.",
    "poder": "Espelhamento de Dano Absoluto: Qualquer dano físico sofrido por um dos lutadores dentro do domínio é espelhado em proporção exata no adversário, forçando uma disputa de precisão cirúrgica e autocontrole."
  }
}];
const AUTORIAL_PREFIXES = ["Gekka", "Enkō", "Raimei", "Kageori", "Senritsu", "Dokugan", "Kōtetsu", "Shippū", "Tenrin", "Kasumibane", "Rengetsu", "Shinbatsu", "Byakko", "Kurogane", "Ryūsei", "Hakuryū", "Suzuran", "Mugen", "Tsukikage", "Hien", "Yatsukahada", "Reisō", "Kourinpou", "Sōun", "Genshō", "Kagayaki", "Yamikiri", "Seiryuu", "Rindō", "Gurenkō", "Kurokaze", "Hōōmaru", "Chirin", "Suikazan"];
const AUTORIAL_SUFFIXES = ["kiri", "maru", "kiba", "ori", "hime", "zuru", "jin", "kō", "kage", "bane", "tsume", "boshi", "tō", "ken", "ryū", "sō", "ya", "bana", "yari", "kaze", "ren", "shō", "getsu", "sen", "bi", "gumo", "ryo", "dan", "retsu", "ha"];
const AUTORIAL_COMMANDS = ["Floresça no silêncio", "Forje aquilo que ainda não existe", "Olhe para si mesmo", "Desperte no céu", "Chore sobre este mundo", "Reflita aquilo que deveria ser esquecido", "Multiplique-se pelo caminho", "Permaneça onde ninguém pode tocar", "Faça o céu responder", "Pese aquilo que existe", "Trace os limites do abismo", "Abandone a forma passageira", "Revele as sombras da vigília", "Toque aquilo que não tem voz", "Prenda-se ao solo", "Estenda a fronteira do ar", "Engrene o tempo que resta", "Ecoa na mente vazia", "Asfixie o horizonte", "Acorde da montanha", "Tinja o caminho de carmesim", "Dance na geada suave", "Puxe as amarras do abismo", "Purifique a mácula"];
const WEAPON_TYPES = ["Uma nodachi de lâmina enegrecida com fio duplo chanfrado e ranhuras que canalizam Reiryoku pura", "Duas adagas triangulares de aço gravado unidas por uma corrente de elos flutuantes de pura energia", "Uma elegante rapieira de cristal fosco com guarda em prisma triplo que refrata a luz em navalhas", "Uma foice de combate com dorso serrilhado e três sinos espirituais que ressoam frequências desestabilizadoras", "Um cutelo colossal de aço polido reforçado com faixas de seda branca na empunhadura para absorção de impacto", "Uma lança articulada em três segmentos de aço flexível que chicoteia no ar com lâminas retráteis", "Um machado leve de guerra de dois gumes com núcleo oco por onde pulsam arcos de pressão espiritual", "Duas cimitarras curvas de aço rubro brilhante com guarda em formato de meia-lua entrelaçada"];
const PRIMARY_EFFECTS = ["projeta ondas cortantes de alta densidade capazes de fender barreiras espirituais e terra firme", "congela a circulação de Reiryoku do oponente ao menor corte, reduzindo reflexos e velocidade", "descarrega arcos voltaicos perfurantes que eletrocutam nervos motores causando paralisia instantânea", "permite ao Shinigami deslizar instantaneamente entre as sombras do terreno em ângulos impossíveis", "duplica a massa gravitacional da arma a cada colisão bem-sucedida, quebrando defesas de impacto", "expele uma névoa corrosiva que consome projéteis mágicos de Kidō antes que atinjam o portador", "cria círculos de ressonância no solo que aprisionam o peso corporal do inimigo em alta gravidade", "multiplica a velocidade do Shunpo do usuário gerando clones residuais táteis de pura pressão"];
const SECONDARY_EFFECTS = ["Além disso, reveste o corpo com um manto defensivo que dissipa feitiços de dano cinético.", "Além disso, cada ataque bem-sucedido recupera uma fração da reserva de Reiatsu da lâmina.", "Além disso, permite disparar feitiços de Hadō canalizados diretamente através do fio da espada.", "Além disso, emite um zumbido subsônico que desorienta a percepção sensorial e equilíbrio do alvo."];
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
  return {
    claimedNames,
    claimedPowers
  };
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
    nome = `${pfx}${sfx}`;
    const lower = nome.toLowerCase();
    if (!claimedNames.has(lower) && !usadosNoMomento.has(lower)) {
      usadosNoMomento.add(lower);
      return nome;
    }
    tentativas++;
  }
  nome = `${AUTORIAL_PREFIXES[0]}${AUTORIAL_SUFFIXES[0]} ${uid().toUpperCase()}`;
  usadosNoMomento.add(nome.toLowerCase());
  return nome;
}
function gerar4OpcoesShikaiAI(nomePersonagem, dbPersonagens = []) {
  const {
    claimedNames,
    claimedPowers
  } = getClaimedZanpakutos(dbPersonagens);
  const opcoes = [];
  const usadosNoMomento = new Set();
  const elementos = ["Chamas de Ébano & Brasas Solares", "Cristal Glacial & Zero Absoluto", "Relâmpago do Vórtice & Plasma Celeste", "Sombra Abissal & Distorção Dimensional", "Aço Puro & Alta Densidade Gravitacional", "Vento Cortante & Lâminas de Vácuo", "Veneno Espectral & Corrosão de Reiryoku", "Luz & Julgamento do Firmamento"];

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
        nomeCompleto: item.nomeCompleto || item.nome + " " + item.kanji + " — " + item.traducao,
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
    const poderDesc = `Ao proferir o comando "${comando}", a arma se manifesta. Em combate: Esta lâmina ${efeitoPrim}. ${efeitoSec}`;
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
  const {
    claimedNames,
    claimedPowers
  } = getClaimedZanpakutos(dbPersonagens);
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
    const nomeBk = bankaiCanonico.nomeCompleto || "Bankai — " + bankaiCanonico.nome + " " + (bankaiCanonico.kanji || '') + " (" + (bankaiCanonico.traducao || '') + ")";
    usadosNoMomento.add(nomeBk.toLowerCase());
    opcoes.push({
      id: uid(),
      nome: bankaiCanonico.nome,
      nomeCompleto: nomeBk,
      kanji: bankaiCanonico.kanji || "「卍解」",
      traducao: bankaiCanonico.traducao || "Liberação Completa",
      comando: bankaiCanonico.comando || "Bankai — " + bankaiCanonico.nome + "!",
      elemento,
      formatoArma: bankaiCanonico.formatoArma,
      poder: bankaiCanonico.poder,
      espirito: shikaiAtiva?.espirito || "Ressonância transcendental entre a alma e o espírito ancestral da lâmina.",
      foto: "assets/ichigo-moon.png"
    });
  }

  // 2. Evoluções temáticas adicionais de altíssima qualidade
  const evolucoesTematicas = [{
    sufixo: "Shūen Teien (Jardim do Fim)",
    kanji: "「終焉庭園」",
    titulo: "Bankai — " + baseNome + "・Shūen Teien",
    formato: "O campo de batalha inteiro se transforma no domínio absoluto de " + baseNome + ". Monumentais manifestações espirituais emergem do solo e toda a atmosfera se sintoniza à pressão da lâmina.",
    poder: "Domínio de Redistribuição Absoluta: Todas as propriedades e acúmulos da Shikai são expandidos para escala territorial. O portador pode transferir instantaneamente qualquer desvantagem do combate em aceleração, dano concentrado ou anulação de técnicas inimigas."
  }, {
    sufixo: "Kongō Taihō (Fornalha Celestial do Diamante)",
    kanji: "「金剛大鵬」",
    titulo: "Bankai — " + baseNome + "・Kongō Taihō",
    formato: "O usuário é revestido por uma armadura colossal de Reiryoku comprimida em camadas de diamante e metal espiritual, empunhando duas armas monumentais de alcance estendido.",
    poder: "Conversão Metabólica Transcendental: Cada choque de combate refina e multiplica a velocidade e a densidade de corte do usuário, concedendo imunidade progressiva a danos cinéticos e rompendo qualquer barreira mágica de Bakudō."
  }, {
    sufixo: "Mugen Kairō (Corredor dos Mil Reflexos)",
    kanji: "「無限回廊」",
    titulo: "Bankai — " + baseNome + "・Mugen Kairō",
    formato: "O espaço ao redor se estilhaça em uma câmara dimensional espelhada onde dezenas de réplicas de Reiryoku tangíveis executam movimentos simultâneos.",
    poder: "Mobilidade & Ataque Omnidirecional: O portador pode translocar-se instantaneamente entre qualquer reflexo ativo, disparando estocadas a partir de múltiplos ângulos cegos enquanto dissipa o impacto de ataques sofridos em cópias residuais."
  }, {
    sufixo: "Tenkan Gōtenritsu (Anel da Lei Celestial)",
    kanji: "「天環・轟天律」",
    titulo: "Bankai — " + baseNome + "・Tenkan Gōtenritsu",
    formato: "Anéis de atração gravitacional e relâmpagos cósmicos giram em torno de todo o perímetro da arena, gerando uma zona de alta densidade espiritual.",
    poder: "Controle Vetorial Absoluto: Todo ataque, feitiço ou combatente que entra no raio de ação da Bankai é submetido à trajetória das órbitas da lâmina, permitindo desviar investidas maciças e impor um ritmo de combate intransponível."
  }];
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
const gerar3OpcoesBankaiAI = gerar4OpcoesBankaiAI;

// Power Tier Calculator (Baseado no Ponto 8 Oficial do RPG)
function getPowerTier(statVal) {
  const val = statVal > 150 ? Math.round(statVal / 4) : statVal;
  if (val <= 10) return {
    title: "Inexperiente",
    patamar: "1–10",
    color: C.muted
  };
  if (val <= 30) return {
    title: "Iniciante",
    patamar: "11–30",
    color: C.green
  };
  if (val <= 60) return {
    title: "Treinado",
    patamar: "31–60",
    color: C.blue
  };
  if (val <= 100) return {
    title: "Experiente",
    patamar: "61–100",
    color: C.purple
  };
  if (val <= 150) return {
    title: "Elite",
    patamar: "101–150",
    color: C.orange
  };
  if (val <= 250) return {
    title: "Alto Nível",
    patamar: "151–250",
    color: C.yellow
  };
  if (val <= 400) return {
    title: "Monstruoso",
    patamar: "251–400",
    color: C.red
  };
  if (val <= 600) return {
    title: "Lendário",
    patamar: "401–600",
    color: C.orangeDeep
  };
  return {
    title: "Transcendente",
    patamar: "601+",
    color: "#FFFFFF"
  };
}
function uid() {
  return Math.random().toString(36).slice(2, 10);
}
function nowStr() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR") + " às " + d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });
}
function maskWhats(w) {
  if (!w) return "";
  const cleaned = w.replace(/\D/g, "");
  if (cleaned.length < 4) return cleaned;
  return "•••• " + cleaned.slice(-4);
}

// Advanced Sound FX Generator via Web Audio API
function playReiatsuSound(type = 'roll') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (type === 'hum') {
      // Vibrating air resonance on card hover/touch
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
      osc.stop(ctx.currentTime + 0.35);
      lfo.stop(ctx.currentTime + 0.35);
    } else if (type === 'charge') {
      // Escalating pulse for loading sequence
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'shatter') {
      // Glass / seal shattering crystalline explosion
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
    } else if (type === 'shikai') {
      [440, 554.37, 659.25, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.8);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.8);
      });
    } else if (type === 'bankai') {
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(110, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.7);
      subGain.gain.setValueAtTime(0.35, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.9);
      subOsc.start();
      subOsc.stop(ctx.currentTime + 0.9);
      [220, 277.18, 329.63, 440, 554.37].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + 0.15 + i * 0.07);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + 0.15 + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15 + i * 0.07 + 1.2);
        osc.start(ctx.currentTime + 0.15 + i * 0.07);
        osc.stop(ctx.currentTime + 0.15 + i * 0.07 + 1.2);
      });
    }
  } catch (e) {}
}

// Initial Default Database
const DEFAULT_DB = {
  superAdminSenha: "maximo2026",
  superAdminNome: "ADM Máximo (Comandante Supremo)",
  firebaseUrl: "https://bleach-rpg-6894c-default-rtdb.firebaseio.com/",
  // URL oficial do Firebase Realtime DB para sync multi-dispositivos
  subAdms: [{
    id: "adm-kisuke",
    usuario: "kisuke",
    senha: "123",
    nome: "Mestre Kisuke",
    cargo: "Avaliador de Cenas & Fichas",
    charId: "rukia-002"
  }],
  registrosTarefasAdm: [{
    id: "t1",
    admNome: "Mestre Kisuke",
    tarefa: "Avaliação de Cenas de Arco (+8 pontos)",
    pontosGanhos: 8,
    data: "21/08/2026 às 14:00"
  }],
  combatesArena: [{
    id: "arena-1",
    p1Id: "ren-001",
    p2Id: "rukia-002",
    p1Nome: "Kurosaki Ren",
    p2Nome: "Kuchiki Rukia",
    p1Estado: "Inteiro",
    p2Estado: "Inteiro",
    turno: "Turno 2 — Troca de Hadō e Shunpo",
    juizLog: "Ren abriu com Hadō #4 Byakurai; Rukia esquivou com Hohō e contra-atacou com Bakudō #61.",
    status: "Em Andamento"
  }],
  iaJulgamentos: [],
  rolagensDadosPublicas: [],
  personagens: [{
    id: "ren-001",
    nome: "Kurosaki Ren",
    foto: "assets/ichigo-orange.png",
    whatsapp: "11999998888",
    codigo: "REN-8921",
    raca: "Shinigami Ex-Humano",
    esquadrao: "11º Esquadrão",
    faceclaim: "Ichigo Kurosaki",
    idadePlayer: "24",
    aniversarioPlayer: "15/07",
    idadeChar: "18",
    aniversarioChar: "15/07",
    pontosDisponiveis: 7,
    sorteiosComunsRestantes: 2,
    sorteiosEspeciaisRestantes: 1,
    sorteiosDrops: [],
    permissoes: {
      shikaiLiberada: true,
      bankaiLiberada: false
    },
    atributos: {
      pressao: 37,
      forca: 28,
      velocidade: 48,
      resiliencia: 26
    },
    kidosConhecidos: [{
      id: "h4",
      numero: 4,
      nome: "Byakurai",
      cat: "Hadō",
      custoReiatsu: 3
    }, {
      id: "b1",
      numero: 1,
      nome: "Sai",
      cat: "Bakudō",
      custoReiatsu: 2
    }],
    tecnicas: [{
      id: "t1",
      nome: "Hadō #4 — Byakurai",
      categoria: "Hadō"
    }, {
      id: "t2",
      nome: "Bakudō #1 — Sai",
      categoria: "Bakudō"
    }, {
      id: "t4",
      nome: "Shunpo — Passo Relâmpago",
      categoria: "Hohō"
    }],
    zanpakuto: {
      nome: "Gekkaryū",
      fotoShikai: "assets/ichigo-orange.png",
      fotoBankai: "assets/ichigo-moon.png",
      shikaiAtiva: {
        nome: "Gekkaryū",
        comando: "Fenda o crepúsculo, Gekkaryū!",
        elemento: "Chamas de Ébano & Brasas Solares",
        formatoArma: "Uma nodachi de lâmina enegrecida com fio duplo chanfrado e ranhuras que canalizam Reiryoku pura",
        poder: "Ao proferir o comando, a lâmina projeta ondas cortantes de fogo comprimido que queimam barreiras e aumentam a temperatura do campo de batalha.",
        foto: "assets/ichigo-orange.png"
      },
      bankaiAtiva: null,
      notas: "Zanpakutō autoral e individual registrada no Sereitei."
    },
    estado: "Inteiro",
    treinosHoje: 0,
    historico: [{
      id: "h1",
      data: "21/08/2026 às 10:30",
      texto: "Treino em ON aprovado pelo ADM: +2 Velocidade"
    }, {
      id: "h2",
      data: "20/08/2026 às 16:45",
      texto: "Missão Principal: +15 Pontos concedidos + 4 Giros Comuns + 1 Especial"
    }]
  }, {
    id: "rukia-002",
    nome: "Kuchiki Rukia",
    foto: "assets/ichigo-moon.png",
    whatsapp: "11988887777",
    codigo: "RUK-3312",
    raca: "Shinigami",
    esquadrao: "13º Esquadrão",
    faceclaim: "Rukia Kuchiki",
    idadePlayer: "22",
    aniversarioPlayer: "14/01",
    idadeChar: "150",
    aniversarioChar: "14/01",
    pontosDisponiveis: 12,
    sorteiosComunsRestantes: 1,
    sorteiosEspeciaisRestantes: 0,
    sorteiosDrops: [],
    permissoes: {
      shikaiLiberada: true,
      bankaiLiberada: false
    },
    atributos: {
      pressao: 45,
      forca: 18,
      velocidade: 42,
      resiliencia: 30
    },
    kidosConhecidos: [{
      id: "h33",
      numero: 33,
      nome: "Sōkatsui",
      cat: "Hadō",
      custoReiatsu: 7
    }],
    tecnicas: [{
      id: "t5",
      nome: "Hadō #33 — Sōkatsui",
      categoria: "Hadō"
    }],
    zanpakuto: {
      nome: "Kasumibane",
      fotoShikai: "assets/ichigo-moon.png",
      fotoBankai: "assets/ichigo-moon.png",
      shikaiAtiva: {
        nome: "Kasumibane",
        comando: "Gele o pulso da terra, Kasumibane!",
        elemento: "Cristal Glacial & Zero Absoluto",
        formatoArma: "Uma elegante rapieira de cristal fosco com guarda em prisma triplo que refrata a luz em navalhas",
        poder: "Todo corte congela instantaneamente a umidade do corpo do alvo e reduz drasticamente a velocidade de circulação de Reiatsu e movimentação.",
        foto: "assets/ichigo-moon.png"
      },
      bankaiAtiva: null,
      notas: "Lâmina cristalina individual e exclusiva da Sociedade das Almas."
    },
    estado: "Inteiro",
    treinosHoje: 0,
    historico: [{
      id: "h5",
      data: "21/08/2026 às 11:15",
      texto: "Recompensa de Missão: +15 Pontos disponíveis"
    }]
  }]
};

// Calculate Rankings
function calculateRankings(personagens) {
  if (!personagens || personagens.length === 0) return {
    rankFisico: [],
    rankPressao: []
  };
  const rankFisico = [...personagens].map(p => {
    const f = Number(p.atributos?.forca || 0);
    const v = Number(p.atributos?.velocidade || 0);
    const r = Number(p.atributos?.resiliencia || 0);
    const score = Number(((f + v + r) / 3).toFixed(1));
    return {
      id: p.id,
      nome: p.nome,
      foto: p.foto,
      score,
      forca: f,
      vel: v,
      res: r
    };
  }).sort((a, b) => b.score - a.score);
  const rankPressao = [...personagens].map(p => {
    const score = Number(p.atributos?.pressao || 0);
    return {
      id: p.id,
      nome: p.nome,
      foto: p.foto,
      score
    };
  }).sort((a, b) => b.score - a.score);
  return {
    rankFisico,
    rankPressao
  };
}

// MAIN APP COMPONENT
function App() {
  const [db, setDb] = useState(null);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState(null);
  const [view, setView] = useState("sistemas");
  const [adminCharId, setAdminCharId] = useState(null);
  const [saveErr, setSaveErr] = useState("");
  const [cloudStatus, setCloudStatus] = useState("local"); // "local", "connected", "syncing", "error"
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

      // 1. Try to load config.json (central repo config)
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
          const cleanUrl = cloudUrl.replace(/\/$/, "");
          const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
          const res = await fetch(endpoint + '?t=' + Date.now());
          if (res.ok) {
            const cloudData = await res.json();
            if (cloudData && typeof cloudData === 'object' && cloudData.personagens) {
              initialData = {
                ...initialData,
                ...cloudData,
                firebaseUrl: cloudUrl
              };
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

  // Periodic background cloud sync (every 10s if connected)
  useEffect(() => {
    if (!activeCloudUrl || cloudStatus !== "connected") return;
    const interval = setInterval(async () => {
      try {
        const cleanUrl = activeCloudUrl.replace(/\/$/, "");
        const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
        const res = await fetch(endpoint + '?t=' + Date.now());
        if (res.ok) {
          const cloudData = await res.json();
          if (cloudData && typeof cloudData === 'object' && cloudData.personagens) {
            setDb(prev => ({
              ...prev,
              ...cloudData
            }));
          }
        }
      } catch (e) {}
    }, 10000);
    return () => clearInterval(interval);
  }, [activeCloudUrl, cloudStatus]);

  // Save DB to localStorage AND push to Cloud Firebase if configured
  async function saveDb(next) {
    setDb(next);
    try {
      localStorage.setItem("bleachDB", JSON.stringify(next));
      setSaveErr("");
    } catch (e) {
      setSaveErr("Não foi possível salvar os dados no navegador.");
    }
    const cloudUrl = next.firebaseUrl || activeCloudUrl || localStorage.getItem("bleach_firebase_url");
    if (cloudUrl) {
      try {
        setCloudStatus("syncing");
        const cleanUrl = cloudUrl.replace(/\/$/, "");
        const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
        await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
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
    if (session.role === "jogador") return (db.personagens || []).find(p => p.id === session.charId) || null;
    if ((session.role === "super_admin" || session.role === "sub_admin") && adminCharId) {
      return (db.personagens || []).find(p => p.id === adminCharId) || null;
    }
    return null;
  }, [db, session, adminCharId]);
  const {
    rankFisico,
    rankPressao
  } = useMemo(() => {
    return calculateRankings(db?.personagens || []);
  }, [db?.personagens]);
  if (!ready || !db) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col items-center justify-center min-h-screen text-bleach-creamDim"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-3xl font-cinzel tracking-widest text-bleach-orange animate-pulse mb-3"
    }, "SOCIEDADE DAS ALMAS"), /*#__PURE__*/React.createElement("div", {
      className: "text-sm font-sans"
    }, "Abrindo port\xF5es do Sereitei..."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TopBar, {
    session: session,
    onLogout: logout,
    view: view,
    setView: setView,
    nome: session?.role === "super_admin" ? "ADM Máximo" : session?.role === "sub_admin" ? session.nome : myChar?.nome,
    onOpenAdminLogin: () => setShowAdminLoginModal(true),
    cloudStatus: cloudStatus
  }), saveErr && /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto mt-4 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-red-950/80 border border-red-600/50 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, "\u26A0\uFE0F ", saveErr), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSaveErr(""),
    className: "text-xs underline ml-4"
  }, "Fechar"))), /*#__PURE__*/React.createElement("main", {
    className: "max-w-6xl mx-auto px-4 py-6"
  }, view === "sistemas" && /*#__PURE__*/React.createElement(SistemasView, null), view === "rankings" && /*#__PURE__*/React.createElement(RankingsView, {
    rankFisico: rankFisico,
    rankPressao: rankPressao,
    myCharId: myChar?.id
  }), view === "kidos" && /*#__PURE__*/React.createElement(KidosView, {
    personagem: myChar,
    isAdmin: session?.role === "super_admin" || session?.role === "sub_admin"
  }), view === "arena" && /*#__PURE__*/React.createElement(ArenaView, {
    db: db,
    saveDb: saveDb,
    session: session,
    myChar: myChar
  }), view === "ficha" && (!session ? /*#__PURE__*/React.createElement(LoginScreen, {
    db: db,
    setDb: setDb,
    activeCloudUrl: activeCloudUrl,
    onLogin: s => {
      setSession(s);
      setView("ficha");
    },
    onOpenAdminModal: () => setShowAdminLoginModal(true)
  }) : session.role === "jogador" ? /*#__PURE__*/React.createElement(FichaView, {
    db: db,
    saveDb: saveDb,
    personagem: myChar,
    isAdmin: false,
    rankFisico: rankFisico,
    rankPressao: rankPressao
  }) : /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-xl p-8 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim mb-4"
  }, "Voc\xEA est\xE1 logado na Administra\xE7\xE3o (", session.role === "super_admin" ? "ADM Máximo" : session.nome, ")."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("admin"),
    className: "px-6 py-2.5 bg-bleach-orange text-black font-bold uppercase rounded-lg shadow-lg hover:bg-orange-400 transition"
  }, "Ir para o Painel ADM"))), view === "admin" && (!session || session.role !== "super_admin" && session.role !== "sub_admin" ? /*#__PURE__*/React.createElement(AdminLoginScreen, {
    db: db,
    onLoginAdmin: s => {
      setSession(s);
      setView("admin");
    }
  }) : /*#__PURE__*/React.createElement(AdminPanel, {
    db: db,
    saveDb: saveDb,
    session: session,
    cloudStatus: cloudStatus,
    onAbrirFicha: id => {
      setAdminCharId(id);
      setView("admin-ficha");
    }
  })), view === "admin-ficha" && (session?.role === "super_admin" || session?.role === "sub_admin") && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("admin"),
    className: "inline-flex items-center gap-2 mb-6 px-4 py-2 bg-bleach-panel border border-bleach-border rounded-lg text-sm text-bleach-creamDim hover:text-white hover:border-bleach-orange transition"
  }, "\u2190 Voltar ao Painel Admin"), myChar ? /*#__PURE__*/React.createElement(FichaView, {
    db: db,
    saveDb: saveDb,
    personagem: myChar,
    isAdmin: true,
    rankFisico: rankFisico,
    rankPressao: rankPressao
  }) : /*#__PURE__*/React.createElement("div", {
    className: "text-bleach-muted"
  }, "Personagem n\xE3o encontrado.")))), /*#__PURE__*/React.createElement("footer", {
    className: "border-t border-bleach-border/60 bg-bleach-bg2/90 py-6 mt-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-bleach-muted"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-title tracking-widest text-bleach-orange text-sm"
  }, "BLEACH RPG"), /*#__PURE__*/React.createElement("span", null, "\u2022 Sociedade das Almas \xA9 2026"), /*#__PURE__*/React.createElement("span", {
    onClick: () => setShowAdminLoginModal(true),
    title: "",
    className: "opacity-20 hover:opacity-80 transition cursor-pointer text-[11px] font-cinzel ml-1 select-none"
  }, "\u970A")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("span", null, "Treinamento em OFF \u2022 Combate Narrativo sem Excesso de Rolagens (1d6) \u2022 Zanpakut\u014D & Rankings")))), showAdminLoginModal && /*#__PURE__*/React.createElement(AdminLoginModal, {
    db: db,
    onClose: () => setShowAdminLoginModal(false),
    onSuccess: s => {
      setSession(s);
      setView("admin");
      setShowAdminLoginModal(false);
    }
  }));
}

// TOP NAVIGATION BAR
function TopBar({
  session,
  onLogout,
  view,
  setView,
  nome,
  onOpenAdminLogin,
  cloudStatus
}) {
  const isAdmin = session?.role === "super_admin" || session?.role === "sub_admin";
  return /*#__PURE__*/React.createElement("header", {
    className: "border-b border-bleach-border bg-bleach-bg2/95 backdrop-blur sticky top-0 z-40 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setView("sistemas"),
    className: "cursor-pointer flex items-center gap-3 group"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-lg bg-gradient-to-br from-bleach-orange to-bleach-orangeDeep flex items-center justify-center font-cinzel font-black text-black text-xl shadow-lg group-hover:scale-105 transition"
  }, "\u534D"), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-title text-2xl tracking-widest text-bleach-orange leading-none group-hover:text-orange-400 transition"
  }, "BLEACH RPG"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-sans tracking-wider text-bleach-creamDim uppercase flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "Sociedade das Almas"), cloudStatus === "connected" && /*#__PURE__*/React.createElement("span", {
    className: "text-green-400 font-bold"
  }, "\u2022 \u2601\uFE0F Nuvem Ativa"), cloudStatus === "syncing" && /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-400 font-bold"
  }, "\u2022 \u23F3 Sincronizando")))), /*#__PURE__*/React.createElement("nav", {
    className: "flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("sistemas"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "sistemas" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCD6"), /*#__PURE__*/React.createElement("span", null, "Sistemas")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("rankings"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "rankings" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("span", null, "Rankings")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("kidos"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "kidos" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u26A1"), /*#__PURE__*/React.createElement("span", null, "Kid\u014Ds & Reiatsu")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("arena"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "arena" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), /*#__PURE__*/React.createElement("span", null, "Arena")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("ficha"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "ficha" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orangeDeep shadow-sm" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), /*#__PURE__*/React.createElement("span", null, "Minha Ficha")), isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("admin"),
    className: `px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap flex items-center gap-1.5 ${view === "admin" || view === "admin-ficha" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500 shadow-sm" : "text-yellow-400/80 hover:text-yellow-300 hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC51"), /*#__PURE__*/React.createElement("span", null, "Painel ADM"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, session ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:flex flex-col text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-bleach-cream"
  }, session.role === "super_admin" ? "ADM Máximo" : session.role === "sub_admin" ? session.nome : nome || "Jogador"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-orange"
  }, session.role === "super_admin" ? "Comandante Supremo" : session.role === "sub_admin" ? "Administrador" : "Conectado")), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "px-2.5 py-1 bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-red-400 rounded-md text-xs font-medium transition"
  }, "Sair")) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("ficha"),
    className: "px-3 py-1.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-bold rounded-lg text-xs tracking-wider uppercase hover:brightness-110 transition shadow"
  }, "Entrar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onOpenAdminLogin,
    title: "",
    className: "w-7 h-7 rounded bg-transparent border border-white/5 text-[10px] text-bleach-muted/30 hover:text-bleach-orange/70 hover:border-bleach-border flex items-center justify-center font-cinzel transition cursor-pointer select-none"
  }, "\u9B42")))));
}

// CHAIN SVG SEPARATOR
function ChainDivider() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center my-4 overflow-hidden"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 300 14",
    className: "w-full max-w-[280px] h-3 text-bleach-orange",
    "aria-hidden": "true"
  }, Array.from({
    length: 10
  }).map((_, i) => /*#__PURE__*/React.createElement("ellipse", {
    key: i,
    cx: 15 + i * 30,
    cy: 7,
    rx: 11,
    ry: 5.5,
    fill: "none",
    stroke: i % 2 === 0 ? "currentColor" : "#C94E0A",
    strokeWidth: "2.4",
    transform: i % 2 === 0 ? undefined : `rotate(90 ${15 + i * 30} 7)`
  }))));
}

// SECTION WRAPPER
function Section({
  title,
  subtitle,
  children,
  right,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bg-bleach-panel border border-bleach-border rounded-xl p-5 mb-5 shadow-lg relative overflow-hidden ${className}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-bleach-borderSoft pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-1.5 h-5 bg-bleach-orange rounded-full shadow-[0_0_10px_#FF6A13]"
  }), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-xl tracking-wider uppercase text-bleach-cream"
  }, title)), subtitle && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-0.5 ml-3.5"
  }, subtitle)), right && /*#__PURE__*/React.createElement("div", null, right)), children);
}

// BADGE COMPONENT
function Badge({
  color,
  children,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color,
      borderColor: color,
      backgroundColor: `${color}15`
    },
    className: `inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase border px-2.5 py-1 rounded-full ${className}`
  }, children);
}

// PLAYER LOGIN SCREEN
function LoginScreen({
  db,
  onLogin,
  onOpenAdminModal,
  activeCloudUrl,
  setDb
}) {
  const [identificador, setIdentificador] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  async function entrarJogador(e) {
    e.preventDefault();
    const termo = identificador.trim().toLowerCase();
    const cod = codigo.trim().toLowerCase();
    if (!cod) {
      setErro("Por favor, digite o Código de Acesso do seu personagem.");
      return;
    }
    setCarregando(true);
    setErro("");
    let currentPersonagens = db.personagens || [];

    // If cloud URL is configured, try a fresh live fetch to get latest characters
    const cloudUrl = activeCloudUrl || db.firebaseUrl || localStorage.getItem("bleach_firebase_url");
    if (cloudUrl) {
      try {
        const cleanUrl = cloudUrl.replace(/\/$/, "");
        const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
        const res = await fetch(endpoint + '?t=' + Date.now());
        if (res.ok) {
          const freshData = await res.json();
          if (freshData && freshData.personagens) {
            currentPersonagens = freshData.personagens;
            if (setDb) setDb(prev => ({
              ...prev,
              ...freshData
            }));
            localStorage.setItem("bleachDB", JSON.stringify(freshData));
          }
        }
      } catch (err) {
        console.warn("Direct cloud fetch failed, checking local data...", err);
      }
    }
    const digitsOnly = termo.replace(/\D/g, "");
    const matchingChars = currentPersonagens.filter(c => {
      const cCode = (c.codigo || "").trim().toLowerCase();
      return cCode === cod;
    });
    if (matchingChars.length === 0) {
      setCarregando(false);
      setErro("Código de acesso incorreto ou personagem não encontrado. Verifique se o ADM salvou a ficha e a Nuvem.");
      return;
    }
    let p = matchingChars[0];
    if (termo) {
      const foundSpecific = matchingChars.find(c => {
        const cPhone = (c.whatsapp || "").replace(/\D/g, "");
        const cName = (c.nome || "").toLowerCase();
        if (digitsOnly.length >= 4 && (cPhone.includes(digitsOnly) || digitsOnly.includes(cPhone.slice(-8)))) {
          return true;
        }
        if (cName.includes(termo) || termo.includes(cName)) {
          return true;
        }
        return false;
      });
      if (foundSpecific) {
        p = foundSpecific;
      }
    }
    setCarregando(false);
    onLogin({
      role: "jogador",
      charId: p.id
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-md mx-auto py-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-card-ichigo border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl tracking-widest text-bleach-orange reiatsu-text-glow"
  }, "FICHA DO JOGADOR"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "Insira o seu C\xF3digo de Acesso fornecido pela ADM para entrar na sua ficha"), /*#__PURE__*/React.createElement(ChainDivider, null)), /*#__PURE__*/React.createElement("form", {
    onSubmit: entrarJogador,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "WhatsApp ou Nome do Personagem (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: 11999998888 ou Kurosaki Ren",
    value: identificador,
    onChange: e => setIdentificador(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-3 text-white placeholder-bleach-muted text-sm focus:outline-none focus:border-bleach-orange focus:ring-1 focus:ring-bleach-orange transition"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "C\xF3digo de Acesso (Senha do Player) *"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Ex: REN-8921 ou seu c\xF3digo",
    value: codigo,
    onChange: e => setCodigo(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-3 text-white placeholder-bleach-muted text-sm focus:outline-none focus:border-bleach-orange focus:ring-1 focus:ring-bleach-orange transition font-mono"
  })), erro && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-950/80 border border-red-500/50 rounded-lg text-red-200 text-xs font-medium leading-relaxed"
  }, "\u26A0\uFE0F ", erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-sm uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 active:scale-[0.99] transition"
  }, "Entrar na Ficha")), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-5 border-t border-bleach-borderSoft flex flex-col gap-2 text-center text-xs text-bleach-muted"
  }, /*#__PURE__*/React.createElement("p", null, "N\xE3o possui um c\xF3digo de acesso? Solicite com a administra\xE7\xE3o no WhatsApp do RPG."), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 flex justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    onClick: onOpenAdminModal,
    className: "text-[10px] text-bleach-muted/30 hover:text-bleach-muted cursor-pointer transition select-none"
  }, "Acesso Institucional \u9B42")))));
}

// ADMIN LOGIN SCREEN & MODAL
function AdminLoginScreen({
  db,
  onLoginAdmin
}) {
  const [tipoLogin, setTipoLogin] = useState("maximo");
  const [senhaMax, setSenhaMax] = useState("");
  const [subUser, setSubUser] = useState("");
  const [subPass, setSubPass] = useState("");
  const [erro, setErro] = useState("");
  function entrar(e) {
    e.preventDefault();
    if (tipoLogin === "maximo") {
      if (senhaMax !== (db.superAdminSenha || "maximo2026")) {
        setErro("Senha de ADM Máximo incorreta.");
        return;
      }
      onLoginAdmin({
        role: "super_admin",
        nome: "ADM Máximo"
      });
    } else {
      const sub = (db.subAdms || []).find(a => a.usuario.toLowerCase() === subUser.trim().toLowerCase() && a.senha === subPass.trim());
      if (!sub) {
        setErro("Usuário ou senha de Sub-ADM incorretos.");
        return;
      }
      onLoginAdmin({
        role: "sub_admin",
        admId: sub.id,
        nome: sub.nome,
        cargo: sub.cargo,
        charId: sub.charId
      });
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-md mx-auto py-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-3xl"
  }, "\uD83D\uDC51"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-3xl tracking-widest text-bleach-orange mt-2"
  }, "PAINEL ADMINISTRATIVO"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "Selecione seu n\xEDvel de acesso administrativo"), /*#__PURE__*/React.createElement(ChainDivider, null)), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setTipoLogin("maximo");
      setErro("");
    },
    className: `flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${tipoLogin === "maximo" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500 shadow" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim"}`
  }, "\uD83D\uDC51 ADM M\xE1ximo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setTipoLogin("sub");
      setErro("");
    },
    className: `flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${tipoLogin === "sub" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orange shadow" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim"}`
  }, "\uD83D\uDEE1\uFE0F Sub-ADM")), /*#__PURE__*/React.createElement("form", {
    onSubmit: entrar,
    className: "space-y-4"
  }, tipoLogin === "maximo" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "Senha Mestra do ADM M\xE1ximo"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Senha mestra (Padr\xE3o: maximo2026)",
    value: senhaMax,
    onChange: e => setSenhaMax(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-3 text-white placeholder-bleach-muted text-sm focus:outline-none focus:border-bleach-orange focus:ring-1 focus:ring-bleach-orange transition font-mono"
  })) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "Usu\xE1rio do Sub-ADM"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: kisuke",
    value: subUser,
    onChange: e => setSubUser(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-bleach-orange"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-semibold text-bleach-creamDim uppercase tracking-wider mb-1.5"
  }, "Senha Individual"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: subPass,
    onChange: e => setSubPass(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-bleach-orange"
  }))), erro && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-red-300 text-xs font-medium"
  }, "\u26A0\uFE0F ", erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-sm uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 transition"
  }, tipoLogin === "maximo" ? "Acessar como ADM Máximo" : "Acessar como Sub-ADM"))));
}
function AdminLoginModal({
  db,
  onClose,
  onSuccess
}) {
  const [tipoLogin, setTipoLogin] = useState("maximo");
  const [senhaMax, setSenhaMax] = useState("");
  const [subUser, setSubUser] = useState("");
  const [subPass, setSubPass] = useState("");
  const [erro, setErro] = useState("");
  function submit(e) {
    e.preventDefault();
    if (tipoLogin === "maximo") {
      if (senhaMax !== (db.superAdminSenha || "maximo2026")) {
        setErro("Senha incorreta.");
        return;
      }
      onSuccess({
        role: "super_admin",
        nome: "ADM Máximo"
      });
    } else {
      const sub = (db.subAdms || []).find(a => a.usuario.toLowerCase() === subUser.trim().toLowerCase() && a.senha === subPass.trim());
      if (!sub) {
        setErro("Credenciais de Sub-ADM inválidas.");
        return;
      }
      onSuccess({
        role: "sub_admin",
        admId: sub.id,
        nome: sub.nome,
        cargo: sub.cargo,
        charId: sub.charId
      });
    }
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-xl p-6 max-w-sm w-full shadow-2xl relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute top-4 right-4 text-bleach-muted hover:text-white text-lg font-bold"
  }, "\u2715"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl text-bleach-orange tracking-wider mb-2"
  }, "LOGIN ADMINISTRATIVO"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setTipoLogin("maximo");
      setErro("");
    },
    className: `flex-1 py-1.5 rounded text-xs font-bold uppercase transition ${tipoLogin === "maximo" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500" : "bg-black text-bleach-muted"}`
  }, "\uD83D\uDC51 ADM M\xE1ximo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setTipoLogin("sub");
      setErro("");
    },
    className: `flex-1 py-1.5 rounded text-xs font-bold uppercase transition ${tipoLogin === "sub" ? "bg-bleach-orange/20 text-bleach-orange border border-bleach-orange" : "bg-black text-bleach-muted"}`
  }, "\uD83D\uDEE1\uFE0F Sub-ADM")), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "space-y-3"
  }, tipoLogin === "maximo" ? /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Senha do ADM M\xE1ximo",
    value: senhaMax,
    onChange: e => setSenhaMax(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-bleach-orange"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Usu\xE1rio do Sub-ADM",
    value: subUser,
    onChange: e => setSubUser(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-bleach-orange"
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Senha Individual",
    value: subPass,
    onChange: e => setSubPass(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-bleach-orange"
  })), erro && /*#__PURE__*/React.createElement("div", {
    className: "text-red-400 text-xs"
  }, erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-2.5 bg-bleach-orange text-black font-bold uppercase text-xs rounded-lg shadow hover:bg-orange-400"
  }, "Entrar no Painel"))));
}

// TAB: RANKINGS VIEW
function RankingsView({
  rankFisico,
  rankPressao,
  myCharId
}) {
  const [aba, setAba] = useState("fisico");
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Quadro de Honra do Sereitei"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "RANKINGS OFICIAIS"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Acompanhe os guerreiros mais poderosos da Sociedade das Almas divididos em 2 rankings oficiais: ", /*#__PURE__*/React.createElement("strong", null, "M\xE9dia de Atributos F\xEDsicos"), " (For\xE7a + Velocidade + Resili\xEAncia \xF7 3) e ", /*#__PURE__*/React.createElement("strong", null, "Press\xE3o Espiritual Pura"), " (Reiatsu)."))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 border-b border-bleach-border pb-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAba("fisico"),
    className: `px-5 py-2.5 rounded-xl font-title text-lg tracking-wider uppercase transition flex items-center gap-2 ${aba === "fisico" ? "bg-bleach-orange text-black font-extrabold shadow-lg" : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), /*#__PURE__*/React.createElement("span", null, "1. Ranking F\xEDsico (M\xE9dia \xF7 3)")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAba("pressao"),
    className: `px-5 py-2.5 rounded-xl font-title text-lg tracking-wider uppercase transition flex items-center gap-2 ${aba === "pressao" ? "bg-bleach-blue text-black font-extrabold shadow-lg" : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF00"), /*#__PURE__*/React.createElement("span", null, "2. Ranking de Press\xE3o Espiritual"))), aba === "fisico" ? /*#__PURE__*/React.createElement(Section, {
    title: "Classifica\xE7\xE3o por Poder F\xEDsico",
    subtitle: "Calculado exatamente por: (For\xE7a + Velocidade + Resili\xEAncia) \xF7 3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, rankFisico.map((item, idx) => {
    const isMe = item.id === myCharId;
    const medalha = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: `p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${isMe ? "bg-bleach-orange/10 border-bleach-orange shadow-lg" : "bg-bleach-panel2 border-bleach-borderSoft hover:border-bleach-border"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-10 h-10 rounded-lg flex items-center justify-center font-title text-xl font-bold ${idx === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : idx === 1 ? "bg-gray-400/20 text-gray-300 border border-gray-400/50" : idx === 2 ? "bg-amber-700/20 text-amber-500 border border-amber-600/50" : "bg-black text-bleach-muted"}`
    }, medalha), /*#__PURE__*/React.createElement("div", {
      className: "w-11 h-11 rounded-lg overflow-hidden border border-bleach-border bg-black"
    }, /*#__PURE__*/React.createElement("img", {
      src: item.foto || 'assets/ichigo-orange.png',
      alt: item.nome,
      className: "w-full h-full object-cover",
      onError: e => {
        e.target.src = 'assets/ichigo-orange.png';
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-bleach-cream text-base"
    }, item.nome), isMe && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-bleach-orange text-black font-extrabold text-[10px] uppercase"
    }, "Voc\xEA")), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-bleach-muted flex gap-3 mt-0.5"
    }, /*#__PURE__*/React.createElement("span", null, "For\xE7a: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-red-400"
    }, item.forca)), /*#__PURE__*/React.createElement("span", null, "Velocidade: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-green-400"
    }, item.vel)), /*#__PURE__*/React.createElement("span", null, "Resili\xEAncia: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-purple-400"
    }, item.res))))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-bleach-borderSoft"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-bleach-muted uppercase"
    }, "M\xE9dia F\xEDsica"), /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-black font-mono text-bleach-orange"
    }, item.score))));
  }))) : /*#__PURE__*/React.createElement(Section, {
    title: "Classifica\xE7\xE3o por Press\xE3o Espiritual (Reiatsu)",
    subtitle: "Poder de controle espiritual e intensidade da aura"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, rankPressao.map((item, idx) => {
    const isMe = item.id === myCharId;
    const medalha = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: `p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${isMe ? "bg-bleach-blue/10 border-bleach-blue shadow-lg" : "bg-bleach-panel2 border-bleach-borderSoft hover:border-bleach-border"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-10 h-10 rounded-lg flex items-center justify-center font-title text-xl font-bold ${idx === 0 ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" : idx === 1 ? "bg-gray-400/20 text-gray-300 border border-gray-400/50" : idx === 2 ? "bg-amber-700/20 text-amber-500 border border-amber-600/50" : "bg-black text-bleach-muted"}`
    }, medalha), /*#__PURE__*/React.createElement("div", {
      className: "w-11 h-11 rounded-lg overflow-hidden border border-bleach-border bg-black"
    }, /*#__PURE__*/React.createElement("img", {
      src: item.foto || 'assets/ichigo-moon.png',
      alt: item.nome,
      className: "w-full h-full object-cover",
      onError: e => {
        e.target.src = 'assets/ichigo-moon.png';
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-bleach-cream text-base"
    }, item.nome), isMe && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-bleach-blue text-black font-extrabold text-[10px] uppercase"
    }, "Voc\xEA")), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-bleach-muted mt-0.5"
    }, "Reiatsu pura da alma"))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-bleach-borderSoft"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-bleach-muted uppercase"
    }, "Press\xE3o Espiritual"), /*#__PURE__*/React.createElement("div", {
      className: "text-2xl font-black font-mono text-bleach-blue"
    }, item.score))));
  }))));
}

// TAB: KIDŌS CATALOG & ZANPAKUTŌ SWORD VISUALIZER
function KidosView({
  personagem,
  isAdmin
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  const pressaoBase = personagem?.atributos?.pressao || 30;
  const maxKidosCena = Math.max(3, Math.floor(pressaoBase / 7) + 1);
  const [kidosUsados, setKidosUsados] = useState(0);
  const [relatoCena, setRelatoCena] = useState("");
  const [registroConjuracoes, setRegistroConjuracoes] = useState([]);
  const restantes = Math.max(0, maxKidosCena - kidosUsados);
  const pctRestante = Math.round(restantes / maxKidosCena * 100);
  function conjurarKido(kido) {
    if (restantes <= 0) {
      alert("Limite de Kidōs atingido para esta cena! Sua Reiatsu precisa se estabilizar.");
      return;
    }
    playReiatsuSound('kido');
    setKidosUsados(prev => prev + 1);
    setRegistroConjuracoes(prev => [{
      id: uid(),
      nome: kido.nome,
      cat: kido.cat,
      custo: kido.custoReiatsu,
      hora: new Date().toLocaleTimeString("pt-BR")
    }, ...prev]);
  }
  function resetarReiatsu() {
    setKidosUsados(0);
    setRegistroConjuracoes([]);
  }
  const kidosFiltrados = CATALOGO_KIDOS.filter(k => {
    const matchesCat = categoriaAtiva === "Todos" || k.cat === categoriaAtiva;
    const matchesBusca = (k.nome || "").toLowerCase().includes(busca.toLowerCase()) || (k.desc || "").toLowerCase().includes(busca.toLowerCase()) || (k.incant || "").toLowerCase().includes(busca.toLowerCase()) || (k.cat || "").toLowerCase().includes(busca.toLowerCase());
    return matchesCat && matchesBusca;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-3xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-blue/20 border border-bleach-blue text-bleach-blue text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Grim\xF3rio Completo da Sociedade das Almas \u2022 75+ Feiti\xE7os Oficiais & Autorais"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "COMP\xCANDIO SUPREMO DE KID\u014CS"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Explore o comp\xEAndio oficial de ", /*#__PURE__*/React.createElement("strong", null, "Had\u014D (Destrui\xE7\xE3o)"), ", ", /*#__PURE__*/React.createElement("strong", null, "Bakud\u014D (Aprisionamento & Defesa)"), " e ", /*#__PURE__*/React.createElement("strong", null, "Kaid\u014D (Cura & Suporte)"), ". Gerencie a energia espiritual liberada na sua l\xE2mina atrav\xE9s do medidor de Reiatsu abaixo!"))), /*#__PURE__*/React.createElement(Section, {
    title: "\u2694\uFE0F L\xE2mina Espiritual da Zanpakut\u014D & Gerenciador de Reiatsu",
    subtitle: "Acompanhe a energia espiritual que percorre sua l\xE2mina conforme voc\xEA conjura feiti\xE7os na cena"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-border rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs uppercase font-bold tracking-widest text-bleach-orange mb-3 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDDE1\uFE0F"), " L\xE2mina da Zanpakut\u014D"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-8 h-14 bg-gradient-to-b from-[#111] via-[#222] to-[#111] border-2 border-[#C94E0A] rounded-t-lg relative flex flex-col items-center justify-center shadow-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-1 bg-amber-500/80 my-0.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-1 bg-amber-500/80 my-0.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-1 bg-amber-500/80 my-0.5"
  }), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-black text-amber-400 font-cinzel"
  }, "\u534D")), /*#__PURE__*/React.createElement("div", {
    className: "w-20 h-4 bg-gradient-to-r from-[#C94E0A] via-[#FF6A13] to-[#C94E0A] rounded-full border border-black shadow-[0_0_12px_#FF6A13] z-20 -my-0.5 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-1 bg-black/60 rounded-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-64 border-x-2 border-b-2 border-bleach-blue/70 bg-black/90 relative overflow-hidden flex flex-col justify-end shadow-[0_0_20px_rgba(79,179,232,0.3)]",
    style: {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 88%, 50% 100%, 0% 88%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-y-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2 pointer-events-none z-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col justify-between py-3 px-1 pointer-events-none z-20 text-[8px] font-mono text-white/50 text-center"
  }, /*#__PURE__*/React.createElement("span", null, "100% \u534D"), /*#__PURE__*/React.createElement("span", null, "75%"), /*#__PURE__*/React.createElement("span", null, "50%"), /*#__PURE__*/React.createElement("span", null, "25%"), /*#__PURE__*/React.createElement("span", null, "0%")), /*#__PURE__*/React.createElement("div", {
    className: "w-full transition-all duration-700 relative overflow-hidden flex items-center justify-center",
    style: {
      height: `${pctRestante}%`,
      background: pctRestante > 50 ? 'linear-gradient(180deg, #4FB3E8 0%, #1E4C63 80%, #0A2233 100%)' : pctRestante > 20 ? 'linear-gradient(180deg, #FF6A13 0%, #C94E0A 80%, #4A1A02 100%)' : 'linear-gradient(180deg, #D6483F 0%, #7A1711 80%, #300502 100%)',
      boxShadow: '0 0 25px rgba(79, 179, 232, 0.8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-white font-title text-2xl font-black drop-shadow z-10"
  }, pctRestante, "%")))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-muted"
  }, "Feiti\xE7os Restantes na L\xE2mina:"), /*#__PURE__*/React.createElement("div", {
    className: "text-2xl font-mono font-bold text-bleach-orange mt-0.5"
  }, restantes, " / ", maxKidosCena), /*#__PURE__*/React.createElement("button", {
    onClick: resetarReiatsu,
    className: "mt-3 px-4 py-1.5 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange transition"
  }, "\uD83D\uDD04 Restaurar Reiatsu da L\xE2mina"))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-4"
  }, personagem?.zanpakuto?.shikaiAtiva?.espirito && /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-cyan-500/40 rounded-xl p-5 shadow-inner"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), " Representa\xE7\xE3o do Esp\xEDrito da Zanpakut\u014D"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-cyan-100/90 italic leading-relaxed whitespace-pre-line"
  }, "\"", personagem?.zanpakuto?.shikaiAtiva?.espirito, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange mb-2"
  }, "\u270D\uFE0F Rascunho de Narrativa da Cena (WhatsApp)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-2"
  }, "Espa\xE7o livre para rascunhar como utilizou seus Kid\u014Ds na sua narra\xE7\xE3o antes de enviar no grupo:"), /*#__PURE__*/React.createElement("textarea", {
    rows: 4,
    value: relatoCena,
    onChange: e => setRelatoCena(e.target.value),
    placeholder: "Ex: Concentrei minha Reiatsu ao longo do fio da Zanpakut\u014D liberando Had\u014D #4 Byakurai em linha reta...",
    className: "w-full bg-black/60 border border-bleach-border rounded-xl p-3 text-xs text-white placeholder-bleach-muted/50 focus:border-bleach-orange outline-none resize-none font-sans"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-muted"
  }, relatoCena.length, " caracteres"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard.writeText(relatoCena);
      alert("Texto da cena copiado para a área de transferência!");
    },
    className: "px-3 py-1 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange transition"
  }, "\uD83D\uDCCB Copiar Rascunho"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-cream mb-2"
  }, "\uD83D\uDCDC Feiti\xE7os Conjurados Nesta Cena (", registroConjuracoes.length, ")"), registroConjuracoes.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhum Kid\u014D conjurado na cena atual.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 max-h-36 overflow-y-auto pr-1"
  }, registroConjuracoes.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "p-2 bg-black/50 border border-white/5 rounded-lg text-xs flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-cyan-300"
  }, "\u26A1 ", c.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, c.hora)))))))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-3 items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 w-full sm:w-auto"
  }, ["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat,
    onClick: () => setCategoriaAtiva(cat),
    className: `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${categoriaAtiva === cat ? cat === "Hadō" ? "bg-red-600 text-white shadow-lg" : cat === "Bakudō" ? "bg-blue-600 text-white shadow-lg" : cat === "Kaidō" ? "bg-emerald-600 text-white shadow-lg" : "bg-bleach-orange text-black font-extrabold shadow-lg" : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, cat === "Hadō" ? "🔥 Hadō (Ofensivo)" : cat === "Bakudō" ? "📕 Bakudō (Contenção)" : cat === "Kaidō" ? "🌿 Kaidō (Cura)" : "✨ Todos os Kidōs"))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\uD83D\uDD0D Buscar por nome, n\xFAmero ou efeito...",
    value: busca,
    onChange: e => setBusca(e.target.value),
    className: "w-full sm:w-72 bg-bleach-panel2 border border-bleach-border rounded-xl px-4 py-2 text-xs text-white placeholder-bleach-muted focus:border-bleach-orange outline-none"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, kidosFiltrados.map(k => {
    const isHado = k.cat === "Hadō";
    const isBakudo = k.cat === "Bakudō";
    const isKaido = k.cat === "Kaidō";
    const borderColor = isHado ? "border-red-500/40" : isBakudo ? "border-blue-500/40" : "border-emerald-500/40";
    const tagBg = isHado ? "bg-red-950 text-red-300 border-red-500/50" : isBakudo ? "bg-blue-950 text-cyan-300 border-blue-500/50" : "bg-emerald-950 text-emerald-300 border-emerald-500/50";
    return /*#__PURE__*/React.createElement("div", {
      key: k.id,
      className: `bg-bleach-panel border ${borderColor} rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-bleach-orange transition space-y-3`
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: `px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${tagBg}`
    }, k.cat, " \u2022 #", k.numero), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-mono text-bleach-muted bg-black/60 px-2 py-0.5 rounded border border-white/5"
    }, "Custo: ", k.custoReiatsu, " Reiatsu")), /*#__PURE__*/React.createElement("h4", {
      className: "font-title text-xl tracking-wider text-white"
    }, k.nome), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-amber-400 font-mono mb-2"
    }, "N\xEDvel: ", k.nivel), k.incant && k.incant !== "—" && /*#__PURE__*/React.createElement("div", {
      className: "p-2.5 bg-black/60 border border-white/10 rounded-xl my-2 text-[11px] text-bleach-creamDim italic leading-relaxed"
    }, "\"", k.incant, "\""), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-bleach-creamDim leading-relaxed"
    }, k.desc)), /*#__PURE__*/React.createElement("button", {
      onClick: () => conjurarKido(k),
      disabled: restantes <= 0,
      className: `w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed ${isHado ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110" : isBakudo ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110" : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"}`
    }, "\u26A1 Conjurar em Cena"));
  })));
}

// TAB: ARENA PVP VIEW
function ArenaView({
  db,
  saveDb,
  session,
  myChar
}) {
  const [desafianteId, setDesafianteId] = useState(db.personagens[0]?.id || "");
  const [desafiadoId, setDesafiadoId] = useState(db.personagens[1]?.id || "");
  const [showNovoDuelo, setShowNovoDuelo] = useState(false);
  const combateAtivo = db.combatesArena?.[0] || null;
  const p1 = (db.personagens || []).find(p => p.id === combateAtivo?.p1Id);
  const p2 = (db.personagens || []).find(p => p.id === combateAtivo?.p2Id);
  const [juizTexto, setJuizTexto] = useState(combateAtivo?.juizLog || "");
  const [turnoAtual, setTurnoAtual] = useState(combateAtivo?.turno || "Turno 1");
  const isAdm = session?.role === "super_admin" || session?.role === "sub_admin";
  function criarDuelo() {
    if (!desafianteId || !desafiadoId || desafianteId === desafiadoId) {
      alert("Selecione dois lutadores diferentes para o duelo!");
      return;
    }
    const p1Obj = db.personagens.find(p => p.id === desafianteId);
    const p2Obj = db.personagens.find(p => p.id === desafiadoId);
    const novoCombate = {
      id: uid(),
      p1Id: desafianteId,
      p2Id: desafiadoId,
      p1Nome: p1Obj.nome,
      p2Nome: p2Obj.nome,
      p1Estado: p1Obj.estado || "Inteiro",
      p2Estado: p2Obj.estado || "Inteiro",
      turno: "Turno 1 — Início do Combate",
      juizLog: "Duelo iniciado no campo de treinamento da Sociedade das Almas.",
      status: "Em Andamento"
    };
    saveDb({
      ...db,
      combatesArena: [novoCombate, ...(db.combatesArena || [])]
    });
    setShowNovoDuelo(false);
  }
  function atualizarEstadoLutador(qual, novoEstado) {
    if (!combateAtivo) return;
    const combates = db.combatesArena.map((c, i) => {
      if (i === 0) {
        return {
          ...c,
          [qual === "p1" ? "p1Estado" : "p2Estado"]: novoEstado,
          juizLog: juizTexto,
          turno: turnoAtual
        };
      }
      return c;
    });
    saveDb({
      ...db,
      combatesArena: combates
    });
  }
  function salvarLogJuiz() {
    if (!combateAtivo) return;
    const combates = db.combatesArena.map((c, i) => {
      if (i === 0) {
        return {
          ...c,
          juizLog: juizTexto,
          turno: turnoAtual
        };
      }
      return c;
    });
    saveDb({
      ...db,
      combatesArena: combates
    });
    alert("Estado do combate e relatório do juiz atualizados com sucesso!");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-red-950/80 border border-red-500 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Duelos em ON & Julgamento de Batalha"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "ARENA DE COMBATE"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "\xC1rea de duelos oficiais da Sociedade das Almas! Os jogadores se enfrentam com suas fichas e o estado de combate \xE9 atualizado ao vivo pelos administradores e ju\xEDzes de luta."))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl tracking-wider uppercase text-bleach-cream"
  }, "Duelo em Destaque"), isAdm && /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowNovoDuelo(!showNovoDuelo),
    className: "px-4 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
  }, "+ Criar Novo Duelo")), showNovoDuelo && /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-orange p-5 rounded-xl space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "Configurar Novo Duelo"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Lutador 1 (Desafiante)"), /*#__PURE__*/React.createElement("select", {
    value: desafianteId,
    onChange: e => setDesafianteId(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.nome)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Lutador 2 (Desafiado)"), /*#__PURE__*/React.createElement("select", {
    value: desafiadoId,
    onChange: e => setDesafiadoId(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.nome))))), /*#__PURE__*/React.createElement("button", {
    onClick: criarDuelo,
    className: "px-5 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg hover:bg-orange-400"
  }, "Confirmar e Iniciar Duelo")), combateAtivo && p1 && p2 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-bleach-border rounded-2xl p-6 relative overflow-hidden shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-5 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 bg-black/50 border border-bleach-borderSoft rounded-2xl p-5 flex flex-col items-center text-center relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-28 h-28 bleach-avatar-frame overflow-hidden mb-3 bg-black"
  }, /*#__PURE__*/React.createElement("img", {
    src: p1.foto || 'assets/ichigo-orange.png',
    alt: p1.nome,
    className: "w-full h-full object-cover",
    onError: e => {
      e.target.src = 'assets/ichigo-orange.png';
    }
  })), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl tracking-wider text-bleach-orange"
  }, p1.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-creamDim"
  }, p1.esquadrao || p1.raca), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Badge, {
    color: ESTADOS.find(e => e.key === combateAtivo.p1Estado)?.color || C.green
  }, "Estado: ", combateAtivo.p1Estado)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 w-full mt-4 text-[11px] text-bleach-muted bg-bleach-panel2 p-2.5 rounded-lg"
  }, /*#__PURE__*/React.createElement("div", null, "Press\xE3o: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-blue"
  }, p1.atributos.pressao)), /*#__PURE__*/React.createElement("div", null, "For\xE7a: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-red"
  }, p1.atributos.forca)), /*#__PURE__*/React.createElement("div", null, "Velocidade: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-green"
  }, p1.atributos.velocidade)), /*#__PURE__*/React.createElement("div", null, "Resili\xEAncia: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-purple"
  }, p1.atributos.resiliencia)))), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-1 flex flex-col items-center justify-center my-4 md:my-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-title text-6xl md:text-7xl font-black text-bleach-orange vs-slash animate-pulse"
  }, "VS"), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-mono text-bleach-muted uppercase mt-2 tracking-widest text-center"
  }, combateAtivo.turno)), /*#__PURE__*/React.createElement("div", {
    className: "md:col-span-2 bg-black/50 border border-bleach-borderSoft rounded-2xl p-5 flex flex-col items-center text-center relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-28 h-28 bleach-avatar-frame overflow-hidden mb-3 bg-black"
  }, /*#__PURE__*/React.createElement("img", {
    src: p2.foto || 'assets/ichigo-moon.png',
    alt: p2.nome,
    className: "w-full h-full object-cover",
    onError: e => {
      e.target.src = 'assets/ichigo-moon.png';
    }
  })), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl tracking-wider text-bleach-blue"
  }, p2.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-creamDim"
  }, p2.esquadrao || p2.raca), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Badge, {
    color: ESTADOS.find(e => e.key === combateAtivo.p2Estado)?.color || C.green
  }, "Estado: ", combateAtivo.p2Estado)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-2 w-full mt-4 text-[11px] text-bleach-muted bg-bleach-panel2 p-2.5 rounded-lg"
  }, /*#__PURE__*/React.createElement("div", null, "Press\xE3o: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-blue"
  }, p2.atributos.pressao)), /*#__PURE__*/React.createElement("div", null, "For\xE7a: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-red"
  }, p2.atributos.forca)), /*#__PURE__*/React.createElement("div", null, "Velocidade: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-green"
  }, p2.atributos.velocidade)), /*#__PURE__*/React.createElement("div", null, "Resili\xEAncia: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-purple"
  }, p2.atributos.resiliencia))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-5 border-t border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange mb-2"
  }, "\uD83D\uDCDC Relat\xF3rio do Juiz & Estado da Batalha (Atualizado pela ADM)"), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-black/60 border border-bleach-borderSoft rounded-xl text-xs text-bleach-creamDim leading-relaxed"
  }, combateAtivo.juizLog)), isAdm && /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-5 border-t border-bleach-orange/40 space-y-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "\uD83D\uDC51 Gest\xE3o do Combate (Mestre / Juiz)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Estado de ", p1.nome), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 flex-wrap"
  }, ESTADOS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.key,
    onClick: () => atualizarEstadoLutador("p1", e.key),
    className: `px-2.5 py-1 rounded text-xs font-bold border transition ${combateAtivo.p1Estado === e.key ? "bg-white/20 text-white" : "opacity-60"}`,
    style: {
      borderColor: e.color,
      color: e.color
    }
  }, e.key)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Estado de ", p2.nome), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 flex-wrap"
  }, ESTADOS.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.key,
    onClick: () => atualizarEstadoLutador("p2", e.key),
    className: `px-2.5 py-1 rounded text-xs font-bold border transition ${combateAtivo.p2Estado === e.key ? "bg-white/20 text-white" : "opacity-60"}`,
    style: {
      borderColor: e.color,
      color: e.color
    }
  }, e.key))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: turnoAtual,
    onChange: e => setTurnoAtual(e.target.value),
    placeholder: "Turno do Combate (Ex: Turno 3 \u2014 Cl\xEDmax de Shikai)",
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    value: juizTexto,
    onChange: e => setJuizTexto(e.target.value),
    placeholder: "Descreva o relat\xF3rio do que aconteceu no turno...",
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: salvarLogJuiz,
    className: "px-4 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
  }, "Salvar e Publicar Decis\xE3o do Juiz"))))) : /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12 text-bleach-muted text-sm bg-bleach-panel border border-bleach-border rounded-xl"
  }, "Nenhum combate ativo no momento. Solicite \xE0 administra\xE7\xE3o o in\xEDcio de um duelo!"));
}

// DYNAMIC BLEACH ZANPAKUTŌ VISUAL ART & SWORD GENERATOR
function BleachSwordArt({
  arma,
  nomeZk,
  isBankai,
  foto,
  onUpload
}) {
  const elemento = (arma?.elemento || "").toLowerCase();
  const formato = (arma?.formatoArma || "").toLowerCase();
  const nome = arma?.nome || nomeZk || "Zanpakutō";
  const kanji = arma?.kanji || (isBankai ? "卍" : "斬");

  // Determine Elemental Aesthetic Color Schemes
  let auraColor1 = isBankai ? "#FFD700" : "#4FB3E8";
  let auraColor2 = isBankai ? "#9333EA" : "#0284C7";
  let bladeGlow = isBankai ? "#FDE047" : "#67E8F9";
  let particleSymbol = "✦";
  if (elemento.includes("gelo") || elemento.includes("neve") || elemento.includes("frio") || elemento.includes("água") || elemento.includes("espelho")) {
    auraColor1 = "#38BDF8";
    auraColor2 = "#0369A1";
    bladeGlow = "#E0F2FE";
    particleSymbol = "❄";
  } else if (elemento.includes("fogo") || elemento.includes("chama") || elemento.includes("calor") || elemento.includes("brasa") || elemento.includes("solar") || elemento.includes("vulcão")) {
    auraColor1 = "#EF4444";
    auraColor2 = "#991B1B";
    bladeGlow = "#FBBF24";
    particleSymbol = "🔥";
  } else if (elemento.includes("raio") || elemento.includes("trovão") || elemento.includes("elétr")) {
    auraColor1 = "#FBBF24";
    auraColor2 = "#B45309";
    bladeGlow = "#67E8F9";
    particleSymbol = "⚡";
  } else if (elemento.includes("sombra") || elemento.includes("vácuo") || elemento.includes("cinza") || elemento.includes("trevas") || elemento.includes("nanquim") || elemento.includes("negro")) {
    auraColor1 = "#A855F7";
    auraColor2 = "#4C1D95";
    bladeGlow = "#D8B4FE";
    particleSymbol = "🌑";
  } else if (elemento.includes("flor") || elemento.includes("pétala") || elemento.includes("planta") || elemento.includes("sangue")) {
    auraColor1 = "#F43F5E";
    auraColor2 = "#881337";
    bladeGlow = "#FECDD3";
    particleSymbol = "🌸";
  } else if (elemento.includes("gravidade") || elemento.includes("aço") || elemento.includes("peso") || elemento.includes("sísmic") || elemento.includes("rocha")) {
    auraColor1 = "#F97316";
    auraColor2 = "#7C2D12";
    bladeGlow = "#FED7AA";
    particleSymbol = "⚔️";
  }
  const hasCustomFoto = foto && !foto.includes("ichigo-orange.png") && foto.length > 50;
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-[290px] flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-full h-84 rounded-3xl relative overflow-hidden group shadow-2xl transition-all duration-500 border-2 ${isBankai ? "border-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.4)]" : "border-cyan-400 shadow-[0_0_30px_rgba(79,179,232,0.4)]"}`,
    style: {
      background: 'radial-gradient(circle at 50% 30%, #1a1b26 0%, #0a0b10 80%, #000000 100%)'
    }
  }, hasCustomFoto ? /*#__PURE__*/React.createElement("img", {
    src: foto,
    alt: nome,
    className: "w-full h-full object-cover group-hover:scale-105 transition duration-700"
  }) :
  /*#__PURE__*/
  /* AUTORAL BLEACH SWORD ARTWORK SVG RENDERER */
  React.createElement("div", {
    className: "w-full h-full flex flex-col items-center justify-between p-4 relative select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex items-center justify-center font-cinzel text-9xl font-black pointer-events-none opacity-10 leading-none",
    style: {
      color: auraColor1
    }
  }, kanji.replace(/[^\p{Script=Han}]/gu, '') || (isBankai ? "卍" : "斬")), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 pointer-events-none opacity-40 animate-pulse",
    style: {
      background: `radial-gradient(circle at 50% 60%, ${auraColor1}33 0%, ${auraColor2}11 70%, transparent 100%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full flex justify-between items-center z-10"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase tracking-widest border",
    style: {
      backgroundColor: isBankai ? '#451a03' : '#082f49',
      borderColor: auraColor1,
      color: isBankai ? '#fde047' : '#7dd3fc'
    }
  }, isBankai ? "卍 Bankai" : "始解 Shikai"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-mono font-bold",
    style: {
      color: bladeGlow
    }
  }, particleSymbol, " ", particleSymbol)), /*#__PURE__*/React.createElement("div", {
    className: "relative w-full h-52 flex items-center justify-center z-10 my-1"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 320",
    className: "w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `bladeGrad_${isBankai ? 'b' : 's'}`,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: "#FFFFFF"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "35%",
    stopColor: "#E2E8F0"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "70%",
    stopColor: "#94A3B8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: "#475569"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `auraGrad_${isBankai ? 'b' : 's'}`,
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: bladeGlow,
    stopOpacity: "0.9"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: auraColor1,
    stopOpacity: "0.6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: auraColor2,
    stopOpacity: "0.2"
  })), /*#__PURE__*/React.createElement("filter", {
    id: `glow_${isBankai ? 'b' : 's'}`,
    x: "-30%",
    y: "-30%",
    width: "160%",
    height: "160%"
  }, /*#__PURE__*/React.createElement("feGaussianBlur", {
    stdDeviation: "6",
    result: "blur"
  }), /*#__PURE__*/React.createElement("feComposite", {
    in: "SourceGraphic",
    in2: "blur",
    operator: "over"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M 94,15 Q 85,90 88,180 Q 95,230 102,180 Q 112,90 106,15 Z",
    fill: `url(#auraGrad_${isBankai ? 'b' : 's'})`,
    filter: `url(#glow_${isBankai ? 'b' : 's'})`,
    className: "animate-pulse"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 100,20 Q 98,70 98,170 L 102,170 Q 102,70 100,20 Z",
    fill: `url(#bladeGrad_${isBankai ? 'b' : 's'})`,
    stroke: bladeGlow,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 100,20 Q 97,75 97,170",
    fill: "none",
    stroke: "#FFFFFF",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 99,28 Q 97,45 100,60 Q 98,75 100,90 Q 97,110 100,130 Q 98,150 99,170",
    fill: "none",
    stroke: bladeGlow,
    strokeWidth: "1",
    strokeOpacity: "0.8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "96",
    y: "170",
    width: "8",
    height: "12",
    rx: "1",
    fill: "#EAB308",
    stroke: "#713F12",
    strokeWidth: "1"
  }), isBankai ?
  /*#__PURE__*/
  /* Ornate Four-Pronged Bankai Guard (Manji / Lotus Cross) */
  React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
    x: "80",
    y: "181",
    width: "40",
    height: "7",
    rx: "3",
    fill: "#18181B",
    stroke: "#F59E0B",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "96.5",
    y: "168",
    width: "7",
    height: "33",
    rx: "2",
    fill: "#18181B",
    stroke: "#F59E0B",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "184.5",
    r: "5",
    fill: "#F59E0B"
  })) :
  /*#__PURE__*/
  /* Circular Floral / Elegant Shikai Guard */
  React.createElement("g", null, /*#__PURE__*/React.createElement("ellipse", {
    cx: "100",
    cy: "183",
    rx: "20",
    ry: "6",
    fill: "#1E293B",
    stroke: auraColor1,
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "100",
    cy: "183",
    r: "3.5",
    fill: "#E2E8F0"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "96.5",
    y: "188",
    width: "7",
    height: "75",
    rx: "2",
    fill: "#09090B",
    stroke: "#27272A",
    strokeWidth: "1"
  }), [0, 1, 2, 3, 4, 5, 6].map(i => /*#__PURE__*/React.createElement("polygon", {
    key: i,
    points: `100,${193 + i * 9} 98,${197 + i * 9} 100,${201 + i * 9} 102,${197 + i * 9}`,
    fill: isBankai ? "#F59E0B" : auraColor1
  })), /*#__PURE__*/React.createElement("rect", {
    x: "95.5",
    y: "263",
    width: "9",
    height: "7",
    rx: "2",
    fill: "#713F12",
    stroke: "#EAB308",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "75",
    cy: "80",
    r: "2",
    fill: bladeGlow,
    className: "animate-ping"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "125",
    cy: "130",
    r: "2.5",
    fill: auraColor1,
    className: "animate-pulse"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "160",
    r: "1.5",
    fill: "#FFFFFF"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "120",
    cy: "50",
    r: "2",
    fill: bladeGlow
  }))), /*#__PURE__*/React.createElement("div", {
    className: "w-full text-center z-10 bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl py-1.5 px-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-title text-sm tracking-widest text-white truncate drop-shadow"
  }, nome), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-mono text-bleach-muted truncate"
  }, arma?.elemento || "Reiryoku Condensado"))), /*#__PURE__*/React.createElement("label", {
    className: "absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 text-xs text-cyan-300 font-bold text-center p-4 z-30"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl mb-1"
  }, "\uD83D\uDCF7"), /*#__PURE__*/React.createElement("span", null, hasCustomFoto ? "Substituir Imagem da Espada" : "Fazer Upload de Arte Própria"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted mt-1 font-normal"
  }, "(PNG, JPG ou GIF)"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: onUpload,
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "mt-3 px-4 py-1.5 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-[11px] text-bleach-cream rounded-xl cursor-pointer transition shadow flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF7"), /*#__PURE__*/React.createElement("span", null, hasCustomFoto ? "Alterar Imagem da Lâmina" : "Enviar Arte da Zanpakutō"), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: onUpload,
    className: "hidden"
  })));
}

// TAB: FICHA DO JOGADOR
function FichaView({
  db,
  saveDb,
  personagem,
  isAdmin,
  rankFisico,
  rankPressao
}) {
  const [subPaginaFicha, setSubPaginaFicha] = useState("perfil");
  const [pend, setPend] = useState({
    pressao: 0,
    forca: 0,
    velocidade: 0,
    resiliencia: 0
  });
  const [passoDistribuicao, setPassoDistribuicao] = useState(1);
  const [novaTecCat, setNovaTecCat] = useState("Hadō");
  const [novaTecNome, setNovaTecNome] = useState("");
  const [rec, setRec] = useState({
    tipo: "Treino em ON (30 linhas)",
    pontos: 1,
    atributo: "",
    motivo: ""
  });
  const [editFoto, setEditFoto] = useState(personagem?.foto || "assets/ichigo-orange.png");
  const [editFotoShikai, setEditFotoShikai] = useState(personagem?.zanpakuto?.fotoShikai || "assets/ichigo-orange.png");
  const [editFotoBankai, setEditFotoBankai] = useState(personagem?.zanpakuto?.fotoBankai || "assets/ichigo-moon.png");
  const [editNome, setEditNome] = useState(personagem?.nome || "");
  const [editWhats, setEditWhats] = useState(personagem?.whatsapp || "");
  const [editCodigo, setEditCodigo] = useState(personagem?.codigo || "");
  const [editFaceclaim, setEditFaceclaim] = useState(personagem?.faceclaim || "");
  const [editIdadePlayer, setEditIdadePlayer] = useState(personagem?.idadePlayer || "20");
  const [editAnivPlayer, setEditAnivPlayer] = useState(personagem?.aniversarioPlayer || "01/01");
  const [editIdadeChar, setEditIdadeChar] = useState(personagem?.idadeChar || "18");
  const [editAnivChar, setEditAnivChar] = useState(personagem?.aniversarioChar || "15/07");
  const [editRaca, setEditRaca] = useState(personagem?.raca || "Shinigami");
  const [editEsquadrao, setEditEsquadrao] = useState(personagem?.esquadrao || "11º Esquadrão");
  const [editZkNome, setEditZkNome] = useState(personagem?.zanpakuto?.nome || "");
  const [zk, setZk] = useState(personagem?.zanpakuto || {
    nome: "",
    shikaiAtiva: null,
    bankaiAtiva: null,
    notas: ""
  });
  const [rewardModal, setRewardModal] = useState(null);
  const [showGachaHistory, setShowGachaHistory] = useState(false);
  const [showZanpakutoAIModal, setShowZanpakutoAIModal] = useState(false);
  const [aiZkOpcoes, setAiZkOpcoes] = useState([]);
  const [aiZkTipo, setAiZkTipo] = useState("shikai");
  const [ritualState, setRitualState] = useState("selection");
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);
  const [selectedRitualCard, setSelectedRitualCard] = useState(null);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargeStageText, setChargeStageText] = useState("");
  const [revealedCard, setRevealedCard] = useState(null);
  const chargeIntervalRef = useRef(null);
  useEffect(() => {
    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, []);
  const [copiadoWhats, setCopiadoWhats] = useState(false);
  if (!personagem) return /*#__PURE__*/React.createElement("div", {
    className: "text-bleach-muted"
  }, "Ficha n\xE3o encontrada.");
  const pendSum = Object.values(pend).reduce((a, b) => a + b, 0);
  const restante = (personagem.pontosDisponiveis || 0) - pendSum;
  const totalStats = Object.values(personagem.atributos).reduce((a, b) => a + b, 0);
  const powerTier = getPowerTier(totalStats);
  const posFisicoIdx = rankFisico.findIndex(r => r.id === personagem.id);
  const posFisico = posFisicoIdx !== -1 ? posFisicoIdx + 1 : 1;
  const scoreFisico = ((Number(personagem.atributos.forca) + Number(personagem.atributos.velocidade) + Number(personagem.atributos.resiliencia)) / 3).toFixed(1);
  const topFisicoScore = rankFisico[0]?.score || scoreFisico;
  const pctBarFisico = Math.min(100, Math.round(scoreFisico / Math.max(1, topFisicoScore) * 100));
  const posPressaoIdx = rankPressao.findIndex(r => r.id === personagem.id);
  const posPressao = posPressaoIdx !== -1 ? posPressaoIdx + 1 : 1;
  const scorePressao = Number(personagem.atributos.pressao);
  const topPressaoScore = rankPressao[0]?.score || scorePressao;
  const pctBarPressao = Math.min(100, Math.round(scorePressao / Math.max(1, topPressaoScore) * 100));
  const temShikai = !!personagem?.zanpakuto?.shikaiAtiva;
  const temBankai = !!personagem?.zanpakuto?.bankaiAtiva;
  const podeGerarShikai = !!personagem?.permissoes?.shikaiLiberada;
  const podeGerarBankai = !!personagem?.permissoes?.bankaiLiberada && temShikai;
  function updateChar(patch, historicoTexto) {
    const personagens = (db.personagens || []).map(p => p.id === personagem.id ? {
      ...p,
      ...patch,
      historico: historicoTexto ? [{
        id: uid(),
        data: nowStr(),
        texto: historicoTexto
      }, ...(p.historico || [])] : p.historico || []
    } : p);
    saveDb({
      ...db,
      personagens
    });
  }
  function confirmarDistribuicao() {
    if (pendSum === 0) return;
    if (pendSum > (personagem.pontosDisponiveis || 0)) {
      alert("Você tentou distribuir mais pontos do que possui disponível!");
      return;
    }
    const novosAtributos = {
      pressao: personagem.atributos.pressao + pend.pressao,
      forca: personagem.atributos.forca + pend.forca,
      velocidade: personagem.atributos.velocidade + pend.velocidade,
      resiliencia: personagem.atributos.resiliencia + pend.resiliencia
    };
    const novoDisponivel = (personagem.pontosDisponiveis || 0) - pendSum;
    const historicoTexto = `✨ Distribuiu ${pendSum} pontos de treino: Pressão (+${pend.pressao}), Força (+${pend.forca}), Velocidade (+${pend.velocidade}), Resiliência (+${pend.resiliencia})`;
    updateChar({
      atributos: novosAtributos,
      pontosDisponiveis: novoDisponivel
    }, historicoTexto);
    setPend({
      pressao: 0,
      forca: 0,
      velocidade: 0,
      resiliencia: 0
    });
    playReiatsuSound('win');
  }
  function addTecnica() {
    if (!novaTecNome.trim()) return;
    const novas = [...(personagem.tecnicas || []), {
      id: uid(),
      nome: novaTecNome.trim(),
      categoria: novaTecCat
    }];
    updateChar({
      tecnicas: novas
    }, `Aprendeu a técnica [${novaTecCat}] ${novaTecNome.trim()}`);
    setNovaTecNome("");
  }
  function removeTecnica(id) {
    const novas = (personagem.tecnicas || []).filter(t => t.id !== id);
    updateChar({
      tecnicas: novas
    }, "Removeu uma técnica da ficha");
  }
  function togglePermissaoShikai() {
    const atual = !!personagem?.permissoes?.shikaiLiberada;
    updateChar({
      permissoes: {
        ...(personagem.permissoes || {}),
        shikaiLiberada: !atual
      }
    }, `Permissão de Despertar de Shikai ${!atual ? "LIBERADA" : "BLOQUEADA"} pela ADM`);
  }
  function togglePermissaoBankai() {
    const atual = !!personagem?.permissoes?.bankaiLiberada;
    updateChar({
      permissoes: {
        ...(personagem.permissoes || {}),
        bankaiLiberada: !atual
      }
    }, `Permissão de Despertar de Bankai ${!atual ? "LIBERADA" : "BLOQUEADA"} pela ADM`);
  }
  function concederRecompensa() {
    const pontos = Number(rec.pontos) || 0;
    if (pontos <= 0 && rec.tipo !== "Sorteio Gacha Comum" && rec.tipo !== "Sorteio Especial") return;
    let patch = {};
    let texto = `[${rec.tipo}]`;
    if (rec.atributo) {
      patch.atributos = {
        ...personagem.atributos,
        [rec.atributo]: (personagem.atributos[rec.atributo] || 0) + pontos
      };
      texto += ` +${pontos} em ${rec.atributo.toUpperCase()}`;
    } else {
      patch.pontosDisponiveis = (personagem.pontosDisponiveis || 0) + pontos;
      texto += ` +${pontos} pontos livres concedidos para distribuição`;
    }
    if (rec.tipo === "Treino em ON (30 linhas)") {
      patch.sorteiosComunsRestantes = (personagem.sorteiosComunsRestantes || 0) + 4;
      patch.sorteiosEspeciaisRestantes = (personagem.sorteiosEspeciaisRestantes || 0) + 1;
      texto += ` (+4 Giros Comuns e +1 Especial liberados)`;
    }
    if (rec.motivo.trim()) texto += ` — ${rec.motivo.trim()}`;
    updateChar(patch, texto);
    setRec({
      tipo: "Treino em ON (30 linhas)",
      pontos: 1,
      atributo: "",
      motivo: ""
    });
  }
  function girarGachaComum() {
    if ((personagem.sorteiosComunsRestantes || 0) <= 0) {
      alert("Você não possui giros de Sorteio Comum disponíveis no momento.");
      return;
    }
    const total = RARIDADES_COMUNS.reduce((a, r) => a + r.peso, 0);
    let roll = Math.random() * total;
    let escolhida = RARIDADES_COMUNS[0];
    for (const r of RARIDADES_COMUNS) {
      if (roll < r.peso) {
        escolhida = r;
        break;
      }
      roll -= r.peso;
    }
    const pontos = Math.floor(Math.random() * (escolhida.max - escolhida.min + 1)) + escolhida.min;
    const drop = {
      id: uid(),
      data: nowStr(),
      nome: `Sorteio Comum (${escolhida.nome}): +${pontos} Pontos Disponíveis`,
      cor: escolhida.cor
    };
    updateChar({
      pontosDisponiveis: (personagem.pontosDisponiveis || 0) + pontos,
      sorteiosComunsRestantes: personagem.sorteiosComunsRestantes - 1,
      sorteiosDrops: [drop, ...(personagem.sorteiosDrops || [])]
    }, `🎲 Sorteio Comum (${escolhida.nome}): +${pontos} pontos disponíveis concedidos automaticamente`);
    setRewardModal({
      titulo: "SORTEIO GACHA COMUM!",
      raridade: escolhida.nome,
      cor: escolhida.cor,
      pontos,
      desc: escolhida.desc
    });
    playReiatsuSound('win');
  }
  function girarSorteioEspecial() {
    if ((personagem.sorteiosEspeciaisRestantes || 0) <= 0) {
      alert("Você não possui giros de Sorteio Especial disponíveis.");
      return;
    }

    // Cálculo Ponderado Real (Total = 1000)
    const totalPeso = RECOMPENSAS_ESPECIAIS.reduce((acc, r) => acc + (r.peso || 1), 0);
    let roll = Math.random() * totalPeso;
    let escolhida = RECOMPENSAS_ESPECIAIS[0];
    for (const r of RECOMPENSAS_ESPECIAIS) {
      if (roll < (r.peso || 1)) {
        escolhida = r;
        break;
      }
      roll -= r.peso || 1;
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
      nome: `🌟 Sorteio Especial (${escolhida.raridade}): ${escolhida.nome}` + (pontosGanhos > 0 ? ` (+${pontosGanhos} pts)` : ''),
      cor: escolhida.cor
    };
    patch.sorteiosDrops = [drop, ...(personagem.sorteiosDrops || [])];
    updateChar(patch, `🌟 Sorteio Especial: Conquistou [${escolhida.nome}] (${escolhida.raridade})!`);
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
  function handleFotoUpload(e, tipo = "perfil") {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const dataUrl = evt.target.result;
      if (tipo === "perfil") {
        setEditFoto(dataUrl);
        updateChar({
          foto: dataUrl
        }, "Foto de perfil do personagem atualizada");
      } else if (tipo === "shikai") {
        setEditFotoShikai(dataUrl);
        const novoZk = {
          ...zk,
          fotoShikai: dataUrl,
          shikaiAtiva: zk.shikaiAtiva ? {
            ...zk.shikaiAtiva,
            foto: dataUrl
          } : null
        };
        setZk(novoZk);
        updateChar({
          zanpakuto: novoZk
        }, "Imagem da arma Shikai atualizada");
      } else if (tipo === "bankai") {
        setEditFotoBankai(dataUrl);
        const novoZk = {
          ...zk,
          fotoBankai: dataUrl,
          bankaiAtiva: zk.bankaiAtiva ? {
            ...zk.bankaiAtiva,
            foto: dataUrl
          } : null
        };
        setZk(novoZk);
        updateChar({
          zanpakuto: novoZk
        }, "Imagem monumental da Bankai atualizada");
      }
    };
    reader.readAsDataURL(file);
  }
  function salvarDadosCompletos() {
    updateChar({
      nome: editNome.trim() || personagem.nome,
      whatsapp: editWhats.trim(),
      codigo: editCodigo.trim(),
      faceclaim: editFaceclaim.trim(),
      idadePlayer: editIdadePlayer,
      aniversarioPlayer: editAnivPlayer,
      idadeChar: editIdadeChar,
      aniversarioChar: editAnivChar,
      raca: editRaca,
      esquadrao: editEsquadrao,
      zanpakuto: {
        ...(personagem.zanpakuto || {}),
        nome: editZkNome.trim() || personagem.zanpakuto?.nome || "Em despertar"
      }
    }, "Dados cadastrais e biográficos atualizados");
    alert("Dados do Shinigami atualizados com sucesso!");
  }
  function abrirGeradorZanpakutoAI(tipo = "shikai") {
    setAiZkTipo(tipo);
    setRitualState("selection");
    setChargeProgress(0);
    setRevealedCard(null);
    setSelectedRitualCard(null);
    setHoveredCardIdx(null);
    const opcoes = tipo === "bankai" ? gerar4OpcoesBankaiAI(db.personagens, personagem) : gerar4OpcoesShikaiAI(db.personagens);
    setAiZkOpcoes(opcoes);
    setShowZanpakutoAIModal(true);
    playReiatsuSound(tipo === 'bankai' ? 'bankai' : 'charge');
  }
  function handleHoverRitualCard(idx) {
    if (ritualState !== "selection") return;
    setHoveredCardIdx(idx);
    playReiatsuSound('hum');
  }
  function handleLeaveRitualCard(idx) {
    if (hoveredCardIdx === idx) {
      setHoveredCardIdx(null);
    }
  }
  function iniciarDespertarLamina(opcaoEscolhida, idx) {
    setSelectedRitualCard(opcaoEscolhida);
    setRitualState("charging");
    setChargeProgress(0);
    setChargeStageText("Ressonando frequência com a alma...");
    playReiatsuSound('charge');
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    let progress = 0;
    chargeIntervalRef.current = setInterval(() => {
      progress += 2;
      setChargeProgress(progress);
      if (progress === 24) {
        setChargeStageText("A barreira do mundo interior está se rompendo...");
        playReiatsuSound('charge');
      } else if (progress === 54) {
        setChargeStageText("O espírito da Zanpakutō sussurra seu verdadeiro nome...");
        playReiatsuSound('charge');
      } else if (progress === 82) {
        setChargeStageText("Pressão Espiritual crítica! O selo milenar foi destruído!");
        playReiatsuSound('shatter');
      } else if (progress >= 100) {
        clearInterval(chargeIntervalRef.current);
        chargeIntervalRef.current = null;
        setRitualState("revealed");
        setRevealedCard(opcaoEscolhida);
        playReiatsuSound(aiZkTipo === 'bankai' ? 'bankai' : 'win');
      }
    }, 45);
  }
  function pularCarregamento() {
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    chargeIntervalRef.current = null;
    setChargeProgress(100);
    setRitualState("revealed");
    setRevealedCard(selectedRitualCard || aiZkOpcoes[0]);
    playReiatsuSound(aiZkTipo === 'bankai' ? 'bankai' : 'win');
  }
  function voltarParaSelecao() {
    setRitualState("selection");
    setChargeProgress(0);
    setRevealedCard(null);
    setSelectedRitualCard(null);
  }
  function escolherOpcaoAI(opcaoEscolhida) {
    if (aiZkTipo === "shikai") {
      const novoZk = {
        ...(personagem.zanpakuto || {}),
        nome: opcaoEscolhida.nome,
        shikaiAtiva: opcaoEscolhida
      };
      setZk(novoZk);
      updateChar({
        zanpakuto: novoZk,
        permissoes: {
          ...(personagem.permissoes || {}),
          shikaiLiberada: false
        }
      }, `🗡️ DESPERTOU SHIKAI AUTORAL: [${opcaoEscolhida.nome}] — "${opcaoEscolhida.comando}"`);
      setSubPaginaFicha("shikai");
      setShowZanpakutoAIModal(false);
      alert(`✨ Parabéns! Sua Shikai [${opcaoEscolhida.nome}] foi selada com exclusividade na sua ficha!`);
    } else {
      const novoZk = {
        ...(personagem.zanpakuto || {}),
        bankaiAtiva: opcaoEscolhida
      };
      setZk(novoZk);
      updateChar({
        zanpakuto: novoZk,
        permissoes: {
          ...(personagem.permissoes || {}),
          bankaiLiberada: false
        }
      }, `卍 DESPERTOU BANKAI SUPREMA: [${opcaoEscolhida.nome}] — "${opcaoEscolhida.comando}"`);
      setSubPaginaFicha("bankai");
      setShowZanpakutoAIModal(false);
      alert(`🌟 GLÓRIA SUPREMA! A Bankai [${opcaoEscolhida.nome}] foi conquistada e selada com exclusividade!`);
    }
  }
  function gerarFichaWhatsApp() {
    const totalKidos = (personagem.kidosConhecidos || []).length || 3;
    return `࣭    ㅤ
                ⚯͛
                     ᩠      ⊹                ᩠          . 
                         ࣪       ✶  ͏t𝖍e
              ﹙  𝐒𝐎𝐂𝐈𝐄𝐃𝐀𝐃𝐄 𝐃𝐀𝐒 𝐀𝐋𝐌𝐀𝐒  ﹚⊹
             ɑ proteçɑ̃o 𝘀𝗲𝗺𝗽𝗿𝗲 seɾɑ́ 𝑑͟𝑎͟𝑑͟𝑎 
         no       𝗦𝗘𝗜𝗥𝗘𝗜𝗧𝗘𝗜    ɑqueles 
              .  que   ɑ     𝒎𝒆𝒓𝒆𝒄𝒆𝒎  .ᐟ
                      ︶ ͝     ︶꒷꒦︶                        
     
              ⊹    /   𝙫ocê é um shinigɑmi
            toɾne-se   𝓛𝐞𝐧𝐝ɑ́ɾio  ・・・
                                     ﹀                                   
        ͛  𝒇𝒊𝒄𝒉𝒂 𝒅𝒆   :   𝕻𝗘𝗥𝗦𝗢𝗡𝗔𝗚𝗘𝗠  „                        
  ɑpɾesentɑmos ɑ fichɑ que dɑɾɑ́ vidɑ 
  ɑo seu shinigɑmi(ɑ)! ⊹ ɑdiɑntɑmos ɑ 
  impoɾtɑnciɑ de fɑzeɾ ɑ fichɑ com 
  cɑlmɑ, ɑliɑdɑ ɑ leituɾɑ minunciosɑ 
  dos documentos disponibilizɑdos. 
                                                                   
        ﹙ 𝗗𝗔𝗗𝗢𝗦 𝗗𝗢 𝗣𝗔𝗥𝗧𝗜𝗖𝗜𝗣𝗔𝗡𝗧𝗘 ﹚ 
       ✶  „  nome &` + "\\" + `\` quɑtɾo digit͟os .ᐟ
       ⎯  ${personagem.nome.split(" ")[0] || "Jogador"}, ${personagem.whatsapp ? personagem.whatsapp.slice(-4) : "0000"}
       ✶  „  dɑ͟tɑ de nɑscimento &` + "\\" + `\` idɑde .ᐟ
       ⎯  ${personagem.aniversarioPlayer || "15/07"} • ${personagem.idadePlayer || "20"} anos
       ✶  „  ɑçɑ̃o de suɑ ɑu͟t͟oɾiɑ .ᐟ
       ⎯ fɑvoɾ enviɑɾ sepɑɾɑdɑmente no privado.

        ﹙ 𝗗𝗔𝗗𝗢𝗦 𝗗𝗢 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗚𝗘𝗠 ﹚ 
       ✶  „  no͟me do peɾsonɑgem  .ᐟ
       ⎯     ${personagem.nome}
       ✶  „  idɑde &` + "\\" + `\` ɑn͟ive͟ɾsɑ́ɾio .ᐟ
       ⎯ ${personagem.idadeChar || "18"} anos - ${personagem.aniversarioChar || "15/07"}. 
       ✶  „  ɾeivindicɑçɑ̃o fɑ͟ciɑl  .ᐟ
       ⎯  ${personagem.faceclaim || personagem.nome}
       ✶  „  esquɑdɾɑ̃o de suɑ escolhɑ  .ᐟ
       ⎯   ${personagem.esquadrao || "11º Esquadrão"} 
       ✶  „  oɾigem e rɑçɑ .ᐟ
       ⎯  ${personagem.raca || "Shinigami"}
       ✶  „  zɑnpɑkutō .ᐟ
       ⎯ nome: ${personagem.zanpakuto?.nome || "Em despertar"}
       ⎯ stɑtus: ${personagem.zanpakuto?.bankaiAtiva ? "Bankai Desperta" : personagem.zanpakuto?.shikaiAtiva ? "Shikai Desperta" : "Lâmina Selada"}
       ✶  „  quɑntidɑde de kidōs .ᐟ
       ⎯   ${totalKidos}

        ﹙ 𝗔𝗧𝗥𝗜𝗕𝗨𝗧𝗢𝗦 𝗚𝗘𝗥𝗔𝗜𝗦 ﹚              
       ✶  „ distɾibuiçɑ̃o ɑtuɑl .ᐟ
       ⎯  pɾessɑ̃o espiɾituɑl: ${personagem.atributos.pressao}
       ⎯  foɾçɑ:  ${personagem.atributos.forca}           
       ⎯  velocidɑde: ${personagem.atributos.velocidade}
       ⎯  ɾesiliênciɑ: ${personagem.atributos.resiliencia}

        ﹙ 𝗧𝗘𝗥𝗠𝗢 𝗗𝗘 𝗖𝗢𝗡𝗦𝗘𝗡𝗧𝗜𝗠𝗘𝗡𝗧𝗢 ﹚     
  ₍  X  ₎ estou ciente de que dentɾo do 
  role plɑying gɑme encontɾɑɾei temɑs           
  e cenɑs que podem seɾ gɑtilhos, e 
  tɑmbém ɑssumo ɾesponsɑbilidɑde 
  de ɑceitɑçɑ̃o cɑso o peɾsonɑgem 
  sofɾɑ quɑlqueɾ dɑno nɑɾɾɑtivo.

                               ✶
                       𝐩𝐬𝐲𝐜𝐡𝐞 ın 
                      ınspırαtıon`;
  }
  function copiarFichaWhatsApp() {
    const texto = gerarFichaWhatsApp();
    navigator.clipboard.writeText(texto);
    setCopiadoWhats(true);
    setTimeout(() => setCopiadoWhats(false), 3000);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 border-b border-bleach-border pb-3 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSubPaginaFicha("perfil"),
    className: `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${subPaginaFicha === "perfil" ? "bg-bleach-orange text-black font-extrabold shadow-lg" : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), /*#__PURE__*/React.createElement("span", null, "Ficha Geral")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSubPaginaFicha("shikai"),
    className: `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 relative ${subPaginaFicha === "shikai" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-lg" : temShikai || podeGerarShikai ? "bg-bleach-panel border border-blue-500/50 text-blue-300 hover:text-white shadow" : "bg-bleach-panel border border-bleach-border text-bleach-muted opacity-70"}`
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDDE1\uFE0F"), /*#__PURE__*/React.createElement("span", null, temShikai ? `Shikai: ${personagem.zanpakuto?.shikaiAtiva?.nome || personagem.zanpakuto?.nome}` : "Shikai (Despertar)"), podeGerarShikai && !temShikai && /*#__PURE__*/React.createElement("span", {
    className: "w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-1 right-1"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setSubPaginaFicha("bankai"),
    className: `px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 relative ${subPaginaFicha === "bankai" ? "bg-gradient-to-r from-purple-600 via-amber-500 to-orange-500 text-white font-extrabold shadow-[0_0_20px_#FFD700]" : temBankai || podeGerarBankai ? "bg-purple-950/60 border-2 border-purple-500 text-yellow-400 font-bold hover:brightness-125" : "bg-bleach-panel border border-bleach-border text-bleach-muted opacity-60"}`
  }, /*#__PURE__*/React.createElement("span", null, "\u534D"), /*#__PURE__*/React.createElement("span", null, temBankai ? `Bankai: ${personagem.zanpakuto?.bankaiAtiva?.nome}` : "Bankai Suprema"), podeGerarBankai && !temBankai && /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping absolute top-1 right-1"
  }))), subPaginaFicha === "perfil" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-2xl p-6 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row items-center md:items-start gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-36 h-36 bleach-avatar-frame overflow-hidden bg-black relative group"
  }, /*#__PURE__*/React.createElement("img", {
    src: editFoto,
    alt: personagem.nome,
    className: "w-full h-full object-cover",
    onError: e => {
      e.target.src = 'assets/ichigo-orange.png';
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition text-[11px] text-bleach-orange font-bold text-center p-2"
  }, "\uD83D\uDCF7 Alterar Foto", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: e => handleFotoUpload(e, "perfil"),
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "mt-2.5 px-3 py-1 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-[11px] text-bleach-creamDim rounded-lg cursor-pointer transition"
  }, "Subir Imagem", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: e => handleFotoUpload(e, "perfil"),
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-center md:text-left space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-center md:justify-start gap-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-3xl sm:text-4xl tracking-widest text-bleach-orange"
  }, personagem.nome), /*#__PURE__*/React.createElement(Badge, {
    color: ESTADOS.find(e => e.key === personagem.estado)?.color || C.green
  }, personagem.estado), /*#__PURE__*/React.createElement(Badge, {
    color: powerTier.color
  }, powerTier.title)), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-creamDim flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1"
  }, /*#__PURE__*/React.createElement("span", null, "Esquadr\xE3o: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, personagem.esquadrao || "11º Esquadrão")), /*#__PURE__*/React.createElement("span", null, "Ra\xE7a: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, personagem.raca)), /*#__PURE__*/React.createElement("span", null, "WhatsApp: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, maskWhats(personagem.whatsapp))), /*#__PURE__*/React.createElement("span", null, "Faceclaim: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, personagem.faceclaim || "Não definido"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-border p-3 rounded-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-xs mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-bleach-creamDim"
  }, "\u2694\uFE0F Ranking F\xEDsico"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-bleach-orange font-bold"
  }, "#", posFisico, "\xBA Lugar")), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-bleach-panel2 h-2 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-orange-600 to-amber-400 h-full rounded-full",
    style: {
      width: `${pctBarFisico}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-bleach-muted mt-1 text-right font-mono"
  }, "M\xE9dia: ", scoreFisico, " pts")), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-border p-3 rounded-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-xs mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-bleach-creamDim"
  }, "\u26A1 Press\xE3o Espiritual"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-cyan-400 font-bold"
  }, "#", posPressao, "\xBA Lugar")), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-bleach-panel2 h-2 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full",
    style: {
      width: `${pctBarPressao}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-bleach-muted mt-1 text-right font-mono"
  }, "Reiatsu: ", scorePressao, " pts"))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex flex-wrap gap-2 justify-center md:justify-start"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: copiarFichaWhatsApp,
    className: "px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:brightness-110 transition flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF1"), /*#__PURE__*/React.createElement("span", null, copiadoWhats ? "✓ Copiado com Sucesso!" : "Copiar Ficha WhatsApp")))))), isAdmin && /*#__PURE__*/React.createElement(Section, {
    title: "Painel de Concess\xE3o de Recompensas (ADM)",
    subtitle: "Atribua treinos em ON, rolagens ou pontos livres"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Tipo"), /*#__PURE__*/React.createElement("select", {
    value: rec.tipo,
    onChange: e => setRec({
      ...rec,
      tipo: e.target.value
    }),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }, TIPOS_RECOMPENSA.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Pontos Livres"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: rec.pontos,
    onChange: e => setRec({
      ...rec,
      pontos: e.target.value
    }),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Destino Direto (Opcional)"), /*#__PURE__*/React.createElement("select", {
    value: rec.atributo,
    onChange: e => setRec({
      ...rec,
      atributo: e.target.value
    }),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Pontos Livres (Ficha)"), /*#__PURE__*/React.createElement("option", {
    value: "pressao"
  }, "Press\xE3o Espiritual"), /*#__PURE__*/React.createElement("option", {
    value: "forca"
  }, "For\xE7a"), /*#__PURE__*/React.createElement("option", {
    value: "velocidade"
  }, "Velocidade"), /*#__PURE__*/React.createElement("option", {
    value: "resiliencia"
  }, "Resili\xEAncia"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Motivo / Link"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Treino de 30 linhas aprovado",
    value: rec.motivo,
    onChange: e => setRec({
      ...rec,
      motivo: e.target.value
    }),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: concederRecompensa,
    className: "px-5 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400 transition"
  }, "+ Conceder Recompensa"), /*#__PURE__*/React.createElement("button", {
    onClick: togglePermissaoShikai,
    className: `px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${personagem?.permissoes?.shikaiLiberada ? "bg-red-950 border-red-500 text-red-300" : "bg-blue-950 border-cyan-400 text-cyan-300"}`
  }, personagem?.permissoes?.shikaiLiberada ? "🔒 Revogar Permissão de Shikai" : "🔓 Liberar Despertar de Shikai"), /*#__PURE__*/React.createElement("button", {
    onClick: togglePermissaoBankai,
    className: `px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${personagem?.permissoes?.bankaiLiberada ? "bg-red-950 border-red-500 text-red-300" : "bg-amber-950 border-amber-400 text-yellow-300"}`
  }, personagem?.permissoes?.bankaiLiberada ? "🔒 Revogar Permissão de Bankai" : "🔓 Liberar Despertar de Bankai"))), /*#__PURE__*/React.createElement(Section, {
    title: "\uD83C\uDF81 Sorteios & Roletas de Recompensa",
    subtitle: "Realize seus giros liberados por treinos em ON e miss\xF5es aprovadas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl tracking-wider text-bleach-orange flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFB2"), " Sorteio Gacha Comum"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full bg-black text-bleach-orange font-mono font-bold text-xs border border-bleach-border"
  }, personagem.sorteiosComunsRestantes || 0, " giros dispon\xEDveis")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-3"
  }, "Sorteia recursos e pontos de atributo com foco em ganhos graduais e balanceados."), /*#__PURE__*/React.createElement("div", {
    className: "mb-4 p-2.5 bg-black/60 border border-white/10 rounded-lg text-[10px] space-y-1 font-mono text-bleach-muted"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-bleach-creamDim"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Comum (+1 a +2 pts):"), /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, "65.0%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-emerald-400"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Incomum (+3 a +4 pts):"), /*#__PURE__*/React.createElement("strong", null, "22.0%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-cyan-400"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Raro (+5 a +7 pts):"), /*#__PURE__*/React.createElement("strong", null, "9.0%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-purple-400"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 \xC9pico (+8 a +11 pts):"), /*#__PURE__*/React.createElement("strong", null, "3.5%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-yellow-400"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Lend\xE1rio (+14 a +18 pts):"), /*#__PURE__*/React.createElement("strong", null, "0.5% (1 em 200)")))), /*#__PURE__*/React.createElement("button", {
    onClick: girarGachaComum,
    disabled: (personagem.sorteiosComunsRestantes || 0) <= 0,
    className: "w-full py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
  }, (personagem.sorteiosComunsRestantes || 0) > 0 ? "✨ Realizar Sorteio Comum" : "Sem Giros Comuns (Aguarde ADM)")), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border-2 border-purple-500/40 purple-reiatsu-glow rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl tracking-wider text-purple-400 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF1F"), " Sorteio de Classe Especial"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full bg-black text-purple-300 font-mono font-bold text-xs border border-purple-500/40"
  }, personagem.sorteiosEspeciaisRestantes || 0, " especiais")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-3"
  }, "Pr\xEAmios de alto prest\xEDgio. A cobi\xE7ada ", /*#__PURE__*/React.createElement("strong", null, "Miss\xE3o Narrativa Individual"), " \xE9 um pr\xEAmio supremo ultrarraro (1 em 100)!"), /*#__PURE__*/React.createElement("div", {
    className: "mb-4 p-2.5 bg-black/60 border border-purple-500/20 rounded-lg text-[10px] space-y-1 font-mono text-bleach-muted"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-emerald-300"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Pr\xEAmios Simples (+4 a +7 pts):"), /*#__PURE__*/React.createElement("strong", null, "60.0%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-cyan-300"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Intermedi\xE1rios (+8 a +12 pts):"), /*#__PURE__*/React.createElement("strong", null, "24.0%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-purple-300"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Raros Nobres (+15 a +16 pts):"), /*#__PURE__*/React.createElement("strong", null, "11.0%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-amber-300"
  }, /*#__PURE__*/React.createElement("span", null, "\u2022 Lend\xE1rios (+20 a +24 pts):"), /*#__PURE__*/React.createElement("strong", null, "4.0%")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between text-white font-bold bg-purple-950/60 px-1 py-0.5 rounded border border-purple-400/40"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-300"
  }, "\uD83D\uDC51 Miss\xE3o Narrativa:"), /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "1.0% (1 em 100)")))), /*#__PURE__*/React.createElement("button", {
    onClick: girarSorteioEspecial,
    disabled: (personagem.sorteiosEspeciaisRestantes || 0) <= 0,
    className: "w-full py-2.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
  }, (personagem.sorteiosEspeciaisRestantes || 0) > 0 ? "⚡ Girar Sorteio Especial" : "Sem Giros Especiais"))), (personagem.sorteiosDrops || []).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-3 border-t border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowGachaHistory(!showGachaHistory),
    className: "text-xs text-bleach-orange font-bold uppercase hover:underline"
  }, showGachaHistory ? "▼ Ocultar Histórico de Drops" : "▶ Ver Histórico de Drops Anteriores"), showGachaHistory && /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 mt-3"
  }, personagem.sorteiosDrops.map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "p-2.5 bg-black/50 border border-bleach-borderSoft rounded-lg text-xs flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: d.cor || C.cream
    },
    className: "font-semibold"
  }, d.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, d.data)))))), (personagem.pontosDisponiveis || 0) > 0 && /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-orange-950/60 via-bleach-panel to-orange-950/40 border-2 border-bleach-orange/60 rounded-xl p-5 shadow-2xl reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl tracking-wider text-bleach-orange flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u2728"), " PONTOS DISPON\xCDVEIS PARA DISTRIBUIR"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim"
  }, "Voc\xEA possui ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange"
  }, personagem.pontosDisponiveis), " pontos livres concedidos pelo mestre/sorteios.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-bold uppercase tracking-wider text-bleach-creamDim"
  }, "Distribuir por vez:"), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-black/80 border border-bleach-border rounded-xl p-1 gap-1 shadow-inner"
  }, [1, 5, 10].map(step => /*#__PURE__*/React.createElement("button", {
    key: step,
    type: "button",
    onClick: () => setPassoDistribuicao(step),
    className: `px-3 py-1 rounded-lg text-xs font-mono font-black transition ${passoDistribuicao === step ? "bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black shadow-[0_0_10px_#FF6A13]" : "bg-transparent text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, "\xB1", step, " ", step === 1 ? "pt" : "pts"))), /*#__PURE__*/React.createElement("div", {
    className: "ml-auto md:ml-2 bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-creamDim"
  }, "Restam: "), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-lg text-bleach-orange font-mono"
  }, restante)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
  }, ATTRS.map(a => {
    const decStep = Math.min(passoDistribuicao, pend[a.key]);
    const incStep = Math.min(passoDistribuicao, restante);
    return /*#__PURE__*/React.createElement("div", {
      key: a.key,
      className: "bg-black/50 border border-bleach-border rounded-xl p-3 flex flex-col justify-between gap-2.5 shadow-sm"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold uppercase tracking-wider block",
      style: {
        color: a.color
      }
    }, a.label), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-bleach-muted"
    }, "Atual: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-white"
    }, personagem.atributos[a.key]), pend[a.key] > 0 && /*#__PURE__*/React.createElement("span", {
      className: "text-bleach-orange font-mono ml-1 font-bold"
    }, "\u2192 ", personagem.atributos[a.key] + pend[a.key]))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1.5 bg-black/80 p-1 rounded-xl border border-white/10"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        const amt = Math.min(passoDistribuicao, pend[a.key]);
        if (amt > 0) setPend(p => ({
          ...p,
          [a.key]: p[a.key] - amt
        }));
      },
      disabled: pend[a.key] === 0,
      title: `Diminuir ${decStep || passoDistribuicao} ponto(s)`,
      className: "px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 disabled:cursor-not-allowed hover:border-bleach-orange hover:bg-bleach-panel2 transition"
    }, "\u2212", passoDistribuicao > 1 ? passoDistribuicao : ""), /*#__PURE__*/React.createElement("span", {
      className: "min-w-[42px] text-center font-mono font-black text-bleach-orange text-base"
    }, "+", pend[a.key]), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        const amt = Math.min(passoDistribuicao, restante);
        if (amt > 0) setPend(p => ({
          ...p,
          [a.key]: p[a.key] + amt
        }));
      },
      disabled: restante <= 0,
      title: `Adicionar ${incStep || passoDistribuicao} ponto(s)`,
      className: "px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 disabled:cursor-not-allowed hover:border-bleach-orange hover:bg-bleach-panel2 transition"
    }, "+", passoDistribuicao > 1 ? passoDistribuicao : ""))), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between pt-1 border-t border-white/5 text-[10px]"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-bleach-muted"
    }, "Adi\xE7\xE3o direta:"), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-1"
    }, [1, 5, 10].map(quick => /*#__PURE__*/React.createElement("button", {
      key: quick,
      type: "button",
      onClick: () => {
        const amt = Math.min(quick, restante);
        if (amt > 0) setPend(p => ({
          ...p,
          [a.key]: p[a.key] + amt
        }));
      },
      disabled: restante <= 0,
      className: "px-2 py-0.5 rounded bg-bleach-panel2 border border-white/10 hover:border-bleach-orange text-bleach-creamDim hover:text-white font-mono font-bold disabled:opacity-30 disabled:cursor-not-allowed transition"
    }, "+", quick)))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center justify-between gap-3 pt-2"
  }, pendSum > 0 ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setPend({
      pressao: 0,
      forca: 0,
      velocidade: 0,
      resiliencia: 0
    }),
    className: "text-xs text-bleach-muted hover:text-red-400 underline transition"
  }, "\uD83D\uDD04 Zerar Distribui\xE7\xE3o Pendente") : /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: confirmarDistribuicao,
    disabled: pendSum === 0,
    className: "w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
  }, "Confirmar Distribui\xE7\xE3o (", pendSum, " pts)"))), /*#__PURE__*/React.createElement(Section, {
    title: "Atributos Espirituais",
    subtitle: "O valor puro do seu poder (sem conversores ou taxas ocultas)"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, ATTRS.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.key,
    className: "bg-bleach-panel2 border border-bleach-borderSoft rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between mb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider",
    style: {
      color: a.color
    }
  }, a.label), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, a.desc)), /*#__PURE__*/React.createElement("span", {
    className: "text-3xl font-extrabold font-mono",
    style: {
      color: a.color
    }
  }, personagem.atributos[a.key])), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full transition-all duration-500",
    style: {
      width: `${Math.min(100, personagem.atributos[a.key] / 200 * 100)}%`,
      backgroundColor: a.color
    }
  })))))), /*#__PURE__*/React.createElement(Section, {
    title: "Kid\u014D e T\xE9cnicas Aprendidas",
    subtitle: "Feiti\xE7os dominados pelo Shinigami"
  }, (personagem.tecnicas || []).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhuma t\xE9cnica registrada at\xE9 o momento.") : /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2.5 mb-4"
  }, personagem.tecnicas.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "bg-bleach-panel2 border border-bleach-border px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded bg-black text-[10px] font-bold text-bleach-orange uppercase"
  }, t.categoria), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-bleach-cream"
  }, t.nome), isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: () => removeTecnica(t.id),
    className: "text-red-400 hover:text-red-300 font-bold ml-1",
    title: "Remover t\xE9cnica"
  }, "\xD7")))), isAdmin && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-4 border-t border-bleach-borderSoft flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("select", {
    value: novaTecCat,
    onChange: e => setNovaTecCat(e.target.value),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }, CATEGORIAS_TECNICA.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nome da t\xE9cnica (Ex: Had\u014D #31 \u2014 Shakkah\u014D)",
    value: novaTecNome,
    onChange: e => setNovaTecNome(e.target.value),
    className: "flex-1 min-w-[180px] bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addTecnica,
    className: "px-4 py-2 bg-bleach-panel border border-bleach-border text-bleach-cream hover:border-bleach-orange rounded-lg text-xs font-bold uppercase"
  }, "+ Adicionar"))), /*#__PURE__*/React.createElement(Section, {
    title: "Hist\xF3rico de Registros",
    subtitle: "Linha do tempo de treinos, miss\xF5es e recompensas"
  }, (personagem.historico || []).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhum registro ainda.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, personagem.historico.slice(0, 20).map(h => /*#__PURE__*/React.createElement("div", {
    key: h.id,
    className: "border-l-2 border-bleach-orange pl-3 py-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, h.data), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-creamDim mt-0.5"
  }, h.texto))))), /*#__PURE__*/React.createElement(Section, {
    title: "Dados Cadastrais & Perfil",
    subtitle: "Edi\xE7\xE3o das informa\xE7\xF5es do Shinigami"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Nome"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editNome,
    onChange: e => setEditNome(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "WhatsApp"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editWhats,
    onChange: e => setEditWhats(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "C\xF3digo de Acesso"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editCodigo,
    onChange: e => setEditCodigo(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Faceclaim"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editFaceclaim,
    onChange: e => setEditFaceclaim(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Esquadr\xE3o"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editEsquadrao,
    onChange: e => setEditEsquadrao(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-muted uppercase font-bold block mb-1"
  }, "Ra\xE7a"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editRaca,
    onChange: e => setEditRaca(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: salvarDadosCompletos,
    className: "w-full sm:w-auto px-6 py-2.5 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream hover:border-bleach-orange rounded-xl font-bold uppercase transition"
  }, "\uD83D\uDCBE Salvar Dados Cadastrais")))), subPaginaFicha === "shikai" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, temShikai ? /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-blue-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "shikai-smoke-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-500/30 pb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-blue-950 border border-blue-400 text-cyan-300 text-xs font-bold rounded-full uppercase tracking-wider"
  }, "\uD83D\uDDE1\uFE0F Despertar de Primeira Fase \u2022 Shikai \xDAnica e Individual"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-cyan-400 mt-2 drop-shadow-[0_0_15px_rgba(79,179,232,0.6)]"
  }, personagem?.zanpakuto?.shikaiAtiva?.nome || personagem?.zanpakuto?.nome || "Shikai Desconhecida"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-mono text-cyan-200 mt-1 italic"
  }, "Comando de Libera\xE7\xE3o: \"", personagem?.zanpakuto?.shikaiAtiva?.comando || 'Liberte-se', "\"")), /*#__PURE__*/React.createElement(Badge, {
    color: C.blue,
    className: "text-xs py-1.5 px-3"
  }, "Elemento: ", personagem?.zanpakuto?.shikaiAtiva?.elemento || 'Espiritual')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1 flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(BleachSwordArt, {
    arma: personagem?.zanpakuto?.shikaiAtiva,
    nomeZk: personagem?.zanpakuto?.shikaiAtiva?.nome || personagem?.zanpakuto?.nome,
    isBankai: false,
    foto: editFotoShikai || personagem?.zanpakuto?.fotoShikai,
    onUpload: e => handleFotoUpload(e, "shikai")
  })), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-4"
  }, personagem?.zanpakuto?.shikaiAtiva?.espirito && /*#__PURE__*/React.createElement("div", {
    className: "bg-black/70 border-2 border-purple-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(139,111,214,0.3)]"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-black uppercase tracking-widest text-purple-300 mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), " Resson\xE2ncia do Esp\xEDrito & Mundo Interior"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-purple-100/90 italic leading-relaxed whitespace-pre-line"
  }, "\"", personagem?.zanpakuto?.shikaiAtiva?.espirito, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-blue-500/40 rounded-xl p-5 shadow-inner"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), " Formato & Transforma\xE7\xE3o da L\xE2mina Shikai"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-cream leading-relaxed whitespace-pre-line"
  }, personagem?.zanpakuto?.shikaiAtiva?.formatoArma || "Lâmina espiritual em sua primeira forma de libertação.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-blue-500/40 rounded-xl p-5 shadow-inner"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u26A1"), " Poder & Habilidades Especiais em Combate"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-cream leading-relaxed whitespace-pre-line"
  }, personagem?.zanpakuto?.shikaiAtiva?.poder || "Poder único e autoral despertado na arma.")))))) : podeGerarShikai ? /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-cyan-400 rounded-2xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "shikai-smoke-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-xl mx-auto space-y-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-4xl"
  }, "\u2728"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-4xl text-cyan-400 tracking-widest"
  }, "DESPERTAR DE SHIKAI AUTORIZADO!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim leading-relaxed"
  }, "A Administra\xE7\xE3o aprovou o seu treinamento narrativo! Voc\xEA agora pode manifestar a voz da sua Zanpakut\u014D e gerar ", /*#__PURE__*/React.createElement("strong", null, "4 op\xE7\xF5es de Shikai 100% autorais e individuais"), ". Ao escolher uma delas, ela ser\xE1 exclusivamente sua no RPG!"), /*#__PURE__*/React.createElement("button", {
    onClick: () => abrirGeradorZanpakutoAI("shikai"),
    className: "px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 transition"
  }, "\uD83E\uDD16 Gerar 4 Op\xE7\xF5es de Shikai Individuais"))) : /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-2xl p-12 text-center space-y-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-4xl opacity-50"
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-3xl text-bleach-muted tracking-wider"
  }, "SHIKAI AINDA N\xC3O DESPERTA"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted max-w-md mx-auto leading-relaxed"
  }, "O despertar de Shikai exige treinamento em ON (30 linhas) e autoriza\xE7\xE3o da Administra\xE7\xE3o. Assim que a ADM liberar na sua ficha, voc\xEA poder\xE1 gerar e escolher sua forma Shikai autoral e individual!"))), subPaginaFicha === "bankai" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, temBankai ? /*#__PURE__*/React.createElement("div", {
    className: "bankai-supreme-card border-2 border-amber-500 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/40 pb-5"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "px-3.5 py-1 bg-gradient-to-r from-purple-900 to-amber-900 border border-amber-400 text-yellow-300 text-xs font-black rounded-full uppercase tracking-widest shadow"
  }, "\u534D LIBERA\xC7\xC3O COMPLETA \u2022 BANKAI SUPREMA INDIVIDUAL"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-6xl tracking-widest text-amber-300 mt-2 drop-shadow-[0_0_25px_#FFD700]"
  }, personagem?.zanpakuto?.bankaiAtiva?.nome || "Bankai Suprema"), /*#__PURE__*/React.createElement("div", {
    className: "text-xs sm:text-sm font-mono text-yellow-200 mt-1 italic"
  }, "Comando Supremo: \"", personagem?.zanpakuto?.bankaiAtiva?.comando || 'Bankai!', "\"")), /*#__PURE__*/React.createElement(Badge, {
    color: C.yellow,
    className: "text-xs py-2 px-4 shadow-[0_0_15px_#FFD700]"
  }, "Poder Transcendente")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1 flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(BleachSwordArt, {
    arma: personagem?.zanpakuto?.bankaiAtiva,
    nomeZk: personagem?.zanpakuto?.bankaiAtiva?.nome,
    isBankai: true,
    foto: editFotoBankai || personagem?.zanpakuto?.fotoBankai,
    onUpload: e => handleFotoUpload(e, "bankai")
  })), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-2 space-y-4"
  }, (personagem?.zanpakuto?.bankaiAtiva?.espirito || personagem?.zanpakuto?.shikaiAtiva?.espirito) && /*#__PURE__*/React.createElement("div", {
    className: "bg-black/80 border-2 border-amber-500/60 rounded-2xl p-5 shadow-[0_0_25px_rgba(255,215,0,0.3)]"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-black uppercase tracking-widest text-yellow-300 mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), " Resson\xE2ncia do Esp\xEDrito & Mundo Interior Transcendental"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-yellow-100/90 italic leading-relaxed whitespace-pre-line"
  }, "\"", personagem?.zanpakuto?.bankaiAtiva?.espirito || personagem?.zanpakuto?.shikaiAtiva?.espirito, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/70 border border-amber-500/40 rounded-2xl p-5 shadow-inner"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC51"), " Manifesta\xE7\xE3o Colossal & Dom\xEDnio da Bankai"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-yellow-100/90 leading-relaxed whitespace-pre-line"
  }, personagem?.zanpakuto?.bankaiAtiva?.formatoArma || "Manifestação monumental do poder da Bankai.")), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/70 border border-amber-500/40 rounded-2xl p-5 shadow-inner"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u26A1"), " Poder Supremo & Mec\xE2nica de Evolu\xE7\xE3o"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-yellow-100/90 leading-relaxed whitespace-pre-line"
  }, personagem?.zanpakuto?.bankaiAtiva?.poder || "Poder absoluto e transcendental da Bankai.")))))) : podeGerarBankai ? /*#__PURE__*/React.createElement("div", {
    className: "bankai-supreme-card border-2 border-amber-500 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-xl mx-auto space-y-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-5xl"
  }, "\u534D"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-4xl sm:text-5xl text-amber-300 tracking-widest drop-shadow-[0_0_20px_#FFD700]"
  }, "DESPERTAR DE BANKAI AUTORIZADO!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-yellow-100/80 leading-relaxed"
  }, "Voc\xEA superou todos os limites e atingiu a resson\xE2ncia suprema com sua Zanpakut\u014D! Ao gerar as op\xE7\xF5es, a ", /*#__PURE__*/React.createElement("strong", null, "Op\xE7\xE3o 1 ser\xE1 a evolu\xE7\xE3o can\xF4nica e perfeita da sua Shikai atual"), ", acompanhada de 3 ramifica\xE7\xF5es transcendentais."), /*#__PURE__*/React.createElement("button", {
    onClick: () => abrirGeradorZanpakutoAI("bankai"),
    className: "px-10 py-4 bg-gradient-to-r from-purple-600 via-amber-500 to-orange-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_#FFD700] hover:scale-105 transition"
  }, "\u26A1 Gerar 4 Op\xE7\xF5es de Bankai Suprema"))) : /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-2xl p-12 text-center space-y-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-4xl opacity-50"
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-3xl text-bleach-muted tracking-wider"
  }, "BANKAI AINDA N\xC3O DESPERTA"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted max-w-md mx-auto leading-relaxed"
  }, "A libera\xE7\xE3o de Bankai requer dom\xEDnio lend\xE1rio da Shikai, aprova\xE7\xE3o expressa da Administra\xE7\xE3o e treino \xE1rduo de submiss\xE3o do esp\xEDrito."))), rewardModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-bleach-orange rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl reiatsu-glow relative animate-bounce-short"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-4xl mb-2"
  }, "\uD83C\uDF81"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-3xl tracking-widest text-bleach-orange mb-1"
  }, rewardModal.titulo), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-bold uppercase my-3 inline-block px-4 py-1 rounded-full border",
    style: {
      color: rewardModal.cor,
      borderColor: rewardModal.cor
    }
  }, rewardModal.raridade), rewardModal.nomeItem && /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-bold text-white mb-2"
  }, rewardModal.nomeItem), rewardModal.pontos > 0 && /*#__PURE__*/React.createElement("p", {
    className: "text-base text-bleach-orange font-mono font-bold mb-2"
  }, "+", rewardModal.pontos, " Pontos Livres Concedidos!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-6 leading-relaxed"
  }, rewardModal.desc), /*#__PURE__*/React.createElement("button", {
    onClick: () => setRewardModal(null),
    className: "px-6 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
  }, "Resgatar Recompensa"))), showZanpakutoAIModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/92 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: `bg-gradient-to-b from-[#14100C] via-[#0A0908] to-[#120F0C] border-2 ${aiZkTipo === 'bankai' ? 'border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.35)]' : 'border-cyan-400 shadow-[0_0_60px_rgba(79,179,232,0.35)]'} rounded-3xl p-5 sm:p-8 max-w-4xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto`
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
      setShowZanpakutoAIModal(false);
    },
    className: "absolute top-4 right-4 text-bleach-muted hover:text-white text-lg font-bold w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center transition hover:border-bleach-orange"
  }, "\u2715"), ritualState === "selection" && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-4 py-1 border text-xs font-black rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow ${aiZkTipo === 'bankai' ? 'bg-amber-950/80 border-amber-400 text-yellow-300' : 'bg-blue-950/80 border-cyan-400 text-cyan-300'}`
  }, /*#__PURE__*/React.createElement("span", null, aiZkTipo === 'bankai' ? '卍' : '🗡️'), /*#__PURE__*/React.createElement("span", null, aiZkTipo === 'bankai' ? 'RITUAL SUPREMO DE BANKAI • 4 EVOLUÇÕES SELADAS' : 'RITUAL SAGRADO DE SHIKAI • 4 LÂMINAS SELADAS')), /*#__PURE__*/React.createElement("h3", {
    className: `font-title text-3xl sm:text-5xl tracking-widest mt-2 ${aiZkTipo === 'bankai' ? 'text-amber-300 drop-shadow-[0_0_20px_#FFD700]' : 'text-cyan-400 drop-shadow-[0_0_20px_rgba(79,179,232,0.7)]'}`
  }, aiZkTipo === 'bankai' ? "SINTA A EVOLUÇÃO TRANSCENDENTAL" : "SINTA O CHAMADO DA SUA ZANPAKUTŌ"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim max-w-2xl mx-auto mt-2 leading-relaxed"
  }, "Passe o mouse ou ", /*#__PURE__*/React.createElement("strong", null, "segure com o dedo"), " sobre uma l\xE2mina para sentir a vibra\xE7\xE3o da sua Reiatsu distorcendo o ar ao redor. Clique em uma das l\xE2minas para concentrar seu Reiryoku e iniciar a quebra do selo!")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
  }, aiZkOpcoes.map((op, idx) => {
    const isHovered = hoveredCardIdx === idx;
    return /*#__PURE__*/React.createElement("div", {
      key: op.id,
      onMouseEnter: () => handleHoverRitualCard(idx),
      onMouseLeave: () => handleLeaveRitualCard(idx),
      onTouchStart: () => handleHoverRitualCard(idx),
      onTouchEnd: () => handleLeaveRitualCard(idx),
      onClick: () => iniciarDespertarLamina(op, idx),
      className: `relative rounded-2xl p-5 border-2 transition duration-200 overflow-hidden flex flex-col justify-between min-h-[220px] select-none cursor-pointer ${isHovered ? aiZkTipo === 'bankai' ? 'air-vibrating-card-bankai bg-purple-950/40' : 'air-vibrating-card bg-blue-950/40' : 'bg-black/80 border-bleach-borderSoft hover:border-bleach-creamDim/50 shadow-xl'}`
    }, isHovered && /*#__PURE__*/React.createElement("div", {
      className: "heat-haze-overlay"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: `font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${aiZkTipo === 'bankai' ? 'bg-amber-950 border-amber-400 text-yellow-300' : 'bg-blue-950 border-cyan-400 text-cyan-300'}`
    }, aiZkTipo === 'bankai' ? `Evolução #0${idx + 1}` : `Lâmina Selada #0${idx + 1}`), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-mono text-bleach-muted"
    }, isHovered ? "⚡ RESSONANDO..." : "🔒 SELADA")), /*#__PURE__*/React.createElement("div", {
      className: "text-center py-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: `font-title text-2xl tracking-wider transition ${isHovered ? aiZkTipo === 'bankai' ? 'text-amber-300 drop-shadow-[0_0_12px_#FFD700]' : 'text-cyan-300 drop-shadow-[0_0_12px_#4FB3E8]' : 'text-bleach-muted/60 blur-[3px]'}`
    }, isHovered ? op.nome : "??? ??????"), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] font-mono text-bleach-muted mt-1 italic"
    }, isHovered ? `Elemento: ${op.elemento}` : "Ouvindo sussurros distantes..."))), /*#__PURE__*/React.createElement("div", {
      className: "mt-4 pt-3 border-t border-white/5"
    }, isHovered ? /*#__PURE__*/React.createElement("div", {
      className: `py-2 px-3 rounded-xl font-bold text-xs text-center uppercase tracking-wider transition animate-bounce ${aiZkTipo === 'bankai' ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_15px_#FFD700]' : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_#4FB3E8]'}`
    }, "\u26A1 CLIQUE PARA CONCENTRAR O REIRYOKU!") : /*#__PURE__*/React.createElement("div", {
      className: "py-2 px-3 rounded-xl bg-black/60 border border-white/10 text-bleach-muted text-[11px] font-semibold text-center flex items-center justify-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\u2728"), /*#__PURE__*/React.createElement("span", null, "Passe o cursor ou segure para sentir a vibra\xE7\xE3o"))));
  }))), ritualState === "charging" && /*#__PURE__*/React.createElement("div", {
    className: "py-8 px-4 text-center space-y-6 select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-48 h-48 sm:w-60 sm:h-60 mx-auto flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute inset-0 rounded-full border-2 border-dashed ${aiZkTipo === 'bankai' ? 'border-amber-400/60' : 'border-cyan-400/60'} spin-runes`
  }), /*#__PURE__*/React.createElement("div", {
    className: `absolute inset-3 rounded-full border-2 border-dotted ${aiZkTipo === 'bankai' ? 'border-purple-500/60' : 'border-blue-500/60'} spin-runes-fast`
  }), /*#__PURE__*/React.createElement("div", {
    className: `w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-black/90 border-4 flex flex-col items-center justify-center p-3 z-10 shadow-2xl transition ${aiZkTipo === 'bankai' ? 'border-amber-400 shadow-[0_0_40px_rgba(255,215,0,0.6)]' : 'border-cyan-400 shadow-[0_0_40px_rgba(79,179,232,0.6)]'} ${chargeProgress > 65 ? 'reiatsu-screen-shake' : ''}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl sm:text-2xl"
  }, aiZkTipo === 'bankai' ? '卍' : '🗡️'), /*#__PURE__*/React.createElement("span", {
    className: `font-title text-4xl sm:text-5xl font-black mt-0.5 ${aiZkTipo === 'bankai' ? 'text-amber-300 drop-shadow-[0_0_15px_#FFD700]' : 'text-cyan-300 drop-shadow-[0_0_15px_#4FB3E8]'}`
  }, chargeProgress, "%"), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-bleach-muted"
  }, "Densidade Reiryoku"))), /*#__PURE__*/React.createElement("div", {
    className: "max-w-md mx-auto space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-bleach-panel2 h-3.5 rounded-full overflow-hidden border border-white/10 p-0.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full rounded-full transition-all duration-75 shadow-lg ${aiZkTipo === 'bankai' ? 'bg-gradient-to-r from-purple-600 via-amber-400 to-yellow-300 shadow-[0_0_15px_#FFD700]' : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-300 shadow-[0_0_15px_#4FB3E8]'}`,
    style: {
      width: `${chargeProgress}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: `max-w-lg mx-auto p-4 rounded-2xl bg-black/80 border text-center text-xs sm:text-sm font-bold leading-relaxed shadow-inner ${aiZkTipo === 'bankai' ? 'border-amber-500/50 text-yellow-200' : 'border-cyan-500/50 text-cyan-200'}`
  }, chargeStageText), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: pularCarregamento,
    className: "px-4 py-1.5 bg-black/60 border border-bleach-border hover:border-bleach-orange text-bleach-creamDim hover:text-white text-xs font-bold rounded-xl transition"
  }, "\u23E9 Pular Anima\xE7\xE3o de Despertar"))), ritualState === "revealed" && revealedCard && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6 card-pop-reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center border-b border-bleach-borderSoft pb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `px-4 py-1 border text-xs font-black rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow ${aiZkTipo === 'bankai' ? 'bg-gradient-to-r from-purple-900 to-amber-900 border-amber-400 text-yellow-300 shadow-[0_0_20px_#FFD700]' : 'bg-gradient-to-r from-blue-950 to-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(79,179,232,0.6)]'}`
  }, /*#__PURE__*/React.createElement("span", null, aiZkTipo === 'bankai' ? '卍' : '🗡️'), /*#__PURE__*/React.createElement("span", null, aiZkTipo === 'bankai' ? 'BANKAI SUPREMA TRANSCENDENTAL DESBLOQUEADA!' : 'SHIKAI ÚNICA & AUTORAL DESPERTA!')), /*#__PURE__*/React.createElement("h2", {
    className: `font-title text-4xl sm:text-6xl tracking-widest mt-3 ${aiZkTipo === 'bankai' ? 'text-amber-300 drop-shadow-[0_0_30px_#FFD700]' : 'text-cyan-400 drop-shadow-[0_0_30px_rgba(79,179,232,0.8)]'}`
  }, revealedCard.nome), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 p-3.5 bg-black/80 border border-white/10 rounded-2xl max-w-xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-bleach-muted uppercase tracking-wider font-bold"
  }, "Comando de Libera\xE7\xE3o Sagrado"), /*#__PURE__*/React.createElement("div", {
    className: `font-mono text-sm sm:text-base italic font-bold mt-0.5 ${aiZkTipo === 'bankai' ? 'text-yellow-200' : 'text-cyan-200'}`
  }, "\"", revealedCard.comando, "\""))), revealedCard.espirito && /*#__PURE__*/React.createElement("div", {
    className: "bg-black/80 border border-cyan-500/30 p-4 rounded-2xl shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC64"), " Esp\xEDrito da Zanpakut\u014D & Mundo Interior"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-cyan-100/90 italic leading-relaxed"
  }, "\"", revealedCard.espirito, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-black/70 border border-bleach-border p-4 rounded-2xl space-y-1.5 shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDDE1\uFE0F"), " Formato da L\xE2mina"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 bg-bleach-panel2 border border-bleach-border text-[10px] font-bold text-bleach-creamDim rounded-full"
  }, revealedCard.elemento)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-cream leading-relaxed"
  }, revealedCard.formatoArma)), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/70 border border-bleach-border p-4 rounded-2xl space-y-1.5 shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange flex items-center gap-1.5 mb-1"
  }, /*#__PURE__*/React.createElement("span", null, "\u26A1"), " Poder & Efeito Devastador"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-cream leading-relaxed"
  }, revealedCard.poder))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-green-950/40 border border-green-500/40 rounded-xl text-center text-xs text-green-300 font-semibold flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("span", null, "L\xE2mina 100% Autoral: Ao selar, esta arma ser\xE1 sua com exclusividade absoluta no RPG! Ningu\xE9m mais ter\xE1 esse nome ou poder.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center justify-between gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: voltarParaSelecao,
    className: "w-full sm:w-auto px-5 py-3 bg-bleach-panel border border-bleach-border hover:border-bleach-orange text-bleach-cream text-xs font-bold uppercase rounded-xl transition flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC41\uFE0F"), /*#__PURE__*/React.createElement("span", null, "Explorar Outras L\xE2minas Seladas")), /*#__PURE__*/React.createElement("button", {
    onClick: () => escolherOpcaoAI(revealedCard),
    className: `w-full sm:w-auto px-8 py-3.5 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 transition active:scale-95 flex items-center justify-center gap-2 ${aiZkTipo === 'bankai' ? 'bg-gradient-to-r from-purple-600 via-amber-400 to-yellow-400 shadow-[0_0_25px_#FFD700]' : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-[0_0_25px_#4FB3E8]'}`
  }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), /*#__PURE__*/React.createElement("span", null, "Reivindicar & Selar Esta ", aiZkTipo.toUpperCase(), " na Minha Ficha")))))));
}

// TAB: ADMIN CONTROL PANEL
function AdminPanel({
  db,
  saveDb,
  session,
  onAbrirFicha,
  cloudStatus
}) {
  const isMaxAdm = session?.role === "super_admin";
  const [abaAdmin, setAbaAdmin] = useState(isMaxAdm ? "maximo" : "fichas");
  const [busca, setBusca] = useState("");
  const [novo, setNovo] = useState({
    nome: "",
    whatsapp: "",
    codigo: "",
    raca: "Shinigami",
    esquadrao: "11º Esquadrão",
    faceclaim: "",
    idadePlayer: "20",
    aniversarioPlayer: "01/01",
    idadeChar: "18",
    aniversarioChar: "01/01"
  });
  const [msgCriacao, setMsgCriacao] = useState(null);
  const [novaSenhaMax, setNovaSenhaMax] = useState("");
  const [msgPass, setMsgPass] = useState("");
  const [urlFirebaseInput, setUrlFirebaseInput] = useState(db.firebaseUrl || localStorage.getItem("bleach_firebase_url") || "");
  const [msgFirebase, setMsgFirebase] = useState("");
  const [novoSubAdm, setNovoSubAdm] = useState({
    usuario: "",
    senha: "",
    nome: "",
    cargo: "Avaliador de Cenas & Fichas",
    charId: db.personagens[0]?.id || ""
  });
  const [charParaDeletar, setCharParaDeletar] = useState(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState("cenas");
  const [admExecutor, setAdmExecutor] = useState(session?.nome || "ADM");
  const [charAlvoAdm, setCharAlvoAdm] = useState(db.personagens[0]?.id || "");
  const [fichasAvaliadasContador, setFichasAvaliadasContador] = useState(0);
  const [iaLutador1, setIaLutador1] = useState(db.personagens[0]?.nome || "Lutador 1");
  const [iaLutador2, setIaLutador2] = useState(db.personagens[1]?.nome || "Lutador 2");
  const [iaCenaTexto, setIaCenaTexto] = useState("");
  const [iaResultado, setIaResultado] = useState(null);
  const [iaProcessando, setIaProcessando] = useState(false);
  const [dadoTipo, setDadoTipo] = useState(20);
  const [dadoChar, setDadoChar] = useState(db.personagens[0]?.nome || "Geral");
  const [dadoRolando, setDadoRolando] = useState(false);
  const [dadoResultado, setDadoResultado] = useState(null);
  const [dadoAnimVal, setDadoAnimVal] = useState(1);
  function salvarConfigFirebase() {
    const urlLimpa = urlFirebaseInput.trim();
    localStorage.setItem("bleach_firebase_url", urlLimpa);
    saveDb({
      ...db,
      firebaseUrl: urlLimpa
    });
    try {
      const configData = JSON.stringify({
        firebaseUrl: urlLimpa
      }, null, 2);
      const blob = new Blob([configData], {
        type: "application/json"
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = "config.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {}
    setMsgFirebase("Nuvem conectada! O arquivo 'config.json' foi baixado. Suba ele no seu repositório do GitHub para que todos os celulares conectem automaticamente.");
    setTimeout(() => setMsgFirebase(""), 8000);
  }
  function baixarBackupJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `bleach_rpg_backup_${Date.now()}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function importarBackupJson(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed && parsed.personagens) {
          saveDb(parsed);
          alert("Banco de dados restaurado com sucesso do arquivo JSON!");
        } else {
          alert("Arquivo JSON inválido.");
        }
      } catch (err) {
        alert("Erro ao ler arquivo JSON.");
      }
    };
    reader.readAsText(file);
  }
  function gerarCodigoAuto() {
    const prefix = novo.nome.trim() ? novo.nome.trim().slice(0, 3).toUpperCase() : "SHIN";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    setNovo({
      ...novo,
      codigo: `${prefix}-${randNum}`
    });
  }
  function criarPersonagem(e) {
    e.preventDefault();
    if (!novo.nome.trim() || !novo.codigo.trim()) {
      alert("Por favor, preencha pelo menos o Nome do Personagem e o Código de Acesso!");
      return;
    }
    const codFinal = novo.codigo.trim();
    const whatsFinal = novo.whatsapp.trim() || "00000000000";
    const p = {
      id: uid(),
      nome: novo.nome.trim(),
      foto: "assets/ichigo-orange.png",
      whatsapp: whatsFinal,
      codigo: codFinal,
      raca: novo.raca,
      esquadrao: novo.esquadrao,
      faceclaim: novo.faceclaim.trim() || novo.nome.trim(),
      idadePlayer: novo.idadePlayer.trim(),
      aniversarioPlayer: novo.aniversarioPlayer.trim(),
      idadeChar: novo.idadeChar.trim(),
      aniversarioChar: novo.aniversarioChar.trim(),
      pontosDisponiveis: 20,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      permissoes: {
        shikaiLiberada: false,
        bankaiLiberada: false
      },
      atributos: {
        pressao: 10,
        forca: 10,
        velocidade: 10,
        resiliencia: 10
      },
      kidosConhecidos: [{
        id: "h4",
        numero: 4,
        nome: "Byakurai",
        cat: "Hadō",
        custoReiatsu: 3
      }, {
        id: "b1",
        numero: 1,
        nome: "Sai",
        cat: "Bakudō",
        custoReiatsu: 2
      }],
      tecnicas: [{
        id: uid(),
        nome: "Hadō #4 — Byakurai",
        categoria: "Hadō"
      }, {
        id: uid(),
        nome: "Bakudō #1 — Sai",
        categoria: "Bakudō"
      }],
      zanpakuto: {
        nome: "",
        fotoShikai: "",
        fotoBankai: "",
        shikaiAtiva: null,
        bankaiAtiva: null,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{
        id: uid(),
        data: nowStr(),
        texto: "Ficha criada na Sociedade das Almas (+20 pts livres + 2 Giros Comuns)"
      }]
    };
    saveDb({
      ...db,
      personagens: [...(db.personagens || []), p]
    });
    setMsgCriacao({
      nome: p.nome,
      codigo: p.codigo,
      whatsapp: p.whatsapp
    });
    setNovo({
      nome: "",
      whatsapp: "",
      codigo: "",
      raca: "Shinigami",
      esquadrao: "11º Esquadrão",
      faceclaim: "",
      idadePlayer: "20",
      aniversarioPlayer: "01/01",
      idadeChar: "18",
      aniversarioChar: "01/01"
    });
  }
  function copiarLoginMsg(char) {
    const msg = `⚔️ *SOCIEDADE DAS ALMAS — SEU LOGIN NO SITE* ⚔️\n\n👤 *Personagem:* ${char.nome}\n🔑 *Código de Acesso:* ${char.codigo}\n📱 *WhatsApp Cadastrado:* ${char.whatsapp || "—"}\n\n🌐 *Acesse o site:* https://maluttima.github.io/Site-Bleach-RPG/\n*(Vá na aba "Minha Ficha" e digite seu código para acessar seus atributos e rankings!)*`;
    navigator.clipboard.writeText(msg);
    alert(`Dados de login de ${char.nome} copiados para a área de transferência!`);
  }
  function confirmarExclusaoChar() {
    if (!charParaDeletar) return;
    const novosChars = (db.personagens || []).filter(p => p.id !== charParaDeletar.id);
    saveDb({
      ...db,
      personagens: novosChars
    });
    alert(`A ficha de ${charParaDeletar.nome} foi apagada com sucesso!`);
    setCharParaDeletar(null);
  }
  function adicionarSubAdm() {
    if (!novoSubAdm.usuario.trim() || !novoSubAdm.senha.trim() || !novoSubAdm.nome.trim()) {
      alert("Preencha Usuário, Senha e Nome do Sub-ADM!");
      return;
    }
    const sub = {
      id: uid(),
      usuario: novoSubAdm.usuario.trim().toLowerCase(),
      senha: novoSubAdm.senha.trim(),
      nome: novoSubAdm.nome.trim(),
      cargo: novoSubAdm.cargo.trim(),
      charId: novoSubAdm.charId
    };
    saveDb({
      ...db,
      subAdms: [...(db.subAdms || []), sub]
    });
    setNovoSubAdm({
      usuario: "",
      senha: "",
      nome: "",
      cargo: "Avaliador de Cenas & Fichas",
      charId: db.personagens[0]?.id || ""
    });
    alert("Sub-ADM cadastrado com sucesso!");
  }
  function removerSubAdm(id) {
    if (confirm("Deseja realmente revogar o acesso deste Administrador?")) {
      saveDb({
        ...db,
        subAdms: (db.subAdms || []).filter(a => a.id !== id)
      });
    }
  }
  function registrarAtividadeAdm() {
    let pontosGanhos = 0;
    let descTarefa = "";
    if (tarefaSelecionada === "cenas") {
      pontosGanhos = 8;
      descTarefa = "Avaliação de Cenas de Arco (+8 pontos)";
    } else if (tarefaSelecionada === "fichas") {
      if (fichasAvaliadasContador < 7) {
        alert("A regra de avaliação de fichas exige no mínimo 7 fichas para liberar os 3 pontos!");
        return;
      }
      pontosGanhos = 3;
      descTarefa = `Avaliação e Aprovação de ${fichasAvaliadasContador} Fichas (+3 pontos)`;
      setFichasAvaliadasContador(0);
    } else if (tarefaSelecionada === "missao") {
      pontosGanhos = 15;
      descTarefa = "Narração de Missão Principal (+15 pontos e giros concedidos)";
    } else if (tarefaSelecionada === "juiz") {
      pontosGanhos = 4;
      descTarefa = "Arbitragem de Luta em ON (+4 pontos)";
    }
    const registro = {
      id: uid(),
      admNome: admExecutor,
      tarefa: descTarefa,
      pontosGanhos,
      data: nowStr()
    };
    const personagens = (db.personagens || []).map(p => {
      if (p.id === charAlvoAdm) {
        return {
          ...p,
          pontosDisponiveis: (p.pontosDisponiveis || 0) + pontosGanhos,
          sorteiosComunsRestantes: tarefaSelecionada === "missao" ? (p.sorteiosComunsRestantes || 0) + 4 : p.sorteiosComunsRestantes || 0,
          sorteiosEspeciaisRestantes: tarefaSelecionada === "missao" ? (p.sorteiosEspeciaisRestantes || 0) + 1 : p.sorteiosEspeciaisRestantes || 0,
          historico: [{
            id: uid(),
            data: nowStr(),
            texto: `Recompensa de ADM (${descTarefa}) concedida na ficha (+${pontosGanhos} pts)`
          }, ...(p.historico || [])]
        };
      }
      return p;
    });
    saveDb({
      ...db,
      registrosTarefasAdm: [registro, ...(db.registrosTarefasAdm || [])],
      personagens
    });
    alert(`Atividade registrada com sucesso! +${pontosGanhos} pontos foram depositados na ficha de destino.`);
  }
  function julgarCombateComIA() {
    if (!iaCenaTexto.trim()) {
      alert("Por favor, cole o texto narrativo da cena dos combatentes!");
      return;
    }
    setIaProcessando(true);
    playReiatsuSound('kido');
    setTimeout(() => {
      const p1Obj = db.personagens.find(p => p.nome.toLowerCase().includes(iaLutador1.toLowerCase())) || db.personagens[0];
      const p2Obj = db.personagens.find(p => p.nome.toLowerCase().includes(iaLutador2.toLowerCase())) || db.personagens[1];
      const diffVel = (p1Obj?.atributos?.velocidade || 10) - (p2Obj?.atributos?.velocidade || 10);
      const diffPressao = (p1Obj?.atributos?.pressao || 10) - (p2Obj?.atributos?.pressao || 10);
      let conclusao = "";
      if (Math.abs(diffVel) >= 15) {
        conclusao = `${diffVel > 0 ? p1Obj.nome : p2Obj.nome} possui superioridade nítida de velocidade (+${Math.abs(diffVel)} em Hohō), esquivando da primeira investida e conseguindo ângulo crítico de contra-ataque.`;
      } else if (Math.abs(diffPressao) >= 15) {
        conclusao = `A pressão espiritual avassaladora de ${diffPressao > 0 ? p1Obj.nome : p2Obj.nome} (+${Math.abs(diffPressao)} de Reiatsu) impõe peso gravitacional anulando feitiços fracos do adversário.`;
      } else {
        conclusao = `Combate extremamente equilibrado! Ambos sofrem desgaste equivalente e o desfecho depende de um teste de dado ou ação de apoio narrativo.`;
      }
      const resultadoFinal = {
        id: uid(),
        data: nowStr(),
        lutador1: `${p1Obj.nome} (Vel: ${p1Obj.atributos.velocidade}, Pressão: ${p1Obj.atributos.pressao}, Força: ${p1Obj.atributos.forca})`,
        lutador2: `${p2Obj.nome} (Vel: ${p2Obj.atributos.velocidade}, Pressão: ${p2Obj.atributos.pressao}, Força: ${p2Obj.atributos.forca})`,
        cenaDesc: iaCenaTexto.slice(0, 150) + "...",
        veredito: `⚖️ Veredito Oficial da IA:\n\n1. ANÁLISE DE ATRIBUTOS: ${conclusao}\n\n2. DECISÃO NARRATIVA: Levando em conta o texto da cena e a lógica do sistema de Bleach, ${p1Obj.nome} e ${p2Obj.nome} devem atualizar seus estados conforme o impacto e custo de Reiatsu gasto na ação.`
      };
      saveDb({
        ...db,
        iaJulgamentos: [resultadoFinal, ...(db.iaJulgamentos || [])]
      });
      setIaResultado(resultadoFinal);
      setIaProcessando(false);
      playReiatsuSound('win');
    }, 1200);
  }
  function rolarDadoComTensao() {
    setDadoRolando(true);
    setDadoResultado(null);
    playReiatsuSound('roll');
    let ticks = 0;
    const maxTicks = 18;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * dadoTipo) + 1;
      setDadoAnimVal(rand);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        const finalVal = Math.floor(Math.random() * dadoTipo) + 1;
        setDadoAnimVal(finalVal);
        let categoria = "";
        let cor = C.muted;
        const pct = finalVal / dadoTipo;
        if (pct <= 0.1 || finalVal === 1) {
          categoria = "☠️ Extremo Negativo (Reze / Catástrofe Espiritual)";
          cor = C.red;
        } else if (pct <= 0.35) {
          categoria = "🔴 Negativo (Falha / Dano Sofrido)";
          cor = C.red;
        } else if (pct <= 0.65) {
          categoria = "🟡 Neutro (Sucesso Parcial com Custo)";
          cor = C.yellow;
        } else if (pct <= 0.9) {
          categoria = "🟢 Positivo (Sucesso Limpo)";
          cor = C.green;
        } else {
          categoria = "⚡ Extremo (Sucesso Crítico / Despertar Espiritual)";
          cor = C.yellow;
        }
        const registroDado = {
          id: uid(),
          autor: session?.nome || "Administração",
          personagem: dadoChar,
          dado: `d${dadoTipo}`,
          resultado: finalVal,
          categoria,
          data: nowStr()
        };
        saveDb({
          ...db,
          rolagensDadosPublicas: [registroDado, ...(db.rolagensDadosPublicas || []).slice(0, 19)]
        });
        setDadoResultado({
          val: finalVal,
          cat: categoria,
          cor
        });
        setDadoRolando(false);
        playReiatsuSound(pct >= 0.7 ? 'win' : 'roll');
      }
    }, 80);
  }
  function alterarSenhaSuperAdmin() {
    if (!novaSenhaMax.trim()) return;
    saveDb({
      ...db,
      superAdminSenha: novaSenhaMax.trim()
    });
    setMsgPass("Senha mestra alterada com sucesso!");
    setNovaSenhaMax("");
    setTimeout(() => setMsgPass(""), 3000);
  }
  const filtrados = (db.personagens || []).filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()) || (p.whatsapp || "").includes(busca));
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: isMaxAdm ? "Painel do ADM Máximo (Comandante Supremo)" : `Painel Administrativo (${session?.nome || "Sub-ADM"})`,
    subtitle: isMaxAdm ? "Acesso total irrestrito: gestão de outros ADMs, banco em nuvem, exclusão de perfis e regras" : `Cargo: ${session?.cargo || "Administrador"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 border-b border-bleach-borderSoft pb-3 mb-4"
  }, isMaxAdm && /*#__PURE__*/React.createElement("button", {
    onClick: () => setAbaAdmin("maximo"),
    className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${abaAdmin === "maximo" ? "bg-yellow-500 text-black font-extrabold shadow" : "bg-bleach-panel2 border border-bleach-border text-yellow-400 hover:text-white"}`
  }, "\uD83D\uDC51 ADM M\xE1ximo & Nuvem"), [{
    id: "fichas",
    label: "👥 Fichas dos Players"
  }, {
    id: "tarefas",
    label: "📋 Afazeres & Ganhos de ADM"
  }, {
    id: "ia-arbitro",
    label: "🤖 IA Juíza de Combates"
  }, {
    id: "dados-adm",
    label: "🎲 Mesa de Dados da ADM"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setAbaAdmin(t.id),
    className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${abaAdmin === t.id ? "bg-bleach-orange text-black font-extrabold shadow" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, t.label)))), isMaxAdm && abaAdmin === "maximo" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\u2601\uFE0F Banco de Dados em Nuvem Gratuito (Multi-Dispositivos / Celular)",
    subtitle: "Conecte seu banco de dados em tempo real para que os jogadores consigam logar de qualquer celular ou computador",
    className: "border-2 border-bleach-blue/60 shadow-2xl blue-reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-black/60 border border-bleach-borderSoft rounded-xl text-xs text-bleach-creamDim leading-relaxed space-y-2"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange"
  }, "Como funciona:"), " Ao conectar sua URL do ", /*#__PURE__*/React.createElement("strong", null, "Google Firebase Realtime Database (100% Gratuito)"), ", qualquer ficha criada ou editada pelo ADM \xE9 sincronizada instantaneamente em todos os celulares dos jogadores no mundo inteiro!")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-bleach-cream mb-1"
  }, "URL do seu Firebase Realtime Database (REST API)"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: https://bleach-rpg-seuprojeto-default-rtdb.firebaseio.com",
    value: urlFirebaseInput,
    onChange: e => setUrlFirebaseInput(e.target.value),
    className: "flex-1 bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-2.5 text-xs text-white placeholder-bleach-muted focus:outline-none focus:border-bleach-blue font-mono"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: salvarConfigFirebase,
    className: "px-5 py-2.5 bg-bleach-blue text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-cyan-400"
  }, "Salvar Nuvem")), msgFirebase && /*#__PURE__*/React.createElement("div", {
    className: "text-green-400 text-xs font-bold mt-1.5"
  }, msgFirebase)), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-muted"
  }, "Status Atual: ", /*#__PURE__*/React.createElement("span", {
    className: cloudStatus === "connected" ? "text-green-400 font-bold" : "text-yellow-400 font-bold"
  }, cloudStatus === "connected" ? "🟢 Conectado à Nuvem em Tempo Real" : "🟡 Modo Local / Aguardando URL")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: baixarBackupJson,
    className: "px-3.5 py-1.5 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-xs text-bleach-cream font-bold rounded-lg"
  }, "\uD83D\uDCBE Baixar Backup (JSON)"), /*#__PURE__*/React.createElement("label", {
    className: "px-3.5 py-1.5 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-xs text-bleach-cream font-bold rounded-lg cursor-pointer"
  }, "\uD83D\uDCC2 Restaurar Backup (JSON)", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".json",
    onChange: importarBackupJson,
    className: "hidden"
  })))))), /*#__PURE__*/React.createElement(Section, {
    title: "\uD83D\uDC51 Gest\xE3o de Administradores & Acesso M\xE1ximo",
    subtitle: "Adicione novos Sub-ADMs com login e senha individuais, e gerencie as permiss\xF5es do RPG"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-yellow-950/40 border border-yellow-500/60 rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase px-2 py-0.5 rounded border text-yellow-400 border-yellow-500 bg-yellow-950"
  }, "\uD83D\uDC51 ADM M\xE1ximo (Voc\xEA)"), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-white text-base mt-2"
  }, "Comandante Supremo"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "Acesso total e irrestrito a todos os sistemas e exclus\xE3o de fichas."))), (db.subAdms || []).map(adm => /*#__PURE__*/React.createElement("div", {
    key: adm.id,
    className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase px-2 py-0.5 rounded border text-bleach-orange border-bleach-orange bg-black"
  }, "\uD83D\uDEE1\uFE0F Sub-ADM"), /*#__PURE__*/React.createElement("button", {
    onClick: () => removerSubAdm(adm.id),
    className: "text-red-400 text-xs hover:underline"
  }, "Excluir Acesso")), /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-bleach-cream text-base"
  }, adm.nome), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-muted mt-1"
  }, /*#__PURE__*/React.createElement("span", null, "Usu\xE1rio: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-white font-mono"
  }, adm.usuario)), " \u2022", /*#__PURE__*/React.createElement("span", {
    className: "ml-1"
  }, "Senha: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange font-mono"
  }, adm.senha))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "Cargo: ", adm.cargo))))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/50 border border-bleach-borderSoft p-5 rounded-xl space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "+ Criar Login para Novo Sub-ADM"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nome do Administrador",
    value: novoSubAdm.nome,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      nome: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Usu\xE1rio de Login (Ex: kisuke)",
    value: novoSubAdm.usuario,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      usuario: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white font-mono"
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Senha Individual",
    value: novoSubAdm.senha,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      senha: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Cargo (ex: Juiz de Lutas)",
    value: novoSubAdm.cargo,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      cargo: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("select", {
    value: novoSubAdm.charId,
    onChange: e => setNovoSubAdm({
      ...novoSubAdm,
      charId: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded p-2 text-xs text-white"
  }, (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, "Ficha: ", p.nome)))), /*#__PURE__*/React.createElement("button", {
    onClick: adicionarSubAdm,
    className: "px-5 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg hover:bg-orange-400 shadow"
  }, "Cadastrar Sub-ADM com Login Pr\xF3prio")), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/50 border border-bleach-borderSoft p-5 rounded-xl space-y-3 mt-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-yellow-400"
  }, "\uD83D\uDD11 Alterar Senha Mestra do ADM M\xE1ximo"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 max-w-md"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Nova Senha Mestra",
    value: novaSenhaMax,
    onChange: e => setNovaSenhaMax(e.target.value),
    className: "flex-1 bg-bleach-panel2 border border-bleach-border rounded px-3 py-2 text-xs text-white font-mono"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: alterarSenhaSuperAdmin,
    className: "px-4 py-2 bg-yellow-500 text-black font-bold text-xs uppercase rounded hover:bg-yellow-400"
  }, "Salvar")), msgPass && /*#__PURE__*/React.createElement("div", {
    className: "text-green-400 text-xs"
  }, msgPass)))), abaAdmin === "fichas" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Criar Novo Personagem no Site",
    subtitle: "Cadastre a ficha oficial e gere o login para o jogador"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: criarPersonagem,
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1 font-bold"
  }, "Nome do Personagem *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Kurosaki Ren",
    value: novo.nome,
    onChange: e => setNovo({
      ...novo,
      nome: e.target.value
    }),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1 font-bold"
  }, "WhatsApp do Jogador"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: 11999998888",
    value: novo.whatsapp,
    onChange: e => setNovo({
      ...novo,
      whatsapp: e.target.value
    }),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-[11px] text-bleach-creamDim font-bold"
  }, "C\xF3digo de Acesso (Senha) *"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: gerarCodigoAuto,
    className: "text-[10px] text-bleach-orange hover:underline font-bold"
  }, "\uD83C\uDFB2 Gerar C\xF3digo")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: REN-8921",
    value: novo.codigo,
    onChange: e => setNovo({
      ...novo,
      codigo: e.target.value
    }),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs font-mono text-white"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Faceclaim (Ex: Freya Mavor)",
    value: novo.faceclaim,
    onChange: e => setNovo({
      ...novo,
      faceclaim: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Idade do Personagem",
    value: novo.idadeChar,
    onChange: e => setNovo({
      ...novo,
      idadeChar: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Anivers\xE1rio (dd/mm)",
    value: novo.aniversarioChar,
    onChange: e => setNovo({
      ...novo,
      aniversarioChar: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("select", {
    value: novo.raca,
    onChange: e => setNovo({
      ...novo,
      raca: e.target.value
    }),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Shinigami"
  }, "Shinigami"), /*#__PURE__*/React.createElement("option", {
    value: "Shinigami Ex-Humano"
  }, "Shinigami Ex-Humano"))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-wider rounded-lg py-2.5 hover:brightness-110 shadow"
  }, "+ Criar Ficha & Gerar Login do Jogador")), msgCriacao && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-4 bg-green-950/80 border border-green-500 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-green-300"
  }, "\u2713 Ficha criada com sucesso!"), /*#__PURE__*/React.createElement("div", {
    className: "text-white mt-0.5"
  }, "Personagem: ", /*#__PURE__*/React.createElement("strong", null, msgCriacao.nome), " \u2022 C\xF3digo: ", /*#__PURE__*/React.createElement("strong", {
    className: "font-mono text-bleach-orange"
  }, msgCriacao.codigo))), /*#__PURE__*/React.createElement("button", {
    onClick: () => copiarLoginMsg(msgCriacao),
    className: "px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg shadow uppercase text-xs whitespace-nowrap"
  }, "\uD83D\uDCCB Copiar Mensagem de Login para WhatsApp"))), /*#__PURE__*/React.createElement(Section, {
    title: `Fichas Registradas (${(db.personagens || []).length})`,
    subtitle: "Selecione um jogador para gerenciar ou copiar dados de acesso"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\uD83D\uDD0D Buscar por nome do personagem ou WhatsApp...",
    value: busca,
    onChange: e => setBusca(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-4 py-2.5 text-xs text-white placeholder-bleach-muted focus:outline-none focus:border-bleach-orange"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 gap-3"
  }, filtrados.map(p => {
    const total = Object.values(p.atributos).reduce((a, b) => a + b, 0);
    const tier = getPowerTier(total);
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "bg-bleach-panel2 border border-bleach-borderSoft hover:border-bleach-orange/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 rounded-lg overflow-hidden border border-bleach-border bg-black"
    }, /*#__PURE__*/React.createElement("img", {
      src: p.foto || 'assets/ichigo-orange.png',
      alt: p.nome,
      className: "w-full h-full object-cover",
      onError: e => {
        e.target.src = 'assets/ichigo-orange.png';
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-bleach-cream text-base"
    }, p.nome), /*#__PURE__*/React.createElement(Badge, {
      color: ESTADOS.find(e => e.key === p.estado)?.color || C.green
    }, p.estado), /*#__PURE__*/React.createElement(Badge, {
      color: tier.color
    }, tier.title)), /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-bleach-creamDim flex flex-wrap gap-x-4 gap-y-1 mt-0.5"
    }, /*#__PURE__*/React.createElement("span", null, "WhatsApp: ", /*#__PURE__*/React.createElement("strong", null, maskWhats(p.whatsapp))), /*#__PURE__*/React.createElement("span", null, "C\xF3digo: ", /*#__PURE__*/React.createElement("strong", {
      className: "font-mono text-bleach-orange"
    }, p.codigo)), /*#__PURE__*/React.createElement("span", null, "Shikai: ", /*#__PURE__*/React.createElement("strong", {
      className: p.zanpakuto?.shikaiAtiva ? "text-cyan-400" : "text-bleach-muted"
    }, p.zanpakuto?.shikaiAtiva ? `✓ ${p.zanpakuto.shikaiAtiva.nome}` : p.permissoes?.shikaiLiberada ? "🔓 Liberada p/ Escolha" : "🔒 Bloqueada")), /*#__PURE__*/React.createElement("span", null, "Bankai: ", /*#__PURE__*/React.createElement("strong", {
      className: p.zanpakuto?.bankaiAtiva ? "text-yellow-400" : "text-bleach-muted"
    }, p.zanpakuto?.bankaiAtiva ? `✓ ${p.zanpakuto.bankaiAtiva.nome}` : p.permissoes?.bankaiLiberada ? "🔓 Liberada p/ Escolha" : "🔒 Bloqueada"))))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-bleach-borderSoft"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => copiarLoginMsg(p),
      className: "px-3 py-2 bg-bleach-panel border border-bleach-border hover:border-bleach-orange text-bleach-cream font-bold text-xs uppercase rounded-lg transition",
      title: "Copiar dados de login para mandar no WhatsApp"
    }, "\uD83D\uDCCB Copiar Login"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onAbrirFicha(p.id),
      className: "px-4 py-2 bg-bleach-orange text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:bg-orange-400 transition"
    }, "Gerenciar \u2192"), isMaxAdm && /*#__PURE__*/React.createElement("button", {
      onClick: () => setCharParaDeletar(p),
      className: "px-3 py-2 bg-red-950/60 border border-red-500/50 hover:bg-red-800 text-red-200 font-bold text-xs uppercase rounded-lg transition",
      title: "Apagar Perfil de Jogador"
    }, "\uD83D\uDDD1\uFE0F Apagar")));
  }))), charParaDeletar && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-4xl mb-2"
  }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl text-red-400 tracking-wider mb-2"
  }, "APAGAR PERFIL DE JOGADOR"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-4 leading-relaxed"
  }, "Tem certeza que deseja apagar permanentemente a ficha de ", /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, charParaDeletar.nome), "? Todos os atributos, hist\xF3rico e progresso ser\xE3o apagados definitivamente."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setCharParaDeletar(null),
    className: "flex-1 py-2 bg-bleach-panel2 border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange font-bold uppercase"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: confirmarExclusaoChar,
    className: "flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-xs rounded-lg font-extrabold uppercase shadow"
  }, "Sim, Apagar Ficha"))))), abaAdmin === "tarefas" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Afazeres do ADM & Distribui\xE7\xE3o de Ganhos",
    subtitle: "Registre suas atividades conclu\xEDdas e deposite os pontos direto na sua ficha de personagem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border p-5 rounded-xl space-y-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-orange"
  }, "Registrar Atividade de ADM Conclu\xEDda"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Tipo de Tarefa Realizada"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "cenas",
    onChange: () => setTarefaSelecionada("cenas"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Avaliar Cenas de Arco (90 linhas)"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: +8 Pontos para a ficha do ADM"))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "fichas",
    onChange: () => setTarefaSelecionada("fichas"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Avaliar e Aprovar Fichas (A cada 7 fichas)"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: +3 Pontos a cada 7 fichas aprovadas"), tarefaSelecionada === "fichas" && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-creamDim"
  }, "Contador:"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFichasAvaliadasContador(Math.max(0, fichasAvaliadasContador - 1)),
    className: "w-6 h-6 rounded bg-bleach-panel border text-white font-bold"
  }, "-"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold font-mono text-bleach-orange text-sm"
  }, fichasAvaliadasContador, " / 7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setFichasAvaliadasContador(fichasAvaliadasContador + 1),
    className: "w-6 h-6 rounded bg-bleach-panel border text-white font-bold"
  }, "+")))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "missao",
    onChange: () => setTarefaSelecionada("missao"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Narrar Miss\xE3o Principal"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: Mesma recompensa dos players (+15 pts + 4 Giros + 1 Esp)"))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-2 p-2.5 bg-black border border-bleach-borderSoft rounded-lg cursor-pointer text-xs"
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "tarefa",
    checked: tarefaSelecionada === "juiz",
    onChange: () => setTarefaSelecionada("juiz"),
    className: "accent-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, "Ser Juiz de Combate em ON"), /*#__PURE__*/React.createElement("span", {
    className: "block text-bleach-orange text-[11px] font-mono"
  }, "Ganha: +4 Pontos de participa\xE7\xE3o"))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Nome do ADM"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: admExecutor,
    onChange: e => setAdmExecutor(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded p-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-[11px] text-bleach-creamDim mb-1"
  }, "Ficha de Destino dos Pontos"), /*#__PURE__*/React.createElement("select", {
    value: charAlvoAdm,
    onChange: e => setCharAlvoAdm(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded p-2 text-xs text-white"
  }, (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.nome))))), /*#__PURE__*/React.createElement("button", {
    onClick: registrarAtividadeAdm,
    className: "w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110"
  }, "Confirmar e Depositar Ganhos na Ficha")), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border border-bleach-border p-5 rounded-xl flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-creamDim mb-3"
  }, "Hist\xF3rico de Afazeres Registrados"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 max-h-80 overflow-y-auto pr-1"
  }, (db.registrosTarefasAdm || []).map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "p-3 bg-black/60 border border-bleach-borderSoft rounded-lg text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange"
  }, r.admNome), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, r.data)), /*#__PURE__*/React.createElement("div", {
    className: "text-bleach-creamDim"
  }, r.tarefa))))))))), abaAdmin === "ia-arbitro" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\uD83E\uDD16 IA Ju\xEDza de Combate (\xC1rbitro Neutro de Luta)",
    subtitle: "Utilize quando houver d\xFAvida entre as a\xE7\xF5es dos players para uma an\xE1lise justa por atributos e l\xF3gica de cena"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Combatente 1"), /*#__PURE__*/React.createElement("select", {
    value: iaLutador1,
    onChange: e => setIaLutador1(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.nome
  }, p.nome)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Combatente 2"), /*#__PURE__*/React.createElement("select", {
    value: iaLutador2,
    onChange: e => setIaLutador2(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.nome
  }, p.nome))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Cole aqui as a\xE7\xF5es e texto da cena de ambos os lutadores"), /*#__PURE__*/React.createElement("textarea", {
    rows: 5,
    value: iaCenaTexto,
    onChange: e => setIaCenaTexto(e.target.value),
    placeholder: "Ex: Jogador 1 declarou que usou Shunpo direto pelas costas...",
    className: "w-full bg-black border border-bleach-border rounded-lg p-3 text-xs text-white focus:outline-none focus:border-bleach-orange"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: julgarCombateComIA,
    disabled: iaProcessando,
    className: "px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:brightness-110 disabled:opacity-50"
  }, iaProcessando ? "Analisando cena e calculando velocidades..." : "⚖️ Processar Veredito da IA"), iaResultado && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-5 bg-black/80 border-2 border-bleach-blue rounded-xl space-y-3 blue-reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-title text-xl text-bleach-blue tracking-wider"
  }, "RESULTADO DO JULGAMENTO"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, iaResultado.data)), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-cream leading-relaxed whitespace-pre-line bg-bleach-panel p-4 rounded-lg border border-bleach-borderSoft"
  }, iaResultado.veredito))))), abaAdmin === "dados-adm" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\uD83C\uDFB2 Mesa de Dados da ADM com Tens\xE3o & Drama",
    subtitle: "Rolagens com delay e suspens\xE3o dram\xE1tica vis\xEDveis no mural para todos os jogadores"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Escolha o Tipo de Dado"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, [2, 4, 6, 8, 10, 12, 20, 100].map(d => /*#__PURE__*/React.createElement("button", {
    key: d,
    onClick: () => setDadoTipo(d),
    className: `px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition ${dadoTipo === d ? "bg-bleach-orange text-black border-bleach-orange" : "bg-black text-bleach-creamDim border-bleach-border"}`
  }, "d", d)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-bleach-creamDim mb-1"
  }, "Personagem Alvo da Rolagem"), /*#__PURE__*/React.createElement("select", {
    value: dadoChar,
    onChange: e => setDadoChar(e.target.value),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.nome
  }, p.nome)))), /*#__PURE__*/React.createElement("button", {
    onClick: rolarDadoComTensao,
    disabled: dadoRolando,
    className: "w-full py-3.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-xl hover:brightness-110 disabled:opacity-50 transition"
  }, dadoRolando ? "Concentrando Tensão na Rolagem..." : `🎲 Rolar d${dadoTipo} para ${dadoChar}`)), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-bleach-border rounded-2xl p-6 flex flex-col items-center justify-center text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-28 h-28 rounded-2xl bg-gradient-to-br from-bleach-panel2 to-black border-4 border-bleach-orange flex items-center justify-center text-5xl font-black font-mono text-bleach-cream shadow-2xl transition ${dadoRolando ? "dice-suspense" : "reiatsu-glow"}`
  }, dadoAnimVal), dadoResultado && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-3 bg-bleach-panel2 border border-bleach-border rounded-xl w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] uppercase tracking-wider text-bleach-muted"
  }, "Resultado Final"), /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-sm mt-0.5",
    style: {
      color: dadoResultado.cor
    }
  }, dadoResultado.cat)))), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 pt-4 border-t border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-creamDim mb-2"
  }, "Mural P\xFAblico de Rolagens"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, (db.rolagensDadosPublicas || []).map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "p-2.5 bg-black/50 border border-bleach-borderSoft rounded-lg text-xs flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-cream"
  }, r.personagem), /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-muted"
  }, " (", r.dado, ") : "), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-white font-mono text-sm"
  }, r.resultado), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] ml-2 text-bleach-orange font-semibold"
  }, r.categoria)), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, r.data))))))));
}

// COMPLETE RPG SYSTEMS & MANUAL VIEW (TODOS OS 30 PONTOS OFICIAIS DO SISTEMA)
const CATEGORIAS_SISTEMAS = [{
  id: "todos",
  label: "📋 Todas as 30 Regras"
}, {
  id: "geral",
  label: "📜 Conceito & Power Scaling"
}, {
  id: "racas",
  label: "👤 Raças & Origens"
}, {
  id: "kidos",
  label: "⚡ Kidō & Kaidō"
}, {
  id: "combate",
  label: "⚔️ Combate, Estados & 1d6"
}, {
  id: "treino",
  label: "🏋️ Treinamento & Fadiga"
}, {
  id: "missoes",
  label: "🎯 Missões, Cenas & Gacha"
}, {
  id: "zanpakuto",
  label: "🗡️ Técnicas & Zanpakutō"
}];
const SISTEMAS_DATA = [{
  id: "s1",
  num: 1,
  cat: "geral",
  t: "1. Conceito do Sistema",
  c: `O Bleach RPG é focado principalmente em:
• Narrativa
• Desenvolvimento de personagem
• Combate
• Power scaling
• Evolução gradual

O sistema deve evitar excesso de rolagens. Dados só aparecem quando existe uma dúvida real.

A maior parte dos resultados é determinada pela combinação de:
Atributos + Técnicas + Experiência + Circunstâncias + Narrativa`
}, {
  id: "s2",
  num: 2,
  cat: "racas",
  t: "2. Raças Disponíveis",
  c: `Existem apenas duas opções de raça:

⚔️ SHINIGAMI
Personagem que já pertence à Sociedade das Almas e possui formação como Shinigami.
Pode:
• possuir Zanpakutō;
• aprender Kidō;
• aprender Zanjutsu;
• aprender Hakuda;
• aprender Hohō;
• participar de missões;
• desenvolver técnicas.

👤 SHINIGAMI EX-HUMANO
Personagem que teve uma vida humana antes de se tornar Shinigami.
A origem pode influenciar:
• personalidade;
• memórias;
• relações;
• conhecimentos;
• motivações;
• história pessoal.

Porém:
• Ser Ex-Humano não fornece bônus automático de atributos.
• A origem é principalmente narrativa.`
}, {
  id: "s3",
  num: 3,
  cat: "racas",
  t: "3. Diferença entre as Origens (Tabela Comparativa)",
  c: `Tabela de comparação entre Shinigami Nativo e Shinigami Ex-Humano:

• Origem: Sociedade das Almas vs Mundo Humano
• Vida humana anterior: Não vs Sim
• Atributos: Iguais vs Iguais
• Evolução: Igual vs Igual
• Combate: Igual vs Igual
• Zanpakutō: Sim vs Sim
• Kidō: Formação básica (4 iniciais) vs Precisa aprender narrativamente
• Zanjutsu: Pode aprender vs Pode aprender
• Hakuda: Pode aprender vs Pode aprender
• Hohō: Pode aprender vs Pode aprender`
}, {
  id: "s4",
  num: 4,
  cat: "kidos",
  t: "4. Kidō Inicial & Regras de Cura (Kaidō)",
  c: `Um personagem que já é Shinigami começa com:
4 Kidō Básicos (distribuídos livremente pelo jogador).

Categorias disponíveis:
🔴 HADŌ: Técnicas ofensivas de destruição e ataque.
🔵 BAKUDŌ: Técnicas de contenção, defesa, barreiras e restrição.
🟢 KAIDŌ: Técnicas de cura e tratamento espiritual.

Exemplos de distribuição inicial:
• 2 Hadō + 1 Bakudō + 1 Kaidō
• 4 Hadō
• 2 Bakudō + 2 Kaidō

KAIDŌ (Cura Espiritual):
Kaidō representa técnicas de tratamento e cura espiritual. Pode ser utilizado para tratar ferimentos, estabilizar aliados, aliviar danos e auxiliar na recuperação.
Porém:
• Kaidō NÃO substitui descanso nem recuperação narrativa.
• Ferimentos graves podem exigir técnicas mais avançadas ou tratamento adequado.

EX-HUMANO E KIDŌ:
Um Ex-Humano recém-transformado não recebe automaticamente os 4 Kidō. Ele pode aprender posteriormente através de treinamento, professores, missões, livros, outros Shinigami ou narrativa.
(Se a história justificar treinamento prévio, a administração pode liberar conhecimento inicial).`
}, {
  id: "s5",
  num: 5,
  cat: "geral",
  t: "5. Atributos Fundamentais",
  c: `Existem quatro atributos no sistema:

🔵 PRESSÃO ESPIRITUAL
Representa: Reiatsu, poder espiritual, controle de energia espiritual, percepção espiritual, técnicas espirituais e pressão exercida sobre outros seres.

🔴 FORÇA
Representa: força física, potência dos golpes, Zanjutsu, Hakuda e capacidade física.

🟢 VELOCIDADE
Representa: deslocamento, reflexos, velocidade de ataque, esquiva, Hohō/Shunpo e capacidade de acompanhar adversários.

🟣 RESILIÊNCIA
Representa: resistência física, resistência espiritual, resistência à exaustão, capacidade de suportar ataques e capacidade de continuar lutando.`
}, {
  id: "s6",
  num: 6,
  cat: "geral",
  t: "6. Criação de Atributos (Base 10 + 20 Pontos Livres)",
  c: `Na criação da ficha:
• Todos os atributos começam em: 10
• O jogador recebe: 20 Pontos de Atributo para distribuir livremente.
• Não existe limite inicial.

Exemplo de distribuição:
Pressão Espiritual: 10
Força: 10
Velocidade: 30 (+20 pontos)
Resiliência: 10`
}, {
  id: "s7",
  num: 7,
  cat: "geral",
  t: "7. Regra Fundamental dos Atributos",
  c: `O número da ficha É o atributo.

Não existe:
• conversão;
• multiplicador;
• nível escondido;
• escala secundária.

Se possui:
Velocidade 370 e recebe +1 → Velocidade 371
Recebe +5 → Velocidade 376`
}, {
  id: "s8",
  num: 8,
  cat: "geral",
  t: "8. Power Scaling Oficial (Escala de Patamares)",
  c: `Escala oficial de referência narrativa:

• 1–10: Inexperiente
• 11–30: Iniciante
• 31–60: Treinado
• 61–100: Experiente
• 101–150: Elite
• 151–250: Alto nível
• 251–400: Monstruoso
• 401–600: Lendário
• 601+: Transcendente

Essas classificações são referências narrativas puras para balanço de poder.`
}, {
  id: "s9",
  num: 9,
  cat: "geral",
  t: "9. Diferença entre Atributos (Escala de Vantagem)",
  c: `Quando dois guerreiros confrontam seus atributos diretamente:

• 0–10 de diferença: Equivalentes
• 11–30 de diferença: Pequena vantagem
• 31–75 de diferença: Vantagem clara
• 76–150 de diferença: Grande vantagem
• 151–250 de diferença: Abismo
• 251+ de diferença: Diferença monstruosa

Quanto maior a diferença, mais difícil é superar a inferioridade através de técnica ou estratégia pura.`
}, {
  id: "s10",
  num: 10,
  cat: "combate",
  t: "10. Dinâmica de Combate",
  c: `O combate não possui rolagem para cada ação. O processo segue três etapas:

1. INTENÇÃO: O jogador declara o que pretende fazer em cena.
2. COMPARAÇÃO: O narrador compara os atributos relevantes e técnicas envolvidas.
3. CONSEQUÊNCIA: O narrador determina o resultado narrativo do choque.

Se existir uma dúvida real sobre o desfecho: rola-se 1d6.`
}, {
  id: "s11",
  num: 11,
  cat: "combate",
  t: "11. O Dado de Decisão (1d6)",
  c: `Quando há incerteza real na cena, utiliza-se exclusivamente o 1d6:

• 1–2: Falha
• 3–4: Sucesso parcial (com custo ou revés)
• 5–6: Sucesso pleno

Uma única rolagem deve resolver a situação, preservando a fluidez da narrativa.`
}, {
  id: "s12",
  num: 12,
  cat: "combate",
  t: "12. Estados de Combate (Sem HP Tradicional)",
  c: `Não existe HP numérico tradicional. O personagem transita por quatro estados:

🟢 INTEIRO: Condição física e espiritual normal.
🟡 FERIDO: Danos começam a afetar seu desempenho.
🟠 DEBILITADO: Gravemente prejudicado e exausto.
🔴 DERROTADO: Não consegue continuar lutando (incapacitado).

A mudança de estado depende da situação, atributos, técnicas e narrativa.`
}, {
  id: "s13",
  num: 13,
  cat: "combate",
  t: "13. Confronto de Pressão Espiritual (Reiatsu Clash)",
  c: `Quando dois personagens liberam Reiatsu, compara-se a Pressão Espiritual:

• 0–10 de diferença: Diferença insignificante.
• 11–30 de diferença: Presença claramente superior.
• 31–75 de diferença: Pressão intimidante.
• 76–150 de diferença: Grande dificuldade para o lutador inferior.
• 151–250 de diferença: Abismo espiritual.
• 251+ de diferença: Presença monstruosamente superior.

Isso não significa vitória automática, mas dita a atmosfera e a facilidade de conjuração de Kidōs e técnicas.`
}, {
  id: "s14",
  num: 14,
  cat: "combate",
  t: "14. Especialidades Técnicas",
  c: `Personagens podem desenvolver especialidades como:
• Zanjutsu (Esgrima de Zanpakutō)
• Hakuda (Combate corpo a corpo)
• Hohō (Shunpo e passos rápidos)
• Kidō (Feitiçaria espiritual)
• Reiatsu (Controle e emanação de aura)
• Percepção (Sensoriamento espiritual)
• Estratégia (Tática e análise em batalha)
• Combate à distância

Especialidades representam domínio técnico. Elas não aumentam automaticamente os números dos atributos, mas expandem as possibilidades narrativas.`
}, {
  id: "s15",
  num: 15,
  cat: "treino",
  t: "15. Treinamento em OFF (3 Períodos Diários)",
  c: `Treinos são realizados em: OFF.

Cada personagem pode realizar no máximo 3 períodos de treino por dia:
• 1º período: Manhã
• 2º período: Manhã → Tarde
• 3º período: Manhã → Noite`
}, {
  id: "s16",
  num: 16,
  cat: "treino",
  t: "16. Recompensa de Treino (0–3 Pontos / Máx 9 pts/dia)",
  c: `Cada período de treino pode conceder: 0–3 Pontos de Atributo.

Avaliação do Treino:
• Treino fraco: 0–1 ponto
• Treino adequado: 1–2 pontos
• Treino excelente: 2–3 pontos

Máximo normal por dia:
9 Pontos de Atributo (exige três treinamentos excelentes).

A intenção é impedir evolução absurda em poucos dias e valorizar a consistência.`
}, {
  id: "s17",
  num: 17,
  cat: "treino",
  t: "17. Distribuição do Treino",
  c: `O jogador pode focar um atributo:
• Treino de Velocidade → todos os pontos em Velocidade.

Ou dividir entre atributos:
• Força + Velocidade

O administrador determina a distribuição conforme o conteúdo da cena.
Exemplo: +2 Força e +1 Velocidade.
Quanto mais atributos forem treinados simultaneamente, mais dividida será a recompensa.`
}, {
  id: "s18",
  num: 18,
  cat: "treino",
  t: "18. Sistema de Fadiga",
  c: `Treinar gera desgaste físico e espiritual:

• 1 TREINO: Nenhuma redução obrigatória. Pode participar normalmente das atividades.
• 2 TREINOS: −5% temporário nos atributos diretamente treinados.
• 3 TREINOS: −15% temporário nos atributos diretamente treinados.
  Além disso: Não pode participar de Miscelâneas com recompensa naquele dia.`
}, {
  id: "s19",
  num: 19,
  cat: "treino",
  t: "19. Fadiga em Missões ON",
  c: `Missões são realizadas em: ON.
Uma missão pode acontecer mesmo depois de o personagem ter treinado. Se for necessário participar, o personagem participa, porém entra cansado:

• Após 1 treino: Sem penalidade obrigatória.
• Após 2 treinos: −5% nos atributos treinados.
• Após 3 treinos: −15% nos atributos treinados.`
}, {
  id: "s20",
  num: 20,
  cat: "treino",
  t: "20. Fadiga Não é Perda Permanente",
  c: `A fadiga é uma redução momentânea de prontidão de combate.

Exemplo:
• Velocidade na ficha: 100
• Após treinamento intenso (3 treinos): Velocidade efetiva durante a missão = 85.
• A ficha continua: Velocidade 100.
• Depois de descansar: 100 novamente.

Nenhum ponto é perdido da ficha.`
}, {
  id: "s21",
  num: 21,
  cat: "treino",
  t: "21. Descanso (Recuperação Diária)",
  c: `Em condições normais:
Um novo dia remove completamente a fadiga acumulada do dia anterior.`
}, {
  id: "s22",
  num: 22,
  cat: "missoes",
  t: "22. Missões em ON (Recompensas)",
  c: `Missões são cenas em ON com objetivos claros.

Recompensas conforme a escala:
• Missão simples: 1–2 pontos
• Missão normal: 2–4 pontos
• Missão importante: 3–6 pontos
• Missão excepcional: 5–8 pontos

A recompensa considera: dificuldade, risco, importância, interpretação, participação e impacto narrativo.`
}, {
  id: "s23",
  num: 23,
  cat: "missoes",
  t: "23. Miscelâneas em ON (Cenas Narrativas)",
  c: `São cenas ON focadas em narrativa, interpretação e cotidiano.
Exemplos: conversas, relações, investigação, exploração, rotina, interação com NPCs e desenvolvimento pessoal.

Recompensas:
• Cena simples: 0–1 ponto
• Cena relevante: 1–2 pontos
• Cena excepcional: 2–3 pontos

Atenção: Quem realizou 3 treinos no dia NÃO recebe recompensa de Miscelânea naquele dia.`
}, {
  id: "s24",
  num: 24,
  cat: "missoes",
  t: "24. Cenas de Arco (90 Linhas / Clímax)",
  c: `Cenas de Arco envolvem momentos decisivos na trajetória do personagem (mínimo de 90 linhas):

• Cena comum: 1–3 pontos
• Cena importante: 2–4 pontos
• Cena decisiva: 4–6 pontos

Também podem desbloquear:
• novas técnicas;
• informações cruciais;
• relações e alianças;
• desenvolvimento e diálogo com a Zanpakutō;
• novos objetivos de vida.`
}, {
  id: "s25",
  num: 25,
  cat: "missoes",
  t: "25. Combates em ON (Recompensas)",
  c: `Recompensas por lutas realizadas em ON:

• Combate menor: 1–2 pontos
• Combate relevante: 2–4 pontos
• Combate importante: 3–6 pontos

A recompensa não depende simplesmente da vitória: a qualidade da narrativa e superação são valorizadas.`
}, {
  id: "s26",
  num: 26,
  cat: "missoes",
  t: "26. Recompensas Aleatórias / Gacha Extra",
  c: `🎲 Recompensa Extra (Opcional e Não Garantida):
Pode aparecer após missões, combates, cenas importantes, treinos excepcionais, descobertas e marcos narrativos.

Categorias:
⚪ Comum: +1–3 atributos ou pequena recompensa narrativa.
🟢 Incomum: +3–6 atributos, técnica, feitiço ou item.
🔵 Rara: +5–10 atributos ou grande oportunidade.
🟣 Épica: +8–15 atributos ou grande evolução espiritual.
🟡 Lendária: Recompensa excepcional capaz de alterar significativamente o caminho do personagem (como a Missão Narrativa Individual de Despertar).

A recompensa também pode ser: técnica, feitiço, item, conhecimento, contato, treinamento especial ou desenvolvimento da Zanpakutō.`
}, {
  id: "s27",
  num: 27,
  cat: "missoes",
  t: "27. Bônus de Participação Semanal",
  c: `Jogadores muito ativos podem receber, ao final de uma semana de consistência:
+2–3 Pontos de Atributo.

O bônus existe para recompensar a constância na comunidade, mantendo-se moderado para preservar o power scaling.`
}, {
  id: "s28",
  num: 28,
  cat: "zanpakuto",
  t: "28. Estrutura Obrigatória de Técnicas",
  c: `Personagens podem aprender técnicas existentes, desenvolver técnicas próprias, modificar e aperfeiçoar habilidades.

Toda técnica cadastrada na ficha deve conter obrigatoriamente:
1. Nome
2. Categoria (Hadō, Bakudō, Kaidō, Zanjutsu, Hakuda, Hohō, Outro)
3. Conceito
4. Efeito
5. Requisitos
6. Limitações`
}, {
  id: "s29",
  num: 29,
  cat: "zanpakuto",
  t: "29. Evolução Narrativa da Zanpakutō",
  c: `A Zanpakutō evolui estritamente através da narrativa e comunhão de almas:

Possíveis marcos:
• descoberta do espírito interior;
• descoberta do nome verdadeiro;
• liberação inicial (Shikai);
• novas propriedades e técnicas de lâmina;
• evolução e aprofundamento do Shikai;
• liberação suprema (Bankai).

Esses poderes não precisam simplesmente ser comprados com atributos: devem ser conquistados na história!`
}, {
  id: "s30",
  num: 30,
  cat: "geral",
  t: "30. Filosofia Geral do Sistema (Os 4 Princípios)",
  c: `O Bleach RPG segue quatro princípios fundamentais:

1. Números determinam a escala.
2. Técnicas determinam como o poder é utilizado.
3. Narrativa determina o contexto.
4. Dados só aparecem quando existe incerteza real.

E na evolução contínua:
• Treinar mais = mais progresso.
• Treinar demais = mais fadiga.
• Missões não esperam o personagem estar descansado.
• Narrativa também gera evolução.
• Sorte pode trazer recompensas extraordinárias.
• A evolução deve ser lenta e gradual o suficiente para preservar o power scaling.`
}];
function SistemasView() {
  const [catAtiva, setCatAtiva] = useState("todos");
  const [aberto, setAberto] = useState(0);
  const [busca, setBusca] = useState("");
  const filtrados = SISTEMAS_DATA.filter(s => {
    const matchesCat = catAtiva === "todos" || s.cat === catAtiva;
    const matchesBusca = s.t.toLowerCase().includes(busca.toLowerCase()) || s.c.toLowerCase().includes(busca.toLowerCase());
    return matchesCat && matchesBusca;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-2xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Regulamento Oficial da Sociedade das Almas"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "MANUAL OFICIAL DO SISTEMA"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Consulte todas as ", /*#__PURE__*/React.createElement("strong", null, "30 regras fundamentais"), ": Ra\xE7as, Atributos, Power Scaling Oficial, Combate Narrativo com 1d6, Treinos em OFF (3 per\xEDodos), Sistema de Fadiga, Miss\xF5es, Kid\u014D e Evolu\xE7\xE3o Narrativa da Zanpakut\u014D."))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 overflow-x-auto pb-2 border-b border-bleach-borderSoft"
  }, CATEGORIAS_SISTEMAS.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    type: "button",
    onClick: () => {
      setCatAtiva(c.id);
      setAberto(0);
    },
    className: `px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${catAtiva === c.id ? "bg-bleach-orange text-black font-extrabold shadow-[0_0_15px_rgba(255,106,19,0.3)]" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white hover:border-bleach-border/80"}`
  }, c.label))), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\uD83D\uDD0D Pesquisar em todas as 30 regras (ex: fadiga, 1d6, kaid\u014D, patamar, 90 linhas)...",
    value: busca,
    onChange: e => setBusca(e.target.value),
    className: "w-full bg-bleach-panel border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-3 text-sm text-white placeholder-bleach-muted outline-none shadow-lg transition"
  }), busca && /*#__PURE__*/React.createElement("button", {
    onClick: () => setBusca(""),
    className: "absolute right-3.5 top-3.5 text-xs text-bleach-muted hover:text-white"
  }, "\u2715 Limpar")), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-xs text-bleach-muted px-1"
  }, /*#__PURE__*/React.createElement("span", null, "Exibindo ", /*#__PURE__*/React.createElement("strong", null, filtrados.length), " de 30 regras"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAberto(aberto === -999 ? 0 : -999),
    className: "hover:text-bleach-orange transition text-[11px]"
  }, aberto === -999 ? "▶ Expandir Primeiro" : "▼ Recolher Todos")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, filtrados.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border border-bleach-border rounded-xl p-8 text-center text-bleach-muted text-xs"
  }, "Nenhuma regra encontrada para a pesquisa \"", busca, "\".") : filtrados.map((s, idx) => {
    const isOpen = aberto === idx || aberto === -9999;
    return /*#__PURE__*/React.createElement("div", {
      key: s.id,
      className: "bg-bleach-panel border border-bleach-border hover:border-bleach-border/80 rounded-xl overflow-hidden shadow-lg transition"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => setAberto(aberto === idx ? -1 : idx),
      className: "w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-title text-lg tracking-wider uppercase text-bleach-cream hover:text-bleach-orange transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center font-mono font-black text-xs text-bleach-orange"
    }, "#", s.num), /*#__PURE__*/React.createElement("span", null, s.t)), /*#__PURE__*/React.createElement("span", {
      className: "text-bleach-orange text-xl font-bold font-mono"
    }, isOpen ? "−" : "+")), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "px-5 pb-5 pt-3 text-xs sm:text-sm text-bleach-creamDim leading-relaxed border-t border-bleach-borderSoft/60 whitespace-pre-line bg-black/30 font-sans"
    }, s.c));
  })));
}

// RENDER APPLICATION
const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render( /*#__PURE__*/React.createElement(App, null));