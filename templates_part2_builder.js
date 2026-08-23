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
