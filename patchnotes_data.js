// =========================================================================
// BLEACH RPG — PATCH NOTES COMPENDIUM (LEAGUE OF LEGENDS STYLE)
// 10 Historical & Current Version Folders with Buffs, Nerfs & Rules
// =========================================================================

const PATCH_NOTES_HISTORY = [
  {
    versao: "7.0",
    titulo: "Simulador Interativo de Combate da Zanpakutō & Shikai/Bankai",
    data: "26 de Agosto de 2026",
    destaque: "Lançamento oficial do Simulador de Combate da Zanpakutō diretamente na aba da Shikai, com 5 modos de disputa canônica (Corte vs Resiliência, Resiliência vs Impacto, Alcance vs Velocidade, Controle vs Reação, e Reiatsu & Modos de Canalização), presets de inimigos e comutação instantânea de Shikai e Bankai.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma expansão revolucionária para a aba de Zanpakutō & Despertar da Ficha. Inspirado no simulador de atributos, o novo Simulador de Zanpakutō calcula em tempo real o poder de penetração, risco de dano estrutural à lâmina, cerco territorial e sobrecarga de Reiatsu (Absorção vs Ressonância) contra adversários do Seireitei e do Hueco Mundo, com orientações táticas e mecânicas completas para narração de cenas.",
    secoes: [
      {
        tipo: "novo",
        titulo: "⚔️ Simulador de Combate de Zanpakutō (Shikai & Bankai)",
        itens: [
          "✦ **5 Modos de Disputa Canônica**: `⚔️ Corte X Resiliência` (Poder de penetração & quebra de Hierro/barreira), `🛡️ Resiliência X Impacto` (Durabilidade da lâmina contra deformação/fratura), `🏹 Alcance X Velocidade` (Zona de cerco territorial vs esquiva de Hohō), `🎯 Controle X Reação` (Moldagem e fintas) e `🌌 Reiatsu & Modos` (Canalização espiritual).",
          "✦ **Canalização Tática de Reiatsu**: Ativação com 1 clique de `💥 Ressonância de Impacto (+bônus de dano)` ou `💫 Absorção Espiritual (+bônus de pressão)`.",
          "✦ **Comutação Shikai / Bankai**: Alterne entre a escala regular de Shikai e a escala Transcendental de Bankai com multiplicadores e efeitos visuais autênticos.",
          "✦ **Presets Canônicos Rápidos**: Teste sua lâmina instantaneamente contra Hollow Menor (40 pts), Gillian (120 pts), Sentinela (250 pts), Tenente (600 pts), Capitão (1400 pts), Espada Top 4 (2500 pts) e Yamamoto (5000 pts)."
        ]
      }
    ]
  },
  {
    versao: "6.9",
    titulo: "Novo Guia Oficial para Novatos, Limites de Cenas & Regras de Fadiga e Combate",
    data: "25 de Agosto de 2026",
    destaque: "Lançamento da página oficial (Para Novatos: Como evoluir de modo simples), limites rígidos de cenas semanais e diárias, sistema de fadiga dos 3 períodos e escala visual de diferença em combate (0 a 1000+ pts).",
    banner: "assets/bleach-banner.png",
    resumo: "Uma grande expansão de usabilidade para novos jogadores. O sistema agora conta com um guia completo de evolução passo a passo, tabela de limites oficiais de cenas (2 arcos/semana com 90 linhas, 3 treinos diários com 30 linhas, 4 miscelâneas semanais e 1 PVP diário), explicação detalhada com exemplo da fadiga ao treinar até o 3º período e tabela comparativa da escala de diferença de poder em combate com exemplos para cada um dos 4 atributos.",
    secoes: [
      {
        tipo: "novo",
        titulo: "🌱 Nova Página: Para Novatos (Como Evoluir de Modo Simples)",
        itens: [
          "✦ **Guia de 4 Passos**: Distribuição dos 20 pontos livres, constância no WhatsApp, despertar da Zanpakutō e participação em Arcos.",
          "✦ **Limites Oficiais de Cenas**: 2 Cenas de Arco semanais (90+ linhas), 3 Treinos diários (30+ linhas), 4 Miscelâneas semanais e 1 PVP diário.",
          "✦ **Regra de Fadiga dos 3 Períodos**: Explicação biológica de saturação de Reishi nos circuitos de Saketsu/Hakusui com exemplo narrativo prático.",
          "✦ **Escala de Diferença de Combate**: 0-50 pts (Equivalentes), 51-150 pts (Pequena vantagem), 151-300 pts (Vantagem clara), 301-600 pts (Grande vantagem), 601-1000 pts (Abismo de poder) e 1001+ pts (Diferença monstruosa), com exemplos detalhados para Pressão, Força, Velocidade e Resiliência."
        ]
      },
      {
        tipo: "ajuste",
        titulo: "🔒 Bloqueio Definitivo da Taxa Fixa de Conhecimento (1 Cena = 10 ₪)",
        itens: [
          "✦ **Bloqueio de Edição**: Removida a possibilidade de qualquer ADM ou Sub-ADM alterar o valor concedido por cena (1 cena = 10 ₪ sempre).",
          "✦ **Novo Destaque nos Rankings**: O Ranking agora exibe o saldo de Conhecimento (₪) em destaque central dourado, com a quantidade de cenas feitas exibida no canto direito."
        ]
      }
    ]
  },
  {
    versao: "6.8",
    titulo: "Padronização do Ganho Fixo de Conhecimento por Cena (10 ₪ / Cena) & Equilíbrio de Aquisição de Kidōs",
    data: "25 de Agosto de 2026",
    destaque: "Recompensa fixa de 10 ₪ de Conhecimento por qualquer cena realizada no WhatsApp (treino, interação cotidiana ou combate). Balanceamento perfeito para alto fluxo de roleplay (+10 cenas/dia) limitando a progressão para 2 a 3 novos Kidōs por semana.",
    banner: "assets/bleach-banner.png",
    resumo: "Um ajuste econômico cirúrgico no Grimório de Kidō e no sistema de atividade. Como os jogadores realizam um volume intenso de cenas diárias (muitas vezes ultrapassando 10 cenas por dia em interações normais e treinos), o ganho de Conhecimento foi padronizado em uma taxa fixa e imutável de 10 ₪ por cena. Isso garante que mesmo os jogadores mais ativos consigam adquirir no máximo 2 a 3 Kidōs novos por semana, mantendo cada feitiço valorizado e impedindo a inflação do grimório.",
    secoes: [
      {
        tipo: "ajuste",
        titulo: "₪ Taxa Fixa de Conhecimento por Cena (10 ₪ Fixo)",
        itens: [
          "✦ **Recompensa Universal e Fixa**: Toda e qualquer cena realizada no WhatsApp (seja treino, diálogo, convivência, patrulha ou combate) concede rigorosamente **+10 ₪ de Conhecimento**.",
          "✦ **Controle de Inflação do Grimório**: Com 30 a 50 cenas semanais, o jogador acumula entre 300 ₪ e 500 ₪, o que permite desbloquear exatamente **2 a 3 feitiços de nível básico/médio por semana**."
        ]
      },
      {
        tipo: "regras",
        titulo: "📊 Atualização nos Lançadores de Atividade da Staff",
        itens: [
          "✦ **Botões Rápidos Atualizados**: Os atalhos de lançamento em lote foram atualizados para +1 cena (+10 ₪), +5 cenas (+50 ₪), +10 cenas (+100 ₪) e +20 cenas (+200 ₪).",
          "✦ **Auditoria do Histórico**: Cada lançamento registra o número exato de cenas e o crédito proporcional de 10 ₪ por cena no histórico auditável da ficha."
        ]
      }
    ]
  },
  {
    versao: "6.7",
    titulo: "Hierarquia de Segurança & Segregação de Poderes da Administração (ADM Máximo vs Sub-ADMs)",
    data: "25 de Agosto de 2026",
    destaque: "Redução e blindagem de privilégios para contas de Sub-Administradores (Avaliadores). Acesso restrito a credenciais mestre, proibição de alteração de senha do ADM Máximo, bloqueio de gerenciamento de outros avaliadores e bloqueio de exclusão definitiva de fichas.",
    banner: "assets/bleach-banner.png",
    resumo: "Um marco fundamental na governança e integridade da Soul Society. As contas de Sub-Administradores (Avaliadores) foram devidamente segregadas do poder do ADM Máximo (Comandante Supremo). Sub-ADMs agora operam estritamente no escopo de avaliação de fichas, narração de tramas e arcos com IA, lançamento de cenas/atividade semanal, mesa de dados e cadastro de novos jogadores, sendo terminantemente bloqueados de alterar a senha mestre do ADM Máximo, gerenciar outros membros da Staff, apagar personagens do banco de dados ou reconfigurar a nuvem Firebase.",
    secoes: [
      {
        tipo: "regras",
        titulo: "👑 Blindagem das Credenciais do ADM Máximo",
        itens: [
          "✦ **Painel de Segurança Master Exclusivo**: Nova aba de credenciais acessível unicamente pelo ADM Máximo (Comandante Supremo), permitindo alterar o usuário, senha mestre e nome de exibição de forma protegida.",
          "✦ **Bloqueio Absoluto para Sub-ADMs**: Contas com papel de Sub-ADM não têm visibilidade nem acesso a rotas ou formulários de alteração de credenciais do ADM Máximo."
        ]
      },
      {
        tipo: "nerf",
        titulo: "🛡️ Redução de Poderes das Contas de Sub-ADM (Avaliadores)",
        itens: [
          "✦ **Proibição de Exclusão de Personagens**: Apenas o ADM Máximo possui autorização para apagar fichas de jogadores permanentemente do banco de dados.",
          "✦ **Bloqueio de Gestão de Avaliadores**: Sub-ADMs não podem adicionar, editar senhas ou remover outros avaliadores da Staff.",
          "✦ **Bloqueio de Infraestrutura de Nuvem & IA**: Sub-ADMs não têm permissão para alterar URLs do Firebase, forçar reescrita do banco de dados nem alterar/remover chaves de API globais."
        ]
      },
      {
        tipo: "buff",
        titulo: "⚡ Escopo Operacional Pleno Mantido para Avaliadores",
        itens: [
          "✦ **Avaliação de Fichas & Recompensas**: Sub-ADMs continuam com acesso completo para avaliar treinos, desbloquear Shikai/Bankai aprovadas e gerenciar a evolução de fichas.",
          "✦ **Motor de Tramas & Arcos com IA**: Acesso irrestrito ao gerador de tramas individuais e cruzadas com IA para escolher opções narrativas e gerar briefings para o WhatsApp.",
          "✦ **Lançamento de Atividade & Cenas em Lote**: Permissão completa para validar cenas no ON e creditar Conhecimento semanal."
        ]
      }
    ]
  },
  {
    versao: "6.6",
    titulo: "Gerenciador de Tramas & Arcos com IA para ADM, Arcos Cruzados Multi-Player, Nivelamento Justo de Staff & Molde Limpo de WhatsApp",
    data: "24 de Agosto de 2026",
    destaque: "Novo painel exclusivo de Tramas & Arcos com IA para Mestres/ADMs, armazenamento de cenas de arco por player, criação de Fichas de Tramas Cruzadas (Multi-Player) com roteiros interligados, nivelamento sagrado de recompensas para ADMs/Sub-ADMs e molde oficial do WhatsApp sem bloco de personalidade.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma atualização monumental voltada para a gestão de narrativa e equilíbrio sagrado do RPG. A Administração agora conta com um Gerenciador de Tramas & Arcos integrado com Inteligência Artificial capaz de estruturar trilhas de 3 eventos graduais e antagonistas sob medida para cada jogador com base em suas cenas registradas. Além disso, ao cruzar o destino de dois ou mais jogadores, o sistema cria automaticamente uma Ficha de Trama Conjunta com narrativa cooperativa/rival. A Staff tem suas recompensas niveladas estritamente com os players (garantido apenas por narração de missão principal e cenas de arco), e o molde de ficha do WhatsApp foi purificado.",
    secoes: [
      {
        tipo: "novo",
        titulo: "🎭 Gerenciador de Tramas, Arcos & Narrativa com IA (Exclusivo ADM)",
        itens: [
          "✦ **Armazenamento de Cenas de Arco**: Aba dedicada para registrar e gerenciar todas as cenas de arco e treinos de cada jogador, mantendo um histórico narrativo completo.",
          "✦ **Síntese de Tramas Individuais com IA**: O motor cognitivo / ChatGPT analisa a essência do personagem e forja 3 eventos graduais, diagnóstico psicológico, ganchos de ON e antagonistas personalizados.",
          "✦ **Exportação Instantânea para WhatsApp**: Botão de 1 clique para copiar o dossiê da missão pronto para ser enviado nos grupos de roleplay."
        ]
      },
      {
        tipo: "novo",
        titulo: "🔗 Tramas Conjuntas & Arcos Cruzados (Multi-Player)",
        itens: [
          "✦ **Fusão de Histórias**: Ao cruzar dois ou mais jogadores, o sistema cria uma Nova Ficha de Trama Conjunta integrando as cenas de ambos.",
          "✦ **Narrativa Compartilhada com IA**: Gera dinâmicas de dupla (rivalidade, aliança de esquadrões, choque de honra), eventos com ações interdependentes e ameaças coletivas."
        ]
      },
      {
        tipo: "regras",
        titulo: "⚖️ Nivelamento Sagrado de Recompensas de ADM e Sub-ADM",
        itens: [
          "✦ **Paridade Absoluta com Jogadores**: Como a Staff pode cenar no ON e realizar os mesmos treinos, não há mais pontos concedidos por micro-tarefas administrativas, impedindo que escalem de forma desproporcional.",
          "✦ **Recompensa Padronizada**: ADMs e Sub-ADMs recebem atributos exclusivamente através da Narração da Missão Principal (15 pts + Giros) e da Análise/Conclusão de Cenas de Arco (15 pts + Giros)."
        ]
      },
      {
        tipo: "ajuste",
        titulo: "📋 Molde Oficial de Ficha para WhatsApp Simplificado",
        itens: [
          "✦ **Remoção da Seção de Personalidade**: O molde exportado para o WhatsApp agora contém exclusivamente os dados do participante, dados do personagem, atributos e termo de consentimento, mantendo o padrão visual limpo da Malutti."
        ]
      }
    ]
  },
  {
    versao: "6.5",
    titulo: "Redução Dinâmica de Cenas por Infusão de Reiatsu no Kaidō & Desintoxicação de Venenos",
    data: "24 de Agosto de 2026",
    destaque: "Imbuir mais Pressão Espiritual e recitar o encantamento acelera expressivamente a cura, purificação e desintoxicação, reduzindo diretamente as cenas necessárias no WhatsApp (Debilitado curado em 1 Cena com sobrecarga de Reishi!).",
    banner: "assets/bleach-banner.png",
    resumo: "Uma evolução cirúrgica no sistema médico do 4º Esquadrão. A canalização intensiva de Reiatsu (Pressão Espiritual Extra + Encantamento +30%) agora reduz diretamente o número de cenas e turnos exigidos no ON para curar aliados e purificar venenos. Além disso, feitiços especializados como o Kaidō #6 Seika (Purificação) passam a gerar roteiros narrativos e diagnósticos focados em neutralização química e expulsão de toxinas.",
    secoes: [
      {
        tipo: "buff",
        titulo: "⚡ Redução de Turnos e Cenas por Injeção de Reiatsu",
        itens: [
          "✦ **Cura Acelerada de 'Debilitado' em 1 Cena**: Ao injetar Pressão Extra (+50/+100 PE) ou recitar o encantamento completo, o tempo de cura de um aliado 'Debilitado' cai de 2 cenas para **apenas 1 Cena Contínua**!",
          "✦ **Reanimação Crítica Acelerada**: Pacientes em estado 'Derrotado' têm o tempo de reanimação reduzido de 4 cenas para **2 cenas** (ou **1 cena** sob sobrecarga suprema de Reishi).",
          "✦ **Recompensa por Esforço de Reishi**: Quanto mais Pressão o conjurador dedicar à canalização médica, mais rápido o paciente retorna à prontidão de combate (100% vitalidade)."
        ]
      },
      {
        tipo: "novo",
        titulo: "🧪 Desintoxicação & Especialização Médica por Feitiço",
        itens: [
          "✦ **Purificação Celular (#6 Seika)**: Gera diagnósticos e roteiros de cena específicos para neutralização de venenos, ácidos e toxinas retidas nos tecidos.",
          "✦ **Analgesia & Supressão de Dor (#1 Chiyaku)**: Foco em alívio de choque de dor e restauração de lucidez.",
          "✦ **Sutura & Hemostasia (#9 Kekkai Seimei / #16 Hikari no Ito)**: Roteiro focado em tecelagem cirúrgica e fechamento de vasos rompidos."
        ]
      }
    ]
  },
  {
    versao: "6.4",
    titulo: "Simulador de Kaidō na Aba de Kidōs, Bônus de 30% por Encantamento (Eishō) & Loja por Conhecimento",
    data: "24 de Agosto de 2026",
    destaque: "Sub-aba dedicada de Kaidō na Ficha, bônus de +30% da Pressão Espiritual ao recitar o encantamento completo (Eishō), injeção livre de Pressão Extra nos feitiços, aquisição na Loja exclusivamente por Conhecimento e blindagem contra reset de dados.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma atualização definitiva para o sistema de magia e cura da Sociedade das Almas. Os Kidōs agora contam com o bônus canônico de +30% da Pressão Espiritual do conjurador quando o encantamento poético (Eishō) é recitado, a aba de Kidōs da ficha agora possui uma sub-aba exclusiva e dedicada para o Simulador de Kaidō do 4º Esquadrão, a compra de feitiços passa a custar exclusivamente Conhecimento (sem travas de Pressão mínima para a compra) e o sistema de sincronização foi blindado contra resets indesejados.",
    secoes: [
      {
        tipo: "novo",
        titulo: "🌿 Sub-Aba Dedicada de Kaidō & Simulação de Cura na Ficha de Kidōs",
        itens: [
          "✦ **Navegação Direta na Ficha**: A aba de Kidōs agora possui duas seções intuitivas: `💥 Feitiços & Combate (Hadō / Bakudō)` e `🌿 Kaidō & Simulação de Cura (4º Esquadrão)`.",
          "✦ **Simulação Médica Completa**: Escolha o estado do paciente (💀 Derrotado, 🩸 Debilitado, 🩹 Ferido), ative a recitação do encantamento e veja o tempo exato de tratamento no ON (1 a 4 cenas contínuas no WhatsApp), a evolução vital do aliado e o roteiro narrativo oficial."
        ]
      },
      {
        tipo: "buff",
        titulo: "📖 Bônus de +30% de Pressão Espiritual por Encantamento Completo (Eishō)",
        itens: [
          "✦ **Potencialização Canônica**: Recitar o encantamento poético adiciona **+30% da Pressão Espiritual Total do Conjurador** diretamente ao poder final de qualquer Hadō, Bakudō ou Kaidō.",
          "✦ **Comparativo Visual Instantâneo**: Todos os modais e simuladores exibem lado a lado a potência do disparo rápido sem encantamento vs a potência devastadora com encantamento recitado."
        ]
      },
      {
        tipo: "novo",
        titulo: "🌀 Injeção de Pressão Espiritual Extra no Feitiço",
        itens: [
          "✦ **Canalização Livre de Reishi**: O conjurador pode escolher injetar +10, +25, +50 ou +100 pts de Pressão Espiritual adicional no feitiço para amplificar seu impacto de combate ou acelerar a cura de ferimentos mortais."
        ]
      },
      {
        tipo: "regras",
        titulo: "📚 Aquisição na Loja Exclusivamente por Conhecimento (₪)",
        itens: [
          "✦ **Fim da Trava de Pressão para Compra**: Para aprender um feitiço na Biblioteca do Seireitei, o único custo é o Conhecimento (₪) e o espaço de slots de feitiço do seu Patamar.",
          "✦ **Blindagem Anti-Reset na Nuvem**: Corrigida a sincronização periódica em segundo plano para proteger os saldos de Conhecimento e cenas contra sobreposições de dados desatualizados."
        ]
      }
    ]
  },
  {
    versao: "6.3",
    titulo: "Simulador Médico Universal de Kaidō & Cálculo de Cenas de Cura",
    data: "24 de Agosto de 2026",
    destaque: "Simulador de Kaidō integrado diretamente na aba de Atributos da Ficha e na Central Geral de Kidōs, com cálculo exato de Cenas no WhatsApp, evolução vital (Derrotado ➔ Inteiro), restauração de HP e Roteiro Passo a Passo por Cena.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma atualização definitiva para o sistema de medicina espiritual do 4º Esquadrão. O Simulador de Cura de Kaidō agora está disponível em todos os pontos do sistema (Aba de Atributos como o 5º Modo Oficial de Aplicação, Aba de Kidōs da Ficha e Compêndio Supremo de Magias), calculando dinamicamente a duração em cenas que o curandeiro precisa manter o feitiço ativo no ON para recuperar totalmente seus aliados.",
    secoes: [
      {
        tipo: "novo",
        titulo: "🌿 5º Modo Oficial no Simulador de Atributos: Kaidō & Cura Médica",
        itens: [
          "✦ **Integração na Aba de Atributos**: Ao lado de Força X Resiliência, Força X Força, Velocidade X Velocidade e Pressão X Pressão, agora existe o modo **🌿 Kaidō & Cura Médica**, permitindo testar a eficácia da Pressão Espiritual na cura de aliados.",
          "✦ **Seletor de Estado do Paciente**: Escolha entre 💀 **Derrotado** (Crítico/Coma), 🩸 **Debilitado** (Fraturas/Hemorragias graves) e 🩹 **Ferido** (Cortes/Moderado).",
          "✦ **Cálculo de Cenas no WhatsApp**: Revela se a recuperação exige 1, 2, 3 ou 4 cenas contínuas no ON.",
          "✦ **Roteiro Narrativo por Cena**: Orienta o jogador exatamente sobre como descrever a evolução médica em cada cena no grupo do WhatsApp."
        ]
      },
      {
        tipo: "regras",
        titulo: "📖 Central Geral de Kidōs com Simulador de Kaidō Integrado",
        itens: [
          "✦ **Simulador Aberto no Grimório**: Jogadores e mestres agora podem simular tratamentos médicos na aba geral de Kidōs do menu superior, sem necessidade de possuir a ficha aberta.",
          "✦ **Ajuste de Requisitos para Iniciantes**: Feitiços básicos de cura (#1 ao #5) calibrados para a Pressão Espiritual inicial (10 pts), permitindo que qualquer recém-formado do 4º Esquadrão pratique Kaidō."
        ]
      }
    ]
  },
  {
    versao: "6.2",
    titulo: "Fundo Inicial Shinigami, Sincronização Automática de Cenas & Limite Escalonado de Feitiços",
    data: "24 de Agosto de 2026",
    destaque: "Fundo Inicial de 450 ₪ de Conhecimento para Shinigamis (Escolha Livre de 4 Kidōs), Sincronização Direta de Cenas no WhatsApp (1 cena = 100 ₪), Limite e Capacidade Escalonada de Feitiços por Patamar Espiritual e Barra de Gestão Rápida de ADM.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma atualização estrutural no equilíbrio místico que concede liberdade inicial aos Shinigamis através de uma reserva de 450 ₪ de Conhecimento para escolherem seus 4 primeiros Kidōs na loja, vincula a geração de Conhecimento à produção de cenas no WhatsApp de forma automatizada e estabelece o teto de feitiços ativos de acordo com o Patamar de Pressão Espiritual do personagem.",
    secoes: [
      {
        tipo: "novo",
        titulo: "📚 Fundo Inicial de Conhecimento Shinigami (450 ₪)",
        itens: [
          "✦ **Fim dos Feitiços Fixos Obrigatórios**: Shinigamis recém-criados ou resetados não recebem mais magias fixas pré-definidas. Em vez disso, recebem um **Fundo de Conhecimento de 450 ₪** para irem até a Loja do Seireitei e escolherem livremente seus 4 feitiços básicos favoritos de Hadō, Bakudō ou Kaidō.",
          "✦ **Sincronização de Cenas com Conhecimento**: Cada cena no WhatsApp lançada pela Administração gera automaticamente **+100 ₪ de Conhecimento**, mantendo a progressão contínua da alma alinhada à sua atividade ON."
        ]
      },
      {
        tipo: "regras",
        titulo: "⚖️ Capacidade Mística por Patamar (Power Scaling de Kidō)",
        itens: [
          "✦ **Iniciante / Inexperiente (<31 PE)**: Capacidade de até **4 Feitiços Iniciais** (#1 a #19). Impede que novatos acumulem dezenas de feitiços de alto escalão sem evoluir seus atributos.",
          "✦ **Treinado (31–60 PE)**: Até **6 Feitiços** (#1 a #29).",
          "✦ **Experiente (61–150 PE)**: Até **8 Feitiços** (#1 a #49).",
          "✦ **Alto Nível / Tenente (151–250 PE)**: Até **12 Feitiços** (#1 a #69).",
          "✦ **Monstruoso / Capitão (251–400 PE)**: Até **16 Feitiços** (#1 a #89).",
          "✦ **Lendário / Capitão Sênior (401–600 PE)**: Até **24 Feitiços** (#1 a #99).",
          "✦ **Transcendente (601+ PE)**: Ilimitado (Mestria Plena do Reishi)."
        ]
      },
      {
        tipo: "social",
        titulo: "👑 Gestão de ADM Otimizada na Ficha & Painel",
        itens: [
          "✦ **Barra Dourada de Gestão de ADM**: Ao acessar a aba de Kidōs de qualquer personagem, o ADM conta com atalhos de `+100 ₪`, `+500 ₪`, `+1000 ₪`, `+5 Cenas (+500 ₪)` e `✏️ Saldo Manual` com atualização instantânea na tela.",
          "✦ **Busca Rápida de Atividade**: Campo no painel de cenas que filtra simultaneamente por nome do personagem ou pelo código oficial `ACT-XXXX`."
        ]
      }
    ]
  },
  {
    versao: "6.1",
    titulo: "O Compêndio Médico do 4º Esquadrão & Simulador de Cenas de Kaidō",
    data: "24 de Agosto de 2026",
    destaque: "Simulador Avançado de Kaidō com cálculo exato de Cenas no ON, Evolução de Estado do Aliado (Derrotado ➔ Debilitado ➔ Ferido ➔ Inteiro), Roteiro de Narração por Cena para o WhatsApp e Molde Oficial Otimizado.",
    banner: "assets/bleach-banner.png",
    resumo: "Uma atualização focada no aprofundamento do roleplay médico do 4º Esquadrão e da mecânica de suporte em combate. Introduz o simulador de Kaidō que calcula a quantidade exata de cenas contínuas que o curandeiro precisa manter o feitiço ativo no WhatsApp para salvar ou reabilitar seus aliados, acompanhado da evolução de estados vitais e roteiro narrativo por cena, além da simplificação do molde oficial de ficha do WhatsApp.",
    secoes: [
      {
        tipo: "novo",
        titulo: "🌿 Simulador de Cura & Cenas de Kaidō",
        itens: [
          "✦ **Seletor de Estado Inicial do Aliado**: Permite selecionar a gravidade do paciente entre 💀 **Derrotado** (Crítico/Coma), 🩸 **Debilitado** (Fraturas/Hemorragias graves) e 🩹 **Ferido** (Cortes/Moderado).",
          "✦ **Cálculo de Cenas no ON**: Com base na Pressão Espiritual investida e nível do Kaidō, calcula se a cura exige 1, 2, 3 ou 4 cenas contínuas no WhatsApp.",
          "✦ **Evolução de Estado Vital**: Mostra a transição do estado do guerreiro (ex: `Derrotado ➔ Inteiro` ou `Debilitado ➔ Ferido`) e a porcentagem de vitalidade restaurada.",
          "✦ **Roteiro de Narração Passo-a-Passo**: Fornece instruções detalhadas para cada cena no WhatsApp (ex: Cena 1: Estabilização de emergência e hemostasia; Cena 2: Recomposição de tecidos e reinfusão de Reishi).",
          "✦ **Diagnóstico do 4º Esquadrão**: Recomendações e diretrizes táticas para mestres curandeiros e socorristas de campo."
        ]
      },
      {
        tipo: "regras",
        titulo: "📋 Otimização do Molde Oficial WhatsApp",
        itens: [
          "✦ **Molde Direto e Focado**: Removidas seções extensas de Shikai/Bankai e Kidōs do molde de exportação rápida, mantendo apenas Dados do Participante, Dados do Personagem, Código de Atividade (ON) e Atributos Espirituais.",
          "✦ **Selo de Autenticidade**: Preservada a assinatura e diagramação visual oficial ✧ 𝗠𝗮𝗱𝗲 𝗕𝘆 𝗠𝗮𝗹𝘂𝘁𝘁𝗶 ✧ com suporte a cópia em 1 clique."
        ]
      }
    ]
  },
  {
    versao: "6.0",
    titulo: "A Economia do Conhecimento, Grimório de Kidōs & Ranking Semanal de Atividade",
    data: "24 de Agosto de 2026",
    destaque: "Moeda de Conhecimento (₪), Árvore de Aprendizagem de Kidōs em 3 Trilhas, Loja Dinâmica do Seireitei, Código Identificador de Atividade único (ACT-XXXX), Ranking Semanal com Ciclo de 7 Dias e Lançamento de Cenas em Lote no ADM.",
    banner: "assets/bleach-banner.png",
    resumo: "A maior expansão de progressão e economia espiritual do RPG! Apresenta o sistema de Conhecimento obtido por atividade no WhatsApp, a Árvore de Aprendizagem de Kidōs com graduações de maestria, a Loja Dinâmica de Feitiços com destaque dourado para compras disponíveis, códigos identificadores para todos os personagens, ranking semanal com premiações (+15, +10 e +5 pontos livres para o Top 3) e ferramentas de gestão em lote para a Administração.",
    secoes: [
      {
        tipo: "novo",
        titulo: "📚 Economia de Conhecimento & Loja de Kidōs",
        itens: [
          "✦ **Moeda de Conhecimento (₪)**: Moeda ganha através da produção de cenas no WhatsApp, utilizada para adquirir feitiços na Biblioteca do Seireitei.",
          "✦ **Árvore de Aprendizagem RPG**: Modal em 3 trilhas elementais (Hadō, Bakudō e Kaidō) com explicação do sistema de Conhecimento e 4 Tiers de maestria.",
          "✦ **Loja Dinâmica do Seireitei**: Kidōs que o Shinigami já pode comprar brilham em dourado com animação pulsante; feitiços com requisitos faltantes permanecem apagados com indicação clara do que falta (Conhecimento ou Pressão Espiritual mínima).",
          "✦ **Ficha Focada em Kidōs Aprendidos**: A aba de Kidōs da ficha agora exibe apenas os feitiços dominados pelo jogador, com botões para abrir detalhes e conjurar em cena."
        ]
      },
      {
        tipo: "social",
        titulo: "🆔 Código de Atividade (ON) & Lançamento em Lote ADM",
        itens: [
          "✦ **Código Identificador Único**: Cada personagem recebe um código fixo (ex: `ACT-5476`) para colocar no contador de cenas do WhatsApp.",
          "✦ **Lançamento em Lote no Painel ADM**: Nova aba para os avaliadores lançarem a quantidade de cenas do dia de uma vez só (+1, +2, +5, +10, +20), creditando Conhecimento automaticamente sem precisar registrar de 1 em 1."
        ]
      },
      {
        tipo: "regras",
        titulo: "🏆 Ranking Semanal de Atividade (Ciclo de 7 Dias)",
        itens: [
          "✦ **Contador Regressivo de 7 Dias**: Contador dinâmico que atualiza a cada dia (7, 6, 5, 4, 3, 2, 1, Dia da Recompensa!).",
          "✦ **Premiações Oficiais dos Top 3**: 🥇 1º Lugar: **+15 Pontos de Atributos Livres** | 🥈 2º Lugar: **+10 Pontos de Atributos Livres** | 🥉 3º Lugar: **+5 Pontos de Atributos Livres**.",
          "✦ **Distribuição em 1 Clique**: Botão administrativo para encerrar a rodada, creditar os pontos nos vencedores e iniciar um novo ciclo de 7 dias."
        ]
      },
      {
        tipo: "buffs",
        titulo: "📕 Grimório de Kidōs Ampliado",
        itens: [
          "✦ **Mais de 50 Feitiços Canônicos**: Hadō #1 a #99, Bakudō #1 a #99 e Kaidō #1 a #90 balanceados com requisitos mínimos de Pressão Espiritual e custos de Conhecimento."
        ]
      }
    ]
  },
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
