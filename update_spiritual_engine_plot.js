const fs = require('fs');

let code = fs.readFileSync('spiritual_engine.js', 'utf8');

// Replace the old AI plot synthesis functions with the new deep semantic analyzer & multi-branch generator
const newPlotEngine = `
// =========================================================================
// DEEP SEMANTIC SCENE ANALYZER & AI PLOT GENERATION ENGINE (MULTI-BRANCH)
// =========================================================================

function analisarCenaSemanticaBleach(cenas = [], player = {}) {
  const textoGeral = (cenas || []).map(c => \`\${c.titulo || ''} \${c.texto || ''}\`).join(" \\n ");
  const textoLower = textoGeral.toLowerCase();

  // 1. Oponentes e Ameaças Detectados
  const oponentes = [];
  if (textoLower.includes("vasto lorde")) oponentes.push("Vasto Lorde (Hollow Supremo)");
  else if (textoLower.includes("adjuchas")) oponentes.push("Adjuchas (Predador de Almas)");
  else if (textoLower.includes("gillian") || textoLower.includes("menos grande")) oponentes.push("Menos Grande / Gillian");
  else if (textoLower.includes("hollow")) oponentes.push("Hollow Mascarado com Reishi Anormal");

  if (textoLower.includes("quincy") || textoLower.includes("sternritter") || textoLower.includes("wandenreich") || textoLower.includes("arco espiritual")) {
    oponentes.push("Quincy / Soldado do Império das Sombras");
  }
  if (textoLower.includes("arrancar") || textoLower.includes("espada") || textoLower.includes("ressurreição")) {
    oponentes.push("Arrancar de Lâmina Selada");
  }
  if (textoLower.includes("desertor") || textoLower.includes("traidor") || textoLower.includes("renegado")) {
    oponentes.push("Shinigami Desertor do Seireitei");
  }
  if (textoLower.includes("nobre") || textoLower.includes("conspira") || textoLower.includes("central 46")) {
    oponentes.push("Conspirador da Nobreza de Seireitei");
  }
  if (oponentes.length === 0) {
    oponentes.push("Entidade Espiritual Corrompida de Alto Calibre");
  }

  // 2. Locais Detectados
  const locais = [];
  if (textoLower.includes("karakura") || textoLower.includes("mundo humano") || textoLower.includes("escola") || textoLower.includes("cidade")) {
    locais.push("Karakura (Mundo dos Vivos)");
  }
  if (textoLower.includes("zaraki") || textoLower.includes("distrito 80") || textoLower.includes("distrito 7") || textoLower.includes("rukongai") || textoLower.includes("vila")) {
    locais.push("Rukongai (Distritos Periféricos)");
  }
  if (textoLower.includes("seireitei") || textoLower.includes("quartel") || textoLower.includes("divisão") || textoLower.includes("esquadrão") || textoLower.includes("academia")) {
    locais.push("Seireitei (Corte dos Shinigamis)");
  }
  if (textoLower.includes("hueco mundo") || textoLower.includes("las noches") || textoLower.includes("deserto branco")) {
    locais.push("Hueco Mundo (Deserto Branco & Las Noches)");
  }
  if (textoLower.includes("dangai") || textoLower.includes("senkaimon") || textoLower.includes("garganta")) {
    locais.push("Travessia Espiritual (Senkaimon & Dangai)");
  }
  if (locais.length === 0) {
    locais.push("Limiar entre o Seireitei e Rukongai");
  }

  // 3. Elementos, Feitiços e Técnicas
  const elementos = [];
  if (textoLower.includes("fogo") || textoLower.includes("chama") || textoLower.includes("queimar") || textoLower.includes("cinzas")) elementos.push("Fogo & Chamas");
  if (textoLower.includes("gelo") || textoLower.includes("congelar") || textoLower.includes("geada")) elementos.push("Gelo & Cristal");
  if (textoLower.includes("relâmpago") || textoLower.includes("trovão") || textoLower.includes("raio")) elementos.push("Trovão & Relâmpago");
  if (textoLower.includes("trevas") || textoLower.includes("sombra") || textoLower.includes("obscur")) elementos.push("Trevas & Sombras");
  if (textoLower.includes("vento") || textoLower.includes("lâmina de ar")) elementos.push("Vento Cortante");
  if (textoLower.includes("veneno") || textoLower.includes("toxina") || textoLower.includes("corros")) elementos.push("Veneno & Corrosão");
  if (textoLower.includes("ilusão") || textoLower.includes("espelho") || textoLower.includes("névoa")) elementos.push("Ilusão & Miragem");
  if (textoLower.includes("aço") || textoLower.includes("corte") || textoLower.includes("lâmina") || textoLower.includes("espada")) elementos.push("Corte de Aço Puro");
  if (textoLower.includes("hadō") || textoLower.includes("bakudō") || textoLower.includes("kaidō")) elementos.push("Kidō & Encantamentos");
  if (elementos.length === 0) elementos.push("Reishi Puro & Impacto Cortante");

  // 4. Clímax e Sentença de Destaque
  const frases = textoGeral.split(/[.!?\\n]+/).map(f => f.trim()).filter(f => f.length > 20);
  const momentoChave = frases.length > 0 ? frases.slice(-1)[0] : \`O guerreiro \${player?.nome || 'Shinigami'} concluiu a ação com postura marcial inabalável.\`;

  return {
    qtdCenas: (cenas || []).length,
    oponentePrincipal: oponentes[0],
    localPrincipal: locais[0],
    elementosDetectados: elementos,
    momentoChave,
    resumoCenas: (cenas || []).map((c, i) => \`[\${i + 1}] \${c.titulo || 'Cena'}: \${(c.texto || '').slice(0, 100)}...\`).join(' | ')
  };
}

function sintetizarTramaIndividualHeuristica(player, cenas = []) {
  const pNome = player?.nome || "Guerreiro Espiritual";
  const pRaca = player?.raca || "Shinigami";
  const pEsq = player?.esquadrao || "11º Esquadrão";
  const pAtributos = player?.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 };
  const total = Object.values(pAtributos).reduce((a, b) => a + b, 0);
  const pPatamar = (typeof getPowerTier === 'function') ? getPowerTier(total).title : "Shinigami Treinado";
  const zkNome = player?.zanpakuto?.shikaiAtiva?.nome || player?.zanpakuto?.nome || "Zanpakutō Interior";
  const zkCmd = player?.zanpakuto?.shikaiAtiva?.comando || "Desperte";

  // Semantic Scene Analysis
  const analise = analisarCenaSemanticaBleach(cenas, player);
  const opPrincipal = analise.oponentePrincipal;
  const locPrincipal = analise.localPrincipal;
  const momChave = analise.momentoChave;

  const analiseDiagnostico = \`A análise das cenas de \${pNome} (\${pEsq}, \${pPatamar}) revela um confronto direto contra \${opPrincipal} em \${locPrincipal}. A narrativa evidenciou o impacto de '\${momChave}', demonstrando que \${pNome} está à beira de uma ruptura de poder com sua lâmina (\${zkNome}).\`;

  // OPÇÃO 1: COMBATE DECISIVO (PROVAÇÃO MARCIAL)
  const opcao1 = {
    id: "opcao_1",
    tipo: "combate",
    nomeOpcao: "⚔️ Opção 1: Caminho do Confronto Direto (Provação Marcial)",
    tituloArco: \`Arco de \${pNome} — O Veredito de Sangue em \${locPrincipal}\`,
    focoNarrativo: \`O combate anterior contra \${opPrincipal} foi apenas o prelúdio. O inimigo retornará com uma força esmagadora, exigindo que \${pNome} supere seus limites físicos e marciais no campo de batalha.\`,
    eventos: [
      {
        numero: 1,
        fase: "Evento 1: O Rastro da Batalha (Investigação & Emboscada)",
        titulo: \`Caçada em \${locPrincipal}\`,
        descricao: \`\${pNome} segue os vestígios deixados na cena anterior. Em meio aos escombros, é emboscado por batedores e precisa manter a compostura marcial.\`,
        objetivoCena: "Investigar os rastros da última batalha, conter a emboscada sem hesitar e identificar o ponto fraco do bando inimigo.",
        desafioSugerido: "Superar armadilhas de terreno usando velocidade (Shunpo) e cortes precisos de Zanpakutō."
      },
      {
        numero: 2,
        fase: "Evento 2: A Fúria Desencadeada (Duelo Intermediário)",
        titulo: \`Choque de Titãs: \${zkNome} vs \${opPrincipal}\`,
        descricao: \`O confronto direto explode. O oponente tenta anular os movimentos de \${pNome} usando técnicas corruptas de Reishi.\`,
        objetivoCena: \`Manter a postura marcial, sincronizar o comando '\${zkCmd}' e contra-atacar sob pressão extrema.\`,
        desafioSugerido: "Uso estratégico de Kidōs de suporte ou combinação de força e velocidade para quebrar a guarda inimiga."
      },
      {
        numero: 3,
        fase: "Evento 3: O Clímax & Golpe Final",
        titulo: \`A Lâmina Suprema de \${pNome}\`,
        descricao: \`A batalha atinge o ápice com o oponente liberando sua forma máxima. \${pNome} executa sua técnica definitiva em uma narração épica.\`,
        objetivoCena: "Desferir o golpe decisivo de liberação da Zanpakutō e proteger os aliados/civis do Seireitei.",
        desafioSugerido: "Conclusão épica com descrição detalhada do impacto visual e espiritual do golpe de misericórdia."
      }
    ],
    antagonista: {
      nome: opPrincipal,
      titulo: \`O Algoz de \${locPrincipal}\`,
      origem: \`Gerado pelas cicatrizes de batalha e perturbações de Reishi em \${locPrincipal}.\`,
      motivacao: \`Destruir a honra de \${pNome} e provar a fragilidade dos guerreiros do \${pEsq}.\`,
      fraquezaChave: \`Vulnerável a ataques frontais de alta velocidade e liberação sincronizada de \${zkNome}.\`
    },
    briefingWhatsApp: \`\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`
👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗔𝗥𝗖𝗢 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟭: 𝗖𝗢𝗠𝗕𝗔𝗧𝗘 𝗗𝗜𝗥𝗘𝗧𝗢
✶ „ Jogador: \${pNome} [\${player?.codigoAtividade || 'ACT-0000'}]
✶ „ Esquadrão: \${pEsq} • Patamar: \${pPatamar}
✶ „ Título: Arco de \${pNome} — O Veredito de Sangue em \${locPrincipal}
✶ „ Foco: Provação Marcial & Duelo contra \${opPrincipal}

📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗗𝗔 𝗠𝗜𝗦𝗦𝗔̃𝗢 (𝗢𝗡):
Após o clímax da cena anterior onde "\${momChave}", \${pNome} é convocado para conter o avanço devastador de \${opPrincipal} em \${locPrincipal}. O confronto exigirá maestria absoluta no uso de \${zkNome}!

🎯 𝗢𝗕𝗝𝗘𝗧𝗜𝗩𝗢 𝗗𝗔 𝗣𝗥𝗢́𝗫𝗜𝗠𝗔 𝗖𝗘𝗡𝗔:
1. Dirigir-se a \${locPrincipal} e narrar sua prontidão de combate (mínimo 30 linhas treino / 90 linhas arco).
2. Investigar os escombros da última batalha e travar o primeiro duelo de lâminas!

