// =========================================================================
// BLEACH RPG — PATCH NOTES COMPENDIUM (LEAGUE OF LEGENDS STYLE)
// 10 Historical & Current Version Folders with Buffs, Nerfs & Rules
// =========================================================================

const PATCH_NOTES_HISTORY = [
  {
    versao: "5.2",
    titulo: "Infusão de Pressão Espiritual (Reiatsu Surge), 4 Modos de Confronto & Grimório Interativo de Kidōs",
    data: "24 de Agosto de 2026",
    destaque: "Infusão de Reiatsu em Força e Resiliência (Reiatsu Surge da Cena), 4 Simuladores Interativos de Confronto de Atributos, Modal Completo de Kidō com Fórmulas de Custo Anti-Spam e Escalamento por Pressão Espiritual.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma expansão profunda no sistema de combate e magia espiritual que introduz a mecânica de canalização temporária de Pressão Espiritual (Reiatsu Surge) para inflar Força e Resiliência em cenas decisivas, 4 simuladores de confronto de atributos oficiais (Força x Resiliência, Força x Força, Velocidade x Velocidade e Pressão x Pressão), e a reformulação completa do sistema de Kidōs com cálculo de custo proporcional anti-spam, simulação de Hadō vs Resiliência, Bakudō vs Força e regeneração celular de Kaidō.",
    secoes: [
      {
        tipo: "novo",
        titulo: "🌀 Infusão Espiritual de Combate (Reiatsu Surge)",
        itens: [
          "✦ **Canalização em Força e Resiliência**: Os Shinigamis agora podem alocar temporariamente sua Pressão Espiritual para somar diretamente em sua Força (potência de Zanjutsu/Hakuda) ou Resiliência (armadura de Reiatsu e mitigação).",
          "✦ **Barra Dinâmica de Reiatsu da Cena**: Mostra a Pressão Total, a Pressão Restante na cena atual e os bônus ativos com botões rápidos de alocação (+10, +25, +50, +100, 25%, 50%, 100%) e botão de restauração para nova cena.",
          "✦ **Regra de Cena & Ação Decisiva**: O reforço dura exclusivamente durante a cena/ação atual, podendo ser reutilizado na próxima cena com a Pressão Espiritual restante."
        ]
      },
      {
        tipo: "regras",
        titulo: "⚔️ 4 Simuladores Oficiais de Confronto de Atributos",
        itens: [
          "✦ **1. Força X Resiliência**: Mitigação de dano, integridade estrutural e tabela dos 4 patamares de impacto (Bloqueio Perfeito, Defesa Parcial, Ruptura de Guarda, Colapso Físico).",
          "✦ **2. Força X Força**: Disputa física direta, trava de espadas (Tsubazeriai), quebra de postura e desarme.",
          "✦ **3. Velocidade X Velocidade**: Cadência de Hohō/Shunpo, flanqueamento, imagens residuais (Senka/Utsusemi) e pontos cegos.",
          "✦ **4. Pressão X Pressão**: Choque de auras espirituais, supressão de Reiatsu paralisante, turbulência de Reishi e foco mental."
        ]
      },
      {
        tipo: "novo",
        titulo: "📕 Modal Interativo de Kidōs & Fórmulas Anti-Spam",
        itens: [
          "✦ **Modal de Análise Tática de Kidō**: Ao clicar em qualquer feitiço (Hadō, Bakudō e Kaidō), abre um modal com encantamento ancestral poético, efeito oficial, cálculo de custo e simulador integrado.",
          "✦ **Fórmula de Custo Balanceada Anti-Spam**: O custo combina uma base FLAT + uma porcentagem da Pressão Espiritual Total do personagem (2.5% a 10%), impedindo spam infinito mesmo para combatentes com 5.000+ de Pressão.",
          "✦ **Poder de Feitiço Escalado por Reiatsu**: A potência do feitiço escala com a Pressão Espiritual do Shinigami e com o Reishi extra investido, conferindo +35% de bônus ao recitar o encantamento completo (Eishō).",
          "✦ **Simulação Hadō vs Resiliência**: Calcula a taxa de penetração de dano (Aniquilação Crítica, Dano Pesado, Dano Moderado, Mitigação Efetiva).",
          "✦ **Simulação Bakudō vs Força**: Determina a eficácia e duração das amarras (Aprisionamento Absoluto, Contenção Severa, Ruptura com Esforço, Rompimento Instantâneo).",
          "✦ **Diagnóstico Celular de Kaidō**: Avalia o nível de cura e restauração de estados feridos/debilitados com base na potência espiritual."
        ]
      }
    ]
  },
  {
    versao: "5.1",
    titulo: "Atributos da Zanpakutō, Revelação de Capacidades & Equilíbrio Força x Resiliência",
    data: "24 de Agosto de 2026",
    destaque: "5 Atributos próprios da Zanpakutō (Controle, Alcance, Corte, Resiliência, Reiatsu Lâmina), Sistema Progressivo de Revelação de Capacidades Táticas e Simulador Interativo Força vs Resiliência.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma atualização estrutural no sistema de combate que introduz atributos dedicados para a Zanpakutō calculados dinamicamente a partir dos atributos do Shinigami (Base 100), o sistema de revelação progressiva de capacidades táticas conforme a lâmina evolui, e a modelagem matemática completa da interação de Força contra Resiliência.",
    secoes: [
      {
        tipo: "novo",
        titulo: "⚔️ 5 Atributos Próprios da Zanpakutō (Base 100)",
        itens: [
          "✦ **Controle**: Define a precisão, maleabilidade e capacidade de moldar a geometria da arma (ex: arco variando flechas pequenas e rápidas, grandes de impacto ou fragmentadas em área).",
          "✦ **Alcance**: Distância efetiva da Shikai e escala territorial da Bankai (calculado em metros e quilômetros de alcance).",
          "✦ **Corte**: Poder de penetração/cisalhamento de Reishi para transpassar a Resiliência de defesas e corpos.",
          "✦ **Resiliência da Lâmina**: Durabilidade física e espiritual da espada contra impactos pesados para não trincar nem quebrar.",
          "✦ **Reiatsu da Lâmina & Modos Táticos**: A energia espiritual intrínseca da espada pode ser canalizada em **Absorção Espiritual** (buff temporário de Reiatsu para o Shinigami) ou **Ressonância de Impacto** (soma massiva de dano às técnicas)."
        ]
      },
      {
        tipo: "novo",
        titulo: "👁️ Revelação Progressiva de Capacidades Táticas (Shikai & Bankai)",
        itens: [
          "✦ **Desbloqueio por Evolução de Atributos**: As capacidades não são liberadas instantaneamente, mas sim conforme a média dos atributos da Zanpakutō atinge patamares (100, 200, 400, 700 e 1100+ pts na Shikai; 300, 600, 1100 e 1800+ na Bankai).",
          "✦ **Aprofundamento Sem Criar Poderes Novos**: As capacidades aprofundam nuances táticas da mesma arma existente (densidade, velocidade, dispersão em curva, microvibração e fluxo instantâneo sem delay de canalização).",
          "✦ **Modal de Análise Tática**: Visualização gráfica completa com status de desbloqueio, requisitos restantes e recomendações de narração em ON."
        ]
      },
      {
        tipo: "regras",
        titulo: "🛡️ Dinâmica de Combate: Força X Resiliência",
        itens: [
          "✦ **Regra de Absorção e Mitigação**: A Força do atacante define o impacto destrutivo; a Resiliência do defensor define a densidade de armadura de Reiatsu para sustentar o golpe.",
          "✦ **Tabela Oficial dos 4 Patamares**: 100%+ (Bloqueio Perfeito / 0-10% dano), 70-99% (Defesa Parcial / Recuo 2-5m / 15-35% dano), 40-69% (Ruptura de Guarda / Dano Severo 40-75% / risco de quebra de arma), <40% (Colapso Físico Devastador / 80-100%+ dano).",
          "✦ **Simulador Interativo de Impacto**: Ferramenta interativa na aba de Atributos que permite ao jogador testar qualquer valor de Força inimiga contra sua Resiliência atual com presets rápidos (Hollow, Sentinela, Tenente, Capitão, Espada, Comandante)."
        ]
      }
    ]
  },
  {
    versao: "5.0",
    titulo: "A Grande Gênese das Almas & Novo Regulamento Seireitei",
    data: "23 de Agosto de 2026",
    destaque: "Motor ZGE v5.0, 50 Zanpakutōs Canônicas, Grimório de 60+ Kidōs com Kaidō Completo, Chat dos Shinigamis e Reformulação da Arena.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma atualização monumental que introduz o motor de IA generativa ZGE V5.0 de 4 caminhos com preservação do Soul DNA, integração do sistema de turnos na Arena de Duelos com botão de reset, chat global em tempo real e compêndio definitivo de regras e Kidōs.",
    secoes: [
      {
        tipo: "regras",
        titulo: "📜 Regulamento Base & Power Scaling Oficial",
        itens: [
          "✦ **Power Scaling Oficial**: Padronização dos 9 patamares: 1–10 (Inexperiente), 11–30 (Iniciante), 31–60 (Treinado), 61–100 (Experiente), 101–150 (Elite), 151–250 (Alto Nível), 251–400 (Monstruoso), 401–600 (Lendário), 601+ (Transcendente).",
          "✦ **Regra de Combate 1d6**: Combate baseado na comparação lógica de Atributos + Técnicas + Narrativa. Rolagens de 1d6 acontecem apenas em dúvida real (1–2: Falha, 3–4: Sucesso Parcial, 5–6: Sucesso).",
          "✦ **Fadiga por Treinamento OFF**: Máximo de 3 períodos por dia. 2º treino diário aplica −5% nos atributos treinados; 3º treino aplica −15% e bloqueia Miscelâneas no dia. O descanso do dia seguinte remove toda a fadiga.",
          "✦ **Regras de Raça**: Shinigamis nativos começam com 4 Kidōs básicos; Shinigamis Ex-Humanos aprendem Kidō ao longo da história sem bônus numéricos desmedidos."
        ]
      },
      {
        tipo: "novo",
        titulo: "🗡️ Motor ZGE V5.0 & 50 Arquétipos Canônicos",
        itens: [
          "✦ **4 Caminhos Espirituais Simultâneos**: O gerador agora produz 4 interpretações da mesma alma (1. Elemental/Temperamento ~45%, 2. Conceitual/Progressivo ~20%, 3. Compensatório/Complementar, 4. Opositivo/Experimental).",
          "✦ **Bankai Evolution Engine**: Toda Bankai identifica o limite da Shikai, o Ponto de Ruptura e evolui o princípio conceitual em vez de apenas inflar números.",
          "✦ **Anti-Duplicação Estrita**: Assinatura semântica única e índice de similaridade (0–30% Liberado, 31–60% Permitido com mecânica distinta, 61–80% Reformulação, 81–100% Bloqueio).",
          "✦ **Catálogo dos 50 Mestres**: Ingestão completa de Kurotsubaki, Akagane, Suisen, Hoshikuzu, Kōriame, Kagamibana, Mukade, Raimei, Shirogane e outros 41 espíritos canônicos."
        ]
      },
      {
        tipo: "social",
        titulo: "💬 Chat Global dos Shinigamis & Arena de Turnos",
        itens: [
          "✦ **Chat dos Shinigamis em Tempo Real**: Canal de interação direta entre todos os jogadores logados e ADMs, com sincronização em nuvem e histórico contínuo.",
          "✦ **Histórico de Turnos da Arena**: Registro cronológico de ações, decisões dos juízes e rolagens públicas com botão dedicado de **Resetar Duelo**.",
          "✦ **Acesso Sutil da Administração**: O login do ADM foi transformado em um selo estético discreto (`❖`) no topo da interface para não poluir a imersão dos jogadores."
        ]
      },
      {
        tipo: "buffs",
        titulo: "▲ Melhorias & Buffs",
        itens: [
          "▲ **Grimório de Kaidō Completo**: Adicionados 20 feitiços médicos de tratamento, regeneração celular e restauração de Reiatsu com seus respectivos encantamentos poéticos.",
          "▲ **Distribuidor de Recompensas no ADM**: Permite conceder pontos de atributos diretamente em Pressão, Força, Velocidade, Resiliência ou Pontos Livres com atalhos de +1, +2, +5, +10 e +15.",
          "▲ **Performance de Salvamento**: Serialização enxuta do armazenamento local eliminando mensagens de erro de cota no navegador."
        ]
      }
    ]
  },
  {
    versao: "4.2",
    titulo: "Ressonância do Reishi & O Baú Espiritual",
    data: "18 de Agosto de 2026",
    destaque: "Animação de baú com mecânica de suspense (~7s), sintetizador sonoro de Shikai e Bankai, selamento permanente de personalidade.",
    banner: "assets/ichigo-orange.png",
    resumo: "Introdução do sistema de animação visual para abertura de roletas e gacha com probabilidade de tensão crítica de Reiatsu, além da implementação da trava imutável do DNA da alma.",
    secoes: [
      {
        tipo: "novo",
        titulo: "✦ Novidades do Gacha",
        itens: [
          "✦ **Baú Espiritual 3D**: Animação de convergência de partículas de Reishi com runas rotativas e quebra de selos.",
          "✦ **Mecânica de Suspense (~28%)**: Em giros de alta tensão, o baú demora ~7s adicionais com tela tremendo e áudio pulsante.",
          "✦ **Trava de Personalidade**: Campo guiado de psicologia com botão de selamento definitivo e imutável para jogadores."
        ]
      },
      {
        tipo: "ajustes",
        titulo: "⚙️ Áudio & Efeitos Sonoros",
        itens: [
          "⚙️ Síntese em tempo real com Web Audio API para carregamento e revelação de Shikai (`shikai_charge`, `shikai_reveal`) e Bankai (`bankai_charge`, `bankai_reveal`)."
        ]
      }
    ]
  },
  {
    versao: "4.0",
    titulo: "O Despertar dos 4 Caminhos",
    data: "10 de Agosto de 2026",
    destaque: "Criação do motor de 4 caminhos simultâneos para Shikai e Bankai com complexidade de 1 a 10.",
    banner: "assets/ichigo-moon.png",
    resumo: "A transição de sorteios genéricos de Zanpakutō para um ritual autoral de manifestação espiritual guiado pela personalidade do Shinigami.",
    secoes: [
      {
        tipo: "novo",
        titulo: "✦ Arquitetura de Caminhos",
        itens: [
          "✦ Separação entre Caminho Elemental, Caminho Conceitual, Caminho Compensatório e Caminho Opositivo.",
          "✦ Gráficos com barras de 1 a 10 para Potência, Alcance, Complexidade, Versatilidade e Custo de Reiatsu."
        ]
      }
    ]
  },
  {
    versao: "3.5",
    titulo: "Ajuste de Power Scaling & Fadiga de Treino",
    data: "01 de Agosto de 2026",
    destaque: "Regulamentação dos 3 períodos de treino diários em OFF e penalidades de fadiga temporária.",
    banner: "assets/bleach-banner.png",
    resumo: "Implementação de freios narrativos para impedir inflação desenfreada de atributos em poucos dias de RPG.",
    secoes: [
      {
        tipo: "nerfs",
        titulo: "▼ Controle de Progressão",
        itens: [
          "▼ **Teto de Treino Diário**: Máximo de 9 pontos conquistáveis por dia (3 períodos excelentes de até 3 pontos).",
          "▼ **Penalidades de Fadiga**: -5% no 2º treino e -15% no 3º treino nos atributos focados.",
          "▼ **Restrição de Miscelânea**: Personagens com 3 treinos no dia ficam impossibilitados de recolher drops de cenas cotidianas."
        ]
      }
    ]
  },
  {
    versao: "3.0",
    titulo: "Separação de Roletas & Especialidades Marciais",
    data: "20 de Julho de 2026",
    destaque: "Divisão entre Giros Comuns e Giros Especiais com tabela de porcentagens estritas.",
    banner: "assets/ichigo-orange.png",
    resumo: "Criação de pools de recompensas distintos para treinos comuns e missões nobres de grande escala.",
    secoes: [
      {
        tipo: "novo",
        titulo: "✦ Sorteios Segmentados",
        itens: [
          "✦ **Pool Comum**: 65% Básico (+1/+2 pts), 22% Incomum (+3/+4 pts), 9% Raro (+5/+7 pts), 3.5% Épico (+8/+11 pts), 0.5% Lendário (+14/+18 pts).",
          "✦ **Pool Especial**: Elixires, Tomos de Hadō, Relíquias Shihōin e Missão Narrativa Suprema de Despertar Único (1%)."
        ]
      }
    ]
  },
  {
    versao: "2.5",
    titulo: "Grimório de Hadō & Bakudō",
    data: "05 de Julho de 2026",
    destaque: "Compilação dos primeiros 40 feitiços canônicos de Hadō e Bakudō no sistema.",
    banner: "assets/ichigo-moon.png",
    resumo: "Inclusão do catálogo de feitiços com cálculo de custos de Reiatsu e limites por cena.",
    secoes: [
      {
        tipo: "regras",
        titulo: "📜 Mecânica de Kidō",
        itens: [
          "✦ Cálculo do teto de conjuração por cena através da fórmula `Math.max(3, Math.floor(Pressão / 7) + 1)`.",
          "✦ Inclusão de encantamentos completos para Hadō #31, #33, #73 e #90."
        ]
      }
    ]
  },
  {
    versao: "2.0",
    titulo: "Sincronização em Nuvem Firebase",
    data: "15 de Junho de 2026",
    destaque: "Integração em tempo real com Firebase Realtime Database e gestão multiusuário.",
    banner: "assets/bleach-banner.png",
    resumo: "Permitiu que mestres e jogadores acessassem fichas simultaneamente com persistência contínua na nuvem.",
    secoes: [
      {
        tipo: "novo",
        titulo: "✦ Infraestrutura Cloud",
        itens: [
          "✦ Sincronização periódica em background de fichas, combates e logs de dados.",
          "✦ Revogação instantânea de sessões no navegador quando a ficha é excluída pelo ADM."
        ]
      }
    ]
  },
  {
    versao: "1.5",
    titulo: "Arena de Duelos & Painel de Juiz",
    data: "28 de Maio de 2026",
    destaque: "Lançamento da Arena com status dos combatentes e registro de decisões narrativas.",
    banner: "assets/ichigo-orange.png",
    resumo: "Espaço dedicado para combates supervisionados por narradores com apoio de rolagens públicas de dados.",
    secoes: [
      {
        tipo: "novo",
        titulo: "✦ Recursos da Arena",
        itens: [
          "✦ Comparativo visual de atributos entre dois lutadores.",
          "✦ Log de arbitragem com decisões oficiais gravadas na linha do tempo."
        ]
      }
    ]
  },
  {
    versao: "1.2",
    titulo: "Padronização de Atributos & Estados",
    data: "10 de Maio de 2026",
    destaque: "Definição dos 4 atributos base (10 iniciais + 20 livres) e 4 estados de combate.",
    banner: "assets/ichigo-moon.png",
    resumo: "Estabeleceu a regra fundamental de que o número na ficha é o atributo real, sem multiplicadores ocultos.",
    secoes: [
      {
        tipo: "regras",
        titulo: "📜 Atributos e Saúde",
        itens: [
          "✦ Definição dos 4 atributos: Pressão Espiritual, Força, Velocidade e Resiliência.",
          "✦ Substituição de pontos de vida por 4 estados: Inteiro, Ferido, Debilitado e Derrotado."
        ]
      }
    ]
  },
  {
    versao: "1.0",
    titulo: "Fundação da Sociedade das Almas RPG",
    data: "01 de Maio de 2026",
    destaque: "Lançamento oficial da plataforma de fichas e fichário dos Shinigamis.",
    banner: "assets/bleach-banner.png",
    resumo: "O nascimento do sistema digital do Bleach RPG com autenticação por código de acesso, ranqueamentos de honra e histórico de personagens.",
    secoes: [
      {
        tipo: "novo",
        titulo: "✦ Fundação do Sistema",
        itens: [
          "✦ Criação da arquitetura de fichas com suporte a foto de perfil, dados civis e técnicas.",
          "✦ Rankings automatizados de Honra (Média Física e Pressão Espiritual)."
        ]
      }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PATCH_NOTES_HISTORY };
}
