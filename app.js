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
  desc: "Reiatsu, poder espiritual e percepção"
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

// Gacha Pools
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
const RECOMPENSAS_ESPECIAIS = [{
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
}, {
  id: "esp-inter-1",
  nome: "💎 Fragmento Bruto de Cristal Espiritual",
  raridade: "Incomum Especial",
  peso: 90,
  cor: C.blue,
  desc: "Um cristal translúcido que ressoa com o Reiryoku nativo (+8 pontos).",
  tipo: "pontos",
  valor: 8,
  chanceStr: "9%"
}, {
  id: "esp-inter-2",
  nome: "📜 Tomo Antigo de Hadō & Bakudō",
  raridade: "Incomum Especial",
  peso: 80,
  cor: C.blue,
  desc: "Anotações perdidas sobre o controle dos primeiros números de Kidō (+10 pontos).",
  tipo: "pontos",
  valor: 10,
  chanceStr: "8%"
}, {
  id: "esp-inter-3",
  nome: "🍵 Chá Imperial da Família Kuchiki",
  raridade: "Incomum Especial",
  peso: 70,
  cor: C.blue,
  desc: "Uma iguaria reservada aos nobres que acalma a mente e purifica a pressão (+12 pontos).",
  tipo: "pontos",
  valor: 12,
  chanceStr: "7%"
}, {
  id: "esp-avanc-1",
  nome: "🍶 Saquê Espiritual Centenário de Kyoraku",
  raridade: "Rara Especial",
  peso: 45,
  cor: C.purple,
  desc: "Uma infusão lendária que expande os horizontes da percepção espiritual (+14 pontos).",
  tipo: "pontos",
  valor: 14,
  chanceStr: "4.5%"
}, {
  id: "esp-avanc-2",
  nome: "⚙️ Núcleo Condensador de Reishi de Mayuri",
  raridade: "Rara Especial",
  peso: 40,
  cor: C.purple,
  desc: "Dispositivo experimental capaz de acelerar a absorção de partículas espirituais (+16 pontos).",
  tipo: "pontos",
  valor: 16,
  chanceStr: "4.0%"
}, {
  id: "esp-avanc-3",
  nome: "🥋 Vestimenta Sagrada do Clã Shihōin",
  raridade: "Rara Especial",
  peso: 35,
  cor: C.purple,
  desc: "Tecido espiritual ultraleve que eleva reflexos e destreza física (+18 pontos).",
  tipo: "pontos",
  valor: 18,
  chanceStr: "3.5%"
}, {
  id: "esp-suprema",
  nome: "🌟 Missão Narrativa Suprema de Despertar Único",
  raridade: "Lendária Especial",
  peso: 10,
  cor: C.yellow,
  desc: "Uma convocação do Capitão-Comandante que confere +25 pontos de atributo, 1 Tomo de Kidō Proibido e o direito imediato a uma missão de arco prioritária.",
  tipo: "lendario",
  valor: 25,
  chanceStr: "1.0% (1 em 100)"
}];
const MASTER_ZANPAKUTO_CATALOG = [{
  "id": "zk-01-kurotsubaki",
  "nome": "Kurotsubaki",
  "kanji": "黒椿",
  "traducao": "Camélia Negra",
  "elemento": "Inércia, Pétalas Negras & Absorção Cinética",
  "comando": "Floresça no silêncio, Kurotsubaki",
  "espirito": "Uma mulher alta, de aparência madura, vestida com um quimono preto coberto por pétalas de camélia. Seu rosto é parcialmente escondido por um véu. Ela passa a maior parte do tempo sentada em um jardim completamente sem cor, cuidando de uma única árvore.",
  "formaSelada": "Katana de guarda circular no formato de flor de camélia e bainha de laca negra fosca.",
  "formatoArma": "Espada fina e negra com guarda circular semelhante a uma flor. Pétalas negras suspensas no ar.",
  "poder": "Jardim do Último Instante: As pétalas absorvem o movimento de qualquer coisa que tocam. Golpes perdem velocidade e flechas quase param. Limite: as pétalas só armazenam uma quantidade limitada de movimento antes de desaparecerem.",
  "limitacoes": "Capacidade máxima de absorção por pétala; exige reposicionamento para cobrir ângulos.",
  "bankaiNome": "Kurotsubaki — Shūen Teien",
  "bankaiKanji": "黒椿・終焉庭園",
  "bankaiTraducao": "Jardim do Fim",
  "bankaiComando": "Bankai — Kurotsubaki, Shūen Teien!",
  "bankaiForma": "Todas as pétalas se transformam em árvores negras gigantescas. O campo vira um jardim silencioso.",
  "bankaiPoder": "Redistribuição Cinética Total: Retira velocidade de ataques e movimentos inimigos e transfere instantaneamente para os golpes e estocadas do usuário.",
  "bankaiLimitacoes": "Exige que o usuário mantenha o equilíbrio cinético entre absorção e liberação.",
  "indices": {
    "potencia": 8,
    "alcance": 9,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 6
  }
}, {
  "id": "zk-02-akagane",
  "nome": "Akagane",
  "kanji": "赤鋼",
  "traducao": "Aço Vermelho",
  "elemento": "Metalurgia Cinética & Armadura de Impacto",
  "comando": "Forje aquilo que ainda não existe, Akagane",
  "espirito": "Um ferreiro gigantesco sem rosto, com o corpo coberto por placas metálicas e um enorme avental. Em vez de mãos, possui martelos. Ele nunca fala; responde apenas golpeando uma bigorna.",
  "formaSelada": "Lâmina pesada de aço avermelhado com acabamento rústico de forja.",
  "formatoArma": "Placas metálicas vermelhas que envolvem o braço direito, formando manopla e antebraço blindado.",
  "poder": "Memória do Impacto: Cada golpe recebido pela armadura acumula energia cinética para ser liberada no próximo ataque. Se acumular em excesso sem golpear, a armadura sobrecarrega o usuário.",
  "limitacoes": "Necessidade de receber impactos para carregar; risco de sobrecarga se não descarregar.",
  "bankaiNome": "Akagane — Hyakurenro",
  "bankaiKanji": "赤鋼・百錬炉",
  "bankaiTraducao": "Forja das Cem Temperas",
  "bankaiComando": "Bankai — Akagane, Hyakurenro!",
  "bankaiForma": "Armadura completa cobrindo todo o corpo com uma enorme fornalha espiritual acesa nas costas.",
  "bankaiPoder": "Refino de Energia: Converte a energia acumulada dos impactos recebidos diretamente em força, velocidade, resistência ou impulso contínuo enquanto se mantém lutando.",
  "bankaiLimitacoes": "A energia se dissipa se o usuário interromper o combate por muito tempo.",
  "indices": {
    "potencia": 9,
    "alcance": 4,
    "complexidade": 6,
    "versatilidade": 8,
    "custo": 7
  }
}, {
  "id": "zk-03-suisen",
  "nome": "Suisen",
  "kanji": "水仙",
  "traducao": "Narciso",
  "elemento": "Espelhos Líquidos & Ilusão de Movimento",
  "comando": "Olhe para si mesmo, Suisen",
  "espirito": "Um garoto extremamente pálido, vestido como um bailarino, que vive em um salão cheio de espelhos cobertos por água.",
  "formaSelada": "Katana elegante com acabamento prateado espelhado e tsuba translúcida.",
  "formatoArma": "Espada extremamente fina e prateada com lâmina de aspecto líquido que distorce reflexos.",
  "poder": "Reflexo Falso: Cria cópias ilusórias de movimentos recém-realizados para confundir a percepção do adversário.",
  "limitacoes": "As cópias não possuem massa ou dano real, servindo como distração perceptiva.",
  "bankaiNome": "Suisen — Senkyō Kairō",
  "bankaiKanji": "水仙・千鏡回廊",
  "bankaiTraducao": "Corredor das Mil Imagens",
  "bankaiComando": "Bankai — Suisen, Senkyō Kairō!",
  "bankaiForma": "O campo se transforma em um enorme corredor de espelhos líquidos flutuantes.",
  "bankaiPoder": "Troca Espelho-Posicional: O usuário pode trocar de posição quase que instantaneamente com qualquer reflexo criado no campo de batalha.",
  "bankaiLimitacoes": "Cada troca consome e destrói o espelho utilizado.",
  "indices": {
    "potencia": 6,
    "alcance": 8,
    "complexidade": 8,
    "versatilidade": 9,
    "custo": 5
  }
}, {
  "id": "zk-04-hoshikuzu",
  "nome": "Hoshikuzu",
  "kanji": "星屑",
  "traducao": "Poeira Estelar",
  "elemento": "Órbitas Luminosas & Trajetória Curva",
  "comando": "Desperte no céu, Hoshikuzu",
  "espirito": "Uma pequena criatura humanoide coberta por um manto azul-escuro contendo um céu estrelado.",
  "formaSelada": "Wakizashi fina com detalhes estelares dourados no cabo.",
  "formatoArma": "Dezenas de pequenos cristais luminosos que orbitam o usuário em trajetórias curvas impossíveis.",
  "poder": "Órbita: Fragmentos que alteram trajetórias de voo no ar e traçam linhas de corte não-lineares.",
  "limitacoes": "Exige cálculo mental contínuo para manter os cristais em órbita harmônica.",
  "bankaiNome": "Hoshikuzu — Tenkan",
  "bankaiKanji": "星屑・天環",
  "bankaiTraducao": "Anel Celestial",
  "bankaiComando": "Bankai — Hoshikuzu, Tenkan!",
  "bankaiForma": "Enormes anéis orbitais luminosos cobrindo todo o céu da área de batalha.",
  "bankaiPoder": "Controle Gravitacional de Trajetória: Define pontos de atração orbital que curvam qualquer projétil, golpe ou deslocamento que entre no anel.",
  "bankaiLimitacoes": "Controla a trajetória, mas não anula a força bruta do projétil.",
  "indices": {
    "potencia": 7,
    "alcance": 9,
    "complexidade": 8,
    "versatilidade": 9,
    "custo": 6
  }
}, {
  "id": "zk-05-koriame",
  "nome": "Kōriame",
  "kanji": "氷雨",
  "traducao": "Chuva Congelada",
  "elemento": "Inércia Hidráulica & Resistência Direcional",
  "comando": "Chore sobre este mundo, Kōriame",
  "espirito": "Uma senhora idosa carregando um guarda-chuva branco com expressão melancólica sob chuva eterna.",
  "formaSelada": "Katana com guarda em forma de cúpula de guarda-chuva dobrada.",
  "formatoArma": "Guarda-chuva metálico branco com ponta afiada, invocando precipitação espiritual contínua.",
  "poder": "Gotas de Peso: Cada gota espiritual que atinge um alvo aumenta sua inércia e dificulta a aceleração.",
  "limitacoes": "O efeito é gradual e depende do tempo de exposição do alvo à chuva.",
  "bankaiNome": "Kōriame — Hakusōten",
  "bankaiKanji": "氷雨・白葬天",
  "bankaiTraducao": "Céu do Funeral Branco",
  "bankaiComando": "Bankai — Kōriame, Hakusōten!",
  "bankaiForma": "Céu escurecido cobrindo quilômetros com cortinas torrenciais de chuva congelada.",
  "bankaiPoder": "Manipulação Direcional de Resistência: O usuário escolhe quais eixos espaciais possuem resistência esmagadora (ex: avançar para frente fica pesado, recuar fica rápido).",
  "bankaiLimitacoes": "Afeta a física espacial de todos no campo, exigindo planejamento posicional do usuário.",
  "indices": {
    "potencia": 8,
    "alcance": 10,
    "complexidade": 8,
    "versatilidade": 8,
    "custo": 7
  }
}, {
  "id": "zk-06-kagamibana",
  "nome": "Kagamibana",
  "kanji": "鏡花",
  "traducao": "Flor do Espelho",
  "elemento": "Possibilidade Imediata & Fragmentos de Vidro",
  "comando": "Reflita aquilo que deveria ser esquecido, Kagamibana",
  "espirito": "Uma mulher sem olhos com flores de vidro crescendo pelos cabelos dentro de uma estufa quebrada.",
  "formaSelada": "Katana com lâmina de reflexo fragmentado como mosaico de espelho.",
  "formatoArma": "Espada transparente com lâmina de vidro espiritual que projeta imagens alternativas de momentos.",
  "poder": "Fragmento de Possibilidade: Cria uma pequena distorção imediata onde o usuário escolhe entre o acontecimento real e a imagem alternativa nos próximos segundos.",
  "limitacoes": "Duração de poucos segundos e curto alcance.",
  "bankaiNome": "Kagamibana — Banshō Shakai",
  "bankaiKanji": "鏡花・万象写界",
  "bankaiTraducao": "Mundo que Copia Todas as Coisas",
  "bankaiComando": "Bankai — Kagamibana, Banshō Shakai!",
  "bankaiForma": "O ambiente se cristaliza em uma imensa superfície espelhada.",
  "bankaiPoder": "Colapso de Múltiplas Possibilidades: Cria simultaneamente 3 a 5 desfechos possíveis para uma mesma ação, colapsando a mais vantajosa na realidade.",
  "bankaiLimitacoes": "Apenas uma possibilidade pode se materializar de fato.",
  "indices": {
    "potencia": 8,
    "alcance": 8,
    "complexidade": 10,
    "versatilidade": 9,
    "custo": 8
  }
}, {
  "id": "zk-07-mukade",
  "nome": "Mukade",
  "kanji": "百足",
  "traducao": "Centopeia",
  "elemento": "Encadeamento de Lâminas & Correntes Sequenciais",
  "comando": "Multiplique-se pelo caminho, Mukade",
  "espirito": "Uma criatura longa com dezenas de braços segurando espadas e máscara de crânio de inseto.",
  "formaSelada": "Katana segmentada com ranhuras visíveis ao longo do fio.",
  "formatoArma": "Espada dividida em múltiplas lâminas menores conectadas por correntes articuladas.",
  "poder": "Ataque Encadeado: Cada golpe conectado reposiciona imediatamente a lâmina seguinte em novo ângulo de ataque.",
  "limitacoes": "Se errar a sequência, todas as lâminas retornam ao ponto de origem.",
  "bankaiNome": "Mukade — Mukyū Renjin",
  "bankaiKanji": "百足・無窮連刃",
  "bankaiTraducao": "Lâminas da Corrente Infinita",
  "bankaiComando": "Bankai — Mukade, Mukyū Renjin!",
  "bankaiForma": "Rede gigante de milhares de lâminas articuladas operando em malha tridimensional.",
  "bankaiPoder": "Encadeamento Autônomo Infinito: A Bankai prevê e executa cadeias ininterruptas de ataques automáticos baseados no último movimento.",
  "bankaiLimitacoes": "Se o adversário quebrar o ritmo ou ler o padrão geométrico, a rede perde tração.",
  "indices": {
    "potencia": 8,
    "alcance": 7,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 6
  }
}, {
  "id": "zk-08-yureiishi",
  "nome": "Yūreiishi",
  "kanji": "幽霊石",
  "traducao": "Pedra Fantasma",
  "elemento": "Âncoras Espirituais & Transição Espacial",
  "comando": "Permaneça onde ninguém pode tocar, Yūreiishi",
  "espirito": "Uma criança semitransparente sentada sobre uma enorme rocha flutuante com espíritos menores.",
  "formaSelada": "Tantō negra com pedra de obsidiana cravada no pomo.",
  "formatoArma": "A lâmina se dissolve em 4 pequenas pedras negras orbitais.",
  "poder": "Âncoras Espirituais: O usuário fixa as pedras no cenário e pode retornar instantaneamente para a posição de qualquer uma delas.",
  "limitacoes": "Número limitado de âncoras e distância máxima definida.",
  "bankaiNome": "Yūreiishi — Hyakki Kyō",
  "bankaiKanji": "幽霊石・百鬼境",
  "bankaiTraducao": "Território das Cem Almas",
  "bankaiComando": "Bankai — Yūreiishi, Hyakki Kyō!",
  "bankaiForma": "Centenas de pedras negras flutuando e formando uma matriz dimensional densa no campo.",
  "bankaiPoder": "Malha de Salto Instantâneo: Permite saltos sucessivos entre centenas de pontos conectados no espaço.",
  "bankaiLimitacoes": "Grandes distâncias aumentam proporcionalmente o desgaste de Reiatsu.",
  "indices": {
    "potencia": 6,
    "alcance": 9,
    "complexidade": 8,
    "versatilidade": 10,
    "custo": 7
  }
}, {
  "id": "zk-09-raimei",
  "nome": "Raimei",
  "kanji": "雷鳴",
  "traducao": "Trovão",
  "elemento": "Ressonância Harmônica & Vibração Sônica",
  "comando": "Faça o céu responder, Raimei",
  "espirito": "Um gigante usando máscara de teatro tradicional coberto por linhas luminosas como rachaduras.",
  "formaSelada": "Katana com lâmina em zigue-zague sutil e tsuba de bronze martelado.",
  "formatoArma": "Lâmina irregular em formato de raio com cabo que emite pulsos luminosos rítmicos.",
  "poder": "Ressonância: Movimentos executados no mesmo compasso acumulam ondas vibratórias para um golpe devastador.",
  "limitacoes": "Exige precisão métrica de tempo; se o ritmo for interrompido, a carga dissipa.",
  "bankaiNome": "Raimei — Gōtenritsu",
  "bankaiKanji": "雷鳴・轟天律",
  "bankaiTraducao": "Lei do Céu Trovejante",
  "bankaiComando": "Bankai — Raimei, Gōtenritsu!",
  "bankaiForma": "O campo inteiro reverbera ondas sônicas com anéis de ressonância no solo e no céu.",
  "bankaiPoder": "Harmonia de Batalha: Cada ação executada no compasso espiritual do usuário ganha potência e velocidade multiplicadas.",
  "bankaiLimitacoes": "Perder o ritmo zera a ressonância acumulada.",
  "indices": {
    "potencia": 9,
    "alcance": 7,
    "complexidade": 8,
    "versatilidade": 7,
    "custo": 6
  }
}, {
  "id": "zk-10-shirogane",
  "nome": "Shirogane",
  "kanji": "白銀",
  "traducao": "Prata Branca",
  "elemento": "Equilíbrio de Forças & Balança Tática",
  "comando": "Pese aquilo que existe, Shirogane",
  "espirito": "Um cavaleiro sem rosto em armadura branca polida segurando uma balança colossal.",
  "formaSelada": "Katana de aço prateado puro com empunhadura revestida em tecido alvo.",
  "formatoArma": "Longa lâmina branca reluzente com guarda no formato de braço de balança.",
  "poder": "Equilíbrio: Detecta a disparidade física entre combatentes e reduz a diferença cedendo outra vantagem.",
  "limitacoes": "Não cria energia do nada; requer sacrifício equivalente de outro aspecto.",
  "bankaiNome": "Shirogane — Tenbin Kai",
  "bankaiKanji": "白銀・天秤界",
  "bankaiTraducao": "Domínio da Balança Celestial",
  "bankaiComando": "Bankai — Shirogane, Tenbin Kai!",
  "bankaiForma": "Uma monumental balança dourada e prateada manifesta-se nos céus sobre o campo de batalha.",
  "bankaiPoder": "Equalização Multidimensional: Transfere proporcionalmente valores entre força, velocidade, reiatsu e resiliência entre os lutadores.",
  "bankaiLimitacoes": "Toda alteração exige contrapartida exata de acordo com a balança.",
  "indices": {
    "potencia": 7,
    "alcance": 8,
    "complexidade": 9,
    "versatilidade": 10,
    "custo": 7
  }
}, {
  "id": "zk-11-kurohane",
  "nome": "Kurohane",
  "kanji": "黒羽",
  "traducao": "Asas Negras",
  "elemento": "Percepção Sensorial & Penas de Informação",
  "comando": "Observe aquilo que ninguém percebe, Kurohane",
  "espirito": "Uma enorme coruja negra sem olhos em uma biblioteca de tomos flutuantes.",
  "formatoArma": "Espada que se divide em penas negras registradoras de dados sensoriais.",
  "poder": "Registro Sensorial: Penas que captam som, cheiro, temperatura e pressão espiritual ao redor.",
  "bankaiNome": "Kurohane — Banshikiden",
  "bankaiKanji": "黒羽・万識殿",
  "bankaiTraducao": "Palácio das Mil Percepções",
  "bankaiPoder": "Conexão de Percepções: Reconstrói acontecimentos recentes e antecipa intenções através das penas.",
  "indices": {
    "potencia": 6,
    "alcance": 9,
    "complexidade": 8,
    "versatilidade": 9,
    "custo": 5
  }
}, {
  "id": "zk-12-akeboshi",
  "nome": "Akeboshi",
  "kanji": "明星",
  "traducao": "Estrela da Manhã",
  "elemento": "Antecipação de Padrões & Astronomia Espiritual",
  "comando": "Mostre o instante que se aproxima, Akeboshi",
  "espirito": "Um astrônomo jovem com relógio sem ponteiros.",
  "formatoArma": "Lâmina com círculos luminosos que rastreiam ações repetitivas do adversário.",
  "poder": "Identificação de Padrão: Sinaliza o instante exato em que o inimigo repetirá um movimento.",
  "bankaiNome": "Akeboshi — Senkenten",
  "bankaiKanji": "明星・先見天",
  "bankaiTraducao": "Céu da Visão Antecipada",
  "bankaiPoder": "Previsibilidade Simultânea: Mapeia dezenas de trajetórias e padrões de combate em tempo real.",
  "indices": {
    "potencia": 7,
    "alcance": 8,
    "complexidade": 9,
    "versatilidade": 9,
    "custo": 6
  }
}, {
  "id": "zk-13-shigure",
  "nome": "Shigure",
  "kanji": "時雨",
  "traducao": "Chuva Passageira",
  "elemento": "Deterioração Estrutural & Desgaste Temporal",
  "comando": "Passe como a chuva, Shigure",
  "espirito": "Mulher com vestido feito de relógios quebrados.",
  "formatoArma": "Lâmina que goteja chuva de aceleração de fadiga em materiais.",
  "poder": "Gotas de Corrosão: Acelera o desgaste natural de metal, madeira e tecidos tocados.",
  "bankaiNome": "Shigure — Hyakunen'ame",
  "bankaiKanji": "時雨・百年雨",
  "bankaiTraducao": "Chuva dos Cem Anos",
  "bankaiPoder": "Deterioração Ambiental Seletiva: Controla a velocidade de desgaste e fadiga de tudo na área.",
  "indices": {
    "potencia": 8,
    "alcance": 9,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 7
  }
}, {
  "id": "zk-14-ginmokusei",
  "nome": "Ginmokusei",
  "kanji": "銀木犀",
  "traducao": "Osmanthus Prateado",
  "elemento": "Rastreamento Olfativo & Aromas Espirituais",
  "comando": "Espalhe aquilo que os olhos não podem encontrar, Ginmokusei",
  "espirito": "Uma senhora cega cuidando de um jardim invisível.",
  "formatoArma": "Espada que exala perfume de rastreamento espiritual indelével.",
  "poder": "Marca Olfativa: Marca alvos pelo odor de Reishi impossível de ocultar.",
  "bankaiNome": "Ginmokusei — Hyakkōtei",
  "bankaiKanji": "銀木犀・百香庭",
  "bankaiTraducao": "Jardim das Cem Fragrâncias",
  "bankaiPoder": "Rede Sensorial de Fragrâncias: Mapeia perfeitamente qualquer presença marcada em quilômetros.",
  "indices": {
    "potencia": 5,
    "alcance": 10,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 4
  }
}, {
  "id": "zk-15-tsukikage",
  "nome": "Tsukikage",
  "kanji": "月影",
  "traducao": "Sombra Lunar",
  "elemento": "Ocultação Visual & Luz e Trevas",
  "comando": "Esconda aquilo que a luz revela, Tsukikage",
  "espirito": "Um homem com máscara meio clara meio escura.",
  "formatoArma": "Lâmina que apaga detalhes visuais específicos do alvo ou do usuário.",
  "poder": "Ocultação de Detalhe: Torna armas, feridas ou membros invisíveis aos olhos.",
  "bankaiNome": "Tsukikage — Mumyōkyō",
  "bankaiKanji": "月影・無明境",
  "bankaiTraducao": "Domínio Sem Luz",
  "bankaiPoder": "Manipulação Coletiva da Percepção: Apaga seletivamente conjuntos inteiros de dados visuais.",
  "indices": {
    "potencia": 6,
    "alcance": 8,
    "complexidade": 8,
    "versatilidade": 9,
    "custo": 6
  }
}, {
  "id": "zk-16-tetsubana",
  "nome": "Tetsubana",
  "kanji": "鉄花",
  "traducao": "Flor de Ferro",
  "elemento": "Metal Vegetal & Arquitetura Espiritual",
  "comando": "Floresça através da dureza, Tetsubana",
  "espirito": "Uma garota pequena coberta por flores de metal.",
  "formatoArma": "Lâmina que faz flores metálicas brotarem de superfícies tocadas.",
  "poder": "Brotamento Metálico: Cria barreiras e pontas de aço vegetal em paredes e solos.",
  "bankaiNome": "Tetsubana — Banshōtei",
  "bankaiKanji": "鉄花・万象庭",
  "bankaiTraducao": "Jardim das Mil Estruturas",
  "bankaiPoder": "Arquitetura Espiritual Dinâmica: Ergue fortalezas e labirintos de aço orgânico instantaneamente.",
  "indices": {
    "potencia": 8,
    "alcance": 8,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 6
  }
}, {
  "id": "zk-17-usuginu",
  "nome": "Usuginu",
  "kanji": "薄絹",
  "traducao": "Seda Delicada",
  "elemento": "Separação Física & Fitas de Espaço",
  "comando": "Dance entre os espaços, Usuginu",
  "espirito": "Bailarina envolta em milhares de véus sem rosto.",
  "formatoArma": "Fita cortante ultrafina que separa temporariamente superfícies contíguas.",
  "poder": "Linha de Separação: Desconecta lâminas de cabos e portas de batentes momentaneamente.",
  "bankaiNome": "Usuginu — Dankaimai",
  "bankaiKanji": "薄絹・断界舞",
  "bankaiTraducao": "Dança do Mundo Separado",
  "bankaiPoder": "Zonas de Desconexão Espacial: Cria limites onde nada pode permanecer unido fisicamente.",
  "indices": {
    "potencia": 8,
    "alcance": 8,
    "complexidade": 9,
    "versatilidade": 8,
    "custo": 7
  }
}, {
  "id": "zk-18-suzunari",
  "nome": "Suzunari",
  "kanji": "鈴鳴",
  "traducao": "Som dos Sinos",
  "elemento": "Comunicação Sônica & Ondas de Frequência",
  "comando": "Desperte através do som, Suzunari",
  "espirito": "Criança com centenas de sinos tilintantes.",
  "formatoArma": "Espada sonora que transmite mensagens e frequências por vibração.",
  "poder": "Voz do Sino: Transmite mensagens secretas em frequências inaudíveis pelo ar.",
  "bankaiNome": "Suzunari — Sen'on Kairō",
  "bankaiKanji": "鈴鳴・千音回廊",
  "bankaiTraducao": "Corredor das Mil Vozes",
  "bankaiPoder": "Rede Sonora Territorial: Projeta dezenas de canais acústicos com atordoamento sônico coordenado.",
  "indices": {
    "potencia": 7,
    "alcance": 9,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 5
  }
}, {
  "id": "zk-19-mokuren",
  "nome": "Mokuren",
  "kanji": "木蓮",
  "traducao": "Magnólia",
  "elemento": "Raízes de Reishi & Condução Energética",
  "comando": "Crie raízes onde não existem, Mokuren",
  "espirito": "Monge colossal de madeira viva.",
  "formatoArma": "Espada viva que finca raízes condutoras no solo.",
  "poder": "Conexão de Reishi: Transfere energia espiritual entre dois pontos enraizados.",
  "bankaiNome": "Mokuren — Daijumyaku",
  "bankaiKanji": "木蓮・大樹脈",
  "bankaiTraducao": "Grande Veia da Árvore",
  "bankaiPoder": "Rede Energética Continental: Redistribui ou drena Reiatsu em larga escala pelo solo.",
  "indices": {
    "potencia": 8,
    "alcance": 9,
    "complexidade": 8,
    "versatilidade": 8,
    "custo": 6
  }
}, {
  "id": "zk-20-hakugin",
  "nome": "Hakugin",
  "kanji": "白銀",
  "traducao": "Prata Branca",
  "elemento": "Análise Estrutural & Pontos de Tensão",
  "comando": "Revele a forma escondida, Hakugin",
  "espirito": "Ferreiro em oficina congelada.",
  "formatoArma": "Lâmina analítica que identifica falhas internas de objetos tocados.",
  "poder": "Visão Estrutural: Revela trincas e pontos fracos na matéria do adversário.",
  "bankaiNome": "Hakugin — Shingyōro",
  "bankaiKanji": "白銀・真形炉",
  "bankaiTraducao": "Forja da Forma Verdadeira",
  "bankaiPoder": "Desestruturação Ambiental: Mapeia e colapsa pontos de tensão em construções e defesas.",
  "indices": {
    "potencia": 8,
    "alcance": 7,
    "complexidade": 9,
    "versatilidade": 8,
    "custo": 6
  }
}, {
  "id": "zk-21-karasuame",
  "nome": "Karasuame",
  "kanji": "烏雨",
  "traducao": "Chuva dos Corvos",
  "elemento": "Aves Mensageiras & Extensão Sensorial",
  "comando": "Desça sobre o mundo, Karasuame",
  "espirito": "Um corvo gigante com três olhos que enxerga através das sombras.",
  "formatoArma": "Katana de empunhadura emplumada que libera pequenas aves espirituais mensageiras.",
  "poder": "Mensageiros das Trevas: Pequenas aves que transportam mensagens e espionam pontos cegos.",
  "bankaiNome": "Karasuame — Manba Ten",
  "bankaiKanji": "烏雨・万羽天",
  "bankaiTraducao": "Céu das Mil Asas",
  "bankaiPoder": "Milhares de corvos espirituais cobrem o campo, servindo como extensões visuais e cinéticas do usuário.",
  "indices": {
    "potencia": 7,
    "alcance": 10,
    "complexidade": 7,
    "versatilidade": 9,
    "custo": 6
  }
}, {
  "id": "zk-22-enko",
  "nome": "Enkō",
  "kanji": "円光",
  "traducao": "Luz Circular",
  "elemento": "Delimitação Geométrica & Preservação",
  "comando": "Circunde aquilo que desejo proteger, Enkō",
  "espirito": "Um sacerdote solene com um halo dourado giratório.",
  "formatoArma": "Espada que desenha anéis luminosos no solo com propriedades de conservação.",
  "poder": "Delimitação: Cria círculos onde uma propriedade física (fogo, integridade, barreira) é preservada intacta.",
  "bankaiNome": "Enkō — Mankan Seīki",
  "bankaiKanji": "円光・万環聖域",
  "bankaiTraducao": "Santuário dos Mil Círculos",
  "bankaiPoder": "Centenas de anéis concêntricos criando uma geometria de leis locais invioláveis no campo de batalha.",
  "indices": {
    "potencia": 8,
    "alcance": 8,
    "complexidade": 9,
    "versatilidade": 9,
    "custo": 7
  }
}, {
  "id": "zk-23-shakunetsurin",
  "nome": "Shakunetsurin",
  "kanji": "灼熱輪",
  "traducao": "Anel Incandescente",
  "elemento": "Transferência Rotacional & Energia Térmica",
  "comando": "Gire até que o mundo aqueça, Shakunetsurin",
  "espirito": "Um guerreiro coberto por anéis metálicos incandescentes.",
  "formatoArma": "Chakram afiado de borda giratória incandescente.",
  "poder": "Rotação Transferível: Transfere torque e rotação térmica violenta para qualquer objeto tocado.",
  "bankaiNome": "Shakunetsurin — Tenkai",
  "bankaiKanji": "灼熱輪・転界",
  "bankaiTraducao": "Mundo Giratório",
  "bankaiPoder": "Campos de rotação onde o próprio ambiente gira sob o padrão estabelecido pelo usuário.",
  "indices": {
    "potencia": 9,
    "alcance": 7,
    "complexidade": 7,
    "versatilidade": 7,
    "custo": 6
  }
}, {
  "id": "zk-24-aobotan",
  "nome": "Aobotan",
  "kanji": "青牡丹",
  "traducao": "Peônia Azul",
  "elemento": "Manifestação Espontânea & Preparação Tática",
  "comando": "Floresça onde ninguém espera, Aobotan",
  "espirito": "Mulher coberta por peônias azuis que desaparecem e brotam do vazio.",
  "formatoArma": "Lâmina que planta botões de flores espirituais em qualquer superfície.",
  "poder": "Botão Espontâneo: Cada flor libera um efeito predeterminado pelo usuário antes da batalha.",
  "bankaiNome": "Aobotan — Senkakyō",
  "bankaiKanji": "青牡丹・千花境",
  "bankaiTraducao": "Domínio das Mil Flores",
  "bankaiPoder": "Prepara dezenas de armadilhas e efeitos em centenas de flores para controle territorial absoluto.",
  "indices": {
    "potencia": 8,
    "alcance": 8,
    "complexidade": 9,
    "versatilidade": 9,
    "custo": 6
  }
}, {
  "id": "zk-25-kurogane",
  "nome": "Kurogane",
  "kanji": "黒鉄",
  "traducao": "Ferro Negro",
  "elemento": "Extração Mineral & Drenagem Geológica",
  "comando": "Desperte das profundezas, Kurogane",
  "espirito": "Um gigante mineral acorrentado em uma mina ancestral.",
  "formatoArma": "Espada pesada que extrai Reishi de minerais e rochas tocadas.",
  "poder": "Mineração de Reishi: Extrai energia do solo para revitalizar as reservas do usuário.",
  "bankaiNome": "Kurogane — Shinsōro",
  "bankaiKanji": "黒鉄・深層炉",
  "bankaiTraducao": "Forja das Profundezas",
  "bankaiPoder": "O terreno inteiro vira uma usina espiritual alimentando a força bruta e a resistência do usuário.",
  "indices": {
    "potencia": 9,
    "alcance": 7,
    "complexidade": 6,
    "versatilidade": 8,
    "custo": 7
  }
}, {
  "id": "zk-26-mizuhanabi",
  "nome": "Mizuhanabi",
  "kanji": "水花火",
  "traducao": "Fogos d'Água",
  "elemento": "Pressão Hidráulica & Esferas de Impacto",
  "comando": "Exploda em silêncio, Mizuhanabi",
  "espirito": "Menina brincando em um festival aquático submerso.",
  "formatoArma": "Lâmina que gera esferas de água ultra-comprimida detonáveis.",
  "poder": "Detonação Hidráulica: Esferas de alta pressão que estouram com ondas de choque cortantes.",
  "bankaiNome": "Mizuhanabi — Shinkaisai",
  "bankaiKanji": "水花火・深海祭",
  "bankaiTraducao": "Festival do Mar Profundo",
  "bankaiPoder": "Envolve o campo em correntes marítimas densas com gradientes esmagadores de pressão.",
  "indices": {
    "potencia": 9,
    "alcance": 8,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 7
  }
}, {
  "id": "zk-27-shorin",
  "nome": "Shōrin",
  "kanji": "鐘輪",
  "traducao": "Anel do Sino",
  "elemento": "Ecos Sônicos & Ondas Direcionais",
  "comando": "Faça o mundo escutar, Shōrin",
  "espirito": "Um monge meditando dentro de um monumental sino de bronze.",
  "formatoArma": "Bastão metálico pesado que ressoa notas ensurdecedoras a cada golpe.",
  "poder": "Golpe do Sino: Emite pulsos sonoros concentrados capazes de atordoar e quebrar matéria.",
  "bankaiNome": "Shōrin — Tenkyōden",
  "bankaiKanji": "鐘輪・天響殿",
  "bankaiTraducao": "Palácio do Eco Celestial",
  "bankaiPoder": "O campo rebate e amplifica cada emissão sônica, convergindo de todos os lados como uma tempestade acústica.",
  "indices": {
    "potencia": 8,
    "alcance": 8,
    "complexidade": 7,
    "versatilidade": 8,
    "custo": 6
  }
}, {
  "id": "zk-28-kobai",
  "nome": "Kōbai",
  "kanji": "紅梅",
  "traducao": "Ameixeira Vermelha",
  "elemento": "Persistência & Adaptação ao Dano",
  "comando": "Floresça apesar do inverno, Kōbai",
  "espirito": "Senhora idosa cultivando flores sob nevasca implacável.",
  "formatoArma": "Katana que faz brotar pétalas vermelhas a cada ferimento ou dificuldade sofrida.",
  "poder": "Memória da Dor: Reduz progressivamente o dano de ataques do mesmo tipo recebidos no combate.",
  "bankaiNome": "Kōbai — Fukutsu Sentei",
  "bankaiKanji": "紅梅・不屈千庭",
  "bankaiTraducao": "Mil Jardins Indomáveis",
  "bankaiPoder": "Converte experiências de impacto acumuladas em adaptação física e resistência quase invulnerável.",
  "indices": {
    "potencia": 8,
    "alcance": 6,
    "complexidade": 8,
    "versatilidade": 9,
    "custo": 7
  }
}, {
  "id": "zk-29-hoshigumo",
  "nome": "Hoshigumo",
  "kanji": "星蜘蛛",
  "traducao": "Aranha Estelar",
  "elemento": "Fios Espirituais & Teias de Reishi",
  "comando": "Costure o céu, Hoshigumo",
  "espirito": "Aranha celestial com corpo translúcido de constelações.",
  "formatoArma": "Fios finíssimos de Reishi presos à guarda que mapeiam vibrações no ar.",
  "poder": "Fios de Radar: Sente o menor movimento de massa que cruze as linhas no campo.",
  "bankaiNome": "Hoshigumo — Tengaimō",
  "bankaiKanji": "星蜘蛛・天蓋網",
  "bankaiTraducao": "Teia do Firmamento",
  "bankaiPoder": "Teia monumental cobrindo o céu com leitura perfeita de pressão, vetor e velocidade de tudo no espaço.",
  "indices": {
    "potencia": 7,
    "alcance": 10,
    "complexidade": 8,
    "versatilidade": 9,
    "custo": 6
  }
}, {
  "id": "zk-30-yomotsuhira",
  "nome": "Yomotsuhira",
  "kanji": "黄泉平",
  "traducao": "Planície do Submundo",
  "elemento": "Preservação de Estados & Restauração",
  "comando": "Abra o caminho entre partidas e chegadas, Yomotsuhira",
  "espirito": "Um barqueiro encapuzado navegando em rio infinito.",
  "formatoArma": "Lâmina cerimonial que marca o estado físico exato de um objeto.",
  "poder": "Marca de Estado: Pode reverter temporariamente um objeto marcado para seu estado anterior recente.",
  "bankaiNome": "Yomotsuhira — Tosei",
  "bankaiKanji": "黄泉平・渡世",
  "bankaiTraducao": "Travessia Entre Estados",
  "bankaiPoder": "Registra e transita entre múltiplos estados físicos simultâneos de matéria e terreno no combate.",
  "indices": {
    "potencia": 8,
    "alcance": 8,
    "complexidade": 10,
    "versatilidade": 9,
    "custo": 8
  }
}];
const CATALOGO_KIDOS = [{
  "id": "h1-hibana",
  "numero": 1,
  "cat": "Hadō",
  "nome": "Hadō #1 — Hibana (Faísca)",
  "incant": "Pequena chama, desperte em minha mão.",
  "desc": "Dispara uma pequena explosão de energia espiritual concentrada na ponta dos dedos.",
  "custoReiatsu": 1
}, {
  "id": "h2-rekka",
  "numero": 2,
  "cat": "Hadō",
  "nome": "Hadō #2 — Rekka (Lâmina Flamejante)",
  "incant": "Chama comprimida, torne-se lâmina e atravesse o caminho.",
  "desc": "Projeta uma lâmina de energia flamejante que corta a média distância.",
  "custoReiatsu": 2
}, {
  "id": "h3-shoge",
  "numero": 3,
  "cat": "Hadō",
  "nome": "Hadō #3 — Shōgekiha (Onda de Impacto)",
  "incant": "Espírito acumulado, transforme-se em força. Avance.",
  "desc": "Dispara uma onda curta e densa de pressão espiritual de impacto cinético.",
  "custoReiatsu": 2
}, {
  "id": "h4-raiko",
  "numero": 4,
  "cat": "Hadō",
  "nome": "Hadō #4 — Raikō / Byakurai (Luz Trovejante)",
  "incant": "Céu silencioso, rasgue o horizonte com sua luz.",
  "desc": "Dispara um feixe concentrado e perfurante de energia elétrica em linha reta.",
  "custoReiatsu": 3
}, {
  "id": "h5-kazan",
  "numero": 5,
  "cat": "Hadō",
  "nome": "Hadō #5 — Kazan (Vulcão)",
  "incant": "Sob a terra existe fogo. Rompa o silêncio e desperte.",
  "desc": "Projeta uma explosão ascendente de energia a partir do solo sob os pés do alvo.",
  "custoReiatsu": 3
}, {
  "id": "h6-getsumen",
  "numero": 6,
  "cat": "Hadō",
  "nome": "Hadō #6 — Getsumen (Crescente Lunar)",
  "incant": "Lua partida, desenha teu arco e corta o caminho diante de mim.",
  "desc": "Dispara uma lâmina curva e cortante de pura energia espiritual.",
  "custoReiatsu": 4
}, {
  "id": "h7-enko",
  "numero": 7,
  "cat": "Hadō",
  "nome": "Hadō #7 — Enkō (Arco Flamejante)",
  "incant": "Fogo que dança no ar, siga meu gesto e avance.",
  "desc": "Cria uma rajada curva e envolvente de energia flamejante.",
  "custoReiatsu": 4
}, {
  "id": "h8-retsufu",
  "numero": 8,
  "cat": "Hadō",
  "nome": "Hadō #8 — Retsufū (Vento Violento)",
  "incant": "Ar que dorme, desperte. Céu que observa, desça.",
  "desc": "Dispara uma rajada concentrada de vento espiritual comprimido capaz de arremessar inimigos.",
  "custoReiatsu": 4
}, {
  "id": "h9-raimeisen",
  "numero": 9,
  "cat": "Hadō",
  "nome": "Hadō #9 — Raimei Sen (Linha do Trovão)",
  "incant": "Entre céu e terra existe apenas um instante. Atravesse-o.",
  "desc": "Dispara uma linha extremamente rápida e relampejante de energia elétrica contínua.",
  "custoReiatsu": 5
}, {
  "id": "h10-gekka",
  "numero": 10,
  "cat": "Hadō",
  "nome": "Hadō #10 — Gekka (Flor Lunar)",
  "incant": "Abra suas pétalas na escuridão e faça a noite florescer.",
  "desc": "Cria vários projéteis espirituais que se espalham pelo ar e convergem sobre o alvo como pétalas.",
  "custoReiatsu": 5
}, {
  "id": "h11-enjin",
  "numero": 11,
  "cat": "Hadō",
  "nome": "Hadō #11 — Enjin (Lâmina de Fogo)",
  "incant": "Fogo que não precisa de combustível, transforme minha intenção em corte.",
  "desc": "Reveste a lâmina da Zanpakutō com chamas densas para amplificar o corte.",
  "custoReiatsu": 5
}, {
  "id": "h12-shoten",
  "numero": 12,
  "cat": "Hadō",
  "nome": "Hadō #12 — Shōten (Ascensão)",
  "incant": "Suba, energia que dorme abaixo do mundo.",
  "desc": "Libera uma coluna vertical massiva de energia espiritual que se eleva do solo.",
  "custoReiatsu": 6
}, {
  "id": "h13-koha",
  "numero": 13,
  "cat": "Hadō",
  "nome": "Hadō #13 — Kōha (Onda Carmesim)",
  "incant": "Vermelho que nasce do espírito, avance como maré.",
  "desc": "Projeta uma grande maré ondulante de energia espiritual destruidora.",
  "custoReiatsu": 6
}, {
  "id": "h14-rasenka",
  "numero": 14,
  "cat": "Hadō",
  "nome": "Hadō #14 — Rasenka (Flor Espiral)",
  "incant": "Gire, comprima, floresça. Transforme o caos em uma única direção.",
  "desc": "Dispara uma broca espiral de energia espiritual de alto poder perfurante.",
  "custoReiatsu": 6
}, {
  "id": "h15-hoko",
  "numero": 15,
  "cat": "Hadō",
  "nome": "Hadō #15 — Hōkō (Rugido)",
  "incant": "Que minha voz atravesse o céu. Que meu espírito responda com força.",
  "desc": "Libera uma poderosa onda de choque sônica e espiritual em cone à frente.",
  "custoReiatsu": 7
}, {
  "id": "h16-kagero",
  "numero": 16,
  "cat": "Hadō",
  "nome": "Hadō #16 — Kagerō (Calor Distorcido)",
  "incant": "Ardente o horizonte. Faça o espaço tremer diante do calor.",
  "desc": "Cria uma onda térmica distorcida que embaça a visão e causa impacto escaldante.",
  "custoReiatsu": 7
}, {
  "id": "h17-shakunetsu",
  "numero": 17,
  "cat": "Hadō",
  "nome": "Hadō #17 — Shakunetsu (Incandescência)",
  "incant": "Consuma o frio, ilumine a noite, transforme energia em chama.",
  "desc": "Concentra Reiatsu em uma esfera incandescente que explode com fúria ao contato.",
  "custoReiatsu": 8
}, {
  "id": "h18-tenrai",
  "numero": 18,
  "cat": "Hadō",
  "nome": "Hadō #18 — Tenrai (Trovão Celestial)",
  "incant": "Céu acima de mim, terra abaixo de mim. Entre ambos, faça nascer o trovão.",
  "desc": "Invoca um raio espiritual fulminante que desaba dos céus sobre a área marcada.",
  "custoReiatsu": 8
}, {
  "id": "h19-ryuka",
  "numero": 19,
  "cat": "Hadō",
  "nome": "Hadō #19 — Ryūka (Dragão de Fogo)",
  "incant": "Chama sem forma, encontre um corpo. Céu sem voz, encontre um rugido.",
  "desc": "Materializa uma serpente dragônica de chamas espirituais que persegue o alvo.",
  "custoReiatsu": 9
}, {
  "id": "h20-koten",
  "numero": 20,
  "cat": "Hadō",
  "nome": "Hadō #20 — Kōten (Explosão Celeste)",
  "incant": "Todo poder converge para um único ponto. Céu e terra, testemunhem o impacto.",
  "desc": "Concentra densidade espiritual máxima em um ponto infinitesimal antes de detonar.",
  "custoReiatsu": 10
}, {
  "id": "h31-shakkaho",
  "numero": 31,
  "cat": "Hadō",
  "nome": "Hadō #31 — Shakkahō (Canhão de Fogo Vermelho)",
  "incant": "Ó senhor! Máscara de sangue e carne, toda a criação, bater de asas, vós que carregais o nome de Homem! Inferno e pandemônio, a barreira marítima avança, marcha para o sul!",
  "desc": "Dispara uma esfera carmesim de alta destruição térmica por concussão e chamas.",
  "custoReiatsu": 7
}, {
  "id": "h33-sokatsui",
  "numero": 33,
  "cat": "Hadō",
  "nome": "Hadō #33 — Sōkatsui (Fogo Azul / Impacto Descontrolado)",
  "incant": "Ó senhor! Máscara de carne e osso, bater de asas, vós que carregais o nome de Homem! Verdade e temperança, sobre esta muralha imaculada de sonhos, desencadeai apenas levemente a fúria de vossas garras.",
  "desc": "Gera e dispara uma torrente de chamas azuis com impacto explosivo devastador.",
  "custoReiatsu": 8
}, {
  "id": "h73-soren-sokatsui",
  "numero": 73,
  "cat": "Hadō",
  "nome": "Hadō #73 — Sōren Sōkatsui (Fogo Azul de Lótus Gêmea)",
  "incant": "Ó senhor! Máscara de sangue e carne, toda a criação, bater de asas, vós que carregais o nome do Homem! Na parede de chamas azuis, inscreve um lótus duplo. No abismo da conflagração, aguarda nos céus distantes.",
  "desc": "Forma avançada e dupla do Sōkatsui disparada com ambas as palmas, com o dobro da potência.",
  "custoReiatsu": 14
}, {
  "id": "h90-kurohitsugi",
  "numero": 90,
  "cat": "Hadō",
  "nome": "Hadō #90 — Kurohitsugi (Caixão Negro)",
  "incant": "A crista viscosa da corrupção. O arrogante receptáculo da loucura! Negue o impulso fervilhante! Atordoe e cintile! Perturbe o sono! A rainha rastejante de ferro! A boneca de lama eternamente autodestrutiva! Unam-se! Repilam! Preencham a Terra e reconheçam sua própria impotência!",
  "desc": "Confinamento em caixão de gravidade negra perfurado por lanças de Reishi que distorcem o espaço.",
  "custoReiatsu": 20
}, {
  "id": "b1-sai",
  "numero": 1,
  "cat": "Hadō",
  "nome": "Bakudō #1 — Sai (Obstrução)",
  "incant": "—",
  "desc": "Prende os braços do alvo atrás das costas com fios invisíveis de Reiatsu.",
  "custoReiatsu": 1
}, {
  "id": "b4-hainawa",
  "numero": 4,
  "cat": "Bakudō",
  "nome": "Bakudō #4 — Hainawa (Corda Rastejante)",
  "incant": "—",
  "desc": "Cria uma corda de energia amarela que laça e imobiliza os membros do adversário.",
  "custoReiatsu": 2
}, {
  "id": "b9-geki",
  "numero": 9,
  "cat": "Bakudō",
  "nome": "Bakudō #9 — Geki (Golpe de Conquista)",
  "incant": "Desintegre-se, cão negro de Rondanini! Olhe para si mesmo com terror e depois rasgue sua própria garganta!",
  "desc": "Envolve o corpo do inimigo em uma luz vermelha paralisante que anula movimentos.",
  "custoReiatsu": 3
}, {
  "id": "b15-kagekake",
  "numero": 15,
  "cat": "Bakudō",
  "nome": "Bakudō #15 — Kagekake (Amarras da Sombra)",
  "incant": "A sombra nasce dos pés e retorna aos pés. Que nenhuma distância seja suficiente para escapar.",
  "desc": "Prende parcialmente o alvo à própria sombra, impedindo locomoção rápida.",
  "custoReiatsu": 4
}, {
  "id": "b16-rasen-kusari",
  "numero": 16,
  "cat": "Bakudō",
  "nome": "Bakudō #16 — Rasen Kusari (Corrente Espiral)",
  "incant": "Gire, envolva, aperte. Quanto mais o prisioneiro luta, mais próximo fica o círculo.",
  "desc": "Uma corrente espiritual gira ao redor do alvo e restringe progressivamente seus movimentos.",
  "custoReiatsu": 4
}, {
  "id": "b17-hakujo",
  "numero": 17,
  "cat": "Bakudō",
  "nome": "Bakudō #17 — Hakujō (Manto Branco)",
  "incant": "Cubra aquilo que desejo proteger. Torne-se abrigo contra o impacto.",
  "desc": "Forma uma camada espiritual protetora e resiliente sobre o corpo do aliado.",
  "custoReiatsu": 5
}, {
  "id": "b18-tenmon",
  "numero": 18,
  "cat": "Bakudō",
  "nome": "Bakudō #18 — Tenmon (Portão Celestial)",
  "incant": "Entre dois mundos existe uma porta. Que ela se abra apenas diante daquele que reconheço.",
  "desc": "Cria uma barreira seletiva que permite a passagem apenas de pessoas autorizadas.",
  "custoReiatsu": 5
}, {
  "id": "b19-metsubo-ori",
  "numero": 19,
  "cat": "Bakudō",
  "nome": "Bakudō #19 — Metsubō no Ori (Gaiola da Ruína)",
  "incant": "Círculo sobre círculo, parede sobre parede. Fechem-se sobre aquele que ousa permanecer.",
  "desc": "Ergue várias camadas concêntricas de barreiras em jaula ao redor do inimigo.",
  "custoReiatsu": 6
}, {
  "id": "b20-hyakuren-kekkai",
  "numero": 20,
  "cat": "Bakudō",
  "nome": "Bakudō #20 — Hyakuren Kekkai (Barreira das Cem Camadas)",
  "incant": "Que cada camada seja uma muralha, que cada muralha seja uma promessa. Ergam-se e resistam.",
  "desc": "Forma múltiplas barreiras espirituais sobrepostas de altíssima absorção de dano.",
  "custoReiatsu": 6
}, {
  "id": "b26-kyokko",
  "numero": 26,
  "cat": "Bakudō",
  "nome": "Bakudō #26 — Kyokkō (Luz Curva)",
  "incant": "—",
  "desc": "Dobra a luz e a percepção espiritual ao redor do conjurador, tornando-o imperceptível.",
  "custoReiatsu": 6
}, {
  "id": "b30-shitotsu-sansen",
  "numero": 30,
  "cat": "Bakudō",
  "nome": "Bakudō #30 — Shitotsu Sansen (Três Raios de Perfuração)",
  "incant": "—",
  "desc": "Dispara três feixes triangulares que cravam o alvo contra uma superfície pelos membros.",
  "custoReiatsu": 7
}, {
  "id": "b39-enkosen",
  "numero": 39,
  "cat": "Bakudō",
  "nome": "Bakudō #39 — Enkōsen (Escudo Giratório)",
  "incant": "—",
  "desc": "Cria um escudo condensado e rotativo em forma de disco diante da mão.",
  "custoReiatsu": 7
}, {
  "id": "b61-rikujo-koro",
  "numero": 61,
  "cat": "Bakudō",
  "nome": "Bakudō #61 — Rikujō Kōrō (Prisão das Seis Varas de Luz)",
  "incant": "Carruagem do trovão, ponte da roda giratória. Com a luz, divida este em seis!",
  "desc": "Seis feixes dourados de luz cravam-se na cintura do adversário, imobilizando-o totalmente.",
  "custoReiatsu": 11
}, {
  "id": "b81-danku",
  "numero": 81,
  "cat": "Bakudō",
  "nome": "Bakudō #81 — Dankū (Muro de Rejeição)",
  "incant": "—",
  "desc": "Cria uma parede translúcida monumental capaz de anular qualquer Hadō de nível 89 ou inferior.",
  "custoReiatsu": 16
}, {
  "id": "k1-shomei",
  "numero": 1,
  "cat": "Kaidō",
  "nome": "Kaidō #1 — Shōmei (Iluminação)",
  "incant": "Luz suave, encontre aquilo que foi ferido.",
  "desc": "Revela ferimentos internos ocultos e perturbações no fluxo de Reishi do paciente.",
  "custoReiatsu": 1
}, {
  "id": "k2-yasuragi",
  "numero": 2,
  "cat": "Kaidō",
  "nome": "Kaidō #2 — Yasuragi (Tranquilidade)",
  "incant": "Respire. Silencie a dor. Deixe o espírito encontrar repouso.",
  "desc": "Reduz dores agudas e choque físico, mantendo o aliado estável e consciente.",
  "custoReiatsu": 2
}, {
  "id": "k3-seimei-ito",
  "numero": 3,
  "cat": "Kaidō",
  "nome": "Kaidō #3 — Seimei Ito (Fio Vital)",
  "incant": "Fio que une corpo e alma, permaneça firme.",
  "desc": "Estabiliza emergencialmente a conexão entre alma e corpo de um aliado ferido.",
  "custoReiatsu": 2
}, {
  "id": "k4-komyo",
  "numero": 4,
  "cat": "Kaidō",
  "nome": "Kaidō #4 — Kōmyō (Luz Serena)",
  "incant": "Onde existe ferida, que exista luz. Onde existe fraqueza, que exista calma.",
  "desc": "Acelera a cicatrização de cortes leves e queimaduras superficiais.",
  "custoReiatsu": 3
}, {
  "id": "k5-shinkei",
  "numero": 5,
  "cat": "Kaidō",
  "nome": "Kaidō #5 — Shinkei (Nervo)",
  "incant": "Desperte os caminhos adormecidos e faça o corpo lembrar seus próprios movimentos.",
  "desc": "Reativa conexões neurais e musculares prejudicadas por paralisia ou trauma.",
  "custoReiatsu": 3
}, {
  "id": "k6-seika",
  "numero": 6,
  "cat": "Kaidō",
  "nome": "Kaidō #6 — Seika (Purificação)",
  "incant": "Aquilo que não pertence ao corpo, deixe-o. Aquilo que pertence, permaneça.",
  "desc": "Remove toxinas, venenos e impurezas espirituais retidas nos tecidos.",
  "custoReiatsu": 4
}, {
  "id": "k7-kokyu",
  "numero": 7,
  "cat": "Kaidō",
  "nome": "Kaidō #7 — Kokyū (Respiração)",
  "incant": "Ar entre os mundos, entre neste corpo e devolva-lhe o ritmo.",
  "desc": "Restaura o ritmo pulmonar e normaliza o fluxo de respiração espiritual.",
  "custoReiatsu": 4
}, {
  "id": "k8-shirohana",
  "numero": 8,
  "cat": "Kaidō",
  "nome": "Kaidō #8 — Shirohana (Flor Branca)",
  "incant": "Pequena flor, abra-se sobre a ferida e carregue consigo a dor.",
  "desc": "Materializa uma aura floral sobre lesões pontuais para acelerar recuperação acelerada.",
  "custoReiatsu": 4
}, {
  "id": "k9-kekkai-seimei",
  "numero": 9,
  "cat": "Kaidō",
  "nome": "Kaidō #9 — Kekkai Seimei (Barreira Vital)",
  "incant": "Erga-se ao redor da vida. Não permita que a ferida avance.",
  "desc": "Cria um selo estéril ao redor do ferimento, estancando hemorragias e impedindo infecções.",
  "custoReiatsu": 5
}, {
  "id": "k10-chiyu",
  "numero": 10,
  "cat": "Kaidō",
  "nome": "Kaidō #10 — Chiyu (Cura)",
  "incant": "Corpo ferido, espírito cansado. Reúna aquilo que ainda permanece.",
  "desc": "Acelera significativamente a regeneração de ferimentos moderados e lacerações.",
  "custoReiatsu": 5
}, {
  "id": "k11-seimei-koro",
  "numero": 11,
  "cat": "Kaidō",
  "nome": "Kaidō #11 — Seimei Kōro (Caminho Vital)",
  "incant": "Que cada caminho volte a encontrar seu destino. Que cada fluxo retorne ao seu curso.",
  "desc": "Reorganiza o fluxo de Reishi nos canais espirituais após supressão ou choque.",
  "custoReiatsu": 6
}, {
  "id": "k12-koshin",
  "numero": 12,
  "cat": "Kaidō",
  "nome": "Kaidō #12 — Kōshin (Renovação)",
  "incant": "Aquilo que foi gasto, encontre repouso. Aquilo que foi quebrado, encontre forma.",
  "desc": "Revitaliza o vigor físico e repõe parte da energia espiritual gasta.",
  "custoReiatsu": 6
}, {
  "id": "k13-reisho",
  "numero": 13,
  "cat": "Kaidō",
  "nome": "Kaidō #13 — Reishō (Pulso Espiritual)",
  "incant": "Um pulso chama outro. Que a alma encontre seu próprio ritmo.",
  "desc": "Monitora e estabiliza arritmias e descompassos no Hakusui do paciente.",
  "custoReiatsu": 6
}, {
  "id": "k14-shoka-cura",
  "numero": 14,
  "cat": "Kaidō",
  "nome": "Kaidō #14 — Shōka (Purificação da Ferida)",
  "incant": "Dor que permanece, deixe o corpo. Energia estranha, abandone a carne.",
  "desc": "Dissolve miasmas e resíduos corrosivos de Reiatsu hostil em ferimentos.",
  "custoReiatsu": 7
}, {
  "id": "k15-meimei",
  "numero": 15,
  "cat": "Kaidō",
  "nome": "Kaidō #15 — Meimei (Pulso de Vida)",
  "incant": "Enquanto houver chama, haverá caminho. Enquanto houver espírito, haverá retorno.",
  "desc": "Estabiliza emergencialmente pacientes à beira da derrota ou inconsciência.",
  "custoReiatsu": 7
}, {
  "id": "k16-hikari-ito",
  "numero": 16,
  "cat": "Kaidō",
  "nome": "Kaidō #16 — Hikari no Ito (Fios de Luz)",
  "incant": "Fios de luz, atravessem a ferida. Unam aquilo que foi separado.",
  "desc": "Tecelagem cirúrgica de Reishi que sutura músculos e tendões rompidos.",
  "custoReiatsu": 8
}, {
  "id": "k17-seishin-nagashi",
  "numero": 17,
  "cat": "Kaidō",
  "nome": "Kaidō #17 — Seishin Nagashi (Fluxo Espiritual)",
  "incant": "Que minha energia encontre teu caminho e leve consigo aquilo que pesa.",
  "desc": "Transfere uma cota direta de Reiatsu purificada do conjurador para o receptor.",
  "custoReiatsu": 8
}, {
  "id": "k18-komyaku",
  "numero": 18,
  "cat": "Kaidō",
  "nome": "Kaidō #18 — Kōmyaku (Veias de Luz)",
  "incant": "Que a luz percorra cada caminho. Que nenhum fluxo permaneça perdido.",
  "desc": "Restaura ramificações profundas do sistema circulatório espiritual.",
  "custoReiatsu": 9
}, {
  "id": "k19-saisei-hana",
  "numero": 19,
  "cat": "Kaidō",
  "nome": "Kaidō #19 — Saisei Hana (Flor da Regeneração)",
  "incant": "Daquilo que foi perdido, faça nascer novamente a forma.",
  "desc": "Regenera ferimentos graves e tecidos destruídos sob concentração contínua.",
  "custoReiatsu": 10
}, {
  "id": "k20-shomei-seikai",
  "numero": 20,
  "cat": "Kaidō",
  "nome": "Kaidō #20 — Shōmei Seikai (Luz da Vida)",
  "incant": "Luz que atravessa corpo e alma, encontre aquilo que ainda pode ser salvo.",
  "desc": "Feitiço supremo do 4º Esquadrão para salvar Shinigamis em estado crítico.",
  "custoReiatsu": 12
}];
const PATCH_NOTES_HISTORY = [{
  "versao": "5.0",
  "titulo": "A Grande Gênese das Almas & Novo Regulamento Seireitei",
  "data": "23 de Agosto de 2026",
  "destaque": "Motor ZGE v5.0, 50 Zanpakutōs Canônicas, Grimório de 60+ Kidōs com Kaidō Completo, Chat dos Shinigamis e Reformulação da Arena.",
  "banner": "assets/bleach-banner.png",
  "resumo": "Uma atualização monumental que introduz o motor de IA generativa ZGE V5.0 de 4 caminhos com preservação do Soul DNA, integração do sistema de turnos na Arena de Duelos com botão de reset, chat global em tempo real e compêndio definitivo de regras e Kidōs.",
  "secoes": [{
    "tipo": "regras",
    "titulo": "📜 Regulamento Base & Power Scaling Oficial",
    "itens": ["✦ **Power Scaling Oficial**: Padronização dos 9 patamares: 1–10 (Inexperiente), 11–30 (Iniciante), 31–60 (Treinado), 61–100 (Experiente), 101–150 (Elite), 151–250 (Alto Nível), 251–400 (Monstruoso), 401–600 (Lendário), 601+ (Transcendente).", "✦ **Regra de Combate 1d6**: Combate baseado na comparação lógica de Atributos + Técnicas + Narrativa. Rolagens de 1d6 acontecem apenas em dúvida real (1–2: Falha, 3–4: Sucesso Parcial, 5–6: Sucesso).", "✦ **Fadiga por Treinamento OFF**: Máximo de 3 períodos por dia. 2º treino diário aplica −5% nos atributos treinados; 3º treino aplica −15% e bloqueia Miscelâneas no dia. O descanso do dia seguinte remove toda a fadiga.", "✦ **Regras de Raça**: Shinigamis nativos começam com 4 Kidōs básicos; Shinigamis Ex-Humanos aprendem Kidō ao longo da história sem bônus numéricos desmedidos."]
  }, {
    "tipo": "novo",
    "titulo": "🗡️ Motor ZGE V5.0 & 50 Arquétipos Canônicos",
    "itens": ["✦ **4 Caminhos Espirituais Simultâneos**: O gerador agora produz 4 interpretações da mesma alma (1. Elemental/Temperamento ~45%, 2. Conceitual/Progressivo ~20%, 3. Compensatório/Complementar, 4. Opositivo/Experimental).", "✦ **Bankai Evolution Engine**: Toda Bankai identifica o limite da Shikai, o Ponto de Ruptura e evolui o princípio conceitual em vez de apenas inflar números.", "✦ **Anti-Duplicação Estrita**: Assinatura semântica única e índice de similaridade (0–30% Liberado, 31–60% Permitido com mecânica distinta, 61–80% Reformulação, 81–100% Bloqueio).", "✦ **Catálogo dos 50 Mestres**: Ingestão completa de Kurotsubaki, Akagane, Suisen, Hoshikuzu, Kōriame, Kagamibana, Mukade, Raimei, Shirogane e outros 41 espíritos canônicos."]
  }, {
    "tipo": "social",
    "titulo": "💬 Chat Global dos Shinigamis & Arena de Turnos",
    "itens": ["✦ **Chat dos Shinigamis em Tempo Real**: Canal de interação direta entre todos os jogadores logados e ADMs, com sincronização em nuvem e histórico contínuo.", "✦ **Histórico de Turnos da Arena**: Registro cronológico de ações, decisões dos juízes e rolagens públicas com botão dedicado de **Resetar Duelo**.", "✦ **Acesso Sutil da Administração**: O login do ADM foi transformado em um selo estético discreto (`❖`) no topo da interface para não poluir a imersão dos jogadores."]
  }, {
    "tipo": "buffs",
    "titulo": "▲ Melhorias & Buffs",
    "itens": ["▲ **Grimório de Kaidō Completo**: Adicionados 20 feitiços médicos de tratamento, regeneração celular e restauração de Reiatsu com seus respectivos encantamentos poéticos.", "▲ **Distribuidor de Recompensas no ADM**: Permite conceder pontos de atributos diretamente em Pressão, Força, Velocidade, Resiliência ou Pontos Livres com atalhos de +1, +2, +5, +10 e +15.", "▲ **Performance de Salvamento**: Serialização enxuta do armazenamento local eliminando mensagens de erro de cota no navegador."]
  }]
}, {
  "versao": "4.2",
  "titulo": "Ressonância do Reishi & O Baú Espiritual",
  "data": "18 de Agosto de 2026",
  "destaque": "Animação de baú com mecânica de suspense (~7s), sintetizador sonoro de Shikai e Bankai, selamento permanente de personalidade.",
  "banner": "assets/ichigo-orange.png",
  "resumo": "Introdução do sistema de animação visual para abertura de roletas e gacha com probabilidade de tensão crítica de Reiatsu, além da implementação da trava imutável do DNA da alma.",
  "secoes": [{
    "tipo": "novo",
    "titulo": "✦ Novidades do Gacha",
    "itens": ["✦ **Baú Espiritual 3D**: Animação de convergência de partículas de Reishi com runas rotativas e quebra de selos.", "✦ **Mecânica de Suspense (~28%)**: Em giros de alta tensão, o baú demora ~7s adicionais com tela tremendo e áudio pulsante.", "✦ **Trava de Personalidade**: Campo guiado de psicologia com botão de selamento definitivo e imutável para jogadores."]
  }, {
    "tipo": "ajustes",
    "titulo": "⚙️ Áudio & Efeitos Sonoros",
    "itens": ["⚙️ Síntese em tempo real com Web Audio API para carregamento e revelação de Shikai (`shikai_charge`, `shikai_reveal`) e Bankai (`bankai_charge`, `bankai_reveal`)."]
  }]
}, {
  "versao": "4.0",
  "titulo": "O Despertar dos 4 Caminhos",
  "data": "10 de Agosto de 2026",
  "destaque": "Criação do motor de 4 caminhos simultâneos para Shikai e Bankai com complexidade de 1 a 10.",
  "banner": "assets/ichigo-moon.png",
  "resumo": "A transição de sorteios genéricos de Zanpakutō para um ritual autoral de manifestação espiritual guiado pela personalidade do Shinigami.",
  "secoes": [{
    "tipo": "novo",
    "titulo": "✦ Arquitetura de Caminhos",
    "itens": ["✦ Separação entre Caminho Elemental, Caminho Conceitual, Caminho Compensatório e Caminho Opositivo.", "✦ Gráficos com barras de 1 a 10 para Potência, Alcance, Complexidade, Versatilidade e Custo de Reiatsu."]
  }]
}, {
  "versao": "3.5",
  "titulo": "Ajuste de Power Scaling & Fadiga de Treino",
  "data": "01 de Agosto de 2026",
  "destaque": "Regulamentação dos 3 períodos de treino diários em OFF e penalidades de fadiga temporária.",
  "banner": "assets/bleach-banner.png",
  "resumo": "Implementação de freios narrativos para impedir inflação desenfreada de atributos em poucos dias de RPG.",
  "secoes": [{
    "tipo": "nerfs",
    "titulo": "▼ Controle de Progressão",
    "itens": ["▼ **Teto de Treino Diário**: Máximo de 9 pontos conquistáveis por dia (3 períodos excelentes de até 3 pontos).", "▼ **Penalidades de Fadiga**: -5% no 2º treino e -15% no 3º treino nos atributos focados.", "▼ **Restrição de Miscelânea**: Personagens com 3 treinos no dia ficam impossibilitados de recolher drops de cenas cotidianas."]
  }]
}, {
  "versao": "3.0",
  "titulo": "Separação de Roletas & Especialidades Marciais",
  "data": "20 de Julho de 2026",
  "destaque": "Divisão entre Giros Comuns e Giros Especiais com tabela de porcentagens estritas.",
  "banner": "assets/ichigo-orange.png",
  "resumo": "Criação de pools de recompensas distintos para treinos comuns e missões nobres de grande escala.",
  "secoes": [{
    "tipo": "novo",
    "titulo": "✦ Sorteios Segmentados",
    "itens": ["✦ **Pool Comum**: 65% Básico (+1/+2 pts), 22% Incomum (+3/+4 pts), 9% Raro (+5/+7 pts), 3.5% Épico (+8/+11 pts), 0.5% Lendário (+14/+18 pts).", "✦ **Pool Especial**: Elixires, Tomos de Hadō, Relíquias Shihōin e Missão Narrativa Suprema de Despertar Único (1%)."]
  }]
}, {
  "versao": "2.5",
  "titulo": "Grimório de Hadō & Bakudō",
  "data": "05 de Julho de 2026",
  "destaque": "Compilação dos primeiros 40 feitiços canônicos de Hadō e Bakudō no sistema.",
  "banner": "assets/ichigo-moon.png",
  "resumo": "Inclusão do catálogo de feitiços com cálculo de custos de Reiatsu e limites por cena.",
  "secoes": [{
    "tipo": "regras",
    "titulo": "📜 Mecânica de Kidō",
    "itens": ["✦ Cálculo do teto de conjuração por cena através da fórmula `Math.max(3, Math.floor(Pressão / 7) + 1)`.", "✦ Inclusão de encantamentos completos para Hadō #31, #33, #73 e #90."]
  }]
}, {
  "versao": "2.0",
  "titulo": "Sincronização em Nuvem Firebase",
  "data": "15 de Junho de 2026",
  "destaque": "Integração em tempo real com Firebase Realtime Database e gestão multiusuário.",
  "banner": "assets/bleach-banner.png",
  "resumo": "Permitiu que mestres e jogadores acessassem fichas simultaneamente com persistência contínua na nuvem.",
  "secoes": [{
    "tipo": "novo",
    "titulo": "✦ Infraestrutura Cloud",
    "itens": ["✦ Sincronização periódica em background de fichas, combates e logs de dados.", "✦ Revogação instantânea de sessões no navegador quando a ficha é excluída pelo ADM."]
  }]
}, {
  "versao": "1.5",
  "titulo": "Arena de Duelos & Painel de Juiz",
  "data": "28 de Maio de 2026",
  "destaque": "Lançamento da Arena com status dos combatentes e registro de decisões narrativas.",
  "banner": "assets/ichigo-orange.png",
  "resumo": "Espaço dedicado para combates supervisionados por narradores com apoio de rolagens públicas de dados.",
  "secoes": [{
    "tipo": "novo",
    "titulo": "✦ Recursos da Arena",
    "itens": ["✦ Comparativo visual de atributos entre dois lutadores.", "✦ Log de arbitragem com decisões oficiais gravadas na linha do tempo."]
  }]
}, {
  "versao": "1.2",
  "titulo": "Padronização de Atributos & Estados",
  "data": "10 de Maio de 2026",
  "destaque": "Definição dos 4 atributos base (10 iniciais + 20 livres) e 4 estados de combate.",
  "banner": "assets/ichigo-moon.png",
  "resumo": "Estabeleceu a regra fundamental de que o número na ficha é o atributo real, sem multiplicadores ocultos.",
  "secoes": [{
    "tipo": "regras",
    "titulo": "📜 Atributos e Saúde",
    "itens": ["✦ Definição dos 4 atributos: Pressão Espiritual, Força, Velocidade e Resiliência.", "✦ Substituição de pontos de vida por 4 estados: Inteiro, Ferido, Debilitado e Derrotado."]
  }]
}, {
  "versao": "1.0",
  "titulo": "Fundação da Sociedade das Almas RPG",
  "data": "01 de Maio de 2026",
  "destaque": "Lançamento oficial da plataforma de fichas e fichário dos Shinigamis.",
  "banner": "assets/bleach-banner.png",
  "resumo": "O nascimento do sistema digital do Bleach RPG com autenticação por código de acesso, ranqueamentos de honra e histórico de personagens.",
  "secoes": [{
    "tipo": "novo",
    "titulo": "✦ Fundação do Sistema",
    "itens": ["✦ Criação da arquitetura de fichas com suporte a foto de perfil, dados civis e técnicas.", "✦ Rankings automatizados de Honra (Média Física e Pressão Espiritual)."]
  }]
}];