✧ Recompensa Garantida: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial!
\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`\`
  };

  // OPÇÃO 2: CONSPIRAÇÃO OCULTA (INVESTIGAÇÃO & MISTÉRIO)
  const opcao2 = {
    id: "opcao_2",
    tipo: "misterio",
    nomeOpcao: "🕵️ Opção 2: Caminho da Conspiração Oculta (Mistério & Blefe)",
    tituloArco: \`Arco de \${pNome} — A Sombra nos Bastidores do Seireitei\`,
    focoNarrativo: \`O ataque ocorrido na cena anterior não foi um evento isolado, mas parte de uma conspiração maior que envolve traição e segredos ocultos nos registros da Soul Society.\`,
    eventos: [
      {
        numero: 1,
        fase: "Evento 1: O Enigma nos Escombros (Infiltração)",
        titulo: "Pistas Silenciosas",
        descricao: \`\${pNome} recolhe fragmentos de Reishi corrompido deixados pelo inimigo e descobre que as armas foram forjadas secretamente no Seireitei.\`,
        objetivoCena: "Interrogar informantes em Rukongai e infiltrar-se em arquivos proibidos sem alertar os traidores.",
        desafioSugerido: "Uso de furtividade, percepção espiritual e Bakudōs de silenciamento."
      },
      {
        numero: 2,
        fase: "Evento 2: O Jogo de Blefes & Armadilha Psicológica",
        titulo: "Traição Desmascarada",
        descricao: \`O conspirador tenta subornar ou chantagear \${pNome}, forçando-o a um jogo tenso de blefes e armadilhas de ilusão.\`,
        objetivoCena: "Resistir à manipulação psicológica e desmascarar a identidade do traidor perante o esquadrão.",
        desafioSugerido: "Superar ilusões de Kidō e manter a integridade mental sob pressão."
      },
      {
        numero: 3,
        fase: "Evento 3: O Julgamento de Aço",
        titulo: \`A Queda da Conspiração\`,
        descricao: \`Batalha final contra o mentor da conspiração nos limites do Seireitei, selando o plano sombrio de vez.\`,
        objetivoCena: "Neutralizar o traidor, recuperar os registros roubados e restaurar a ordem na Soul Society.",
        desafioSugerido: "Execução de um selamento tático com Kidō ou corte decisivo de Zanpakutō."
      }
    ],
    antagonista: {
      nome: "O Mestre das Sombras (Oficial Desertor)",
      titulo: "O Arquiteto da Traição",
      origem: "Infiltrado nos setores burocráticos do Seireitei manipulando eventos de bastidores.",
      motivacao: "Desestabilizar a hierarquia dos capitães e tomar o controle das rotas espirituais.",
      fraquezaChave: "Insegurança em combates corpo a corpo quando suas ilusões são dissipadas."
    },
    briefingWhatsApp: \`\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`
👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗔𝗥𝗖𝗢 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟮: 𝗖𝗢𝗡𝗦𝗣𝗜𝗥𝗔𝗖̧𝗔̃𝗢 𝗢𝗖𝗨𝗟𝗧𝗔
✶ „ Jogador: \${pNome} [\${player?.codigoAtividade || 'ACT-0000'}]
✶ „ Esquadrão: \${pEsq} • Patamar: \${pPatamar}
✶ „ Título: Arco de \${pNome} — A Sombra nos Bastidores do Seireitei
✶ „ Foco: Investigação, Blefe & Desmascarar Conspiração

📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗗𝗔 𝗠𝗜𝗦𝗦𝗔̃𝗢 (𝗢𝗡):
A cena onde "\${momChave}" revelou pistas perturbadoras. O ataque foi arquitetado por conspiradores infiltrados. \${pNome} deve seguir o rastro das pistas antes que o traidor execute seu plano maior!

🎯 𝗢𝗕𝗝𝗘𝗧𝗜𝗩𝗢 𝗗𝗔 𝗣𝗥𝗢́𝗫𝗜𝗠𝗔 𝗖𝗘𝗡𝗔:
1. Iniciar a investigação em Rukongai/Seireitei (mínimo 30 linhas treino / 90 linhas arco).
2. Rastrear o selo do conspirador e desarmar a primeira armadilha de bastidores!

