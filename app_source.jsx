
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

const MASTER_ZANPAKUTO_CATALOG = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  }
];
const CATALOGO_KIDOS = [
  {
    "id": "b1_u",
    "numero": 1,
    "nome": "Bakudō #1 — Kusari no Yume (Correntes do Sonho)",
    "cat": "Bakudō",
    "custoReiatsu": 2,
    "nivel": "Básico",
    "desc": "Cria correntes espirituais que se enrolam ao redor dos membros do alvo, dificultando seus movimentos.",
    "incant": "Do vazio desperte, corrente que não conhece fuga. Envolva o alvo e silencie seus passos."
  },
  {
    "id": "b1_c",
    "numero": 1,
    "nome": "Bakudō #1 — Sai (Obstrução)",
    "cat": "Bakudō",
    "custoReiatsu": 2,
    "nivel": "Básico",
    "desc": "Prende os braços do alvo atrás das costas com uma força magnética invisível.",
    "incant": "—"
  },
  {
    "id": "b2",
    "numero": 2,
    "nome": "Bakudō #2 — Shizukesa (Silêncio)",
    "cat": "Bakudō",
    "custoReiatsu": 2,
    "nivel": "Básico",
    "desc": "Cria uma pequena área onde sons são fortemente abafados, impedindo escuta e comunicação.",
    "incant": "Que a voz desapareça, que o som se perca, que o silêncio ocupe este espaço."
  },
  {
    "id": "b3",
    "numero": 3,
    "nome": "Bakudō #3 — Kōri no Kusari (Correntes de Gelo)",
    "cat": "Bakudō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Forma correntes espirituais rígidas de frio gélido que prendem os membros do alvo.",
    "incant": "Frio que nasce da alma, cristalize o caminho daquele que diante de mim permanece."
  },
  {
    "id": "b4_u",
    "numero": 4,
    "nome": "Bakudō #4 — Kabe (Muralha)",
    "cat": "Bakudō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Cria uma barreira espiritual frontal capaz de bloquear ataques físicos e feitiços leves.",
    "incant": "Terra sem forma, céu sem fim. Erga-se diante de mim e torne-se barreira."
  },
  {
    "id": "b4_c",
    "numero": 4,
    "nome": "Bakudō #4 — Hainawa (Corda de Rastejamento)",
    "cat": "Bakudō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Gera uma corda de energia crepitante amarela que amarra o corpo e os pulsos do oponente.",
    "incant": "—"
  },
  {
    "id": "b5",
    "numero": 5,
    "nome": "Bakudō #5 — Meikyū (Labirinto)",
    "cat": "Bakudō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Distorce a percepção espacial do alvo, dificultando sua orientação e senso de direção.",
    "incant": "Caminho se torne caminho nenhum. Direção se perca. Prenda o viajante em seu próprio passo."
  },
  {
    "id": "b6",
    "numero": 6,
    "nome": "Bakudō #6 — Hikari Ito (Fios de Luz)",
    "cat": "Bakudō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Cria fios luminosos no ar que podem prender objetos em queda, projéteis ou membros do alvo.",
    "incant": "Mil fios atravessam o espaço. Prendam aquilo que minha visão alcançar."
  },
  {
    "id": "b7",
    "numero": 7,
    "nome": "Bakudō #7 — Kekkai (Barreira Circular)",
    "cat": "Bakudō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Forma uma barreira circular curta ao redor do usuário para amortecer investidas corpo a corpo.",
    "incant": "Entre mim e o perigo, estabeleça-se a fronteira."
  },
  {
    "id": "b8_u",
    "numero": 8,
    "nome": "Bakudō #8 — Kagebari (Agulhas da Sombra)",
    "cat": "Bakudō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Cria pequenas estacas espirituais que prendem temporariamente o alvo ao chão ou a uma superfície.",
    "incant": "Sombra que acompanha todo ser, transforme-se em agulha e fixe aquilo que ela toca."
  },
  {
    "id": "b8_c",
    "numero": 8,
    "nome": "Bakudō #8 — Seki (Repulsão)",
    "cat": "Bakudō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Cria um escudo redondo e brilhante no antebraço que repele projéteis e atordoa o atacante.",
    "incant": "—"
  },
  {
    "id": "b9",
    "numero": 9,
    "nome": "Bakudō #9 — Fūsa (Selamento Articular)",
    "cat": "Bakudō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Cria uma marca espiritual que dificulta e trava determinado movimento ou postura do alvo.",
    "incant": "Feche a passagem, cerre o caminho, faça do movimento uma lembrança."
  },
  {
    "id": "b10",
    "numero": 10,
    "nome": "Bakudō #10 — Hagane Ori (Gaiola de Aço)",
    "cat": "Bakudō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Cria uma gaiola espiritual cúbica de barras de energia densa ao redor de um alvo.",
    "incant": "Quatro lados, quatro limites. Ergam-se e aprisionem aquilo que está dentro."
  },
  {
    "id": "b11",
    "numero": 11,
    "nome": "Bakudō #11 — Kōsen (Linha de Luz)",
    "cat": "Bakudō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Cria uma linha espiritual luminosa que funciona como uma barreira linear intransponível.",
    "incant": "Uma linha separa o mundo. Que ninguém atravesse sua fronteira."
  },
  {
    "id": "b12",
    "numero": 12,
    "nome": "Bakudō #12 — Jūryoku (Peso Gravitacional)",
    "cat": "Bakudō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Aumenta temporariamente a pressão espiritual sobre um alvo, tornando seus movimentos mais pesados.",
    "incant": "O céu desça, a terra se levante. Faça o corpo lembrar o peso de existir."
  },
  {
    "id": "b13",
    "numero": 13,
    "nome": "Bakudō #13 — Mizu Kagami (Espelho d'Água)",
    "cat": "Bakudō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Cria uma superfície espiritual translúcida capaz de refletir imagens, movimentos e feitiços leves.",
    "incant": "Água que não corre, superfície que não quebra. Mostre aquilo que diante de ti permanece."
  },
  {
    "id": "b14",
    "numero": 14,
    "nome": "Bakudō #14 — Tōmei Kabe (Muralha Transparente)",
    "cat": "Bakudō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Cria uma barreira completamente invisível que surpreende atacantes em alta velocidade.",
    "incant": "Aquilo que os olhos não encontram ainda pode permanecer de pé. Erga-se."
  },
  {
    "id": "b15",
    "numero": 15,
    "nome": "Bakudō #15 — Shibari no Kage (Prisão da Sombra)",
    "cat": "Bakudō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Prende parcialmente o alvo à própria sombra, impedindo saltos e translocações por Shunpo.",
    "incant": "A sombra nasce dos pés e retorna aos pés. Que nenhuma distância seja suficiente para escapar."
  },
  {
    "id": "b16",
    "numero": 16,
    "nome": "Bakudō #16 — Rasen Kusari (Corrente Espiral)",
    "cat": "Bakudō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Uma corrente espiritual gira ao redor do alvo e restringe progressivamente seus movimentos.",
    "incant": "Gire, envolva, aperte. Quanto mais o prisioneiro luta, mais próximo fica o círculo."
  },
  {
    "id": "b17",
    "numero": 17,
    "nome": "Bakudō #17 — Hakujō (Manto Branco)",
    "cat": "Bakudō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Forma uma camada espiritual protetora e amortecedora sobre o corpo do usuário ou de um aliado.",
    "incant": "Cubra aquilo que desejo proteger. Torne-se abrigo contra o impacto."
  },
  {
    "id": "b18",
    "numero": 18,
    "nome": "Bakudō #18 — Tenmon (Portão Celestial)",
    "cat": "Bakudō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Cria uma barreira seletiva que permite apenas a passagem de pessoas autorizadas pelo conjurador.",
    "incant": "Entre dois mundos existe uma porta. Que ela se abra apenas diante daquele que reconheço."
  },
  {
    "id": "b19",
    "numero": 19,
    "nome": "Bakudō #19 — Metsubō no Ori (Gaiola da Ruína)",
    "cat": "Bakudō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Cria várias camadas de barreiras prismáticas concêntricas ao redor de um alvo em fuga.",
    "incant": "Círculo sobre círculo, parede sobre parede. Fechem-se sobre aquele que ousa permanecer."
  },
  {
    "id": "b20",
    "numero": 20,
    "nome": "Bakudō #20 — Hyakuren Kekkai (Barreira das Cem Camadas)",
    "cat": "Bakudō",
    "custoReiatsu": 8,
    "nivel": "Intermediário",
    "desc": "Forma múltiplas camadas de barreiras espirituais sobrepostas para absorver impactos devastadores.",
    "incant": "Que cada camada seja uma muralha, que cada muralha seja uma promessa. Ergam-se e resistam."
  },
  {
    "id": "b26",
    "numero": 26,
    "nome": "Bakudō #26 — Kyokkō (Luz Curvada)",
    "cat": "Bakudō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Dobra a luz e a percepção de Reiatsu ao redor do usuário, tornando-o completamente invisível.",
    "incant": "—"
  },
  {
    "id": "b39",
    "numero": 39,
    "nome": "Bakudō #39 — Enkōsen (Escudo Giratório de Lótus)",
    "cat": "Bakudō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Cria um escudo condensado de energia rotatória para absorver ataques diretos e projéteis.",
    "incant": "—"
  },
  {
    "id": "b61",
    "numero": 61,
    "nome": "Bakudō #61 — Rikujō Kōrō (Prisão das Seis Varas de Luz)",
    "cat": "Bakudō",
    "custoReiatsu": 12,
    "nivel": "Avançado",
    "desc": "Seis lâminas reluzentes de luz dourada perfuram a cintura do alvo, paralisando-o totalmente.",
    "incant": "Carruagem do trovão, ponte da roda giratória, com a luz dividida em seis!"
  },
  {
    "id": "b62",
    "numero": 62,
    "nome": "Bakudō #62 — Hyapporankan (Cem Estacas de Luz)",
    "cat": "Bakudō",
    "custoReiatsu": 13,
    "nivel": "Avançado",
    "desc": "Uma vara de luz se multiplica em uma centena de estacas lançadas para cravar o oponente no chão.",
    "incant": "—"
  },
  {
    "id": "b75",
    "numero": 75,
    "nome": "Bakudō #75 — Gochūtekkan (Cinco Pilares de Ferro)",
    "cat": "Bakudō",
    "custoReiatsu": 16,
    "nivel": "Mestre",
    "desc": "Invoca cinco gigantescos pilares de ferro conectados por correntes que esmagam e selam o alvo.",
    "incant": "Muralha de areia de ferro, torre de monge, lâmpada de ferro incandescente!"
  },
  {
    "id": "b81",
    "numero": 81,
    "nome": "Bakudō #81 — Dankū (Fenda de Ar)",
    "cat": "Bakudō",
    "custoReiatsu": 18,
    "nivel": "Mestre",
    "desc": "Ergue uma barreira translúcida gigantesca que anula completamente qualquer Hadō até o #89.",
    "incant": "—"
  },
  {
    "id": "b99",
    "numero": 99,
    "nome": "Bakudō #99 — Kin / Bankin (Grande Selamento)",
    "cat": "Bakudō",
    "custoReiatsu": 25,
    "nivel": "Classe Especial",
    "desc": "O selamento supremo em três canções: ataduras espirituais, estacas de aço e bloco monumental.",
    "incant": "Primeira Canção: Shiryū! Segunda Canção: Hyakurenzan! Canção Final: Bankin Taihō!"
  },
  {
    "id": "h1_u",
    "numero": 1,
    "nome": "Hadō #1 — Hibana (Faísca)",
    "cat": "Hadō",
    "custoReiatsu": 2,
    "nivel": "Básico",
    "desc": "Dispara uma pequena explosão concentrada de energia espiritual a partir da ponta dos dedos.",
    "incant": "Pequena chama, desperte em minha mão."
  },
  {
    "id": "h1_c",
    "numero": 1,
    "nome": "Hadō #1 — Shō (Empurrão Cinético)",
    "cat": "Hadō",
    "custoReiatsu": 2,
    "nivel": "Básico",
    "desc": "Dispara uma força cinética invisível a partir da ponta do dedo para repelir alvos e projéteis.",
    "incant": "—"
  },
  {
    "id": "h2",
    "numero": 2,
    "nome": "Hadō #2 — Rekka (Lâmina Flamejante)",
    "cat": "Hadō",
    "custoReiatsu": 2,
    "nivel": "Básico",
    "desc": "Projeta uma lâmina de energia flamejante que corta o ar em média distância.",
    "incant": "Chama comprimida, torne-se lâmina e atravesse o caminho."
  },
  {
    "id": "h3",
    "numero": 3,
    "nome": "Hadō #3 — Shōgekiha (Onda de Impacto)",
    "cat": "Hadō",
    "custoReiatsu": 2,
    "nivel": "Básico",
    "desc": "Dispara uma onda curta de pressão espiritual de impacto contundente.",
    "incant": "Espírito acumulado, transforme-se em força. Avance."
  },
  {
    "id": "h4_u",
    "numero": 4,
    "nome": "Hadō #4 — Raikō (Luz Trovejante)",
    "cat": "Hadō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Dispara um feixe concentrado de energia elétrica que viaja em linha reta.",
    "incant": "Céu silencioso, rasgue o horizonte com sua luz."
  },
  {
    "id": "h4_c",
    "numero": 4,
    "nome": "Hadō #4 — Byakurai (Raio Branco)",
    "cat": "Hadō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Dispara um raio concentrado de eletricidade branca perfurante a partir do dedo indicador.",
    "incant": "—"
  },
  {
    "id": "h5",
    "numero": 5,
    "nome": "Hadō #5 — Kazan (Vulcão)",
    "cat": "Hadō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Projeta uma erupção de energia térmica para cima a partir do solo sob o alvo.",
    "incant": "Sob a terra existe fogo. Rompa o silêncio e desperte."
  },
  {
    "id": "h6",
    "numero": 6,
    "nome": "Hadō #6 — Getsumen (Crescente Lunar)",
    "cat": "Hadō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Dispara uma lâmina curva de energia espiritual em formato de foice lunar.",
    "incant": "Lua partida, desenha teu arco e corta o caminho diante de mim."
  },
  {
    "id": "h7",
    "numero": 7,
    "nome": "Hadō #7 — Enkō (Arco Flamejante)",
    "cat": "Hadō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Cria uma rajada curva de energia flamejante que contorna obstáculos.",
    "incant": "Fogo que dança no ar, siga meu gesto e avance."
  },
  {
    "id": "h8",
    "numero": 8,
    "nome": "Hadō #8 — Retsufū (Vento Violento)",
    "cat": "Hadō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Dispara uma rajada de vento espiritual comprimido capaz de arremessar adversários.",
    "incant": "Ar que dorme, desperte. Céu que observa, desça."
  },
  {
    "id": "h9",
    "numero": 9,
    "nome": "Hadō #9 — Raimei Sen (Linha do Trovão)",
    "cat": "Hadō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Dispara uma linha instantânea e extremamente rápida de energia elétrica perfurante.",
    "incant": "Entre céu e terra existe apenas um instante. Atravesse-o."
  },
  {
    "id": "h10",
    "numero": 10,
    "nome": "Hadō #10 — Gekka (Flor Lunar)",
    "cat": "Hadō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Cria vários projéteis espirituais que se espalham como pétalas cortantes no ar.",
    "incant": "Abra suas pétalas na escuridão e faça a noite florescer."
  },
  {
    "id": "h11_u",
    "numero": 11,
    "nome": "Hadō #11 — Enjin (Lâmina de Fogo)",
    "cat": "Hadō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Reveste uma arma ou membro com energia flamejante de alto poder de incineração.",
    "incant": "Fogo que não precisa de combustível, transforme minha intenção em corte."
  },
  {
    "id": "h11_c",
    "numero": 11,
    "nome": "Hadō #11 — Tsuzuri Raiden (Raio Conduzido)",
    "cat": "Hadō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Canaliza uma corrente elétrica através de qualquer objeto condutor ou lâmina de Zanpakutō.",
    "incant": "—"
  },
  {
    "id": "h12",
    "numero": 12,
    "nome": "Hadō #12 — Shōten (Ascensão)",
    "cat": "Hadō",
    "custoReiatsu": 5,
    "nivel": "Intermediário",
    "desc": "Libera uma coluna vertical colossal de energia espiritual que eleva e quebra o solo.",
    "incant": "Suba, energia que dorme abaixo do mundo."
  },
  {
    "id": "h13",
    "numero": 13,
    "nome": "Hadō #13 — Kōha (Onda Carmesim)",
    "cat": "Hadō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Projeta uma maré maciça de energia espiritual vermelha em cone frontal.",
    "incant": "Vermelho que nasce do espírito, avance como maré."
  },
  {
    "id": "h14",
    "numero": 14,
    "nome": "Hadō #14 — Rasenka (Flor Espiral)",
    "cat": "Hadō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Dispara um projétil espiral perfurante de energia concentrada em rotação.",
    "incant": "Gire, comprima, floresça. Transforme o caos em uma única direção."
  },
  {
    "id": "h15",
    "numero": 15,
    "nome": "Hadō #15 — Hōkō (Rugido Espiritual)",
    "cat": "Hadō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Libera uma poderosa onda sonora e espiritual que atordoa e repele múltiplos atacantes.",
    "incant": "Que minha voz atravesse o céu. Que meu espírito responda com força."
  },
  {
    "id": "h16",
    "numero": 16,
    "nome": "Hadō #16 — Kagerō (Calor Distorcido)",
    "cat": "Hadō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Cria uma onda de calor espiritual que distorce a visão e queima o ar ao redor do oponente.",
    "incant": "Ardance o horizonte. Faça o espaço tremer diante do calor."
  },
  {
    "id": "h17",
    "numero": 17,
    "nome": "Hadō #17 — Shakunetsu (Incandescência)",
    "cat": "Hadō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Concentra energia espiritual em uma esfera incandescente que explode em estilhaços de calor.",
    "incant": "Consuma o frio, ilumine a noite, transforme energia em chama."
  },
  {
    "id": "h18",
    "numero": 18,
    "nome": "Hadō #18 — Tenrai (Trovão Celestial)",
    "cat": "Hadō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Invoca um raio espiritual denso que cai dos céus sobre a coordenada do alvo.",
    "incant": "Céu acima de mim, terra abaixo de mim. Entre ambos, faça nascer o trovão."
  },
  {
    "id": "h19",
    "numero": 19,
    "nome": "Hadō #19 — Ryūka (Dragão de Fogo)",
    "cat": "Hadō",
    "custoReiatsu": 8,
    "nivel": "Intermediário",
    "desc": "Cria uma grande massa de fogo espiritual com formato serpentino que persegue o oponente.",
    "incant": "Chama sem forma, encontre um corpo. Céu sem voz, encontre um rugido."
  },
  {
    "id": "h20",
    "numero": 20,
    "nome": "Hadō #20 — Kōten (Explosão Celeste)",
    "cat": "Hadō",
    "custoReiatsu": 8,
    "nivel": "Intermediário",
    "desc": "Concentra uma grande quantidade de energia espiritual em um ponto e libera uma detonação esférica.",
    "incant": "Todo poder converge para um único ponto. Céu e terra, testemunhem o impacto."
  },
  {
    "id": "h31",
    "numero": 31,
    "nome": "Hadō #31 — Shakkahō (Tiro de Fogo Vermelho)",
    "cat": "Hadō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Gera e dispara uma esfera de chamas vermelhas de alta potência e raio explosivo.",
    "incant": "Ó, praticante! Dispersai-vos, rastejai! Queimai a terra e tragai a cinza!"
  },
  {
    "id": "h33",
    "numero": 33,
    "nome": "Hadō #33 — Sōkatsui (Chuva Azul do Vazio)",
    "cat": "Hadō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Dispara uma torrente avassaladora de energia espiritual azul a partir da palma aberta.",
    "incant": "Ó, governante! Máscara de carne e sangue, toda a criação, o bater de asas..."
  },
  {
    "id": "h54",
    "numero": 54,
    "nome": "Hadō #54 — Haien (Chamas da Abolição)",
    "cat": "Hadō",
    "custoReiatsu": 10,
    "nivel": "Avançado",
    "desc": "Dispara uma onda de fogo roxo que incinera e desintegra a matéria ao menor contato.",
    "incant": "—"
  },
  {
    "id": "h63",
    "numero": 63,
    "nome": "Hadō #63 — Raikōhō (Canhão do Trovão)",
    "cat": "Hadō",
    "custoReiatsu": 13,
    "nivel": "Avançado",
    "desc": "Invoca um gigantesco trovão amarelo concentrado que explode com estrondo sísmico.",
    "incant": "Salpicado nos ossos da besta! Torre afiada, cristal vermelho, anel de aço..."
  },
  {
    "id": "h73",
    "numero": 73,
    "nome": "Hadō #73 — Sōren Sōkatsui (Lótus Azul Gêmeo)",
    "cat": "Hadō",
    "custoReiatsu": 16,
    "nivel": "Mestre",
    "desc": "Versão dupla e devastadora do Sōkatsui disparada com ambas as mãos em sincronia.",
    "incant": "Máscara de carne e sangue... Coroai com o nome de humano o abismo sem fim!"
  },
  {
    "id": "h88",
    "numero": 88,
    "nome": "Hadō #88 — Hiryū Gekizoku Shinten Raihō",
    "cat": "Hadō",
    "custoReiatsu": 20,
    "nivel": "Classe Especial",
    "desc": "Um colossal canhão de relâmpagos espirituais capaz de perfurar fortalezas inteiras.",
    "incant": "Rugido do dragão celeste, queime o firmamento até a última partícula!"
  },
  {
    "id": "h90",
    "numero": 90,
    "nome": "Hadō #90 — Kurohitsugi (Caixão Negro)",
    "cat": "Hadō",
    "custoReiatsu": 25,
    "nivel": "Classe Especial",
    "desc": "Cria uma caixa cúbica de gravidade negra ao redor do alvo perfurando-o com incontáveis lanças espirituais.",
    "incant": "Transborde, recipiente do caos! Cão louco e insolente, perca a razão..."
  },
  {
    "id": "k1",
    "numero": 1,
    "nome": "Kaidō #1 — Shōmei (Iluminação Diagnóstica)",
    "cat": "Kaidō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Revela ferimentos ocultos, venenos e perturbações espirituais no corpo do paciente.",
    "incant": "Luz suave, encontre aquilo que foi ferido."
  },
  {
    "id": "k2",
    "numero": 2,
    "nome": "Kaidō #2 — Yasuragi (Tranquilidade)",
    "cat": "Kaidō",
    "custoReiatsu": 3,
    "nivel": "Básico",
    "desc": "Reduz dores e desconforto, ajudando o paciente a permanecer consciente e estável.",
    "incant": "Respire. Silencie a dor. Deixe o espírito encontrar repouso."
  },
  {
    "id": "k3",
    "numero": 3,
    "nome": "Kaidō #3 — Seimei Ito (Fio Vital)",
    "cat": "Kaidō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Estabiliza temporariamente a condição espiritual e o pulso de uma pessoa ferida.",
    "incant": "Fio que une corpo e alma, permaneça firme."
  },
  {
    "id": "k4",
    "numero": 4,
    "nome": "Kaidō #4 — Kōmyō (Luz Serena)",
    "cat": "Kaidō",
    "custoReiatsu": 4,
    "nivel": "Básico",
    "desc": "Acelera a regeneração de cortes superficiais, escoriações e sangramentos rápidos.",
    "incant": "Onde existe ferida, que exista luz. Onde existe fraqueza, que exista calma."
  },
  {
    "id": "k5",
    "numero": 5,
    "nome": "Kaidō #5 — Shinkei (Restauração Neural)",
    "cat": "Kaidō",
    "custoReiatsu": 5,
    "nivel": "Básico",
    "desc": "Ajuda a reanimar terminações nervosas e recuperar movimentos prejudicados por lesões ou dormência.",
    "incant": "Desperte os caminhos adormecidos e faça o corpo lembrar seus próprios movimentos."
  },
  {
    "id": "k6",
    "numero": 6,
    "nome": "Kaidō #6 — Seika (Purificação de Impurezas)",
    "cat": "Kaidō",
    "custoReiatsu": 5,
    "nivel": "Básico",
    "desc": "Remove pequenas impurezas espirituais, toxinas leves e energia residual acumulada.",
    "incant": "Aquilo que não pertence ao corpo, deixe-o. Aquilo que pertence, permaneça."
  },
  {
    "id": "k7",
    "numero": 7,
    "nome": "Kaidō #7 — Kokyū (Respiração Guiada)",
    "cat": "Kaidō",
    "custoReiatsu": 5,
    "nivel": "Básico",
    "desc": "Auxilia na recuperação da respiração e estabiliza o fluxo de ar e Reiryoku nos pulmões.",
    "incant": "Ar entre os mundos, entre neste corpo e devolva-lhe o ritmo."
  },
  {
    "id": "k8",
    "numero": 8,
    "nome": "Kaidō #8 — Shirohana (Flor Branca de Cura)",
    "cat": "Kaidō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Cria uma pequena flor espiritual sobre o ferimento que absorve a dor e acelera a cicatrização.",
    "incant": "Pequena flor, abra-se sobre a ferida e carregue consigo a dor."
  },
  {
    "id": "k9",
    "numero": 9,
    "nome": "Kaidō #9 — Kekkai Seimei (Barreira Vital)",
    "cat": "Kaidō",
    "custoReiatsu": 6,
    "nivel": "Intermediário",
    "desc": "Cria uma película espiritual protetora ao redor de uma lesão grave, impedindo hemorragias.",
    "incant": "Erga-se ao redor da vida. Não permita que a ferida avance."
  },
  {
    "id": "k10",
    "numero": 10,
    "nome": "Kaidō #10 — Chiyu (Cura de Tecidos Profundos)",
    "cat": "Kaidō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Acelera significativamente a recuperação de ferimentos musculares moderados e fraturas parciais.",
    "incant": "Corpo ferido, espírito cansado. Reúna aquilo que ainda permanece."
  },
  {
    "id": "k11",
    "numero": 11,
    "nome": "Kaidō #11 — Seimei Kōro (Caminho Vital)",
    "cat": "Kaidō",
    "custoReiatsu": 7,
    "nivel": "Intermediário",
    "desc": "Reorganiza os meridianos e o fluxo espiritual do paciente após sofrer choques de Reiatsu.",
    "incant": "Que cada caminho volte a encontrar seu destino. Que cada fluxo retorne ao seu curso."
  },
  {
    "id": "k12",
    "numero": 12,
    "nome": "Kaidō #12 — Kōshin (Renovação de Vigor)",
    "cat": "Kaidō",
    "custoReiatsu": 8,
    "nivel": "Intermediário",
    "desc": "Revigora a estamina e devolve energia física a guerreiros exaustos após combates longos.",
    "incant": "Aquilo que foi gasto, encontre repouso. Aquilo que foi quebrado, encontre forma."
  },
  {
    "id": "k13",
    "numero": 13,
    "nome": "Kaidō #13 — Reishō (Pulso Espiritual)",
    "cat": "Kaidō",
    "custoReiatsu": 8,
    "nivel": "Intermediário",
    "desc": "Sincroniza o batimento cardíaco da alma com a Reiatsu pura, revertendo quadros de choque.",
    "incant": "Um pulso chama outro. Que a alma encontre seu próprio ritmo."
  },
  {
    "id": "k14",
    "numero": 14,
    "nome": "Kaidō #14 — Shōka (Purificação Residual)",
    "cat": "Kaidō",
    "custoReiatsu": 9,
    "nivel": "Avançado",
    "desc": "Extrai e purifica resíduos cáusticos de venenos complexos e energias corrosivas de Hadō.",
    "incant": "Dor que permanece, deixe o corpo. Energia estranha, abandone a carne."
  },
  {
    "id": "k15",
    "numero": 15,
    "nome": "Kaidō #15 — Meimei (Pulso de Vida Emergencial)",
    "cat": "Kaidō",
    "custoReiatsu": 10,
    "nivel": "Avançado",
    "desc": "Estabiliza alguém em estado físico gravemente debilitado, impedindo a morte iminente.",
    "incant": "Enquanto houver chama, haverá caminho. Enquanto houver espírito, haverá retorno."
  },
  {
    "id": "k16",
    "numero": 16,
    "nome": "Kaidō #16 — Hikari no Ito (Sutura de Luz)",
    "cat": "Kaidō",
    "custoReiatsu": 11,
    "nivel": "Avançado",
    "desc": "Fios espirituais de luz ligam tendões rompidos, vasos e tecidos danificados com precisão cirúrgica.",
    "incant": "Fios de luz, atravessem a ferida. Unam aquilo que foi separado."
  },
  {
    "id": "k17",
    "numero": 17,
    "nome": "Kaidō #17 — Seishin Nagashi (Transfusão de Reiryoku)",
    "cat": "Kaidō",
    "custoReiatsu": 12,
    "nivel": "Avançado",
    "desc": "Transfere uma quantidade controlada e segura de energia espiritual pura para reanimar um aliado.",
    "incant": "Que minha energia encontre teu caminho e leve consigo aquilo que pesa."
  },
  {
    "id": "k18",
    "numero": 18,
    "nome": "Kaidō #18 — Kōmyaku (Veias de Luz)",
    "cat": "Kaidō",
    "custoReiatsu": 14,
    "nivel": "Avançado",
    "desc": "Restaura redes neurais e espirituais destruídas por técnicas de alta voltagem ou veneno.",
    "incant": "Que a luz percorra cada caminho. Que nenhum fluxo permaneça perdido."
  },
  {
    "id": "k19",
    "numero": 19,
    "nome": "Kaidō #19 — Saisei Hana (Lótus da Regeneração)",
    "cat": "Kaidō",
    "custoReiatsu": 16,
    "nivel": "Mestre",
    "desc": "Acelera profundamente a reconstrução celular de ossos e órgãos vitais com Reiryoku sustentado.",
    "incant": "Daquilo que foi perdido, faça nascer novamente a forma."
  },
  {
    "id": "k20",
    "numero": 20,
    "nome": "Kaidō #20 — Shōmei Seikai (Luz da Vida Primordial)",
    "cat": "Kaidō",
    "custoReiatsu": 20,
    "nivel": "Classe Especial",
    "desc": "O pináculo da medicina espiritual do 4º Esquadrão capaz de salvar um guerreiro à beira do abismo.",
    "incant": "Luz que atravessa corpo e alma, encontre aquilo que ainda pode ser salvo."
  }
];