// =========================================================================
// GLOBAL CORE UTILITY FUNCTIONS (PERMANENT SYSTEM FIX)
// =========================================================================

function uid() {
  return "zk-" + Math.random().toString(36).slice(2, 9) + "-" + Date.now().toString(36);
}
function nowStr() {
  const d = new Date();
  return d.getDate().toString().padStart(2, '0') + '/' + (d.getMonth() + 1).toString().padStart(2, '0') + '/' + d.getFullYear() + ' às ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
}
function maskWhats(w) {
  if (!w) return "—";
  const cleaned = String(w).replace(/\D/g, "");
  if (cleaned.length < 4) return cleaned;
  return "•••• " + cleaned.slice(-4);
}
function getPowerTier(statVal) {
  const val = Number(statVal) > 150 ? Math.round(Number(statVal) / 4) : Number(statVal || 0);
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
    title: "Veterano",
    patamar: "61–100",
    color: C.purple
  };
  if (val <= 150) return {
    title: "Mestre",
    patamar: "101–150",
    color: C.yellow
  };
  return {
    title: "Transcendental",
    patamar: "150+",
    color: "#FFD700"
  };
}

// Web Audio API Synthesizer
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}
function playReiatsuSound(type = 'hum') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
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

// GLOBAL REACT ERROR BOUNDARY COMPONENT
class ErrorBoundary extends (React.Component || class {}) {
  constructor(props) {
    super(props);
    this.props = props || {};
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Critical React Error Caught by ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state && this.state.hasError) {
      return /*#__PURE__*/React.createElement("div", {
        className: "min-h-screen bg-[#0A0908] text-[#F3EEE3] flex items-center justify-center p-4"
      }, /*#__PURE__*/React.createElement("div", {
        className: "max-w-xl w-full bg-[#16130F] border-2 border-red-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(214,72,63,0.4)] text-center space-y-6"
      }, /*#__PURE__*/React.createElement("div", {
        className: "w-16 h-16 mx-auto rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-3xl"
      }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
        className: "text-[11px] font-extrabold uppercase px-3 py-1 rounded-full bg-red-900/60 border border-red-500 text-red-300 tracking-widest"
      }, "Distor\xE7\xE3o Espiritual Detectada"), /*#__PURE__*/React.createElement("h2", {
        className: "font-title text-3xl text-white mt-3 tracking-wider"
      }, "Ruptura de Reiatsu no Sistema"), /*#__PURE__*/React.createElement("p", {
        className: "text-sm text-[#C9C1AF] mt-2 leading-relaxed"
      }, "Ocorreu uma anomalia no carregamento dos dados espirituais. Voc\xEA pode recarregar a p\xE1gina ou restaurar os dados locais para recuperar o fluxo de Reishi.")), /*#__PURE__*/React.createElement("div", {
        className: "p-3 bg-black/60 rounded-xl border border-red-900/50 text-left font-mono text-xs text-red-400 overflow-x-auto max-h-36"
      }, this.state.error?.toString() || "Erro desconhecido"), /*#__PURE__*/React.createElement("div", {
        className: "flex flex-col sm:flex-row gap-3 justify-center pt-2"
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => window.location.reload(),
        className: "px-5 py-2.5 rounded-xl bg-[#FF6A13] hover:bg-[#C94E0A] text-black font-extrabold text-sm transition shadow-[0_0_15px_rgba(255,106,19,0.4)]"
      }, "\uD83D\uDD04 Recarregar P\xE1gina"), /*#__PURE__*/React.createElement("button", {
        onClick: () => {
          try {
            localStorage.clear();
          } catch (e) {}
          window.location.reload();
        },
        className: "px-5 py-2.5 rounded-xl bg-black/80 hover:bg-black border border-red-500/50 hover:border-red-500 text-red-300 text-sm font-bold transition"
      }, "\uD83E\uDDF9 Limpar Cache & Restaurar"))));
    }
    return this.props?.children || null;
  }
}
const DEFAULT_DB = {
  superAdminUsuario: "Malu123",
  superAdminSenha: "Sociedade2026",
  superAdminNome: "ADM Máximo (Comandante Supremo)",
  firebaseUrl: "https://bleach-rpg-6894c-default-rtdb.firebaseio.com/",
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
    estadoP1: "Inteiro",
    estadoP2: "Ferido",
    turnos: [],
    finalizado: false
  }],
  rolagensDadosPublicas: [{
    id: "d1",
    autor: "Mestre Kisuke",
    personagem: "Kurosaki Ren",
    dado: "d6",
    resultado: 6,
    categoria: "Sucesso Total (5–6)",
    data: "22/08/2026 às 15:35"
  }],
  mensagensChat: [{
    id: "msg-welcome-1",
    autorNome: "Comandante Supremo",
    charFoto: "assets/ichigo-moon.png",
    esquadrao: "1º Esquadrão",
    texto: "Bem-vindos ao canal de comunicação direta da Sociedade das Almas. Mantenham o decoro e compartilhem suas jornadas!",
    timestamp: "10:00",
    data: "Hoje"
  }],
  zanpakutosVinculadas: [],
  personagens: [{
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
    permissoes: {
      shikaiLiberada: true,
      bankaiLiberada: false
    },
    atributos: {
      pressao: 45,
      forca: 30,
      velocidade: 60,
      resiliencia: 25
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
      id: "t-byak",
      nome: "Hadō #4 — Byakurai",
      categoria: "Hadō"
    }, {
      id: "t-sai",
      nome: "Bakudō #1 — Sai",
      categoria: "Bakudō"
    }],
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
    historico: [{
      id: "h1",
      data: "20/08/2026 às 10:00",
      texto: "Ficha oficial aprovada pela Administração."
    }]
  }]
};
function calculateRankings(personagens = []) {
  const list = Array.isArray(personagens) ? personagens : [];
  const rankFisico = [...list].map(p => {
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
  const rankPressao = [...list].map(p => {
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

// =========================================================================
// BLEACH RPG — MOTOR COGNITIVO DE GÊNESE ESPIRITUAL (ZGE V5.0)
// Conexão com ChatGPT / OpenAI API + Sintetizador Dinâmico Baseado na Personalidade
// COM REGRA ESTRITA DE EXCLUSIVIDADE & ANTI-SIMILARIDADE (ZERO DUPLICATAS)
// =========================================================================

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
  if (nomeA === nomeB && nomeA.length > 0) score += 60;else if (nomeA.length > 3 && nomeB.length > 3 && (nomeA.includes(nomeB) || nomeB.includes(nomeA))) score += 35;
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
  const matchPct = intersection / maxWords * 35;
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
  return {
    claimed,
    claimedNames,
    claimedElements
  };
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
  const attrs = personagem.atributos || {
    pressao: 10,
    forca: 10,
    velocidade: 10,
    resiliencia: 10
  };
  const pList = [{
    key: "pressao",
    label: "Pressão Espiritual",
    val: Number(attrs.pressao || 10)
  }, {
    key: "forca",
    label: "Força Física",
    val: Number(attrs.forca || 10)
  }, {
    key: "velocidade",
    label: "Velocidade",
    val: Number(attrs.velocidade || 10)
  }, {
    key: "resiliencia",
    label: "Resiliência",
    val: Number(attrs.resiliencia || 10)
  }].sort((a, b) => b.val - a.val);
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
  const existingSection = existingList.length > 0 ? `\nZANPAKUTŌS JÁ REGISTRADAS NO SISTEMA (ESTRITAMENTE PROIBIDO REPETIR OU GERAR NOMES/PODERES/CONCEITOS SIMILARES A ESTAS):\n${existingList.join('\n')}\n` : "";
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
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  let posHash = Math.abs(hash);
  const prefixosKanji = [{
    romaji: "Gō",
    kanji: "剛",
    sign: "Inquebrável"
  }, {
    romaji: "En",
    kanji: "炎",
    sign: "Chama Voraz"
  }, {
    romaji: "Rin",
    kanji: "凛",
    sign: "Gélido e Sereno"
  }, {
    romaji: "Sen",
    kanji: "閃",
    sign: "Relâmpago Instantâneo"
  }, {
    romaji: "Haku",
    kanji: "白",
    sign: "Alvo Puro"
  }, {
    romaji: "Kuro",
    kanji: "黒",
    sign: "Sombra Abissal"
  }, {
    romaji: "Shin",
    kanji: "神",
    sign: "Divino"
  }, {
    romaji: "Ten",
    kanji: "天",
    sign: "Celestial"
  }, {
    romaji: "Kyou",
    kanji: "狂",
    sign: "Fúria Espiritual"
  }, {
    romaji: "Rai",
    kanji: "雷",
    sign: "Trovão"
  }, {
    romaji: "Sei",
    kanji: "聖",
    sign: "Sacro"
  }, {
    romaji: "Koku",
    kanji: "虚",
    sign: "Vazio Cósmico"
  }, {
    romaji: "Kō",
    kanji: "光",
    sign: "Luz Radiante"
  }, {
    romaji: "Jū",
    kanji: "重",
    sign: "Gravidade Intensa"
  }, {
    romaji: "Sui",
    kanji: "水",
    sign: "Fluidez Hidráulica"
  }, {
    romaji: "Fū",
    kanji: "風",
    sign: "Vendaval Cortante"
  }];
  const sufixosKanji = [{
    romaji: "jin",
    kanji: "刃",
    sign: "Lâmina"
  }, {
    romaji: "zan",
    kanji: "斬",
    sign: "Corte Preciso"
  }, {
    romaji: "getsu",
    kanji: "月",
    sign: "Lua"
  }, {
    romaji: "rin",
    kanji: "輪",
    sign: "Anel Espiritual"
  }, {
    romaji: "kaze",
    kanji: "風",
    sign: "Vento"
  }, {
    romaji: "ryū",
    kanji: "竜",
    sign: "Dragão"
  }, {
    romaji: "mori",
    kanji: "森",
    sign: "Bastião"
  }, {
    romaji: "chō",
    kanji: "蝶",
    sign: "Borboleta Espiritual"
  }, {
    romaji: "hō",
    kanji: "鋒",
    sign: "Fio Cortante"
  }, {
    romaji: "sen",
    kanji: "閃",
    sign: "Fagulha Instantânea"
  }, {
    romaji: "maru",
    kanji: "丸",
    sign: "Círculo Perfeito"
  }, {
    romaji: "kaku",
    kanji: "鶴",
    sign: "Garça Cerimonial"
  }, {
    romaji: "ba",
    kanji: "羽",
    sign: "Asas da Alma"
  }, {
    romaji: "sou",
    kanji: "槍",
    sign: "Lança Perfurante"
  }];
  function gerarNomeDinamico(offset, temaElem) {
    for (let tryIdx = 0; tryIdx < 50; tryIdx++) {
      const p = prefixosKanji[(posHash + offset * 7 + tryIdx * 3) % prefixosKanji.length];
      const s = sufixosKanji[(posHash + offset * 11 + tryIdx * 5) % sufixosKanji.length];
      const candidate = `${p.romaji}${s.romaji}`;
      const kanji = `「${p.kanji}${s.kanji}」`;
      const trad = `${p.sign} de ${s.sign}`;
      if (!claimedNames.has(candidate.toLowerCase())) {
        return {
          nome: candidate,
          kanji,
          trad
        };
      }
    }
    const p = prefixosKanji[(posHash + offset) % prefixosKanji.length];
    const s = sufixosKanji[(posHash + offset * 3) % sufixosKanji.length];
    const uniqueNum = posHash % 89 + 10;
    return {
      nome: `${p.romaji}${s.romaji} no Shin`,
      kanji: `「${p.kanji}${s.kanji}・真」`,
      trad: `${p.sign} de ${s.sign} (Transcendente)`
    };
  }

  // 1. CAMINHO 1: ELEMENTAL / TEMPERAMENTO
  const n1 = gerarNomeDinamico(0, "elemental");
  const elemPool = [{
    el: "Plasma Espiritual & Chamas Carmesim",
    arma: "Katana com lâmina de borda incandescente e tsuba em flor de lótus de fogo",
    pod: "Ao brandir a espada, ${personagem.nome} expele ondas de calor comprimido que aumentam a fricção do ar e cortam a armadura de Reishi adversária com estocadas explosivas.",
    lim: "O calor elevado desgasta o punho e exige pausas de resfriamento entre sequências de golpes intensos."
  }, {
    el: "Eletromagnetismo & Relâmpagos Negros",
    arma: "Chokutō de aço fosco envolta em filamentos de plasma negro cintilante",
    pod: "A lâmina polariza o ar ao redor do alvo, fazendo com que cada corte dispare descargas cinéticas que aceleram a lâmina em trajetórias angulares imprevisíveis.",
    lim: "Descargas consecutivas reduzem temporariamente o tempo de reação motora do usuário."
  }, {
    el: "Geada Primordial & Cristais Refratários",
    arma: "Tachi de cristal translúcido com reflexos glaciais que emitem névoa constante",
    pod: "Solidifica a umidade espiritual do perímetro em espinhos de gelo microscópicos que se alojam nas feridas e drenam o calor cinético do adversário.",
    lim: "Perde eficácia e alcance em ambientes de calor escaldante ou sem umidade."
  }, {
    el: "Vácuo Espiritual & Lâminas de Vento Sônico",
    arma: "Wakizashi de dois gumes com micro-fendas acústicas na calha central",
    pod: "Cria bolsas de vácuo pressurizado que viajam na velocidade do som, desferindo múltiplos cortes invisíveis à distância sem produzir ruído sonoro.",
    lim: "O vento dispersa caso o usuário seja desestabilizado por impactos pesados diretos."
  }];
  const elChoice = elemPool[posHash % elemPool.length];
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
      indices: {
        potencia: 9,
        abrangencia: 8,
        complexidade: 6,
        versatilidade: 7,
        custo: 6
      }
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
  const conceitualPool = [{
    el: "Controle de Vetores & Troca de Posição",
    arma: "Espada de lâmina bifurcada com guarda em compasso astronômico",
    pod: "Ao cruzar a lâmina com o inimigo, marca o ponto de contato com um vetor de força. O usuário pode inverter instantaneamente a direção cinética de qualquer projétil ou golpe subsequente que atinja a mesma marcação.",
    lim: "Requer contato prévio de lâminas para estabelecer cada vetor."
  }, {
    el: "Contagem de Cadência & Supressão Sequencial",
    arma: "Lâmina reta graduada com 5 entalhes rúnicos dourados",
    pod: "Cada impacto consecutivo sem sofrer contra-ataque ativa um dos entalhes. A cada nível ativado, o peso espiritual da espada dobra e reduz o tempo de reação do adversário em 20%.",
    lim: "Se o usuário sofrer um golpe contundente, todos os entalhes se desfazem e a contagem reinicia."
  }, {
    el: "Ressonância Harmônica & Vibração Molecular",
    arma: "Rapieira com empunhadura em diapasão duplo de prata celestial",
    pod: "Emite ondas vibratórias em alta frequência que sintonizam com a estrutura de Reishi do oponente, fragmentando defesas rígidas e dissipando barreiras espirituais no instante do choque.",
    lim: "Exige cálculo contínuo de distância e timing milimétrico para manter a ressonância."
  }];
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
      indices: {
        potencia: 8,
        abrangencia: 6,
        complexidade: 10,
        versatilidade: 9,
        custo: 5
      }
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
  const compPool = [{
    el: "Fricção Gravitacional & Âncoras Cinéticas",
    arma: "Espada pesada de lâmina larga com placas segmentadas de aço de meteorito",
    pod: "Cria um campo gravitacional denso ao redor de ${personagem.nome} que desacelera projéteis e ataques de alta velocidade à medida que se aproximam, convertendo a força de colisão em estabilidade postural inabalável.",
    lim: "Reduz levemente a agilidade de deslocamento aéreo enquanto a âncora está ativada."
  }, {
    el: "Prismas de Refração Espiritual & Dispersão de Impacto",
    arma: "Sabre prateado com tsuba espelhada e lâmina facetada como diamante",
    pod: "Fragmenta qualquer ataque espiritual recebido em feixes de luz inofensivos, redistribuindo o choque por toda a atmosfera ao redor e curando micro-fissuras no corpo do usuário.",
    lim: "Apenas dissipa energia espiritual; não anula ataques puramente físicos de massa sólida."
  }, {
    el: "Névoa de Reishi Regenerativo & Alívio de Fadiga",
    arma: "Florete flexível com lâmina transparente e detalhes de pétalas esculpidas",
    pod: "Libera uma névoa aromática de partículas de cura que cicatriza ferimentos e restaura a estamina de ${personagem.nome} a cada corte bem-sucedido contra o oponente.",
    lim: "Não regenera órgãos vitais instantaneamente em caso de lesão fatal imediata."
  }];
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
      indices: {
        potencia: 7,
        abrangencia: 7,
        complexidade: 7,
        versatilidade: 9,
        custo: 4
      }
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
  const oposPool = [{
    el: "Distorção Perceptiva & Espelhos do Vazio",
    arma: "Wakizashi de dois gumes com fio invertido e lâmina de vidro negro",
    pod: "Distorce a percepção sensorial do adversário, fazendo-o enxergar o ângulo dos cortes com um desvio angular de 30 graus em relação à trajetória física real.",
    lim: "Oponentes experientes com sentidos espirituais aguçados podem antecipar pelo som do deslocamento de ar."
  }, {
    el: "Inversão de Causalidade & Absorção de Sombra",
    arma: "Kusarigama com corrente de sombra líquida e lâmina fosca sem brilho",
    pod: "Converte as sombras projetadas pelos combatentes em lâminas sólidas que atacam de surpresa a partir do chão, ignorando a postura defensiva frontal do alvo.",
    lim: "Requer fontes de luz no ambiente para que silhuetas e sombras sejam projetadas no solo."
  }, {
    el: "Paradoxo Espacial & Supressão de Presença",
    arma: "Nodachi de lâmina cinzenta que parece vibrar entre duas posições no ar",
    pod: "Faz com que a espada atravesse defesas sólidas de Reishi como névoa intangível e só adquira massa física sólida no exato instante do corte contra o alvo.",
    lim: "Demanda serenidade absoluta; qualquer hesitação do usuário torna a espada tangível antes da hora."
  }];
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
      indices: {
        potencia: 10,
        abrangencia: 8,
        complexidade: 9,
        versatilidade: 8,
        custo: 8
      }
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
      try {
        localStorage.removeItem("bleach_openai_key");
      } catch (e) {}
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
  const {
    claimed,
    claimedNames,
    claimedElements
  } = getClaimedSignatures(dbPersonagens, dbZanpakutosVinculadas);
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  let keyToUse = getValidGeminiApiKey(apiKey);
  let caminhosResultantes = null;
  async function callGemini(key) {
    const prompt = construirPromptChatGPT(personagem, dna, cenaTexto, dbPersonagens, dbZanpakutosVinculadas);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: prompt + "\n\nResponda ESTRITAMENTE em formato JSON válido conforme o esquema solicitado."
          }]
        }],
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
          messages: [{
            role: "system",
            content: "Você é um mestre narrador de Bleach RPG especialista no Zanpakuto Genesis Engine v5.0. Responda APENAS em JSON válido."
          }, {
            role: "user",
            content: prompt
          }],
          response_format: {
            type: "json_object"
          },
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
  const validatedCaminhos = caminhosResultantes.map(c => {
    let maxSimilarity = 0;
    let similarWithChar = "";
    let similarWithZk = "";
    (dbPersonagens || []).forEach(otherP => {
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
  const {
    claimedNames,
    claimedElements
  } = getClaimedSignatures(dbPersonagens, dbZanpakutosVinculadas);
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  return sintetizarZanpakutosCognitivo(personagem, dna, cenaTexto, claimedNames, claimedElements);
}

// =========================================================================
// 6. MÓDULO DE EVOLUÇÃO DE BANKAI (3 CAMINHOS A PARTIR DA SHIKAI ESCOLHIDA)
// =========================================================================

function construirPromptBankaiEvolucao(personagem, shikai, dna, cenaTexto = "", dbPersonagens = [], dbZanpakutosVinculadas = []) {
  const existingList = getExistingZanpakutosSummary(dbPersonagens, dbZanpakutosVinculadas);
  const existingSection = existingList.length > 0 ? `\nZANPAKUTŌS JÁ REGISTRADAS NO SISTEMA (PROIBIDO REPETIR NOMES/PODERES/CONCEITOS):\n${existingList.join('\n')}\n` : "";
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
- Poder & Mecânica Transcendental com LIMITAÇÕES claras de combate
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
  return [{
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
    limitacoes: `Consumo massivo de Reiatsu proporcional à Pressão Espiritual (${dna.dominante.val} pts), exigindo foco absoluto para não sobrecarregar os circuitos da alma.`,
    significadoEspiritual: `A consagração definitiva da determinação inabalável de ${personagem.nome} em transcender seus limites.`,
    shikaiBase: sNome,
    indices: {
      potencia: 10,
      abrangencia: 9,
      complexidade: 8,
      versatilidade: 8,
      custo: 9
    }
  }, {
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
    limitacoes: "Requer controle tático contínuo para manter a estabilidade entre o ataque ofensivo e a barreira de suporte.",
    significadoEspiritual: `A maturidade espiritual de ${personagem.nome} em proteger não apenas sua vida, mas a honra e o destino de todos ao seu redor.`,
    shikaiBase: sNome,
    indices: {
      potencia: 9,
      abrangencia: 8,
      complexidade: 9,
      versatilidade: 10,
      custo: 7
    }
  }, {
    opcaoNumero: 3,
    tipoEvolucao: "Evolução Oposta Complementar",
    subtitulo: "Inversão da Realidade & Paradoxo da Sombra",
    nome: `${sNome}: Muken Paradox`,
    kanji: `「${sKanji ? sKanji.replace(/[^\\u4e00-\\u9faf]/g, '') : '卍'}・無間反理」`,
    traducao: "Paradoxo Infinito da Antítese",
    comando: `Ban-kai! Inverta a verdade e revele o abismo, ${sNome}!`,
    pontoRuptura: `Inverte a regra básica de funcionamento da Shikai: o que antes dependia de contato ou corte direto agora atua como uma lei cósmica paradoxal atrelada ao conflito interior ("${dna.conflitos}").`,
    formaMonumental: `O cenário escurece em tons monocromáticos onde as cores da Reiatsu de ${sElem} se invertem, criando distorções geométricas flutuantes de sombra e vazio.`,
    poder: `Manifesta o lado sombrio do poder: em vez do efeito direto da Shikai (${sPod}), impõe uma lei onde qualquer resistência hostil do oponente alimenta a dissolução da sua própria estabilidade de Reishi.`,
    limitacoes: `Risco de desestabilização da própria mente se o usuário sucumbir ao defeito "${dna.defeitos}".`,
    significadoEspiritual: `O domínio pleno da dualidade: ${personagem.nome} aceita sua sombra interior e a transforma na sua arma mais letal.`,
    shikaiBase: sNome,
    indices: {
      potencia: 10,
      abrangencia: 9,
      complexidade: 10,
      versatilidade: 8,
      custo: 9
    }
  }];
}

// Função Assíncrona de Geração de 3 Bankais com IA
async function gerar3BankaisEvolucaoAI_Async(personagem, shikai, dbPersonagens = [], dbZanpakutosVinculadas = [], cenaTexto = "", apiKey = "") {
  const shikaiBase = shikai || personagem.zanpakuto?.shikaiAtiva || {
    nome: "Zanpakutō",
    elemento: "Espiritual"
  };
  const dna = construirDnaEspiritual(personagem, cenaTexto);
  let keyToUse = getValidGeminiApiKey(apiKey);
  let bankaisResultantes = null;
  async function callGeminiBankai(key) {
    const prompt = construirPromptBankaiEvolucao(personagem, shikaiBase, dna, cenaTexto, dbPersonagens, dbZanpakutosVinculadas);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: prompt + "\n\nResponda ESTRITAMENTE em formato JSON válido conforme o esquema de 3 bankais solicitado."
          }]
        }],
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
        } catch (e) {}
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
          messages: [{
            role: "system",
            content: "Você é um mestre narrador de Bleach RPG especialista em Bankai e no Zanpakuto Genesis Engine v5.0. Responda APENAS em JSON válido."
          }, {
            role: "user",
            content: prompt
          }],
          response_format: {
            type: "json_object"
          },
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
  const shikaiBase = shikai || personagem.zanpakuto?.shikaiAtiva || {
    nome: "Zanpakutō",
    elemento: "Espiritual"
  };
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
}

// =========================================================================
// MODAL COMPONENTS: GACHA CHEST, AWAKENING SCENE & 4 SPIRITUAL PATHS (WITH CHATGPT & DYNAMIC SOUL AI)
// =========================================================================

// 1. GACHA CHEST OPENING MODAL (COM MECÂNICA DE SUSPENSE ~7S)
function SpiritualChestModal({
  modal,
  onClose,
  onColetar
}) {
  if (!modal || !modal.open) return null;
  const isSuspense = !!modal.isSuspense;
  const progress = modal.progress || 0;
  const isRevealed = progress >= 100 && modal.resultado;
  const isEspecial = modal.tipo === "especial";
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `relative w-full max-w-lg bg-bleach-panel border-2 rounded-2xl p-6 shadow-2xl text-center overflow-hidden transition-all duration-300 ${isEspecial ? "border-purple-500/80 purple-reiatsu-glow" : "border-bleach-orange/80 reiatsu-glow"} ${isSuspense && !isRevealed ? "reiatsu-screen-shake" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "heat-haze-overlay"
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border tracking-widest ${isEspecial ? "bg-purple-950/80 border-purple-400 text-purple-300" : "bg-orange-950/80 border-bleach-orange text-bleach-orange"}`
  }, isEspecial ? "🌟 Baú de Reishi Especial de Seireitei" : "🎲 Caixa Espiritual de Recompensa"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl sm:text-3xl text-white tracking-wider mt-2"
  }, isRevealed ? isEspecial ? "CONQUISTA TRANSCENDENTAL REVELADA!" : "RECOMPENSA LIBERADA!" : isSuspense ? "⚡ ALERTA: TENSÃO ESPIRITUAL EXTREMA!" : "CANALIZANDO REIRYOKU...")), !isRevealed ? /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 py-6 flex flex-col items-center justify-center min-h-[220px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-40 h-40 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: `absolute inset-0 rounded-full border-2 border-dashed ${isEspecial ? "border-purple-400/40" : "border-bleach-orange/40"} spin-runes`
  }), /*#__PURE__*/React.createElement("div", {
    className: `absolute inset-3 rounded-full border border-dotted ${isSuspense ? "border-red-400/60" : isEspecial ? "border-cyan-400/40" : "border-amber-400/40"} spin-runes-fast`
  }), /*#__PURE__*/React.createElement("div", {
    className: `relative w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${isEspecial ? "bg-gradient-to-br from-purple-900 via-indigo-950 to-black border-2 border-purple-400 shadow-[0_0_40px_rgba(139,111,214,0.6)]" : "bg-gradient-to-br from-orange-900 via-stone-950 to-black border-2 border-bleach-orange shadow-[0_0_40px_rgba(255,106,19,0.5)]"} ${isSuspense ? "scale-110 rotate-1 animate-pulse" : "scale-100"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-bounce"
  }, isEspecial ? "💎" : "📦"), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 rounded-2xl border border-white/20 animate-ping opacity-30"
  }))), isSuspense && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 px-4 py-2 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs font-bold animate-pulse shadow-lg"
  }, "\u26A0\uFE0F O selo de conten\xE7\xE3o est\xE1 em alta turbul\xEAncia! A revela\xE7\xE3o est\xE1 sendo forjada no limite da alma..."), /*#__PURE__*/React.createElement("div", {
    className: "w-full mt-5 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center text-xs font-mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-creamDim"
  }, modal.stageText || "Ressonando frequência espiritual..."), /*#__PURE__*/React.createElement("span", {
    className: `font-bold ${isEspecial ? "text-purple-300" : "text-bleach-orange"}`
  }, progress, "%")), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-black/70 h-3 rounded-full overflow-hidden border border-white/10 p-0.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full rounded-full transition-all duration-100 ${isEspecial ? "bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-300 shadow-[0_0_15px_#8B6FD6]" : "bg-gradient-to-r from-orange-600 via-bleach-orange to-yellow-400 shadow-[0_0_15px_#FF6A13]"}`,
    style: {
      width: `${Math.min(100, progress)}%`
    }
  })))) :
  /*#__PURE__*/
  /* Revealed Stage */
  React.createElement("div", {
    className: "relative z-10 py-4 space-y-4 card-pop-reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-6 rounded-2xl bg-black/80 border border-white/10 space-y-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black uppercase px-3 py-1 rounded-full border inline-block tracking-widest",
    style: {
      color: modal.resultado.cor,
      borderColor: modal.resultado.cor,
      backgroundColor: `${modal.resultado.cor}20`
    }
  }, modal.resultado.raridade || modal.resultado.nome), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-3xl sm:text-4xl text-white tracking-wider"
  }, modal.resultado.nome), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim leading-relaxed max-w-md mx-auto"
  }, modal.resultado.desc), modal.resultado.tipo === "pontos" && modal.resultado.valorGanho && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-gradient-to-r from-orange-950/60 to-black rounded-xl border border-bleach-orange/40 text-sm font-mono text-bleach-orange font-bold"
  }, "+", modal.resultado.valorGanho, " Pontos adicionados aos seus Pontos Livres!")), /*#__PURE__*/React.createElement("button", {
    onClick: () => onColetar(modal.resultado),
    className: "w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
  }, "\u2713 Resgatar Recompensa & Salvar na Ficha"))));
}
function CenaDespertarModal({
  tipo,
  modalTipo,
  onClose,
  onSubmit,
  onSubmitScene
}) {
  const [texto, setTexto] = useState("");
  const tipoFinal = tipo || modalTipo || "shikai";
  const isBankai = tipoFinal === "bankai";
  function handleSubmeter(e) {
    e.preventDefault();
    if (!texto.trim()) {
      alert("Por favor, descreva a cena ou momento em que seu personagem despertou sua lâmina!");
      return;
    }
    const handler = onSubmit || onSubmitScene;
    if (handler) handler(texto.trim());
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `relative w-full max-w-2xl bg-bleach-panel border-2 rounded-2xl p-6 shadow-2xl text-left ${isBankai ? "border-yellow-500/80" : "border-bleach-orange/80"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-bleach-borderSoft pb-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-widest text-bleach-orange"
  }, isBankai ? "卍 RITUAL DA LIBERAÇÃO FINAL" : "始解 RITUAL DE DESPERTAR DA SHIKAI"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl text-white tracking-wider mt-0.5"
  }, isBankai ? "CENA DE DESPERTAR DA BANKAI" : "CENA DE DESPERTAR DA SHIKAI")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-bleach-muted hover:text-white font-bold"
  }, "\u2715")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmeter,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim leading-relaxed"
  }, "Descreva como foi o momento em que voc\xEA ouviu a voz do seu esp\xEDrito pela primeira vez ou como a l\xE2mina se manifestou na sua hist\xF3ria (ou cole sua cena de treino/arco):"), /*#__PURE__*/React.createElement("textarea", {
    rows: 6,
    value: texto,
    onChange: e => setTexto(e.target.value),
    placeholder: "Ex: Em meio \xE0 tempestade de Karakura, quando as l\xE2minas se cruzaram e o sil\xEAncio tomou conta da minha mente, escutei uma voz grave ecoando em meu mundo interior...",
    className: "w-full bg-black/80 border border-bleach-border focus:border-bleach-orange rounded-xl p-4 text-xs text-white placeholder-bleach-muted focus:outline-none leading-relaxed resize-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center pt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-muted font-mono"
  }, texto.length, " caracteres"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    className: "px-4 py-2 bg-bleach-panel2 border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-white"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-6 py-2 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:brightness-110 transition"
  }, "\u2728 Analisar Alma & Gerar 4 Caminhos com IA \u2794"))))));
}
const AwakeningSceneModal = CenaDespertarModal;
if (typeof window !== 'undefined') {
  window.CenaDespertarModal = CenaDespertarModal;
  window.AwakeningSceneModal = CenaDespertarModal;
}

// 3. 4 SPIRITUAL PATHS / 3 BANKAI EVOLUTIONS SELECTION MODAL (COM IA & ANIMAÇÃO CINEMATOGRÁFICA)
function Zanpakuto4PathsModal({
  open,
  caminhos = [],
  personagem,
  isBankai,
  loading,
  onClose,
  onEscolherCaminho
}) {
  if (!open) return null;
  const listaCaminhos = Array.isArray(caminhos) ? caminhos : [];
  const isBankaiFinal = isBankai || !!listaCaminhos[0]?.isBankaiEvolucao;
  const [caminhoAtivoIdx, setCaminhoAtivoIdx] = useState(0);
  const [ritualState, setRitualState] = useState(loading || listaCaminhos.length === 0 ? "charging" : "selection");
  const [caminhoSelecionado, setCaminhoSelecionado] = useState(listaCaminhos[0] || null);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargeStageText, setChargeStageText] = useState("Sintonizando Pressão Espiritual com o Mundo Interior...");
  const [showConfigApiKey, setShowConfigApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem("bleach_openai_key") || "");
  const [salvoKey, setSalvoKey] = useState(false);
  const chargeIntervalRef = useRef(null);
  useEffect(() => {
    if (listaCaminhos && listaCaminhos.length > 0) {
      setCaminhoSelecionado(listaCaminhos[caminhoAtivoIdx] || listaCaminhos[0]);
    }
  }, [listaCaminhos, caminhoAtivoIdx]);

  // Continuous charging power ritual while AI generates, or direct selection if already saved
  useEffect(() => {
    if (open) {
      if (!loading && listaCaminhos && listaCaminhos.length > 0) {
        setRitualState("selection");
        setChargeProgress(100);
        if (chargeIntervalRef.current) {
          clearInterval(chargeIntervalRef.current);
          chargeIntervalRef.current = null;
        }
        return;
      }
      setRitualState("charging");
      setChargeProgress(0);
      setChargeStageText("Sintonizando Pressão Espiritual com o Mundo Interior...");
      playReiatsuSound(isBankaiFinal ? 'bankai_charge' : 'shikai_charge');
      let p = 0;
      let stageCounter = 0;
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
      const dynamicStages = isBankaiFinal ? ["Sintonizando a Shikai com a profundidade da alma...", "⚡ TENSÃO DE REIATSU: A energia se eleva em chamas monumentais...", "💥 VIBRAÇÃO DO REISHI: Os rastros de aura rasgam o véu entre os mundos...", "👑 FORJANDO AS 3 EVOLUÇÕES TRANSCENDENTAIS DE BANKAI COM A IA...", "卍 A fenda da alma se abre em ressonância absoluta..."] : ["Sintonizando Pressão Espiritual com o Mundo Interior...", "⚡ TENSÃO DE REIATSU: A aura espiritual se eleva em chamas de energia...", "💥 VIBRAÇÃO DO AR & ONDAS DE CHOQUE: Os rastros de Reishi fluem pelo ambiente!", "🗡️ FORJANDO AS 4 MANIFESTAÇÕES AUTÊNTICAS DA SHIKAI COM A IA...", "✨ A fenda se abre: Revelando as manifestações únicas da alma..."];
      chargeIntervalRef.current = setInterval(() => {
        const isReady = !loading && listaCaminhos && listaCaminhos.length > 0;
        if (!isReady) {
          // Progress smoothly up to 92% and oscillate while AI is computing
          if (p < 92) {
            p += 2;
          } else {
            p = 90 + Math.sin(Date.now() / 200) * 3;
          }
          setChargeProgress(Math.floor(p));
          stageCounter++;
          const stageIdx = Math.min(Math.floor(stageCounter / 18), dynamicStages.length - 2);
          setChargeStageText(dynamicStages[stageIdx]);
        } else {
          // AI is done, rush to 100% and reveal
          p += 4;
          if (p < 100) {
            setChargeProgress(p);
            setChargeStageText(dynamicStages[dynamicStages.length - 1]);
          } else {
            setChargeProgress(100);
            clearInterval(chargeIntervalRef.current);
            chargeIntervalRef.current = null;
            playReiatsuSound('shatter');
            playReiatsuSound('crit');
            setTimeout(() => {
              setRitualState("selection");
              playReiatsuSound(isBankaiFinal ? 'bankai_reveal' : 'win');
            }, 300);
          }
        }
      }, 80);
    }
    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, [open, loading, listaCaminhos.length]);
  function salvarApiKey(e) {
    e.preventDefault();
    localStorage.setItem("bleach_openai_key", apiKeyInput.trim());
    setSalvoKey(true);
    setTimeout(() => setSalvoKey(false), 3000);
  }
  function confirmarEscolhaFinal(caminho) {
    setCaminhoSelecionado(caminho);
    setRitualState("revealed");
    playReiatsuSound(isBankaiFinal ? 'bankai_reveal' : 'win');
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
  }, ritualState === "charging" && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 pointer-events-none overflow-hidden z-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: isBankaiFinal ? "aura-flame-surge-bankai" : "aura-flame-surge"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-3 h-48 rounded-full bg-gradient-to-t from-transparent via-cyan-400 to-white blur-sm energy-trail-1 shadow-[0_0_25px_#4FB3E8]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-3.5 h-56 rounded-full bg-gradient-to-t from-transparent via-bleach-orange to-yellow-300 blur-sm energy-trail-2 shadow-[0_0_30px_#FF6A13]"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-4 h-60 rounded-full bg-gradient-to-t from-transparent via-yellow-400 to-purple-400 blur-sm energy-trail-3 shadow-[0_0_35px_#FFD700]"
  })), /*#__PURE__*/React.createElement("div", {
    className: `relative w-full max-w-5xl bg-bleach-panel border-2 rounded-2xl p-4 sm:p-6 shadow-2xl text-left transition-all z-10 ${isBankaiFinal ? "border-yellow-500/80 bankai-supreme-card" : "border-bleach-orange/80 reiatsu-glow"} my-auto`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bleach-borderSoft pb-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${isBankaiFinal ? "bg-amber-950 border-yellow-400 text-yellow-300" : "bg-orange-950 border-bleach-orange text-bleach-orange"}`
  }, isBankaiFinal ? "卍 ZGE V5.0 • TRANSCENDÊNCIA DE BANKAI" : "✨ ZGE V5.0 • GÊNESE DE SHIKAI"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-muted"
  }, "Alma: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, personagem?.nome || "Shinigami")), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] bg-green-950 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full"
  }, "\u2713 DNA Espiritual Analisado")), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-2xl sm:text-3xl text-white tracking-wider mt-1"
  }, isBankaiFinal ? "卍 3 EVOLUÇÕES DIRETAS DA SUA SHIKAI (BANKAI)" : "始解 4 MANIFESTAÇÕES ÚNICAS DA ALMA (SHIKAI)")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowConfigApiKey(!showConfigApiKey),
    className: "px-3 py-1.5 bg-black/60 border border-white/10 hover:border-yellow-400 text-yellow-300 rounded-lg text-xs font-mono transition",
    title: "Configurar Chave Google Gemini / ChatGPT"
  }, "\u2699\uFE0F Chave IA"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "px-3 py-1.5 bg-bleach-panel2 border border-bleach-border hover:border-white text-bleach-creamDim hover:text-white rounded-lg text-xs font-bold"
  }, "\u2715 Fechar"))), showConfigApiKey && /*#__PURE__*/React.createElement("form", {
    onSubmit: salvarApiKey,
    className: "p-3.5 bg-black/80 border border-yellow-500/40 rounded-xl mb-4 flex flex-wrap gap-2 items-center text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-300 font-bold"
  }, "Chave Gemini / ChatGPT:"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Cole sua chave aqui (Google Gemini ou OpenAI)",
    value: apiKeyInput,
    onChange: e => setApiKeyInput(e.target.value),
    className: "flex-1 min-w-[200px] bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded shadow"
  }, "Salvar Chave"), salvoKey && /*#__PURE__*/React.createElement("span", {
    className: "text-green-400 font-bold"
  }, "\u2713 Salvo!")), ritualState === "charging" && /*#__PURE__*/React.createElement("div", {
    className: "py-10 flex flex-col items-center justify-center space-y-6 text-center overflow-hidden relative"
  }, /*#__PURE__*/React.createElement("div", {
    className: `relative w-full max-w-xl p-8 rounded-2xl bg-black/90 border-2 ${isBankaiFinal ? "border-yellow-500/60" : "border-bleach-orange/60"} shadow-2xl flex flex-col items-center justify-center space-y-5 air-vibration-active`
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-28 h-28 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 rounded-full border-2 border-dashed border-bleach-orange spin-runes"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-2 rounded-full border border-dotted border-yellow-400 spin-runes-fast"
  }), /*#__PURE__*/React.createElement("span", {
    className: "font-title text-6xl kanji-pulse-glow text-white select-none"
  }, isBankaiFinal ? "卍" : "始")), /*#__PURE__*/React.createElement("div", {
    className: "w-full relative h-6 flex items-center justify-center overflow-hidden my-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent slash-horizontal-beam"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-24 h-4 bg-bleach-orange/80 blur-md slash-horizontal-beam"
  })), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 w-full"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl text-white tracking-widest"
  }, isBankaiFinal ? "卍 TRANSCENDENDO A SHIKAI PARA A BANKAI..." : "🗡️ FORJANDO MANIFESTAÇÕES DA ALMA..."), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-yellow-300 font-mono animate-pulse min-h-[32px] px-2 leading-relaxed"
  }, chargeStageText)), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md bg-black/80 h-3.5 rounded-full overflow-hidden border border-white/20 p-0.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full rounded-full transition-all duration-100 ${isBankaiFinal ? "bg-gradient-to-r from-yellow-500 via-amber-400 to-red-500 shadow-[0_0_15px_rgba(255,215,0,0.8)]" : "bg-gradient-to-r from-cyan-400 via-bleach-orange to-red-500 shadow-[0_0_15px_rgba(255,106,19,0.8)]"}`,
    style: {
      width: `${chargeProgress}%`
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center w-full max-w-md text-[11px] text-bleach-muted pt-1"
  }, /*#__PURE__*/React.createElement("span", null, "Resson\xE2ncia de Reiatsu: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 font-mono"
  }, chargeProgress, "%"))))), ritualState === "selection" && listaCaminhos.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 card-pop-reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: `grid gap-2 mb-4 ${isBankaiFinal ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`
  }, caminhos.map((c, idx) => {
    const isSelected = caminhoAtivoIdx === idx;
    const bankaiData = c.bankai || c;
    const shikaiData = c.shikai || {};
    return /*#__PURE__*/React.createElement("button", {
      key: idx,
      onClick: () => setCaminhoAtivoIdx(idx),
      className: `p-3.5 rounded-xl border text-left transition relative overflow-hidden ${isSelected ? isBankaiFinal ? "bg-gradient-to-r from-yellow-950/90 to-amber-950/90 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)] ring-1 ring-yellow-400" : "bg-gradient-to-r from-orange-950/90 to-black border-bleach-orange shadow-[0_0_20px_rgba(255,106,19,0.4)] ring-1 ring-bleach-orange" : "bg-bleach-panel2/90 border-bleach-borderSoft opacity-70 hover:opacity-100"}`
    }, /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] font-extrabold uppercase block tracking-wider ${isBankaiFinal ? idx === 0 ? "text-amber-400" : idx === 1 ? "text-cyan-400" : "text-purple-400" : "text-bleach-orange"}`
    }, isBankaiFinal ? `卍 ${bankaiData.tipoEvolucao || `Opção ${idx + 1}`}` : `Caminho ${idx + 1}`), /*#__PURE__*/React.createElement("h4", {
      className: "font-title text-lg text-white truncate mt-0.5"
    }, isBankaiFinal ? bankaiData.nome : shikaiData.nome), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-bleach-creamDim truncate"
    }, isBankaiFinal ? bankaiData.subtitulo || bankaiData.traducao : c.tipoCaminho.replace(/Opção \d+ — /, '')));
  })), isBankaiFinal ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-8 bg-black/80 border-2 border-yellow-500/60 rounded-xl p-5 space-y-4 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-start justify-between gap-2 border-b border-yellow-500/30 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-yellow-950 border border-yellow-400 text-yellow-300"
  }, caminhoSelecionado.bankai?.tipoEvolucao || caminhoSelecionado.tipoEvolucao || "Evolução de Bankai"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-3xl text-yellow-300 tracking-wider flex items-center gap-2 mt-1"
  }, /*#__PURE__*/React.createElement("span", null, caminhoSelecionado.bankai?.nome || caminhoSelecionado.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-base font-cinzel text-yellow-400 font-normal"
  }, caminhoSelecionado.bankai?.kanji || caminhoSelecionado.kanji)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-yellow-200 italic mt-0.5"
  }, "\"", caminhoSelecionado.bankai?.comando || caminhoSelecionado.comando, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-yellow-400/90 font-mono block"
  }, "Tradu\xE7\xE3o: ", /*#__PURE__*/React.createElement("strong", null, caminhoSelecionado.bankai?.traducao || caminhoSelecionado.traducao)), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] bg-green-950 border border-green-500 text-green-300 px-2 py-0.5 rounded-full inline-block mt-1"
  }, "\u2726 100% Exclusiva no RPG"))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-gradient-to-r from-amber-950/60 to-black rounded-xl border-2 border-yellow-500/70 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 block text-xs uppercase tracking-wider flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCA5"), " PONTO DE RUPTURA (LIMITE DA SHIKAI SUPERADO):"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-cream leading-relaxed font-sans"
  }, caminhoSelecionado.bankai?.pontoRuptura || caminhoSelecionado.pontoRuptura)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 block text-xs"
  }, "\uD83D\uDC51 Dom\xEDnio Territorial & Forma:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim text-[11px] leading-relaxed"
  }, caminhoSelecionado.bankai?.formaMonumental || caminhoSelecionado.formaMonumental)), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-cyan-300 block text-xs"
  }, "\u26A1 Poder Transcendental:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim text-[11px] leading-relaxed"
  }, caminhoSelecionado.bankai?.poder || caminhoSelecionado.poder))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/60 rounded-xl border border-white/10 text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-x-4 text-[11px]"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-red-300"
  }, /*#__PURE__*/React.createElement("strong", null, "\u26A0\uFE0F Limita\xE7\xF5es & Desgaste:"), " ", caminhoSelecionado.bankai?.limitacoes || caminhoSelecionado.limitacoes)), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted border-t border-white/5 pt-1.5"
  }, /*#__PURE__*/React.createElement("strong", null, "Significado Filos\xF3fico:"), " ", /*#__PURE__*/React.createElement("em", {
    className: "text-yellow-200"
  }, "\"", caminhoSelecionado.bankai?.significadoEspiritual || caminhoSelecionado.significadoEspiritual, "\""))), (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices) && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/50 rounded-xl border border-white/10 space-y-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-bleach-muted block"
  }, "\xCDndice de Pot\xEAncia & Balan\xE7o Espiritual da Bankai (1 a 10)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]"
  }, [{
    label: "Potência",
    val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).potencia,
    color: C.red
  }, {
    label: "Abrangência",
    val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).abrangencia,
    color: C.blue
  }, {
    label: "Complexidade",
    val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).complexidade,
    color: C.purple
  }, {
    label: "Versatilidade",
    val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).versatilidade,
    color: C.green
  }, {
    label: "Custo",
    val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).custo,
    color: C.yellow
  }].map(stat => /*#__PURE__*/React.createElement("div", {
    key: stat.label,
    className: "p-1.5 bg-bleach-panel2 rounded border border-white/5 text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-muted block"
  }, stat.label), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-xs",
    style: {
      color: stat.color
    }
  }, stat.val, "/10"), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-black/60 h-1 rounded-full overflow-hidden mt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full",
    style: {
      width: `${stat.val * 10}%`,
      backgroundColor: stat.color
    }
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-4 bg-gradient-to-b from-yellow-950/40 via-bleach-panel2 to-black border-2 border-yellow-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-b border-white/10 pb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase text-cyan-300 block"
  }, "\u26A1 SHIKAI DE ORIGEM"), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl text-white"
  }, caminhoSelecionado.shikai?.nome || personagem.zanpakuto?.shikaiAtiva?.nome || "Zanpakutō"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim italic"
  }, "\"", caminhoSelecionado.shikai?.comando || personagem.zanpakuto?.shikaiAtiva?.comando, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/60 rounded-lg border border-white/5 text-xs space-y-1.5 text-bleach-creamDim"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-white block text-[11px]"
  }, "Evolu\xE7\xE3o de Alma:"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] leading-relaxed"
  }, "Esta Bankai foi forjada como a transcend\xEAncia aut\xEAntica da sua Shikai, manifestando a maturidade definitiva da sua Reiatsu.")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/60 rounded-lg border border-white/5 text-xs space-y-1 text-bleach-muted"
  }, /*#__PURE__*/React.createElement("div", null, "Dominante: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, caminhoSelecionado.dnaEspiritual?.dominante)), /*#__PURE__*/React.createElement("div", null, "Virtude: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-green-300"
  }, caminhoSelecionado.dnaEspiritual?.virtudePrincipal)), /*#__PURE__*/React.createElement("div", null, "Defeito: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-purple-300"
  }, caminhoSelecionado.dnaEspiritual?.defeitoPrincipal)))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-white/10 space-y-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => confirmarEscolhaFinal(caminhoSelecionado),
    className: "w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-2xl hover:brightness-110 transition"
  }, "\u534D Despertar & Selar Esta Bankai na Alma")))) :
  /*#__PURE__*/
  /* SHIKAI 4-PATH DISPLAY */
  React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-12 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-7 bg-black/60 border border-bleach-border rounded-xl p-4 sm:p-5 space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase text-bleach-orange"
  }, caminhoSelecionado.tipoCaminho), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl sm:text-3xl text-white tracking-wider flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, caminhoSelecionado.shikai.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-sm font-cinzel text-bleach-orange font-normal"
  }, caminhoSelecionado.shikai.kanji), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-creamDim font-sans"
  }, "(", caminhoSelecionado.shikai.traducao, ")")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim italic mt-0.5"
  }, "\"", caminhoSelecionado.shikai.comando, "\"")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-950/80 border border-green-500 text-green-300 tracking-wider"
  }, "\u2726 ", caminhoSelecionado.indiceExclusividade || 100, "% Exclusiva no RPG"), /*#__PURE__*/React.createElement(Badge, {
    color: C.blue
  }, caminhoSelecionado.shikai.elemento))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2/80 rounded-lg border border-white/5 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange block text-[11px]"
  }, "\u2694\uFE0F Manifesta\xE7\xE3o da Arma:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim text-[11px] leading-relaxed"
  }, caminhoSelecionado.shikai.aparencia)), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2/80 rounded-lg border border-white/5 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-cyan-400 block text-[11px]"
  }, "\uD83E\uDDE0 Rela\xE7\xE3o com a Alma:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim text-[11px] leading-relaxed"
  }, caminhoSelecionado.shikai.relacaoPersonalidade))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-black/80 rounded-lg border border-bleach-orange/30 space-y-2"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange block text-xs uppercase tracking-wider"
  }, "\u26A1 Poder & Mec\xE2nica Espiritual:"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-cream leading-relaxed font-sans"
  }, caminhoSelecionado.shikai.poder), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-bleach-muted pt-1 border-t border-white/5"
  }, /*#__PURE__*/React.createElement("span", null, "Custo: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, caminhoSelecionado.shikai.custoReiatsu)), /*#__PURE__*/React.createElement("span", null, "Limita\xE7\xF5es: ", /*#__PURE__*/React.createElement("strong", {
    className: "text-amber-300"
  }, caminhoSelecionado.shikai.limitacoes)))), caminhoSelecionado.shikai.indices && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/50 rounded-lg border border-white/10 space-y-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-wider text-bleach-muted block"
  }, "\xCDndice de Complexidade & Balan\xE7o Espiritual (1 a 10)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]"
  }, [{
    label: "Potência",
    val: caminhoSelecionado.shikai.indices.potencia,
    color: C.red
  }, {
    label: "Abrangência",
    val: caminhoSelecionado.shikai.indices.abrangencia,
    color: C.blue
  }, {
    label: "Complexidade",
    val: caminhoSelecionado.shikai.indices.complexidade,
    color: C.purple
  }, {
    label: "Versatilidade",
    val: caminhoSelecionado.shikai.indices.versatilidade,
    color: C.green
  }, {
    label: "Custo",
    val: caminhoSelecionado.shikai.indices.custo,
    color: C.yellow
  }].map(stat => /*#__PURE__*/React.createElement("div", {
    key: stat.label,
    className: "p-1.5 bg-bleach-panel2 rounded border border-white/5 text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-muted block"
  }, stat.label), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-xs",
    style: {
      color: stat.color
    }
  }, stat.val, "/10"), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-black/60 h-1 rounded-full overflow-hidden mt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full rounded-full",
    style: {
      width: `${stat.val * 10}%`,
      backgroundColor: stat.color
    }
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-5 bg-gradient-to-b from-yellow-950/30 via-bleach-panel2 to-black border-2 border-yellow-500/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-yellow-500/30 pb-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-500"
  }, "BANKAI CORRESPONDENTE"), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl text-yellow-300 tracking-wider mt-1"
  }, caminhoSelecionado.bankai.nome)), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-yellow-400/80 font-mono"
  }, caminhoSelecionado.bankai.tipoEvolucao)), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/60 rounded-lg border border-yellow-500/20 text-xs space-y-1.5"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 block text-[11px]"
  }, "\uD83D\uDC51 Dom\xEDnio & Evolu\xE7\xE3o:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim text-[11px] leading-relaxed"
  }, caminhoSelecionado.bankai.formaMonumental)), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/60 rounded-lg border border-yellow-500/20 text-xs space-y-1.5"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 block text-[11px]"
  }, "\u26A1 Poder Transcendental da Bankai:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-cream text-[11px] leading-relaxed"
  }, caminhoSelecionado.bankai.poder)), /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 bg-black/40 rounded-lg border border-white/5 text-[11px] text-bleach-muted"
  }, /*#__PURE__*/React.createElement("span", null, "Significado Espiritual: ", /*#__PURE__*/React.createElement("em", {
    className: "text-yellow-200"
  }, "\"", caminhoSelecionado.bankai.significadoEspiritual, "\"")))), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-white/10 space-y-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => confirmarEscolhaFinal(caminhoSelecionado),
    className: "w-full py-3 bg-gradient-to-r from-bleach-orange via-bleach-orangeDeep to-red-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
  }, "\uD83D\uDDE1\uFE0F Despertar & Selar Este Caminho Espiritual"))))), ritualState === "revealed" && /*#__PURE__*/React.createElement("div", {
    className: "py-8 text-center space-y-6 card-pop-reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl animate-pulse"
  }, "\u2728"), /*#__PURE__*/React.createElement("div", {
    className: "max-w-lg mx-auto p-6 rounded-2xl bg-black/90 border-2 border-bleach-orange shadow-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${isBankaiFinal ? "bg-amber-950 border-yellow-400 text-yellow-300" : "bg-orange-950 border-bleach-orange text-bleach-orange"}`
  }, isBankaiFinal ? "卍 TRANSCENDÊNCIA DE BANKAI CONCLUÍDA" : "始解 VINCULAÇÃO DE SHIKAI CONFIRMADA"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-3xl text-white tracking-wider"
  }, isBankaiFinal ? caminhoSelecionado.bankai?.nome || caminhoSelecionado.nome : caminhoSelecionado.shikai.nome), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-orange italic"
  }, "\"", isBankaiFinal ? caminhoSelecionado.bankai?.comando || caminhoSelecionado.comando : caminhoSelecionado.shikai.comando, "\""), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim leading-relaxed"
  }, "Esta manifesta\xE7\xE3o espiritual foi vinculada permanentemente ao personagem ", /*#__PURE__*/React.createElement("strong", null, personagem.nome), ". Sua assinatura espiritual foi gravada com exclusividade e nenhuma outra alma poder\xE1 possuir a mesma l\xE2mina."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onEscolherCaminho(caminhoSelecionado),
    className: "w-full py-3.5 bg-gradient-to-r from-bleach-orange to-yellow-500 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
  }, "\u2713 Entrar na Sociedade das Almas com sua Zanpakut\u014D")))));
}