✧ Recompensa Garantida: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial!
\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`\`
  };

  // OPÇÃO 3: DILEMA MORAL & DESPERTAR ESPIRITUAL
  const opcao3 = {
    id: "opcao_3",
    tipo: "despertar",
    nomeOpcao: "⚖️ Opção 3: Caminho do Despertar da Alma (Ressonância da Zanpakutō)",
    tituloArco: \`Arco de \${pNome} — O Despertar da Alma & A Provação de \${zkNome}\`,
    focoNarrativo: \`O choque narrativo da última cena fez a Zanpakutō \${zkNome} silenciar ou exigir uma evolução espiritual profunda de seu portador, forçando um teste de convicção e limites.\`,
    eventos: [
      {
        numero: 1,
        fase: "Evento 1: O Silêncio da Lâmina (Conflito Interior)",
        titulo: "O Eco do Mundo Interior",
        descricao: \`\${pNome} entra em meditação profunda (Jinzen). A alma da Zanpakutō recusa-se a obedecer até que o guerreiro encare seu maior medo/hesitação.\`,
        objetivoCena: "Dialogar e duelar contra a manifestação espiritual de sua própria lâmina no mundo interior.",
        desafioSugerido: "Narração psicológica rica detalhando o ambiente mental e a filosofia de sua arma."
      },
      {
        numero: 2,
        fase: "Evento 2: A Provação do Sacrifício",
        titulo: "O Teste de Sangue & Honra",
        descricao: \`Enquanto medita, uma ameaça repentina ataca os inocentes sob sua vigília. \${pNome} precisa lutar com Reishi limitado para provar sua determinação.\`,
        objetivoCena: "Proteger os aliados sem depender apenas de poder bruto, demonstrando maturidade tática.",
        desafioSugerido: "Uso engenhoso de combate básico, esquivas perfeitas e resiliência espiritual."
      },
      {
        numero: 3,
        fase: "Evento 3: A Fusão de Convicções (Despertar Lendário)",
        titulo: \`A Dança Harmoniosa de \${zkNome}\`,
        descricao: \`A lâmina reconhece a verdadeira vontade de \${pNome}. O Reishi explode em harmonia absoluta, culminando em uma liberação majestosa.\`,
        objetivoCena: "Executar a liberação definitiva em harmonia com a Zanpakutō e aniquilar a ameaça restante.",
        desafioSugerido: "Liberação triunfante com narração da ressonância espiritual entre portador e lâmina."
      }
    ],
    antagonista: {
      nome: \`A Sombra da Dúvida (Avatar Espiritual Interior)\`,
      titulo: "O Reflexo da Hesitação",
      origem: "Manifestado das dúvidas e memórias não resolvidas no coração do guerreiro.",
      motivacao: "Testar se o guerreiro é digno de empunhar a lâmina sem hesitação.",
      fraquezaChave: "Desaparece quando confrontado com determinação inabalável e auto-aceitação."
    },
    briefingWhatsApp: \`\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`
👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗔𝗥𝗖𝗢 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟯: 𝗗𝗘𝗦𝗣𝗘𝗥𝗧𝗔𝗥 𝗗𝗔 𝗔𝗟𝗠𝗔
✶ „ Jogador: \${pNome} [\${player?.codigoAtividade || 'ACT-0000'}]
✶ „ Esquadrão: \${pEsq} • Patamar: \${pPatamar}
✶ „ Título: Arco de \${pNome} — O Despertar da Alma & A Provação de \${zkNome}
✶ „ Foco: Conexão Espiritual & Provação da Zanpakutō

📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗗𝗔 𝗠𝗜𝗦𝗦𝗔̃𝗢 (𝗢𝗡):
Diante dos acontecimentos onde "\${momChave}", \${zkNome} clama por uma evolução espiritual definitiva. \${pNome} deve enfrentar o teste de sua própria lâmina para desbloquear o próximo patamar de maestria!

🎯 𝗢𝗕𝗝𝗘𝗧𝗜𝗩𝗢 𝗗𝗔 𝗣𝗥𝗢́𝗫𝗜𝗠𝗔 𝗖𝗘𝗡𝗔:
1. Narrar a entrada no Mundo Interior / Meditação Jinzen (mínimo 30 linhas treino / 90 linhas arco).
2. Confrontar a manifestação de \${zkNome} e provar a pureza de sua convicção marcial!