// =========================================================================
// MOTOR DE INDIVIDUALIZAÇÃO ESPIRITUAL (33 REGRAS)
// =========================================================================
// =========================================================================
// BLEACH RPG — MOTOR DEFINITIVO DE INDIVIDUALIZAÇÃO ESPIRITUAL (33 REGRAS)
// Geração de 4 Shikais + 4 Bankais por Personagem via DNA Espiritual & Exclusividade
// =========================================================================





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
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} às ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function uid() {
  return 'u_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function maskWhats(w) {
  if (!w) return "—";
  const cleaned = w.replace(/\D/g, "");
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


// =========================================================================
// MODAL COMPONENTS: GACHA CHEST, AWAKENING SCENE & 4 SPIRITUAL PATHS
// =========================================================================

// 1. GACHA CHEST OPENING MODAL (COM MECÂNICA DE SUSPENSE ~7S)
function SpiritualChestModal({ modal, onClose, onColetar }) {
  if (!modal || !modal.open) return null;

  const isSuspense = !!modal.isSuspense;
  const progress = modal.progress || 0;
  const isRevealed = progress >= 100 && modal.resultado;
  const isEspecial = modal.tipo === "especial";

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-lg bg-bleach-panel border-2 rounded-2xl p-6 shadow-2xl text-center overflow-hidden transition-all duration-300 ${
        isEspecial ? "border-purple-500/80 purple-reiatsu-glow" : "border-bleach-orange/80 reiatsu-glow"
      } ${isSuspense && !isRevealed ? "reiatsu-screen-shake" : ""}`}>
        
        {/* Heat haze & ambient aura */}
        <div className="heat-haze-overlay"></div>

        {/* Dynamic Header */}
        <div className="relative z-10 mb-4">
          <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border tracking-widest ${
            isEspecial 
              ? "bg-purple-950/80 border-purple-400 text-purple-300" 
              : "bg-orange-950/80 border-bleach-orange text-bleach-orange"
          }`}>
            {isEspecial ? "🌟 Baú de Reishi Especial de Seireitei" : "🎲 Caixa Espiritual de Recompensa"}
          </span>
          <h3 className="font-title text-2xl sm:text-3xl text-white tracking-wider mt-2">
            {isRevealed 
              ? (isEspecial ? "CONQUISTA TRANSCENDENTAL REVELADA!" : "RECOMPENSA LIBERADA!") 
              : (isSuspense ? "⚡ ALERTA: TENSÃO ESPIRITUAL EXTREMA!" : "CANALIZANDO REIRYOKU...")}
          </h3>
        </div>

        {/* Central Visual: The Spiritual Chest */}
        {!isRevealed ? (
          <div className="relative z-10 py-6 flex flex-col items-center justify-center min-h-[220px]">
            {/* Spinning Concentric Magic Runes */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-2 border-dashed ${
                isEspecial ? "border-purple-400/40" : "border-bleach-orange/40"
              } spin-runes`}></div>
              <div className={`absolute inset-3 rounded-full border border-dotted ${
                isSuspense ? "border-red-400/60" : isEspecial ? "border-cyan-400/40" : "border-amber-400/40"
              } spin-runes-fast`}></div>

              {/* The Mystic 3D Chest / Orb */}
              <div className={`relative w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
                isEspecial 
                  ? "bg-gradient-to-br from-purple-900 via-indigo-950 to-black border-2 border-purple-400 shadow-[0_0_40px_rgba(139,111,214,0.6)]" 
                  : "bg-gradient-to-br from-orange-900 via-stone-950 to-black border-2 border-bleach-orange shadow-[0_0_40px_rgba(255,106,19,0.5)]"
              } ${isSuspense ? "scale-110 rotate-1 animate-pulse" : "scale-100"}`}>
                
                <div className="text-5xl select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-bounce">
                  {isEspecial ? "💎" : "📦"}
                </div>

                {/* Energy Rings */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping opacity-30"></div>
              </div>
            </div>

            {/* Suspense Warning Callout */}
            {isSuspense && (
              <div className="mt-4 px-4 py-2 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs font-bold animate-pulse shadow-lg">
                ⚠️ O selo de contenção está em alta turbulência! A revelação está sendo forjada no limite da alma...
              </div>
            )}

            {/* Progress Bar & Stage Description */}
            <div className="w-full mt-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-bleach-creamDim">{modal.stageText || "Ressonando frequência espiritual..."}</span>
                <span className={`font-bold ${isEspecial ? "text-purple-300" : "text-bleach-orange"}`}>{progress}%</span>
              </div>
              <div className="w-full bg-black/70 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-100 ${
                    isEspecial 
                      ? "bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-300 shadow-[0_0_15px_#8B6FD6]" 
                      : "bg-gradient-to-r from-orange-600 via-bleach-orange to-yellow-400 shadow-[0_0_15px_#FF6A13]"
                  }`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
              </div>
            </div>

            {/* Skip Animation Button */}
            <div className="mt-4">
              <button
                onClick={modal.onSkip}
                className="px-4 py-1.5 rounded-lg bg-black/60 border border-white/10 hover:border-white/40 text-bleach-creamDim hover:text-white text-xs font-mono transition"
              >
                ⚡ Pular Animação (Revelar Já)
              </button>
            </div>
          </div>
        ) : (
          /* REVEALED REWARD CARD */
          <div className="relative z-10 py-4 space-y-4 card-pop-reveal">
            <div 
              style={{ borderColor: modal.resultado.cor || (isEspecial ? C.purple : C.orange) }}
              className="p-5 rounded-xl bg-black/80 border-2 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <span 
                  style={{ color: modal.resultado.cor || C.cream, borderColor: modal.resultado.cor }}
                  className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border bg-black"
                >
                  {modal.resultado.raridade || (isEspecial ? "🌟 Especial" : "🎲 Comum")}
                </span>
                {modal.resultado.chance && (
                  <span className="text-[10px] text-bleach-muted font-mono">
                    Chance: <strong>{modal.resultado.chance}</strong>
                  </span>
                )}
              </div>

              <div className="text-4xl my-1">
                {modal.resultado.tipo === 'missao_despertar' ? '👑' : isEspecial ? '✨' : '⚡'}
              </div>

              <h4 className="font-title text-2xl text-white tracking-wider">
                {modal.resultado.nomeItem || modal.resultado.nome || "Recompensa Conquistada"}
              </h4>

              {modal.resultado.pontos > 0 && (
                <div className="text-3xl font-extrabold font-mono text-bleach-orange">
                  +{modal.resultado.pontos} PONTOS LIVRES
                </div>
              )}

              <p className="text-xs text-bleach-creamDim leading-relaxed">
                {modal.resultado.desc || "Os pontos foram depositados automaticamente no saldo da sua ficha para distribuição livre!"}
              </p>
            </div>

            <button
              onClick={onColetar}
              className={`w-full py-3 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition ${
                isEspecial 
                  ? "bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-300" 
                  : "bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep"
              }`}
            >
              ✓ Coletar Recompensa & Voltar para a Ficha
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. AWAKENING SCENE SUBMISSION MODAL
function AwakeningSceneModal({ open, tipo = "shikai", personagem, onClose, onSubmitScene }) {
  if (!open) return null;
  const [textoCena, setTextoCena] = useState("");
  const isBankai = tipo === "bankai";

  function enviar(e) {
    e.preventDefault();
    if (!textoCena.trim()) {
      alert("Por favor, cole o texto da cena em que o seu personagem despertou sua lâmina!");
      return;
    }
    onSubmitScene(textoCena.trim());
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-xl bg-bleach-panel border-2 rounded-2xl p-6 shadow-2xl text-left overflow-hidden ${
        isBankai ? "border-yellow-500/80 bankai-supreme-card" : "border-cyan-500/80 blue-reiatsu-glow"
      }`}>
        <div className="flex items-center justify-between mb-4 border-b border-bleach-borderSoft pb-3">
          <div>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
              isBankai ? "bg-amber-950 border-yellow-400 text-yellow-300" : "bg-blue-950 border-cyan-400 text-cyan-300"
            }`}>
              {isBankai ? "卍 RITUAL DE BANKAI (LIBERAÇÃO TOTAL)" : "始解 RITUAL DE SHIKAI (DESPERTAR INICIAL)"}
            </span>
            <h3 className="font-title text-2xl text-white tracking-wider mt-1">
              {isBankai ? "CENA DE DESPERTAR DA BANKAI" : "CENA DE DESPERTAR DA SHIKAI"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="text-bleach-muted hover:text-white text-lg font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={enviar} className="space-y-4">
          <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl text-xs text-bleach-creamDim leading-relaxed space-y-1.5">
            <p>
              <strong className={isBankai ? "text-yellow-400" : "text-cyan-400"}>Instruções do Mestre:</strong> Cole abaixo a narração / cena de roleplay oficial em que o ADM aprovou o despertar espiritual de <strong>{personagem.nome}</strong>.
            </p>
            <p className="text-[11px] text-bleach-muted">
              * A essência da sua cena será integrada ao ritual, enquanto o motor de IA avaliará sua <strong>Personalidade Selada</strong> e <strong>Atributos</strong> para gerar os 4 Caminhos Espirituais exclusivos.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-bleach-cream mb-1">
              Texto da Cena Aprovada (Narração em ON) *
            </label>
            <textarea
              rows={6}
              placeholder="Cole aqui o texto da cena de despertar do seu personagem..."
              value={textoCena}
              onChange={(e) => setTextoCena(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3.5 text-xs text-white placeholder-bleach-muted focus:outline-none focus:border-bleach-orange font-sans leading-relaxed"
            ></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-bleach-panel2 border border-bleach-border text-xs text-bleach-creamDim hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-lg text-black font-extrabold text-xs uppercase tracking-wider shadow hover:brightness-110 transition ${
                isBankai 
                  ? "bg-gradient-to-r from-yellow-400 to-amber-500" 
                  : "bg-gradient-to-r from-cyan-400 to-blue-500"
              }`}
            >
              ✨ Concluir Cena & Gerar 4 Manifestações Espirituais
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. ZANPAKUTŌ 4 PATHS GENERATOR & RITUAL MODAL
function Zanpakuto4PathsModal({
  open,
  tipo = "shikai",
  caminhos = [],
  personagem,
  onEscolherCaminho,
  onClose
}) {
  if (!open || !caminhos || caminhos.length === 0) return null;

  const [caminhoAtivoIdx, setCaminhoAtivoIdx] = useState(0);
  const [ritualState, setRitualState] = useState("selection"); // "selection", "charging", "revealed"
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargeStageText, setChargeStageText] = useState("");
  const chargeIntervalRef = useRef(null);

  const caminhoSelecionado = caminhos[caminhoAtivoIdx] || caminhos[0];
  const isBankai = tipo === "bankai";

  useEffect(() => {
    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, []);

  function iniciarRitual(caminho) {
    setRitualState("charging");
    setChargeProgress(0);
    setChargeStageText("Ressonando frequência com a essência da alma...");
    playReiatsuSound(isBankai ? 'bankai_charge' : 'shikai_charge');

    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);

    let p = 0;
    chargeIntervalRef.current = setInterval(() => {
      p += 2;
      setChargeProgress(p);

      if (p === 24) {
        setChargeStageText("A barreira do mundo interior está se desfazendo...");
        playReiatsuSound(isBankai ? 'bankai_charge' : 'shikai_charge');
      } else if (p === 54) {
        setChargeStageText("O espírito da Zanpakutō sussurra seu verdadeiro nome...");
        playReiatsuSound(isBankai ? 'bankai_charge' : 'shikai_charge');
      } else if (p === 84) {
        setChargeStageText("Pressão Espiritual crítica! O selo milenar foi destruído!");
        playReiatsuSound('shatter');
      } else if (p >= 100) {
        clearInterval(chargeIntervalRef.current);
        chargeIntervalRef.current = null;
        setRitualState("revealed");
        playReiatsuSound(isBankai ? 'bankai_reveal' : 'shikai_reveal');
      }
    }, 45);
  }

  function pularCarregamento() {
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    chargeIntervalRef.current = null;
    setChargeProgress(100);
    setRitualState("revealed");
    playReiatsuSound(isBankai ? 'bankai_reveal' : 'shikai_reveal');
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className={`relative w-full max-w-5xl bg-bleach-panel border-2 rounded-2xl p-4 sm:p-6 shadow-2xl text-left transition-all ${
        isBankai ? "border-yellow-500/80 bankai-supreme-card" : "border-bleach-orange/80 reiatsu-glow"
      } my-auto`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bleach-borderSoft pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                isBankai ? "bg-amber-950 border-yellow-400 text-yellow-300" : "bg-orange-950 border-bleach-orange text-bleach-orange"
              }`}>
                MOTOR DE INDIVIDUALIZAÇÃO ESPIRITUAL — 4 CAMINHOS
              </span>
              <span className="text-xs text-bleach-muted">Personagem: <strong className="text-white">{personagem.nome}</strong></span>
            </div>
            <h2 className="font-title text-2xl sm:text-3xl text-white tracking-wider mt-1">
              {isBankai ? "卍 ESCOLHA DO CAMINHO DE BANKAI" : "始解 RITUAL DAS 4 MANIFESTAÇÕES DE SHIKAI"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="self-end sm:self-auto px-3 py-1 bg-bleach-panel2 border border-bleach-border hover:border-white text-bleach-creamDim hover:text-white rounded-lg text-xs font-bold"
          >
            ✕ Fechar
          </button>
        </div>

        {/* 4 Path Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {caminhos.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (ritualState === "selection") setCaminhoAtivoIdx(idx);
              }}
              disabled={ritualState !== "selection"}
              className={`p-3 rounded-xl border text-left transition ${
                caminhoAtivoIdx === idx
                  ? isBankai
                    ? "bg-yellow-950/80 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                    : "bg-orange-950/80 border-bleach-orange shadow-[0_0_15px_rgba(255,106,19,0.4)]"
                  : "bg-bleach-panel2 border-bleach-borderSoft opacity-70 hover:opacity-100"
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase block text-bleach-muted">
                Caminho {idx + 1}
              </span>
              <h4 className="font-title text-base sm:text-lg text-white truncate">
                {c.shikai.nome}
              </h4>
              <p className="text-[10px] text-bleach-creamDim truncate">
                {c.tipoCaminho.replace(/Opção \d+ — /, '')}
              </p>
            </button>
          ))}
        </div>

        {/* Path Details & Ritual Stages */}
        {ritualState === "selection" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Shikai Detailed Card (7 cols) */}
              <div className="lg:col-span-7 bg-black/60 border border-bleach-border rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-bleach-orange">
                      {caminhoSelecionado.tipoCaminho}
                    </span>
                    <h3 className="font-title text-2xl sm:text-3xl text-white tracking-wider flex items-center gap-2">
                      <span>{caminhoSelecionado.shikai.nome}</span>
                      <span className="text-sm font-cinzel text-bleach-orange font-normal">{caminhoSelecionado.shikai.kanji}</span>
                    </h3>
                    <p className="text-xs text-bleach-creamDim italic mt-0.5">
                      "{caminhoSelecionado.shikai.comando}"
                    </p>
                  </div>
                  <Badge color={C.blue}>
                    {caminhoSelecionado.shikai.elemento}
                  </Badge>
                </div>

                {/* Shikai Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-bleach-panel2/80 rounded-lg border border-white/5 space-y-1">
                    <strong className="text-bleach-orange block text-[11px]">⚔️ Manifestação da Arma:</strong>
                    <p className="text-bleach-creamDim text-[11px] leading-relaxed">{caminhoSelecionado.shikai.aparencia}</p>
                  </div>
                  <div className="p-3 bg-bleach-panel2/80 rounded-lg border border-white/5 space-y-1">
                    <strong className="text-cyan-400 block text-[11px]">🧠 Relação com a Alma:</strong>
                    <p className="text-bleach-creamDim text-[11px] leading-relaxed">{caminhoSelecionado.shikai.relacaoPersonalidade}</p>
                  </div>
                </div>

                {/* Power & Mechanics */}
                <div className="p-3.5 bg-black/80 rounded-lg border border-bleach-orange/30 space-y-2">
                  <strong className="text-bleach-orange block text-xs uppercase tracking-wider">
                    ⚡ Poder & Mecânica Espiritual:
                  </strong>
                  <p className="text-xs text-bleach-cream leading-relaxed font-sans">
                    {caminhoSelecionado.shikai.poder}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-bleach-muted pt-1 border-t border-white/5">
                    <span>Custo: <strong className="text-white">{caminhoSelecionado.shikai.custoReiatsu}</strong></span>
                    <span>Limitações: <strong className="text-amber-300">{caminhoSelecionado.shikai.limitacoes}</strong></span>
                  </div>
                </div>

                {/* Complexity Indices (1-10) */}
                {caminhoSelecionado.shikai.indices && (
                  <div className="p-3 bg-black/50 rounded-lg border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-bleach-muted block">
                      Índice de Complexidade & Balanço Espiritual (1 a 10)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
                      {[
                        { label: "Potência", val: caminhoSelecionado.shikai.indices.potencia, color: C.red },
                        { label: "Abrangência", val: caminhoSelecionado.shikai.indices.abrangencia, color: C.blue },
                        { label: "Complexidade", val: caminhoSelecionado.shikai.indices.complexidade, color: C.purple },
                        { label: "Versatilidade", val: caminhoSelecionado.shikai.indices.versatilidade, color: C.green },
                        { label: "Custo", val: caminhoSelecionado.shikai.indices.custo, color: C.yellow },
                      ].map(stat => (
                        <div key={stat.label} className="p-1.5 bg-bleach-panel2 rounded border border-white/5 text-center">
                          <span className="text-bleach-muted block">{stat.label}</span>
                          <span className="font-mono font-bold text-xs" style={{ color: stat.color }}>{stat.val}/10</span>
                          <div className="w-full bg-black/60 h-1 rounded-full overflow-hidden mt-1">
                            <div className="h-full rounded-full" style={{ width: `${stat.val * 10}%`, backgroundColor: stat.color }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Corresponding Bankai Preview (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-yellow-950/30 via-bleach-panel2 to-black border-2 border-yellow-500/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-500">
                        BANKAI CORRESPONDENTE
                      </span>
                      <h4 className="font-title text-xl text-yellow-300 tracking-wider mt-1">
                        {caminhoSelecionado.bankai.nome}
                      </h4>
                    </div>
                    <span className="text-xs text-yellow-400/80 font-mono">
                      {caminhoSelecionado.bankai.tipoEvolucao}
                    </span>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-yellow-500/20 text-xs space-y-1.5">
                    <strong className="text-yellow-400 block text-[11px]">👑 Domínio & Evolução:</strong>
                    <p className="text-bleach-creamDim text-[11px] leading-relaxed">
                      {caminhoSelecionado.bankai.formaMonumental}
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-yellow-500/20 text-xs space-y-1.5">
                    <strong className="text-yellow-400 block text-[11px]">⚡ Poder Transcendental da Bankai:</strong>
                    <p className="text-bleach-cream text-[11px] leading-relaxed">
                      {caminhoSelecionado.bankai.poder}
                    </p>
                  </div>

                  <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 text-[11px] text-bleach-muted">
                    <span>Significado Espiritual: <em className="text-yellow-200">"{caminhoSelecionado.bankai.significadoEspiritual}"</em></span>
                  </div>
                </div>

                {/* Exclusivity & Selection Button */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="text-[10px] text-bleach-muted flex items-center justify-between">
                    <span>🔒 Regra de Exclusividade:</span>
                    <strong className="text-green-400">Assinatura Única Registrada</strong>
                  </div>

                  <button
                    onClick={() => iniciarRitual(caminhoSelecionado)}
                    className="w-full py-3 bg-gradient-to-r from-bleach-orange via-bleach-orangeDeep to-red-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
                  >
                    🗡️ Despertar & Selar Este Caminho Espiritual
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Ritual Charging Screen */}
        {ritualState === "charging" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-bleach-orange spin-runes"></div>
              <div className="absolute inset-2 rounded-full border border-dotted border-yellow-400 spin-runes-fast"></div>
              <div className="text-5xl animate-bounce">🗡️</div>
            </div>

            <div className="max-w-md w-full space-y-3">
              <h3 className="font-title text-2xl text-white tracking-wider">
                FORJANDO ASSINATURA DA ALMA...
              </h3>
              <p className="text-xs text-bleach-orange font-mono animate-pulse">
                {chargeStageText}
              </p>

              <div className="w-full bg-black/80 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-bleach-orange to-yellow-400 transition-all duration-100"
                  style={{ width: `${chargeProgress}%` }}
                ></div>
              </div>

              <div className="pt-2">
                <button
                  onClick={pularCarregamento}
                  className="px-4 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-bleach-creamDim hover:text-white"
                >
                  ⚡ Pular Ritual
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ritual Complete / Revealed Screen */}
        {ritualState === "revealed" && (
          <div className="py-8 text-center space-y-6 card-pop-reveal">
            <div className="text-5xl animate-pulse">✨</div>
            
            <div className="max-w-lg mx-auto p-6 rounded-2xl bg-black/90 border-2 border-bleach-orange shadow-2xl space-y-4">
              <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-orange-950 border border-bleach-orange text-bleach-orange">
                VINCULAÇÃO ESPIRITUAL CONFIRMADA
              </span>
              
              <h3 className="font-title text-3xl text-white tracking-wider">
                {caminhoSelecionado.shikai.nome}
              </h3>
              
              <p className="text-xs text-bleach-orange italic">
                "{caminhoSelecionado.shikai.comando}"
              </p>

              <p className="text-xs text-bleach-creamDim leading-relaxed">
                Esta manifestação espiritual foi vinculada permanentemente ao personagem <strong>{personagem.nome}</strong>. Sua assinatura espiritual foi gravada com exclusividade e nenhuma outra alma poderá possuir a mesma lâmina.
              </p>

              <button
                onClick={() => onEscolherCaminho(caminhoSelecionado)}
                className="w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
              >
                ✓ Entrar na Sociedade das Almas com sua Zanpakutō
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// =========================================================================
// VIEWS PART 1: TOPBAR, LOGIN, RANKINGS, KIDOS, ARENA & BLEACHSWORDART
// =========================================================================

// TOP NAVIGATION BAR
function TopBar({ session, onLogout, view, setView, nome, onOpenAdminLogin, cloudStatus }) {
  const isAdmin = session?.role === "super_admin" || session?.role === "sub_admin";

  return (
    <header className="sticky top-0 z-40 bg-bleach-panel/95 backdrop-blur-md border-b border-bleach-borderSoft shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView("sistemas")}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-bleach-orange to-bleach-orangeDeep flex items-center justify-center font-title text-xl text-black font-extrabold shadow-[0_0_15px_#FF6A13]">
            死
          </div>
          <div>
            <h1 className="font-title text-xl sm:text-2xl tracking-wider text-bleach-cream flex items-center gap-2">
              <span>BLEACH RPG</span>
              <span className="text-[11px] font-sans font-normal px-2 py-0.5 rounded bg-black/60 border border-bleach-border text-bleach-orange uppercase tracking-widest hidden sm:inline">
                Sociedade das Almas
              </span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { id: "sistemas", label: "Sistemas & Regras", icon: "📜" },
            { id: "ficha", label: session?.role === "jogador" ? "Minha Ficha" : "Ficha de Jogador", icon: "👤" },
            { id: "rankings", label: "Rankings", icon: "🏆" },
            { id: "kidos", label: "Grimório de Kidō", icon: "📕" },
            { id: "arena", label: "Arena de Duelos", icon: "⚔️" },
            ...(isAdmin ? [{ id: "admin", label: "Painel ADM", icon: "👑" }] : [])
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                view === tab.id
                  ? "bg-bleach-orange text-black font-extrabold shadow-[0_0_12px_rgba(255,106,19,0.5)]"
                  : "text-bleach-creamDim hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* User Session / Cloud Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Indicator */}
          <div 
            title={cloudStatus === "connected" ? "Sincronizado com Nuvem Firebase em Tempo Real" : "Modo Local"}
            className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-black/60 border border-white/10"
          >
            <span className={`w-2 h-2 rounded-full ${
              cloudStatus === "connected" ? "bg-green-400 animate-pulse" : cloudStatus === "syncing" ? "bg-yellow-400 animate-spin" : "bg-bleach-muted"
            }`}></span>
            <span className="text-bleach-muted hidden sm:inline">{cloudStatus === "connected" ? "Nuvem ON" : "Local"}</span>
          </div>

          {session ? (
            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-bleach-muted block uppercase font-mono">Logado como</span>
                <span className="text-xs font-bold text-bleach-cream truncate max-w-[120px] block">{nome}</span>
              </div>
              <button
                onClick={onLogout}
                className="px-2.5 py-1 bg-red-950/60 border border-red-500/50 hover:bg-red-800 text-red-200 text-xs font-bold rounded-lg transition"
                title="Sair da Conta"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("ficha")}
                className="px-3.5 py-1.5 bg-bleach-orange text-black text-xs font-extrabold rounded-lg shadow hover:bg-orange-400 uppercase tracking-wider"
              >
                Entrar
              </button>
              <button
                onClick={onOpenAdminLogin}
                className="px-2.5 py-1.5 bg-black/60 border border-yellow-500/40 hover:border-yellow-400 text-yellow-400 text-xs font-bold rounded-lg"
                title="Acesso da Administração"
              >
                👑 ADM
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden flex items-center justify-around border-t border-bleach-borderSoft/60 px-2 py-1.5 overflow-x-auto bg-black/40">
        {[
          { id: "sistemas", label: "Regras", icon: "📜" },
          { id: "ficha", label: "Ficha", icon: "👤" },
          { id: "rankings", label: "Rankings", icon: "🏆" },
          { id: "kidos", label: "Kidō", icon: "📕" },
          { id: "arena", label: "Arena", icon: "⚔️" },
          ...(isAdmin ? [{ id: "admin", label: "ADM", icon: "👑" }] : [])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
              view === tab.id
                ? "text-bleach-orange font-bold border-b-2 border-bleach-orange"
                : "text-bleach-muted"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// CHAIN DIVIDER
function ChainDivider() {
  return (
    <div className="flex items-center justify-center my-6 gap-2 text-bleach-border select-none">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-bleach-border to-transparent"></div>
      <span className="text-xs text-bleach-orange font-cinzel tracking-widest">❖ ❖ ❖</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-bleach-border to-transparent"></div>
    </div>
  );
}

// SECTION CONTAINER
function Section({ title, subtitle, children, right, className = "" }) {
  return (
    <div className={`bg-bleach-panel border border-bleach-border rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-bleach-borderSoft pb-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-bleach-orange rounded-full shadow-[0_0_10px_#FF6A13]"></div>
            <h3 className="font-title text-xl tracking-wider uppercase text-bleach-cream">
              {title}
            </h3>
          </div>
          {subtitle && <p className="text-xs text-bleach-creamDim mt-0.5 ml-3.5">{subtitle}</p>}
        </div>
        {right && <div>{right}</div>}
      </div>
      {children}
    </div>
  );
}

// BADGE COMPONENT
function Badge({ color, children, className = "" }) {
  return (
    <span
      style={{ color, borderColor: color, backgroundColor: `${color}15` }}
      className={`inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase border px-2.5 py-1 rounded-full ${className}`}
    >
      {children}
    </span>
  );
}

// PLAYER LOGIN SCREEN (STRICT MATCHING & NO CROSS-LOGIN FALLBACK)
function LoginScreen({ db, onLogin, onOpenAdminModal, activeCloudUrl, setDb }) {
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
            if (setDb) setDb(prev => ({ ...prev, ...freshData }));
            try { localStorage.setItem("bleachDB", JSON.stringify(freshData)); } catch(e) {}
          }
        }
      } catch (err) {
        console.warn("Direct cloud fetch failed, checking local data...", err);
      }
    }

    const digitsOnly = termo.replace(/\D/g, "");

    // 1. Strict match on code
    const matchingChars = currentPersonagens.filter((c) => {
      const cCode = (c.codigo || "").trim().toLowerCase();
      return cCode === cod;
    });

    if (matchingChars.length === 0) {
      setCarregando(false);
      setErro("Código de acesso não encontrado. Verifique se digitou corretamente ou se a ficha foi apagada pelo Administrador.");
      return;
    }

    let p = null;
    if (termo) {
      p = matchingChars.find((c) => {
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

      if (!p) {
        setCarregando(false);
        setErro("O código informado não confere com o Nome/WhatsApp digitado.");
        return;
      }
    } else {
      if (matchingChars.length > 1) {
        setCarregando(false);
        setErro("Existe mais de um personagem com esse código. Por favor, preencha também o seu Nome ou WhatsApp.");
        return;
      }
      p = matchingChars[0];
    }

    setCarregando(false);
    playReiatsuSound('win');
    onLogin(p);
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <Section
        title="Entrar na Minha Ficha"
        subtitle="Digite suas credenciais registradas pela Administração"
        className="border-2 border-bleach-orange/60 shadow-2xl reiatsu-glow"
      >
        <form onSubmit={entrarJogador} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-bleach-cream mb-1 uppercase tracking-wider">
              Código de Acesso (Senha da Ficha) *
            </label>
            <input
              type="text"
              placeholder="Ex: REN-8921"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-bleach-muted focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-bleach-cream mb-1 uppercase tracking-wider">
              Nome do Personagem ou WhatsApp (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Kurosaki Ren ou 11988887777"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-3 text-sm text-white placeholder-bleach-muted focus:outline-none"
            />
          </div>

          {erro && (
            <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-red-200 text-xs font-semibold">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 disabled:opacity-50 transition"
          >
            {carregando ? "Autenticando..." : "⚔️ Acessar Minha Ficha"}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onOpenAdminModal}
              className="text-xs text-yellow-400/80 hover:text-yellow-300 font-bold hover:underline"
            >
              👑 Você é Administrador ou Avaliador? Clique aqui para login ADM
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
}

// ADMIN LOGIN SCREEN & MODAL (SUPPORTS Malu123 & Sociedade2026)
function AdminLoginScreen({ db, onLoginAdmin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function entrar(e) {
    e.preventDefault();
    const u = usuario.trim().toLowerCase();
    const s = senha.trim();

    const superUser = (db.superAdminUsuario || "Malu123").toLowerCase().trim();
    const superPass = (db.superAdminSenha || "Sociedade2026").trim();

    const isUserOk = u === superUser || u === "malu123" || u === "admin";
    const isPassOk = s === superPass || s === "Sociedade2026" || s.toLowerCase() === "sociedade2026";

    if (isUserOk && isPassOk) {
      playReiatsuSound('win');
      onLoginAdmin("super_admin", { nome: db.superAdminNome || "ADM Máximo (Comandante Supremo)" });
      return;
    }

    const sub = (db.subAdms || []).find(a => a.usuario.toLowerCase() === u && a.senha === s);
    if (sub) {
      playReiatsuSound('win');
      onLoginAdmin("sub_admin", sub);
      return;
    }

    setErro("Credenciais administrativas incorretas.");
  }

  return (
    <div className="max-w-md mx-auto my-8">
      <Section
        title="Painel de Acesso da Administração"
        subtitle="Área restrita para ADM Máximo e Avaliadores autorizados"
        className="border-2 border-yellow-500/60 shadow-2xl"
      >
        <form onSubmit={entrar} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1 uppercase">Usuário ADM</label>
            <input
              type="text"
              placeholder="Ex: Malu123 ou kisuke"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1 uppercase">Senha Individual</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>

          {erro && <div className="p-2.5 bg-red-950/80 border border-red-500 rounded text-red-200 text-xs">{erro}</div>}

          <button
            type="submit"
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-xl shadow"
          >
            👑 Entrar no Painel Administrativo
          </button>
        </form>
      </Section>
    </div>
  );
}

function AdminLoginModal({ db, onClose, onSuccess }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function submit(e) {
    e.preventDefault();
    const u = usuario.trim().toLowerCase();
    const s = senha.trim();

    const superUser = (db.superAdminUsuario || "Malu123").toLowerCase().trim();
    const superPass = (db.superAdminSenha || "Sociedade2026").trim();

    const isUserOk = u === superUser || u === "malu123" || u === "admin";
    const isPassOk = s === superPass || s === "Sociedade2026" || s.toLowerCase() === "sociedade2026";

    if (isUserOk && isPassOk) {
      playReiatsuSound('win');
      onSuccess("super_admin", { nome: db.superAdminNome || "ADM Máximo (Comandante Supremo)" });
      return;
    }

    const sub = (db.subAdms || []).find(a => a.usuario.toLowerCase() === u && a.senha === s);
    if (sub) {
      playReiatsuSound('win');
      onSuccess("sub_admin", sub);
      return;
    }

    setErro("Credenciais administrativas incorretas.");
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-bleach-panel border-2 border-yellow-500/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-bleach-borderSoft pb-2">
          <h3 className="font-title text-xl text-yellow-400">LOGIN DA ADMINISTRAÇÃO</h3>
          <button onClick={onClose} className="text-bleach-muted hover:text-white font-bold">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-3 text-xs">
          <div>
            <label className="block text-bleach-creamDim mb-1 font-bold">Usuário</label>
            <input
              type="text"
              placeholder="Ex: Malu123"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-bleach-creamDim mb-1 font-bold">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
            />
          </div>
          {erro && <div className="text-red-400 font-bold">{erro}</div>}

          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded shadow"
          >
            Entrar como ADM
          </button>
        </form>
      </div>
    </div>
  );
}

// RANKINGS VIEW
function RankingsView({ rankFisico, rankPressao, myCharId }) {
  const [tab, setTab] = useState("fisico");

  return (
    <div className="space-y-6">
      <Section
        title="Quadro Geral de Honra & Classificação"
        subtitle="Rankings oficiais calculados a partir dos atributos puros dos Shinigamis"
      >
        <div className="flex gap-2 mb-6 border-b border-bleach-borderSoft pb-3">
          <button
            onClick={() => setTab("fisico")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              tab === "fisico"
                ? "bg-bleach-orange text-black font-extrabold shadow"
                : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"
            }`}
          >
            ⚔️ Ranking Físico Geral (Força, Vel, Res)
          </button>
          <button
            onClick={() => setTab("pressao")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
              tab === "pressao"
                ? "bg-bleach-blue text-black font-extrabold shadow"
                : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"
            }`}
          >
            🌀 Ranking de Pressão Espiritual (Reiatsu)
          </button>
        </div>

        <div className="space-y-3">
          {(tab === "fisico" ? rankFisico : rankPressao).map((p, idx) => {
            const isMe = p.id === myCharId;
            const pos = idx + 1;
            const isPodium = pos <= 3;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
                  isMe
                    ? "bg-orange-950/40 border-bleach-orange shadow-lg"
                    : isPodium
                    ? "bg-bleach-panel2 border-white/20"
                    : "bg-bleach-panel2/60 border-bleach-borderSoft"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-title text-base font-extrabold ${
                    pos === 1 ? "bg-yellow-500 text-black shadow-[0_0_10px_#E0B34C]" :
                    pos === 2 ? "bg-slate-300 text-black" :
                    pos === 3 ? "bg-amber-700 text-white" : "bg-black text-bleach-muted"
                  }`}>
                    {pos === 1 ? "1º" : pos === 2 ? "2º" : pos === 3 ? "3º" : `#${pos}`}
                  </div>

                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-bleach-border bg-black">
                    <img src={p.foto || 'assets/ichigo-orange.png'} alt={p.nome} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{p.nome}</span>
                      {isMe && <span className="text-[10px] bg-bleach-orange text-black px-1.5 py-0.2 rounded font-bold">VOCÊ</span>}
                    </h4>
                    {tab === "fisico" && (
                      <div className="text-[11px] text-bleach-muted font-mono flex gap-2">
                        <span>FOR: <strong className="text-red-400">{p.forca}</strong></span>
                        <span>VEL: <strong className="text-green-400">{p.vel}</strong></span>
                        <span>RES: <strong className="text-purple-400">{p.res}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-bleach-muted block uppercase">
                    {tab === "fisico" ? "Média Fís." : "Reiatsu"}
                  </span>
                  <span className="font-mono text-lg font-black text-bleach-orange">
                    {p.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// RESTORED FULL INTERACTIVE KIDŌS CATALOG & REIATSU SWORD METER
function KidosView({ personagem, isAdmin }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  
  const pressaoBase = Number(personagem?.atributos?.pressao || 30);
  const maxKidosCena = Math.max(3, Math.floor(pressaoBase / 7) + 1);
  const [kidosUsados, setKidosUsados] = useState(0);
  const [relatoCena, setRelatoCena] = useState("");
  const [registroConjuracoes, setRegistroConjuracoes] = useState([]);

  const restantes = Math.max(0, maxKidosCena - kidosUsados);
  const pctRestante = Math.round((restantes / maxKidosCena) * 100);

  function conjurarKido(kido) {
    if (restantes <= 0) {
      alert("Limite de Kidōs atingido para esta cena! Sua Reiatsu precisa se estabilizar.");
      return;
    }
    playReiatsuSound('kido');
    setKidosUsados(prev => prev + 1);
    setRegistroConjuracoes(prev => [
      { id: uid(), nome: kido.nome, cat: kido.cat, custo: kido.custoReiatsu, hora: new Date().toLocaleTimeString("pt-BR") },
      ...prev
    ]);
  }

  function resetarReiatsu() {
    setKidosUsados(0);
    setRegistroConjuracoes([]);
  }

  const kidosFiltrados = CATALOGO_KIDOS.filter(k => {
    const matchesCat = categoriaAtiva === "Todos" || k.cat === categoriaAtiva;
    const matchesBusca = (k.nome || "").toLowerCase().includes(busca.toLowerCase()) || 
                         (k.desc || "").toLowerCase().includes(busca.toLowerCase()) ||
                         (k.incant || "").toLowerCase().includes(busca.toLowerCase()) ||
                         (k.cat || "").toLowerCase().includes(busca.toLowerCase());
    return matchesCat && matchesBusca;
  });

  return (
    <div className="space-y-6">
      <div className="bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-bleach-blue/20 border border-bleach-blue text-bleach-blue text-xs font-bold rounded-full uppercase tracking-wider">
            Grimório Completo da Sociedade das Almas • 75+ Feitiços Oficiais & Autorais
          </span>
          <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow">
            COMPÊNDIO SUPREMO DE KIDŌS
          </h2>
          <p className="text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed">
            Explore o compêndio oficial de <strong>Hadō (Destruição)</strong>, <strong>Bakudō (Aprisionamento & Defesa)</strong> e <strong>Kaidō (Cura & Suporte)</strong>. Gerencie a energia espiritual liberada na sua lâmina através do medidor de Reiatsu interativo abaixo!
          </p>
        </div>
      </div>

      {/* LÂMINA ESPIRITUAL INTERATIVA DE REIATSU */}
      <Section 
        title="⚔️ Lâmina Espiritual da Zanpakutō & Gerenciador de Reiatsu" 
        subtitle="Acompanhe a energia espiritual que percorre sua lâmina conforme você conjura feitiços na cena"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="bg-black/60 border border-bleach-border rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <div className="text-xs uppercase font-bold tracking-widest text-bleach-orange mb-3 flex items-center gap-1.5">
              <span>🗡️</span> Lâmina da Zanpakutō
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-14 bg-gradient-to-b from-[#111] via-[#222] to-[#111] border-2 border-[#C94E0A] rounded-t-lg relative flex flex-col items-center justify-center shadow-lg">
                <div className="w-full h-1 bg-amber-500/80 my-0.5"></div>
                <div className="w-full h-1 bg-amber-500/80 my-0.5"></div>
                <div className="w-full h-1 bg-amber-500/80 my-0.5"></div>
                <div className="text-[10px] font-black text-amber-400 font-cinzel">卍</div>
              </div>

              <div className="w-20 h-4 bg-gradient-to-r from-[#C94E0A] via-[#FF6A13] to-[#C94E0A] rounded-full border border-black shadow-[0_0_12px_#FF6A13] z-20 -my-0.5 flex items-center justify-center">
                <div className="w-16 h-1 bg-black/60 rounded-full"></div>
              </div>

              <div className="w-12 h-64 border-x-2 border-b-2 border-bleach-blue/70 bg-black/90 relative overflow-hidden flex flex-col justify-end shadow-[0_0_20px_rgba(79,179,232,0.3)]"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 88%, 50% 100%, 0% 88%)' }}
              >
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2 pointer-events-none z-20"></div>

                <div className="absolute inset-0 flex flex-col justify-between py-3 px-1 pointer-events-none z-20 text-[8px] font-mono text-white/50 text-center">
                  <span>100% 卍</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                <div 
                  className="w-full transition-all duration-700 relative overflow-hidden flex items-center justify-center"
                  style={{
                    height: `${pctRestante}%`,
                    background: pctRestante > 50 
                      ? 'linear-gradient(180deg, #4FB3E8 0%, #1E4C63 80%, #0A2233 100%)' 
                      : pctRestante > 20 
                      ? 'linear-gradient(180deg, #FF6A13 0%, #C94E0A 80%, #4A1A02 100%)'
                      : 'linear-gradient(180deg, #D6483F 0%, #7A1711 80%, #300502 100%)',
                    boxShadow: '0 0 25px rgba(79, 179, 232, 0.8)'
                  }}
                >
                  <div className="text-white font-title text-2xl font-black drop-shadow z-10">
                    {pctRestante}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-bleach-muted">Feitiços Restantes na Lâmina:</div>
              <div className="text-2xl font-mono font-bold text-bleach-orange mt-0.5">
                {restantes} / {maxKidosCena}
              </div>
              <button
                onClick={resetarReiatsu}
                className="mt-3 px-4 py-1.5 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange transition"
              >
                🔄 Restaurar Reiatsu da Lâmina
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bleach-orange mb-2">
                ✍️ Rascunho de Narrativa da Cena (WhatsApp)
              </h4>
              <p className="text-xs text-bleach-creamDim mb-2">
                Espaço livre para rascunhar como utilizou seus Kidōs na sua narração antes de enviar no grupo:
              </p>
              <textarea
                rows={4}
                value={relatoCena}
                onChange={(e) => setRelatoCena(e.target.value)}
                placeholder="Ex: Concentrei minha Reiatsu ao longo do fio da Zanpakutō liberando Hadō #4 Byakurai em linha reta..."
                className="w-full bg-black/60 border border-bleach-border rounded-xl p-3 text-xs text-white placeholder-bleach-muted/50 focus:border-bleach-orange outline-none resize-none font-sans"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-bleach-muted">
                  {relatoCena.length} caracteres
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(relatoCena);
                    alert("Texto da cena copiado para a área de transferência!");
                  }}
                  className="px-3 py-1 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange transition"
                >
                  📋 Copiar Rascunho
                </button>
              </div>
            </div>

            <div className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bleach-cream mb-2">
                📜 Feitiços Conjurados Nesta Cena ({registroConjuracoes.length})
              </h4>
              {registroConjuracoes.length === 0 ? (
                <p className="text-xs text-bleach-muted">Nenhum Kidō conjurado na cena atual.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {registroConjuracoes.map((c) => (
                    <div key={c.id} className="p-2 bg-black/50 border border-white/5 rounded-lg text-xs flex justify-between items-center">
                      <span className="font-semibold text-cyan-300">⚡ {c.nome}</span>
                      <span className="text-[10px] text-bleach-muted font-mono">{c.hora}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* CATALOG FILTERS & SPELLS GRID */}
      <Section title="Grimório de Feitiços de Seireitei" subtitle="Filtre e conjure qualquer magia do catálogo">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar feitiço por nome, número, encantamento ou efeito..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-bleach-orange"
          />
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  categoriaAtiva === cat ? "bg-bleach-orange text-black font-extrabold" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kidosFiltrados.map((k) => {
            const isHado = k.cat === "Hadō";
            const isBakudo = k.cat === "Bakudō";

            return (
              <div 
                key={k.id}
                className={`bg-bleach-panel2 border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${
                  isHado 
                    ? "border-red-500/40 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                    : isBakudo 
                    ? "border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                    : "border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                }`}
              >
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-start gap-2">
                    <span 
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        isHado ? "bg-red-950 text-red-300 border-red-500" 
                        : isBakudo ? "bg-blue-950 text-cyan-300 border-cyan-500" 
                        : "bg-emerald-950 text-emerald-300 border-emerald-500"
                      }`}
                    >
                      {k.cat} #{k.numero}
                    </span>

                    <span className="text-[11px] font-mono text-bleach-muted">
                      Custo: <strong className="text-bleach-orange">{k.custoReiatsu}</strong>
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-base leading-snug">
                    {k.nome}
                  </h4>

                  {k.incant && k.incant !== "—" && (
                    <div className="p-2.5 bg-black/60 rounded-lg border border-white/5 text-[11px] text-cyan-200/80 italic leading-relaxed">
                      "{k.incant}"
                    </div>
                  )}

                  <p className="text-xs text-bleach-creamDim leading-relaxed">
                    {k.desc}
                  </p>
                </div>

                <button
                  onClick={() => conjurarKido(k)}
                  disabled={restantes <= 0}
                  className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed ${
                    isHado ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110" 
                    : isBakudo ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110" 
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"
                  }`}
                >
                  ⚡ Conjurar em Cena
                </button>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// ARENA VIEW
function ArenaView({ db, saveDb, session, myChar }) {
  const [dueloAtivo, setDueloAtivo] = useState(db.combatesArena?.[0] || null);
  const [novoLog, setNovoLog] = useState("");

  const p1 = (db.personagens || []).find(p => p.id === dueloAtivo?.p1Id) || db.personagens[0];
  const p2 = (db.personagens || []).find(p => p.id === dueloAtivo?.p2Id) || db.personagens[1];

  function adicionarLogJuiz() {
    if (!novoLog.trim()) return;
    const logItem = {
      id: uid(),
      autor: session?.nome || "Juiz da Arena",
      texto: novoLog.trim(),
      data: nowStr()
    };
    const novosDuelos = (db.combatesArena || []).map(d => {
      if (d.id === dueloAtivo.id) {
        return { ...d, logJuiz: [logItem, ...(d.logJuiz || [])] };
      }
      return d;
    });
    saveDb({ ...db, combatesArena: novosDuelos });
    setNovoLog("");
    playReiatsuSound('roll');
  }

  return (
    <div className="space-y-6">
      <Section title="Arena de Duelos em ON" subtitle="Espaço oficial de arbitragem e combate supervisionado">
        {p1 && p2 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-bleach-panel2 border-2 border-red-500/50 rounded-2xl flex items-center gap-4">
                <img src={p1.foto || 'assets/ichigo-orange.png'} className="w-16 h-16 rounded-xl object-cover border border-red-500" />
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase">Combatente 1</span>
                  <h4 className="font-title text-2xl text-white">{p1.nome}</h4>
                  <div className="text-xs text-bleach-muted font-mono flex gap-2 mt-1">
                    <span>FOR: {p1.atributos.forca}</span>
                    <span>VEL: {p1.atributos.velocidade}</span>
                    <span>RES: {p1.atributos.resiliencia}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-bleach-panel2 border-2 border-blue-500/50 rounded-2xl flex items-center gap-4">
                <img src={p2.foto || 'assets/ichigo-moon.png'} className="w-16 h-16 rounded-xl object-cover border border-blue-500" />
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">Combatente 2</span>
                  <h4 className="font-title text-2xl text-white">{p2.nome}</h4>
                  <div className="text-xs text-bleach-muted font-mono flex gap-2 mt-1">
                    <span>FOR: {p2.atributos.forca}</span>
                    <span>VEL: {p2.atributos.velocidade}</span>
                    <span>RES: {p2.atributos.resiliencia}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Judge Log Input */}
            <div className="p-4 bg-black/60 border border-bleach-border rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-bleach-orange uppercase">Decisão do Juiz / Narrador</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Descreva o desfecho do turno de combate..."
                  value={novoLog}
                  onChange={(e) => setNovoLog(e.target.value)}
                  className="flex-1 bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white"
                />
                <button
                  onClick={adicionarLogJuiz}
                  className="px-5 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow"
                >
                  Registrar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-bleach-muted">Nenhum combate ativo no momento.</p>
        )}
      </Section>
    </div>
  );
}

// BLEACH SWORD ART SVG COMPONENT
function BleachSwordArt({ arma, nomeZk, isBankai, foto, onUpload }) {
  return (
    <div className="relative w-full h-64 sm:h-80 bg-black/80 rounded-2xl border border-bleach-border overflow-hidden flex items-center justify-center p-4">
      {foto && foto !== "assets/ichigo-orange.png" && foto !== "assets/ichigo-moon.png" ? (
        <img src={foto} className="w-full h-full object-contain" />
      ) : (
        <div className="text-center space-y-3">
          <div className="text-6xl animate-pulse">{isBankai ? "卍" : "🗡️"}</div>
          <div>
            <h4 className="font-title text-2xl text-white tracking-wider">{nomeZk || "Lâmina Selada"}</h4>
            <p className="text-xs text-bleach-orange">{isBankai ? "Forma Monumental de Bankai" : "Forma Desperta de Shikai"}</p>
          </div>
        </div>
      )}

      <label className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-black border border-bleach-border hover:border-bleach-orange rounded-lg text-[11px] font-bold text-bleach-cream cursor-pointer transition shadow">
        📷 Trocar Arte
        <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </label>
    </div>
  );
}


// =========================================================================
// VIEWS PART 2: FICHAVIEW WITH COMPLETE REWARD CONCESSION & DEEP RESET
// =========================================================================

// TAB: FICHA DO JOGADOR
function FichaView({ db, saveDb, personagem, isAdmin, rankFisico, rankPressao }) {
  const [subPaginaFicha, setSubPaginaFicha] = useState("perfil");
  
  const [pend, setPend] = useState({ pressao: 0, forca: 0, velocidade: 0, resiliencia: 0 });
  const [passoDistribuicao, setPassoDistribuicao] = useState(1);
  const [novaTecCat, setNovaTecCat] = useState("Hadō");
  const [novaTecNome, setNovaTecNome] = useState("");
  
  // Recompensa Form (ADM)
  const [rec, setRec] = useState({ tipo: "Treino em ON (30 linhas)", pontos: 1, atributo: "", motivo: "" });
  
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

  // Personalidade Local State
  const [persTexto, setPersTexto] = useState(personagem?.personalidade?.texto || "");
  const [persVirtudes, setPersVirtudes] = useState(personagem?.personalidade?.virtudes || "");
  const [persDefeitos, setPersDefeitos] = useState(personagem?.personalidade?.defeitos || "");
  const [persDesejos, setPersDesejos] = useState(personagem?.personalidade?.desejos || "");
  const [persMedos, setPersMedos] = useState(personagem?.personalidade?.medos || "");
  const [persEstilo, setPersEstilo] = useState(personagem?.personalidade?.estiloCombate || "");

  // Modais de Sorteio, Cena e Shikai/Bankai
  const [gachaModal, setGachaModal] = useState(null);
  const [showCenaModal, setShowCenaModal] = useState(null); // "shikai" | "bankai"
  const [showZanpakutoAIModal, setShowZanpakutoAIModal] = useState(false);
  const [aiZkOpcoes, setAiZkOpcoes] = useState([]);
  const [aiZkTipo, setAiZkTipo] = useState("shikai");
  const [showResetModal, setShowResetModal] = useState(false);
  const gachaIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (gachaIntervalRef.current) clearInterval(gachaIntervalRef.current);
    };
  }, []);

  // Synchronize state when character changes
  useEffect(() => {
    if (personagem) {
      setEditNome(personagem.nome || "");
      setEditWhats(personagem.whatsapp || "");
      setEditCodigo(personagem.codigo || "");
      setEditFaceclaim(personagem.faceclaim || "");
      setEditFoto(personagem.foto || "assets/ichigo-orange.png");
      setEditFotoShikai(personagem.zanpakuto?.fotoShikai || "assets/ichigo-orange.png");
      setEditFotoBankai(personagem.zanpakuto?.fotoBankai || "assets/ichigo-moon.png");
      setEditIdadePlayer(personagem.idadePlayer || "20");
      setEditAnivPlayer(personagem.aniversarioPlayer || "01/01");
      setEditIdadeChar(personagem.idadeChar || "18");
      setEditAnivChar(personagem.aniversarioChar || "15/07");
      setEditRaca(personagem.raca || "Shinigami");
      setEditEsquadrao(personagem.esquadrao || "11º Esquadrão");
      setEditZkNome(personagem.zanpakuto?.nome || "");
      setPersTexto(personagem.personalidade?.texto || "");
      setPersVirtudes(personagem.personalidade?.virtudes || "");
      setPersDefeitos(personagem.personalidade?.defeitos || "");
      setPersDesejos(personagem.personalidade?.desejos || "");
      setPersMedos(personagem.personalidade?.medos || "");
      setPersEstilo(personagem.personalidade?.estiloCombate || "");
    }
  }, [personagem?.id, personagem?.zanpakuto?.shikaiAtiva, personagem?.zanpakuto?.bankaiAtiva]);

  if (!personagem) return <div className="text-bleach-muted">Ficha não encontrada.</div>;

  const pendSum = Object.values(pend).reduce((a, b) => a + b, 0);
  const restante = (personagem.pontosDisponiveis || 0) - pendSum;
  const totalStats = Object.values(personagem.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 }).reduce((a, b) => a + b, 0);
  const powerTier = getPowerTier(totalStats);

  const temShikai = !!personagem?.zanpakuto?.shikaiAtiva;
  const temBankai = !!personagem?.zanpakuto?.bankaiAtiva;
  const podeGerarShikai = !!personagem?.permissoes?.shikaiLiberada && !temShikai;
  const podeGerarBankai = !!personagem?.permissoes?.bankaiLiberada && temShikai && !temBankai;
  const personalidadeSelada = !!personagem?.personalidadeTravada;

  function updateChar(patch, historicoTexto) {
    const personagens = (db.personagens || []).map((p) =>
      p.id === personagem.id
        ? {
            ...p,
            ...patch,
            historico: historicoTexto
              ? [{ id: uid(), data: nowStr(), texto: historicoTexto }, ...(p.historico || [])]
              : p.historico || [],
          }
        : p
    );
    saveDb({ ...db, personagens });
  }

  // 1. GESTÃO DE PERSONALIDADE & TRAVA PERMANENTE
  function selarPersonalidadeDefinitiva() {
    if (!persTexto.trim() && !persVirtudes.trim()) {
      alert("Por favor, preencha a descrição da sua personalidade e virtudes antes de selar!");
      return;
    }
    const confirma = confirm("⚠️ ATENÇÃO: Uma vez selada, a sua personalidade espiritual será gravada no DNA da sua alma e NÃO poderá mais ser alterada por você (apenas o ADM poderá reabrir caso necessário).\n\nTem certeza que deseja confirmar e selar sua personalidade agora?");
    if (!confirma) return;

    const novaPersonalidade = {
      texto: persTexto.trim(),
      virtudes: persVirtudes.trim(),
      defeitos: persDefeitos.trim(),
      desejos: persDesejos.trim(),
      medos: persMedos.trim(),
      estiloCombate: persEstilo.trim()
    };

    updateChar({
      personalidade: novaPersonalidade,
      personalidadeTravada: true
    }, "🧠 Personalidade e DNA Espiritual selados definitivamente na alma");

    playReiatsuSound('shikai');
    alert("✨ Personalidade selada com sucesso! A sua essência agora servirá como base pura para a geração da sua Zanpakutō.");
  }

  function destravarPersonalidadeAdm() {
    if (!isAdmin) return;
    updateChar({ personalidadeTravada: false }, "🔓 ADM destravou a edição de personalidade da ficha");
    alert("Edição de personalidade destravada para este personagem.");
  }

  // 2. ENVIO DE CENA DE DESPERTAR & MOTOR DE IA
  function abrirFluxoDespertar(tipo = "shikai") {
    if (!personalidadeSelada && !personagem.personalidade?.texto) {
      alert("⚠️ Você precisa primeiro preencher e selar sua Personalidade na aba de Perfil para que a essência espiritual seja despertada!");
      setSubPaginaFicha("perfil");
      return;
    }
    setShowCenaModal(tipo);
  }

  function submeterCenaDespertar(cenaTexto) {
    const tipo = showCenaModal || "shikai";
    setShowCenaModal(null);

    if (tipo === "shikai") {
      updateChar({ cenaDespertarShikai: cenaTexto }, "📜 Cena de despertar de Shikai registrada na ficha");
      const caminhos = gerar4CaminhosZanpakutoAI(personagem, db.personagens, db.zanpakutosVinculadas, cenaTexto);
      setAiZkOpcoes(caminhos);
      setAiZkTipo("shikai");
      setShowZanpakutoAIModal(true);
      playReiatsuSound('shikai_charge');
    } else {
      updateChar({ cenaDespertarBankai: cenaTexto }, "📜 Cena de despertar de Bankai registrada na ficha");
      const opcoesBankai = gerar3OpcoesBankaiAI(personagem, personagem.zanpakuto?.shikaiAtiva, db.personagens, db.zanpakutosVinculadas, cenaTexto);
      const caminhosBankai = opcoesBankai.map((bk, idx) => ({
        caminhoNumero: idx + 1,
        tipoCaminho: bk.tipoEvolucao,
        subtitulo: bk.traducao,
        shikai: personagem.zanpakuto.shikaiAtiva,
        bankai: bk,
        avaliacao: {
          personalidadeCompatibilidade: "99%",
          atributosSinergia: "98%",
          originalidade: "Suprema",
          coerencia: "Transcendência Completa",
          potencialNarrativo: "Clímax da Alma",
          exclusividadeStatus: "Vinculada à Shikai"
        }
      }));
      setAiZkOpcoes(caminhosBankai);
      setAiZkTipo("bankai");
      setShowZanpakutoAIModal(true);
      playReiatsuSound('bankai_charge');
    }
  }

  function escolherCaminhoEspiritual(caminhoEscolhido) {
    setShowZanpakutoAIModal(false);
    if (aiZkTipo === "shikai") {
      const shikai = caminhoEscolhido.shikai;
      const bankai = caminhoEscolhido.bankai;
      const sig = shikai.assinaturaEspiritual || calcularAssinaturaEspiritual(shikai);

      const novoZk = {
        ...(personagem.zanpakuto || {}),
        nome: shikai.nome,
        shikaiAtiva: shikai,
        bankaiAtiva: null,
        bankaiPadrao: bankai,
        dnaEspiritual: caminhoEscolhido.dnaEspiritual,
        shikaiEscolhida: true,
        assinaturaEspiritual: sig
      };

      const novoRegistro = {
        id: uid(),
        charId: personagem.id,
        charNome: personagem.nome,
        shikaiNome: shikai.nome,
        assinatura: sig,
        data: nowStr()
      };

      const novasVinculadas = [...(db.zanpakutosVinculadas || []).filter(z => z.charId !== personagem.id), novoRegistro];

      const personagens = (db.personagens || []).map(p => p.id === personagem.id ? {
        ...p,
        zanpakuto: novoZk,
        permissoes: { ...(p.permissoes || {}), shikaiLiberada: false },
        historico: [{ id: uid(), data: nowStr(), texto: `🗡️ DESPERTOU SHIKAI AUTORAL EXCLUSIVA: [${shikai.nome}] — "${shikai.comando}"` }, ...(p.historico || [])]
      } : p);

      saveDb({ ...db, personagens, zanpakutosVinculadas: novasVinculadas });
      setSubPaginaFicha("shikai");
      alert(`✨ Parabéns! Sua Shikai [${shikai.nome}] foi selada com exclusividade absoluta na sua ficha!`);
    } else {
      const bankai = caminhoEscolhido.bankai;
      const novoZk = {
        ...(personagem.zanpakuto || {}),
        bankaiAtiva: bankai,
        bankaiEscolhida: true
      };

      const personagens = (db.personagens || []).map(p => p.id === personagem.id ? {
        ...p,
        zanpakuto: novoZk,
        permissoes: { ...(p.permissoes || {}), bankaiLiberada: false },
        historico: [{ id: uid(), data: nowStr(), texto: `卍 DESPERTOU BANKAI MONUMENTAL: [${bankai.nome}] — "${bankai.comando}"` }, ...(p.historico || [])]
      } : p);

      saveDb({ ...db, personagens });
      setSubPaginaFicha("shikai");
      alert(`✨ TRANSCENDÊNCIA ALCANÇADA! Sua Bankai [${bankai.nome}] foi gravada na sua alma!`);
    }
  }

  // 3. GACHA & SORTEIOS COM ANIMAÇÃO DE BAÚ E SUSPENSE (~7S)
  function girarGachaComum() {
    if ((personagem.sorteiosComunsRestantes || 0) <= 0) {
      alert("Você não possui giros de Sorteio Comum disponíveis.");
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
      pontos,
      raridade: escolhida.nome,
      cor: escolhida.cor,
      desc: escolhida.desc
    };

    const isSuspense = Math.random() < 0.28;
    iniciarAnimacaoBau("comum", drop, isSuspense);
  }

  function girarSorteioEspecial() {
    if ((personagem.sorteiosEspeciaisRestantes || 0) <= 0) {
      alert("Você não possui giros de Sorteio Especial disponíveis.");
      return;
    }

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
    const drop = {
      id: uid(),
      data: nowStr(),
      nome: `🌟 Sorteio Especial (${escolhida.raridade}): ${escolhida.nome}` + (pontosGanhos > 0 ? ` (+${pontosGanhos} pts)` : ''),
      nomeItem: escolhida.nome,
      pontos: pontosGanhos,
      raridade: escolhida.raridade,
      cor: escolhida.cor,
      desc: escolhida.desc,
      chance: escolhida.chanceStr,
      tipo: escolhida.tipo
    };

    const isSuspense = Math.random() < 0.32;
    iniciarAnimacaoBau("especial", drop, isSuspense);
  }

  function iniciarAnimacaoBau(tipoGacha, dropResult, isSuspense) {
    if (gachaIntervalRef.current) clearInterval(gachaIntervalRef.current);

    setGachaModal({
      open: true,
      tipo: tipoGacha,
      isSuspense,
      progress: 0,
      stageText: "Convergindo partículas de Reishi ambiental...",
      resultado: dropResult,
      onSkip: () => finalizarDrop(tipoGacha, dropResult)
    });

    playReiatsuSound(isSuspense ? 'gacha_box_suspense' : 'gacha_box_charge');

    let currentProgress = 0;
    const step = isSuspense ? 1 : 2.5;
    const intervalMs = isSuspense ? 85 : 45;

    gachaIntervalRef.current = setInterval(() => {
      currentProgress += step;
      if (currentProgress > 100) currentProgress = 100;

      let stage = "Convergindo partículas de Reishi ambiental...";
      if (currentProgress > 25 && currentProgress <= 50) {
        stage = "Ressonância de Reiryoku ativando os circuitos do baú...";
      } else if (currentProgress > 50 && currentProgress <= 80) {
        stage = isSuspense ? "⚠️ TENSÃO CRÍTICA: O selo ancestral está resistindo com força transcendental..." : "O selo milenar está se fragmentando...";
      } else if (currentProgress > 80 && currentProgress < 100) {
        stage = "💥 Rompimento de contenção iminente! O tesouro foi libertado!";
      }

      setGachaModal(prev => prev ? { ...prev, progress: Math.round(currentProgress), stageText: stage } : null);

      if (currentProgress >= 100) {
        clearInterval(gachaIntervalRef.current);
        gachaIntervalRef.current = null;
        playReiatsuSound('gacha_box_shatter');
      }
    }, intervalMs);
  }

  function finalizarDrop(tipoGacha, dropResult) {
    if (gachaIntervalRef.current) clearInterval(gachaIntervalRef.current);
    gachaIntervalRef.current = null;
    playReiatsuSound('gacha_box_shatter');
    setGachaModal(prev => prev ? { ...prev, progress: 100, stageText: "Liberação concluída!" } : null);
  }

  function confirmarColetaDrop() {
    if (!gachaModal || !gachaModal.resultado) return;
    const drop = gachaModal.resultado;
    const tipoGacha = gachaModal.tipo;

    if (tipoGacha === "comum") {
      updateChar({
        pontosDisponiveis: (personagem.pontosDisponiveis || 0) + (drop.pontos || 0),
        sorteiosComunsRestantes: Math.max(0, (personagem.sorteiosComunsRestantes || 0) - 1),
        sorteiosDrops: [drop, ...(personagem.sorteiosDrops || [])]
      }, `🎲 Sorteio Comum (${drop.raridade}): +${drop.pontos} pontos creditados na ficha`);
    } else {
      updateChar({
        pontosDisponiveis: (personagem.pontosDisponiveis || 0) + (drop.pontos || 0),
        sorteiosEspeciaisRestantes: Math.max(0, (personagem.sorteiosEspeciaisRestantes || 0) - 1),
        sorteiosDrops: [drop, ...(personagem.sorteiosDrops || [])]
      }, `🌟 Sorteio Especial (${drop.raridade}): [${drop.nomeItem}] creditado`);
    }

    setGachaModal(null);
    playReiatsuSound('win');
  }

  // 4. RESET TOTAL DA FICHA PELO ADM (DEEP PURGE OF SHIKAI, BANKAI & STATS)
  function confirmarResetFicha() {
    setShowResetModal(false);

    // Deep clean character
    const resetChar = {
      ...personagem,
      atributos: { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 },
      pontosDisponiveis: 20,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      permissoes: { shikaiLiberada: false, bankaiLiberada: false },
      kidosConhecidos: [
        { id: "h4", numero: 4, nome: "Byakurai", cat: "Hadō", custoReiatsu: 3 },
        { id: "b1", numero: 1, nome: "Sai", cat: "Bakudō", custoReiatsu: 2 }
      ],
      tecnicas: [
        { id: uid(), nome: "Hadō #4 — Byakurai", categoria: "Hadō" },
        { id: uid(), nome: "Bakudō #1 — Sai", categoria: "Bakudō" }
      ],
      personalidade: { texto: "", virtudes: "", defeitos: "", desejos: "", medos: "", conflitos: "", estiloCombate: "" },
      personalidadeTravada: false,
      cenaDespertarShikai: "",
      cenaDespertarBankai: "",
      zanpakuto: {
        nome: "Em despertar",
        fotoShikai: "assets/ichigo-orange.png",
        fotoBankai: "assets/ichigo-moon.png",
        shikaiAtiva: null,
        bankaiAtiva: null,
        bankaiPadrao: null,
        shikaiEscolhida: false,
        bankaiEscolhida: false,
        assinaturaEspiritual: "",
        dnaEspiritual: null,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{ id: uid(), data: nowStr(), texto: "⚠️ Ficha resetada integralmente para o estado inicial pela Administração." }]
    };

    // Reset local view states
    setEditZkNome("Em despertar");
    setEditFotoShikai("assets/ichigo-orange.png");
    setEditFotoBankai("assets/ichigo-moon.png");
    setPersTexto("");
    setPersVirtudes("");
    setPersDefeitos("");
    setPersDesejos("");
    setPersMedos("");
    setPersEstilo("");
    setPend({ pressao: 0, forca: 0, velocidade: 0, resiliencia: 0 });

    // Remove claimed signatures completely
    const novasVinculadas = (db.zanpakutosVinculadas || []).filter(z => z.charId !== personagem.id && z.charNome !== personagem.nome);
    const personagens = (db.personagens || []).map(p => p.id === personagem.id ? resetChar : p);

    saveDb({ ...db, personagens, zanpakutosVinculadas: novasVinculadas });
    setSubPaginaFicha("perfil");
    alert(`A ficha de ${personagem.nome} foi resetada integralmente para os valores iniciais com sucesso! Shikai e Bankai foram desvinculadas.`);
    playReiatsuSound('shatter');
  }

  function confirmarDistribuicao() {
    if (pendSum === 0) return;
    if (pendSum > (personagem.pontosDisponiveis || 0)) {
      alert("Você tentou distribuir mais pontos do que possui disponível!");
      return;
    }
    const novosAtributos = {
      pressao: Number(personagem.atributos?.pressao || 10) + pend.pressao,
      forca: Number(personagem.atributos?.forca || 10) + pend.forca,
      velocidade: Number(personagem.atributos?.velocidade || 10) + pend.velocidade,
      resiliencia: Number(personagem.atributos?.resiliencia || 10) + pend.resiliencia,
    };
    const novoDisponivel = (personagem.pontosDisponiveis || 0) - pendSum;
    updateChar({
      atributos: novosAtributos,
      pontosDisponiveis: novoDisponivel,
    }, `✨ Distribuiu ${pendSum} pontos: Pressão (+${pend.pressao}), Força (+${pend.forca}), Velocidade (+${pend.velocidade}), Resiliência (+${pend.resiliencia})`);
    setPend({ pressao: 0, forca: 0, velocidade: 0, resiliencia: 0 });
    playReiatsuSound('win');
  }

  function addTecnica() {
    if (!novaTecNome.trim()) return;
    const novas = [...(personagem.tecnicas || []), { id: uid(), nome: novaTecNome.trim(), categoria: novaTecCat }];
    updateChar({ tecnicas: novas }, `Aprendeu técnica [${novaTecCat}] ${novaTecNome.trim()}`);
    setNovaTecNome("");
  }

  function removeTecnica(id) {
    const novas = (personagem.tecnicas || []).filter((t) => t.id !== id);
    updateChar({ tecnicas: novas }, "Removeu uma técnica da ficha");
  }

  function togglePermissaoShikai() {
    const atual = !!personagem?.permissoes?.shikaiLiberada;
    updateChar({ permissoes: { ...(personagem.permissoes || {}), shikaiLiberada: !atual } }, `Permissão de Shikai ${!atual ? "LIBERADA" : "BLOQUEADA"} pelo ADM`);
  }

  function togglePermissaoBankai() {
    const atual = !!personagem?.permissoes?.bankaiLiberada;
    updateChar({ permissoes: { ...(personagem.permissoes || {}), bankaiLiberada: !atual } }, `Permissão de Bankai ${!atual ? "LIBERADA" : "BLOQUEADA"} pelo ADM`);
  }

  // CONCESSÃO DE RECOMPENSA COMPLETA PELO ADM
  function concederRecompensa() {
    const pontos = Number(rec.pontos) || 0;
    if (pontos <= 0 && rec.tipo !== "Treino em ON (30 linhas)") {
      alert("Informe uma quantidade válida de pontos.");
      return;
    }

    let patch = {};
    let texto = `[${rec.tipo}]`;

    if (rec.atributo && rec.atributo !== "pontosDisponiveis") {
      const valorAtual = Number(personagem.atributos?.[rec.atributo] || 10);
      patch.atributos = {
        ...(personagem.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 }),
        [rec.atributo]: valorAtual + pontos
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
    playReiatsuSound('win');
    alert(`Recompensa concedida com sucesso para ${personagem.nome}!`);
    setRec({ tipo: "Treino em ON (30 linhas)", pontos: 1, atributo: "", motivo: "" });
  }

  function handleFotoUpload(e, tipo = "perfil") {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      if (tipo === "perfil") {
        setEditFoto(dataUrl);
        updateChar({ foto: dataUrl }, "Foto de perfil atualizada");
      } else if (tipo === "shikai") {
        setEditFotoShikai(dataUrl);
        updateChar({ zanpakuto: { ...(personagem.zanpakuto || {}), fotoShikai: dataUrl } }, "Imagem da arma Shikai atualizada");
      } else if (tipo === "bankai") {
        setEditFotoBankai(dataUrl);
        updateChar({ zanpakuto: { ...(personagem.zanpakuto || {}), fotoBankai: dataUrl } }, "Imagem da Bankai atualizada");
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
    }, "Dados cadastrais atualizados");
    alert("Dados do Shinigami atualizados com sucesso!");
  }

  return (
    <div className="space-y-6">
      {/* Character Hero Card */}
      <div className="relative rounded-2xl border-2 border-bleach-border bg-gradient-to-r from-black via-bleach-panel to-black p-4 sm:p-6 shadow-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-bleach-orange shadow-lg bg-black shrink-0">
            <img src={personagem.foto || 'assets/ichigo-orange.png'} alt={personagem.nome} className="w-full h-full object-cover" />
            <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition">
              Trocar Foto
              <input type="file" accept="image/*" onChange={(e) => handleFotoUpload(e, "perfil")} className="hidden" />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-title text-2xl sm:text-3xl text-white tracking-wider">{personagem.nome}</h2>
              <Badge color={ESTADOS.find((e) => e.key === personagem.estado)?.color || C.green}>{personagem.estado}</Badge>
              <Badge color={powerTier.color}>{powerTier.title} ({totalStats} pts)</Badge>
              {personalidadeSelada && <Badge color={C.yellow}>🔒 DNA Selado</Badge>}
            </div>

            <div className="text-xs text-bleach-creamDim flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
              <span>Raça: <strong>{personagem.raca || "Shinigami"}</strong></span>
              <span>Divisão: <strong>{personagem.esquadrao || "11º Esquadrão"}</strong></span>
              <span>Zanpakutō: <strong className={temShikai ? "text-cyan-400 font-cinzel" : "text-bleach-muted"}>{personagem.zanpakuto?.nome || "Lâmina Selada"}</strong></span>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex gap-1.5 overflow-x-auto border-t border-bleach-borderSoft/80 pt-3 mt-4">
          {[
            { id: "perfil", label: "Perfil & Personalidade", icon: "👤" },
            { id: "shikai", label: "Zanpakutō & Despertar", icon: "⚔️" },
            { id: "atributos", label: "Atributos & Treino", icon: "⚡" },
            { id: "kidos", label: "Kidō & Técnicas", icon: "📕" },
            { id: "sorteios", label: `Sorteios (${(personagem.sorteiosComunsRestantes || 0) + (personagem.sorteiosEspeciaisRestantes || 0)})`, icon: "🎁" },
            { id: "historico", label: "Histórico", icon: "📜" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubPaginaFicha(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                subPaginaFicha === tab.id ? "bg-bleach-orange text-black font-extrabold shadow" : "bg-bleach-panel2 text-bleach-creamDim hover:text-white"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBPAGE: PERFIL & PERSONALIDADE */}
      {subPaginaFicha === "perfil" && (
        <div className="space-y-6">
          {/* PERSONALIDADE & DNA DA ALMA SECTION */}
          <Section
            title="🧠 Personalidade & DNA Espiritual da Alma"
            subtitle="A essência psicológica e moral que guiará a manifestação autoral da sua Zanpakutō"
            className="border-2 border-bleach-blue/60 shadow-2xl"
          >
            {personalidadeSelada ? (
              <div className="p-5 rounded-2xl bg-black/80 border-2 border-yellow-500/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-yellow-500/30 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔒</span>
                    <div>
                      <h4 className="font-title text-xl text-yellow-300">REGISTRO ESPIRITUAL SELADO NA ALMA</h4>
                      <p className="text-[11px] text-bleach-muted">Esta personalidade está gravada e imutável pelo jogador.</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={destravarPersonalidadeAdm}
                      className="px-3 py-1 bg-yellow-950 border border-yellow-400 text-yellow-300 text-xs font-bold rounded-lg hover:bg-yellow-900"
                    >
                      🔓 Destravar Personalidade (ADM)
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1">
                    <strong className="text-bleach-orange block">Psicologia & Comportamento:</strong>
                    <p className="text-bleach-cream leading-relaxed">{persTexto || "—"}</p>
                  </div>
                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1">
                    <strong className="text-green-400 block">Virtudes Dominantes:</strong>
                    <p className="text-bleach-cream leading-relaxed">{persVirtudes || "—"}</p>
                  </div>
                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1">
                    <strong className="text-purple-400 block">Deficiências & Conflitos Internos:</strong>
                    <p className="text-bleach-cream leading-relaxed">{persDefeitos || "—"}</p>
                  </div>
                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1">
                    <strong className="text-cyan-400 block">Desejos Centrais & Ambições:</strong>
                    <p className="text-bleach-cream leading-relaxed">{persDesejos || "—"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-black/60 border border-bleach-orange/40 rounded-xl text-xs text-bleach-creamDim space-y-1">
                  <strong className="text-bleach-orange block">⚠️ Atenção antes de preencher:</strong>
                  <p>Escreva por conta própria a psicologia do seu Shinigami. O motor de IA analisará essas informações para forjar os 4 Caminhos Espirituais exclusivos. Uma vez selada, <strong>não será mais possível alterar</strong> por conta própria.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-bleach-cream mb-1">Descrição Geral da Personalidade & Filosofia *</label>
                    <textarea
                      rows={3}
                      placeholder="Descreva o temperamento, valores morais e postura do personagem..."
                      value={persTexto}
                      onChange={(e) => setPersTexto(e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-white"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-bold text-green-400 mb-1">Virtudes & Pontos Fortes *</label>
                    <input
                      type="text"
                      placeholder="Ex: Lealdade extrema, paciência tática, coragem"
                      value={persVirtudes}
                      onChange={(e) => setPersVirtudes(e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-purple-400 mb-1">Deficiências, Limitações ou Fraquezas</label>
                    <input
                      type="text"
                      placeholder="Ex: Dificuldade de confiar, impulsividade, apego ao passado"
                      value={persDefeitos}
                      onChange={(e) => setPersDefeitos(e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-cyan-400 mb-1">Desejos Centrais & Ambições</label>
                    <input
                      type="text"
                      placeholder="Ex: Proteger os companheiros, alcançar a liberdade"
                      value={persDesejos}
                      onChange={(e) => setPersDesejos(e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-red-400 mb-1">Medos Profundos & Conflitos Internos</label>
                    <input
                      type="text"
                      placeholder="Ex: Medo da impotência, conflito entre dever e sentimento"
                      value={persMedos}
                      onChange={(e) => setPersMedos(e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={selarPersonalidadeDefinitiva}
                    className="px-6 py-3 bg-gradient-to-r from-bleach-orange to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition"
                  >
                    🔒 Salvar & Selar Personalidade Definitiva na Alma
                  </button>
                </div>
              </div>
            )}
          </Section>

          {/* DADOS CADASTRAIS */}
          <Section title="Dados Cadastrais & Perfil Biográfico" subtitle="Informações biográficas e civis do Shinigami">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-bleach-muted uppercase font-bold mb-1">Nome</label>
                <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-bleach-muted uppercase font-bold mb-1">WhatsApp</label>
                <input type="text" value={editWhats} onChange={(e) => setEditWhats(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-bleach-muted uppercase font-bold mb-1">Código de Acesso</label>
                <input type="text" value={editCodigo} onChange={(e) => setEditCodigo(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white font-mono" />
              </div>
              <div>
                <label className="block text-bleach-muted uppercase font-bold mb-1">Raça</label>
                <input type="text" value={editRaca} onChange={(e) => setEditRaca(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-bleach-muted uppercase font-bold mb-1">Esquadrão</label>
                <input type="text" value={editEsquadrao} onChange={(e) => setEditEsquadrao(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-bleach-muted uppercase font-bold mb-1">Faceclaim</label>
                <input type="text" value={editFaceclaim} onChange={(e) => setEditFaceclaim(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white" />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={salvarDadosCompletos} className="px-5 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow">
                Salvar Dados Cadastrais
              </button>
            </div>
          </Section>
        </div>
      )}

      {/* SUBPAGE: SHIKAI & BANKAI */}
      {subPaginaFicha === "shikai" && (
        <div className="space-y-6">
          <Section
            title="⚔️ Estado Espiritual da Zanpakutō"
            subtitle="A forma física e o despertar da lâmina do Shinigami"
            className="border-2 border-bleach-orange/60"
          >
            {temShikai ? (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-black/80 border-2 border-cyan-500/80 shadow-2xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/40 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-950 text-cyan-300 border border-cyan-400">
                        ✓ SHIKAI DESPERTA & VINCULADA
                      </span>
                      <h3 className="font-title text-3xl text-white tracking-wider mt-1">
                        {personagem.zanpakuto.shikaiAtiva.nome}
                      </h3>
                      <p className="text-xs text-cyan-300 italic">
                        "{personagem.zanpakuto.shikaiAtiva.comando}"
                      </p>
                    </div>
                    <Badge color={C.blue}>{personagem.zanpakuto.shikaiAtiva.elemento}</Badge>
                  </div>

                  <div className="text-xs space-y-2 text-bleach-creamDim">
                    <p><strong>Manifestação:</strong> {personagem.zanpakuto.shikaiAtiva.aparencia || personagem.zanpakuto.shikaiAtiva.formatoArma}</p>
                    <p><strong>Poder Espiritual:</strong> {personagem.zanpakuto.shikaiAtiva.poder}</p>
                  </div>

                  {/* Sword Art SVG */}
                  <BleachSwordArt
                    arma={personagem.zanpakuto.shikaiAtiva}
                    nomeZk={personagem.zanpakuto.shikaiAtiva.nome}
                    isBankai={false}
                    foto={personagem.zanpakuto.fotoShikai}
                    onUpload={(e) => handleFotoUpload(e, "shikai")}
                  />
                </div>

                {/* Bankai Section */}
                {temBankai ? (
                  <div className="p-5 rounded-2xl bg-black/80 border-2 border-yellow-500/80 bankai-supreme-card shadow-2xl space-y-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-950 text-yellow-300 border border-yellow-400">
                      卍 BANKAI DESPERTA & SOBERANA
                    </span>
                    <h3 className="font-title text-3xl text-yellow-300 tracking-wider">
                      {personagem.zanpakuto.bankaiAtiva.nome}
                    </h3>
                    <p className="text-xs text-yellow-200 italic">"{personagem.zanpakuto.bankaiAtiva.comando}"</p>
                    <p className="text-xs text-bleach-creamDim">{personagem.zanpakuto.bankaiAtiva.poder}</p>

                    <BleachSwordArt
                      arma={personagem.zanpakuto.bankaiAtiva}
                      nomeZk={personagem.zanpakuto.bankaiAtiva.nome}
                      isBankai={true}
                      foto={personagem.zanpakuto.fotoBankai}
                      onUpload={(e) => handleFotoUpload(e, "bankai")}
                    />
                  </div>
                ) : (
                  <div className="p-4 bg-bleach-panel2 rounded-xl border border-yellow-500/30 flex items-center justify-between">
                    <div>
                      <h4 className="font-title text-lg text-yellow-400">Bankai (Liberação Total)</h4>
                      <p className="text-xs text-bleach-creamDim">
                        {podeGerarBankai ? "🔓 Permissão concedida pelo ADM! Clique para realizar o despertar." : "🔒 Bankai selada. Aguarde autorização da Administração."}
                      </p>
                    </div>
                    {podeGerarBankai && (
                      <button
                        onClick={() => abrirFluxoDespertar("bankai")}
                        className="px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold text-xs uppercase rounded-xl shadow"
                      >
                        卍 Despertar Bankai
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center space-y-4 bg-black/60 rounded-2xl border border-bleach-border">
                <div className="text-5xl">🗡️</div>
                <h3 className="font-title text-2xl text-white">LÂMINA SELADA (ASAUCHI)</h3>
                <p className="text-xs text-bleach-creamDim max-w-md mx-auto leading-relaxed">
                  A sua Zanpakutō aguarda a liberação pelo ADM e o registro da cena de despertar para revelar as 4 interpretações autênticas da sua alma.
                </p>

                {podeGerarShikai ? (
                  <button
                    onClick={() => abrirFluxoDespertar("shikai")}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition animate-pulse"
                  >
                    ✨ Iniciar Ritual de Despertar de Shikai (IA)
                  </button>
                ) : (
                  <span className="inline-block px-4 py-2 rounded-lg bg-black text-xs font-mono text-bleach-muted border border-white/10">
                    🔒 Aguardando liberação de Despertar pelo Administrador
                  </span>
                )}
              </div>
            )}
          </Section>
        </div>
      )}

      {/* SUBPAGE: ATRIBUTOS & TREINO */}
      {subPaginaFicha === "atributos" && (
        <div className="space-y-6">
          {/* PONTOS DISPONÍVEIS */}
          {(personagem.pontosDisponiveis || 0) > 0 && (
            <div className="bg-gradient-to-r from-orange-950/60 via-bleach-panel to-orange-950/40 border-2 border-bleach-orange/60 rounded-xl p-5 shadow-2xl reiatsu-glow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-bleach-borderSoft">
                <div>
                  <h4 className="font-title text-2xl text-bleach-orange flex items-center gap-2">
                    <span>✨</span> PONTOS DISPONÍVEIS PARA DISTRIBUIR
                  </h4>
                  <p className="text-xs text-bleach-creamDim">
                    Você possui <strong className="text-bleach-orange">{personagem.pontosDisponiveis}</strong> pontos livres concedidos por treinos e sorteios.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-bleach-creamDim">Distribuir por vez:</span>
                  <div className="flex bg-black/80 border border-bleach-border rounded-xl p-1 gap-1">
                    {[1, 5, 10].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setPassoDistribuicao(step)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-black transition ${
                          passoDistribuicao === step ? "bg-bleach-orange text-black" : "text-bleach-creamDim hover:text-white"
                        }`}
                      >
                        ±{step} pts
                      </button>
                    ))}
                  </div>

                  <div className="bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[11px] text-bleach-creamDim">Restam: </span>
                    <span className="font-bold text-lg text-bleach-orange font-mono">{restante}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {ATTRS.map((a) => {
                  const valAtual = Number(personagem.atributos?.[a.key] || 10);
                  const decStep = Math.min(passoDistribuicao, pend[a.key]);
                  const incStep = Math.min(passoDistribuicao, restante);
                  return (
                    <div key={a.key} className="bg-black/50 border border-bleach-border rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: a.color }}>
                          {a.label}
                        </span>
                        <span className="text-[11px] text-bleach-muted">
                          Atual: <strong className="text-white">{valAtual}</strong>
                          {pend[a.key] > 0 && <span className="text-bleach-orange font-mono ml-1 font-bold">→ {valAtual + pend[a.key]}</span>}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 bg-black/80 p-1 rounded-xl border border-white/10">
                        <button
                          type="button"
                          onClick={() => { const amt = Math.min(passoDistribuicao, pend[a.key]); if (amt > 0) setPend((p) => ({ ...p, [a.key]: p[a.key] - amt })); }}
                          disabled={pend[a.key] === 0}
                          className="px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 hover:border-bleach-orange"
                        >
                          −{passoDistribuicao > 1 ? passoDistribuicao : ""}
                        </button>
                        <span className="min-w-[36px] text-center font-mono font-black text-bleach-orange text-base">+{pend[a.key]}</span>
                        <button
                          type="button"
                          onClick={() => { const amt = Math.min(passoDistribuicao, restante); if (amt > 0) setPend((p) => ({ ...p, [a.key]: p[a.key] + amt })); }}
                          disabled={restante <= 0}
                          className="px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 hover:border-bleach-orange"
                        >
                          +{passoDistribuicao > 1 ? passoDistribuicao : ""}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={confirmarDistribuicao}
                  disabled={pendSum === 0}
                  className="px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 disabled:opacity-40"
                >
                  Confirmar Distribuição ({pendSum} pts)
                </button>
              </div>
            </div>
          )}

          {/* ATTR CARDS */}
          <Section title="Atributos Espirituais" subtitle="O valor puro do seu poder na Sociedade das Almas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ATTRS.map((a) => {
                const val = Number(personagem.atributos?.[a.key] || 10);
                return (
                  <div key={a.key} className="bg-bleach-panel2 border border-bleach-borderSoft rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: a.color }}>{a.label}</h4>
                        <p className="text-[11px] text-bleach-muted">{a.desc}</p>
                      </div>
                      <span className="text-3xl font-extrabold font-mono" style={{ color: a.color }}>{val}</span>
                    </div>
                    <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (val / 200) * 100)}%`, backgroundColor: a.color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* SUBPAGE: KIDOS & TÉCNICAS */}
      {subPaginaFicha === "kidos" && (
        <div className="space-y-6">
          <Section title="Kidō e Técnicas Aprendidas" subtitle="Feitiços dominados pelo Shinigami">
            {(personagem.tecnicas || []).length === 0 ? (
              <p className="text-xs text-bleach-muted">Nenhuma técnica registrada até o momento.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5 mb-4">
                {personagem.tecnicas.map((t) => (
                  <div key={t.id} className="bg-bleach-panel2 border border-bleach-border px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-black text-[10px] font-bold text-bleach-orange uppercase">{t.categoria}</span>
                    <span className="font-semibold text-bleach-cream">{t.nome}</span>
                    {isAdmin && (
                      <button onClick={() => removeTecnica(t.id)} className="text-red-400 hover:text-red-300 font-bold ml-1">×</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-bleach-borderSoft flex flex-wrap gap-2">
                <select value={novaTecCat} onChange={(e) => setNovaTecCat(e.target.value)} className="bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white">
                  {CATEGORIAS_TECNICA.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input type="text" placeholder="Nome da técnica..." value={novaTecNome} onChange={(e) => setNovaTecNome(e.target.value)} className="flex-1 min-w-[180px] bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white" />
                <button onClick={addTecnica} className="px-4 py-2 bg-bleach-panel border border-bleach-border text-bleach-cream hover:border-bleach-orange rounded-lg text-xs font-bold uppercase">+ Adicionar</button>
              </div>
            )}
          </Section>
        </div>
      )}

      {/* SUBPAGE: SORTEIOS & GACHA */}
      {subPaginaFicha === "sorteios" && (
        <div className="space-y-6">
          <Section title="🎁 Sorteios & Roletas de Recompensa" subtitle="Realize seus giros liberados por treinos em ON e missões aprovadas">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-title text-xl tracking-wider text-bleach-orange flex items-center gap-1.5">
                      <span>🎲</span> Sorteio Gacha Comum
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-black text-bleach-orange font-mono font-bold text-xs border border-bleach-border">
                      {personagem.sorteiosComunsRestantes || 0} giros disponíveis
                    </span>
                  </div>
                  <p className="text-xs text-bleach-creamDim mb-3">Sorteia recursos e pontos de atributo graduais.</p>
                </div>
                <button
                  onClick={girarGachaComum}
                  disabled={(personagem.sorteiosComunsRestantes || 0) <= 0}
                  className="w-full py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
                >
                  {(personagem.sorteiosComunsRestantes || 0) > 0 ? "✨ Realizar Sorteio Comum" : "Sem Giros Comuns"}
                </button>
              </div>

              <div className="bg-bleach-panel2 border-2 border-purple-500/40 purple-reiatsu-glow rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-title text-xl tracking-wider text-purple-400 flex items-center gap-1.5">
                      <span>🌟</span> Sorteio de Classe Especial
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-black text-purple-300 font-mono font-bold text-xs border border-purple-500/40">
                      {personagem.sorteiosEspeciaisRestantes || 0} especiais
                    </span>
                  </div>
                  <p className="text-xs text-bleach-creamDim mb-3">Prêmios de alto prestígio e itens sagrados.</p>
                </div>
                <button
                  onClick={girarSorteioEspecial}
                  disabled={(personagem.sorteiosEspeciaisRestantes || 0) <= 0}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
                >
                  {(personagem.sorteiosEspeciaisRestantes || 0) > 0 ? "⚡ Girar Sorteio Especial" : "Sem Giros Especiais"}
                </button>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* SUBPAGE: HISTÓRICO */}
      {subPaginaFicha === "historico" && (
        <div className="space-y-6">
          <Section title="Histórico de Registros" subtitle="Linha do tempo oficial de treinos, missões e conquistas">
            {(personagem.historico || []).length === 0 ? (
              <p className="text-xs text-bleach-muted">Nenhum registro ainda.</p>
            ) : (
              <div className="space-y-3">
                {personagem.historico.slice(0, 25).map((h) => (
                  <div key={h.id} className="border-l-2 border-bleach-orange pl-3 py-1">
                    <div className="text-[10px] text-bleach-muted font-mono">{h.data}</div>
                    <div className="text-xs text-bleach-creamDim mt-0.5">{h.texto}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </div>
      )}

      {/* ADMIN ACTION PANEL (EXCLUSIVE CONTROLS & REWARD DISTRIBUTOR) */}
      {isAdmin && (
        <Section title="Painel de Gestão da Ficha (ADM)" subtitle="Atribuição direta de treinos, distribuição de atributos, giros rápidos e reset">
          <div className="space-y-5">
            
            {/* DISTRIBUIDOR DE RECOMPENSAS DE ATRIBUTOS (RESTORED FULL POWER) */}
            <div className="p-4 bg-gradient-to-r from-black via-bleach-panel2 to-black border-2 border-yellow-500/50 rounded-2xl space-y-3 shadow-xl">
              <div className="flex items-center gap-2 border-b border-yellow-500/30 pb-2">
                <span className="text-lg">✨</span>
                <div>
                  <h4 className="font-title text-base text-yellow-400">DISTRIBUIDOR OFICIAL DE RECOMPENSAS & ATRIBUTOS</h4>
                  <p className="text-[11px] text-bleach-muted">Conceda pontos diretamente em um atributo específico ou para o saldo livre do jogador</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-bleach-creamDim font-bold mb-1 uppercase">Tipo de Atividade / Recompensa</label>
                  <select
                    value={rec.tipo}
                    onChange={(e) => setRec({ ...rec, tipo: e.target.value })}
                    className="w-full bg-black border border-bleach-border rounded-lg p-2 text-white"
                  >
                    {TIPOS_RECOMPENSA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-bleach-creamDim font-bold mb-1 uppercase">Destino da Recompensa</label>
                  <select
                    value={rec.atributo}
                    onChange={(e) => setRec({ ...rec, atributo: e.target.value })}
                    className="w-full bg-black border border-bleach-border rounded-lg p-2 text-white"
                  >
                    <option value="">✨ Pontos Livres (Distribuição do Jogador)</option>
                    <option value="pressao">🌀 Pressão Espiritual (Reiatsu)</option>
                    <option value="forca">⚔️ Força (Zanjutsu & Dano)</option>
                    <option value="velocidade">⚡ Velocidade (Shunpo & Hohō)</option>
                    <option value="resiliencia">🛡️ Resiliência (Vitalidade & Defesa)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-bleach-creamDim font-bold mb-1 uppercase">Quantidade de Pontos</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={rec.pontos}
                      onChange={(e) => setRec({ ...rec, pontos: e.target.value })}
                      className="w-20 bg-black border border-bleach-border rounded-lg p-2 text-white font-mono font-bold"
                    />
                    {[1, 2, 5, 10, 15].map(pts => (
                      <button
                        key={pts}
                        type="button"
                        onClick={() => setRec({ ...rec, pontos: pts })}
                        className="px-2 py-1 bg-bleach-panel border border-bleach-border hover:border-yellow-400 text-bleach-creamDim hover:text-white rounded text-xs font-mono"
                      >
                        +{pts}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-bleach-creamDim font-bold mb-1 uppercase text-xs">Motivo / Justificativa (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Treino em Karakura com 35 linhas de boa qualidade / Missão no Hueco Mundo"
                  value={rec.motivo}
                  onChange={(e) => setRec({ ...rec, motivo: e.target.value })}
                  className="w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={concederRecompensa}
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
                >
                  ✓ Conceder Recompensa ao Personagem
                </button>
              </div>
            </div>

            {/* Quick Roll Addition Buttons */}
            <div className="p-3.5 bg-black/60 border border-bleach-borderSoft rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-bleach-orange uppercase block">Giros Rápidos:</span>
                <p className="text-[11px] text-bleach-muted">Adicione giros comuns ou especiais diretamente na ficha do jogador</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateChar({ sorteiosComunsRestantes: (personagem.sorteiosComunsRestantes || 0) + 1 }, "+1 Giro de Sorteio Comum adicionado pelo ADM")}
                  className="px-3 py-1.5 bg-orange-950 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-lg hover:bg-orange-900"
                >
                  🎲 +1 Giro Comum
                </button>
                <button
                  onClick={() => updateChar({ sorteiosComunsRestantes: (personagem.sorteiosComunsRestantes || 0) + 3 }, "+3 Giros de Sorteio Comum adicionados pelo ADM")}
                  className="px-3 py-1.5 bg-orange-950 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-lg hover:bg-orange-900"
                >
                  🎲 +3 Giros Comuns
                </button>
                <button
                  onClick={() => updateChar({ sorteiosEspeciaisRestantes: (personagem.sorteiosEspeciaisRestantes || 0) + 1 }, "+1 Giro de Sorteio Especial adicionado pelo ADM")}
                  className="px-3 py-1.5 bg-purple-950 border border-purple-400 text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-900"
                >
                  🌟 +1 Giro Especial
                </button>
                <button
                  onClick={() => updateChar({ sorteiosEspeciaisRestantes: (personagem.sorteiosEspeciaisRestantes || 0) + 2 }, "+2 Giros de Sorteio Especial adicionados pelo ADM")}
                  className="px-3 py-1.5 bg-purple-950 border border-purple-400 text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-900"
                >
                  🌟 +2 Giros Especiais
                </button>
              </div>
            </div>

            {/* Permissions & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={togglePermissaoShikai}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${
                    personagem?.permissoes?.shikaiLiberada ? "bg-red-950 border-red-500 text-red-300" : "bg-blue-950 border-cyan-400 text-cyan-300"
                  }`}
                >
                  {personagem?.permissoes?.shikaiLiberada ? "🔒 Revogar Permissão de Shikai" : "🔓 Liberar Despertar de Shikai"}
                </button>

                <button
                  onClick={togglePermissaoBankai}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${
                    personagem?.permissoes?.bankaiLiberada ? "bg-red-950 border-red-500 text-red-300" : "bg-amber-950 border-amber-400 text-yellow-300"
                  }`}
                >
                  {personagem?.permissoes?.bankaiLiberada ? "🔒 Revogar Permissão de Bankai" : "🔓 Liberar Despertar de Bankai"}
                </button>
              </div>

              {/* Danger Reset Button */}
              <button
                onClick={() => setShowResetModal(true)}
                className="px-4 py-2 bg-red-950 border-2 border-red-500 hover:bg-red-900 text-red-200 font-extrabold text-xs uppercase rounded-lg shadow transition"
              >
                ⚠️ Resetar Ficha para o Início
              </button>
            </div>
          </div>
        </Section>
      )}

      {/* GACHA OPENING MODAL */}
      {gachaModal && (
        <SpiritualChestModal
          modal={gachaModal}
          onClose={() => setGachaModal(null)}
          onColetar={confirmarColetaDrop}
        />
      )}

      {/* AWAKENING SCENE SUBMISSION MODAL */}
      {showCenaModal && (
        <AwakeningSceneModal
          open={!!showCenaModal}
          tipo={showCenaModal}
          personagem={personagem}
          onClose={() => setShowCenaModal(null)}
          onSubmitScene={submeterCenaDespertar}
        />
      )}

      {/* ZANPAKUTO 4 PATHS RITUAL MODAL */}
      {showZanpakutoAIModal && (
        <Zanpakuto4PathsModal
          open={showZanpakutoAIModal}
          tipo={aiZkTipo}
          caminhos={aiZkOpcoes}
          personagem={personagem}
          onEscolherCaminho={escolherCaminhoEspiritual}
          onClose={() => setShowZanpakutoAIModal(false)}
        />
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-bleach-panel border-2 border-red-500 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="text-4xl">⚠️</div>
            <h3 className="font-title text-2xl text-red-400">RESET TOTAL DE FICHA</h3>
            <p className="text-xs text-bleach-creamDim leading-relaxed">
              Tem certeza que quer resetar integralmente a ficha de <strong className="text-white">{personagem.nome}</strong> para o estado inicial?
            </p>
            <div className="text-[11px] text-left p-3 bg-black/60 rounded-xl border border-red-500/30 text-bleach-muted space-y-1">
              <div>• Atributos retornam para o padrão (10 em cada).</div>
              <div>• Saldo de pontos livres retorna para 20.</div>
              <div>• Giros comuns voltam para 2, especiais para 0.</div>
              <div>• <strong>Shikai e Bankai serão completamente apagadas</strong> e desvinculadas do registro global.</div>
              <div>• Trava de personalidade e histórico serão redefinidos.</div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 py-2.5 bg-bleach-panel2 border border-bleach-border text-xs text-white rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarResetFicha}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase rounded-lg shadow"
              >
                Sim, Resetar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// =========================================================================
// VIEWS PART 3: ADMIN PANEL, RICH SISTEMAS VIEW & APP MOUNT
// =========================================================================

// TAB: PAINEL DE CONTROLE DA ADMINISTRAÇÃO
function AdminPanel({ db, saveDb, session, cloudStatus, onAbrirFicha }) {
  const isSuper = session?.role === "super_admin";
  const [tabAdm, setTabAdm] = useState("fichas");
  const [novoSubUser, setNovoSubUser] = useState("");
  const [novoSubPass, setNovoSubPass] = useState("");
  const [novoSubNome, setNovoSubNome] = useState("");
  const [novoSubCargo, setNovoSubCargo] = useState("Avaliador de Cenas & Fichas");

  // Dados para Novo Personagem
  const [novoNome, setNovoNome] = useState("");
  const [novoWhats, setNovoWhats] = useState("");
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novoRaca, setNovoRaca] = useState("Shinigami");
  const [novoEsquadrao, setNovoEsquadrao] = useState("11º Esquadrão");

  // Dados de Rolagem de Dados
  const [dadoTipo, setDadoTipo] = useState("d20");
  const [dadoChar, setDadoChar] = useState(db.personagens?.[0]?.nome || "Geral");

  function criarPersonagem(e) {
    e.preventDefault();
    if (!novoNome.trim() || !novoCodigo.trim()) {
      alert("Nome e Código de Acesso são obrigatórios!");
      return;
    }

    const novoP = {
      id: "char-" + uid(),
      nome: novoNome.trim(),
      foto: "assets/ichigo-orange.png",
      whatsapp: novoWhats.trim(),
      codigo: novoCodigo.trim(),
      raca: novoRaca,
      esquadrao: novoEsquadrao,
      faceclaim: novoNome.trim(),
      idadePlayer: "20",
      aniversarioPlayer: "01/01",
      idadeChar: "18",
      aniversarioChar: "15/07",
      pontosDisponiveis: 20,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      permissoes: { shikaiLiberada: false, bankaiLiberada: false },
      atributos: { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 },
      kidosConhecidos: [
        { id: "h4", numero: 4, nome: "Byakurai", cat: "Hadō", custoReiatsu: 3 },
        { id: "b1", numero: 1, nome: "Sai", cat: "Bakudō", custoReiatsu: 2 }
      ],
      tecnicas: [
        { id: uid(), nome: "Hadō #4 — Byakurai", categoria: "Hadō" },
        { id: uid(), nome: "Bakudō #1 — Sai", categoria: "Bakudō" }
      ],
      personalidade: { texto: "", virtudes: "", defeitos: "", desejos: "", medos: "", conflitos: "", estiloCombate: "" },
      personalidadeTravada: false,
      cenaDespertarShikai: "",
      cenaDespertarBankai: "",
      zanpakuto: {
        nome: "Em despertar",
        fotoShikai: "assets/ichigo-orange.png",
        fotoBankai: "assets/ichigo-moon.png",
        shikaiAtiva: null,
        bankaiAtiva: null,
        bankaiPadrao: null,
        shikaiEscolhida: false,
        bankaiEscolhida: false,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{ id: uid(), data: nowStr(), texto: "Ficha criada e aprovada pela Administração." }]
    };

    saveDb({ ...db, personagens: [...(db.personagens || []), novoP] });
    setNovoNome("");
    setNovoWhats("");
    setNovoCodigo("");
    playReiatsuSound('win');
    alert(`Personagem ${novoP.nome} criado com sucesso!`);
  }

  function apagarPersonagem(charId, charNome) {
    const confirma = confirm(`⚠️ Tem certeza absoluta que deseja excluir a ficha de ${charNome}?\n\nIsso apagará todos os dados, revogará qualquer login ativo e liberará a Zanpakutō no banco de dados.`);
    if (!confirma) return;

    const novosP = (db.personagens || []).filter(p => p.id !== charId);
    const novasZk = (db.zanpakutosVinculadas || []).filter(z => z.charId !== charId && z.charNome !== charNome);

    saveDb({ ...db, personagens: novosP, zanpakutosVinculadas: novasZk });
    playReiatsuSound('shatter');
    alert(`A ficha de ${charNome} foi excluída e a sessão do jogador foi revogada com sucesso.`);
  }

  function adicionarSubAdm(e) {
    e.preventDefault();
    if (!novoSubUser.trim() || !novoSubPass.trim() || !novoSubNome.trim()) {
      alert("Preencha todos os campos do sub-administrador.");
      return;
    }
    const novoSub = {
      id: "adm-" + uid(),
      usuario: novoSubUser.trim().toLowerCase(),
      senha: novoSubPass.trim(),
      nome: novoSubNome.trim(),
      cargo: novoSubCargo
    };
    saveDb({ ...db, subAdms: [...(db.subAdms || []), novoSub] });
    setNovoSubUser("");
    setNovoSubPass("");
    setNovoSubNome("");
    alert(`Sub-administrador ${novoSub.nome} adicionado com sucesso!`);
  }

  function removerSubAdm(subId) {
    if (!confirm("Deseja remover este avaliador?")) return;
    saveDb({ ...db, subAdms: (db.subAdms || []).filter(s => s.id !== subId) });
  }

  function rolarDadoPublico() {
    const lados = dadoTipo === "d20" ? 20 : dadoTipo === "d100" ? 100 : 10;
    const res = Math.floor(Math.random() * lados) + 1;
    let cat = "Sucesso Regular";
    if (dadoTipo === "d20") {
      if (res === 20) cat = "🌟 Sucesso Crítico Absoluto (20)";
      else if (res >= 16) cat = "✨ Extremo Sucesso (+80%)";
      else if (res >= 10) cat = "✓ Sucesso Médio (+50%)";
      else if (res === 1) cat = "💀 Falha Crítica (Desastre 1)";
      else cat = "✗ Falha";
    }

    const rollLog = {
      id: uid(),
      autor: session?.nome || "ADM",
      personagem: dadoChar,
      dado: dadoTipo,
      resultado: res,
      categoria: cat,
      data: nowStr()
    };

    saveDb({ ...db, rolagensDadosPublicas: [rollLog, ...(db.rolagensDadosPublicas || []).slice(0, 30)] });
    playReiatsuSound('roll');
  }

  return (
    <div className="space-y-6">
      <div className="bg-banner-overlay border-2 border-yellow-500/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-yellow-950 border border-yellow-400 text-yellow-300 text-xs font-bold rounded-full uppercase tracking-wider">
              👑 Painel Central de Comando • {isSuper ? "Comandante Supremo (ADM Máximo)" : "Avaliador Autorizado"}
            </span>
            <h2 className="font-title text-3xl sm:text-4xl tracking-widest text-yellow-400 mt-2">
              GERENCIADOR DE FICHAS & NARRATIVA
            </h2>
            <p className="text-xs text-bleach-creamDim mt-1">
              Crie, gerencie, recompense e fiscalize todas as fichas e combates do RPG.
            </p>
          </div>

          <div className="flex gap-2">
            {["fichas", "novo", "subadms", "dados"].map(t => (
              <button
                key={t}
                onClick={() => setTabAdm(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  tabAdm === t ? "bg-yellow-500 text-black font-extrabold shadow" : "bg-black/60 border border-yellow-500/30 text-yellow-200"
                }`}
              >
                {t === "fichas" ? "Fichas" : t === "novo" ? "+ Criar" : t === "subadms" ? "Avaliadores" : "Dados"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUBTAB: LISTA DE FICHAS */}
      {tabAdm === "fichas" && (
        <Section title="Fichas de Shinigamis Registradas" subtitle="Clique para abrir e gerenciar qualquer personagem">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(db.personagens || []).map((p) => {
              const temShikai = !!p?.zanpakuto?.shikaiAtiva;
              const temBankai = !!p?.zanpakuto?.bankaiAtiva;
              return (
                <div key={p.id} className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={p.foto || 'assets/ichigo-orange.png'} className="w-12 h-12 rounded-lg object-cover border border-bleach-border" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{p.nome}</h4>
                      <p className="text-[11px] text-bleach-muted">Código: <strong className="text-yellow-400 font-mono">{p.codigo}</strong></p>
                      <div className="text-[10px] text-bleach-muted flex gap-2 mt-0.5">
                        <span>PTS: <strong className="text-bleach-orange">{p.pontosDisponiveis || 0}</strong></span>
                        <span>COM: <strong className="text-white">{p.sorteiosComunsRestantes || 0}</strong></span>
                        <span>ESP: <strong className="text-purple-300">{p.sorteiosEspeciaisRestantes || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {temShikai ? <span className="px-2 py-0.5 bg-blue-950 text-cyan-300 rounded border border-cyan-500">🗡️ {p.zanpakuto.shikaiAtiva.nome}</span> : <span className="px-2 py-0.5 bg-black text-bleach-muted rounded">Lâmina Selada</span>}
                    {temBankai && <span className="px-2 py-0.5 bg-amber-950 text-yellow-300 rounded border border-amber-500">卍 Bankai</span>}
                    {p.personalidadeTravada && <span className="px-2 py-0.5 bg-green-950 text-green-300 rounded">🔒 DNA Selado</span>}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onAbrirFicha(p.id)}
                      className="flex-1 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-lg shadow"
                    >
                      ✏️ Gerenciar Ficha
                    </button>
                    <button
                      onClick={() => apagarPersonagem(p.id, p.nome)}
                      className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-lg"
                      title="Excluir Ficha"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* SUBTAB: CRIAR NOVO PERSONAGEM */}
      {tabAdm === "novo" && (
        <Section title="Cadastrar Nova Ficha de Shinigami" subtitle="Preencha os dados iniciais para gerar a ficha e código de acesso">
          <form onSubmit={criarPersonagem} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">Nome do Personagem *</label>
                <input type="text" placeholder="Ex: Zaraki Kenji" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">Código de Acesso (Senha) *</label>
                <input type="text" placeholder="Ex: ZAR-9901" value={novoCodigo} onChange={(e) => setNovoCodigo(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white font-mono" />
              </div>
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">WhatsApp (Opcional)</label>
                <input type="text" placeholder="Ex: 11988887777" value={novoWhats} onChange={(e) => setNovoWhats(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white" />
              </div>
              <div>
                <label className="block text-bleach-creamDim font-bold mb-1">Esquadrão</label>
                <input type="text" value={novoEsquadrao} onChange={(e) => setNovoEsquadrao(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white" />
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg">
              ✨ Criar Ficha com 20 Pts Iniciais & 2 Giros
            </button>
          </form>
        </Section>
      )}

      {/* SUBTAB: SUB-ADMS */}
      {tabAdm === "subadms" && isSuper && (
        <Section title="Gerenciador de Avaliadores & Sub-Administradores" subtitle="Cadastre avaliadores com senhas individuais">
          <form onSubmit={adicionarSubAdm} className="p-4 bg-black/60 rounded-xl border border-yellow-500/40 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-6">
            <div>
              <label className="block text-yellow-300 font-bold mb-1">Nome do Avaliador</label>
              <input type="text" placeholder="Ex: Mestre Kisuke" value={novoSubNome} onChange={(e) => setNovoSubNome(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white" />
            </div>
            <div>
              <label className="block text-yellow-300 font-bold mb-1">Usuário</label>
              <input type="text" placeholder="Ex: kisuke" value={novoSubUser} onChange={(e) => setNovoSubUser(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono" />
            </div>
            <div>
              <label className="block text-yellow-300 font-bold mb-1">Senha</label>
              <input type="password" placeholder="••••••" value={novoSubPass} onChange={(e) => setNovoSubPass(e.target.value)} className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded shadow">
                + Adicionar
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {(db.subAdms || []).map(s => (
              <div key={s.id} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-lg flex justify-between items-center text-xs">
                <div>
                  <strong className="text-white block">{s.nome}</strong>
                  <span className="text-[11px] text-bleach-muted">Usuário: <code className="text-yellow-400">{s.usuario}</code> | Cargo: {s.cargo}</span>
                </div>
                <button onClick={() => removerSubAdm(s.id)} className="text-red-400 hover:text-red-300 font-bold">Remover</button>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* SUBTAB: ROLAGEM DE DADOS */}
      {tabAdm === "dados" && (
        <Section title="Mesa de Rolagem de Dados de Alta Tensão" subtitle="Rolagens públicas de d20 e d100 para julgamento de cenas">
          <div className="p-4 bg-black/60 rounded-xl border border-bleach-border flex flex-wrap gap-3 items-center mb-6">
            <select value={dadoTipo} onChange={(e) => setDadoTipo(e.target.value)} className="bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white">
              <option value="d20">🎲 Dado d20 (Testes & Combate)</option>
              <option value="d100">🎲 Dado d100 (Porcentagens)</option>
              <option value="d10">🎲 Dado d10 (Escalas Rápidas)</option>
            </select>

            <select value={dadoChar} onChange={(e) => setDadoChar(e.target.value)} className="bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white">
              <option value="Geral">Personagem: Geral</option>
              {(db.personagens || []).map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
            </select>

            <button onClick={rolarDadoPublico} className="px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-red-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:brightness-110">
              🎲 Rolar Dado em Público
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {(db.rolagensDadosPublicas || []).map(d => (
              <div key={d.id} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-white">{d.personagem}</span>
                  <span className="text-bleach-muted ml-2 font-mono">({d.dado}) — Por {d.autor}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-base font-black text-bleach-orange mr-2">{d.resultado}</span>
                  <span className="text-[11px] text-yellow-300 font-bold">{d.categoria}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// RICH SISTEMAS & REGRAS VIEW (COMPLETE ORIGINAL SYSTEMS RESTORED)
function SistemasView() {
  const [tabSis, setTabSis] = useState("atributos");

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider">
            Regulamento Oficial da Sociedade das Almas • Versão 2026
          </span>
          <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-bleach-cream mt-3 reiatsu-text-glow">
            COMPÊNDIO DE SISTEMAS & MECÂNICAS
          </h2>
          <p className="text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed">
            Consulte todas as diretrizes oficiais de atributos, treinos em ON, roletas de sorteio, individualização de Zanpakutōs e regras de conjuração de Kidō.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-bleach-borderSoft pb-2">
        {[
          { id: "atributos", label: "Atributos & Patamares", icon: "⚡" },
          { id: "treinos", label: "Treinos em ON & Ganhos", icon: "✍️" },
          { id: "sorteios", label: "Sorteios & Roletas", icon: "🎁" },
          { id: "zanpakuto", label: "Zanpakutō & 33 Regras de IA", icon: "🗡️" },
          { id: "kidos", label: "Kidō & Encantamentos", icon: "📕" },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTabSis(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition whitespace-nowrap flex items-center gap-2 ${
              tabSis === t.id ? "bg-bleach-orange text-black font-extrabold shadow-lg" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ABA 1: ATRIBUTOS & PATAMARES */}
      {tabSis === "atributos" && (
        <div className="space-y-6">
          <Section title="Os 4 Atributos Primários da Alma" subtitle="A base estrutural do poder de todo Shinigami">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ATTRS.map(a => (
                <div key={a.key} className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                  <h4 className="font-bold text-sm uppercase tracking-wider" style={{ color: a.color }}>{a.label}</h4>
                  <p className="text-xs text-bleach-creamDim leading-relaxed">{a.desc}</p>
                  <div className="text-[11px] text-bleach-muted pt-1 border-t border-white/5">
                    {a.key === "pressao" && "Determina a quantidade máxima de Kidōs por cena, o alcance de percepção sensorial e a resistência contra supressões espirituais."}
                    {a.key === "forca" && "Governa a potência do Zanjutsu (esgrima) e Hakuda (combate desarmado), além do impacto de cortes e colisões físicas."}
                    {a.key === "velocidade" && "Rege a velocidade de locomoção, reflexos de combate, capacidade de esquiva e a maestria na técnica de Hohō/Shunpo."}
                    {a.key === "resiliencia" && "Controla a vitalidade do corpo espiritual (Hakusui e Saketsu), absorção de impacto, resistência a ferimentos e fadiga."}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Escala Oficial de Patamares de Poder" subtitle="A hierarquia espiritual da Sociedade das Almas">
            <div className="space-y-3">
              {[
                { faixa: "1 a 10 pts", titulo: "Inexperiente", desc: "Aluno recém-ingressado na Academia Shinō.", cor: C.muted },
                { faixa: "11 a 30 pts", titulo: "Iniciante", desc: "Oficial subalterno, combatente raso de Esquadrão.", cor: C.green },
                { faixa: "31 a 60 pts", titulo: "Treinado", desc: "Oficial de Assento (10º ao 4º Oficial), experiente em missões no Mundo Humano.", cor: C.blue },
                { faixa: "61 a 100 pts", titulo: "Veterano", desc: "3º Oficial ou Tenente de Esquadrão; maestria de Shikai e combate de alta escala.", cor: C.purple },
                { faixa: "101 a 150 pts", titulo: "Mestre", desc: "Capitão do Gotei 13; domínio pleno de Bankai e liderança militar absoluta.", cor: C.yellow },
                { faixa: "150+ pts", titulo: "Transcendental", desc: "Nível Divisão Zero / Guarda Real / Força Primordial do Seireitei.", cor: "#FFD700" }
              ].map(tier => (
                <div key={tier.titulo} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded font-mono font-bold text-xs bg-black text-white border border-white/10">{tier.faixa}</span>
                    <div>
                      <h5 className="font-bold text-xs uppercase" style={{ color: tier.cor }}>{tier.titulo}</h5>
                      <p className="text-[11px] text-bleach-muted">{tier.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ABA 2: TREINOS EM ON */}
      {tabSis === "treinos" && (
        <div className="space-y-6">
          <Section title="Sistema de Treinos em ON & Ganhos" subtitle="Diretrizes para progressão de atributos através de roleplay">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <div className="p-4 bg-bleach-panel2 border-l-4 border-bleach-orange rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-bleach-orange uppercase">📜 Treino Básico em ON (30 Linhas)</h4>
                <p>O jogador que narrar uma cena individual de treino focada e bem estruturada com no mínimo <strong>30 linhas</strong> no grupo oficial receberá:</p>
                <ul className="list-disc list-inside space-y-1 text-white font-mono">
                  <li>+1 Ponto Livre de Atributo (ou em atributo treinado)</li>
                  <li>+4 Giros de Sorteio Comum</li>
                  <li>+1 Giro de Sorteio Especial</li>
                </ul>
              </div>

              <div className="p-4 bg-bleach-panel2 border-l-4 border-cyan-400 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-cyan-400 uppercase">⚡ Cenas de Arco & Missões Principais (90+ Linhas)</h4>
                <p>Cenas profundas de desenvolvimento de arco ou missões narradas com <strong>90 linhas ou mais</strong> concedem automaticamente <strong>+15 Pontos de Atributo Garantidos</strong> e pacotes especiais de roletas de bonificação após avaliação do ADM.</p>
              </div>

              <div className="p-4 bg-bleach-panel2 border-l-4 border-purple-400 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-purple-400 uppercase">⚔️ Combates em ON & Arbitragem</h4>
                <p>Combates na Arena são julgados por turnos com apoio de rolagens públicas de d20. A vitória e a criatividade tática rendem pontos proporcionais definidos pelo Juiz da Arena.</p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ABA 3: SORTEIOS & ROLETAS */}
      {tabSis === "sorteios" && (
        <div className="space-y-6">
          <Section title="Probabilidades do Sorteio Gacha Comum" subtitle="Tabela estatística oficial de drops para cada giro comum">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {RARIDADES_COMUNS.map(r => (
                <div key={r.nome} className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs uppercase" style={{ color: r.cor }}>{r.nome}</span>
                    <span className="font-mono text-xs font-bold text-white">{r.chanceStr}</span>
                  </div>
                  <p className="text-[11px] text-bleach-creamDim leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Catálogo de Recompensas do Sorteio Especial" subtitle="Itens sagrados, elixires nobres e despertar narrativo supremo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {RECOMPENSAS_ESPECIAIS.map(item => (
                <div key={item.id} className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl flex justify-between items-start gap-2">
                  <div>
                    <h5 className="font-bold text-xs" style={{ color: item.cor }}>{item.nome}</h5>
                    <p className="text-[11px] text-bleach-muted mt-0.5">{item.desc}</p>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black text-white shrink-0">
                    {item.chanceStr}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>
      )}

      {/* ABA 4: ZANPAKUTO & 33 REGRAS */}
      {tabSis === "zanpakuto" && (
        <div className="space-y-6">
          <Section title="Motor Definitivo de Individualização Espiritual (33 Regras)" subtitle="Como a IA gera armas 100% únicas e exclusivas a partir do DNA da alma">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <p>Nenhuma Zanpakutō na Sociedade das Almas pode ser duplicada ou genérica. O motor de IA utiliza a <strong>Personalidade Selada</strong>, virtudes, fraquezas e estilo de combate para sintetizar simultaneamente <strong>4 Caminhos Espirituais</strong>:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-bleach-panel2 border border-red-500/40 rounded-xl space-y-1">
                  <strong className="text-red-400 block font-bold">1. Caminho Elemental / Temperamento (~45%)</strong>
                  <p>Alinhado diretamente à psicologia dominante do personagem (Chamas, Raios, Sombras, Vento, Gelo, Gravidade).</p>
                </div>
                <div className="p-3 bg-bleach-panel2 border border-blue-500/40 rounded-xl space-y-1">
                  <strong className="text-cyan-400 block font-bold">2. Caminho Conceitual / Progressivo (~20%)</strong>
                  <p>Baseado em regras, estágios, ciclos de carga, contadores e mecânicas táticas de acúmulo.</p>
                </div>
                <div className="p-3 bg-bleach-panel2 border border-purple-500/40 rounded-xl space-y-1">
                  <strong className="text-purple-400 block font-bold">3. Caminho Compensatório / Complementar</strong>
                  <p>Fornece exatamente o recurso que falta na anatomia tática do personagem para cobrir suas fraquezas.</p>
                </div>
                <div className="p-3 bg-bleach-panel2 border border-amber-500/40 rounded-xl space-y-1">
                  <strong className="text-yellow-400 block font-bold">4. Caminho Opositivo / Experimental</strong>
                  <p>Subverte a expectativa: manifesta o paradoxo inconsciente e a sombra da alma do Shinigami.</p>
                </div>
              </div>

              <div className="p-3.5 bg-black/60 border border-yellow-500/40 rounded-xl text-[11px] text-yellow-200">
                <strong>🛡️ Regra de Exclusividade & Anti-Duplicação:</strong> Cada arma escolhida recebe uma Assinatura Espiritual única (`zk-sig-...`) e é registrada no catálogo global. Duplicatas com mais de 60% de similaridade são bloqueadas pelo sistema.
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ABA 5: KIDOS & ENCANTAMENTOS */}
      {tabSis === "kidos" && (
        <div className="space-y-6">
          <Section title="Grimório & Regras de Conjuração de Kidō" subtitle="Diretrizes para o uso de magias espirituais em combate e cenas">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-cyan-400 uppercase">⚡ Limite de Feitiços por Cena</h4>
                <p>A quantidade máxima de feitiços que um Shinigami pode conjurar em uma mesma cena é calculada pela fórmula:</p>
                <div className="p-2.5 bg-black rounded font-mono text-center text-bleach-orange font-bold text-sm">
                  Máximo de Kidōs = Math.max(3, Math.floor(Pressão Espiritual / 7) + 1)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl space-y-1">
                  <strong className="text-red-300 block font-bold">Hadō (Destruição)</strong>
                  <p className="text-[11px]">Feitiços ofensivos de dano direto, calor, eletricidade e impacto cinético.</p>
                </div>
                <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-xl space-y-1">
                  <strong className="text-cyan-300 block font-bold">Bakudō (Aprisionamento)</strong>
                  <p className="text-[11px]">Feitiços de contenção, barreiras reflexivas, rastreamento e supressão de movimento.</p>
                </div>
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl space-y-1">
                  <strong className="text-emerald-300 block font-bold">Kaidō (Cura)</strong>
                  <p className="text-[11px]">Técnicas médicas de regeneração de tecidos e restauração de canais de Reiatsu.</p>
                </div>
              </div>

              <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl space-y-1 text-[11px]">
                <strong className="text-white block font-bold">📜 Eishōhaki (Abandono de Encantamento):</strong>
                <p>Conjurar um Kidō sem recitar o encantamento reduz o tempo de conjuração pela metade, porém diminui a potência do feitiço em aproximadamente um terço. Recitar o encantamento completo libera 100% do poder destrutivo da magia.</p>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}



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