// =========================================================================
// VIEWS PART 1: TOPBAR, SUBTLE ADMIN, LIVE CHAT, LOGIN, RANKINGS, KIDOS & ARENA
// =========================================================================

// TOP NAVIGATION BAR (WITH SUBTLE ADMIN SEAL, CHAT & PATCH NOTES)
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
    className: "sticky top-0 z-40 bg-bleach-panel/95 backdrop-blur-md border-b border-bleach-borderSoft shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 cursor-pointer",
    onClick: () => setView("sistemas")
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-lg bg-gradient-to-br from-bleach-orange to-bleach-orangeDeep flex items-center justify-center font-title text-xl text-black font-extrabold shadow-[0_0_15px_#FF6A13]"
  }, "\u6B7B"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "font-title text-xl sm:text-2xl tracking-wider text-bleach-cream flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "BLEACH RPG"), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-sans font-normal px-2 py-0.5 rounded bg-black/60 border border-bleach-border text-bleach-orange uppercase tracking-widest hidden sm:inline"
  }, "Sociedade das Almas")))), /*#__PURE__*/React.createElement("nav", {
    className: "hidden md:flex items-center gap-1"
  }, [{
    id: "sistemas",
    label: "Sistemas & Regras",
    icon: "📜"
  }, {
    id: "ficha",
    label: session?.role === "jogador" ? "Minha Ficha" : "Ficha de Jogador",
    icon: "👤"
  }, {
    id: "chat",
    label: "Chat dos Shinigamis",
    icon: "💬"
  }, {
    id: "rankings",
    label: "Rankings",
    icon: "🏆"
  }, {
    id: "kidos",
    label: "Grimório de Kidō",
    icon: "📕"
  }, {
    id: "arena",
    label: "Arena de Duelos",
    icon: "⚔️"
  }, {
    id: "patchnotes",
    label: "Patch Notes",
    icon: "📰"
  }, ...(isAdmin ? [{
    id: "admin",
    label: "Painel ADM",
    icon: "👑"
  }] : [])].map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => setView(tab.id),
    className: `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${view === tab.id ? "bg-bleach-orange text-black font-extrabold shadow-[0_0_12px_rgba(255,106,19,0.5)]" : "text-bleach-creamDim hover:text-white hover:bg-white/5"}`
  }, /*#__PURE__*/React.createElement("span", null, tab.icon), /*#__PURE__*/React.createElement("span", null, tab.label)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 sm:gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    title: cloudStatus === "connected" ? "Sincronizado com Nuvem Firebase em Tempo Real" : "Modo Local",
    className: "flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-black/60 border border-white/10"
  }, /*#__PURE__*/React.createElement("span", {
    className: `w-2 h-2 rounded-full ${cloudStatus === "connected" ? "bg-green-400 animate-pulse" : cloudStatus === "syncing" ? "bg-yellow-400 animate-spin" : "bg-bleach-muted"}`
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-muted hidden sm:inline"
  }, cloudStatus === "connected" ? "Nuvem ON" : "Local")), session ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-right hidden sm:block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted block uppercase font-mono"
  }, "Logado como"), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-bleach-cream truncate max-w-[120px] block"
  }, nome)), /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "px-2.5 py-1 bg-red-950/60 border border-red-500/50 hover:bg-red-800 text-red-200 text-xs font-bold rounded-lg transition",
    title: "Sair da Conta"
  }, "Sair")) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("ficha"),
    className: "px-3.5 py-1.5 bg-bleach-orange text-black text-xs font-extrabold rounded-lg shadow hover:bg-orange-400 uppercase tracking-wider"
  }, "Entrar")), /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAdminLogin,
    className: "w-7 h-7 flex items-center justify-center rounded-full text-bleach-border hover:text-bleach-orange/60 hover:bg-white/5 transition text-xs select-none",
    title: "Selo Espiritual do Seireitei"
  }, "\u2756"))), /*#__PURE__*/React.createElement("div", {
    className: "md:hidden flex items-center justify-around border-t border-bleach-borderSoft/60 px-2 py-1.5 overflow-x-auto bg-black/40"
  }, [{
    id: "sistemas",
    label: "Regras",
    icon: "📜"
  }, {
    id: "ficha",
    label: "Ficha",
    icon: "👤"
  }, {
    id: "chat",
    label: "Chat",
    icon: "💬"
  }, {
    id: "rankings",
    label: "Rankings",
    icon: "🏆"
  }, {
    id: "kidos",
    label: "Kidō",
    icon: "📕"
  }, {
    id: "arena",
    label: "Arena",
    icon: "⚔️"
  }, {
    id: "patchnotes",
    label: "Patch",
    icon: "📰"
  }, ...(isAdmin ? [{
    id: "admin",
    label: "ADM",
    icon: "👑"
  }] : [])].map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => setView(tab.id),
    className: `px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${view === tab.id ? "text-bleach-orange font-bold border-b-2 border-bleach-orange" : "text-bleach-muted"}`
  }, tab.icon, " ", tab.label))));
}