✧ Recompensa Garantida: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial!
\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`\`
  };

  return {
    analiseCenas: {
      qtdCenas: (cenas || []).length,
      oponentePrincipal: opPrincipal,
      localPrincipal: locPrincipal,
      elementosDetectados: analise.elementosDetectados,
      momentoChave: momChave,
      diagnostico: analiseDiagnostico
    },
    opcoesTramas: [opcao1, opcao2, opcao3],
    opcaoAtivaId: "opcao_1",
    tituloArco: opcao1.tituloArco,
    faseAtual: "Fase 1: Convocação & Premonição",
    diagnosticoPsicologico: analiseDiagnostico,
    ganchoImediato: opcao1.focoNarrativo,
    eventos: opcao1.eventos,
    antagonista: opcao1.antagonista,
    recompensaArco: "Garantido de 15 Pontos de Atributo + 2 Giros de Sorteio Comum + 1 Giro Especial de Seireitei",
    briefingWhatsApp: opcao1.briefingWhatsApp
  };
}

function sintetizarTramaConjuntaHeuristica(players = [], cenasConjuntas = []) {
  const p1 = players[0] || { nome: "Guerreiro 1", esquadrao: "11º Esquadrão", codigoAtividade: "ACT-0001" };
  const p2 = players[1] || { nome: "Guerreiro 2", esquadrao: "4º Esquadrão", codigoAtividade: "ACT-0002" };

  const nomesStr = players.map(p => p.nome).join(" & ");
  const codigosStr = players.map(p => p.codigoAtividade || getCodigoAtividade(p)).join(" / ");

  const analise = analisarCenaSemanticaBleach(cenasConjuntas, p1);
  const opPrincipal = analise.oponentePrincipal || "Menos Grande Híbrido";
  const locPrincipal = analise.localPrincipal || "Distritos Periféricos de Rukongai";

  const opcaoConj1 = {
    id: "conj_opcao_1",
    nomeOpcao: "⚔️ Opção 1: Aliança de Sangue (Combate Cooperativo Sincronizado)",
    tituloArco: \`Arco Cruzado: A Queda do Titã em \${locPrincipal} (\${nomesStr})\`,
    dinamicaDupla: \`Cooperação Tática & União de Forças (\${p1.esquadrao} ⚔️ \${p2.esquadrao})\`,
    sinopse: \`Um incidente em \${locPrincipal} une \${p1.nome} e \${p2.nome} contra uma ameaça que nenhum guerreiro pode derrotar isoladamente (\${opPrincipal}). Ambos devem intercalar ataques e defesas sincronizadas no ON.\`,
    eventosCruzados: [
      {
        fase: "Fase 1: O Choque Inicial & Convocação Conjunta (ON)",
        descricao: \`\${p1.nome} e \${p2.nome} são emboscados em \${locPrincipal}. A força de Reishi do monstro obriga os dois a unirem suas lâminas.\`,
        papelPlayer1: \`Abrir brecha na vanguarda (\${p1.nome}).\`,
        papelPlayer2: \`Suporte tático, barreira ou cura (\${p2.nome}).\`,
        ganchoWhats: \`Primeira cena no ON com diálogo e ataque combinado de \${p1.nome} e \${p2.nome}.\`
      },
      {
        fase: "Fase 2: A Provação Cruzada (Ação de um afeta o outro)",
        descricao: \`O monstro isola os dois em domínios de Reishi. Para que \${p1.nome} sobreviva, \${p2.nome} precisará neutralizar a fonte de energia a tempo.\`,
        papelPlayer1: "Conter o dano devastador da criatura.",
        papelPlayer2: "Executar técnica de anulação ou quebra de selo.",
        ganchoWhats: "Interação contínua onde a rolagem/narração de um altera o estado do parceiro."
      },
      {
        fase: "Fase 3: Batalha Cooperativa Decisiva (Clímax)",
        descricao: \`Ataque simultâneo com liberação de Zanpakutōs em sincronia perfeita, selando o inimigo.\`,
        papelPlayer1: "Golpe de impacto supremo.",
        papelPlayer2: "Selo de contenção / cura final.",
        ganchoWhats: "Conclusão épica compartilhada no grupo de roleplay."
      }
    ],
    ameacaComum: {
      nome: opPrincipal,
      perigo: "Anula danos isolados; só é vulnerável a ataques intercalados de dois guerreiros.",
      mecanicaEspecial: "Exige intercalação de turnos narrativos contínuos no WhatsApp."
    },
    briefingWhatsApp: \`\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`
👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗧𝗥𝗔𝗠𝗔 𝗖𝗢𝗡𝗝𝗨𝗡𝗧𝗔 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟭: 𝗔𝗟𝗜𝗔𝗡𝗖̧𝗔 𝗗𝗘 𝗦𝗔𝗡𝗚𝗨𝗘
✶ „ Jogadores Envolvidos: \${nomesStr}
✶ „ Códigos de Atividade: \${codigosStr}
✶ „ Título: Arco Cruzado — A Queda do Titã em \${locPrincipal}
✶ „ Dinâmica: \${p1.esquadrao} ⚔️ \${p2.esquadrao}

📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗖𝗢𝗠𝗣𝗔𝗥𝗧𝗜𝗟𝗛𝗔𝗗𝗔:
Uma anomalia de extrema gravidade em \${locPrincipal} exige a colaboração imediata de \${p1.nome} e \${p2.nome}. A ameaça \${opPrincipal} só poderá ser contida com sincronia total de Reishi!

🎯 𝗜𝗡𝗦𝗧𝗥𝗨𝗖̧𝗢̃𝗘𝗦 𝗣𝗔𝗥𝗔 𝗢𝗦 𝗝𝗢𝗚𝗔𝗗𝗢𝗥𝗘𝗦:
1. Cenar juntos em interação contínua no grupo (mínimo 30 a 90 linhas conjuntas).
2. Intercalar ações combinando suas técnicas e liberando suas Zanpakutōs em sincronia.

