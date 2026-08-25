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
  const [rec, setRec] = useState({ tipo: "Recompensa de Atributos", pontos: 1, atributo: "", motivo: "" });
  
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

  // Personalidade Local State with Auto-Draft Recovery
  const [persTexto, setPersTexto] = useState(() => {
    try {
      const draft = localStorage.getItem(`bleach_pers_draft_${personagem?.id}`);
      if (draft) return JSON.parse(draft).texto ?? (personagem?.personalidade?.texto || "");
    } catch (e) {}
    return personagem?.personalidade?.texto || "";
  });

  const [persVirtudes, setPersVirtudes] = useState(() => {
    try {
      const draft = localStorage.getItem(`bleach_pers_draft_${personagem?.id}`);
      if (draft) return JSON.parse(draft).virtudes ?? (personagem?.personalidade?.virtudes || "");
    } catch (e) {}
    return personagem?.personalidade?.virtudes || "";
  });

  const [persDefeitos, setPersDefeitos] = useState(() => {
    try {
      const draft = localStorage.getItem(`bleach_pers_draft_${personagem?.id}`);
      if (draft) return JSON.parse(draft).defeitos ?? (personagem?.personalidade?.defeitos || "");
    } catch (e) {}
    return personagem?.personalidade?.defeitos || "";
  });

  const [persDesejos, setPersDesejos] = useState(() => {
    try {
      const draft = localStorage.getItem(`bleach_pers_draft_${personagem?.id}`);
      if (draft) return JSON.parse(draft).desejos ?? (personagem?.personalidade?.desejos || "");
    } catch (e) {}
    return personagem?.personalidade?.desejos || "";
  });

  const [persMedos, setPersMedos] = useState(() => {
    try {
      const draft = localStorage.getItem(`bleach_pers_draft_${personagem?.id}`);
      if (draft) return JSON.parse(draft).medos ?? (personagem?.personalidade?.medos || "");
    } catch (e) {}
    return personagem?.personalidade?.medos || "";
  });

  const [persEstilo, setPersEstilo] = useState(() => {
    try {
      const draft = localStorage.getItem(`bleach_pers_draft_${personagem?.id}`);
      if (draft) return JSON.parse(draft).estiloCombate ?? (personagem?.personalidade?.estiloCombate || "");
    } catch (e) {}
    return personagem?.personalidade?.estiloCombate || "";
  });

  // Handle personality change with instant auto-save to localStorage
  function handlePersChange(field, val) {
    if (field === 'texto') setPersTexto(val);
    if (field === 'virtudes') setPersVirtudes(val);
    if (field === 'defeitos') setPersDefeitos(val);
    if (field === 'desejos') setPersDesejos(val);
    if (field === 'medos') setPersMedos(val);
    if (field === 'estilo') setPersEstilo(val);

    try {
      const draft = {
        texto: field === 'texto' ? val : persTexto,
        virtudes: field === 'virtudes' ? val : persVirtudes,
        defeitos: field === 'defeitos' ? val : persDefeitos,
        desejos: field === 'desejos' ? val : persDesejos,
        medos: field === 'medos' ? val : persMedos,
        estiloCombate: field === 'estilo' ? val : persEstilo
      };
      if (personagem?.id) {
        localStorage.setItem(`bleach_pers_draft_${personagem.id}`, JSON.stringify(draft));
      }
    } catch (e) {}
  }

  // Modais de Sorteio, Cena e Shikai/Bankai
  const [gachaModal, setGachaModal] = useState(null);
  const [showCenaModal, setShowCenaModal] = useState(null); // "shikai" | "bankai"
  const [showZanpakutoAIModal, setShowZanpakutoAIModal] = useState(false);
  const [aiZkOpcoes, setAiZkOpcoes] = useState([]);
  const [aiZkTipo, setAiZkTipo] = useState("shikai");
  const [aiZkLoading, setAiZkLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showCapacidadesModal, setShowCapacidadesModal] = useState(null);
  const [gastoPressaoForca, setGastoPressaoForca] = useState(0);
  const [gastoPressaoResiliencia, setGastoPressaoResiliencia] = useState(0);
  const [simuladorModo, setSimuladorModo] = useState("forca_resiliencia");
  const [simStatInimigo, setSimStatInimigo] = useState(80);
  const [kidoModalFicha, setKidoModalFicha] = useState(null);
  const [showKidoTreeModal, setShowKidoTreeModal] = useState(false);
  const [showKidoShopModal, setShowKidoShopModal] = useState(false);
  const [subAbaKido, setSubAbaKido] = useState("magias"); // "magias" | "kaido"
  const [simKidoIndex, setSimKidoIndex] = useState(0);
  const [simKidoTargetStat, setSimTargetStat] = useState(80);
  const [simKidoIncantado, setSimKidoIncantado] = useState(false);
  const [simKidoExtraPressao, setSimKidoExtraPressao] = useState(0);
  const [simKaidoEstado, setSimKaidoEstado] = useState("Debilitado");
  const [simKaidoExtraPressao, setSimKaidoExtraPressao] = useState(0);
  const [simKaidoIncantado, setSimKaidoIncantado] = useState(false);
  const [copiadoWhats, setCopiadoWhats] = useState(false);
  const gachaIntervalRef = useRef(null);

  function copiarFichaWhatsApp() {
    copiarFichaFormatadaWhatsApp(personagem, () => {
      setCopiadoWhats(true);
      playReiatsuSound('win');
      setTimeout(() => setCopiadoWhats(false), 3500);
    });
  }

  useEffect(() => {
    return () => {
      if (gachaIntervalRef.current) clearInterval(gachaIntervalRef.current);
    };
  }, []);

  const lastCharIdRef = useRef(null);

  // Synchronize state when character changes (only on mount or when switching character ID)
  useEffect(() => {
    if (personagem && personagem.id !== lastCharIdRef.current) {
      lastCharIdRef.current = personagem.id;
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
      
      let initialPers = personagem.personalidade || {};
      try {
        const savedDraft = localStorage.getItem(`bleach_pers_draft_${personagem.id}`);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === 'object') {
            initialPers = { ...initialPers, ...parsed };
          }
        }
      } catch (e) {}

      setPersTexto(initialPers.texto || "");
      setPersVirtudes(initialPers.virtudes || "");
      setPersDefeitos(initialPers.defeitos || "");
      setPersDesejos(initialPers.desejos || "");
      setPersMedos(initialPers.medos || "");
      setPersEstilo(initialPers.estiloCombate || "");
    }
  }, [personagem?.id]);

  if (!personagem) return <div className="text-bleach-muted">Ficha não encontrada.</div>;

  const pendSum = Object.values(pend).reduce((a, b) => a + b, 0);
  const restante = (personagem.pontosDisponiveis || 0) - pendSum;
  const totalStats = Object.values(personagem.atributos || { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 }).reduce((a, b) => a + b, 0);
  const powerTier = getPowerTier(totalStats);

  const temShikai = !!personagem?.zanpakuto?.shikaiAtiva;
  const temBankai = !!personagem?.zanpakuto?.bankaiAtiva;
  const temOpcoesShikaiSalvas = !!(personagem?.opcoesShikaiPendentes && personagem.opcoesShikaiPendentes.length > 0);
  const temOpcoesBankaiSalvas = !!(personagem?.opcoesBankaiPendentes && personagem.opcoesBankaiPendentes.length > 0);
  const podeGerarShikai = !!personagem?.permissoes?.shikaiLiberada && !temShikai && !temOpcoesShikaiSalvas;
  const podeGerarBankai = !!personagem?.permissoes?.bankaiLiberada && temShikai && !temBankai && !temOpcoesBankaiSalvas;
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

  function salvarRascunhoPersonalidade() {
    const novaPersonalidade = {
      texto: persTexto,
      virtudes: persVirtudes,
      defeitos: persDefeitos,
      desejos: persDesejos,
      medos: persMedos,
      estiloCombate: persEstilo
    };
    updateChar({
      personalidade: novaPersonalidade
    }, "💾 Rascunho de personalidade atualizado");
    alert("💾 Rascunho de personalidade salvo com sucesso! Você pode continuar digitando ou selar quando quiser.");
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
        permissoes: { ...(p.permissoes || {}), shikaiLiberada: false },
        historico: [{ id: uid(), data: nowStr(), texto: `🗡️ DESPERTOU SHIKAI AUTORAL EXCLUSIVA: [${shikai.nome}] — "${shikai.comando}"` }, ...(p.historico || [])]
      } : p);

      saveDb({ ...db, personagens, zanpakutosVinculadas: novasVinculadas });
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
        permissoes: { ...(p.permissoes || {}), bankaiLiberada: false },
        historico: [{ id: uid(), data: nowStr(), texto: `卍 DESPERTOU BANKAI MONUMENTAL: [${bankai.nome}] — "${bankai.comando}"` }, ...(p.historico || [])]
      } : p);

      saveDb({ ...db, personagens });
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
      conhecimento: 450,
      cenasSemana: 0,
      cenasTotal: 0,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      permissoes: { shikaiLiberada: false, bankaiLiberada: false },
      kidosConhecidos: [],
      tecnicas: [],
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

  function confirmarResetFicha() {
    setShowResetModal(false);
    const charReset = {
      ...personagem,
      atributos: { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 },
      pontosDisponiveis: 20,
      conhecimento: 450,
      cenasSemana: 0,
      cenasTotal: 0,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      kidosConhecidos: [],
      tecnicas: [],
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
      permissoes: { shikaiLiberada: false, bankaiLiberada: false },
      historico: [{ id: uid(), data: nowStr(), texto: "🔄 Ficha resetada integralmente para o início." }]
    };

    const novasVinculadas = (db.zanpakutosVinculadas || []).filter(z => z.charId !== personagem.id);
    const personagens = (db.personagens || []).map(p => p.id === personagem.id ? charReset : p);
    saveDb({ ...db, personagens, zanpakutosVinculadas: novasVinculadas });
    alert("Ficha resetada com sucesso para o estado inicial!");
  }

  // CONCESSÃO DE RECOMPENSA DE ATRIBUTOS, CONHECIMENTO & CENAS PELO ADM
  function concederRecompensa() {
    const pontos = Number(rec.pontos) || 0;
    if (pontos <= 0) {
      alert("Informe uma quantidade válida de pontos.");
      return;
    }

    let patch = {};
    let texto = `[${rec.tipo}]`;

    if (rec.atributo === "conhecimento") {
      const valorAtual = Number(personagem.conhecimento || 0);
      patch.conhecimento = valorAtual + pontos;
      texto += ` +${pontos} ₪ de Conhecimento Espiritual`;
    } else if (rec.atributo === "cenas") {
      const cenasSem = Number(personagem.cenasSemana || 0);
      const cenasTot = Number(personagem.cenasTotal || 0);
      const conAtual = Number(personagem.conhecimento || 0);
      const ganhoCon = pontos * 100;
      patch.cenasSemana = cenasSem + pontos;
      patch.cenasTotal = cenasTot + pontos;
      patch.conhecimento = conAtual + ganhoCon;
      texto += ` +${pontos} cenas no WhatsApp registradas (+${ganhoCon} ₪ Conhecimento)`;
    } else if (rec.atributo && rec.atributo !== "pontosDisponiveis") {
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

    if (rec.motivo.trim()) texto += ` — ${rec.motivo.trim()}`;

    updateChar(patch, texto);
    playReiatsuSound('win');
    alert(`✓ Recompensa concedida com sucesso para ${personagem.nome}!\n\n${texto}`);
    setRec({ tipo: "Recompensa de Atributos", pontos: 1, atributo: "", motivo: "" });
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

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <button
                type="button"
                onClick={copiarFichaWhatsApp}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-lg flex items-center gap-2 ${
                  copiadoWhats 
                    ? "bg-green-500 text-black shadow-[0_0_15px_#22c55e]" 
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white"
                }`}
              >
                <span>{copiadoWhats ? "✓" : "📋"}</span>
                <span>{copiadoWhats ? "Ficha Copiada para WhatsApp!" : "Copiar Ficha WhatsApp (Made By Malutti)"}</span>
              </button>
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
          {/* BANNER DE EXPORTAÇÃO WHATSAPP (MADE BY MALUTTI) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-black/80 to-teal-950/60 border border-emerald-500/50 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xl">📋</span>
                <h4 className="font-title text-lg text-emerald-300">FICHA OFICIAL FORMATADA PARA WHATSAPP</h4>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 font-mono rounded">Made By Malutti</span>
              </div>
              <p className="text-xs text-bleach-creamDim">
                Copie com 1 clique o molde 100% autoral da Sociedade das Almas pronto para colar e enviar no grupo de WhatsApp com todos os seus atributos, Zanpakutō e dados atualizados!
              </p>
            </div>

            <button
              type="button"
              onClick={copiarFichaWhatsApp}
              className={`px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap shadow-xl flex items-center gap-2 ${
                copiadoWhats 
                  ? "bg-green-500 text-black shadow-[0_0_20px_#22c55e]" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-black"
              }`}
            >
              <span>{copiadoWhats ? "✓" : "📋"}</span>
              <span>{copiadoWhats ? "Ficha Copiada com Sucesso!" : "Copiar Ficha Agora"}</span>
            </button>
          </div>
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
                      onChange={(e) => handlePersChange('texto', e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-white"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block font-bold text-green-400 mb-1">Virtudes & Pontos Fortes *</label>
                    <input
                      type="text"
                      placeholder="Ex: Lealdade extrema, paciência tática, coragem"
                      value={persVirtudes}
                      onChange={(e) => handlePersChange('virtudes', e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-purple-400 mb-1">Deficiências, Limitações ou Fraquezas</label>
                    <input
                      type="text"
                      placeholder="Ex: Dificuldade de confiar, impulsividade, apego ao passado"
                      value={persDefeitos}
                      onChange={(e) => handlePersChange('defeitos', e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-cyan-400 mb-1">Desejos Centrais & Ambições</label>
                    <input
                      type="text"
                      placeholder="Ex: Proteger os companheiros, alcançar a liberdade"
                      value={persDesejos}
                      onChange={(e) => handlePersChange('desejos', e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-red-400 mb-1">Medos Profundos & Conflitos Internos</label>
                    <input
                      type="text"
                      placeholder="Ex: Medo da impotência, conflito entre dever e sentimento"
                      value={persMedos}
                      onChange={(e) => handlePersChange('medos', e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-end gap-3 border-t border-white/5">
                  <button
                    onClick={salvarRascunhoPersonalidade}
                    className="px-5 py-2.5 bg-bleach-panel2 border border-yellow-500/50 hover:border-yellow-400 text-yellow-300 font-bold text-xs uppercase rounded-xl transition"
                  >
                    💾 Salvar Rascunho
                  </button>
                  <button
                    onClick={selarPersonalidadeDefinitiva}
                    className="px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-110 transition"
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
              <div className="space-y-6">
                {/* SHIKAI RICH CARD */}
                {(() => {
                  const s = personagem.zanpakuto.shikaiAtiva;
                  return (
                    <div className="p-5 sm:p-6 rounded-2xl bg-black/85 border-2 border-cyan-500/80 shadow-2xl space-y-4 reiatsu-glow">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cyan-500/40 pb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-950 text-cyan-300 border border-cyan-400 tracking-wider">
                              ✓ SHIKAI DESPERTA & VINCULADA À ALMA
                            </span>
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-950/80 border border-green-500 text-green-300 tracking-wider">
                              ✦ {s.indiceExclusividade || 100}% Exclusiva no RPG
                            </span>
                            <Badge color={C.blue}>{s.elemento || "Espiritual"}</Badge>
                          </div>
                          <h3 className="font-title text-2xl sm:text-4xl text-white tracking-wider flex items-center gap-2 flex-wrap mt-1">
                            <span>{s.nome}</span>
                            {s.kanji && <span className="text-base sm:text-lg font-cinzel text-bleach-orange font-normal">{s.kanji}</span>}
                            {s.traducao && <span className="text-xs sm:text-sm text-bleach-creamDim font-sans">({s.traducao})</span>}
                          </h3>
                          <p className="text-xs sm:text-sm text-cyan-300 italic">
                            "{s.comando}"
                          </p>
                        </div>
                      </div>

                      {/* 2-Column Grid: Manifestação da Arma & Relação com a Alma */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 bg-bleach-panel2/90 rounded-xl border border-white/5 space-y-1">
                          <strong className="text-bleach-orange block text-xs flex items-center gap-1.5">
                            <span>⚔️</span> Manifestação da Arma:
                          </strong>
                          <p className="text-bleach-creamDim leading-relaxed text-xs">
                            {s.aparencia || s.formatoArma || "Katana cerimonial de corte espiritual."}
                          </p>
                        </div>
                        <div className="p-3.5 bg-bleach-panel2/90 rounded-xl border border-white/5 space-y-1">
                          <strong className="text-cyan-400 block text-xs flex items-center gap-1.5">
                            <span>🧠</span> Relação com a Alma & Temperamento:
                          </strong>
                          <p className="text-bleach-creamDim leading-relaxed text-xs">
                            {s.relacaoPersonalidade || `Manifestação direta da essência e das virtudes de ${personagem.nome}.`}
                          </p>
                        </div>
                      </div>

                      {/* Highlight Box: Poder & Mecânica Espiritual */}
                      <div className="p-4 bg-black/90 rounded-xl border-2 border-bleach-orange/40 space-y-2.5 shadow-inner">
                        <strong className="text-bleach-orange block text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <span>⚡</span> PODER & MECÂNICA ESPIRITUAL:
                        </strong>
                        <p className="text-xs sm:text-sm text-bleach-cream leading-relaxed font-sans">
                          {s.poder}
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-bleach-muted pt-2 border-t border-white/10">
                          <span>Custo: <strong className="text-white">{s.custoReiatsu || "Médio"}</strong></span>
                          {s.limitacoes && <span>Limitações: <strong className="text-amber-300">{s.limitacoes}</strong></span>}
                        </div>
                      </div>

                      {/* Complexity & Balance Indices (1 a 10) */}
                      {s.indices && (
                        <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-bleach-muted block">
                            Índice de Complexidade & Balanço Espiritual (1 a 10)
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                            {[
                              { label: "Potência", val: s.indices.potencia, color: C.red },
                              { label: "Abrangência", val: s.indices.abrangencia, color: C.blue },
                              { label: "Complexidade", val: s.indices.complexidade, color: C.purple },
                              { label: "Versatilidade", val: s.indices.versatilidade, color: C.green },
                              { label: "Custo", val: s.indices.custo, color: C.yellow },
                            ].map(stat => (
                              <div key={stat.label} className="p-2 bg-bleach-panel2 rounded-lg border border-white/5 text-center">
                                <span className="text-bleach-muted block text-[10px]">{stat.label}</span>
                                <span className="font-mono font-bold text-xs" style={{ color: stat.color }}>{stat.val || 8}/10</span>
                                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-1.5">
                                  <div className="h-full rounded-full" style={{ width: `${(stat.val || 8) * 10}%`, backgroundColor: stat.color }}></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sword Art SVG & Upload */}
                      <BleachSwordArt
                        arma={s}
                        nomeZk={s.nome}
                        isBankai={false}
                        foto={personagem.zanpakuto?.fotoShikai}
                        onUpload={(e) => handleFotoUpload(e, "shikai")}
                      />

                      {/* Cena de Despertar da Shikai */}
                      {personagem.cenaDespertarShikai && (
                        <div className="p-4 bg-black/70 border border-cyan-500/40 rounded-xl space-y-1.5 mt-3">
                          <strong className="text-cyan-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                            <span>📜</span> Cena de Despertar da Shikai:
                          </strong>
                          <p className="text-xs text-bleach-creamDim italic leading-relaxed">"{personagem.cenaDespertarShikai}"</p>
                        </div>
                      )}

                      {/* ESPAÇO DOS ATRIBUTOS DA ZANPAKUTŌ & PROGRESSÃO TÁTICA (SHIKAI) */}
                      {(() => {
                        const statsZk = calcularAtributosZanpakuto(personagem.atributos, false);
                        const caps = gerarCapacidadesTaticasZanpakuto(s, statsZk, false);

                        return (
                          <div className="p-4 sm:p-5 bg-gradient-to-b from-black/90 via-bleach-panel to-black rounded-2xl border-2 border-cyan-500/50 space-y-4 shadow-xl mt-4">
                            {/* Header do Espaço de Atributos */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                              <div>
                                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/60 tracking-wider">
                                  ✦ Atributos Espirituais da Shikai (Base 100)
                                </span>
                                <h4 className="font-title text-xl text-white mt-1 flex items-center gap-2">
                                  <span>⚔️</span> Força & Sintonização da Lâmina
                                </h4>
                                <p className="text-[11px] text-bleach-creamDim">
                                  Escalados dinamicamente com os atributos do Shinigami. Média Atual: <strong className="text-cyan-400 font-mono">{statsZk.media} pts</strong>
                                </p>
                              </div>

                              {/* Botão Revelar Capacidades Táticas com Badge de Progresso */}
                              <button
                                type="button"
                                onClick={() => setShowCapacidadesModal({ isBankai: false, arma: s, statsZk, caps })}
                                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 border border-cyan-300/40 reiatsu-glow"
                              >
                                <span>👁️</span> Revelar Capacidades
                                <span className="px-2 py-0.5 rounded-full bg-black/70 text-cyan-300 font-mono text-[10px] border border-cyan-400">
                                  {caps.desbloqueadosCount}/{caps.totalNiveis} Despertas
                                </span>
                              </button>
                            </div>

                            {/* Grid dos 5 Atributos da Zanpakutō */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
                              {/* 1. Controle */}
                              <div className="p-3 bg-bleach-panel2 rounded-xl border border-cyan-500/30 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-extrabold uppercase text-cyan-400 flex items-center gap-1">
                                    <span>🎯</span> Controle
                                  </span>
                                  <span className="font-mono font-bold text-sm text-cyan-300">{statsZk.controle}</span>
                                </div>
                                <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                  Moldagem de forma, variação de tamanho, peso e precisão da técnica.
                                </p>
                                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.controle / 500) * 100)}%` }}></div>
                                </div>
                              </div>

                              {/* 2. Alcance */}
                              <div className="p-3 bg-bleach-panel2 rounded-xl border border-blue-500/30 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-extrabold uppercase text-blue-400 flex items-center gap-1">
                                    <span>🏹</span> Alcance
                                  </span>
                                  <span className="font-mono font-bold text-sm text-blue-300">{statsZk.alcance}</span>
                                </div>
                                <p className="text-[10px] text-bleach-muted mb-1 leading-tight">
                                  Distância máxima da habilidade.
                                </p>
                                <span className="text-[10px] text-blue-300 font-semibold mb-2 block truncate">
                                  {statsZk.alcanceMetros}
                                </span>
                                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.alcance / 500) * 100)}%` }}></div>
                                </div>
                              </div>

                              {/* 3. Corte */}
                              <div className="p-3 bg-bleach-panel2 rounded-xl border border-red-500/30 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-extrabold uppercase text-red-400 flex items-center gap-1">
                                    <span>⚔️</span> Corte
                                  </span>
                                  <span className="font-mono font-bold text-sm text-red-300">{statsZk.corte}</span>
                                </div>
                                <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                  Poder de penetração para transpassar a resiliência de alvos.
                                </p>
                                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.corte / 500) * 100)}%` }}></div>
                                </div>
                              </div>

                              {/* 4. Resiliência */}
                              <div className="p-3 bg-bleach-panel2 rounded-xl border border-purple-500/30 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-extrabold uppercase text-purple-400 flex items-center gap-1">
                                    <span>🛡️</span> Resiliência
                                  </span>
                                  <span className="font-mono font-bold text-sm text-purple-300">{statsZk.resiliencia}</span>
                                </div>
                                <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                  Durabilidade contra impactos pesados para não trincar/quebrar.
                                </p>
                                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.resiliencia / 500) * 100)}%` }}></div>
                                </div>
                              </div>

                              {/* 5. Pressão Espiritual */}
                              <div className="p-3 bg-bleach-panel2 rounded-xl border border-yellow-500/30 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-extrabold uppercase text-yellow-400 flex items-center gap-1">
                                    <span>🌌</span> Reiatsu Lâmina
                                  </span>
                                  <span className="font-mono font-bold text-sm text-yellow-300">{statsZk.pressaoEspiritual}</span>
                                </div>
                                <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                  Energia intrínseca para Absorção ou Ressonância de Dano.
                                </p>
                                <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.pressaoEspiritual / 500) * 100)}%` }}></div>
                                </div>
                              </div>
                            </div>

                            {/* Caixa Tática de Aplicação da Pressão Espiritual da Zanpakutō */}
                            <div className="p-3.5 bg-black/80 rounded-xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                              <div className="space-y-1">
                                <strong className="text-yellow-400 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                                  <span>⚡</span> Dinâmica de Aplicação de Reiatsu da Zanpakutō:
                                </strong>
                                <p className="text-bleach-creamDim text-[11px]">
                                  A energia espiritual da lâmina pode ser canalizada em 2 modalidades de combate:
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <div className="p-2 bg-bleach-panel rounded-lg border border-cyan-500/40 text-[11px]">
                                  <span className="text-cyan-300 font-bold block">💫 Absorção Espiritual</span>
                                  <span className="text-bleach-muted">Eleva a Reiatsu do Shinigami em <strong className="text-white font-mono">+{statsZk.bonusAbsorcaoReiatsu}</strong></span>
                                </div>
                                <div className="p-2 bg-bleach-panel rounded-lg border border-red-500/40 text-[11px]">
                                  <span className="text-red-300 font-bold block">💥 Ressonância de Impacto</span>
                                  <span className="text-bleach-muted">Soma <strong className="text-white font-mono">+{statsZk.bonusDanoRessonancia}</strong> de dano às técnicas</span>
                                </div>
                              </div>
                            </div>

                            {/* Mini Resumo das Capacidades Desbloqueadas e Próximo Marco */}
                            <div className="p-3 bg-bleach-panel2/60 rounded-xl border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-bleach-muted text-[11px]">Marcos de Capacidade:</span>
                                {caps.niveis.map((n) => (
                                  <span
                                    key={n.nivel}
                                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                                      n.desbloqueado
                                        ? "bg-green-950 text-green-300 border border-green-500/60"
                                        : "bg-black/60 text-bleach-muted border border-white/10"
                                    }`}
                                  >
                                    <span>{n.desbloqueado ? "✓" : "🔒"}</span> Nv.{n.nivel} ({n.req} pts)
                                  </span>
                                ))}
                              </div>

                              {caps.proximoNivel && (
                                <span className="text-[11px] text-amber-300">
                                  Próximo Despertar: <strong>Nv.{caps.proximoNivel.nivel}</strong> aos <strong>{caps.proximoNivel.req} pts</strong> de média.
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}

                {/* BANKAI SECTION */}
                {temBankai ? (
                  (() => {
                    const b = personagem.zanpakuto.bankaiAtiva;
                    return (
                      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 via-bleach-panel to-black border-2 border-yellow-500/80 bankai-supreme-card shadow-2xl space-y-4">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-yellow-500/40 pb-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-950 text-yellow-300 border border-yellow-400 tracking-wider">
                                卍 BANKAI TRANSCENDENTAL & SOBERANA
                              </span>
                              {b.tipoEvolucao && (
                                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-yellow-950/80 border border-yellow-500/50 text-yellow-300 tracking-wider">
                                  ⚡ {b.tipoEvolucao}
                                </span>
                              )}
                            </div>
                            <h3 className="font-title text-2xl sm:text-4xl text-yellow-300 tracking-wider flex items-center gap-2 flex-wrap mt-1">
                              <span>{b.nome}</span>
                              {b.kanji && <span className="text-base sm:text-lg font-cinzel text-yellow-400 font-normal">{b.kanji}</span>}
                              {b.traducao && <span className="text-xs sm:text-sm text-yellow-200/80 font-sans">({b.traducao})</span>}
                            </h3>
                            <p className="text-xs sm:text-sm text-yellow-200 italic">
                              "{b.comando}"
                            </p>
                          </div>
                        </div>

                        {/* Breakpoint Box (Ponto de Ruptura da Shikai) */}
                        {b.pontoRuptura && (
                          <div className="p-3.5 bg-gradient-to-r from-amber-950/60 to-black rounded-xl border-2 border-yellow-500/70 space-y-1">
                            <strong className="text-yellow-400 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <span>💥</span> PONTO DE RUPTURA (LIMITE DA SHIKAI SUPERADO):
                            </strong>
                            <p className="text-xs sm:text-sm text-bleach-cream leading-relaxed font-sans">
                              {b.pontoRuptura}
                            </p>
                          </div>
                        )}

                        {/* Ponto Fraco & Brecha Estratégica */}
                        {b.pontoFraco && (
                          <div className="p-3.5 bg-gradient-to-r from-red-950/70 via-black to-red-950/50 rounded-xl border-2 border-red-500/70 space-y-1 shadow-lg">
                            <strong className="text-red-400 block text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
                              <span>🎯</span> BRECHA ESTRATÉGICA & PONTO FRACO (COMO CONTRAGOLPEAR):
                            </strong>
                            <p className="text-xs sm:text-sm text-red-200/90 leading-relaxed font-sans">
                              {b.pontoFraco}
                            </p>
                          </div>
                        )}

                        {/* 2-Column Grid: Domínio & Forma Monumental + Poder Transcendental */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1">
                            <strong className="text-yellow-400 block text-xs flex items-center gap-1.5">
                              <span>👑</span> Domínio Territorial & Forma Monumental:
                            </strong>
                            <p className="text-bleach-creamDim text-xs leading-relaxed">
                              {b.formaMonumental || "Manifestação monumental de Reishi em escala territorial."}
                            </p>
                          </div>
                          <div className="p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1">
                            <strong className="text-cyan-300 block text-xs flex items-center gap-1.5">
                              <span>⚡</span> Poder Transcendental da Bankai:
                            </strong>
                            <p className="text-bleach-creamDim text-xs leading-relaxed">
                              {b.poder}
                            </p>
                          </div>
                        </div>

                        {/* Limitações & Significado Filosófico */}
                        <div className="p-3.5 bg-black/80 rounded-xl border border-white/10 text-xs space-y-2">
                          {b.limitacoes && (
                            <div className="text-xs text-red-300">
                              <strong>⚠️ Limitações & Desgaste:</strong> {b.limitacoes}
                            </div>
                          )}
                          {b.significadoEspiritual && (
                            <p className="text-xs text-bleach-muted border-t border-white/5 pt-2">
                              <strong>Significado Filosófico:</strong> <em className="text-yellow-200">"{b.significadoEspiritual}"</em>
                            </p>
                          )}
                        </div>

                        {/* Indices da Bankai */}
                        {b.indices && (
                          <div className="p-3.5 bg-black/60 rounded-xl border border-white/10 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-bleach-muted block">
                              Índice de Potência & Balanço Espiritual da Bankai (1 a 10)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                              {[
                                { label: "Potência", val: b.indices.potencia, color: C.red },
                                { label: "Abrangência", val: b.indices.abrangencia, color: C.blue },
                                { label: "Complexidade", val: b.indices.complexidade, color: C.purple },
                                { label: "Versatilidade", val: b.indices.versatilidade, color: C.green },
                                { label: "Custo", val: b.indices.custo, color: C.yellow },
                              ].map(stat => (
                                <div key={stat.label} className="p-2 bg-bleach-panel2 rounded-lg border border-white/5 text-center">
                                  <span className="text-bleach-muted block text-[10px]">{stat.label}</span>
                                  <span className="font-mono font-bold text-xs" style={{ color: stat.color }}>{stat.val || 10}/10</span>
                                  <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden mt-1.5">
                                    <div className="h-full rounded-full" style={{ width: `${(stat.val || 10) * 10}%`, backgroundColor: stat.color }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                          {/* ESPAÇO DOS ATRIBUTOS DA BANKAI & TRANSCENDÊNCIA */}
                          {(() => {
                            const statsZk = calcularAtributosZanpakuto(personagem.atributos, true);
                            const caps = gerarCapacidadesTaticasZanpakuto(b, statsZk, true);

                            return (
                              <div className="p-4 sm:p-5 bg-gradient-to-b from-amber-950/40 via-black to-bleach-panel rounded-2xl border-2 border-yellow-500/60 space-y-4 shadow-2xl mt-4">
                                {/* Header */}
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-yellow-500/30 pb-3">
                                  <div>
                                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-amber-950 text-yellow-300 border border-yellow-400 tracking-wider">
                                      卍 Atributos de Domínio Transcendental (Escala Bankai)
                                    </span>
                                    <h4 className="font-title text-xl text-yellow-300 mt-1 flex items-center gap-2">
                                      <span>👑</span> Soberania Espiritual & Magnitude de Território
                                    </h4>
                                    <p className="text-[11px] text-bleach-creamDim">
                                      Multiplicador de magnitude canônica de Bankai. Média Transcendental: <strong className="text-yellow-400 font-mono">{statsZk.media} pts</strong>
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setShowCapacidadesModal({ isBankai: true, arma: b, statsZk, caps })}
                                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition flex items-center gap-2 border border-yellow-300"
                                  >
                                    <span>👁️</span> Revelar Capacidades
                                    <span className="px-2 py-0.5 rounded-full bg-black/80 text-yellow-300 font-mono text-[10px] border border-yellow-500">
                                      {caps.desbloqueadosCount}/{caps.totalNiveis} Soberanias
                                    </span>
                                  </button>
                                </div>

                                {/* Grid 5 Atributos Bankai */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
                                  {/* Controle Bankai */}
                                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-yellow-500/30 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[11px] font-extrabold uppercase text-yellow-400 flex items-center gap-1">
                                        <span>🎯</span> Controle Soberano
                                      </span>
                                      <span className="font-mono font-bold text-sm text-yellow-300">{statsZk.controle}</span>
                                    </div>
                                    <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                      Manipulação macroscópica de leis e foco concentrado de energia.
                                    </p>
                                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.controle / 1500) * 100)}%` }}></div>
                                    </div>
                                  </div>

                                  {/* Alcance Bankai */}
                                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-blue-500/30 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[11px] font-extrabold uppercase text-cyan-400 flex items-center gap-1">
                                        <span>🏹</span> Alcance Territorial
                                      </span>
                                      <span className="font-mono font-bold text-sm text-cyan-300">{statsZk.alcance}</span>
                                    </div>
                                    <p className="text-[10px] text-bleach-muted mb-1 leading-tight">
                                      Expansão espacial da regra.
                                    </p>
                                    <span className="text-[10px] text-cyan-300 font-semibold mb-2 block truncate">
                                      {statsZk.alcanceMetros}
                                    </span>
                                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.alcance / 1500) * 100)}%` }}></div>
                                    </div>
                                  </div>

                                  {/* Corte Bankai */}
                                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-red-500/30 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[11px] font-extrabold uppercase text-red-400 flex items-center gap-1">
                                        <span>⚔️</span> Corte Transcendental
                                      </span>
                                      <span className="font-mono font-bold text-sm text-red-300">{statsZk.corte}</span>
                                    </div>
                                    <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                      Poder de aniquilação e ruptura atômica contra qualquer barreira.
                                    </p>
                                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.corte / 1500) * 100)}%` }}></div>
                                    </div>
                                  </div>

                                  {/* Resiliência Bankai */}
                                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-purple-500/30 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[11px] font-extrabold uppercase text-purple-400 flex items-center gap-1">
                                        <span>🛡️</span> Resiliência Monumental
                                      </span>
                                      <span className="font-mono font-bold text-sm text-purple-300">{statsZk.resiliencia}</span>
                                    </div>
                                    <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                      Estrutura praticamente inquebrável sustentada por Reishi massivo.
                                    </p>
                                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${Math.min(100, (statsZk.resiliencia / 1500) * 100)}%` }}></div>
                                    </div>
                                  </div>

                                  {/* Pressão Espiritual Bankai */}
                                  <div className="p-3 bg-bleach-panel2 rounded-xl border border-yellow-500/30 flex flex-col justify-between">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-[11px] font-extrabold uppercase text-yellow-300 flex items-center gap-1">
                                        <span>🌌</span> Reiatsu Soberana
                                      </span>
                                      <span className="font-mono font-bold text-sm text-yellow-200">{statsZk.pressaoEspiritual}</span>
                                    </div>
                                    <p className="text-[10px] text-bleach-muted mb-2 leading-tight">
                                      Sobrecarga massiva para finalizações lendárias e buffs colossais.
                                    </p>
                                    <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden">
                                      <div className="h-full bg-yellow-300 rounded-full" style={{ width: `${Math.min(100, (statsZk.pressaoEspiritual / 1500) * 100)}%` }}></div>
                                    </div>
                                  </div>
                                </div>

                                {/* Caixa de Aplicação da Reiatsu Bankai */}
                                <div className="p-3.5 bg-black/80 rounded-xl border border-yellow-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                                  <div className="space-y-1">
                                    <strong className="text-yellow-300 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                                      <span>⚡</span> Dinâmica de Aplicação de Reiatsu da Bankai:
                                    </strong>
                                    <p className="text-bleach-creamDim text-[11px]">
                                      A densidade espiritual da Bankai confere bônus de magnitude transcendental:
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-2">
                                    <div className="p-2 bg-bleach-panel rounded-lg border border-amber-500/40 text-[11px]">
                                      <span className="text-amber-300 font-bold block">💫 Absorção Transcendental</span>
                                      <span className="text-bleach-muted">Eleva a Reiatsu do Shinigami em <strong className="text-white font-mono">+{statsZk.bonusAbsorcaoReiatsu}</strong></span>
                                    </div>
                                    <div className="p-2 bg-bleach-panel rounded-lg border border-red-500/40 text-[11px]">
                                      <span className="text-red-300 font-bold block">💥 Ressonância Suprema</span>
                                      <span className="text-bleach-muted">Soma <strong className="text-white font-mono">+{statsZk.bonusDanoRessonancia}</strong> de dano final</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                        {/* Cena de Despertar da Bankai */}
                        {personagem.cenaDespertarBankai && (
                          <div className="p-4 bg-black/70 border border-yellow-500/40 rounded-xl space-y-1.5 mt-3">
                            <strong className="text-yellow-400 text-xs uppercase tracking-wider flex items-center gap-1.5">
                              <span>📜</span> Cena de Despertar da Bankai:
                            </strong>
                            <p className="text-xs text-bleach-creamDim italic leading-relaxed">"{personagem.cenaDespertarBankai}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  personagem.opcoesBankaiPendentes && personagem.opcoesBankaiPendentes.length > 0 ? (
                    <div className="space-y-4 p-5 sm:p-6 bg-gradient-to-b from-amber-950/70 via-black to-bleach-panel rounded-2xl border-2 border-yellow-500/80 shadow-2xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-yellow-500/30 pb-3">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-400">
                            卍 3 EVOLUÇÕES DE BANKAI FORJADAS & SALVAS
                          </span>
                          <h4 className="font-title text-xl sm:text-2xl text-yellow-300 mt-1">Escolha a Transcendência da sua Bankai</h4>
                          <p className="text-xs text-bleach-creamDim">
                            As 3 evoluções geradas pela IA estão permanentemente salvas na sua alma. Analise e sele a que melhor representa sua evolução.
                          </p>
                        </div>
                        <button
                          onClick={() => abrirFluxoDespertar("bankai")}
                          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-xl shadow whitespace-nowrap"
                        >
                          🔍 Abrir Visão em Modal Completo
                        </button>
                      </div>

                      {/* 3 Bankai Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        {personagem.opcoesBankaiPendentes.map((c, idx) => {
                          const b = c.bankai || c;
                          return (
                            <div key={idx} className="p-4 rounded-xl bg-black/80 border border-yellow-500/40 hover:border-yellow-400 flex flex-col justify-between space-y-3 transition">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-500/50">
                                    Opção {idx + 1} • {b.tipoEvolucao || "Evolução Espiritual"}
                                  </span>
                                </div>
                                <h5 className="font-title text-lg text-yellow-300 leading-tight">
                                  {b.nome} {b.traducao && <span className="text-xs font-normal text-yellow-200/80">({b.traducao})</span>}
                                </h5>
                                <p className="text-xs text-yellow-200 italic">"{b.comando}"</p>

                                {b.pontoRuptura && (
                                  <div className="p-2 bg-amber-950/40 rounded border border-yellow-500/30 text-[11px] text-yellow-200">
                                    <strong className="text-yellow-400 block text-[10px] uppercase">💥 Ponto de Ruptura:</strong>
                                    {b.pontoRuptura}
                                  </div>
                                )}

                                {b.pontoFraco && (
                                  <div className="p-2 bg-red-950/40 rounded border border-red-500/40 text-[11px] text-red-200">
                                    <strong className="text-red-400 block text-[10px] uppercase font-bold">🎯 Brecha / Ponto Fraco:</strong>
                                    {b.pontoFraco}
                                  </div>
                                )}

                                <p className="text-xs text-bleach-creamDim line-clamp-3">
                                  {b.poder}
                                </p>
                              </div>

                              <button
                                onClick={() => {
                                  const confirma = confirm(`Tem certeza que deseja selar definitivamente a Bankai [${b.nome}] na sua alma?`);
                                  if (confirma) escolherCaminhoEspiritual(c);
                                }}
                                className="w-full py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-extrabold text-xs uppercase rounded-lg shadow hover:brightness-110 transition"
                              >
                                卍 Selar Esta Bankai
                              </button>
                            </div>
                          );
                        })}
                      </div>
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
                  )
                )}
              </div>
            ) : (
              personagem.opcoesShikaiPendentes && personagem.opcoesShikaiPendentes.length > 0 ? (
                <div className="space-y-4 p-5 sm:p-6 bg-gradient-to-b from-orange-950/70 via-black to-bleach-panel rounded-2xl border-2 border-bleach-orange/80 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-bleach-orange/30 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-orange-950 text-bleach-orange border border-bleach-orange">
                        ⚔️ 4 MANIFESTAÇÕES DE SHIKAI FORJADAS & SALVAS
                      </span>
                      <h4 className="font-title text-xl sm:text-2xl text-bleach-orange mt-1">Escolha a Manifestação da sua Shikai</h4>
                      <p className="text-xs text-bleach-creamDim">
                        As 4 opções geradas pela IA estão permanentemente salvas na sua alma. Analise os caminhos e sele a sua Shikai autêntica.
                      </p>
                    </div>
                    <button
                      onClick={() => abrirFluxoDespertar("shikai")}
                      className="px-4 py-2 bg-bleach-orange hover:bg-orange-500 text-black font-extrabold text-xs uppercase rounded-xl shadow whitespace-nowrap"
                    >
                      🔍 Abrir Visão em Modal Completo
                    </button>
                  </div>

                  {/* 4 Shikai Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {personagem.opcoesShikaiPendentes.map((c, idx) => {
                      const s = c.shikai || c;
                      return (
                        <div key={idx} className="p-4 rounded-xl bg-black/80 border border-bleach-orange/40 hover:border-bleach-orange flex flex-col justify-between space-y-3 transition">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-orange-950 text-bleach-orange border border-orange-500/50">
                                Opção {idx + 1} • {s.elemento || "Elemento Espiritual"}
                              </span>
                            </div>
                            <h5 className="font-title text-lg text-white leading-tight">
                              {s.nome} {s.traducao && <span className="text-xs font-normal text-bleach-creamDim">({s.traducao})</span>}
                            </h5>
                            <p className="text-xs text-yellow-300 italic">"{s.comando}"</p>

                            <div className="text-[11px] text-bleach-creamDim space-y-1">
                              <div><strong>⚔️ Forma:</strong> {s.formaArma || s.forma}</div>
                              <div className="line-clamp-2"><strong>⚡ Poder:</strong> {s.poder}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const confirma = confirm(`Tem certeza que deseja selar definitivamente a Shikai [${s.nome}] na sua alma?`);
                              if (confirma) escolherCaminhoEspiritual(c);
                            }}
                            className="w-full py-2.5 bg-gradient-to-r from-bleach-orange to-red-600 text-black font-extrabold text-xs uppercase rounded-lg shadow hover:brightness-110 transition"
                          >
                            ✨ Selar Esta Shikai Definitiva
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
              )
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

          {/* 1. PAINEL DE INFUSÃO DE REIATSU (REIATSU SURGE) */}
          <Section
            title="🌀 Infusão Espiritual de Combate (Reiatsu Surge da Cena)"
            subtitle="Canalize sua Pressão Espiritual temporariamente para amplificar sua Força ou Resiliência em ações decisivas"
            className="border-2 border-blue-500/50 bg-gradient-to-r from-blue-950/20 via-black to-bleach-panel"
          >
            {(() => {
              const pressaoBase = Number(personagem.atributos?.pressao || 10);
              const forcaBase = Number(personagem.atributos?.forca || 10);
              const resilienciaBase = Number(personagem.atributos?.resiliencia || 10);

              const pressaoRestante = Math.max(0, pressaoBase - gastoPressaoForca - gastoPressaoResiliencia);
              const forcaEfetiva = forcaBase + gastoPressaoForca;
              const resilienciaEfetiva = resilienciaBase + gastoPressaoResiliencia;
              const pctPressaoRestante = Math.round((pressaoRestante / Math.max(1, pressaoBase)) * 100);

              function alterarInjecaoForca(qtd) {
                if (qtd > 0) {
                  const possivel = Math.min(qtd, pressaoRestante);
                  setGastoPressaoForca((prev) => prev + possivel);
                } else {
                  const remover = Math.min(Math.abs(qtd), gastoPressaoForca);
                  setGastoPressaoForca((prev) => prev - remover);
                }
              }

              function alterarInjecaoResiliencia(qtd) {
                if (qtd > 0) {
                  const possivel = Math.min(qtd, pressaoRestante);
                  setGastoPressaoResiliencia((prev) => prev + possivel);
                } else {
                  const remover = Math.min(Math.abs(qtd), gastoPressaoResiliencia);
                  setGastoPressaoResiliencia((prev) => prev - remover);
                }
              }

              function restaurarPressaoCena() {
                setGastoPressaoForca(0);
                setGastoPressaoResiliencia(0);
              }

              return (
                <div className="space-y-4">
                  {/* Barra de Pressão Espiritual da Cena */}
                  <div className="p-4 bg-black/80 rounded-xl border border-blue-500/40 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌀</span>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                            Reserva de Pressão Espiritual na Cena
                          </span>
                          <div className="text-[11px] text-bleach-muted">
                            Total: <strong className="text-white">{pressaoBase} pts</strong> | Disponível: <strong className="text-cyan-300">{pressaoRestante} pts</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {gastoPressaoForca > 0 && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500">
                            +{gastoPressaoForca} em Força
                          </span>
                        )}
                        {gastoPressaoResiliencia > 0 && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500">
                            +{gastoPressaoResiliencia} em Resiliência
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={restaurarPressaoCena}
                          disabled={gastoPressaoForca === 0 && gastoPressaoResiliencia === 0}
                          className="px-3 py-1 bg-bleach-panel border border-white/10 text-xs text-bleach-cream rounded-lg hover:border-bleach-orange disabled:opacity-30 transition"
                        >
                          🔄 Restaurar Cena
                        </button>
                      </div>
                    </div>

                    {/* Barra Visual */}
                    <div className="w-full bg-black h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${pctPressaoRestante}%`,
                          background: pctPressaoRestante > 50
                            ? "linear-gradient(90deg, #1E4C63 0%, #4FB3E8 100%)"
                            : pctPressaoRestante > 20
                            ? "linear-gradient(90deg, #C94E0A 0%, #FF6A13 100%)"
                            : "linear-gradient(90deg, #7A1711 0%, #D6483F 100%)"
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Controles de Infusão: Força e Resiliência */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Infusão em Força */}
                    <div className="bg-bleach-panel2 border border-red-500/40 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                            <span>🗡️</span> Infundir em Força
                          </h4>
                          <span className="text-[11px] text-bleach-muted">Potência física, Hakuda e impacto de corte</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-bleach-muted">Efetivo:</span>
                          <span className="text-xl font-bold font-mono text-red-400 ml-1.5">{forcaEfetiva} pts</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-bleach-creamDim font-mono">
                        Base: {forcaBase} pts + Infundido: <strong className="text-red-300">+{gastoPressaoForca} pts</strong>
                      </div>

                      {/* Botões de Alocação */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-bleach-muted font-bold mr-1">Ajuste:</span>
                        {[-50, -25, -10, 10, 25, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => alterarInjecaoForca(amt)}
                            disabled={amt > 0 ? pressaoRestante < amt : gastoPressaoForca < Math.abs(amt)}
                            className="px-2 py-1 bg-black/60 border border-white/10 text-white rounded text-[10px] font-mono font-bold hover:border-red-400 disabled:opacity-20 transition"
                          >
                            {amt > 0 ? `+${amt}` : amt}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            if (pressaoRestante > 0) alterarInjecaoForca(pressaoRestante);
                          }}
                          disabled={pressaoRestante <= 0}
                          className="px-2 py-1 bg-red-950 text-red-300 border border-red-500 rounded text-[10px] font-bold uppercase disabled:opacity-20 hover:brightness-110"
                        >
                          Tudo ({pressaoRestante})
                        </button>
                      </div>
                    </div>

                    {/* Infusão em Resiliência */}
                    <div className="bg-bleach-panel2 border border-purple-500/40 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                            <span>🛡️</span> Infundir em Resiliência
                          </h4>
                          <span className="text-[11px] text-bleach-muted">Densidade de armadura de Reiatsu e mitigação</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-bleach-muted">Efetivo:</span>
                          <span className="text-xl font-bold font-mono text-purple-400 ml-1.5">{resilienciaEfetiva} pts</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-bleach-creamDim font-mono">
                        Base: {resilienciaBase} pts + Infundido: <strong className="text-purple-300">+{gastoPressaoResiliencia} pts</strong>
                      </div>

                      {/* Botões de Alocação */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-bleach-muted font-bold mr-1">Ajuste:</span>
                        {[-50, -25, -10, 10, 25, 50, 100].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => alterarInjecaoResiliencia(amt)}
                            disabled={amt > 0 ? pressaoRestante < amt : gastoPressaoResiliencia < Math.abs(amt)}
                            className="px-2 py-1 bg-black/60 border border-white/10 text-white rounded text-[10px] font-mono font-bold hover:border-purple-400 disabled:opacity-20 transition"
                          >
                            {amt > 0 ? `+${amt}` : amt}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            if (pressaoRestante > 0) alterarInjecaoResiliencia(pressaoRestante);
                          }}
                          disabled={pressaoRestante <= 0}
                          className="px-2 py-1 bg-purple-950 text-purple-300 border border-purple-500 rounded text-[10px] font-bold uppercase disabled:opacity-20 hover:brightness-110"
                        >
                          Tudo ({pressaoRestante})
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Texto Explicativo de Regra de Cena */}
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-xs text-bleach-creamDim leading-relaxed space-y-1">
                    <div className="flex items-center gap-1.5 text-bleach-orange font-bold text-[11px] uppercase">
                      <span>💡</span> Como Funciona a Infusão de Pressão Espiritual em Combate:
                    </div>
                    <p>
                      Esse recurso permite canalizar momentaneamente a sua <strong>Pressão Espiritual</strong> para somar o valor em seus atributos de <strong>Força</strong> ou <strong>Resiliência</strong> durante uma ação decisiva. 
                    </p>
                    <p className="text-[11px] text-amber-200/90 font-medium">
                      ⚠️ Este aumento é temporário e <strong>dura apenas naquele momento, em uma única cena</strong>. Na cena seguinte, você poderá utilizar o recurso de novo com a Pressão Espiritual que restar (ou restaurar sua reserva completa após um momento de descanso ou nova rodada).
                    </p>
                  </div>
                </div>
              );
            })()}
          </Section>

          {/* 2. CARDS DE ATRIBUTOS ESPIRITUAIS */}
          <Section title="Atributos Espirituais" subtitle="O valor puro do seu poder na Sociedade das Almas">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ATTRS.map((a) => {
                const valBase = Number(personagem.atributos?.[a.key] || 10);
                const bônusSurge = a.key === "forca" ? gastoPressaoForca : a.key === "resiliencia" ? gastoPressaoResiliencia : 0;
                const valExibido = valBase + bônusSurge;

                return (
                  <div key={a.key} className="bg-bleach-panel2 border border-bleach-borderSoft rounded-xl p-4 flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: a.color }}>
                          {a.label}
                          {bônusSurge > 0 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-950 text-orange-300 border border-orange-500">
                              +{bônusSurge} na cena
                            </span>
                          )}
                        </h4>
                        <p className="text-[11px] text-bleach-muted">{a.desc}</p>
                      </div>
                      <span className="text-3xl font-extrabold font-mono" style={{ color: a.color }}>
                        {valExibido}
                      </span>
                    </div>
                    <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (valExibido / 200) * 100)}%`, backgroundColor: a.color }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* 3. SIMULADOR INTERATIVO DE CONFRONTO DE 4 ATRIBUTOS */}
          <Section
            title="🎯 Simulador Interativo de Confronto de Atributos"
            subtitle="Teste disputas de combate em tempo real segundo o regulamento oficial do Seireitei"
            className="border-2 border-purple-500/50"
          >
            {(() => {
              const pressaoBase = Number(personagem.atributos?.pressao || 10);
              const forcaEfetiva = Number(personagem.atributos?.forca || 10) + gastoPressaoForca;
              const velocidadeBase = Number(personagem.atributos?.velocidade || 10);
              const resilienciaEfetiva = Number(personagem.atributos?.resiliencia || 10) + gastoPressaoResiliencia;

              let analise = null;
              let labelStatPlayer = "";
              let valorStatPlayer = 0;
              let labelStatInimigo = "";

              if (simuladorModo === "forca_resiliencia") {
                analise = calcularRelacaoForcaResiliencia(simStatInimigo, resilienciaEfetiva);
                labelStatPlayer = "Sua Resiliência Efetiva";
                valorStatPlayer = resilienciaEfetiva;
                labelStatInimigo = "Força do Golpe Inimigo";
              } else if (simuladorModo === "forca_forca") {
                analise = calcularRelacaoForcaForca(forcaEfetiva, simStatInimigo);
                labelStatPlayer = "Sua Força Efetiva";
                valorStatPlayer = forcaEfetiva;
                labelStatInimigo = "Força do Oponente";
              } else if (simuladorModo === "velocidade_velocidade") {
                analise = calcularRelacaoVelocidadeVelocidade(velocidadeBase, simStatInimigo);
                labelStatPlayer = "Sua Velocidade";
                valorStatPlayer = velocidadeBase;
                labelStatInimigo = "Velocidade do Oponente";
              } else if (simuladorModo === "kaido_cura") {
                analise = (typeof calcularEfeitoKaido === 'function')
                  ? calcularEfeitoKaido(pressaoBase, simKaidoEstado)
                  : { categoria: "Tratamento Tático", cor: "#10B981", cenasNecessarias: 2, curaHpStr: "Recuperação de 70%", estadoFinal: "Inteiro", diagnostico: "Estabilizado", dicaTatica: "Manter canalização", roteiroCenas: [] };
                labelStatPlayer = "Sua Pressão Espiritual (Kaidō)";
                valorStatPlayer = pressaoBase;
                labelStatInimigo = "Estado Inicial do Paciente";
              } else {
                analise = calcularRelacaoPressaoPressao(pressaoBase, simStatInimigo);
                labelStatPlayer = "Sua Pressão Espiritual";
                valorStatPlayer = pressaoBase;
                labelStatInimigo = "Pressão Espiritual do Oponente";
              }

              return (
                <div className="space-y-5">
                  {/* Seletor dos 5 Modos de Confronto & Aplicação Espiritual */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { id: "forca_resiliencia", label: "🛡️ Força X Resiliência", desc: "Mitigação & Absorção", cor: "#8B6FD6" },
                      { id: "forca_forca", label: "⚔️ Força X Força", desc: "Disputa & Trava de Espadas", cor: "#D6483F" },
                      { id: "velocidade_velocidade", label: "⚡ Velocidade X Velocidade", desc: "Shunpo & Flanqueamento", cor: "#5FA96B" },
                      { id: "pressao_pressao", label: "🌀 Pressão X Pressão", desc: "Supressão de Aura & Choque", cor: "#4FB3E8" },
                      { id: "kaido_cura", label: "🌿 Kaidō & Cura Médica", desc: "Pressão vs Cenas de Tratamento", cor: "#10B981" }
                    ].map((modo) => (
                      <button
                        key={modo.id}
                        type="button"
                        onClick={() => setSimuladorModo(modo.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex-1 min-w-[150px] text-left border ${
                          simuladorModo === modo.id
                            ? "bg-bleach-panel2 text-white border-white shadow-lg"
                            : "bg-black/60 text-bleach-creamDim border-white/5 hover:border-white/20"
                        }`}
                        style={{ borderColor: simuladorModo === modo.id ? modo.cor : undefined }}
                      >
                        <div className="font-extrabold text-sm">{modo.label}</div>
                        <div className="text-[10px] text-bleach-muted mt-0.5">{modo.desc}</div>
                      </button>
                    ))}
                  </div>

                  {/* Painel do Modo Selecionado */}
                  {simuladorModo === "kaido_cura" ? (
                    <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-950/30 via-bleach-panel2 to-black rounded-xl border-2 border-emerald-500/50 space-y-5 shadow-2xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                              Hospital Geral do 4º Esquadrão
                            </span>
                            <span className="text-xs font-mono text-cyan-400 font-bold">
                              Pressão Aplicada: {pressaoBase} pts
                            </span>
                          </div>
                          <h5 className="font-title text-2xl text-emerald-400 mt-1 flex items-center gap-2">
                            <span>🌿</span> Simulador de Kaidō & Cenas de Cura
                          </h5>
                          <p className="text-xs text-bleach-creamDim">
                            Calcule quantas cenas você precisa manter o Kaidō ativo no WhatsApp e a evolução do estado do aliado.
                          </p>
                        </div>

                        {/* Seletor de Estado Inicial do Aliado */}
                        <div className="bg-black/70 p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
                          <label className="text-[10px] text-bleach-muted uppercase font-bold block">
                            Estado Inicial do Paciente:
                          </label>
                          <div className="flex gap-1.5">
                            {[
                              { id: "Derrotado", label: "💀 Derrotado", cor: "#EF4444" },
                              { id: "Debilitado", label: "🩸 Debilitado", cor: "#F97316" },
                              { id: "Ferido", label: "🩹 Ferido", cor: "#EAB308" }
                            ].map((est) => (
                              <button
                                key={est.id}
                                type="button"
                                onClick={() => setSimKaidoEstado(est.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                                  simKaidoEstado === est.id
                                    ? "bg-emerald-500 text-black border-white shadow"
                                    : "bg-black/60 text-bleach-creamDim border-white/10 hover:border-emerald-400"
                                }`}
                              >
                                {est.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cartões de Métricas de Cura */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-500/40 text-center">
                          <span className="text-[10px] text-bleach-muted uppercase font-bold block">Tempo de Tratamento no ON:</span>
                          <span className="text-2xl font-mono font-black text-emerald-400 block mt-0.5">
                            ⏳ {analise.cenasNecessarias} {analise.cenasNecessarias === 1 ? 'Cena' : 'Cenas'}
                          </span>
                          <span className="text-[11px] text-emerald-200/70">Manutenção contínua de Reiki</span>
                        </div>

                        <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-500/40 text-center">
                          <span className="text-[10px] text-bleach-muted uppercase font-bold block">Evolução do Paciente:</span>
                          <span className="text-base font-extrabold text-white block mt-1">
                            {analise.estadoInicial || simKaidoEstado} ➔ <span className="text-emerald-400">{analise.estadoFinal}</span>
                          </span>
                          <span className="text-[11px] text-yellow-300/80 font-mono">{analise.curaHpStr}</span>
                        </div>

                        <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-500/40 text-center">
                          <span className="text-[10px] text-bleach-muted uppercase font-bold block">Classificação Médica:</span>
                          <span className="text-sm font-extrabold text-emerald-300 block mt-1">
                            {analise.categoria}
                          </span>
                          <span className="text-[10px] text-bleach-muted">{analise.diagnostico}</span>
                        </div>
                      </div>

                      {/* Roteiro Narrativo Passo a Passo por Cena */}
                      <div className="p-4 bg-black/80 rounded-xl border border-emerald-500/30 space-y-3">
                        <h6 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <span>📋</span> Roteiro Passo-a-Passo de Narração para o WhatsApp ({analise.cenasNecessarias} Cenas):
                        </h6>
                        <div className="space-y-2">
                          {(analise.roteiroCenas || []).map((passo, idx) => (
                            <div key={idx} className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-start gap-2.5">
                              <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-300 border border-emerald-500 font-mono font-bold text-[10px] rounded shrink-0">
                                Cena {passo.cena}
                              </span>
                              <div>
                                <strong className="text-white text-xs block">{passo.fase}</strong>
                                <p className="text-xs text-bleach-creamDim mt-0.5">{passo.instrucao}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recomendação de Roleplay */}
                      <div className="p-3 bg-bleach-panel rounded-xl border border-white/10 text-xs">
                        <strong className="text-emerald-400 block text-[10px] uppercase font-bold">Instrução Tática do 4º Esquadrão:</strong>
                        <p className="text-bleach-cream mt-0.5 leading-relaxed">{analise.dicaTatica}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-5 bg-gradient-to-r from-black via-bleach-panel2 to-black rounded-xl border-2 border-white/10 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                        <div>
                          <h5 className="font-title text-xl text-white flex items-center gap-2">
                            <span>🎯</span> Disputa: {labelStatPlayer} ({valorStatPlayer} pts) vs {labelStatInimigo}
                          </h5>
                          <p className="text-[11px] text-bleach-creamDim">
                            Simule o resultado narrativo e mecânico com base na comparação oficial dos atributos.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-bleach-muted">{labelStatInimigo}:</span>
                          <input
                            type="number"
                            min="1"
                            max="9999"
                            value={simStatInimigo}
                            onChange={(e) => setSimStatInimigo(Math.max(1, Number(e.target.value) || 1))}
                            className="w-24 px-3 py-1.5 bg-black/80 border border-white/30 rounded-lg text-white font-mono font-bold text-sm text-center focus:outline-none focus:border-bleach-orange"
                          />
                          <span className="text-xs font-mono text-bleach-orange font-bold">pts</span>
                        </div>
                      </div>

                      {/* Presets Rápidos */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-bleach-muted uppercase mr-1">Presets Rápidos:</span>
                        {[
                          { label: "💀 Hollow Menor", val: 30 },
                          { label: "⚔️ Sentinela", val: 80 },
                          { label: "⚡ Tenente", val: 250 },
                          { label: "👑 Capitão", val: 650 },
                          { label: "🩸 Espada Top 4", val: 1200 },
                          { label: "🌟 Comandante", val: 2500 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => setSimStatInimigo(preset.val)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition ${
                              simStatInimigo === preset.val
                                ? "bg-bleach-orange text-black font-bold border border-white shadow"
                                : "bg-black/60 text-bleach-creamDim hover:text-white border border-white/10"
                            }`}
                          >
                            {preset.label} ({preset.val})
                          </button>
                        ))}
                      </div>

                      {/* Resultado da Simulação */}
                      <div className="p-4 bg-black/90 rounded-xl border-2 space-y-3" style={{ borderColor: analise.cor }}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full text-black"
                              style={{ backgroundColor: analise.cor }}
                            >
                              {analise.categoria}
                            </span>
                            <span className="text-xs font-mono text-bleach-creamDim">
                              {labelStatPlayer} ({valorStatPlayer}) / Inimigo ({simStatInimigo}) = <strong className="font-bold text-white">{analise.pct}%</strong>
                            </span>
                          </div>

                          <span className="text-xs font-bold font-mono" style={{ color: analise.cor }}>
                            {analise.resultadoStr || analise.danoRecebidoStr}
                          </span>
                        </div>

                        {/* Barra de Proporção */}
                        <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, analise.pct)}%`,
                              backgroundColor: analise.cor
                            }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                          <div className="p-2.5 bg-bleach-panel rounded-lg border border-white/5">
                            <strong className="text-bleach-muted block text-[10px] uppercase">Efeito de Postura / Movimento:</strong>
                            <p className="text-bleach-cream mt-0.5">{analise.efeitoPostura}</p>
                          </div>
                          <div className="p-2.5 bg-bleach-panel rounded-lg border border-white/5">
                            <strong className="text-bleach-muted block text-[10px] uppercase">Risco à Zanpakutō / Arma:</strong>
                            <p className="text-bleach-cream mt-0.5">{analise.riscoArma}</p>
                          </div>
                          <div className="p-2.5 bg-bleach-panel rounded-lg border border-white/5">
                            <strong className="text-bleach-orange block text-[10px] uppercase">Recomendação Tática de Narração:</strong>
                            <p className="text-bleach-cream mt-0.5">{analise.dicaTatica}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </Section>
        </div>
      )}

      {/* SUBPAGE: KIDOS & TÉCNICAS */}
      {subPaginaFicha === "kidos" && (
        <div className="space-y-6">
          
          {/* BARRA DE ADMIN: AJUSTES RÁPIDOS DE CONHECIMENTO & CENAS */}
          {isAdmin && (
            <div className="p-3.5 bg-gradient-to-r from-yellow-950/60 via-black/90 to-amber-950/60 border-2 border-yellow-500/70 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-sm">
                  👑
                </span>
                <div>
                  <span className="font-title text-sm text-yellow-400 block">Gestão de Conhecimento ADM ({personagem.nome})</span>
                  <span className="text-[11px] text-bleach-creamDim">
                    Saldo: <strong className="text-yellow-400 font-mono">{personagem.conhecimento || 0} ₪</strong> | Cenas Semana: <strong className="text-white font-mono">{personagem.cenasSemana || 0}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const atual = Number(personagem.conhecimento || 0);
                    updateChar({ conhecimento: atual + 100 }, "+100 ₪ de Conhecimento creditado pelo ADM");
                    playReiatsuSound('win');
                  }}
                  className="px-2.5 py-1 bg-yellow-500 text-black font-extrabold rounded-lg hover:brightness-110 shadow text-xs transition"
                >
                  +100 ₪
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const atual = Number(personagem.conhecimento || 0);
                    updateChar({ conhecimento: atual + 500 }, "+500 ₪ de Conhecimento creditado pelo ADM");
                    playReiatsuSound('win');
                  }}
                  className="px-2.5 py-1 bg-yellow-500 text-black font-extrabold rounded-lg hover:brightness-110 shadow text-xs transition"
                >
                  +500 ₪
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const atual = Number(personagem.conhecimento || 0);
                    updateChar({ conhecimento: atual + 1000 }, "+1000 ₪ de Conhecimento creditado pelo ADM");
                    playReiatsuSound('win');
                  }}
                  className="px-2.5 py-1 bg-yellow-500 text-black font-extrabold rounded-lg hover:brightness-110 shadow text-xs transition"
                >
                  +1000 ₪
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sem = Number(personagem.cenasSemana || 0);
                    const tot = Number(personagem.cenasTotal || 0);
                    const con = Number(personagem.conhecimento || 0);
                    updateChar({
                      cenasSemana: sem + 5,
                      cenasTotal: tot + 5,
                      conhecimento: con + 500
                    }, "📊 +5 cenas no WhatsApp (+500 ₪ Conhecimento) lançadas pelo ADM");
                    playReiatsuSound('win');
                  }}
                  className="px-2.5 py-1 bg-gradient-to-r from-orange-500 to-amber-600 text-black font-extrabold rounded-lg hover:brightness-110 shadow text-xs transition"
                >
                  +5 Cenas (+500 ₪)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const val = prompt(`Definir saldo exato de Conhecimento para [${personagem.nome}]:`, String(personagem.conhecimento || 0));
                    if (val !== null && !isNaN(Number(val))) {
                      const novoCon = Math.max(0, Number(val));
                      updateChar({ conhecimento: novoCon }, `Saldo de Conhecimento ajustado para ${novoCon} ₪ pelo ADM`);
                      playReiatsuSound('win');
                    }
                  }}
                  className="px-2.5 py-1 bg-black/80 border border-white/20 text-white font-bold rounded-lg hover:border-yellow-400 text-xs transition"
                >
                  ✏️ Saldo Manual
                </button>
              </div>
            </div>
          )}
          
          {/* 1. BARRAS SUPERIORES: CONHECIMENTO (DINHEIRO DE KIDŌ) & PRESSÃO ESPIRITUAL (REIATSU NA CENA) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* CARD 1: CONHECIMENTO ESPIRITUAL */}
            <div 
              onClick={() => setShowKidoTreeModal(true)}
              className="p-4 bg-gradient-to-r from-amber-950/40 via-black/80 to-yellow-950/40 border-2 border-yellow-500/60 hover:border-yellow-400 rounded-2xl cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.01] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-lg">
                    📚
                  </span>
                  <div>
                    <h4 className="font-title text-base text-yellow-400">CONHECIMENTO ESPIRITUAL</h4>
                    <p className="text-[11px] text-bleach-muted">Moeda de aprendizagem gerada por atividade de cenas</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-950 border border-yellow-500 text-yellow-300 text-[10px] font-extrabold uppercase">
                  Saldo Ativo
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-bleach-muted block uppercase">Saldo para Feitiços:</span>
                  <span className="text-2xl font-mono font-black text-yellow-400 tracking-tight">
                    {personagem.conhecimento || 0} <span className="text-xs text-yellow-200/60 font-sans font-normal">₪ (Conhecimento)</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowKidoTreeModal(true);
                    }}
                    className="px-3 py-1.5 bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500 text-yellow-300 text-xs font-bold rounded-lg transition flex items-center gap-1"
                  >
                    <span>🌳</span> Árvore de Habilidades
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowKidoShopModal(true);
                    }}
                    className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black text-xs font-extrabold rounded-lg transition shadow flex items-center gap-1"
                  >
                    <span>✨</span> Aprender Kidō
                  </button>
                </div>
              </div>

              <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(8, ((personagem.conhecimento || 0) / 1000) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* CARD 2: PRESSÃO ESPIRITUAL NA CENA */}
            {(() => {
              const pressaoTotal = Number(personagem.atributos?.pressao || 10);
              const pressaoRestante = Math.max(0, pressaoTotal - gastoPressaoForca - gastoPressaoResiliencia);
              const pctReiatsu = Math.round((pressaoRestante / Math.max(1, pressaoTotal)) * 100);

              return (
                <div className="p-4 bg-gradient-to-r from-blue-950/40 via-black/80 to-cyan-950/40 border-2 border-blue-500/60 rounded-2xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500 flex items-center justify-center text-lg">
                        🌀
                      </span>
                      <div>
                        <h4 className="font-title text-base text-cyan-300">PRESSÃO ESPIRITUAL (REIATSU)</h4>
                        <p className="text-[11px] text-bleach-muted">Energia disponível para canalização de feitiços nesta cena</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-cyan-500 text-cyan-300 text-[10px] font-extrabold uppercase">
                      {pctReiatsu}% da Lâmina
                    </span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-bleach-muted block uppercase">Reserva na Cena:</span>
                      <span className="text-2xl font-mono font-black text-cyan-400 tracking-tight">
                        {pressaoRestante} <span className="text-xs text-bleach-muted font-sans font-normal">/ {pressaoTotal} pts</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setGastoPressaoForca(0);
                        setGastoPressaoResiliencia(0);
                        playReiatsuSound('win');
                      }}
                      className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 border border-cyan-500 text-cyan-300 text-xs font-bold rounded-lg transition flex items-center gap-1"
                    >
                      <span>🔄</span> Restaurar Cena
                    </button>
                  </div>

                  <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${pctReiatsu}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

          </div>

          {/* SELETOR DE SUB-ABAS DE KIDŌ */}
          <div className="flex gap-2 border-b border-white/10 pb-3 flex-wrap">
            <button
              type="button"
              onClick={() => setSubAbaKido("magias")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 border ${
                subAbaKido === "magias"
                  ? "bg-bleach-orange text-black border-white shadow-lg"
                  : "bg-black/60 text-bleach-creamDim border-white/10 hover:border-white/30"
              }`}
            >
              <span>💥</span> Feitiços & Combate (Hadō / Bakudō)
            </button>
            <button
              type="button"
              onClick={() => setSubAbaKido("kaido")}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 border ${
                subAbaKido === "kaido"
                  ? "bg-emerald-500 text-black border-white shadow-lg font-black"
                  : "bg-black/60 text-emerald-300 border-emerald-500/30 hover:border-emerald-400"
              }`}
            >
              <span>🌿</span> Kaidō & Simulação de Cura (4º Esquadrão)
            </button>
          </div>

          {/* SUB-ABA 1: FEITIÇOS & COMBATE */}
          {subAbaKido === "magias" && (
            <div className="space-y-6">
              {/* 2. TÉCNICAS E KIDŌS REGISTRADOS NA FICHA */}
              <Section 
                title="📜 Kidōs Registrados na Ficha do Shinigami" 
                subtitle="Feitiços dominados e prontos para uso em combate ou simulação"
              >
                {(() => {
                  const pressaoTotal = Number(personagem.atributos?.pressao || 10);
                  const cap = (typeof getCapacidadeKidos === 'function') ? getCapacidadeKidos(pressaoTotal) : { limiteMaximo: 4, tierNome: "Iniciante", limiteEquipadosStr: "Até 4 Feitiços", cor: "#10B981", descricao: "Em fase de iniciação espiritual." };
                  const totalAprendidos = (personagem.kidosConhecidos || []).length;
                  
                  return (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 p-3.5 bg-black/70 rounded-xl border border-white/10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-bleach-cream">
                            Slots de Magia Utilizados: <strong className="text-yellow-400 font-mono text-sm">{totalAprendidos} / {cap.limiteMaximo}</strong>
                          </span>
                          <span
                            className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-black font-mono shadow"
                            style={{ backgroundColor: cap.cor }}
                          >
                            {cap.tierNome}
                          </span>
                        </div>
                        <p className="text-[11px] text-bleach-muted">
                          {cap.descricao} ‹ <strong>{cap.limiteEquipadosStr}</strong> ›
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowKidoShopModal(true)}
                        className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition"
                      >
                        <span>✨ 📖</span> Aprender Novos Kidōs (Loja)
                      </button>
                    </div>
                  );
                })()}

                {(!personagem.kidosConhecidos || personagem.kidosConhecidos.length === 0) ? (
                  <div className="p-8 text-center bg-gradient-to-b from-yellow-950/20 to-black/80 border-2 border-dashed border-yellow-500/40 rounded-2xl space-y-3 shadow-xl">
                    <div className="text-4xl">📚✨</div>
                    <h4 className="font-title text-xl text-yellow-400">Escolha seus 4 Kidōs Iniciais na Loja!</h4>
                    <p className="text-xs text-bleach-creamDim max-w-lg mx-auto leading-relaxed">
                      Como Shinigami, você possui <strong className="text-yellow-400 font-mono font-bold">{personagem.conhecimento || 450} ₪</strong> de Conhecimento inicial para escolher livremente até <strong>4 feitiços básicos</strong> de Hadō, Bakudō e Kaidō na Biblioteca do Seireitei!
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowKidoShopModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition"
                      >
                        📖 Abrir Loja & Escolher Meus 4 Feitiços
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {personagem.kidosConhecidos.map((k) => {
                      const isHado = k.cat === "Hadō";
                      const isBakudo = k.cat === "Bakudō";
                      const pressaoTotal = Number(personagem.atributos?.pressao || 30);
                      const pressaoRestante = Math.max(0, pressaoTotal - gastoPressaoForca - gastoPressaoResiliencia);
                      const custo = calcularCustoKido(k, pressaoTotal);
                      const poderObj = calcularPoderKido(k, pressaoTotal, custo.custoTotal, false);
                      const poder = poderObj.poderFinal || poderObj;

                      return (
                        <div
                          key={k.id}
                          className={`p-4 bg-bleach-panel2 border rounded-xl flex flex-col justify-between space-y-3 transition-all duration-300 ${
                            isHado
                              ? "border-red-500/40 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                              : isBakudo
                              ? "border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                              : "border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                isHado ? "bg-red-950 text-red-300 border-red-500" : isBakudo ? "bg-blue-950 text-cyan-300 border-cyan-500" : "bg-emerald-950 text-emerald-300 border-emerald-500"
                              }`}>
                                {k.cat} #{k.numero}
                              </span>
                              <span className="text-[11px] font-mono text-bleach-orange font-bold">
                                Custo: {custo.custoTotal} pts
                              </span>
                            </div>

                            <h5 className="font-bold text-white text-sm leading-snug">
                              {k.nome}
                            </h5>

                            {k.incant && k.incant !== "—" && (
                              <div className="p-2 bg-black/60 rounded-lg border border-white/5 text-[10px] text-cyan-200/80 italic line-clamp-2">
                                "{k.incant}"
                              </div>
                            )}

                            <p className="text-[11px] text-bleach-creamDim line-clamp-2 leading-relaxed">
                              {k.desc}
                            </p>

                            <div className="text-[10px] font-mono text-bleach-muted flex justify-between">
                              <span>Poder Base: <strong className="text-white">{poder} pts</strong></span>
                              <span className="text-cyan-300">Encanto: <strong>+30% PE</strong></span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <button
                              type="button"
                              onClick={() => setKidoModalFicha(k)}
                              className="w-full py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-bold text-bleach-cream hover:text-white hover:border-bleach-orange transition flex items-center justify-center gap-1.5"
                            >
                              <span>👁️</span> Detalhes & Simulação
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (pressaoRestante < custo.custoTotal) {
                                  alert(`Reiatsu insuficiente na cena! Custo: ${custo.custoTotal} pts | Disponível: ${pressaoRestante} pts.`);
                                  return;
                                }
                                playReiatsuSound('kido');
                                updateChar({}, `⚡ Conjurou [${k.cat} #${k.numero}] ${k.nome} na cena (Gasto: ${custo.custoTotal} pts)`);
                                alert(`✨ ${k.nome} conjurado na cena com sucesso!\n\n⚡ Poder de Feitiço: ${poder} pts\n🌀 Custo de Reiatsu: ${custo.custoTotal} pts`);
                              }}
                              disabled={pressaoRestante < custo.custoTotal}
                              className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow disabled:opacity-40 disabled:cursor-not-allowed ${
                                isHado ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110" 
                                : isBakudo ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110" 
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"
                              }`}
                            >
                              ⚡ Conjurar em Cena ({custo.custoTotal} pts)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Section>

              {/* 3. SIMULADOR INTERATIVO DE CONFRONTO DE HADŌ / BAKUDŌ */}
              {(personagem.kidosConhecidos && personagem.kidosConhecidos.length > 0) && (
                <Section
                  title="🎯 Simulador de Confronto de Kidōs Aprendidos"
                  subtitle="Teste o impacto real dos feitiços registrados na sua ficha contra atributos de oponentes"
                  className="border-2 border-bleach-orange/50"
                >
                  {(() => {
                    const kidos = (personagem.kidosConhecidos || []).filter(k => k.cat !== "Kaidō");
                    const kidoAtivo = kidos[Math.min(simKidoIndex, Math.max(0, kidos.length - 1))] || (personagem.kidosConhecidos || [])[0];
                    if (!kidoAtivo) return null;

                    const isHado = kidoAtivo.cat === "Hadō";
                    const pressaoTotal = Number(personagem.atributos?.pressao || 30);
                    const custoInfo = calcularCustoKido(kidoAtivo, pressaoTotal, simKidoExtraPressao);
                    const poderCalculadoObj = calcularPoderKido(kidoAtivo, pressaoTotal, custoInfo.custoTotal, simKidoIncantado, simKidoExtraPressao);
                    const poderCalculado = poderCalculadoObj.poderFinal || poderCalculadoObj;
                    const bonusEncantamento = poderCalculadoObj.bonusEncantamento || Math.round((pressaoTotal + simKidoExtraPressao) * 0.30);

                    let analise = isHado ? calcularEfeitoHado(poderCalculado, simKidoTargetStat) : calcularEfeitoBakudo(poderCalculado, simKidoTargetStat);
                    let labelInimigo = isHado ? "Resiliência do Alvo" : "Força do Alvo";

                    return (
                      <div className="space-y-4">
                        {/* Seletor do Kidō para Simulação */}
                        <div>
                          <label className="block text-xs font-bold text-bleach-creamDim uppercase mb-1.5">
                            Escolha um Feitiço de Combate para Simular:
                          </label>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {kidos.map((k, idx) => (
                              <button
                                key={k.id || idx}
                                type="button"
                                onClick={() => setSimKidoIndex(idx)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 border ${
                                  simKidoIndex === idx
                                    ? "bg-bleach-panel2 text-white border-bleach-orange shadow-lg"
                                    : "bg-black/60 text-bleach-creamDim border-white/5 hover:border-white/20"
                                }`}
                              >
                                <span className="text-bleach-orange block text-[10px] uppercase font-bold">{k.cat} #{k.numero}</span>
                                <span>{k.nome}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Painel do Simulador */}
                        <div className="p-4 sm:p-5 bg-gradient-to-r from-black via-bleach-panel2 to-black rounded-xl border-2 border-white/10 space-y-4 shadow-xl">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                            <div>
                              <h5 className="font-title text-xl text-white flex items-center gap-2">
                                <span>⚡</span> {kidoAtivo.nome} (Poder: {poderCalculado} pts) vs {labelInimigo}
                              </h5>
                              <p className="text-[11px] text-bleach-creamDim">
                                Custo de Reiatsu: <strong className="text-bleach-orange font-mono">{custoInfo.custoTotal} pts</strong> ({custoInfo.custoFlat} flat + {custoInfo.custoPercentual} [% total])
                              </p>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                              <label className="flex items-center gap-2 cursor-pointer text-xs text-yellow-300 font-bold bg-yellow-950/60 border border-yellow-500/50 px-2.5 py-1 rounded-lg">
                                <input
                                  type="checkbox"
                                  checked={simKidoIncantado}
                                  onChange={(e) => setSimKidoIncantado(e.target.checked)}
                                  className="accent-yellow-400"
                                />
                                <span>Recitar Encantamento (+30% PE: +{bonusEncantamento} pts)</span>
                              </label>

                              <div className="flex items-center gap-2">
                                <span className="text-xs text-bleach-muted">{labelInimigo}:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="9999"
                                  value={simKidoTargetStat}
                                  onChange={(e) => setSimTargetStat(Math.max(1, Number(e.target.value) || 1))}
                                  className="w-20 px-2.5 py-1 bg-black/80 border border-white/30 rounded-lg text-white font-mono font-bold text-xs text-center focus:outline-none focus:border-bleach-orange"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Seletor de Pressão Extra */}
                          <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-white/5">
                            <span className="text-xs text-bleach-creamDim">
                              Investir Pressão Espiritual Extra neste Feitiço:
                            </span>
                            <div className="flex gap-1.5">
                              {[0, 10, 25, 50, 100].map((pe) => (
                                <button
                                  key={pe}
                                  type="button"
                                  onClick={() => setSimKidoExtraPressao(pe)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                                    simKidoExtraPressao === pe
                                      ? "bg-bleach-orange text-black border-white shadow"
                                      : "bg-black/50 text-bleach-muted border-white/10 hover:text-white"
                                  }`}
                                >
                                  +{pe} PE
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Presets Rápidos do Alvo */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-bleach-muted uppercase mr-1">Presets do Alvo:</span>
                            {[
                              { label: "💀 Hollow Menor", val: 30 },
                              { label: "⚔️ Sentinela", val: 80 },
                              { label: "⚡ Tenente", val: 250 },
                              { label: "👑 Capitão", val: 650 },
                              { label: "🩸 Espada Top 4", val: 1200 },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setSimTargetStat(preset.val)}
                                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition ${
                                  simKidoTargetStat === preset.val
                                    ? "bg-bleach-orange text-black font-bold border border-white shadow"
                                    : "bg-black/60 text-bleach-creamDim hover:text-white border border-white/10"
                                }`}
                              >
                                {preset.label} ({preset.val})
                              </button>
                            ))}
                          </div>

                          {/* Resultado do Impacto */}
                          <div className="p-4 bg-black/90 rounded-xl border-2 space-y-3" style={{ borderColor: analise.cor }}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full text-black"
                                  style={{ backgroundColor: analise.cor }}
                                >
                                  {analise.categoria}
                                </span>
                                <span className="text-xs font-mono text-bleach-creamDim">
                                  Poder ({poderCalculado}) / Alvo ({simKidoTargetStat}) = <strong className="font-bold text-white">{analise.pct}%</strong>
                                </span>
                              </div>

                              <span className="text-xs font-bold font-mono" style={{ color: analise.cor }}>
                                {analise.danoStr || analise.duracaoStr}
                              </span>
                            </div>

                            <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-white/10">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, analise.pct)}%`,
                                  backgroundColor: analise.cor
                                }}
                              ></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                              <div className="p-2.5 bg-bleach-panel rounded-lg border border-white/5">
                                <strong className="text-bleach-muted block text-[10px] uppercase">Efeito no Adversário:</strong>
                                <p className="text-bleach-cream mt-0.5">{analise.descricao}</p>
                              </div>
                              <div className="p-2.5 bg-bleach-panel rounded-lg border border-white/5">
                                <strong className="text-bleach-orange block text-[10px] uppercase">Recomendação Tática:</strong>
                                <p className="text-bleach-cream mt-0.5">{analise.dicaTatica}</p>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })()}
                </Section>
              )}
            </div>
          )}

          {/* SUB-ABA 2: KAIDŌ & SIMULAÇÃO DE CURA MÉDICA (4º ESQUADRÃO) */}
          {subAbaKido === "kaido" && (
            <div className="space-y-6">
              {(() => {
                const pressaoTotal = Number(personagem.atributos?.pressao || 30);
                const pressaoRestante = Math.max(0, pressaoTotal - gastoPressaoForca - gastoPressaoResiliencia);
                const pressaoTotalCura = pressaoRestante + simKaidoExtraPressao;
                const bonusEncanto = Math.round(pressaoTotalCura * 0.30);
                const poderCuraFinal = simKaidoIncantado ? (pressaoTotalCura + bonusEncanto) : pressaoTotalCura;

                const kidosKaido = (personagem.kidosConhecidos || []).filter(k => k.cat === "Kaidō");
                const kidoAtivo = kidosKaido[0] || null;

                const analiseKaido = (typeof calcularEfeitoKaido === 'function')
                  ? calcularEfeitoKaido(poderCuraFinal, simKaidoEstado, kidoAtivo)
                  : { categoria: "Tratamento Tático", cor: "#10B981", cenasNecessarias: 1, curaHpStr: "Recuperação de 80%", estadoFinal: "Inteiro", diagnostico: "Estabilizado", dicaTatica: "Manter canalização", roteiroCenas: [] };

                return (
                  <Section
                    title="🌿 Simulador Médico de Kaidō & Redução de Cenas por Infusão de Reiatsu"
                    subtitle="Imbuir mais Pressão Espiritual e recitar o encantamento acelera a regeneração celular, desintoxicação e reduz os turnos necessários no ON"
                    className="border-2 border-emerald-500/50"
                  >
                    <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-950/40 via-bleach-panel2 to-black rounded-2xl border-2 border-emerald-500/60 space-y-5 shadow-2xl">
                      
                      {/* Topo do Simulador */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                              Hospital Geral do Seireitei • Cálculo Dinâmico de Cenas
                            </span>
                            <span className="text-xs font-mono text-cyan-400 font-bold">
                              Pressão Investida: {pressaoTotalCura} pts {simKaidoIncantado ? `(+${bonusEncanto} Encanto)` : ''} = <strong className="text-emerald-300">{poderCuraFinal} Poder</strong>
                            </span>
                          </div>
                          <h4 className="font-title text-2xl text-emerald-400 mt-1 flex items-center gap-2">
                            <span>💚</span> {kidoAtivo ? kidoAtivo.nome : "Kaidō & Medicina Espiritual"}
                          </h4>
                          <p className="text-xs text-bleach-creamDim">
                            Injetar mais Reiatsu e recitar o encantamento (+30% PE) reduz drasticamente as cenas exigidas no WhatsApp para curar feridas graves e desintoxicar venenos.
                          </p>
                        </div>

                        {/* Seletor de Estado Inicial */}
                        <div className="bg-black/70 p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
                          <label className="text-[10px] text-bleach-muted uppercase font-bold block">
                            Estado Inicial do Paciente:
                          </label>
                          <div className="flex gap-1.5">
                            {[
                              { id: "Derrotado", label: "💀 Derrotado", cor: "#EF4444" },
                              { id: "Debilitado", label: "🩸 Debilitado", cor: "#F97316" },
                              { id: "Ferido", label: "🩹 Ferido", cor: "#EAB308" }
                            ].map((est) => (
                              <button
                                key={est.id}
                                type="button"
                                onClick={() => setSimKaidoEstado(est.id)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                                  simKaidoEstado === est.id
                                    ? "bg-emerald-500 text-black border-white shadow font-black"
                                    : "bg-black/60 text-bleach-creamDim border-white/10 hover:border-emerald-400"
                                }`}
                              >
                                {est.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Controles de Pressão Extra e Encantamento */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-black/60 rounded-xl border border-emerald-500/20">
                        <label className="flex items-center gap-2.5 cursor-pointer bg-black/50 p-2.5 rounded-lg border border-emerald-500/30 hover:border-emerald-400 transition">
                          <input
                            type="checkbox"
                            checked={simKaidoIncantado}
                            onChange={(e) => setSimKaidoIncantado(e.target.checked)}
                            className="accent-emerald-500 w-4 h-4"
                          />
                          <div>
                            <span className="text-xs text-emerald-300 font-bold block">
                              Recitar Cântico Sagrado de Kaidō (Eishō)
                            </span>
                            <span className="text-[10px] text-bleach-muted">
                              Concede +30% da sua Pressão Espiritual (+{bonusEncanto} pts) acelerando a cura
                            </span>
                          </div>
                        </label>

                        <div className="flex items-center justify-between bg-black/50 p-2.5 rounded-lg border border-white/5 flex-wrap gap-2">
                          <span className="text-[11px] text-bleach-creamDim font-bold">Imbuir Mais Reiatsu:</span>
                          <div className="flex gap-1">
                            {[0, 20, 50, 100, 200].map((pe) => (
                              <button
                                key={pe}
                                type="button"
                                onClick={() => setSimKaidoExtraPressao(pe)}
                                className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition border ${
                                  simKaidoExtraPressao === pe
                                    ? "bg-emerald-500 text-black border-white shadow"
                                    : "bg-black/70 text-bleach-muted border-white/10 hover:text-white"
                                }`}
                              >
                                +{pe} PE
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cartões de Métricas de Cura */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="p-4 bg-black/80 rounded-xl border border-emerald-500/40 text-center">
                          <span className="text-[10px] text-bleach-muted uppercase font-bold block">Tempo de Tratamento no ON:</span>
                          <span className="text-3xl font-mono font-black text-emerald-400 block mt-1">
                            ⏳ {analiseKaido.cenasNecessarias} {analiseKaido.cenasNecessarias === 1 ? 'Cena' : 'Cenas'}
                          </span>
                          <span className="text-[11px] text-emerald-200/70">
                            {analiseKaido.cenasNecessarias === 1 ? '✨ Cura Acelerada por Reiatsu!' : 'Duração necessária no WhatsApp'}
                          </span>
                        </div>

                        <div className="p-4 bg-black/80 rounded-xl border border-emerald-500/40 text-center">
                          <span className="text-[10px] text-bleach-muted uppercase font-bold block">Evolução do Paciente:</span>
                          <span className="text-base font-extrabold text-white block mt-1.5">
                            {analiseKaido.estadoInicial || simKaidoEstado} ➔ <span className="text-emerald-400">{analiseKaido.estadoFinal}</span>
                          </span>
                          <span className="text-xs text-yellow-300/90 font-mono font-bold">{analiseKaido.curaHpStr}</span>
                        </div>

                        <div className="p-4 bg-black/80 rounded-xl border border-emerald-500/40 text-center">
                          <span className="text-[10px] text-bleach-muted uppercase font-bold block">Classificação Médica:</span>
                          <span className="text-sm font-extrabold text-emerald-300 block mt-1.5">
                            {analiseKaido.categoria}
                          </span>
                          <span className="text-[10px] text-bleach-muted">{analiseKaido.diagnostico}</span>
                        </div>
                      </div>

                      {/* Roteiro Narrativo Passo a Passo por Cena */}
                      <div className="p-4 bg-black/80 rounded-xl border border-emerald-500/30 space-y-3">
                        <h6 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <span>📋</span> Roteiro de Narração para o WhatsApp ({analiseKaido.cenasNecessarias} {analiseKaido.cenasNecessarias === 1 ? 'Cena' : 'Cenas'}):
                        </h6>
                        <div className="space-y-2">
                          {(analiseKaido.roteiroCenas || []).map((passo, idx) => (
                            <div key={idx} className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-lg flex items-start gap-2.5">
                              <span className="px-2 py-0.5 bg-emerald-900/80 text-emerald-300 border border-emerald-500 font-mono font-bold text-[10px] rounded shrink-0">
                                {typeof passo === 'string' ? `Etapa ${idx + 1}` : `Cena ${passo.cena}`}
                              </span>
                              <div className="text-xs text-bleach-cream leading-relaxed">
                                {typeof passo === 'string' ? passo : passo.instrucao}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recomendação Tática de Narração */}
                      <div className="p-3.5 bg-bleach-panel rounded-xl border border-white/10 text-xs">
                        <strong className="text-emerald-400 block text-[10px] uppercase font-bold">🌿 Diagnóstico do 4º Esquadrão:</strong>
                        <p className="text-bleach-cream mt-0.5 leading-relaxed">{analiseKaido.dicaTatica}</p>
                      </div>
                    </div>
                  </Section>
                );
              })()}
            </div>
          )}

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
                    <option value="conhecimento">📚 Conhecimento Espiritual (₪)</option>
                    <option value="cenas">📊 Cenas de Atividade no WhatsApp (1 cena = 100 ₪)</option>
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
        <CenaDespertarModal
          tipo={showCenaModal}
          onClose={() => setShowCenaModal(null)}
          onSubmit={submeterCenaDespertar}
        />
      )}

      {/* ZANPAKUTO 4 PATHS RITUAL MODAL */}
      {showZanpakutoAIModal && (
        <Zanpakuto4PathsModal
          open={showZanpakutoAIModal}
          tipo={aiZkTipo}
          isBankai={aiZkTipo === "bankai"}
          loading={aiZkLoading}
          caminhos={aiZkOpcoes}
          personagem={personagem}
          onEscolherCaminho={escolherCaminhoEspiritual}
          onClose={() => {
            setShowZanpakutoAIModal(false);
            setAiZkLoading(false);
          }}
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
      {/* CAPACIDADES ZANPAKUTO MODAL */}
      {showCapacidadesModal && (
        <CapacidadesZanpakutoModal
          modalData={showCapacidadesModal}
          onClose={() => setShowCapacidadesModal(null)}
        />
      )}

      {/* KIDO DETAIL MODAL IN FICHA */}
      {kidoModalFicha && (
        <KidoDetailModal
          kido={kidoModalFicha}
          personagem={personagem}
          isOpen={!!kidoModalFicha}
          onClose={() => setKidoModalFicha(null)}
          pressaoRestante={Math.max(0, Number(personagem.atributos?.pressao || 10) - gastoPressaoForca - gastoPressaoResiliencia)}
          onConjurar={(kido, custoGasto, poder, incantado) => {
            playReiatsuSound('kido');
            updateChar({}, `⚡ Conjurou ${kido.nome} em cena (Gasto: ${custoGasto} pts de Reiatsu | Poder: ${poder} pts${incantado ? ' [Eishō]' : ''})`);
            alert(`✨ ${kido.nome} conjurado na cena com sucesso!\n\n⚡ Poder de Feitiço: ${poder} pts\n🌀 Custo de Reiatsu: ${custoGasto} pts`);
          }}
        />
      )}

      {/* KIDO SKILL TREE MODAL */}
      {showKidoTreeModal && (
        <KidoSkillTreeModal
          isOpen={showKidoTreeModal}
          onClose={() => setShowKidoTreeModal(false)}
          personagem={personagem}
          onAbrirLoja={() => {
            setShowKidoTreeModal(false);
            setShowKidoShopModal(true);
          }}
        />
      )}

      {/* KIDO SHOP MODAL */}
      {showKidoShopModal && (
        <KidoShopModal
          isOpen={showKidoShopModal}
          onClose={() => setShowKidoShopModal(false)}
          personagem={personagem}
          updateChar={updateChar}
        />
      )}
    </div>
  );
}