// CHAIN DIVIDER
function ChainDivider() {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center my-6 gap-2 text-bleach-border select-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px bg-gradient-to-r from-transparent via-bleach-border to-transparent"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-bleach-orange font-cinzel tracking-widest"
  }, "\u2756 \u2756 \u2756"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 h-px bg-gradient-to-r from-transparent via-bleach-border to-transparent"
  }));
}

// SECTION CONTAINER
function Section({
  title,
  subtitle,
  children,
  right,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `bg-bleach-panel border border-bleach-border rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden ${className}`
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

// LIVE CHAT ROOM FOR SHINIGAMIS
function ChatView({
  db,
  saveDb,
  session,
  myChar
}) {
  const [mensagem, setMensagem] = useState("");
  const chatBottomRef = useRef(null);
  const mensagens = db?.mensagensChat || [{
    id: "msg-welcome-1",
    autorNome: "Comandante Supremo",
    charFoto: "assets/ichigo-moon.png",
    esquadrao: "1º Esquadrão",
    texto: "Bem-vindos ao canal de comunicação direta da Sociedade das Almas. Mantenham o decoro e compartilhem suas jornadas!",
    timestamp: "10:00",
    data: "Hoje"
  }];
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [mensagens.length]);
  function enviarMensagem(e) {
    e.preventDefault();
    if (!mensagem.trim()) return;
    if (!session) {
      alert("Você precisa estar logado para enviar mensagens no chat.");
      return;
    }
    const autorNome = myChar?.nome || (session.role === "super_admin" ? "ADM Máximo" : session.nome || "Shinigami");
    const charFoto = myChar?.foto || "assets/ichigo-orange.png";
    const esquadrao = myChar?.esquadrao || "Seireitei";
    const novaMsg = {
      id: uid(),
      autorNome,
      charId: myChar?.id || session.charId || "adm",
      charFoto,
      esquadrao,
      texto: mensagem.trim(),
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      data: nowStr()
    };
    const novasMensagens = [...mensagens, novaMsg].slice(-100); // manter últimas 100 mensagens
    saveDb({
      ...db,
      mensagensChat: novasMensagens
    });
    setMensagem("");
    playReiatsuSound('roll');
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\uD83D\uDCAC Comunica\xE7\xE3o Espiritual dos Shinigamis",
    subtitle: "Canal de conviv\xEAncia, an\xFAncios e intera\xE7\xE3o entre todos os membros da Sociedade das Almas",
    className: "border-2 border-bleach-orange/40 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col h-[520px] bg-black/70 border border-bleach-border rounded-2xl overflow-hidden shadow-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2/80 border-b border-bleach-border flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-bleach-cream uppercase tracking-wider"
  }, "Canal Geral de Karakura & Seireitei")), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-muted font-mono"
  }, mensagens.length, " mensagens gravadas")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 p-4 overflow-y-auto space-y-3"
  }, mensagens.map(msg => {
    const isMe = session && (msg.charId === myChar?.id || session.role === "super_admin" && msg.autorNome.includes("ADM"));
    return /*#__PURE__*/React.createElement("div", {
      key: msg.id,
      className: `flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`
    }, /*#__PURE__*/React.createElement("img", {
      src: msg.charFoto || 'assets/ichigo-orange.png',
      className: "w-9 h-9 rounded-xl object-cover border border-bleach-border shrink-0 mt-0.5"
    }), /*#__PURE__*/React.createElement("div", {
      className: `max-w-[75%] rounded-2xl p-3 text-xs space-y-1 ${isMe ? "bg-orange-950/70 border border-bleach-orange/60 text-white rounded-tr-none" : "bg-bleach-panel2 border border-white/10 text-bleach-cream rounded-tl-none"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-3 text-[10px]"
    }, /*#__PURE__*/React.createElement("strong", {
      className: isMe ? "text-bleach-orange" : "text-cyan-300"
    }, msg.autorNome), /*#__PURE__*/React.createElement("span", {
      className: "text-bleach-muted font-mono"
    }, msg.timestamp)), /*#__PURE__*/React.createElement("p", {
      className: "leading-relaxed whitespace-pre-wrap break-words"
    }, msg.texto), msg.esquadrao && /*#__PURE__*/React.createElement("span", {
      className: "text-[9px] text-bleach-muted block pt-0.5 border-t border-white/5 uppercase font-mono"
    }, msg.esquadrao)));
  }), /*#__PURE__*/React.createElement("div", {
    ref: chatBottomRef
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: enviarMensagem,
    className: "p-3 bg-bleach-panel2 border-t border-bleach-border flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: session ? "Escreva sua mensagem para todos os Shinigamis..." : "Faça login na sua ficha para interagir no chat...",
    disabled: !session,
    value: mensagem,
    onChange: e => setMensagem(e.target.value),
    className: "flex-1 bg-black/80 border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-2.5 text-xs text-white placeholder-bleach-muted outline-none disabled:opacity-50"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: !session || !mensagem.trim(),
    className: "px-5 py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase rounded-xl shadow hover:brightness-110 disabled:opacity-40 transition"
  }, "Enviar \u2794")))));
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
    const cloudUrl = activeCloudUrl || db.firebaseUrl || localStorage.getItem("bleach_firebase_url");
    if (cloudUrl) {
      try {
        const cleanUrl = cloudUrl.endsWith('/') ? cloudUrl.slice(0, -1) : cloudUrl;
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
            try {
              localStorage.setItem("bleachDB", JSON.stringify(freshData));
            } catch (e) {}
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
      setErro("Código de acesso não encontrado. Verifique se digitou corretamente.");
      return;
    }
    let p = null;
    if (termo) {
      p = matchingChars.find(c => {
        const cPhone = (c.whatsapp || "").replace(/\D/g, "");
        const cName = (c.nome || "").toLowerCase();
        if (digitsOnly.length >= 4 && (cPhone.includes(digitsOnly) || digitsOnly.includes(cPhone.slice(-8)))) return true;
        if (cName.includes(termo) || termo.includes(cName)) return true;
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
        setErro("Existe mais de um personagem com esse código. Preencha também seu Nome ou WhatsApp.");
        return;
      }
      p = matchingChars[0];
    }
    setCarregando(false);
    playReiatsuSound('win');
    onLogin(p);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-md mx-auto my-8"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Entrar na Minha Ficha",
    subtitle: "Digite suas credenciais registradas pela Administra\xE7\xE3o",
    className: "border-2 border-bleach-orange/60 shadow-2xl reiatsu-glow"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: entrarJogador,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-bleach-cream mb-1 uppercase tracking-wider"
  }, "C\xF3digo de Acesso (Senha da Ficha) *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: REN-8921",
    value: codigo,
    onChange: e => setCodigo(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-bleach-muted focus:outline-none"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-bleach-cream mb-1 uppercase tracking-wider"
  }, "Nome do Personagem ou WhatsApp (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Kurosaki Ren ou 11988887777",
    value: identificador,
    onChange: e => setIdentificador(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-3 text-sm text-white placeholder-bleach-muted focus:outline-none"
  })), erro && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-950/80 border border-red-500 rounded-xl text-red-200 text-xs font-semibold"
  }, erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: carregando,
    className: "w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 disabled:opacity-50 transition"
  }, carregando ? "Autenticando..." : "⚔️ Acessar Minha Ficha"))));
}

// ADMIN LOGIN SCREEN & MODAL (CLEAN & SUBTLE)
function AdminLoginScreen({
  db,
  onLoginAdmin
}) {
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
      onLoginAdmin("super_admin", {
        nome: db.superAdminNome || "ADM Máximo (Comandante Supremo)"
      });
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
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-md mx-auto my-8"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Painel de Acesso da Administra\xE7\xE3o",
    subtitle: "\xC1rea restrita para ADM M\xE1ximo e Avaliadores autorizados",
    className: "border-2 border-yellow-500/60 shadow-2xl"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: entrar,
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-yellow-400 mb-1 uppercase"
  }, "Usu\xE1rio de Acesso"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Digite seu usu\xE1rio...",
    value: usuario,
    onChange: e => setUsuario(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-yellow-400 mb-1 uppercase"
  }, "Senha de Acesso"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: senha,
    onChange: e => setSenha(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
  })), erro && /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 bg-red-950/80 border border-red-500 rounded text-red-200 text-xs"
  }, erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-xl shadow"
  }, "Entrar no Painel Administrativo"))));
}
function AdminLoginModal({
  db,
  onClose,
  onSuccess
}) {
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
      onSuccess("super_admin", {
        nome: db.superAdminNome || "ADM Máximo (Comandante Supremo)"
      });
      return;
    }
    const sub = (db.subAdms || []).find(a => a.usuario.toLowerCase() === u && a.senha === s);
    if (sub) {
      playReiatsuSound('win');
      onSuccess("sub_admin", sub);
      return;
    }
    setErro("Credenciais incorretas.");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-yellow-500/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4 border-b border-bleach-borderSoft pb-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-xl text-yellow-400"
  }, "ACESSO DO SEIREITEI"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "text-bleach-muted hover:text-white font-bold"
  }, "\u2715")), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "space-y-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim mb-1 font-bold"
  }, "Usu\xE1rio"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Usu\xE1rio...",
    value: usuario,
    onChange: e => setUsuario(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim mb-1 font-bold"
  }, "Senha"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: senha,
    onChange: e => setSenha(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
  })), erro && /*#__PURE__*/React.createElement("div", {
    className: "text-red-400 font-bold"
  }, erro), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded shadow"
  }, "Autenticar"))));
}

// RANKINGS VIEW
function RankingsView({
  rankFisico,
  rankPressao,
  myCharId
}) {
  const [tab, setTab] = useState("fisico");
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Quadro Geral de Honra & Classifica\xE7\xE3o",
    subtitle: "Rankings oficiais calculados a partir dos atributos puros dos Shinigamis"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-6 border-b border-bleach-borderSoft pb-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab("fisico"),
    className: `px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${tab === "fisico" ? "bg-bleach-orange text-black font-extrabold shadow" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, "\u2694\uFE0F Ranking F\xEDsico Geral (For\xE7a, Vel, Res)"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab("pressao"),
    className: `px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${tab === "pressao" ? "bg-bleach-blue text-black font-extrabold shadow" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, "\uD83C\uDF00 Ranking de Press\xE3o Espiritual (Reiatsu)")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, (tab === "fisico" ? rankFisico : rankPressao).map((p, idx) => {
    const isMe = p.id === myCharId;
    const pos = idx + 1;
    const isPodium = pos <= 3;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: `p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${isMe ? "bg-orange-950/40 border-bleach-orange shadow-lg" : isPodium ? "bg-bleach-panel2 border-white/20" : "bg-bleach-panel2/60 border-bleach-borderSoft"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: `w-8 h-8 rounded-lg flex items-center justify-center font-title text-base font-extrabold ${pos === 1 ? "bg-yellow-500 text-black shadow-[0_0_10px_#E0B34C]" : pos === 2 ? "bg-slate-300 text-black" : pos === 3 ? "bg-amber-700 text-white" : "bg-black text-bleach-muted"}`
    }, pos === 1 ? "1º" : pos === 2 ? "2º" : pos === 3 ? "3º" : `#${pos}`), /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 rounded-lg overflow-hidden border border-bleach-border bg-black"
    }, /*#__PURE__*/React.createElement("img", {
      src: p.foto || 'assets/ichigo-orange.png',
      alt: p.nome,
      className: "w-full h-full object-cover"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-white text-sm flex items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", null, p.nome), isMe && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] bg-bleach-orange text-black px-1.5 py-0.2 rounded font-bold"
    }, "VOC\xCA")), tab === "fisico" && /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-bleach-muted font-mono flex gap-2"
    }, /*#__PURE__*/React.createElement("span", null, "FOR: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-red-400"
    }, p.forca)), /*#__PURE__*/React.createElement("span", null, "VEL: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-green-400"
    }, p.vel)), /*#__PURE__*/React.createElement("span", null, "RES: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-purple-400"
    }, p.res))))), /*#__PURE__*/React.createElement("div", {
      className: "text-right"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] text-bleach-muted block uppercase"
    }, tab === "fisico" ? "Média Fís." : "Reiatsu"), /*#__PURE__*/React.createElement("span", {
      className: "font-mono text-lg font-black text-bleach-orange"
    }, p.score)));
  }))));
}