✧ Recompensa Garantida para Ambos: 15 Pontos de Atributo + 2 Giros Comuns + 1 Giro Especial cada!
\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`\`
  };

  const opcaoConj2 = {
    id: "conj_opcao_2",
    nomeOpcao: "⚖️ Opção 2: Choque Ideológico & Provação Cruzada (Conflito de Honra)",
    tituloArco: \`Arco Cruzado: O Julgamento de Honra em \${locPrincipal} (\${nomesStr})\`,
    dinamicaDupla: \`Divergência de Métodos & Respeito Mútuo (\${p1.esquadrao} vs \${p2.esquadrao})\`,
    sinopse: \`Enquanto \${p1.nome} busca aniquilar o alvo custe o que custar, \${p2.nome} defende a preservação das leis e dos civis. O confronto forçará os dois a aprenderem com os ideais um do outro.\`,
    eventosCruzados: [
      {
        fase: "Fase 1: O Choque de Ordens",
        descricao: \`Ambos recebem ordens conflitantes da Central 46 e dos seus respectivos Capitães.\`,
        papelPlayer1: "Investir na ofensiva imediata.",
        papelPlayer2: "Montar perímetro de contenção e resgate.",
        ganchoWhats: "Debate e duelo verbal com primeiras demonstrações de postura marcial."
      },
      {
        fase: "Fase 2: A Provação do Meio-Termo",
        descricao: "Uma armadilha mortal coloca ambos em risco, provando que nenhum dos métodos isolados funciona.",
        papelPlayer1: "Reconhecer o valor da contenção tática.",
        papelPlayer2: "Liberar a ferocidade de combate necessária.",
        ganchoWhats: "Cooperação relutante que se transforma em confiança inquebrável."
      },
      {
        fase: "Fase 3: O Veredito de Honra",
        descricao: "Superação mútua e derrota definitiva do conspirador responsável pelo caos.",
        papelPlayer1: "Finalização combinada.",
        papelPlayer2: "Proteção total da Soul Society.",
        ganchoWhats: "Finalização com respeito mútuo consagrado."
      }
    ],
    ameacaComum: {
      nome: "Conspirador de Guerra & Desertores Armados",
      perigo: "Explora divisões ideológicas entre esquadrões para semear discórdia.",
      mecanicaEspecial: "Requer reconciliação tática no roleplay para abrir brecha no escudo inimigo."
    },
    briefingWhatsApp: \`\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`
👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗧𝗥𝗔𝗠𝗔 𝗖𝗢𝗡𝗝𝗨𝗡𝗧𝗔 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟮: 𝗖𝗛𝗢𝗤𝗨𝗘 𝗜𝗗𝗘𝗢𝗟𝗢́𝗚𝗜𝗖𝗢
✶ „ Jogadores Envolvidos: \${nomesStr}
✶ „ Códigos de Atividade: \${codigosStr}
✶ „ Título: Arco Cruzado — O Julgamento de Honra em \${locPrincipal}
✶ „ Dinâmica: Choque de Métodos (\${p1.esquadrao} vs \${p2.esquadrao})

📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗖𝗢𝗠𝗣𝗔𝗥𝗧𝗜𝗟𝗛𝗔𝗗𝗔:
Um dilema de honra coloca \${p1.nome} e \${p2.nome} em teste. Para superar a armadilha em \${locPrincipal}, ambos precisarão conciliar a força bruta com a sabedoria tática!

🎯 𝗜𝗡𝗦𝗧𝗥𝗨𝗖̧𝗢̃𝗘𝗦 𝗣𝗔𝗥𝗔 𝗢𝗦 𝗝𝗢𝗚𝗔𝗗𝗢𝗥𝗘𝗦:
1. Dialogar e contrapor suas filosofias de esquadrão no ON (mínimo 30 a 90 linhas).
2. Superar a discórdia e executar uma estratégia mista impecável.

✧ Recompensa Garantida para Ambos: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial cada!
\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`\`
  };

  const opcaoConj3 = {
    id: "conj_opcao_3",
    nomeOpcao: "🕵️ Opção 3: Operação de Infiltração & Resgate de Alto Risco",
    tituloArco: \`Arco Cruzado: Resgate nas Sombras de \${locPrincipal} (\${nomesStr})\`,
    dinamicaDupla: \`Infiltração Furtiva & Ataque Cirúrgico\`,
    sinopse: \`Um oficial do Gotei 13 foi capturado em \${locPrincipal}. \${p1.nome} e \${p2.nome} formam a equipe de extração secreta que deve agir antes da execução do prisioneiro.\`,
    eventosCruzados: [
      {
        fase: "Fase 1: Infiltração Silenciosa",
        descricao: "Penetrar na fortaleza inimiga desarmando sentinelas com discrição.",
        papelPlayer1: "Neutralização rápida de sentinelas.",
        papelPlayer2: "Ocultação de Reishi e desarmamento de alarmes de Kidō.",
        ganchoWhats: "Cena de tensão furtiva no ON."
      },
      {
        fase: "Fase 2: A Fuga Crítica",
        descricao: "O alarme soa e o resgate se transforma em uma perseguição de tirar o fôlego.",
        papelPlayer1: "Retaguarda e contenção de vagas de inimigos.",
        papelPlayer2: "Estabilização médica do ferido e rota de fuga.",
        ganchoWhats: "Cena de perseguição e proteção sob fogo cruzado."
      },
      {
        fase: "Fase 3: O Confronto no Portão",
        descricao: "Duelo final no ponto de extração para abrir o Senkaimon e garantir a fuga.",
        papelPlayer1: "Ataque destruidor para abrir caminho.",
        papelPlayer2: "Abertura e estabilização do portal dimensional.",
        ganchoWhats: "Finalização épica com missão cumprida com louvor."
      }
    ],
    ameacaComum: {
      nome: "Guarda de Elite dos Renegados",
      perigo: "Defesas impenetráveis que exigem infiltração sincronizada.",
      mecanicaEspecial: "Sucesso depende de coordenação contínua de ações."
    },
    briefingWhatsApp: \`\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`
👑 𝗗𝗢𝗦𝗦𝗜𝗘̂ 𝗗𝗘 𝗧𝗥𝗔𝗠𝗔 𝗖𝗢𝗡𝗝𝗨𝗡𝗧𝗔 • 𝗢𝗣𝗖̧𝗔̃𝗢 𝟯: 𝗢𝗣𝗘𝗥𝗔𝗖̧𝗔̃𝗢 𝗗𝗘 𝗥𝗘𝗦𝗚𝗔𝗧𝗘
✶ „ Jogadores Envolvidos: \${nomesStr}
✶ „ Códigos de Atividade: \${codigosStr}
✶ „ Título: Arco Cruzado — Resgate nas Sombras de \${locPrincipal}
✶ „ Dinâmica: Infiltração Furtiva & Ataque Cirúrgico

📋 𝗦𝗜𝗡𝗢𝗣𝗦𝗘 𝗖𝗢𝗠𝗣𝗔𝗥𝗧𝗜𝗟𝗛𝗔𝗗𝗔:
Uma missão de alta espionagem em \${locPrincipal}. \${p1.nome} e \${p2.nome} devem extrair o alvo e romper o cerco inimigo antes que o portal Senkaimon se feche!

🎯 𝗜𝗡𝗦𝗧𝗥𝗨𝗖̧𝗢̃𝗘𝗦 𝗣𝗔𝗥𝗔 𝗢𝗦 𝗝𝗢𝗚𝗔𝗗𝗢𝗥𝗘𝗦:
1. Cenar a infiltração e resgate coordenado (mínimo 30 a 90 linhas conjuntas).
2. Dividir tarefas de ataque e cobertura defensiva no ON.