// RESTORED FULL INTERACTIVE KIDŌS CATALOG & REIATSU SWORD METER
function KidosView({
  personagem,
  isAdmin
}) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  const pressaoBase = Number(personagem?.atributos?.pressao || 30);
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
  }, "Grim\xF3rio Completo da Sociedade das Almas \u2022 Had\u014D, Bakud\u014D & Kaid\u014D"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow"
  }, "COMP\xCANDIO SUPREMO DE KID\u014CS"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Explore o comp\xEAndio oficial de ", /*#__PURE__*/React.createElement("strong", null, "Had\u014D (Destrui\xE7\xE3o)"), ", ", /*#__PURE__*/React.createElement("strong", null, "Bakud\u014D (Aprisionamento & Defesa)"), " e ", /*#__PURE__*/React.createElement("strong", null, "Kaid\u014D (Cura & Suporte)"), ". Gerencie a energia espiritual liberada na sua l\xE2mina atrav\xE9s do medidor de Reiatsu interativo abaixo!"))), /*#__PURE__*/React.createElement(Section, {
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
  }, /*#__PURE__*/React.createElement("div", {
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
  }, c.hora)))))))), /*#__PURE__*/React.createElement(Section, {
    title: "Grim\xF3rio de Feiti\xE7os de Seireitei",
    subtitle: "Filtre e conjure qualquer magia do cat\xE1logo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-3 mb-6"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "\uD83D\uDD0D Buscar feiti\xE7o por nome, n\xFAmero, encantamento ou efeito...",
    value: busca,
    onChange: e => setBusca(e.target.value),
    className: "flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-bleach-orange"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 overflow-x-auto pb-1 sm:pb-0"
  }, ["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat,
    onClick: () => setCategoriaAtiva(cat),
    className: `px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${categoriaAtiva === cat ? "bg-bleach-orange text-black font-extrabold" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim"}`
  }, cat)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, kidosFiltrados.map(k => {
    const isHado = k.cat === "Hadō";
    const isBakudo = k.cat === "Bakudō";
    return /*#__PURE__*/React.createElement("div", {
      key: k.id,
      className: `bg-bleach-panel2 border rounded-xl p-4 flex flex-col justify-between transition-all duration-300 hover:scale-[1.01] ${isHado ? "border-red-500/40 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]" : isBakudo ? "border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-3 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-between items-start gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: `px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${isHado ? "bg-red-950 text-red-300 border-red-500" : isBakudo ? "bg-blue-950 text-cyan-300 border-cyan-500" : "bg-emerald-950 text-emerald-300 border-emerald-500"}`
    }, k.cat, " #", k.numero), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] font-mono text-bleach-muted"
    }, "Custo: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-bleach-orange"
    }, k.custoReiatsu))), /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-white text-base leading-snug"
    }, k.nome), k.incant && k.incant !== "—" && /*#__PURE__*/React.createElement("div", {
      className: "p-2.5 bg-black/60 rounded-lg border border-white/5 text-[11px] text-cyan-200/80 italic leading-relaxed"
    }, "\"", k.incant, "\""), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-bleach-creamDim leading-relaxed"
    }, k.desc)), /*#__PURE__*/React.createElement("button", {
      onClick: () => conjurarKido(k),
      disabled: restantes <= 0,
      className: `w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed ${isHado ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110" : isBakudo ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110" : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"}`
    }, "\u26A1 Conjurar em Cena"));
  }))));
}

// ARENA VIEW (WITH TURN LOG TIMELINE & DUEL RESET)
function ArenaView({
  db,
  saveDb,
  session,
  myChar
}) {
  const [dueloAtivoId, setDueloAtivoId] = useState(db.combatesArena?.[0]?.id || "arena-1");
  const [acaoP1, setAcaoP1] = useState("");
  const [acaoP2, setAcaoP2] = useState("");
  const [vereditoJuiz, setVereditoJuiz] = useState("");
  const [dadoRolado, setDadoRolado] = useState(null);
  const duelo = (db.combatesArena || []).find(d => d.id === dueloAtivoId) || db.combatesArena?.[0] || {
    id: "arena-1",
    p1Id: db.personagens?.[0]?.id,
    p2Id: db.personagens?.[1]?.id,
    turnos: [],
    estadoP1: "Inteiro",
    estadoP2: "Inteiro"
  };
  const p1 = (db.personagens || []).find(p => p.id === duelo.p1Id) || db.personagens?.[0];
  const p2 = (db.personagens || []).find(p => p.id === duelo.p2Id) || db.personagens?.[1];
  function rolarDadoDuelo() {
    const res = Math.floor(Math.random() * 6) + 1;
    const cat = res <= 2 ? "Falha (1–2)" : res <= 4 ? "Sucesso Parcial (3–4)" : "Sucesso Total (5–6)";
    setDadoRolado({
      res,
      cat
    });
    playReiatsuSound('roll');
  }
  function registrarTurno(e) {
    e.preventDefault();
    if (!vereditoJuiz.trim() && !acaoP1.trim()) return;
    const numTurno = (duelo.turnos || []).length + 1;
    const novoTurno = {
      id: uid(),
      numero: numTurno,
      autor: session?.nome || "Juiz da Arena",
      acaoP1: acaoP1.trim() || "—",
      acaoP2: acaoP2.trim() || "—",
      veredito: vereditoJuiz.trim() || "Turno concluído e avaliado pelo narrador.",
      dado: dadoRolado ? `1d6: ${dadoRolado.res} (${dadoRolado.cat})` : null,
      data: nowStr()
    };
    const novosDuelos = (db.combatesArena || []).map(d => {
      if (d.id === duelo.id) {
        return {
          ...d,
          turnos: [novoTurno, ...(d.turnos || [])]
        };
      }
      return d;
    });
    saveDb({
      ...db,
      combatesArena: novosDuelos
    });
    setAcaoP1("");
    setAcaoP2("");
    setVereditoJuiz("");
    setDadoRolado(null);
    playReiatsuSound('win');
  }
  function resetarDuelo() {
    const confirma = confirm("⚠️ Deseja reiniciar este combate e limpar o registro de turnos?");
    if (!confirma) return;
    const novosDuelos = (db.combatesArena || []).map(d => {
      if (d.id === duelo.id) {
        return {
          ...d,
          turnos: [],
          estadoP1: "Inteiro",
          estadoP2: "Inteiro",
          finalizado: false
        };
      }
      return d;
    });
    saveDb({
      ...db,
      combatesArena: novosDuelos
    });
    playReiatsuSound('shatter');
    alert("Duelo resetado com sucesso! Os combatentes retornaram ao estado Inteiro.");
  }
  function alterarEstadoCombatente(combNum, novoEstado) {
    const novosDuelos = (db.combatesArena || []).map(d => {
      if (d.id === duelo.id) {
        return {
          ...d,
          [combNum === 1 ? "estadoP1" : "estadoP2"]: novoEstado
        };
      }
      return d;
    });
    saveDb({
      ...db,
      combatesArena: novosDuelos
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\u2694\uFE0F Arena Oficial de Duelos & Linha do Tempo",
    subtitle: "Espa\xE7o de combate com julgamento narrativo por turnos, regra do 1d6 e registro cont\xEDnuo",
    right: /*#__PURE__*/React.createElement("button", {
      onClick: resetarDuelo,
      className: "px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD04"), " Resetar Duelo")
  }, p1 && p2 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 bg-bleach-panel2 border-2 border-red-500/50 rounded-2xl flex items-center justify-between gap-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: p1.foto || 'assets/ichigo-orange.png',
    className: "w-16 h-16 rounded-xl object-cover border border-red-500"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold text-red-400 uppercase"
  }, "Combatente 1"), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl text-white"
  }, p1.nome), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-muted font-mono flex gap-2 mt-1"
  }, /*#__PURE__*/React.createElement("span", null, "FOR: ", p1.atributos?.forca), /*#__PURE__*/React.createElement("span", null, "VEL: ", p1.atributos?.velocidade), /*#__PURE__*/React.createElement("span", null, "RES: ", p1.atributos?.resiliencia)))), /*#__PURE__*/React.createElement("div", {
    className: "text-right space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted block uppercase"
  }, "Estado Atual"), /*#__PURE__*/React.createElement("select", {
    value: duelo.estadoP1 || "Inteiro",
    onChange: e => alterarEstadoCombatente(1, e.target.value),
    className: "bg-black border border-red-500/60 rounded-lg p-1.5 text-xs text-white font-bold"
  }, ESTADOS.map(st => /*#__PURE__*/React.createElement("option", {
    key: st.key,
    value: st.key
  }, st.key))))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 bg-bleach-panel2 border-2 border-blue-500/50 rounded-2xl flex items-center justify-between gap-4 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: p2.foto || 'assets/ichigo-moon.png',
    className: "w-16 h-16 rounded-xl object-cover border border-blue-500"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold text-cyan-400 uppercase"
  }, "Combatente 2"), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl text-white"
  }, p2.nome), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-muted font-mono flex gap-2 mt-1"
  }, /*#__PURE__*/React.createElement("span", null, "FOR: ", p2.atributos?.forca), /*#__PURE__*/React.createElement("span", null, "VEL: ", p2.atributos?.velocidade), /*#__PURE__*/React.createElement("span", null, "RES: ", p2.atributos?.resiliencia)))), /*#__PURE__*/React.createElement("div", {
    className: "text-right space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted block uppercase"
  }, "Estado Atual"), /*#__PURE__*/React.createElement("select", {
    value: duelo.estadoP2 || "Inteiro",
    onChange: e => alterarEstadoCombatente(2, e.target.value),
    className: "bg-black border border-cyan-500/60 rounded-lg p-1.5 text-xs text-white font-bold"
  }, ESTADOS.map(st => /*#__PURE__*/React.createElement("option", {
    key: st.key,
    value: st.key
  }, st.key)))))), /*#__PURE__*/React.createElement("form", {
    onSubmit: registrarTurno,
    className: "p-4 bg-black/60 border border-bleach-border rounded-2xl space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-white/5 pb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-xs font-bold text-bleach-orange uppercase flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u270D\uFE0F"), " Registrar Novo Turno de Combate"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: rolarDadoDuelo,
    className: "px-3 py-1 bg-bleach-panel border border-bleach-border hover:border-yellow-400 text-yellow-300 text-xs font-bold rounded-lg transition"
  }, "\uD83C\uDFB2 Rolar 1d6 (Regra Oficial)")), dadoRolado && /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 bg-yellow-950/60 border border-yellow-500/50 rounded-xl flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-yellow-200"
  }, "Resultado do Dado: ", /*#__PURE__*/React.createElement("strong", null, "1d6 = ", dadoRolado.res)), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-yellow-300 uppercase"
  }, dadoRolado.cat)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted font-bold mb-1"
  }, "A\xE7\xE3o de ", p1.nome), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Avan\xE7ou com Shunpo e desferiu corte vertical...",
    value: acaoP1,
    onChange: e => setAcaoP1(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted font-bold mb-1"
  }, "A\xE7\xE3o de ", p2.nome), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Ergueu Bakud\u014D #39 e contra-atacou com Had\u014D...",
    value: acaoP2,
    onChange: e => setAcaoP2(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1 text-xs uppercase"
  }, "Decis\xE3o do Juiz / Consequ\xEAncia Narrativa *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: O corte rompeu a barreira mas causou apenas dano superficial; ambos recuam...",
    value: vereditoJuiz,
    onChange: e => setVereditoJuiz(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-red-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow"
  }, "\u2713 Gravar Turno na Linha do Tempo"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-lg text-bleach-cream flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDC"), " REGISTRO CRONOL\xD3GICO DOS TURNOS (", (duelo.turnos || []).length, ")"), (duelo.turnos || []).length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center text-xs text-bleach-muted bg-black/40 rounded-xl border border-white/5"
  }, "Nenhum turno registrado neste combate ainda.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, (duelo.turnos || []).map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-white/5 pb-1 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-title text-bleach-orange text-base"
  }, "TURNO #", t.numero), /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-muted font-mono text-[11px]"
  }, t.data, " \u2014 Juiz: ", t.autor)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-bleach-creamDim"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-black/40 rounded-lg"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-red-400 block"
  }, p1.nome, ":"), /*#__PURE__*/React.createElement("p", null, t.acaoP1)), /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-black/40 rounded-lg"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-cyan-400 block"
  }, p2.nome, ":"), /*#__PURE__*/React.createElement("p", null, t.acaoP2))), /*#__PURE__*/React.createElement("div", {
    className: "p-2.5 bg-black/70 border border-yellow-500/30 rounded-lg text-xs space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-yellow-300 block uppercase text-[10px]"
  }, "Consequ\xEAncia do Turno:"), /*#__PURE__*/React.createElement("p", {
    className: "text-white"
  }, t.veredito), t.dado && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-yellow-400 font-mono block"
  }, "\uD83C\uDFB2 ", t.dado))))))) : /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhum combatente selecionado.")));
}

// BLEACH SWORD ART SVG COMPONENT
function BleachSwordArt({
  arma,
  nomeZk,
  isBankai,
  foto,
  onUpload
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "relative w-full h-64 sm:h-80 bg-black/80 rounded-2xl border border-bleach-border overflow-hidden flex items-center justify-center p-4"
  }, foto && foto !== "assets/ichigo-orange.png" && foto !== "assets/ichigo-moon.png" ? /*#__PURE__*/React.createElement("img", {
    src: foto,
    className: "w-full h-full object-contain"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "text-center space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-6xl animate-pulse"
  }, isBankai ? "卍" : "🗡️"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl text-white tracking-wider"
  }, nomeZk || "Lâmina Selada"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-orange"
  }, isBankai ? "Forma Monumental de Bankai" : "Forma Desperta de Shikai"))), /*#__PURE__*/React.createElement("label", {
    className: "absolute bottom-3 right-3 px-3 py-1.5 bg-black/80 hover:bg-black border border-bleach-border hover:border-bleach-orange rounded-lg text-[11px] font-bold text-bleach-cream cursor-pointer transition shadow"
  }, "\uD83D\uDCF7 Trocar Arte", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: onUpload,
    className: "hidden"
  })));
}

// =========================================================================
// VIEWS PART 2: FICHAVIEW WITH COMPLETE REWARD CONCESSION & DEEP RESET
// =========================================================================

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

  // Recompensa Form (ADM)
  const [rec, setRec] = useState({
    tipo: "Recompensa de Atributos",
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
  const [aiZkLoading, setAiZkLoading] = useState(false);
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
  if (!personagem) return /*#__PURE__*/React.createElement("div", {
    className: "text-bleach-muted"
  }, "Ficha n\xE3o encontrada.");
  const pendSum = Object.values(pend).reduce((a, b) => a + b, 0);
  const restante = (personagem.pontosDisponiveis || 0) - pendSum;
  const totalStats = Object.values(personagem.atributos || {
    pressao: 10,
    forca: 10,
    velocidade: 10,
    resiliencia: 10
  }).reduce((a, b) => a + b, 0);
  const powerTier = getPowerTier(totalStats);
  const temShikai = !!personagem?.zanpakuto?.shikaiAtiva;
  const temBankai = !!personagem?.zanpakuto?.bankaiAtiva;
  const temOpcoesShikaiSalvas = !!(personagem?.opcoesShikaiPendentes && personagem.opcoesShikaiPendentes.length > 0);
  const temOpcoesBankaiSalvas = !!(personagem?.opcoesBankaiPendentes && personagem.opcoesBankaiPendentes.length > 0);
  const podeGerarShikai = !!personagem?.permissoes?.shikaiLiberada && !temShikai && !temOpcoesShikaiSalvas;
  const podeGerarBankai = !!personagem?.permissoes?.bankaiLiberada && temShikai && !temBankai && !temOpcoesBankaiSalvas;
  const personalidadeSelada = !!personagem?.personalidadeTravada;
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
    updateChar({
      personalidadeTravada: false
    }, "🔓 ADM destravou a edição de personalidade da ficha");
    alert("Edição de personalidade destravada para este personagem.");
  }

  // 2. ENVIO DE CENA DE DESPERTAR & MOTOR DE IA
  function abrirFluxoDespertar(tipo = "shikai") {
    if (!personalidadeSelada && !personagem.personalidade?.texto) {
      alert("⚠️ Você precisa primeiro preencher e selar sua Personalidade na aba de Perfil para que a essência espiritual seja despertada!");
      setSubPaginaFicha("perfil");
      return;
    }
    if (tipo === "shikai") {
      if (personagem.opcoesShikaiPendentes && personagem.opcoesShikaiPendentes.length > 0) {
        setAiZkOpcoes(personagem.opcoesShikaiPendentes);
        setAiZkTipo("shikai");
        setAiZkLoading(false);
        setShowZanpakutoAIModal(true);
        return;
      }
    } else {
      if (personagem.opcoesBankaiPendentes && personagem.opcoesBankaiPendentes.length > 0) {
        setAiZkOpcoes(personagem.opcoesBankaiPendentes);
        setAiZkTipo("bankai");
        setAiZkLoading(false);
        setShowZanpakutoAIModal(true);
        return;
      }
    }
    setShowCenaModal(tipo);
  }
  async function submeterCenaDespertar(cenaTexto) {
    const tipo = showCenaModal || "shikai";
    setShowCenaModal(null);
    setAiZkTipo(tipo);
    setAiZkOpcoes([]);
    setAiZkLoading(true);
    setShowZanpakutoAIModal(true);
    if (tipo === "shikai") {
      playReiatsuSound('shikai_charge');
      try {
        const caminhos = await gerar4CaminhosZanpakutoAI_Async(personagem, db.personagens, db.zanpakutosVinculadas, cenaTexto);
        setAiZkOpcoes(caminhos);
        updateChar({
          cenaDespertarShikai: cenaTexto,
          opcoesShikaiPendentes: caminhos
        }, "📜 4 Manifestações de Shikai forjadas e salvas na alma para escolha");
      } catch (err) {
        console.error("Erro ao gerar Shikai:", err);
      } finally {
        setAiZkLoading(false);
      }
    } else {
      playReiatsuSound('bankai_charge');
      try {
        const bankais = await gerar3BankaisEvolucaoAI_Async(personagem, personagem.zanpakuto?.shikaiAtiva, db.personagens, db.zanpakutosVinculadas, cenaTexto);
        setAiZkOpcoes(bankais);
        updateChar({
          cenaDespertarBankai: cenaTexto,
          opcoesBankaiPendentes: bankais
        }, "📜 3 Evoluções de Bankai forjadas e salvas na alma para escolha");
      } catch (err) {
        console.error("Erro ao gerar Bankai:", err);
      } finally {
        setAiZkLoading(false);
      }
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
        opcoesShikaiPendentes: null,
        permissoes: {
          ...(p.permissoes || {}),
          shikaiLiberada: false
        },
        historico: [{
          id: uid(),
          data: nowStr(),
          texto: `🗡️ DESPERTOU SHIKAI AUTORAL EXCLUSIVA: [${shikai.nome}] — "${shikai.comando}"`
        }, ...(p.historico || [])]
      } : p);
      saveDb({
        ...db,
        personagens,
        zanpakutosVinculadas: novasVinculadas
      });
      setSubPaginaFicha("shikai");
      alert(`✨ Parabéns! Sua Shikai [${shikai.nome}] foi selada com exclusividade absoluta na sua ficha!`);
    } else {
      const bankai = caminhoEscolhido.bankai || caminhoEscolhido;
      const novoZk = {
        ...(personagem.zanpakuto || {}),
        bankaiAtiva: bankai,
        bankaiEscolhida: true
      };
      const personagens = (db.personagens || []).map(p => p.id === personagem.id ? {
        ...p,
        zanpakuto: novoZk,
        opcoesBankaiPendentes: null,
        permissoes: {
          ...(p.permissoes || {}),
          bankaiLiberada: false
        },
        historico: [{
          id: uid(),
          data: nowStr(),
          texto: `卍 DESPERTOU BANKAI MONUMENTAL: [${bankai.nome}] — "${bankai.comando}"`
        }, ...(p.historico || [])]
      } : p);
      saveDb({
        ...db,
        personagens
      });
      setSubPaginaFicha("shikai");
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
      roll -= r.peso || 1;
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
      setGachaModal(prev => prev ? {
        ...prev,
        progress: Math.round(currentProgress),
        stageText: stage
      } : null);
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
    setGachaModal(prev => prev ? {
      ...prev,
      progress: 100,
      stageText: "Liberação concluída!"
    } : null);
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
      atributos: {
        pressao: 10,
        forca: 10,
        velocidade: 10,
        resiliencia: 10
      },
      pontosDisponiveis: 20,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      permissoes: {
        shikaiLiberada: false,
        bankaiLiberada: false
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
      personalidade: {
        texto: "",
        virtudes: "",
        defeitos: "",
        desejos: "",
        medos: "",
        conflitos: "",
        estiloCombate: ""
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
        bankaiPadrao: null,
        shikaiEscolhida: false,
        bankaiEscolhida: false,
        assinaturaEspiritual: "",
        dnaEspiritual: null,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{
        id: uid(),
        data: nowStr(),
        texto: "⚠️ Ficha resetada integralmente para o estado inicial pela Administração."
      }]
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
    setPend({
      pressao: 0,
      forca: 0,
      velocidade: 0,
      resiliencia: 0
    });

    // Remove claimed signatures completely
    const novasVinculadas = (db.zanpakutosVinculadas || []).filter(z => z.charId !== personagem.id && z.charNome !== personagem.nome);
    const personagens = (db.personagens || []).map(p => p.id === personagem.id ? resetChar : p);
    saveDb({
      ...db,
      personagens,
      zanpakutosVinculadas: novasVinculadas
    });
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
      resiliencia: Number(personagem.atributos?.resiliencia || 10) + pend.resiliencia
    };
    const novoDisponivel = (personagem.pontosDisponiveis || 0) - pendSum;
    updateChar({
      atributos: novosAtributos,
      pontosDisponiveis: novoDisponivel
    }, `✨ Distribuiu ${pendSum} pontos: Pressão (+${pend.pressao}), Força (+${pend.forca}), Velocidade (+${pend.velocidade}), Resiliência (+${pend.resiliencia})`);
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
    }, `Aprendeu técnica [${novaTecCat}] ${novaTecNome.trim()}`);
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
    }, `Permissão de Shikai ${!atual ? "LIBERADA" : "BLOQUEADA"} pelo ADM`);
  }
  function togglePermissaoBankai() {
    const atual = !!personagem?.permissoes?.bankaiLiberada;
    updateChar({
      permissoes: {
        ...(personagem.permissoes || {}),
        bankaiLiberada: !atual
      }
    }, `Permissão de Bankai ${!atual ? "LIBERADA" : "BLOQUEADA"} pelo ADM`);
  }
  function confirmarResetFicha() {
    setShowResetModal(false);
    const charReset = {
      ...personagem,
      atributos: {
        pressao: 10,
        forca: 10,
        velocidade: 10,
        resiliencia: 10
      },
      pontosDisponiveis: 20,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      zanpakuto: {
        nome: "Lâmina Selada (Asauchi)",
        shikaiAtiva: null,
        bankaiAtiva: null
      },
      opcoesShikaiPendentes: null,
      opcoesBankaiPendentes: null,
      cenaDespertarShikai: "",
      cenaDespertarBankai: "",
      personalidadeTravada: false,
      permissoes: {
        shikaiLiberada: false,
        bankaiLiberada: false
      },
      historico: [{
        id: uid(),
        data: nowStr(),
        texto: "🔄 Ficha resetada integralmente para o início."
      }]
    };
    const novasVinculadas = (db.zanpakutosVinculadas || []).filter(z => z.charId !== personagem.id);
    const personagens = (db.personagens || []).map(p => p.id === personagem.id ? charReset : p);
    saveDb({
      ...db,
      personagens,
      zanpakutosVinculadas: novasVinculadas
    });
    alert("Ficha resetada com sucesso para o estado inicial!");
  }

  // CONCESSÃO DE RECOMPENSA DE ATRIBUTOS PELO ADM (SOMENTE ATRIBUTOS)
  function concederRecompensa() {
    const pontos = Number(rec.pontos) || 0;
    if (pontos <= 0) {
      alert("Informe uma quantidade válida de pontos.");
      return;
    }
    let patch = {};
    let texto = `[${rec.tipo}]`;
    if (rec.atributo && rec.atributo !== "pontosDisponiveis") {
      const valorAtual = Number(personagem.atributos?.[rec.atributo] || 10);
      patch.atributos = {
        ...(personagem.atributos || {
          pressao: 10,
          forca: 10,
          velocidade: 10,
          resiliencia: 10
        }),
        [rec.atributo]: valorAtual + pontos
      };
      texto += ` +${pontos} em ${rec.atributo.toUpperCase()}`;
    } else {
      patch.pontosDisponiveis = (personagem.pontosDisponiveis || 0) + pontos;
      texto += ` +${pontos} pontos livres concedidos para distribuição`;
    }
    if (rec.motivo.trim()) texto += ` — ${rec.motivo.trim()}`;
    updateChar(patch, texto);
    playReiatsuSound('win');
    alert(`Recompensa de +${pontos} ponto(s) de atributo concedida com sucesso para ${personagem.nome}!`);
    setRec({
      tipo: "Recompensa de Atributos",
      pontos: 1,
      atributo: "",
      motivo: ""
    });
  }
  function handleFotoUpload(e, tipo = "perfil") {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = uploadEvent => {
      const dataUrl = uploadEvent.target.result;
      if (tipo === "perfil") {
        setEditFoto(dataUrl);
        updateChar({
          foto: dataUrl
        }, "Foto de perfil atualizada");
      } else if (tipo === "shikai") {
        setEditFotoShikai(dataUrl);
        updateChar({
          zanpakuto: {
            ...(personagem.zanpakuto || {}),
            fotoShikai: dataUrl
          }
        }, "Imagem da arma Shikai atualizada");
      } else if (tipo === "bankai") {
        setEditFotoBankai(dataUrl);
        updateChar({
          zanpakuto: {
            ...(personagem.zanpakuto || {}),
            fotoBankai: dataUrl
          }
        }, "Imagem da Bankai atualizada");
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
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative rounded-2xl border-2 border-bleach-border bg-gradient-to-r from-black via-bleach-panel to-black p-4 sm:p-6 shadow-2xl overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-center sm:items-start gap-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-bleach-orange shadow-lg bg-black shrink-0"
  }, /*#__PURE__*/React.createElement("img", {
    src: personagem.foto || 'assets/ichigo-orange.png',
    alt: personagem.nome,
    className: "w-full h-full object-cover"
  }), /*#__PURE__*/React.createElement("label", {
    className: "absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition"
  }, "Trocar Foto", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: e => handleFotoUpload(e, "perfil"),
    className: "hidden"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-center sm:text-left space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-center sm:justify-start gap-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-2xl sm:text-3xl text-white tracking-wider"
  }, personagem.nome), /*#__PURE__*/React.createElement(Badge, {
    color: ESTADOS.find(e => e.key === personagem.estado)?.color || C.green
  }, personagem.estado), /*#__PURE__*/React.createElement(Badge, {
    color: powerTier.color
  }, powerTier.title, " (", totalStats, " pts)"), personalidadeSelada && /*#__PURE__*/React.createElement(Badge, {
    color: C.yellow
  }, "\uD83D\uDD12 DNA Selado")), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-creamDim flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1"
  }, /*#__PURE__*/React.createElement("span", null, "Ra\xE7a: ", /*#__PURE__*/React.createElement("strong", null, personagem.raca || "Shinigami")), /*#__PURE__*/React.createElement("span", null, "Divis\xE3o: ", /*#__PURE__*/React.createElement("strong", null, personagem.esquadrao || "11º Esquadrão")), /*#__PURE__*/React.createElement("span", null, "Zanpakut\u014D: ", /*#__PURE__*/React.createElement("strong", {
    className: temShikai ? "text-cyan-400 font-cinzel" : "text-bleach-muted"
  }, personagem.zanpakuto?.nome || "Lâmina Selada"))))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5 overflow-x-auto border-t border-bleach-borderSoft/80 pt-3 mt-4"
  }, [{
    id: "perfil",
    label: "Perfil & Personalidade",
    icon: "👤"
  }, {
    id: "shikai",
    label: "Zanpakutō & Despertar",
    icon: "⚔️"
  }, {
    id: "atributos",
    label: "Atributos & Treino",
    icon: "⚡"
  }, {
    id: "kidos",
    label: "Kidō & Técnicas",
    icon: "📕"
  }, {
    id: "sorteios",
    label: `Sorteios (${(personagem.sorteiosComunsRestantes || 0) + (personagem.sorteiosEspeciaisRestantes || 0)})`,
    icon: "🎁"
  }, {
    id: "historico",
    label: "Histórico",
    icon: "📜"
  }].map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: () => setSubPaginaFicha(tab.id),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${subPaginaFicha === tab.id ? "bg-bleach-orange text-black font-extrabold shadow" : "bg-bleach-panel2 text-bleach-creamDim hover:text-white"}`
  }, tab.icon, " ", tab.label)))), subPaginaFicha === "perfil" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\uD83E\uDDE0 Personalidade & DNA Espiritual da Alma",
    subtitle: "A ess\xEAncia psicol\xF3gica e moral que guiar\xE1 a manifesta\xE7\xE3o autoral da sua Zanpakut\u014D",
    className: "border-2 border-bleach-blue/60 shadow-2xl"
  }, personalidadeSelada ? /*#__PURE__*/React.createElement("div", {
    className: "p-5 rounded-2xl bg-black/80 border-2 border-yellow-500/60 shadow-xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between border-b border-yellow-500/30 pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "\uD83D\uDD12"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl text-yellow-300"
  }, "REGISTRO ESPIRITUAL SELADO NA ALMA"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, "Esta personalidade est\xE1 gravada e imut\xE1vel pelo jogador."))), isAdmin && /*#__PURE__*/React.createElement("button", {
    onClick: destravarPersonalidadeAdm,
    className: "px-3 py-1 bg-yellow-950 border border-yellow-400 text-yellow-300 text-xs font-bold rounded-lg hover:bg-yellow-900"
  }, "\uD83D\uDD13 Destravar Personalidade (ADM)")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange block"
  }, "Psicologia & Comportamento:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-cream leading-relaxed"
  }, persTexto || "—")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-green-400 block"
  }, "Virtudes Dominantes:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-cream leading-relaxed"
  }, persVirtudes || "—")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-purple-400 block"
  }, "Defici\xEAncias & Conflitos Internos:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-cream leading-relaxed"
  }, persDefeitos || "—")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-cyan-400 block"
  }, "Desejos Centrais & Ambi\xE7\xF5es:"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-cream leading-relaxed"
  }, persDesejos || "—")))) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-black/60 border border-bleach-orange/40 rounded-xl text-xs text-bleach-creamDim space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange block"
  }, "\u26A0\uFE0F Aten\xE7\xE3o antes de preencher:"), /*#__PURE__*/React.createElement("p", null, "Escreva por conta pr\xF3pria a psicologia do seu Shinigami. O motor de IA analisar\xE1 essas informa\xE7\xF5es para forjar os 4 Caminhos Espirituais exclusivos. Uma vez selada, ", /*#__PURE__*/React.createElement("strong", null, "n\xE3o ser\xE1 mais poss\xEDvel alterar"), " por conta pr\xF3pria.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sm:col-span-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-bleach-cream mb-1"
  }, "Descri\xE7\xE3o Geral da Personalidade & Filosofia *"), /*#__PURE__*/React.createElement("textarea", {
    rows: 3,
    placeholder: "Descreva o temperamento, valores morais e postura do personagem...",
    value: persTexto,
    onChange: e => setPersTexto(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-green-400 mb-1"
  }, "Virtudes & Pontos Fortes *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Lealdade extrema, paci\xEAncia t\xE1tica, coragem",
    value: persVirtudes,
    onChange: e => setPersVirtudes(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-purple-400 mb-1"
  }, "Defici\xEAncias, Limita\xE7\xF5es ou Fraquezas"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Dificuldade de confiar, impulsividade, apego ao passado",
    value: persDefeitos,
    onChange: e => setPersDefeitos(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-cyan-400 mb-1"
  }, "Desejos Centrais & Ambi\xE7\xF5es"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Proteger os companheiros, alcan\xE7ar a liberdade",
    value: persDesejos,
    onChange: e => setPersDesejos(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block font-bold text-red-400 mb-1"
  }, "Medos Profundos & Conflitos Internos"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Medo da impot\xEAncia, conflito entre dever e sentimento",
    value: persMedos,
    onChange: e => setPersMedos(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "pt-2 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: selarPersonalidadeDefinitiva,
    className: "px-6 py-3 bg-gradient-to-r from-bleach-orange to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition"
  }, "\uD83D\uDD12 Salvar & Selar Personalidade Definitiva na Alma")))), /*#__PURE__*/React.createElement(Section, {
    title: "Dados Cadastrais & Perfil Biogr\xE1fico",
    subtitle: "Informa\xE7\xF5es biogr\xE1ficas e civis do Shinigami"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted uppercase font-bold mb-1"
  }, "Nome"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editNome,
    onChange: e => setEditNome(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted uppercase font-bold mb-1"
  }, "WhatsApp"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editWhats,
    onChange: e => setEditWhats(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted uppercase font-bold mb-1"
  }, "C\xF3digo de Acesso"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editCodigo,
    onChange: e => setEditCodigo(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted uppercase font-bold mb-1"
  }, "Ra\xE7a"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editRaca,
    onChange: e => setEditRaca(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted uppercase font-bold mb-1"
  }, "Esquadr\xE3o"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editEsquadrao,
    onChange: e => setEditEsquadrao(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-muted uppercase font-bold mb-1"
  }, "Faceclaim"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: editFaceclaim,
    onChange: e => setEditFaceclaim(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 flex justify-end"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: salvarDadosCompletos,
    className: "px-5 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow"
  }, "Salvar Dados Cadastrais")))), subPaginaFicha === "shikai" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "\u2694\uFE0F Estado Espiritual da Zanpakut\u014D",
    subtitle: "A forma f\xEDsica e o despertar da l\xE2mina do Shinigami",
    className: "border-2 border-bleach-orange/60"
  }, temShikai ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, (() => {
    const s = personagem.zanpakuto.shikaiAtiva;
    return /*#__PURE__*/React.createElement("div", {
      className: "p-5 sm:p-6 rounded-2xl bg-black/85 border-2 border-cyan-500/80 shadow-2xl space-y-4 reiatsu-glow"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-start justify-between gap-3 border-b border-cyan-500/40 pb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-cyan-400 tracking-wider"
    }, "\u2713 SHIKAI DESPERTA & VINCULADA \xC0 ALMA"), /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-950/80 border border-green-500 text-green-300 tracking-wider"
    }, "\u2726 ", s.indiceExclusividade || 100, "% Exclusiva no RPG"), /*#__PURE__*/React.createElement(Badge, {
      color: C.blue
    }, s.elemento || "Espiritual")), /*#__PURE__*/React.createElement("h3", {
      className: "font-title text-2xl sm:text-4xl text-white tracking-wider flex items-center gap-2 flex-wrap mt-1"
    }, /*#__PURE__*/React.createElement("span", null, s.nome), s.kanji && /*#__PURE__*/React.createElement("span", {
      className: "text-base sm:text-lg font-cinzel text-bleach-orange font-normal"
    }, s.kanji), s.traducao && /*#__PURE__*/React.createElement("span", {
      className: "text-xs sm:text-sm text-bleach-creamDim font-sans"
    }, "(", s.traducao, ")")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs sm:text-sm text-cyan-300 italic"
    }, "\"", s.comando, "\""))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-bleach-panel2/90 rounded-xl border border-white/5 space-y-1"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-bleach-orange block text-xs flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\u2694\uFE0F"), " Manifesta\xE7\xE3o da Arma:"), /*#__PURE__*/React.createElement("p", {
      className: "text-bleach-creamDim leading-relaxed text-xs"
    }, s.aparencia || s.formatoArma || "Katana cerimonial de corte espiritual.")), /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-bleach-panel2/90 rounded-xl border border-white/5 space-y-1"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-cyan-400 block text-xs flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83E\uDDE0"), " Rela\xE7\xE3o com a Alma & Temperamento:"), /*#__PURE__*/React.createElement("p", {
      className: "text-bleach-creamDim leading-relaxed text-xs"
    }, s.relacaoPersonalidade || `Manifestação direta da essência e das virtudes de ${personagem.nome}.`))), /*#__PURE__*/React.createElement("div", {
      className: "p-4 bg-black/90 rounded-xl border-2 border-bleach-orange/40 space-y-2.5 shadow-inner"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-bleach-orange block text-xs uppercase tracking-wider flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\u26A1"), " PODER & MEC\xC2NICA ESPIRITUAL:"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs sm:text-sm text-bleach-cream leading-relaxed font-sans"
    }, s.poder), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-x-5 gap-y-1 text-xs text-bleach-muted pt-2 border-t border-white/10"
    }, /*#__PURE__*/React.createElement("span", null, "Custo: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-white"
    }, s.custoReiatsu || "Médio")), s.limitacoes && /*#__PURE__*/React.createElement("span", null, "Limita\xE7\xF5es: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-amber-300"
    }, s.limitacoes)))), s.indices && /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-black/60 rounded-xl border border-white/10 space-y-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold uppercase tracking-wider text-bleach-muted block"
    }, "\xCDndice de Complexidade & Balan\xE7o Espiritual (1 a 10)"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs"
    }, [{
      label: "Potência",
      val: s.indices.potencia,
      color: C.red
    }, {
      label: "Abrangência",
      val: s.indices.abrangencia,
      color: C.blue
    }, {
      label: "Complexidade",
      val: s.indices.complexidade,
      color: C.purple
    }, {
      label: "Versatilidade",
      val: s.indices.versatilidade,
      color: C.green
    }, {
      label: "Custo",
      val: s.indices.custo,
      color: C.yellow
    }].map(stat => /*#__PURE__*/React.createElement("div", {
      key: stat.label,
      className: "p-2 bg-bleach-panel2 rounded-lg border border-white/5 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-bleach-muted block text-[10px]"
    }, stat.label), /*#__PURE__*/React.createElement("span", {
      className: "font-mono font-bold text-xs",
      style: {
        color: stat.color
      }
    }, stat.val || 8, "/10"), /*#__PURE__*/React.createElement("div", {
      className: "w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full",
      style: {
        width: `${(stat.val || 8) * 10}%`,
        backgroundColor: stat.color
      }
    })))))), /*#__PURE__*/React.createElement(BleachSwordArt, {
      arma: s,
      nomeZk: s.nome,
      isBankai: false,
      foto: personagem.zanpakuto?.fotoShikai,
      onUpload: e => handleFotoUpload(e, "shikai")
    }), personagem.cenaDespertarShikai && /*#__PURE__*/React.createElement("div", {
      className: "p-4 bg-black/70 border border-cyan-500/40 rounded-xl space-y-1.5 mt-3"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-cyan-300 text-xs uppercase tracking-wider flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDC"), " Cena de Despertar da Shikai:"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-bleach-creamDim italic leading-relaxed"
    }, "\"", personagem.cenaDespertarShikai, "\"")));
  })(), temBankai ? (() => {
    const b = personagem.zanpakuto.bankaiAtiva;
    return /*#__PURE__*/React.createElement("div", {
      className: "p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 via-bleach-panel to-black border-2 border-yellow-500/80 bankai-supreme-card shadow-2xl space-y-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-start justify-between gap-3 border-b border-yellow-500/40 pb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap items-center gap-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-950 text-yellow-300 border border-yellow-400 tracking-wider"
    }, "\u534D BANKAI TRANSCENDENTAL & SOBERANA"), b.tipoEvolucao && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-950/80 border border-yellow-500/50 text-yellow-300 tracking-wider"
    }, "\u26A1 ", b.tipoEvolucao)), /*#__PURE__*/React.createElement("h3", {
      className: "font-title text-2xl sm:text-4xl text-yellow-300 tracking-wider flex items-center gap-2 flex-wrap mt-1"
    }, /*#__PURE__*/React.createElement("span", null, b.nome), b.kanji && /*#__PURE__*/React.createElement("span", {
      className: "text-base sm:text-lg font-cinzel text-yellow-400 font-normal"
    }, b.kanji), b.traducao && /*#__PURE__*/React.createElement("span", {
      className: "text-xs sm:text-sm text-yellow-200/80 font-sans"
    }, "(", b.traducao, ")")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs sm:text-sm text-yellow-200 italic"
    }, "\"", b.comando, "\""))), b.pontoRuptura && /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-gradient-to-r from-amber-950/60 to-black rounded-xl border-2 border-yellow-500/70 space-y-1"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-yellow-400 block text-xs uppercase tracking-wider flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCA5"), " PONTO DE RUPTURA (LIMITE DA SHIKAI SUPERADO):"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs sm:text-sm text-bleach-cream leading-relaxed font-sans"
    }, b.pontoRuptura)), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-yellow-400 block text-xs flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDC51"), " Dom\xEDnio Territorial & Forma Monumental:"), /*#__PURE__*/React.createElement("p", {
      className: "text-bleach-creamDim text-xs leading-relaxed"
    }, b.formaMonumental || "Manifestação monumental de Reishi em escala territorial.")), /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-cyan-300 block text-xs flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\u26A1"), " Poder Transcendental da Bankai:"), /*#__PURE__*/React.createElement("p", {
      className: "text-bleach-creamDim text-xs leading-relaxed"
    }, b.poder))), /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-black/80 rounded-xl border border-white/10 text-xs space-y-2"
    }, b.limitacoes && /*#__PURE__*/React.createElement("div", {
      className: "text-xs text-red-300"
    }, /*#__PURE__*/React.createElement("strong", null, "\u26A0\uFE0F Limita\xE7\xF5es & Desgaste:"), " ", b.limitacoes), b.significadoEspiritual && /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-bleach-muted border-t border-white/5 pt-2"
    }, /*#__PURE__*/React.createElement("strong", null, "Significado Filos\xF3fico:"), " ", /*#__PURE__*/React.createElement("em", {
      className: "text-yellow-200"
    }, "\"", b.significadoEspiritual, "\""))), b.indices && /*#__PURE__*/React.createElement("div", {
      className: "p-3.5 bg-black/60 rounded-xl border border-white/10 space-y-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold uppercase tracking-wider text-bleach-muted block"
    }, "\xCDndice de Pot\xEAncia & Balan\xE7o Espiritual da Bankai (1 a 10)"), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs"
    }, [{
      label: "Potência",
      val: b.indices.potencia,
      color: C.red
    }, {
      label: "Abrangência",
      val: b.indices.abrangencia,
      color: C.blue
    }, {
      label: "Complexidade",
      val: b.indices.complexidade,
      color: C.purple
    }, {
      label: "Versatilidade",
      val: b.indices.versatilidade,
      color: C.green
    }, {
      label: "Custo",
      val: b.indices.custo,
      color: C.yellow
    }].map(stat => /*#__PURE__*/React.createElement("div", {
      key: stat.label,
      className: "p-2 bg-bleach-panel2 rounded-lg border border-white/5 text-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-bleach-muted block text-[10px]"
    }, stat.label), /*#__PURE__*/React.createElement("span", {
      className: "font-mono font-bold text-xs",
      style: {
        color: stat.color
      }
    }, stat.val || 10, "/10"), /*#__PURE__*/React.createElement("div", {
      className: "w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-1.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full",
      style: {
        width: `${(stat.val || 10) * 10}%`,
        backgroundColor: stat.color
      }
    })))))), /*#__PURE__*/React.createElement(BleachSwordArt, {
      arma: b,
      nomeZk: b.nome,
      isBankai: true,
      foto: personagem.zanpakuto?.fotoBankai,
      onUpload: e => handleFotoUpload(e, "bankai")
    }), personagem.cenaDespertarBankai && /*#__PURE__*/React.createElement("div", {
      className: "p-4 bg-black/70 border border-yellow-500/40 rounded-xl space-y-1.5 mt-3"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-yellow-400 text-xs uppercase tracking-wider flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCDC"), " Cena de Despertar da Bankai:"), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-bleach-creamDim italic leading-relaxed"
    }, "\"", personagem.cenaDespertarBankai, "\"")));
  })() : personagem.opcoesBankaiPendentes && personagem.opcoesBankaiPendentes.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 p-5 sm:p-6 bg-gradient-to-b from-amber-950/70 via-black to-bleach-panel rounded-2xl border-2 border-yellow-500/80 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-yellow-500/30 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-400"
  }, "\u534D 3 EVOLU\xC7\xD5ES DE BANKAI FORJADAS & SALVAS"), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl sm:text-2xl text-yellow-300 mt-1"
  }, "Escolha a Transcend\xEAncia da sua Bankai"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim"
  }, "As 3 evolu\xE7\xF5es geradas pela IA est\xE3o permanentemente salvas na sua alma. Analise e sele a que melhor representa sua evolu\xE7\xE3o.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => abrirFluxoDespertar("bankai"),
    className: "px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-xl shadow whitespace-nowrap"
  }, "\uD83D\uDD0D Abrir Vis\xE3o em Modal Completo")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-3 pt-2"
  }, personagem.opcoesBankaiPendentes.map((c, idx) => {
    const b = c.bankai || c;
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "p-4 rounded-xl bg-black/80 border border-yellow-500/40 hover:border-yellow-400 flex flex-col justify-between space-y-3 transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-extrabold px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-500/50"
    }, "Op\xE7\xE3o ", idx + 1, " \u2022 ", b.tipoEvolucao || "Evolução Espiritual")), /*#__PURE__*/React.createElement("h5", {
      className: "font-title text-lg text-yellow-300 leading-tight"
    }, b.nome, " ", b.traducao && /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-normal text-yellow-200/80"
    }, "(", b.traducao, ")")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-yellow-200 italic"
    }, "\"", b.comando, "\""), b.pontoRuptura && /*#__PURE__*/React.createElement("div", {
      className: "p-2 bg-amber-950/40 rounded border border-yellow-500/30 text-[11px] text-yellow-200"
    }, /*#__PURE__*/React.createElement("strong", {
      className: "text-yellow-400 block text-[10px] uppercase"
    }, "\uD83D\uDCA5 Ponto de Ruptura:"), b.pontoRuptura), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-bleach-creamDim line-clamp-3"
    }, b.poder)), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const confirma = confirm(`Tem certeza que deseja selar definitivamente a Bankai [${b.nome}] na sua alma?`);
        if (confirma) escolherCaminhoEspiritual(c);
      },
      className: "w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold text-xs uppercase rounded-lg shadow hover:brightness-110 transition"
    }, "\u534D Selar Esta Bankai"));
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 rounded-xl border border-yellow-500/30 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-lg text-yellow-400"
  }, "Bankai (Libera\xE7\xE3o Total)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim"
  }, podeGerarBankai ? "🔓 Permissão concedida pelo ADM! Clique para realizar o despertar." : "🔒 Bankai selada. Aguarde autorização da Administração.")), podeGerarBankai && /*#__PURE__*/React.createElement("button", {
    onClick: () => abrirFluxoDespertar("bankai"),
    className: "px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold text-xs uppercase rounded-xl shadow"
  }, "\u534D Despertar Bankai"))) : personagem.opcoesShikaiPendentes && personagem.opcoesShikaiPendentes.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 p-5 sm:p-6 bg-gradient-to-b from-orange-950/70 via-black to-bleach-panel rounded-2xl border-2 border-bleach-orange/80 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-bleach-orange/30 pb-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-orange-950 text-bleach-orange border border-bleach-orange"
  }, "\u2694\uFE0F 4 MANIFESTA\xC7\xD5ES DE SHIKAI FORJADAS & SALVAS"), /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl sm:text-2xl text-bleach-orange mt-1"
  }, "Escolha a Manifesta\xE7\xE3o da sua Shikai"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim"
  }, "As 4 op\xE7\xF5es geradas pela IA est\xE3o permanentemente salvas na sua alma. Analise os caminhos e sele a sua Shikai aut\xEAntica.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => abrirFluxoDespertar("shikai"),
    className: "px-4 py-2 bg-bleach-orange hover:bg-orange-500 text-black font-extrabold text-xs uppercase rounded-xl shadow whitespace-nowrap"
  }, "\uD83D\uDD0D Abrir Vis\xE3o em Modal Completo")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-3 pt-2"
  }, personagem.opcoesShikaiPendentes.map((c, idx) => {
    const s = c.shikai || c;
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "p-4 rounded-xl bg-black/80 border border-bleach-orange/40 hover:border-bleach-orange flex flex-col justify-between space-y-3 transition"
    }, /*#__PURE__*/React.createElement("div", {
      className: "space-y-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-950 text-bleach-orange border border-orange-500/50"
    }, "Op\xE7\xE3o ", idx + 1, " \u2022 ", s.elemento || "Elemento Espiritual")), /*#__PURE__*/React.createElement("h5", {
      className: "font-title text-lg text-white leading-tight"
    }, s.nome, " ", s.traducao && /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-normal text-bleach-creamDim"
    }, "(", s.traducao, ")")), /*#__PURE__*/React.createElement("p", {
      className: "text-xs text-yellow-300 italic"
    }, "\"", s.comando, "\""), /*#__PURE__*/React.createElement("div", {
      className: "text-[11px] text-bleach-creamDim space-y-1"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "\u2694\uFE0F Forma:"), " ", s.formaArma || s.forma), /*#__PURE__*/React.createElement("div", {
      className: "line-clamp-2"
    }, /*#__PURE__*/React.createElement("strong", null, "\u26A1 Poder:"), " ", s.poder))), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        const confirma = confirm(`Tem certeza que deseja selar definitivamente a Shikai [${s.nome}] na sua alma?`);
        if (confirma) escolherCaminhoEspiritual(c);
      },
      className: "w-full py-2.5 bg-gradient-to-r from-bleach-orange to-red-600 text-black font-extrabold text-xs uppercase rounded-lg shadow hover:brightness-110 transition"
    }, "\u2728 Selar Esta Shikai Definitiva"));
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "p-8 text-center space-y-4 bg-black/60 rounded-2xl border border-bleach-border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-5xl"
  }, "\uD83D\uDDE1\uFE0F"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl text-white"
  }, "L\xC2MINA SELADA (ASAUCHI)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim max-w-md mx-auto leading-relaxed"
  }, "A sua Zanpakut\u014D aguarda a libera\xE7\xE3o pelo ADM e o registro da cena de despertar para revelar as 4 interpreta\xE7\xF5es aut\xEAnticas da sua alma."), podeGerarShikai ? /*#__PURE__*/React.createElement("button", {
    onClick: () => abrirFluxoDespertar("shikai"),
    className: "px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition animate-pulse"
  }, "\u2728 Iniciar Ritual de Despertar de Shikai (IA)") : /*#__PURE__*/React.createElement("span", {
    className: "inline-block px-4 py-2 rounded-lg bg-black text-xs font-mono text-bleach-muted border border-white/10"
  }, "\uD83D\uDD12 Aguardando libera\xE7\xE3o de Despertar pelo Administrador")))), subPaginaFicha === "atributos" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, (personagem.pontosDisponiveis || 0) > 0 && /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-r from-orange-950/60 via-bleach-panel to-orange-950/40 border-2 border-bleach-orange/60 rounded-xl p-5 shadow-2xl reiatsu-glow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-bleach-borderSoft"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-2xl text-bleach-orange flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u2728"), " PONTOS DISPON\xCDVEIS PARA DISTRIBUIR"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim"
  }, "Voc\xEA possui ", /*#__PURE__*/React.createElement("strong", {
    className: "text-bleach-orange"
  }, personagem.pontosDisponiveis), " pontos livres concedidos por treinos e sorteios.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-bold uppercase text-bleach-creamDim"
  }, "Distribuir por vez:"), /*#__PURE__*/React.createElement("div", {
    className: "flex bg-black/80 border border-bleach-border rounded-xl p-1 gap-1"
  }, [1, 5, 10].map(step => /*#__PURE__*/React.createElement("button", {
    key: step,
    type: "button",
    onClick: () => setPassoDistribuicao(step),
    className: `px-3 py-1 rounded-lg text-xs font-mono font-black transition ${passoDistribuicao === step ? "bg-bleach-orange text-black" : "text-bleach-creamDim hover:text-white"}`
  }, "\xB1", step, " pts"))), /*#__PURE__*/React.createElement("div", {
    className: "bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-creamDim"
  }, "Restam: "), /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-lg text-bleach-orange font-mono"
  }, restante)))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4"
  }, ATTRS.map(a => {
    const valAtual = Number(personagem.atributos?.[a.key] || 10);
    const decStep = Math.min(passoDistribuicao, pend[a.key]);
    const incStep = Math.min(passoDistribuicao, restante);
    return /*#__PURE__*/React.createElement("div", {
      key: a.key,
      className: "bg-black/50 border border-bleach-border rounded-xl p-3 flex items-center justify-between"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold uppercase tracking-wider block",
      style: {
        color: a.color
      }
    }, a.label), /*#__PURE__*/React.createElement("span", {
      className: "text-[11px] text-bleach-muted"
    }, "Atual: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-white"
    }, valAtual), pend[a.key] > 0 && /*#__PURE__*/React.createElement("span", {
      className: "text-bleach-orange font-mono ml-1 font-bold"
    }, "\u2192 ", valAtual + pend[a.key]))), /*#__PURE__*/React.createElement("div", {
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
      className: "px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 hover:border-bleach-orange"
    }, "\u2212", passoDistribuicao > 1 ? passoDistribuicao : ""), /*#__PURE__*/React.createElement("span", {
      className: "min-w-[36px] text-center font-mono font-black text-bleach-orange text-base"
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
      className: "px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 hover:border-bleach-orange"
    }, "+", passoDistribuicao > 1 ? passoDistribuicao : "")));
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: confirmarDistribuicao,
    disabled: pendSum === 0,
    className: "px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 disabled:opacity-40"
  }, "Confirmar Distribui\xE7\xE3o (", pendSum, " pts)"))), /*#__PURE__*/React.createElement(Section, {
    title: "Atributos Espirituais",
    subtitle: "O valor puro do seu poder na Sociedade das Almas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, ATTRS.map(a => {
    const val = Number(personagem.atributos?.[a.key] || 10);
    return /*#__PURE__*/React.createElement("div", {
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
    }, val)), /*#__PURE__*/React.createElement("div", {
      className: "w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "h-full rounded-full transition-all duration-500",
      style: {
        width: `${Math.min(100, val / 200 * 100)}%`,
        backgroundColor: a.color
      }
    })));
  })))), subPaginaFicha === "kidos" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
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
    className: "text-red-400 hover:text-red-300 font-bold ml-1"
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
    placeholder: "Nome da t\xE9cnica...",
    value: novaTecNome,
    onChange: e => setNovaTecNome(e.target.value),
    className: "flex-1 min-w-[180px] bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addTecnica,
    className: "px-4 py-2 bg-bleach-panel border border-bleach-border text-bleach-cream hover:border-bleach-orange rounded-lg text-xs font-bold uppercase"
  }, "+ Adicionar")))), subPaginaFicha === "sorteios" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
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
  }, "Sorteia recursos e pontos de atributo graduais.")), /*#__PURE__*/React.createElement("button", {
    onClick: girarGachaComum,
    disabled: (personagem.sorteiosComunsRestantes || 0) <= 0,
    className: "w-full py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
  }, (personagem.sorteiosComunsRestantes || 0) > 0 ? "✨ Realizar Sorteio Comum" : "Sem Giros Comuns")), /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel2 border-2 border-purple-500/40 purple-reiatsu-glow rounded-xl p-4 flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-xl tracking-wider text-purple-400 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF1F"), " Sorteio de Classe Especial"), /*#__PURE__*/React.createElement("span", {
    className: "px-2.5 py-0.5 rounded-full bg-black text-purple-300 font-mono font-bold text-xs border border-purple-500/40"
  }, personagem.sorteiosEspeciaisRestantes || 0, " especiais")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mb-3"
  }, "Pr\xEAmios de alto prest\xEDgio e itens sagrados.")), /*#__PURE__*/React.createElement("button", {
    onClick: girarSorteioEspecial,
    disabled: (personagem.sorteiosEspeciaisRestantes || 0) <= 0,
    className: "w-full py-2.5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
  }, (personagem.sorteiosEspeciaisRestantes || 0) > 0 ? "⚡ Girar Sorteio Especial" : "Sem Giros Especiais"))))), subPaginaFicha === "historico" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "Hist\xF3rico de Registros",
    subtitle: "Linha do tempo oficial de treinos, miss\xF5es e conquistas"
  }, (personagem.historico || []).length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Nenhum registro ainda.") : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, personagem.historico.slice(0, 25).map(h => /*#__PURE__*/React.createElement("div", {
    key: h.id,
    className: "border-l-2 border-bleach-orange pl-3 py-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-bleach-muted font-mono"
  }, h.data), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-bleach-creamDim mt-0.5"
  }, h.texto)))))), isAdmin && /*#__PURE__*/React.createElement(Section, {
    title: "Painel de Gest\xE3o da Ficha (ADM)",
    subtitle: "Atribui\xE7\xE3o direta de treinos, distribui\xE7\xE3o de atributos, giros r\xE1pidos e reset"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-gradient-to-r from-black via-bleach-panel2 to-black border-2 border-yellow-500/50 rounded-2xl space-y-3 shadow-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 border-b border-yellow-500/30 pb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "\u2728"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-base text-yellow-400"
  }, "DISTRIBUIDOR OFICIAL DE RECOMPENSAS & ATRIBUTOS"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, "Conceda pontos diretamente em um atributo espec\xEDfico ou para o saldo livre do jogador"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1 uppercase"
  }, "Tipo de Atividade / Recompensa"), /*#__PURE__*/React.createElement("select", {
    value: rec.tipo,
    onChange: e => setRec({
      ...rec,
      tipo: e.target.value
    }),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-white"
  }, TIPOS_RECOMPENSA.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1 uppercase"
  }, "Destino da Recompensa"), /*#__PURE__*/React.createElement("select", {
    value: rec.atributo,
    onChange: e => setRec({
      ...rec,
      atributo: e.target.value
    }),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "\u2728 Pontos Livres (Distribui\xE7\xE3o do Jogador)"), /*#__PURE__*/React.createElement("option", {
    value: "pressao"
  }, "\uD83C\uDF00 Press\xE3o Espiritual (Reiatsu)"), /*#__PURE__*/React.createElement("option", {
    value: "forca"
  }, "\u2694\uFE0F For\xE7a (Zanjutsu & Dano)"), /*#__PURE__*/React.createElement("option", {
    value: "velocidade"
  }, "\u26A1 Velocidade (Shunpo & Hoh\u014D)"), /*#__PURE__*/React.createElement("option", {
    value: "resiliencia"
  }, "\uD83D\uDEE1\uFE0F Resili\xEAncia (Vitalidade & Defesa)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1 uppercase"
  }, "Quantidade de Pontos"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1.5"
  }, /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: rec.pontos,
    onChange: e => setRec({
      ...rec,
      pontos: e.target.value
    }),
    className: "w-20 bg-black border border-bleach-border rounded-lg p-2 text-white font-mono font-bold"
  }), [1, 2, 5, 10, 15].map(pts => /*#__PURE__*/React.createElement("button", {
    key: pts,
    type: "button",
    onClick: () => setRec({
      ...rec,
      pontos: pts
    }),
    className: "px-2 py-1 bg-bleach-panel border border-bleach-border hover:border-yellow-400 text-bleach-creamDim hover:text-white rounded text-xs font-mono"
  }, "+", pts))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1 uppercase text-xs"
  }, "Motivo / Justificativa (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Treino em Karakura com 35 linhas de boa qualidade / Miss\xE3o no Hueco Mundo",
    value: rec.motivo,
    onChange: e => setRec({
      ...rec,
      motivo: e.target.value
    }),
    className: "w-full bg-black border border-bleach-border rounded-lg p-2 text-xs text-white"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end pt-1"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: concederRecompensa,
    className: "px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
  }, "\u2713 Conceder Recompensa ao Personagem"))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-black/60 border border-bleach-borderSoft rounded-xl flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-bleach-orange uppercase block"
  }, "Giros R\xE1pidos:"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, "Adicione giros comuns ou especiais diretamente na ficha do jogador")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => updateChar({
      sorteiosComunsRestantes: (personagem.sorteiosComunsRestantes || 0) + 1
    }, "+1 Giro de Sorteio Comum adicionado pelo ADM"),
    className: "px-3 py-1.5 bg-orange-950 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-lg hover:bg-orange-900"
  }, "\uD83C\uDFB2 +1 Giro Comum"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateChar({
      sorteiosComunsRestantes: (personagem.sorteiosComunsRestantes || 0) + 3
    }, "+3 Giros de Sorteio Comum adicionados pelo ADM"),
    className: "px-3 py-1.5 bg-orange-950 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-lg hover:bg-orange-900"
  }, "\uD83C\uDFB2 +3 Giros Comuns"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateChar({
      sorteiosEspeciaisRestantes: (personagem.sorteiosEspeciaisRestantes || 0) + 1
    }, "+1 Giro de Sorteio Especial adicionado pelo ADM"),
    className: "px-3 py-1.5 bg-purple-950 border border-purple-400 text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-900"
  }, "\uD83C\uDF1F +1 Giro Especial"), /*#__PURE__*/React.createElement("button", {
    onClick: () => updateChar({
      sorteiosEspeciaisRestantes: (personagem.sorteiosEspeciaisRestantes || 0) + 2
    }, "+2 Giros de Sorteio Especial adicionados pelo ADM"),
    className: "px-3 py-1.5 bg-purple-950 border border-purple-400 text-purple-300 text-xs font-bold rounded-lg hover:bg-purple-900"
  }, "\uD83C\uDF1F +2 Giros Especiais"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: togglePermissaoShikai,
    className: `px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${personagem?.permissoes?.shikaiLiberada ? "bg-red-950 border-red-500 text-red-300" : "bg-blue-950 border-cyan-400 text-cyan-300"}`
  }, personagem?.permissoes?.shikaiLiberada ? "🔒 Revogar Permissão de Shikai" : "🔓 Liberar Despertar de Shikai"), /*#__PURE__*/React.createElement("button", {
    onClick: togglePermissaoBankai,
    className: `px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${personagem?.permissoes?.bankaiLiberada ? "bg-red-950 border-red-500 text-red-300" : "bg-amber-950 border-amber-400 text-yellow-300"}`
  }, personagem?.permissoes?.bankaiLiberada ? "🔒 Revogar Permissão de Bankai" : "🔓 Liberar Despertar de Bankai")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowResetModal(true),
    className: "px-4 py-2 bg-red-950 border-2 border-red-500 hover:bg-red-900 text-red-200 font-extrabold text-xs uppercase rounded-lg shadow transition"
  }, "\u26A0\uFE0F Resetar Ficha para o In\xEDcio")))), gachaModal && /*#__PURE__*/React.createElement(SpiritualChestModal, {
    modal: gachaModal,
    onClose: () => setGachaModal(null),
    onColetar: confirmarColetaDrop
  }), showCenaModal && /*#__PURE__*/React.createElement(CenaDespertarModal, {
    tipo: showCenaModal,
    onClose: () => setShowCenaModal(null),
    onSubmit: submeterCenaDespertar
  }), showZanpakutoAIModal && /*#__PURE__*/React.createElement(Zanpakuto4PathsModal, {
    open: showZanpakutoAIModal,
    tipo: aiZkTipo,
    isBankai: aiZkTipo === "bankai",
    loading: aiZkLoading,
    caminhos: aiZkOpcoes,
    personagem: personagem,
    onEscolherCaminho: escolherCaminhoEspiritual,
    onClose: () => {
      setShowZanpakutoAIModal(false);
      setAiZkLoading(false);
    }
  }), showResetModal && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-bleach-panel border-2 border-red-500 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-4xl"
  }, "\u26A0\uFE0F"), /*#__PURE__*/React.createElement("h3", {
    className: "font-title text-2xl text-red-400"
  }, "RESET TOTAL DE FICHA"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim leading-relaxed"
  }, "Tem certeza que quer resetar integralmente a ficha de ", /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, personagem.nome), " para o estado inicial?"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-left p-3 bg-black/60 rounded-xl border border-red-500/30 text-bleach-muted space-y-1"
  }, /*#__PURE__*/React.createElement("div", null, "\u2022 Atributos retornam para o padr\xE3o (10 em cada)."), /*#__PURE__*/React.createElement("div", null, "\u2022 Saldo de pontos livres retorna para 20."), /*#__PURE__*/React.createElement("div", null, "\u2022 Giros comuns voltam para 2, especiais para 0."), /*#__PURE__*/React.createElement("div", null, "\u2022 ", /*#__PURE__*/React.createElement("strong", null, "Shikai e Bankai ser\xE3o completamente apagadas"), " e desvinculadas do registro global."), /*#__PURE__*/React.createElement("div", null, "\u2022 Trava de personalidade e hist\xF3rico ser\xE3o redefinidos.")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowResetModal(false),
    className: "flex-1 py-2.5 bg-bleach-panel2 border border-bleach-border text-xs text-white rounded-lg"
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    onClick: confirmarResetFicha,
    className: "flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase rounded-lg shadow"
  }, "Sim, Resetar Ficha")))));
}

// =========================================================================
// VIEWS PART 3: ADMIN PANEL, FULL OFFICIAL SISTEMAS VIEW & LOL-STYLE PATCH NOTES
// =========================================================================

// TAB: PAINEL DE CONTROLE DA ADMINISTRAÇÃO
function AdminPanel({
  db,
  saveDb,
  session,
  cloudStatus,
  setCloudStatus,
  activeCloudUrl,
  setActiveCloudUrl,
  onAbrirFicha
}) {
  const isSuper = session?.role === "super_admin";
  const [tabAdm, setTabAdm] = useState("fichas");
  const [novoSubUser, setNovoSubUser] = useState("");
  const [novoSubPass, setNovoSubPass] = useState("");
  const [novoSubNome, setNovoSubNome] = useState("");
  const [novoSubCargo, setNovoSubCargo] = useState("Avaliador de Cenas & Fichas");

  // OpenAI ChatGPT Key State
  const [openAiKey, setOpenAiKey] = useState(() => typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") || "" : "");
  const [keyStatusMsg, setKeyStatusMsg] = useState("");

  // Firebase Realtime Database State
  const [urlNuvemInput, setUrlNuvemInput] = useState(() => activeCloudUrl || db?.firebaseUrl || (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_firebase_url") || "" : "https://bleach-rpg-6894c-default-rtdb.firebaseio.com/"));
  const [msgNuvem, setMsgNuvem] = useState("");
  const [loadingNuvem, setLoadingNuvem] = useState(false);

  // Dados para Novo Personagem
  const [novoNome, setNovoNome] = useState("");
  const [novoWhats, setNovoWhats] = useState("");
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novoRaca, setNovoRaca] = useState("Shinigami");
  const [novoEsquadrao, setNovoEsquadrao] = useState("11º Esquadrão");

  // Dados de Rolagem de Dados
  const [dadoTipo, setDadoTipo] = useState("d6");
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
      personalidade: {
        texto: "",
        virtudes: "",
        defeitos: "",
        desejos: "",
        medos: "",
        conflitos: "",
        estiloCombate: ""
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
        bankaiPadrao: null,
        shikaiEscolhida: false,
        bankaiEscolhida: false,
        notas: ""
      },
      estado: "Inteiro",
      treinosHoje: 0,
      historico: [{
        id: uid(),
        data: nowStr(),
        texto: "Ficha criada e aprovada pela Administração."
      }]
    };
    saveDb({
      ...db,
      personagens: [...(db.personagens || []), novoP]
    });
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
    saveDb({
      ...db,
      personagens: novosP,
      zanpakutosVinculadas: novasZk
    });
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
    saveDb({
      ...db,
      subAdms: [...(db.subAdms || []), novoSub]
    });
    setNovoSubUser("");
    setNovoSubPass("");
    setNovoSubNome("");
    alert(`Sub-administrador ${novoSub.nome} adicionado com sucesso!`);
  }
  function removerSubAdm(subId) {
    if (!confirm("Deseja remover este avaliador?")) return;
    saveDb({
      ...db,
      subAdms: (db.subAdms || []).filter(s => s.id !== subId)
    });
  }
  function rolarDadoPublico() {
    const lados = dadoTipo === "d6" ? 6 : dadoTipo === "d20" ? 20 : 100;
    const res = Math.floor(Math.random() * lados) + 1;
    let cat = "Sucesso";
    if (dadoTipo === "d6") {
      cat = res <= 2 ? "Falha (1–2)" : res <= 4 ? "Sucesso Parcial (3–4)" : "Sucesso Total (5–6)";
    } else if (dadoTipo === "d20") {
      if (res === 20) cat = "🌟 Crítico Absoluto (20)";else if (res >= 16) cat = "✨ Extremo Sucesso (+80%)";else if (res >= 10) cat = "✓ Sucesso Médio (+50%)";else if (res === 1) cat = "💀 Falha Crítica (1)";else cat = "✗ Falha";
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
    saveDb({
      ...db,
      rolagensDadosPublicas: [rollLog, ...(db.rolagensDadosPublicas || []).slice(0, 30)]
    });
    playReiatsuSound('roll');
  }
  async function salvarUrlFirebase() {
    const url = urlNuvemInput.trim();
    if (!url) {
      if (confirm("Deseja desconectar a nuvem e operar apenas em modo local?")) {
        try {
          localStorage.removeItem("bleach_firebase_url");
        } catch (e) {}
        if (setActiveCloudUrl) setActiveCloudUrl("");
        if (setCloudStatus) setCloudStatus("local");
        saveDb({
          ...db,
          firebaseUrl: ""
        });
        setMsgNuvem("✓ Desconectado da nuvem. Operando em modo local.");
        setTimeout(() => setMsgNuvem(""), 4000);
      }
      return;
    }
    setLoadingNuvem(true);
    try {
      const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
      const testRes = await fetch(endpoint + '?t=' + Date.now());
      if (testRes.ok) {
        try {
          localStorage.setItem("bleach_firebase_url", url);
        } catch (e) {}
        if (setActiveCloudUrl) setActiveCloudUrl(url);
        if (setCloudStatus) setCloudStatus("connected");
        saveDb({
          ...db,
          firebaseUrl: url
        });
        setMsgNuvem("✓ Conectado com sucesso ao Firebase Realtime Database!");
        playReiatsuSound('win');
      } else {
        setMsgNuvem("⚠️ Não foi possível comunicar com o Firebase (Status: " + testRes.status + "). Verifique as regras no Firebase Console.");
      }
    } catch (err) {
      setMsgNuvem("❌ Erro ao conectar ao Firebase: " + err.message);
    } finally {
      setLoadingNuvem(false);
      setTimeout(() => setMsgNuvem(""), 6000);
    }
  }
  async function forcarUploadNuvem() {
    const url = urlNuvemInput.trim() || activeCloudUrl || db?.firebaseUrl;
    if (!url) {
      alert("Insira a URL do Firebase primeiro!");
      return;
    }
    setLoadingNuvem(true);
    try {
      const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(db)
      });
      if (res.ok) {
        setMsgNuvem("✓ Todos os dados locais foram enviados com sucesso para o Firebase!");
        playReiatsuSound('win');
      } else {
        setMsgNuvem("⚠️ Falha no envio (Status: " + res.status + ").");
      }
    } catch (err) {
      setMsgNuvem("❌ Erro ao enviar: " + err.message);
    } finally {
      setLoadingNuvem(false);
      setTimeout(() => setMsgNuvem(""), 5000);
    }
  }
  async function puxarDadosNuvem() {
    const url = urlNuvemInput.trim() || activeCloudUrl || db?.firebaseUrl;
    if (!url) {
      alert("Insira a URL do Firebase primeiro!");
      return;
    }
    setLoadingNuvem(true);
    try {
      const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
      const res = await fetch(endpoint + '?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && Array.isArray(data.personagens)) {
          saveDb(data);
          setMsgNuvem("✓ Dados da nuvem sincronizados e aplicados com sucesso!");
          playReiatsuSound('win');
        } else {
          setMsgNuvem("⚠️ Nenhum dado encontrado na nuvem para este banco.");
        }
      } else {
        setMsgNuvem("⚠️ Falha ao baixar dados (Status: " + res.status + ").");
      }
    } catch (err) {
      setMsgNuvem("❌ Erro ao sincronizar: " + err.message);
    } finally {
      setLoadingNuvem(false);
      setTimeout(() => setMsgNuvem(""), 5000);
    }
  }
  function baixarBackupJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bleach_rpg_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playReiatsuSound('roll');
  }
  function importarBackupJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.personagens)) {
          saveDb(parsed);
          alert("✓ Backup restaurado com sucesso!");
          playReiatsuSound('win');
        } else {
          alert("⚠️ Arquivo JSON inválido para a estrutura do Bleach RPG.");
        }
      } catch (err) {
        alert("❌ Erro ao ler arquivo JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border-2 border-yellow-500/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-yellow-950 border border-yellow-400 text-yellow-300 text-xs font-bold rounded-full uppercase tracking-wider"
  }, "\uD83D\uDC51 Painel Central de Comando \u2022 ", isSuper ? "Comandante Supremo (ADM Máximo)" : "Avaliador Autorizado"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-3xl sm:text-4xl tracking-widest text-yellow-400 mt-2"
  }, "GERENCIADOR DE FICHAS & NARRATIVA"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim mt-1"
  }, "Crie, gerencie, recompense e fiscalize todas as fichas e combates do RPG.")), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, ["fichas", "novo", "subadms", "dados", "nuvem", "ia"].map(t => /*#__PURE__*/React.createElement("button", {
    key: t,
    onClick: () => setTabAdm(t),
    className: `px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${tabAdm === t ? "bg-yellow-500 text-black font-extrabold shadow" : "bg-black/60 border border-yellow-500/30 text-yellow-200"}`
  }, t === "fichas" ? "Fichas" : t === "novo" ? "+ Criar" : t === "subadms" ? "Avaliadores" : t === "dados" ? "Dados" : t === "nuvem" ? "☁️ Firebase" : "🤖 IA & ChatGPT"))))), tabAdm === "fichas" && /*#__PURE__*/React.createElement(Section, {
    title: "Fichas de Shinigamis Registradas",
    subtitle: "Clique para abrir e gerenciar qualquer personagem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, (db.personagens || []).map(p => {
    const temShikai = !!p?.zanpakuto?.shikaiAtiva;
    const temBankai = !!p?.zanpakuto?.bankaiAtiva;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      className: "bg-bleach-panel2 border border-bleach-border rounded-xl p-4 flex flex-col justify-between space-y-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-start gap-3"
    }, /*#__PURE__*/React.createElement("img", {
      src: p.foto || 'assets/ichigo-orange.png',
      className: "w-12 h-12 rounded-lg object-cover border border-bleach-border"
    }), /*#__PURE__*/React.createElement("div", {
      className: "flex-1 min-w-0"
    }, /*#__PURE__*/React.createElement("h4", {
      className: "font-bold text-white text-sm truncate"
    }, p.nome), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] text-bleach-muted"
    }, "C\xF3digo: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-yellow-400 font-mono"
    }, p.codigo)), /*#__PURE__*/React.createElement("div", {
      className: "text-[10px] text-bleach-muted flex gap-2 mt-0.5"
    }, /*#__PURE__*/React.createElement("span", null, "PTS: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-bleach-orange"
    }, p.pontosDisponiveis || 0)), /*#__PURE__*/React.createElement("span", null, "COM: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-white"
    }, p.sorteiosComunsRestantes || 0)), /*#__PURE__*/React.createElement("span", null, "ESP: ", /*#__PURE__*/React.createElement("strong", {
      className: "text-purple-300"
    }, p.sorteiosEspeciaisRestantes || 0))))), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-wrap gap-1 text-[10px]"
    }, temShikai ? /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 bg-blue-950 text-cyan-300 rounded border border-cyan-500"
    }, "\uD83D\uDDE1\uFE0F ", p.zanpakuto.shikaiAtiva.nome) : /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 bg-black text-bleach-muted rounded"
    }, "L\xE2mina Selada"), temBankai && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 bg-amber-950 text-yellow-300 rounded border border-amber-500"
    }, "\u534D Bankai"), p.personalidadeTravada && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 bg-green-950 text-green-300 rounded"
    }, "\uD83D\uDD12 DNA Selado")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 pt-2 border-t border-white/5"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => onAbrirFicha(p.id),
      className: "flex-1 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-lg shadow"
    }, "\u270F\uFE0F Gerenciar Ficha"), /*#__PURE__*/React.createElement("button", {
      onClick: () => apagarPersonagem(p.id, p.nome),
      className: "px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-lg",
      title: "Excluir Ficha"
    }, "\uD83D\uDDD1\uFE0F")));
  }))), tabAdm === "novo" && /*#__PURE__*/React.createElement(Section, {
    title: "Cadastrar Nova Ficha de Shinigami",
    subtitle: "Preencha os dados iniciais para gerar a ficha e c\xF3digo de acesso"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: criarPersonagem,
    className: "space-y-4 max-w-xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1"
  }, "Nome do Personagem *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Zaraki Kenji",
    value: novoNome,
    onChange: e => setNovoNome(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1"
  }, "C\xF3digo de Acesso (Senha) *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: ZAR-9901",
    value: novoCodigo,
    onChange: e => setNovoCodigo(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1"
  }, "WhatsApp (Opcional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: 11988887777",
    value: novoWhats,
    onChange: e => setNovoWhats(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-bleach-creamDim font-bold mb-1"
  }, "Esquadr\xE3o"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: novoEsquadrao,
    onChange: e => setNovoEsquadrao(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-white"
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg"
  }, "\u2728 Criar Ficha com 20 Pts Iniciais & 2 Giros"))), tabAdm === "subadms" && isSuper && /*#__PURE__*/React.createElement(Section, {
    title: "Gerenciador de Avaliadores & Sub-Administradores",
    subtitle: "Cadastre avaliadores com senhas individuais"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: adicionarSubAdm,
    className: "p-4 bg-black/60 rounded-xl border border-yellow-500/40 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs mb-6"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-yellow-300 font-bold mb-1"
  }, "Nome do Avaliador"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: Mestre Kisuke",
    value: novoSubNome,
    onChange: e => setNovoSubNome(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-yellow-300 font-bold mb-1"
  }, "Usu\xE1rio"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Ex: kisuke",
    value: novoSubUser,
    onChange: e => setNovoSubUser(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "block text-yellow-300 font-bold mb-1"
  }, "Senha"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
    value: novoSubPass,
    onChange: e => setNovoSubPass(e.target.value),
    className: "w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded shadow"
  }, "+ Adicionar"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, (db.subAdms || []).map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: "p-3 bg-bleach-panel2 border border-bleach-border rounded-lg flex justify-between items-center text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "text-white block"
  }, s.nome), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-bleach-muted"
  }, "Usu\xE1rio: ", /*#__PURE__*/React.createElement("code", {
    className: "text-yellow-400"
  }, s.usuario), " | Cargo: ", s.cargo)), /*#__PURE__*/React.createElement("button", {
    onClick: () => removerSubAdm(s.id),
    className: "text-red-400 hover:text-red-300 font-bold"
  }, "Remover"))))), tabAdm === "dados" && /*#__PURE__*/React.createElement(Section, {
    title: "Mesa de Rolagem de Dados de Alta Tens\xE3o",
    subtitle: "Rolagens p\xFAblicas de 1d6, d20 e d100 para julgamento de cenas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-black/60 rounded-xl border border-bleach-border flex flex-wrap gap-3 items-center mb-6"
  }, /*#__PURE__*/React.createElement("select", {
    value: dadoTipo,
    onChange: e => setDadoTipo(e.target.value),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "d6"
  }, "\uD83C\uDFB2 Dado 1d6 (Regra Oficial de Combate)"), /*#__PURE__*/React.createElement("option", {
    value: "d20"
  }, "\uD83C\uDFB2 Dado d20 (Testes Cr\xEDticos)"), /*#__PURE__*/React.createElement("option", {
    value: "d100"
  }, "\uD83C\uDFB2 Dado d100 (Porcentagens)")), /*#__PURE__*/React.createElement("select", {
    value: dadoChar,
    onChange: e => setDadoChar(e.target.value),
    className: "bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white"
  }, /*#__PURE__*/React.createElement("option", {
    value: "Geral"
  }, "Personagem: Geral"), (db.personagens || []).map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.nome
  }, p.nome))), /*#__PURE__*/React.createElement("button", {
    onClick: rolarDadoPublico,
    className: "px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-red-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:brightness-110"
  }, "\uD83C\uDFB2 Rolar Dado em P\xFAblico")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 max-h-60 overflow-y-auto pr-1"
  }, (db.rolagensDadosPublicas || []).map(d => /*#__PURE__*/React.createElement("div", {
    key: d.id,
    className: "p-3 bg-bleach-panel2 border border-bleach-border rounded-lg flex justify-between items-center text-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-white"
  }, d.personagem), /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-muted ml-2 font-mono"
  }, "(", d.dado, ") \u2014 Por ", d.autor)), /*#__PURE__*/React.createElement("div", {
    className: "text-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-base font-black text-bleach-orange mr-2"
  }, d.resultado), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-yellow-300 font-bold"
  }, d.categoria)))))), tabAdm === "nuvem" && /*#__PURE__*/React.createElement(Section, {
    title: "Sincroniza\xE7\xE3o em Nuvem \u2014 Firebase Realtime Database",
    subtitle: "Configura\xE7\xE3o de persist\xEAncia global e sincroniza\xE7\xE3o instant\xE2nea de fichas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 bg-black/60 border-2 border-yellow-500/50 rounded-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-yellow-950 border border-yellow-500 flex items-center justify-center text-xl"
  }, "\u2601\uFE0F"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-white text-base"
  }, "Banco de Dados Firebase em Tempo Real"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Permite que todos os jogadores e mestres vejam altera\xE7\xF5es em tempo real"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: `text-[11px] font-bold px-3 py-1 rounded-full border ${cloudStatus === "connected" ? "bg-green-950/80 border-green-500 text-green-300" : cloudStatus === "error" ? "bg-red-950/80 border-red-500 text-red-300" : cloudStatus === "syncing" ? "bg-yellow-950/80 border-yellow-500 text-yellow-300" : "bg-blue-950/80 border-blue-500 text-blue-300"}`
  }, cloudStatus === "connected" ? "🟢 Conectado em Tempo Real" : cloudStatus === "error" ? "🔴 Erro de Conexão" : cloudStatus === "syncing" ? "🟡 Sincronizando..." : "⚪ Modo Local (Offline)"))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-yellow-300 uppercase"
  }, "URL do Firebase Realtime Database:"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "https://seu-projeto-default-rtdb.firebaseio.com/",
    value: urlNuvemInput,
    onChange: e => setUrlNuvemInput(e.target.value),
    className: "flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: loadingNuvem,
    onClick: salvarUrlFirebase,
    className: "px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow disabled:opacity-50"
  }, loadingNuvem ? "Conectando..." : "Salvar & Conectar")), msgNuvem && /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold mt-1 text-yellow-400"
  }, msgNuvem)), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: loadingNuvem,
    onClick: forcarUploadNuvem,
    className: "p-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u2B06\uFE0F"), " For\xE7ar Upload para Nuvem (Salvar Tudo)"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: loadingNuvem,
    onClick: puxarDadosNuvem,
    className: "p-3 bg-bleach-panel2 hover:bg-white/10 border border-yellow-500/40 text-yellow-300 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\u2B07\uFE0F"), " Puxar Dados da Nuvem (Atualizar Fichas)"))), /*#__PURE__*/React.createElement("div", {
    className: "p-5 bg-bleach-panel2 border border-bleach-border rounded-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-xl bg-black border border-bleach-border flex items-center justify-center text-lg"
  }, "\uD83D\uDCBE"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-white text-sm"
  }, "Backup Local & Restaura\xE7\xE3o de Seguran\xE7a (JSON)"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Exporte ou restaure todo o estado do RPG a qualquer momento em arquivo"))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: baixarBackupJson,
    className: "px-5 py-2.5 bg-black/80 hover:bg-black border border-bleach-orange text-bleach-orange font-bold text-xs rounded-xl transition flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCE6"), " Baixar Arquivo de Backup (JSON)"), /*#__PURE__*/React.createElement("label", {
    className: "px-5 py-2.5 bg-bleach-panel hover:bg-white/10 border border-bleach-border text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCC2"), " Restaurar Backup de Arquivo JSON", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".json",
    onChange: importarBackupJson,
    className: "hidden"
  })))))), tabAdm === "ia" && /*#__PURE__*/React.createElement(Section, {
    title: "Motor de Intelig\xEAncia Artificial \u2014 Google Gemini, ChatGPT & Motor Cognitivo",
    subtitle: "Conecte a API gratuita do Google Gemini, OpenAI ou utilize o Motor Cognitivo autoral"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-5 bg-black/60 border-2 border-yellow-500/50 rounded-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-yellow-950 border border-yellow-500 flex items-center justify-center text-xl"
  }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-white text-base"
  }, "Gera\xE7\xE3o de Zanpakut\u014D com Intelig\xEAncia Artificial"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-muted"
  }, "Compat\xEDvel com Google Gemini (Gratuito), OpenAI ChatGPT e Motor Cognitivo Local"))), /*#__PURE__*/React.createElement("span", {
    className: `text-[11px] font-bold px-3 py-1 rounded-full border ${openAiKey && (openAiKey.startsWith("AIza") || openAiKey.startsWith("aiza")) ? "bg-green-950/80 border-green-500 text-green-300" : openAiKey && openAiKey.startsWith("sk-") ? "bg-green-950/80 border-green-500 text-green-300" : "bg-blue-950/80 border-cyan-500 text-cyan-300"}`
  }, openAiKey && (openAiKey.startsWith("AIza") || openAiKey.startsWith("aiza")) ? "🟢 Google Gemini 2.0 Flash Online (Google AI)" : openAiKey && openAiKey.startsWith("sk-") ? "🟢 OpenAI ChatGPT Online (GPT-4o-mini)" : "🔵 Motor Cognitivo ZGE v5.0 Nativo Ativo")), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim leading-relaxed"
  }, "O sistema analisa automaticamente os ", /*#__PURE__*/React.createElement("strong", null, "atributos"), " (dominante e deficiente), ", /*#__PURE__*/React.createElement("strong", null, "personalidade selada"), " (virtudes, defeitos, desejos, medos, conflitos e estilo de combate) e a ", /*#__PURE__*/React.createElement("strong", null, "cena de despertar narrada"), "."), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs font-bold text-yellow-300 uppercase"
  }, "Chave de API (Google Gemini ou OpenAI):"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Chave Google Gemini (AIzaSy...) ou OpenAI (sk-...)",
    value: openAiKey,
    onChange: e => setOpenAiKey(e.target.value),
    className: "flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      try {
        localStorage.setItem("bleach_openai_key", openAiKey.trim());
        setKeyStatusMsg("✓ Chave de API salva com sucesso!");
        setTimeout(() => setKeyStatusMsg(""), 4000);
      } catch (e) {}
    },
    className: "px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow"
  }, "Salvar Chave"), openAiKey && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      try {
        localStorage.removeItem("bleach_openai_key");
        setOpenAiKey("");
        setKeyStatusMsg("✓ Chave removida. Usando Motor Cognitivo Nativo.");
        setTimeout(() => setKeyStatusMsg(""), 4000);
      } catch (e) {}
    },
    className: "px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-xl transition"
  }, "Remover")), keyStatusMsg && /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-green-400 font-bold mt-1"
  }, keyStatusMsg))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-bleach-orange font-bold"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD25"), " Op\xE7\xE3o 1: Elemental / Temperamento (~45% Peso)"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim leading-relaxed"
  }, "Manifesta\xE7\xE3o da emo\xE7\xE3o central e virtudes da alma. Escala com o ", /*#__PURE__*/React.createElement("strong", null, "Atributo Dominante"), " do personagem (Press\xE3o, For\xE7a, Velocidade ou Resili\xEAncia).")), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-cyan-400 font-bold"
  }, /*#__PURE__*/React.createElement("span", null, "\u2696\uFE0F"), " Op\xE7\xE3o 2: Conceitual / Regras / Progressivo (~20% Peso)"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim leading-relaxed"
  }, "Mec\xE2nica t\xE1tica por etapas e imposi\xE7\xE3o de leis inviol\xE1veis no campo de batalha, refletindo a disciplina e o racioc\xEDnio t\xE1tico.")), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-green-400 font-bold"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDEE1\uFE0F"), " Op\xE7\xE3o 3: Compensat\xF3rio / Defesa da Alma"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim leading-relaxed"
  }, "Compensa o ", /*#__PURE__*/React.createElement("strong", null, "Atributo Deficiente"), " e ergue uma muralha protetora contra o ", /*#__PURE__*/React.createElement("strong", null, "maior medo"), " do Shinigami.")), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 text-purple-400 font-bold"
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF11"), " Op\xE7\xE3o 4: Opositivo / Abstrato / Sombra"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim leading-relaxed"
  }, "Explora a dualidade, conflitos internos e o paradoxo oculto do subconsciente, invertendo regras e percep\xE7\xF5es de combate."))))));
}

// FULL OFFICIAL SISTEMAS & REGRAS VIEW (100% CANONICAL BLEACH RPG BASE SYSTEM)
function SistemasView() {
  const [tabSis, setTabSis] = useState("conceito");
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-3xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Regulamento Oficial da Sociedade das Almas \u2022 Vers\xE3o 5.0"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-cream mt-3 reiatsu-text-glow"
  }, "BLEACH RPG \u2014 SISTEMA BASE"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "O RPG \xE9 focado principalmente em Narrativa, Desenvolvimento de personagem, Combate, Power scaling e Evolu\xE7\xE3o gradual. Evita excesso de rolagens \u2014 dados s\xF3 aparecem quando existe d\xFAvida real!"))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 overflow-x-auto border-b border-bleach-borderSoft pb-2"
  }, [{
    id: "conceito",
    label: "1–4. Conceito, Raças & Kidō Inicial",
    icon: "⚔️"
  }, {
    id: "atributos",
    label: "5–9. Atributos & Power Scaling",
    icon: "⚡"
  }, {
    id: "combate",
    label: "10–14. Combate, 1d6 & Estados",
    icon: "🩸"
  }, {
    id: "treinamento",
    label: "15–21. Treinos OFF & Fadiga",
    icon: "🏋️"
  }, {
    id: "missoes",
    label: "22–27. Missões, Miscelâneas & Drops",
    icon: "📜"
  }, {
    id: "filosofia",
    label: "28–30. Técnicas, Zanpakutō & Filosofia",
    icon: "🗡️"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setTabSis(t.id),
    className: `px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition whitespace-nowrap flex items-center gap-2 ${tabSis === t.id ? "bg-bleach-orange text-black font-extrabold shadow-lg" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"}`
  }, /*#__PURE__*/React.createElement("span", null, t.icon), /*#__PURE__*/React.createElement("span", null, t.label)))), tabSis === "conceito" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "1. Conceito do Sistema",
    subtitle: "A ess\xEAncia da interpreta\xE7\xE3o e resolu\xE7\xE3o de a\xE7\xF5es"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs text-bleach-creamDim leading-relaxed"
  }, /*#__PURE__*/React.createElement("p", null, "O RPG \xE9 focado principalmente em: ", /*#__PURE__*/React.createElement("strong", null, "Narrativa, Desenvolvimento de Personagem, Combate, Power Scaling e Evolu\xE7\xE3o Gradual"), "."), /*#__PURE__*/React.createElement("p", null, "O sistema deve evitar excesso de rolagens. ", /*#__PURE__*/React.createElement("strong", null, "Dados s\xF3 aparecem quando existe uma d\xFAvida real.")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-black/60 border border-bleach-orange/40 rounded-xl text-white font-mono text-center"
  }, "Resultado = Atributos + T\xE9cnicas + Experi\xEAncia + Circunst\xE2ncias + Narrativa"))), /*#__PURE__*/React.createElement(Section, {
    title: "2 & 3. Ra\xE7as Dispon\xEDveis & Diferen\xE7a de Origens",
    subtitle: "Shinigami da Sociedade das Almas vs Shinigami Ex-Humano"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-cyan-400 uppercase"
  }, "\u2694\uFE0F Shinigami (Nativo)"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim"
  }, "Personagem que j\xE1 pertence \xE0 Sociedade das Almas e possui forma\xE7\xE3o b\xE1sica como Shinigami na Academia Shin\u014D."), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc list-inside text-[11px] text-bleach-muted space-y-0.5"
  }, /*#__PURE__*/React.createElement("li", null, "Possui Zanpakut\u014D e forma\xE7\xE3o inicial"), /*#__PURE__*/React.createElement("li", null, "Come\xE7a com 4 Kid\u014Ds b\xE1sicos \xE0 escolha"), /*#__PURE__*/React.createElement("li", null, "Pode aprender Zanjutsu, Hakuda, Hoh\u014D e t\xE9cnicas"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-purple-400 uppercase"
  }, "\uD83D\uDC64 Shinigami Ex-Humano"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-creamDim"
  }, "Personagem que teve uma vida humana antes de se tornar Shinigami. A origem influencia personalidade, mem\xF3rias, rela\xE7\xF5es e motiva\xE7\xF5es."), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc list-inside text-[11px] text-bleach-muted space-y-0.5"
  }, /*#__PURE__*/React.createElement("li", null, "N\xE3o fornece b\xF4nus autom\xE1tico de atributos (origem narrativa)"), /*#__PURE__*/React.createElement("li", null, "Aprende Kid\u014D posteriormente atrav\xE9s de treino e hist\xF3ria"), /*#__PURE__*/React.createElement("li", null, "Evolu\xE7\xE3o, Zanpakut\u014D e atributos operam de forma id\xEAntica")))), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full text-xs text-left border border-bleach-border"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "bg-black text-bleach-orange font-bold uppercase text-[10px]"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "p-2.5 border-b border-bleach-border"
  }, "Caracter\xEDstica"), /*#__PURE__*/React.createElement("th", {
    className: "p-2.5 border-b border-bleach-border"
  }, "Shinigami"), /*#__PURE__*/React.createElement("th", {
    className: "p-2.5 border-b border-bleach-border"
  }, "Shinigami Ex-Humano"))), /*#__PURE__*/React.createElement("tbody", {
    className: "divide-y divide-white/5 text-bleach-creamDim"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "p-2 font-semibold text-white"
  }, "Origem"), /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, "Sociedade das Almas"), /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, "Mundo Humano")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "p-2 font-semibold text-white"
  }, "Vida humana anterior"), /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, "N\xE3o"), /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, "Sim")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "p-2 font-semibold text-white"
  }, "Atributos & Evolu\xE7\xE3o"), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-green-400 font-bold"
  }, "Iguais (10 + 20 livres)"), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-green-400 font-bold"
  }, "Iguais (10 + 20 livres)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "p-2 font-semibold text-white"
  }, "Zanpakut\u014D"), /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, "Sim"), /*#__PURE__*/React.createElement("td", {
    className: "p-2"
  }, "Sim")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    className: "p-2 font-semibold text-white"
  }, "Kid\u014D Inicial"), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-cyan-300"
  }, "4 Kid\u014Ds B\xE1sicos"), /*#__PURE__*/React.createElement("td", {
    className: "p-2 text-yellow-300"
  }, "Aprende na narrativa")))))), /*#__PURE__*/React.createElement(Section, {
    title: "4. Kid\u014D Inicial & Kaid\u014D",
    subtitle: "Distribui\xE7\xE3o dos feiti\xE7os iniciais e diretrizes de cura"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 text-xs text-bleach-creamDim leading-relaxed"
  }, /*#__PURE__*/React.createElement("p", null, "Um Shinigami nativo come\xE7a com ", /*#__PURE__*/React.createElement("strong", null, "4 Kid\u014D B\xE1sicos"), " distribu\xEDdos livremente entre ", /*#__PURE__*/React.createElement("strong", null, "Had\u014D (Ataque)"), ", ", /*#__PURE__*/React.createElement("strong", null, "Bakud\u014D (Defesa/Conten\xE7\xE3o)"), " e ", /*#__PURE__*/React.createElement("strong", null, "Kaid\u014D (Cura)"), "."), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 border-l-4 border-green-500 rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-green-400 block font-bold"
  }, "\uD83C\uDF3F Diretrizes de Kaid\u014D (Cura Espiritual):"), /*#__PURE__*/React.createElement("p", null, "Kaid\u014D representa t\xE9cnicas de tratamento e cura espiritual para tratar ferimentos, estabilizar aliados e aliviar danos. Por\xE9m, ", /*#__PURE__*/React.createElement("strong", null, "Kaid\u014D n\xE3o substitui descanso nem recupera\xE7\xE3o narrativa"), ". Ferimentos graves podem exigir repouso ou t\xE9cnicas m\xE9dicas avan\xE7adas."))))), tabSis === "atributos" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "5, 6 & 7. Atributos & Cria\xE7\xE3o Inicial",
    subtitle: "Regra fundamental: O n\xFAmero na ficha \xC9 o atributo"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4"
  }, ATTRS.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.key,
    className: "p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold uppercase tracking-wider text-xs",
    style: {
      color: a.color
    }
  }, a.label), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-creamDim leading-relaxed"
  }, a.desc)))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-black/70 border border-yellow-500/50 rounded-xl text-xs space-y-2 text-bleach-creamDim"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 block font-bold"
  }, "\u2728 Cria\xE7\xE3o & Regra Fundamental:"), /*#__PURE__*/React.createElement("p", null, "Todos os atributos come\xE7am em ", /*#__PURE__*/React.createElement("strong", null, "10"), " e o jogador recebe ", /*#__PURE__*/React.createElement("strong", null, "20 Pontos de Atributo"), " para distribuir livremente sem limite inicial."), /*#__PURE__*/React.createElement("p", {
    className: "text-white font-mono font-bold"
  }, "O n\xFAmero da ficha \xC9 o atributo. N\xE3o existe convers\xE3o, multiplicador, n\xEDvel escondido ou escala secund\xE1ria."))), /*#__PURE__*/React.createElement(Section, {
    title: "8 & 9. Escala Oficial de Power Scaling & Diferen\xE7as",
    subtitle: "Hierarquia e dist\xE2ncias relativas entre atributos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-sm text-bleach-orange uppercase"
  }, "Escala de Refer\xEAncia"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, [{
    faixa: "1–10",
    patamar: "Inexperiente",
    cor: C.muted
  }, {
    faixa: "11–30",
    patamar: "Iniciante",
    cor: C.green
  }, {
    faixa: "31–60",
    patamar: "Treinado",
    cor: C.blue
  }, {
    faixa: "61–100",
    patamar: "Experiente",
    cor: C.purple
  }, {
    faixa: "101–150",
    patamar: "Elite",
    cor: C.yellow
  }, {
    faixa: "151–250",
    patamar: "Alto Nível",
    cor: "#FFA500"
  }, {
    faixa: "251–400",
    patamar: "Monstruoso",
    cor: C.red
  }, {
    faixa: "401–600",
    patamar: "Lendário",
    cor: "#E0B34C"
  }, {
    faixa: "601+",
    patamar: "Transcendente",
    cor: "#FFD700"
  }].map(p => /*#__PURE__*/React.createElement("div", {
    key: p.patamar,
    className: "p-2 bg-bleach-panel2 border border-white/5 rounded-lg flex justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-bold text-white"
  }, p.faixa, " pts"), /*#__PURE__*/React.createElement("span", {
    className: "font-bold uppercase",
    style: {
      color: p.cor
    }
  }, p.patamar))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-sm text-cyan-400 uppercase"
  }, "Diferen\xE7a em Combate"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5"
  }, [{
    diff: "0–10 pts",
    desc: "Equivalentes"
  }, {
    diff: "11–30 pts",
    desc: "Pequena vantagem"
  }, {
    diff: "31–75 pts",
    desc: "Vantagem clara"
  }, {
    diff: "76–150 pts",
    desc: "Grande vantagem"
  }, {
    diff: "151–250 pts",
    desc: "Abismo"
  }, {
    diff: "251+ pts",
    desc: "Diferença monstruosa"
  }].map(d => /*#__PURE__*/React.createElement("div", {
    key: d.diff,
    className: "p-2 bg-bleach-panel2 border border-white/5 rounded-lg flex justify-between"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-mono text-bleach-muted"
  }, d.diff), /*#__PURE__*/React.createElement("strong", {
    className: "text-white"
  }, d.desc)))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted italic mt-2"
  }, "Quanto maior a diferen\xE7a, mais dif\xEDcil \xE9 superar a inferioridade atrav\xE9s de t\xE9cnica pura."))))), tabSis === "combate" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "10 & 11. Estrutura de Combate & O Dado 1d6",
    subtitle: "Processo de 3 etapas e resolu\xE7\xE3o simplificada"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-bleach-orange uppercase block text-[10px]"
  }, "1. Inten\xE7\xE3o"), /*#__PURE__*/React.createElement("p", null, "O jogador declara claramente o que pretende fazer em sua narra\xE7\xE3o.")), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-cyan-400 uppercase block text-[10px]"
  }, "2. Compara\xE7\xE3o"), /*#__PURE__*/React.createElement("p", null, "O narrador compara os atributos, t\xE9cnicas e contexto dos envolvidos.")), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-green-400 uppercase block text-[10px]"
  }, "3. Consequ\xEAncia"), /*#__PURE__*/React.createElement("p", null, "O narrador determina o desfecho sem rolagem obrigat\xF3ria."))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-black/60 border border-yellow-500/40 rounded-xl text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-yellow-300 uppercase"
  }, "\uD83C\uDFB2 Regra do Dado 1d6 (Apenas em D\xFAvida Real)"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2 text-center font-mono"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-red-950/60 border border-red-500/50 rounded-lg text-red-300"
  }, "1\u20132: Falha"), /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-yellow-950/60 border border-yellow-500/50 rounded-lg text-yellow-300"
  }, "3\u20134: Sucesso Parcial"), /*#__PURE__*/React.createElement("div", {
    className: "p-2 bg-green-950/60 border border-green-500/50 rounded-lg text-green-300"
  }, "5\u20136: Sucesso Total")))), /*#__PURE__*/React.createElement(Section, {
    title: "12 & 13. Estados de Combate & Press\xE3o Espiritual",
    subtitle: "Sem barra de HP tradicional"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-green-950/40 border border-green-500/40 rounded-xl"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-green-400 block font-bold"
  }, "\uD83D\uDFE2 Inteiro"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted"
  }, "Condi\xE7\xE3o normal")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-yellow-950/40 border border-yellow-500/40 rounded-xl"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 block font-bold"
  }, "\uD83D\uDFE1 Ferido"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted"
  }, "Danos afetam desempenho")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-orange-950/40 border border-orange-500/40 rounded-xl"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-orange-400 block font-bold"
  }, "\uD83D\uDFE0 Debilitado"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted"
  }, "Gravemente prejudicado")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-950/40 border border-red-500/40 rounded-xl"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-red-400 block font-bold"
  }, "\uD83D\uDD34 Derrotado"), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-bleach-muted"
  }, "Incapacitado de lutar"))))), tabSis === "treinamento" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "15\u201321. Treinamento em OFF, Ganhos & Sistema de Fadiga",
    subtitle: "M\xE1ximo de 3 treinos di\xE1rios e penalidades por desgaste"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs text-bleach-creamDim leading-relaxed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-white block uppercase text-[10px]"
  }, "1\xBA Per\xEDodo"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-muted"
  }, "Manh\xE3 (0\u20133 pts)")), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-white block uppercase text-[10px]"
  }, "2\xBA Per\xEDodo"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-muted"
  }, "Tarde (0\u20133 pts)")), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-white block uppercase text-[10px]"
  }, "3\xBA Per\xEDodo"), /*#__PURE__*/React.createElement("p", {
    className: "text-bleach-muted"
  }, "Noite (0\u20133 pts)"))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-red-950/40 border-2 border-red-500/50 rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-red-300 uppercase"
  }, "\u26A0\uFE0F Regras de Fadiga Tempor\xE1ria"), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc list-inside space-y-1 font-mono text-[11px] text-white"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "1 Treino:"), " Nenhuma redu\xE7\xE3o obrigat\xF3ria."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "2 Treinos:"), " \u22125% tempor\xE1rio nos atributos treinados."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "3 Treinos:"), " \u221215% tempor\xE1rio nos atributos treinados + ", /*#__PURE__*/React.createElement("strong", null, "bloqueio de recompensas de Miscel\xE2nea"), " naquele dia."), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("strong", null, "Descanso:"), " Um novo dia remove 100% da fadiga acumulada sem perda de pontos permanentes da ficha.")))))), tabSis === "missoes" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "22\u201327. Recompensas de Cenas ON & Drops Extras",
    subtitle: "Tabela oficial de ganhos por tipo de cena"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-cyan-400 block uppercase font-bold"
  }, "Miss\xF5es (ON)"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, "Simples: 1\u20132 pts", /*#__PURE__*/React.createElement("br", null), "Normal: 2\u20134 pts", /*#__PURE__*/React.createElement("br", null), "Importante: 3\u20136 pts", /*#__PURE__*/React.createElement("br", null), "Excepcional: 5\u20138 pts")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-green-400 block uppercase font-bold"
  }, "Miscel\xE2neas (ON)"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, "Simples: 0\u20131 pt", /*#__PURE__*/React.createElement("br", null), "Relevante: 1\u20132 pts", /*#__PURE__*/React.createElement("br", null), "Excepcional: 2\u20133 pts")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-purple-400 block uppercase font-bold"
  }, "Cenas de Arco"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, "Comum: 1\u20133 pts", /*#__PURE__*/React.createElement("br", null), "Importante: 2\u20134 pts", /*#__PURE__*/React.createElement("br", null), "Decisiva: 4\u20136 pts")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-yellow-400 block uppercase font-bold"
  }, "Combates (ON)"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-bleach-muted"
  }, "Menor: 1\u20132 pts", /*#__PURE__*/React.createElement("br", null), "Relevante: 2\u20134 pts", /*#__PURE__*/React.createElement("br", null), "Importante: 3\u20136 pts"))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-black/60 border border-white/10 rounded-xl text-xs flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-bleach-orange block uppercase"
  }, "B\xF4nus Semanal de Const\xE2ncia:"), /*#__PURE__*/React.createElement("span", {
    className: "text-bleach-creamDim"
  }, "Jogadores muito ativos recebem +2 a +3 Pontos de Atributo ao final da semana."))))), tabSis === "filosofia" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(Section, {
    title: "28, 29 & 30. T\xE9cnicas, Zanpakut\u014D & Filosofia Geral",
    subtitle: "Os 4 princ\xEDpios do Bleach RPG"
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-4 text-xs text-bleach-creamDim leading-relaxed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-bleach-panel2 border-l-4 border-yellow-500 rounded-xl space-y-2"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-bold text-sm text-yellow-400 uppercase"
  }, "Os Quatro Princ\xEDpios"), /*#__PURE__*/React.createElement("ul", {
    className: "list-disc list-inside space-y-1 font-mono text-white"
  }, /*#__PURE__*/React.createElement("li", null, "N\xFAmeros determinam a escala."), /*#__PURE__*/React.createElement("li", null, "T\xE9cnicas determinam como o poder \xE9 utilizado."), /*#__PURE__*/React.createElement("li", null, "Narrativa determina o contexto."), /*#__PURE__*/React.createElement("li", null, "Dados s\xF3 aparecem quando existe incerteza real."))), /*#__PURE__*/React.createElement("div", {
    className: "p-3.5 bg-black/60 border border-cyan-500/40 rounded-xl text-[11px] text-cyan-200"
  }, /*#__PURE__*/React.createElement("strong", null, "\uD83D\uDDE1\uFE0F Evolu\xE7\xE3o da Zanpakut\u014D:"), " A Zanpakut\u014D evolui atrav\xE9s da hist\xF3ria: descoberta do esp\xEDrito, nome, Shikai e Bankai. N\xE3o s\xE3o poderes comprados com pontos, mas conquistados narrativamente.")))));
}