✧ Recompensa Garantida para Ambos: 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial cada!
\\`\\`\\`ㅤㅤ\\`\\`\\`ㅤㅤㅤ\\`\\`\\`ㅤㅤ\\`\\`\\`\`
  };

  return {
    analiseCenas: {
      qtdCenas: (cenasConjuntas || []).length,
      oponentePrincipal: opPrincipal,
      localPrincipal: locPrincipal,
      elementosDetectados: analise.elementosDetectados,
      momentoChave: analise.momentoChave
    },
    opcoesTramas: [opcaoConj1, opcaoConj2, opcaoConj3],
    opcaoAtivaId: "conj_opcao_1",
    tituloArco: opcaoConj1.tituloArco,
    dinamicaDupla: opcaoConj1.dinamicaDupla,
    sinopse: opcaoConj1.sinopse,
    conflitoCentral: opcaoConj1.sinopse,
    eventosCruzados: opcaoConj1.eventosCruzados,
    ameacaComum: opcaoConj1.ameacaComum,
    briefingWhatsApp: opcaoConj1.briefingWhatsApp
  };
}

async function gerarTramaIndividualAI({ player, cenas = [], openAiKey = "" }) {
  const heuristicResult = sintetizarTramaIndividualHeuristica(player, cenas);
  const apiKey = (openAiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") || "" : "")).trim();

  if (!apiKey || apiKey.length < 15) {
    return heuristicResult;
  }

  try {
    const prompt = \`Você é o Mestre Narrador Principal do BLEACH RPG (Soul Society / Seireitei).
Analise o seguinte jogador e suas cenas de arco para gerar 3 Opções de Tramas Individuais com base nas ações e acontecimentos narrados no ON:

DADOS DO JOGADOR:
- Nome: \${player?.nome || 'Shinigami'}
- Raça: \${player?.raca || 'Shinigami'}
- Esquadrão: \${player?.esquadrao || '11º Esquadrão'}
- Patamar: \${heuristicResult.diagnosticoPsicologico}
- Zanpakutō: \${player?.zanpakuto?.shikaiAtiva?.nome || player?.zanpakuto?.nome || 'Despertar'}
- Histórico de Cenas: \${cenas.map(c => \`[\${c.titulo}]: \${c.texto}\`).join(' | ') || 'Nenhuma cena registrada ainda.'}

Responda APENAS em formato JSON válido com as 3 opções de tramas:
{
  "opcoesTramas": [
    {
      "id": "opcao_1",
      "nomeOpcao": "⚔️ Opção 1: Caminho do Confronto Direto (Provação Marcial)",
      "tituloArco": string,
      "focoNarrativo": string,
      "eventos": [
        { "numero": 1, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." },
        { "numero": 2, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." },
        { "numero": 3, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." }
      ],
      "antagonista": { "nome": "...", "titulo": "...", "origem": "...", "motivacao": "...", "fraquezaChave": "..." },
      "briefingWhatsApp": string
    },
    {
      "id": "opcao_2",
      "nomeOpcao": "🕵️ Opção 2: Caminho da Conspiração Oculta (Mistério & Blefe)",
      "tituloArco": string,
      "focoNarrativo": string,
      "eventos": [
        { "numero": 1, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." },
        { "numero": 2, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." },
        { "numero": 3, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." }
      ],
      "antagonista": { "nome": "...", "titulo": "...", "origem": "...", "motivacao": "...", "fraquezaChave": "..." },
      "briefingWhatsApp": string
    },
    {
      "id": "opcao_3",
      "nomeOpcao": "⚖️ Opção 3: Caminho do Despertar da Alma (Ressonância da Zanpakutō)",
      "tituloArco": string,
      "focoNarrativo": string,
      "eventos": [
        { "numero": 1, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." },
        { "numero": 2, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." },
        { "numero": 3, "fase": "...", "titulo": "...", "descricao": "...", "objetivoCena": "...", "desafioSugerido": "..." }
      ],
      "antagonista": { "nome": "...", "titulo": "...", "origem": "...", "motivacao": "...", "fraquezaChave": "..." },
      "briefingWhatsApp": string
    }
  ]
}\`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${apiKey}\`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.opcoesTramas) && parsed.opcoesTramas.length > 0) {
          const op1 = parsed.opcoesTramas[0];
          return {
            ...heuristicResult,
            opcoesTramas: parsed.opcoesTramas,
            tituloArco: op1.tituloArco || heuristicResult.tituloArco,
            ganchoImediato: op1.focoNarrativo || heuristicResult.ganchoImediato,
            eventos: op1.eventos || heuristicResult.eventos,
            antagonista: op1.antagonista || heuristicResult.antagonista,
            briefingWhatsApp: op1.briefingWhatsApp || heuristicResult.briefingWhatsApp
          };
        }
      }
    }
  } catch (err) {
    console.warn("OpenAI API call failed, falling back to cognitive semantic engine:", err);
  }

  return heuristicResult;
}

async function gerarTramaConjuntaAI({ players = [], cenasConjuntas = [], openAiKey = "" }) {
  const heuristicResult = sintetizarTramaConjuntaHeuristica(players, cenasConjuntas);
  const apiKey = (openAiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") || "" : "")).trim();

  if (!apiKey || apiKey.length < 15) {
    return heuristicResult;
  }

  try {
    const prompt = \`Você é o Mestre Narrador Principal do BLEACH RPG.
Analise as cenas dos seguintes jogadores e crie 3 Opções de Tramas Cruzadas / Arcos Compartilhados:

JOGADORES:
\${players.map(p => \`- \${p.nome} (\${p.raca}, \${p.esquadrao})\`).join('\\n')}

CENAS ARMAZENADAS:
\${cenasConjuntas.map(c => \`[\${c.autorNome || 'Cena'} - \${c.titulo}]: \${c.texto}\`).join('\\n') || 'Início de arco conjunto.'}

Responda APENAS em formato JSON com as 3 opções de tramas:
{
  "opcoesTramas": [
    {
      "id": "conj_opcao_1",
      "nomeOpcao": "⚔️ Opção 1: Aliança de Sangue (Combate Cooperativo Sincronizado)",
      "tituloArco": string,
      "dinamicaDupla": string,
      "sinopse": string,
      "eventosCruzados": [
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." },
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." },
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." }
      ],
      "ameacaComum": { "nome": "...", "perigo": "...", "mecanicaEspecial": "..." },
      "briefingWhatsApp": string
    },
    {
      "id": "conj_opcao_2",
      "nomeOpcao": "⚖️ Opção 2: Choque Ideológico & Provação Cruzada (Conflito de Honra)",
      "tituloArco": string,
      "dinamicaDupla": string,
      "sinopse": string,
      "eventosCruzados": [
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." },
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." },
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." }
      ],
      "ameacaComum": { "nome": "...", "perigo": "...", "mecanicaEspecial": "..." },
      "briefingWhatsApp": string
    },
    {
      "id": "conj_opcao_3",
      "nomeOpcao": "🕵️ Opção 3: Operação de Infiltração & Resgate de Alto Risco",
      "tituloArco": string,
      "dinamicaDupla": string,
      "sinopse": string,
      "eventosCruzados": [
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." },
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." },
        { "fase": "...", "descricao": "...", "papelPlayer1": "...", "papelPlayer2": "...", "ganchoWhats": "..." }
      ],
      "ameacaComum": { "nome": "...", "perigo": "...", "mecanicaEspecial": "..." },
      "briefingWhatsApp": string
    }
  ]
}\`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": \`Bearer \${apiKey}\`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        response_format: { type: "json_object" }
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed.opcoesTramas) && parsed.opcoesTramas.length > 0) {
          const op1 = parsed.opcoesTramas[0];
          return {
            ...heuristicResult,
            opcoesTramas: parsed.opcoesTramas,
            tituloArco: op1.tituloArco || heuristicResult.tituloArco,
            dinamicaDupla: op1.dinamicaDupla || heuristicResult.dinamicaDupla,
            sinopse: op1.sinopse || heuristicResult.sinopse,
            eventosCruzados: op1.eventosCruzados || heuristicResult.eventosCruzados,
            ameacaComum: op1.ameacaComum || heuristicResult.ameacaComum,
            briefingWhatsApp: op1.briefingWhatsApp || heuristicResult.briefingWhatsApp
          };
        }
      }
    }
  } catch (err) {
    console.warn("OpenAI joint arc call failed, falling back to cognitive semantic engine:", err);
  }

  return heuristicResult;
}
`;

// Replace from "// AI PLOT & STORY ARC GENERATION ENGINE" up to "if (typeof window !== 'undefined')"
const startMarker = "// =========================================================================\n// AI PLOT & STORY ARC GENERATION ENGINE (INDIVIDUAL & JOINT TRAMAS)";
const endMarker = "if (typeof window !== 'undefined') {";

const idx1 = code.indexOf(startMarker);
const idx2 = code.indexOf(endMarker);

if (idx1 !== -1 && idx2 !== -1) {
  code = code.slice(0, idx1) + newPlotEngine + "\n\n" + code.slice(idx2);
  fs.writeFileSync('spiritual_engine.js', code, 'utf8');
  console.log("✓ spiritual_engine.js updated with Deep Semantic Analyzer & 3-Branch Multi-Plot Engine!");
} else {
  console.error("Markers not found in spiritual_engine.js!", { idx1, idx2 });
}