// LEAGUE OF LEGENDS STYLE PATCH NOTES COMPONENT
function PatchNotesView() {
  const [patchAtivo, setPatchAtivo] = useState(PATCH_NOTES_HISTORY[0].versao);
  const patch = PATCH_NOTES_HISTORY.find(p => p.versao === patchAtivo) || PATCH_NOTES_HISTORY[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative z-10 max-w-3xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-3 py-1 bg-yellow-950 border border-yellow-500 text-yellow-300 text-xs font-bold rounded-full uppercase tracking-wider"
  }, "Hist\xF3rico Oficial de Atualiza\xE7\xF5es \u2022 Estilo League of Legends"), /*#__PURE__*/React.createElement("h2", {
    className: "font-title text-4xl sm:text-5xl tracking-widest text-bleach-cream mt-3 reiatsu-text-glow"
  }, "NOTAS DE ATUALIZA\xC7\xC3O & BALANCEAMENTO"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed"
  }, "Acompanhe a evolu\xE7\xE3o cont\xEDnua do Bleach RPG: mudan\xE7as de regras, buffs, nerfs, novos sistemas e ajustes no motor de almas."))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-4 gap-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-1 space-y-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold uppercase tracking-wider text-bleach-muted px-2 block"
  }, "Vers\xF5es Anteriores (10 Patches)"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 max-h-[500px] overflow-y-auto pr-1"
  }, PATCH_NOTES_HISTORY.map(p => {
    const isCurrent = p.versao === patchAtivo;
    return /*#__PURE__*/React.createElement("button", {
      key: p.versao,
      onClick: () => setPatchAtivo(p.versao),
      className: `w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${isCurrent ? "bg-bleach-orange text-black font-extrabold border-bleach-orange shadow-lg" : "bg-bleach-panel2 border-bleach-border text-bleach-creamDim hover:text-white hover:border-white/20"}`
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "font-title text-base block leading-tight"
    }, "PATCH ", p.versao), /*#__PURE__*/React.createElement("span", {
      className: `text-[10px] block ${isCurrent ? "text-black/80 font-bold" : "text-bleach-muted"}`
    }, p.data)), p.versao === "5.0" && /*#__PURE__*/React.createElement("span", {
      className: "px-2 py-0.5 rounded bg-black text-bleach-orange text-[9px] font-bold uppercase"
    }, "ATUAL"));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "lg:col-span-3 space-y-5"
  }, /*#__PURE__*/React.createElement(Section, {
    title: `PATCH ${patch.versao} — ${patch.titulo}`,
    subtitle: `Lançado oficialmente em ${patch.data}`,
    className: "border-2 border-yellow-500/40 shadow-2xl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 bg-black/80 border border-yellow-500/40 rounded-2xl mb-6 space-y-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold uppercase tracking-widest text-yellow-400 block"
  }, "Destaques da Atualiza\xE7\xE3o"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm font-semibold text-white leading-relaxed"
  }, patch.destaque), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-bleach-creamDim pt-1 border-t border-white/5"
  }, patch.resumo)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-5"
  }, patch.secoes.map((sec, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-3"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "font-title text-lg text-bleach-orange uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2"
  }, sec.titulo), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-xs text-bleach-creamDim leading-relaxed"
  }, sec.itens.map((item, itemIdx) => /*#__PURE__*/React.createElement("div", {
    key: itemIdx,
    className: "p-2.5 bg-black/40 rounded-lg border border-white/5 whitespace-pre-wrap"
  }, item))))))))));
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

  // Helper to sanitize character data
  function sanitizeChar(p) {
    if (!p || typeof p !== 'object') return null;
    return {
      id: p.id || 'char-' + uid(),
      nome: p.nome || "Shinigami",
      foto: p.foto || "assets/ichigo-orange.png",
      whatsapp: p.whatsapp || "",
      codigo: p.codigo || "",
      raca: p.raca || "Shinigami",
      esquadrao: p.esquadrao || "11º Esquadrão",
      faceclaim: p.faceclaim || p.nome || "",
      idadePlayer: p.idadePlayer || "20",
      aniversarioPlayer: p.aniversarioPlayer || "01/01",
      idadeChar: p.idadeChar || "18",
      aniversarioChar: p.aniversarioChar || "15/07",
      pontosDisponiveis: Number(p.pontosDisponiveis || 0),
      sorteiosComunsRestantes: Number(p.sorteiosComunsRestantes || 0),
      sorteiosEspeciaisRestantes: Number(p.sorteiosEspeciaisRestantes || 0),
      sorteiosDrops: Array.isArray(p.sorteiosDrops) ? p.sorteiosDrops : [],
      permissoes: {
        shikaiLiberada: !!p.permissoes?.shikaiLiberada,
        bankaiLiberada: !!p.permissoes?.bankaiLiberada
      },
      atributos: {
        pressao: Number(p.atributos?.pressao || 10),
        forca: Number(p.atributos?.forca || 10),
        velocidade: Number(p.atributos?.velocidade || 10),
        resiliencia: Number(p.atributos?.resiliencia || 10)
      },
      kidosConhecidos: Array.isArray(p.kidosConhecidos) ? p.kidosConhecidos : [],
      tecnicas: Array.isArray(p.tecnicas) ? p.tecnicas : [],
      personalidade: p.personalidade || {
        texto: "",
        virtudes: "",
        defeitos: "",
        desejos: "",
        medos: "",
        conflitos: "",
        estiloCombate: ""
      },
      personalidadeTravada: !!p.personalidadeTravada,
      cenaDespertarShikai: p.cenaDespertarShikai || "",
      cenaDespertarBankai: p.cenaDespertarBankai || "",
      zanpakuto: p.zanpakuto || {
        nome: "Em despertar",
        fotoShikai: "assets/ichigo-orange.png",
        fotoBankai: "assets/ichigo-moon.png",
        shikaiAtiva: null,
        bankaiAtiva: null,
        notas: ""
      },
      estado: p.estado || "Inteiro",
      treinosHoje: Number(p.treinosHoje || 0),
      historico: Array.isArray(p.historico) ? p.historico : []
    };
  }

  // Sync with cloud on startup
  useEffect(() => {
    async function initDb() {
      let initialData = {
        ...DEFAULT_DB
      };
      try {
        const stored = localStorage.getItem("bleachDB");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            initialData = {
              ...DEFAULT_DB,
              ...parsed,
              personagens: Array.isArray(parsed.personagens) && parsed.personagens.length > 0 ? parsed.personagens : DEFAULT_DB.personagens,
              combatesArena: Array.isArray(parsed.combatesArena) ? parsed.combatesArena : DEFAULT_DB.combatesArena,
              rolagensDadosPublicas: Array.isArray(parsed.rolagensDadosPublicas) ? parsed.rolagensDadosPublicas : DEFAULT_DB.rolagensDadosPublicas,
              mensagensChat: Array.isArray(parsed.mensagensChat) ? parsed.mensagensChat : DEFAULT_DB.mensagensChat,
              subAdms: Array.isArray(parsed.subAdms) ? parsed.subAdms : DEFAULT_DB.subAdms,
              registrosTarefasAdm: Array.isArray(parsed.registrosTarefasAdm) ? parsed.registrosTarefasAdm : DEFAULT_DB.registrosTarefasAdm,
              zanpakutosVinculadas: Array.isArray(parsed.zanpakutosVinculadas) ? parsed.zanpakutosVinculadas : DEFAULT_DB.zanpakutosVinculadas
            };
          }
        }
      } catch (e) {
        console.warn("Storage parse error, using default DB:", e);
      }

      // Sanitize characters
      if (Array.isArray(initialData.personagens)) {
        initialData.personagens = initialData.personagens.map(sanitizeChar).filter(Boolean);
      }
      let cloudUrl = "";
      try {
        const cfgRes = await fetch('config.json?t=' + Date.now());
        if (cfgRes.ok) {
          const cfg = await cfgRes.json();
          if (typeof window !== 'undefined') {
            window.BLEACH_CONFIG = cfg;
          }
          if (cfg && cfg.firebaseUrl) {
            cloudUrl = cfg.firebaseUrl.trim();
          }
          if (cfg && cfg.openaiApiKey) {
            try {
              localStorage.setItem("bleach_openai_key", cfg.openaiApiKey.trim());
            } catch (e) {}
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
            if (cloudData && typeof cloudData === 'object' && Array.isArray(cloudData.personagens)) {
              initialData = {
                ...initialData,
                ...cloudData,
                personagens: cloudData.personagens.map(sanitizeChar).filter(Boolean),
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
          if (cloudData && typeof cloudData === 'object' && Array.isArray(cloudData.personagens)) {
            setDb(prev => ({
              ...prev,
              ...cloudData,
              personagens: cloudData.personagens.map(sanitizeChar).filter(Boolean)
            }));
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
        mensagensChat: (next.mensagensChat || []).slice(-100),
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
      className: "w-12 h-12 border-4 border-bleach-orange border-t-transparent rounded-full animate-spin mb-4"
    }), /*#__PURE__*/React.createElement("p", {
      className: "font-title text-xl tracking-wider text-bleach-cream"
    }, "CONECTANDO \xC0 SOCIEDADE DAS ALMAS..."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col bg-bleach-bg text-bleach-cream font-sans selection:bg-bleach-orange selection:text-black"
  }, /*#__PURE__*/React.createElement(TopBar, {
    session: session,
    onLogout: logout,
    view: view,
    setView: v => {
      if (v !== "ficha") setAdminCharId(null);
      setView(v);
    },
    nome: myChar?.nome || (session?.role === "super_admin" ? "Comandante Supremo" : session?.nome),
    onOpenAdminLogin: () => setShowAdminLoginModal(true),
    cloudStatus: cloudStatus
  }), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-6"
  }, saveErr && /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-red-950/80 border border-red-500 text-red-200 text-xs rounded-xl text-center"
  }, saveErr), view === "sistemas" && /*#__PURE__*/React.createElement(SistemasView, null), view === "chat" && /*#__PURE__*/React.createElement(ChatView, {
    db: db,
    saveDb: saveDb,
    session: session,
    myChar: myChar
  }), view === "patchnotes" && /*#__PURE__*/React.createElement(PatchNotesView, null), view === "ficha" && (session?.role === "jogador" ? /*#__PURE__*/React.createElement(FichaView, {
    db: db,
    saveDb: saveDb,
    personagem: myChar,
    isAdmin: false,
    rankFisico: rankFisico,
    rankPressao: rankPressao
  }) : session?.role === "super_admin" || session?.role === "sub_admin" ? adminCharId && myChar ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between bg-yellow-950/40 border border-yellow-500/60 p-3 rounded-xl"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-yellow-300 font-bold"
  }, "\uD83D\uDC51 Modo de Gest\xE3o Administrativa: Editando a ficha de ", /*#__PURE__*/React.createElement("strong", null, myChar.nome)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setAdminCharId(null);
      setView("admin");
    },
    className: "px-3 py-1 bg-bleach-panel2 border border-bleach-border text-xs text-white rounded hover:border-yellow-400"
  }, "\u2190 Voltar ao Painel ADM")), /*#__PURE__*/React.createElement(FichaView, {
    db: db,
    saveDb: saveDb,
    personagem: myChar,
    isAdmin: true,
    rankFisico: rankFisico,
    rankPressao: rankPressao
  })) : /*#__PURE__*/React.createElement("div", {
    className: "text-center py-12 text-bleach-muted"
  }, /*#__PURE__*/React.createElement("p", null, "Nenhum personagem selecionado para gerenciar."), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("admin"),
    className: "mt-3 px-4 py-2 bg-bleach-orange text-black font-bold rounded-lg text-xs"
  }, "Ir para Lista de Fichas")) : /*#__PURE__*/React.createElement(LoginScreen, {
    db: db,
    activeCloudUrl: activeCloudUrl,
    setDb: setDb,
    onLogin: p => {
      setSession({
        role: "jogador",
        charId: p.id,
        nome: p.nome
      });
      setView("ficha");
    },
    onOpenAdminModal: () => setShowAdminLoginModal(true)
  })), view === "rankings" && /*#__PURE__*/React.createElement(RankingsView, {
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
  }), view === "admin" && (session?.role === "super_admin" || session?.role === "sub_admin" ? /*#__PURE__*/React.createElement(AdminPanel, {
    db: db,
    saveDb: saveDb,
    session: session,
    cloudStatus: cloudStatus,
    setCloudStatus: setCloudStatus,
    activeCloudUrl: activeCloudUrl,
    setActiveCloudUrl: setActiveCloudUrl,
    onAbrirFicha: charId => {
      setAdminCharId(charId);
      setView("ficha");
    }
  }) : /*#__PURE__*/React.createElement(AdminLoginScreen, {
    db: db,
    onLoginAdmin: (role, subAdmObj) => {
      setSession({
        role,
        ...(subAdmObj || {})
      });
      setView("admin");
    }
  }))), showAdminLoginModal && /*#__PURE__*/React.createElement(AdminLoginModal, {
    db: db,
    onClose: () => setShowAdminLoginModal(false),
    onSuccess: (role, subAdmObj) => {
      setSession({
        role,
        ...(subAdmObj || {})
      });
      setShowAdminLoginModal(false);
      setView("admin");
    }
  }));
}

// MOUNT REACT ROOT
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render( /*#__PURE__*/React.createElement(ErrorBoundary, null, /*#__PURE__*/React.createElement(App, null)));
}