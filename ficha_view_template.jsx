// TAB: FICHA DO JOGADOR
function FichaView({ db, saveDb, personagem, isAdmin, rankFisico, rankPressao }) {
  const [subPaginaFicha, setSubPaginaFicha] = useState("perfil");
  
  const [pend, setPend] = useState({ pressao: 0, forca: 0, velocidade: 0, resiliencia: 0 });
  const [passoDistribuicao, setPassoDistribuicao] = useState(1);
  const [novaTecCat, setNovaTecCat] = useState("Hadō");
  const [novaTecNome, setNovaTecNome] = useState("");
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

  const [zk, setZk] = useState(personagem?.zanpakuto || { nome: "", shikaiAtiva: null, bankaiAtiva: null, notas: "" });
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

  if (!personagem) return <div className="text-bleach-muted">Ficha não encontrada.</div>;

  const pendSum = Object.values(pend).reduce((a, b) => a + b, 0);
  const restante = (personagem.pontosDisponiveis || 0) - pendSum;
  const totalStats = Object.values(personagem.atributos).reduce((a, b) => a + b, 0);
  const powerTier = getPowerTier(totalStats);

  const posFisicoIdx = rankFisico.findIndex(r => r.id === personagem.id);
  const posFisico = posFisicoIdx !== -1 ? posFisicoIdx + 1 : 1;
  const scoreFisico = ((Number(personagem.atributos.forca) + Number(personagem.atributos.velocidade) + Number(personagem.atributos.resiliencia)) / 3).toFixed(1);
  const topFisicoScore = rankFisico[0]?.score || scoreFisico;
  const pctBarFisico = Math.min(100, Math.round((scoreFisico / Math.max(1, topFisicoScore)) * 100));

  const posPressaoIdx = rankPressao.findIndex(r => r.id === personagem.id);
  const posPressao = posPressaoIdx !== -1 ? posPressaoIdx + 1 : 1;
  const scorePressao = Number(personagem.atributos.pressao);
  const topPressaoScore = rankPressao[0]?.score || scorePressao;
  const pctBarPressao = Math.min(100, Math.round((scorePressao / Math.max(1, topPressaoScore)) * 100));

  const temShikai = !!personagem?.zanpakuto?.shikaiAtiva;
  const temBankai = !!personagem?.zanpakuto?.bankaiAtiva;
  const podeGerarShikai = !!personagem?.permissoes?.shikaiLiberada;
  const podeGerarBankai = !!personagem?.permissoes?.bankaiLiberada && temShikai;

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
      resiliencia: personagem.atributos.resiliencia + pend.resiliencia,
    };
    const novoDisponivel = (personagem.pontosDisponiveis || 0) - pendSum;
    const historicoTexto = `✨ Distribuiu ${pendSum} pontos de treino: Pressão (+${pend.pressao}), Força (+${pend.forca}), Velocidade (+${pend.velocidade}), Resiliência (+${pend.resiliencia})`;
    updateChar(
      {
        atributos: novosAtributos,
        pontosDisponiveis: novoDisponivel,
      },
      historicoTexto
    );
    setPend({ pressao: 0, forca: 0, velocidade: 0, resiliencia: 0 });
    playReiatsuSound('win');
  }

  function addTecnica() {
    if (!novaTecNome.trim()) return;
    const novas = [...(personagem.tecnicas || []), { id: uid(), nome: novaTecNome.trim(), categoria: novaTecCat }];
    updateChar({ tecnicas: novas }, `Aprendeu a técnica [${novaTecCat}] ${novaTecNome.trim()}`);
    setNovaTecNome("");
  }

  function removeTecnica(id) {
    const novas = (personagem.tecnicas || []).filter((t) => t.id !== id);
    updateChar({ tecnicas: novas }, "Removeu uma técnica da ficha");
  }

  function togglePermissaoShikai() {
    const atual = !!personagem?.permissoes?.shikaiLiberada;
    updateChar({ permissoes: { ...(personagem.permissoes || {}), shikaiLiberada: !atual } }, `Permissão de Despertar de Shikai ${!atual ? "LIBERADA" : "BLOQUEADA"} pela ADM`);
  }

  function togglePermissaoBankai() {
    const atual = !!personagem?.permissoes?.bankaiLiberada;
    updateChar({ permissoes: { ...(personagem.permissoes || {}), bankaiLiberada: !atual } }, `Permissão de Despertar de Bankai ${!atual ? "LIBERADA" : "BLOQUEADA"} pela ADM`);
  }

  function concederRecompensa() {
    const pontos = Number(rec.pontos) || 0;
    if (pontos <= 0 && rec.tipo !== "Sorteio Gacha Comum" && rec.tipo !== "Sorteio Especial") return;
    let patch = {};
    let texto = `[${rec.tipo}]`;
    if (rec.atributo) {
      patch.atributos = {
        ...personagem.atributos,
        [rec.atributo]: (personagem.atributos[rec.atributo] || 0) + pontos,
      };
      texto += ` +${pontos} em ${rec.atributo.toUpperCase()}`;
    } else {
      patch.pontosDisponiveis = (personagem.pontosDisponiveis || 0) + pontos;
      texto += ` +${pontos} pontos livres concedidos para distribuição`;
    }
    if (rec.motivo.trim()) texto += ` — ${rec.motivo.trim()}`;
    updateChar(patch, texto);
    setRec({ tipo: "Treino em ON (30 linhas)", pontos: 1, atributo: "", motivo: "" });
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
    updateChar(
      {
        pontosDisponiveis: (personagem.pontosDisponiveis || 0) + pontos,
        sorteiosComunsRestantes: personagem.sorteiosComunsRestantes - 1,
        sorteiosDrops: [drop, ...(personagem.sorteiosDrops || [])]
      },
      `🎲 Sorteio Comum (${escolhida.nome}): +${pontos} pontos disponíveis concedidos automaticamente`
    );
    setRewardModal({ titulo: "SORTEIO GACHA COMUM!", raridade: escolhida.nome, cor: escolhida.cor, pontos, desc: escolhida.desc });
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
      roll -= (r.peso || 1);
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
    
    updateChar(
      patch,
      `🌟 Sorteio Especial: Conquistou [${escolhida.nome}] (${escolhida.raridade})!`
    );
    
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
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      if (tipo === "perfil") {
        setEditFoto(dataUrl);
        updateChar({ foto: dataUrl }, "Foto de perfil do personagem atualizada");
      } else if (tipo === "shikai") {
        setEditFotoShikai(dataUrl);
        const novoZk = { ...zk, fotoShikai: dataUrl, shikaiAtiva: zk.shikaiAtiva ? { ...zk.shikaiAtiva, foto: dataUrl } : null };
        setZk(novoZk);
        updateChar({ zanpakuto: novoZk }, "Imagem da arma Shikai atualizada");
      } else if (tipo === "bankai") {
        setEditFotoBankai(dataUrl);
        const novoZk = { ...zk, fotoBankai: dataUrl, bankaiAtiva: zk.bankaiAtiva ? { ...zk.bankaiAtiva, foto: dataUrl } : null };
        setZk(novoZk);
        updateChar({ zanpakuto: novoZk }, "Imagem monumental da Bankai atualizada");
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

    const opcoes = tipo === "bankai" 
      ? gerar4OpcoesBankaiAI(db.personagens, personagem)
      : gerar4OpcoesShikaiAI(db.personagens);

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
        shikaiAtiva: opcaoEscolhida,
      };
      setZk(novoZk);
      updateChar(
        {
          zanpakuto: novoZk,
          permissoes: { ...(personagem.permissoes || {}), shikaiLiberada: false }
        },
        `🗡️ DESPERTOU SHIKAI AUTORAL: [${opcaoEscolhida.nome}] — "${opcaoEscolhida.comando}"`
      );
      setSubPaginaFicha("shikai");
      setShowZanpakutoAIModal(false);
      alert(`✨ Parabéns! Sua Shikai [${opcaoEscolhida.nome}] foi selada com exclusividade na sua ficha!`);
    } else {
      const novoZk = {
        ...(personagem.zanpakuto || {}),
        bankaiAtiva: opcaoEscolhida,
      };
      setZk(novoZk);
      updateChar(
        {
          zanpakuto: novoZk,
          permissoes: { ...(personagem.permissoes || {}), bankaiLiberada: false }
        },
        `卍 DESPERTOU BANKAI SUPREMA: [${opcaoEscolhida.nome}] — "${opcaoEscolhida.comando}"`
      );
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

  return (
    <div className="space-y-6">
      
      {/* NAVEGAÇÃO DE SUB-PÁGINAS */}
      <div className="flex gap-2 border-b border-bleach-border pb-3 overflow-x-auto">
        <button
          onClick={() => setSubPaginaFicha("perfil")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 ${
            subPaginaFicha === "perfil"
              ? "bg-bleach-orange text-black font-extrabold shadow-lg"
              : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"
          }`}
        >
          <span>👤</span>
          <span>Ficha Geral</span>
        </button>

        <button
          onClick={() => setSubPaginaFicha("shikai")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 relative ${
            subPaginaFicha === "shikai"
              ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold shadow-lg"
              : temShikai || podeGerarShikai
              ? "bg-bleach-panel border border-blue-500/50 text-blue-300 hover:text-white shadow"
              : "bg-bleach-panel border border-bleach-border text-bleach-muted opacity-70"
          }`}
        >
          <span>🗡️</span>
          <span>{temShikai ? `Shikai: ${personagem.zanpakuto?.shikaiAtiva?.nome || personagem.zanpakuto?.nome}` : "Shikai (Despertar)"}</span>
          {podeGerarShikai && !temShikai && (
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-1 right-1"></span>
          )}
        </button>

        <button
          onClick={() => setSubPaginaFicha("bankai")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 relative ${
            subPaginaFicha === "bankai"
              ? "bg-gradient-to-r from-purple-600 via-amber-500 to-orange-500 text-white font-extrabold shadow-[0_0_20px_#FFD700]"
              : temBankai || podeGerarBankai
              ? "bg-purple-950/60 border-2 border-purple-500 text-yellow-400 font-bold hover:brightness-125"
              : "bg-bleach-panel border border-bleach-border text-bleach-muted opacity-60"
          }`}
        >
          <span>卍</span>
          <span>{temBankai ? `Bankai: ${personagem.zanpakuto?.bankaiAtiva?.nome}` : "Bankai Suprema"}</span>
          {podeGerarBankai && !temBankai && (
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping absolute top-1 right-1"></span>
          )}
        </button>
      </div>

      {/* SUB-PÁGINA 1: FICHA GERAL */}
      {subPaginaFicha === "perfil" && (
        <div className="space-y-6">
          <div className="bg-bleach-panel border border-bleach-border rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              
              <div className="flex flex-col items-center">
                <div className="w-36 h-36 bleach-avatar-frame overflow-hidden bg-black relative group">
                  <img 
                    src={editFoto} 
                    alt={personagem.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'assets/ichigo-orange.png'; }}
                  />
                  <label className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition text-[11px] text-bleach-orange font-bold text-center p-2">
                    📷 Alterar Foto
                    <input type="file" accept="image/*" onChange={(e) => handleFotoUpload(e, "perfil")} className="hidden" />
                  </label>
                </div>

                <label className="mt-2.5 px-3 py-1 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-[11px] text-bleach-creamDim rounded-lg cursor-pointer transition">
                  Subir Imagem
                  <input type="file" accept="image/*" onChange={(e) => handleFotoUpload(e, "perfil")} className="hidden" />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h2 className="font-title text-3xl sm:text-4xl tracking-widest text-bleach-orange">
                    {personagem.nome}
                  </h2>
                  <Badge color={ESTADOS.find((e) => e.key === personagem.estado)?.color || C.green}>
                    {personagem.estado}
                  </Badge>
                  <Badge color={powerTier.color}>
                    {powerTier.title}
                  </Badge>
                </div>

                <div className="text-xs text-bleach-creamDim flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
                  <span>Esquadrão: <strong className="text-bleach-cream">{personagem.esquadrao || "11º Esquadrão"}</strong></span>
                  <span>Raça: <strong className="text-bleach-cream">{personagem.raca}</strong></span>
                  <span>WhatsApp: <strong className="text-bleach-cream">{maskWhats(personagem.whatsapp)}</strong></span>
                  <span>Faceclaim: <strong className="text-bleach-cream">{personagem.faceclaim || "Não definido"}</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="bg-black/60 border border-bleach-border p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-bleach-creamDim">⚔️ Ranking Físico</span>
                      <span className="font-mono text-bleach-orange font-bold">#{posFisico}º Lugar</span>
                    </div>
                    <div className="w-full bg-bleach-panel2 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-600 to-amber-400 h-full rounded-full" style={{ width: `${pctBarFisico}%` }}></div>
                    </div>
                    <div className="text-[10px] text-bleach-muted mt-1 text-right font-mono">Média: {scoreFisico} pts</div>
                  </div>

                  <div className="bg-black/60 border border-bleach-border p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-bleach-creamDim">⚡ Pressão Espiritual</span>
                      <span className="font-mono text-cyan-400 font-bold">#{posPressao}º Lugar</span>
                    </div>
                    <div className="w-full bg-bleach-panel2 h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full" style={{ width: `${pctBarPressao}%` }}></div>
                    </div>
                    <div className="text-[10px] text-bleach-muted mt-1 text-right font-mono">Reiatsu: {scorePressao} pts</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                  <button
                    onClick={copiarFichaWhatsApp}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow hover:brightness-110 transition flex items-center gap-1.5"
                  >
                    <span>📱</span>
                    <span>{copiadoWhats ? "✓ Copiado com Sucesso!" : "Copiar Ficha WhatsApp"}</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* ADMIN ACTION PANEL */}
          {isAdmin && (
            <Section title="Painel de Concessão de Recompensas (ADM)" subtitle="Atribua treinos em ON, rolagens ou pontos livres">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Tipo</label>
                  <select 
                    value={rec.tipo} 
                    onChange={(e) => setRec({ ...rec, tipo: e.target.value })}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {TIPOS_RECOMPENSA.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Pontos Livres</label>
                  <input 
                    type="number" 
                    value={rec.pontos} 
                    onChange={(e) => setRec({ ...rec, pontos: e.target.value })}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Destino Direto (Opcional)</label>
                  <select 
                    value={rec.atributo} 
                    onChange={(e) => setRec({ ...rec, atributo: e.target.value })}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="">Pontos Livres (Ficha)</option>
                    <option value="pressao">Pressão Espiritual</option>
                    <option value="forca">Força</option>
                    <option value="velocidade">Velocidade</option>
                    <option value="resiliencia">Resiliência</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Motivo / Link</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Treino de 30 linhas aprovado"
                    value={rec.motivo} 
                    onChange={(e) => setRec({ ...rec, motivo: e.target.value })}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button 
                  onClick={concederRecompensa}
                  className="px-5 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400 transition"
                >
                  + Conceder Recompensa
                </button>

                <button
                  onClick={togglePermissaoShikai}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${
                    personagem?.permissoes?.shikaiLiberada
                      ? "bg-red-950 border-red-500 text-red-300"
                      : "bg-blue-950 border-cyan-400 text-cyan-300"
                  }`}
                >
                  {personagem?.permissoes?.shikaiLiberada ? "🔒 Revogar Permissão de Shikai" : "🔓 Liberar Despertar de Shikai"}
                </button>

                <button
                  onClick={togglePermissaoBankai}
                  className={`px-4 py-2 text-xs font-bold uppercase rounded-lg border transition ${
                    personagem?.permissoes?.bankaiLiberada
                      ? "bg-red-950 border-red-500 text-red-300"
                      : "bg-amber-950 border-amber-400 text-yellow-300"
                  }`}
                >
                  {personagem?.permissoes?.bankaiLiberada ? "🔒 Revogar Permissão de Bankai" : "🔓 Liberar Despertar de Bankai"}
                </button>
              </div>
            </Section>
          )}

          {/* GACHA E SORTEIOS */}
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
                  <p className="text-xs text-bleach-creamDim mb-3">
                    Sorteia recursos e pontos de atributo com foco em ganhos graduais e balanceados.
                  </p>
                  
                  {/* Probabilidades */}
                  <div className="mb-4 p-2.5 bg-black/60 border border-white/10 rounded-lg text-[10px] space-y-1 font-mono text-bleach-muted">
                    <div className="flex justify-between text-bleach-creamDim">
                      <span>• Comum (+1 a +2 pts):</span>
                      <strong className="text-bleach-cream">65.0%</strong>
                    </div>
                    <div className="flex justify-between text-emerald-400">
                      <span>• Incomum (+3 a +4 pts):</span>
                      <strong>22.0%</strong>
                    </div>
                    <div className="flex justify-between text-cyan-400">
                      <span>• Raro (+5 a +7 pts):</span>
                      <strong>9.0%</strong>
                    </div>
                    <div className="flex justify-between text-purple-400">
                      <span>• Épico (+8 a +11 pts):</span>
                      <strong>3.5%</strong>
                    </div>
                    <div className="flex justify-between text-yellow-400">
                      <span>• Lendário (+14 a +18 pts):</span>
                      <strong>0.5% (1 em 200)</strong>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={girarGachaComum}
                  disabled={(personagem.sorteiosComunsRestantes || 0) <= 0}
                  className="w-full py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
                >
                  {(personagem.sorteiosComunsRestantes || 0) > 0 ? "✨ Realizar Sorteio Comum" : "Sem Giros Comuns (Aguarde ADM)"}
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
                  <p className="text-xs text-bleach-creamDim mb-3">
                    Prêmios de alto prestígio. A cobiçada <strong>Missão Narrativa Individual</strong> é um prêmio supremo ultrarraro (1 em 100)!
                  </p>
                  
                  {/* Probabilidades */}
                  <div className="mb-4 p-2.5 bg-black/60 border border-purple-500/20 rounded-lg text-[10px] space-y-1 font-mono text-bleach-muted">
                    <div className="flex justify-between text-emerald-300">
                      <span>• Prêmios Simples (+4 a +7 pts):</span>
                      <strong>60.0%</strong>
                    </div>
                    <div className="flex justify-between text-cyan-300">
                      <span>• Intermediários (+8 a +12 pts):</span>
                      <strong>24.0%</strong>
                    </div>
                    <div className="flex justify-between text-purple-300">
                      <span>• Raros Nobres (+15 a +16 pts):</span>
                      <strong>11.0%</strong>
                    </div>
                    <div className="flex justify-between text-amber-300">
                      <span>• Lendários (+20 a +24 pts):</span>
                      <strong>4.0%</strong>
                    </div>
                    <div className="flex justify-between text-white font-bold bg-purple-950/60 px-1 py-0.5 rounded border border-purple-400/40">
                      <span className="text-yellow-300">👑 Missão Narrativa:</span>
                      <strong className="text-white">1.0% (1 em 100)</strong>
                    </div>
                  </div>
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

            {(personagem.sorteiosDrops || []).length > 0 && (
              <div className="mt-4 pt-3 border-t border-bleach-borderSoft">
                <button
                  onClick={() => setShowGachaHistory(!showGachaHistory)}
                  className="text-xs text-bleach-orange font-bold uppercase hover:underline"
                >
                  {showGachaHistory ? "▼ Ocultar Histórico de Drops" : "▶ Ver Histórico de Drops Anteriores"}
                </button>
                {showGachaHistory && (
                  <div className="space-y-2 mt-3">
                    {personagem.sorteiosDrops.map((d) => (
                      <div key={d.id} className="p-2.5 bg-black/50 border border-bleach-borderSoft rounded-lg text-xs flex justify-between items-center">
                        <span style={{ color: d.cor || C.cream }} className="font-semibold">{d.nome}</span>
                        <span className="text-[10px] text-bleach-muted font-mono">{d.data}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* UNALLOCATED POINTS BANNER WITH 1, 5, 10 STEP SELECTOR */}
          {(personagem.pontosDisponiveis || 0) > 0 && (
            <div className="bg-gradient-to-r from-orange-950/60 via-bleach-panel to-orange-950/40 border-2 border-bleach-orange/60 rounded-xl p-5 shadow-2xl reiatsu-glow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-bleach-borderSoft">
                <div>
                  <h4 className="font-title text-2xl tracking-wider text-bleach-orange flex items-center gap-2">
                    <span>✨</span> PONTOS DISPONÍVEIS PARA DISTRIBUIR
                  </h4>
                  <p className="text-xs text-bleach-creamDim">
                    Você possui <strong className="text-bleach-orange">{personagem.pontosDisponiveis}</strong> pontos livres concedidos pelo mestre/sorteios.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-bleach-creamDim">
                    Distribuir por vez:
                  </span>
                  <div className="flex bg-black/80 border border-bleach-border rounded-xl p-1 gap-1 shadow-inner">
                    {[1, 5, 10].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => setPassoDistribuicao(step)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-black transition ${
                          passoDistribuicao === step
                            ? "bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black shadow-[0_0_10px_#FF6A13]"
                            : "bg-transparent text-bleach-creamDim hover:text-white hover:bg-white/5"
                        }`}
                      >
                        ±{step} {step === 1 ? "pt" : "pts"}
                      </button>
                    ))}
                  </div>

                  <div className="ml-auto md:ml-2 bg-black/60 border border-white/10 px-3 py-1.5 rounded-xl text-right">
                    <span className="text-[11px] text-bleach-creamDim">Restam: </span>
                    <span className="font-bold text-lg text-bleach-orange font-mono">{restante}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {ATTRS.map((a) => {
                  const decStep = Math.min(passoDistribuicao, pend[a.key]);
                  const incStep = Math.min(passoDistribuicao, restante);
                  return (
                    <div key={a.key} className="bg-black/50 border border-bleach-border rounded-xl p-3 flex flex-col justify-between gap-2.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: a.color }}>
                            {a.label}
                          </span>
                          <span className="text-[11px] text-bleach-muted">
                            Atual: <strong className="text-white">{personagem.atributos[a.key]}</strong>
                            {pend[a.key] > 0 && (
                              <span className="text-bleach-orange font-mono ml-1 font-bold">
                                → {personagem.atributos[a.key] + pend[a.key]}
                              </span>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-black/80 p-1 rounded-xl border border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              const amt = Math.min(passoDistribuicao, pend[a.key]);
                              if (amt > 0) setPend((p) => ({ ...p, [a.key]: p[a.key] - amt }));
                            }}
                            disabled={pend[a.key] === 0}
                            title={`Diminuir ${decStep || passoDistribuicao} ponto(s)`}
                            className="px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 disabled:cursor-not-allowed hover:border-bleach-orange hover:bg-bleach-panel2 transition"
                          >
                            −{passoDistribuicao > 1 ? passoDistribuicao : ""}
                          </button>

                          <span className="min-w-[42px] text-center font-mono font-black text-bleach-orange text-base">
                            +{pend[a.key]}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              const amt = Math.min(passoDistribuicao, restante);
                              if (amt > 0) setPend((p) => ({ ...p, [a.key]: p[a.key] + amt }));
                            }}
                            disabled={restante <= 0}
                            title={`Adicionar ${incStep || passoDistribuicao} ponto(s)`}
                            className="px-2.5 h-8 rounded-lg bg-bleach-panel border border-bleach-border text-white text-xs font-bold font-mono disabled:opacity-20 disabled:cursor-not-allowed hover:border-bleach-orange hover:bg-bleach-panel2 transition"
                          >
                            +{passoDistribuicao > 1 ? passoDistribuicao : ""}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                        <span className="text-bleach-muted">Adição direta:</span>
                        <div className="flex items-center gap-1">
                          {[1, 5, 10].map((quick) => (
                            <button
                              key={quick}
                              type="button"
                              onClick={() => {
                                const amt = Math.min(quick, restante);
                                if (amt > 0) setPend((p) => ({ ...p, [a.key]: p[a.key] + amt }));
                              }}
                              disabled={restante <= 0}
                              className="px-2 py-0.5 rounded bg-bleach-panel2 border border-white/10 hover:border-bleach-orange text-bleach-creamDim hover:text-white font-mono font-bold disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                              +{quick}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                {pendSum > 0 ? (
                  <button
                    type="button"
                    onClick={() => setPend({ pressao: 0, forca: 0, velocidade: 0, resiliencia: 0 })}
                    className="text-xs text-bleach-muted hover:text-red-400 underline transition"
                  >
                    🔄 Zerar Distribuição Pendente
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  type="button"
                  onClick={confirmarDistribuicao}
                  disabled={pendSum === 0}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-lg shadow-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Confirmar Distribuição ({pendSum} pts)
                </button>
              </div>
            </div>
          )}

          {/* ATTR CARDS */}
          <Section 
            title="Atributos Espirituais" 
            subtitle="O valor puro do seu poder (sem conversores ou taxas ocultas)"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ATTRS.map((a) => (
                <div key={a.key} className="bg-bleach-panel2 border border-bleach-borderSoft rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: a.color }}>
                        {a.label}
                      </h4>
                      <p className="text-[11px] text-bleach-muted">{a.desc}</p>
                    </div>
                    <span className="text-3xl font-extrabold font-mono" style={{ color: a.color }}>
                      {personagem.atributos[a.key]}
                    </span>
                  </div>

                  <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min(100, (personagem.atributos[a.key] / 200) * 100)}%`,
                        backgroundColor: a.color 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* KIDŌ E TÉCNICAS */}
          <Section title="Kidō e Técnicas Aprendidas" subtitle="Feitiços dominados pelo Shinigami">
            {(personagem.tecnicas || []).length === 0 ? (
              <p className="text-xs text-bleach-muted">Nenhuma técnica registrada até o momento.</p>
            ) : (
              <div className="flex flex-wrap gap-2.5 mb-4">
                {personagem.tecnicas.map((t) => (
                  <div 
                    key={t.id}
                    className="bg-bleach-panel2 border border-bleach-border px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs"
                  >
                    <span className="px-2 py-0.5 rounded bg-black text-[10px] font-bold text-bleach-orange uppercase">
                      {t.categoria}
                    </span>
                    <span className="font-semibold text-bleach-cream">{t.nome}</span>
                    {isAdmin && (
                      <button 
                        onClick={() => removeTecnica(t.id)} 
                        className="text-red-400 hover:text-red-300 font-bold ml-1"
                        title="Remover técnica"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-bleach-borderSoft flex flex-wrap gap-2">
                <select 
                  value={novaTecCat} 
                  onChange={(e) => setNovaTecCat(e.target.value)}
                  className="bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                >
                  {CATEGORIAS_TECNICA.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Nome da técnica (Ex: Hadō #31 — Shakkahō)" 
                  value={novaTecNome} 
                  onChange={(e) => setNovaTecNome(e.target.value)}
                  className="flex-1 min-w-[180px] bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                />
                <button 
                  onClick={addTecnica}
                  className="px-4 py-2 bg-bleach-panel border border-bleach-border text-bleach-cream hover:border-bleach-orange rounded-lg text-xs font-bold uppercase"
                >
                  + Adicionar
                </button>
              </div>
            )}
          </Section>

          {/* HISTÓRICO */}
          <Section title="Histórico de Registros" subtitle="Linha do tempo de treinos, missões e recompensas">
            {(personagem.historico || []).length === 0 ? (
              <p className="text-xs text-bleach-muted">Nenhum registro ainda.</p>
            ) : (
              <div className="space-y-3">
                {personagem.historico.slice(0, 20).map((h) => (
                  <div key={h.id} className="border-l-2 border-bleach-orange pl-3 py-1">
                    <div className="text-[10px] text-bleach-muted font-mono">{h.data}</div>
                    <div className="text-xs text-bleach-creamDim mt-0.5">{h.texto}</div>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* DADOS CADASTRAIS */}
          <Section title="Dados Cadastrais & Perfil" subtitle="Edição das informações do Shinigami">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Nome</label>
                <input 
                  type="text" 
                  value={editNome} 
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">WhatsApp</label>
                <input 
                  type="text" 
                  value={editWhats} 
                  onChange={(e) => setEditWhats(e.target.value)}
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Código de Acesso</label>
                <input 
                  type="text" 
                  value={editCodigo} 
                  onChange={(e) => setEditCodigo(e.target.value)}
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Faceclaim</label>
                <input 
                  type="text" 
                  value={editFaceclaim} 
                  onChange={(e) => setEditFaceclaim(e.target.value)}
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Esquadrão</label>
                <input 
                  type="text" 
                  value={editEsquadrao} 
                  onChange={(e) => setEditEsquadrao(e.target.value)}
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-bleach-muted uppercase font-bold block mb-1">Raça</label>
                <input 
                  type="text" 
                  value={editRaca} 
                  onChange={(e) => setEditRaca(e.target.value)}
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <button 
                onClick={salvarDadosCompletos}
                className="w-full sm:w-auto px-6 py-2.5 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream hover:border-bleach-orange rounded-xl font-bold uppercase transition"
              >
                💾 Salvar Dados Cadastrais
              </button>
            </div>
          </Section>
        </div>
      )}

      {/* SUB-PÁGINA 2: SHIKAI DESPERTA */}
      {subPaginaFicha === "shikai" && (
        <div className="space-y-6">
          {temShikai ? (
            <div className="bg-bleach-panel border-2 border-blue-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="shikai-smoke-overlay"></div>

              <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-500/30 pb-4">
                  <div>
                    <span className="px-3 py-1 bg-blue-950 border border-blue-400 text-cyan-300 text-xs font-bold rounded-full uppercase tracking-wider">
                      🗡️ Despertar de Primeira Fase • Shikai Única e Individual
                    </span>
                    <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-cyan-400 mt-2 drop-shadow-[0_0_15px_rgba(79,179,232,0.6)]">
                      {personagem?.zanpakuto?.shikaiAtiva?.nome || personagem?.zanpakuto?.nome || "Shikai Desconhecida"}
                    </h2>
                    <div className="text-xs font-mono text-cyan-200 mt-1 italic">
                      Comando de Liberação: "{personagem?.zanpakuto?.shikaiAtiva?.comando || 'Liberte-se'}"
                    </div>
                  </div>

                  <Badge color={C.blue} className="text-xs py-1.5 px-3">
                    Elemento: {personagem?.zanpakuto?.shikaiAtiva?.elemento || 'Espiritual'}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-1 flex flex-col items-center">
                    <BleachSwordArt 
                      arma={personagem?.zanpakuto?.shikaiAtiva}
                      nomeZk={personagem?.zanpakuto?.shikaiAtiva?.nome || personagem?.zanpakuto?.nome}
                      isBankai={false}
                      foto={editFotoShikai || personagem?.zanpakuto?.fotoShikai}
                      onUpload={(e) => handleFotoUpload(e, "shikai")}
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    {personagem?.zanpakuto?.shikaiAtiva?.espirito && (
                      <div className="bg-black/70 border-2 border-purple-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(139,111,214,0.3)]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-purple-300 mb-1 flex items-center gap-2">
                          <span>👤</span> Ressonância do Espírito & Mundo Interior
                        </h4>
                        <p className="text-xs sm:text-sm text-purple-100/90 italic leading-relaxed whitespace-pre-line">
                          "{personagem.zanpakuto.shikaiAtiva.espirito}"
                        </p>
                      </div>
                    )}
                    
                    <div className="bg-black/60 border border-blue-500/40 rounded-xl p-5 shadow-inner">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2">
                        <span>⚔️</span> Formato & Transformação da Lâmina Shikai
                      </h4>
                      <p className="text-xs sm:text-sm text-bleach-cream leading-relaxed whitespace-pre-line">
                        {personagem?.zanpakuto?.shikaiAtiva?.formatoArma || "Lâmina espiritual em sua primeira forma de libertação."}
                      </p>
                    </div>

                    <div className="bg-black/60 border border-blue-500/40 rounded-xl p-5 shadow-inner">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2">
                        <span>⚡</span> Poder & Habilidades Especiais em Combate
                      </h4>
                      <p className="text-xs sm:text-sm text-bleach-cream leading-relaxed whitespace-pre-line">
                        {personagem?.zanpakuto?.shikaiAtiva?.poder || "Poder único e autoral despertado na arma."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : podeGerarShikai ? (
            <div className="bg-bleach-panel border-2 border-cyan-400 rounded-2xl p-8 text-center space-y-4 shadow-2xl relative overflow-hidden">
              <div className="shikai-smoke-overlay"></div>
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <span className="text-4xl">✨</span>
                <h3 className="font-title text-4xl text-cyan-400 tracking-widest">
                  DESPERTAR DE SHIKAI AUTORIZADO!
                </h3>
                <p className="text-xs sm:text-sm text-bleach-creamDim leading-relaxed">
                  A Administração aprovou o seu treinamento narrativo! Você agora pode manifestar a voz da sua Zanpakutō e gerar <strong>4 opções de Shikai 100% autorais e individuais</strong>. Ao escolher uma delas, ela será exclusivamente sua no RPG!
                </p>
                <button
                  onClick={() => abrirGeradorZanpakutoAI("shikai")}
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 transition"
                >
                  🤖 Gerar 4 Opções de Shikai Individuais
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-bleach-panel border border-bleach-border rounded-2xl p-12 text-center space-y-3">
              <span className="text-4xl opacity-50">🔒</span>
              <h3 className="font-title text-3xl text-bleach-muted tracking-wider">
                SHIKAI AINDA NÃO DESPERTA
              </h3>
              <p className="text-xs text-bleach-muted max-w-md mx-auto leading-relaxed">
                O despertar de Shikai exige treinamento em ON (30 linhas) e autorização da Administração. Assim que a ADM liberar na sua ficha, você poderá gerar e escolher sua forma Shikai autoral e individual!
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB-PÁGINA 3: BANKAI SUPREMA */}
      {subPaginaFicha === "bankai" && (
        <div className="space-y-6">
          {temBankai ? (
            <div className="bankai-supreme-card border-2 border-amber-500 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/40 pb-5">
                  <div>
                    <span className="px-3.5 py-1 bg-gradient-to-r from-purple-900 to-amber-900 border border-amber-400 text-yellow-300 text-xs font-black rounded-full uppercase tracking-widest shadow">
                      卍 LIBERAÇÃO COMPLETA • BANKAI SUPREMA INDIVIDUAL
                    </span>
                    <h2 className="font-title text-4xl sm:text-6xl tracking-widest text-amber-300 mt-2 drop-shadow-[0_0_25px_#FFD700]">
                      {personagem?.zanpakuto?.bankaiAtiva?.nome || "Bankai Suprema"}
                    </h2>
                    <div className="text-xs sm:text-sm font-mono text-yellow-200 mt-1 italic">
                      Comando Supremo: "{personagem?.zanpakuto?.bankaiAtiva?.comando || 'Bankai!'}"
                    </div>
                  </div>

                  <Badge color={C.yellow} className="text-xs py-2 px-4 shadow-[0_0_15px_#FFD700]">
                    Poder Transcendente
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  <div className="lg:col-span-1 flex flex-col items-center">
                    <BleachSwordArt 
                      arma={personagem?.zanpakuto?.bankaiAtiva}
                      nomeZk={personagem?.zanpakuto?.bankaiAtiva?.nome}
                      isBankai={true}
                      foto={editFotoBankai || personagem?.zanpakuto?.fotoBankai}
                      onUpload={(e) => handleFotoUpload(e, "bankai")}
                    />
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    {(personagem?.zanpakuto?.bankaiAtiva?.espirito || personagem?.zanpakuto?.shikaiAtiva?.espirito) && (
                      <div className="bg-black/80 border-2 border-amber-500/60 rounded-2xl p-5 shadow-[0_0_25px_rgba(255,215,0,0.3)]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-yellow-300 mb-1 flex items-center gap-2">
                          <span>👤</span> Ressonância do Espírito & Mundo Interior Transcendental
                        </h4>
                        <p className="text-xs sm:text-sm text-yellow-100/90 italic leading-relaxed whitespace-pre-line">
                          "{personagem?.zanpakuto?.bankaiAtiva?.espirito || personagem?.zanpakuto?.shikaiAtiva?.espirito}"
                        </p>
                      </div>
                    )}

                    <div className="bg-black/70 border border-amber-500/40 rounded-2xl p-5 shadow-inner">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-2">
                        <span>👑</span> Manifestação Colossal & Domínio da Bankai
                      </h4>
                      <p className="text-xs sm:text-sm text-yellow-100/90 leading-relaxed whitespace-pre-line">
                        {personagem?.zanpakuto?.bankaiAtiva?.formatoArma || "Manifestação monumental do poder da Bankai."}
                      </p>
                    </div>

                    <div className="bg-black/70 border border-amber-500/40 rounded-2xl p-5 shadow-inner">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1 flex items-center gap-2">
                        <span>⚡</span> Poder Supremo & Mecânica de Evolução
                      </h4>
                      <p className="text-xs sm:text-sm text-yellow-100/90 leading-relaxed whitespace-pre-line">
                        {personagem?.zanpakuto?.bankaiAtiva?.poder || "Poder absoluto e transcendental da Bankai."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : podeGerarBankai ? (
            <div className="bankai-supreme-card border-2 border-amber-500 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-xl mx-auto space-y-4">
                <span className="text-5xl">卍</span>
                <h3 className="font-title text-4xl sm:text-5xl text-amber-300 tracking-widest drop-shadow-[0_0_20px_#FFD700]">
                  DESPERTAR DE BANKAI AUTORIZADO!
                </h3>
                <p className="text-xs sm:text-sm text-yellow-100/80 leading-relaxed">
                  Você superou todos os limites e atingiu a ressonância suprema com sua Zanpakutō! Ao gerar as opções, a <strong>Opção 1 será a evolução canônica e perfeita da sua Shikai atual</strong>, acompanhada de 3 ramificações transcendentais.
                </p>
                <button
                  onClick={() => abrirGeradorZanpakutoAI("bankai")}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 via-amber-500 to-orange-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-2xl shadow-[0_0_25px_#FFD700] hover:scale-105 transition"
                >
                  ⚡ Gerar 4 Opções de Bankai Suprema
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-bleach-panel border border-bleach-border rounded-2xl p-12 text-center space-y-3">
              <span className="text-4xl opacity-50">🔒</span>
              <h3 className="font-title text-3xl text-bleach-muted tracking-wider">
                BANKAI AINDA NÃO DESPERTA
              </h3>
              <p className="text-xs text-bleach-muted max-w-md mx-auto leading-relaxed">
                A liberação de Bankai requer domínio lendário da Shikai, aprovação expressa da Administração e treino árduo de submissão do espírito.
              </p>
            </div>
          )}
        </div>
      )}

      {/* GACHA REVEAL */}
      {rewardModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-bleach-panel border-2 border-bleach-orange rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl reiatsu-glow relative animate-bounce-short">
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="font-title text-3xl tracking-widest text-bleach-orange mb-1">
              {rewardModal.titulo}
            </h3>
            <div 
              className="text-lg font-bold uppercase my-3 inline-block px-4 py-1 rounded-full border"
              style={{ color: rewardModal.cor, borderColor: rewardModal.cor }}
            >
              {rewardModal.raridade}
            </div>
            {rewardModal.nomeItem && (
              <p className="text-sm font-bold text-white mb-2">{rewardModal.nomeItem}</p>
            )}
            {rewardModal.pontos > 0 && (
              <p className="text-base text-bleach-orange font-mono font-bold mb-2">
                +{rewardModal.pontos} Pontos Livres Concedidos!
              </p>
            )}
            <p className="text-xs text-bleach-creamDim mb-6 leading-relaxed">
              {rewardModal.desc}
            </p>
            <button
              onClick={() => setRewardModal(null)}
              className="px-6 py-2.5 bg-bleach-orange text-black font-extrabold text-xs uppercase rounded-lg shadow hover:bg-orange-400"
            >
              Resgatar Recompensa
            </button>
          </div>
        </div>
      )}

      {/* MODAL IA: RITUAL DRAMÁTICO DE DESPERTAR DE SHIKAI & BANKAI */}
      {showZanpakutoAIModal && (
        <div className="fixed inset-0 bg-black/92 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className={`bg-gradient-to-b from-[#14100C] via-[#0A0908] to-[#120F0C] border-2 ${
            aiZkTipo === 'bankai' 
              ? 'border-amber-400 shadow-[0_0_60px_rgba(255,215,0,0.35)]' 
              : 'border-cyan-400 shadow-[0_0_60px_rgba(79,179,232,0.35)]'
          } rounded-3xl p-5 sm:p-8 max-w-4xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto`}>
            
            <button 
              onClick={() => {
                if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
                setShowZanpakutoAIModal(false);
              }}
              className="absolute top-4 right-4 text-bleach-muted hover:text-white text-lg font-bold w-9 h-9 rounded-full bg-black/60 border border-white/10 flex items-center justify-center transition hover:border-bleach-orange"
            >
              ✕
            </button>

            {/* FASE 1: GRADE DAS 4 LÂMINAS SELADAS */}
            {ritualState === "selection" && (
              <div>
                <div className="text-center mb-6">
                  <span className={`px-4 py-1 border text-xs font-black rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow ${
                    aiZkTipo === 'bankai' 
                      ? 'bg-amber-950/80 border-amber-400 text-yellow-300' 
                      : 'bg-blue-950/80 border-cyan-400 text-cyan-300'
                  }`}>
                    <span>{aiZkTipo === 'bankai' ? '卍' : '🗡️'}</span>
                    <span>{aiZkTipo === 'bankai' ? 'RITUAL SUPREMO DE BANKAI • 4 EVOLUÇÕES SELADAS' : 'RITUAL SAGRADO DE SHIKAI • 4 LÂMINAS SELADAS'}</span>
                  </span>

                  <h3 className={`font-title text-3xl sm:text-5xl tracking-widest mt-2 ${
                    aiZkTipo === 'bankai' ? 'text-amber-300 drop-shadow-[0_0_20px_#FFD700]' : 'text-cyan-400 drop-shadow-[0_0_20px_rgba(79,179,232,0.7)]'
                  }`}>
                    {aiZkTipo === 'bankai' ? "SINTA A EVOLUÇÃO TRANSCENDENTAL" : "SINTA O CHAMADO DA SUA ZANPAKUTŌ"}
                  </h3>

                  <p className="text-xs sm:text-sm text-bleach-creamDim max-w-2xl mx-auto mt-2 leading-relaxed">
                    Passe o mouse ou <strong>segure com o dedo</strong> sobre uma lâmina para sentir a vibração da sua Reiatsu distorcendo o ar ao redor. Clique em uma das lâminas para concentrar seu Reiryoku e iniciar a quebra do selo!
                  </p>
                </div>

                {/* GRADE 2x2 DAS 4 CARTAS SELADAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {aiZkOpcoes.map((op, idx) => {
                    const isHovered = hoveredCardIdx === idx;
                    return (
                      <div
                        key={op.id}
                        onMouseEnter={() => handleHoverRitualCard(idx)}
                        onMouseLeave={() => handleLeaveRitualCard(idx)}
                        onTouchStart={() => handleHoverRitualCard(idx)}
                        onTouchEnd={() => handleLeaveRitualCard(idx)}
                        onClick={() => iniciarDespertarLamina(op, idx)}
                        className={`relative rounded-2xl p-5 border-2 transition duration-200 overflow-hidden flex flex-col justify-between min-h-[220px] select-none cursor-pointer ${
                          isHovered 
                            ? (aiZkTipo === 'bankai' ? 'air-vibrating-card-bankai bg-purple-950/40' : 'air-vibrating-card bg-blue-950/40')
                            : 'bg-black/80 border-bleach-borderSoft hover:border-bleach-creamDim/50 shadow-xl'
                        }`}
                      >
                        {isHovered && <div className="heat-haze-overlay"></div>}

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              aiZkTipo === 'bankai'
                                ? 'bg-amber-950 border-amber-400 text-yellow-300'
                                : 'bg-blue-950 border-cyan-400 text-cyan-300'
                            }`}>
                              {aiZkTipo === 'bankai' ? `Evolução #0${idx + 1}` : `Lâmina Selada #0${idx + 1}`}
                            </span>

                            <span className="text-[10px] font-mono text-bleach-muted">
                              {isHovered ? "⚡ RESSONANDO..." : "🔒 SELADA"}
                            </span>
                          </div>

                          <div className="text-center py-4">
                            <div className={`font-title text-2xl tracking-wider transition ${
                              isHovered 
                                ? (aiZkTipo === 'bankai' ? 'text-amber-300 drop-shadow-[0_0_12px_#FFD700]' : 'text-cyan-300 drop-shadow-[0_0_12px_#4FB3E8]')
                                : 'text-bleach-muted/60 blur-[3px]'
                            }`}>
                              {isHovered ? op.nome : "??? ??????"}
                            </div>
                            <div className="text-[11px] font-mono text-bleach-muted mt-1 italic">
                              {isHovered ? `Elemento: ${op.elemento}` : "Ouvindo sussurros distantes..."}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-white/5">
                          {isHovered ? (
                            <div className={`py-2 px-3 rounded-xl font-bold text-xs text-center uppercase tracking-wider transition animate-bounce ${
                              aiZkTipo === 'bankai'
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_15px_#FFD700]'
                                : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_0_15px_#4FB3E8]'
                            }`}>
                              ⚡ CLIQUE PARA CONCENTRAR O REIRYOKU!
                            </div>
                          ) : (
                            <div className="py-2 px-3 rounded-xl bg-black/60 border border-white/10 text-bleach-muted text-[11px] font-semibold text-center flex items-center justify-center gap-1.5">
                              <span>✨</span>
                              <span>Passe o cursor ou segure para sentir a vibração</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FASE 2: CÂMARA DE CARREGAMENTO */}
            {ritualState === "charging" && (
              <div className="py-8 px-4 text-center space-y-6 select-none">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto flex items-center justify-center">
                  
                  <div className={`absolute inset-0 rounded-full border-2 border-dashed ${
                    aiZkTipo === 'bankai' ? 'border-amber-400/60' : 'border-cyan-400/60'
                  } spin-runes`}></div>

                  <div className={`absolute inset-3 rounded-full border-2 border-dotted ${
                    aiZkTipo === 'bankai' ? 'border-purple-500/60' : 'border-blue-500/60'
                  } spin-runes-fast`}></div>

                  <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-black/90 border-4 flex flex-col items-center justify-center p-3 z-10 shadow-2xl transition ${
                    aiZkTipo === 'bankai' 
                      ? 'border-amber-400 shadow-[0_0_40px_rgba(255,215,0,0.6)]' 
                      : 'border-cyan-400 shadow-[0_0_40px_rgba(79,179,232,0.6)]'
                  } ${chargeProgress > 65 ? 'reiatsu-screen-shake' : ''}`}>
                    <span className="text-xl sm:text-2xl">{aiZkTipo === 'bankai' ? '卍' : '🗡️'}</span>
                    <span className={`font-title text-4xl sm:text-5xl font-black mt-0.5 ${
                      aiZkTipo === 'bankai' ? 'text-amber-300 drop-shadow-[0_0_15px_#FFD700]' : 'text-cyan-300 drop-shadow-[0_0_15px_#4FB3E8]'
                    }`}>
                      {chargeProgress}%
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-bleach-muted">
                      Densidade Reiryoku
                    </span>
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-2">
                  <div className="w-full bg-bleach-panel2 h-3.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-75 shadow-lg ${
                        aiZkTipo === 'bankai'
                          ? 'bg-gradient-to-r from-purple-600 via-amber-400 to-yellow-300 shadow-[0_0_15px_#FFD700]'
                          : 'bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-300 shadow-[0_0_15px_#4FB3E8]'
                      }`}
                      style={{ width: `${chargeProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className={`max-w-lg mx-auto p-4 rounded-2xl bg-black/80 border text-center text-xs sm:text-sm font-bold leading-relaxed shadow-inner ${
                  aiZkTipo === 'bankai' ? 'border-amber-500/50 text-yellow-200' : 'border-cyan-500/50 text-cyan-200'
                }`}>
                  {chargeStageText}
                </div>

                <div>
                  <button
                    onClick={pularCarregamento}
                    className="px-4 py-1.5 bg-black/60 border border-bleach-border hover:border-bleach-orange text-bleach-creamDim hover:text-white text-xs font-bold rounded-xl transition"
                  >
                    ⏩ Pular Animação de Despertar
                  </button>
                </div>
              </div>
            )}

            {/* FASE 3: REVELAÇÃO GLORIOSA DA LÂMINA */}
            {ritualState === "revealed" && revealedCard && (
              <div className="space-y-6 card-pop-reveal">
                
                <div className="text-center border-b border-bleach-borderSoft pb-4">
                  <span className={`px-4 py-1 border text-xs font-black rounded-full uppercase tracking-widest inline-flex items-center gap-1.5 shadow ${
                    aiZkTipo === 'bankai'
                      ? 'bg-gradient-to-r from-purple-900 to-amber-900 border-amber-400 text-yellow-300 shadow-[0_0_20px_#FFD700]'
                      : 'bg-gradient-to-r from-blue-950 to-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(79,179,232,0.6)]'
                  }`}>
                    <span>{aiZkTipo === 'bankai' ? '卍' : '🗡️'}</span>
                    <span>{aiZkTipo === 'bankai' ? 'BANKAI SUPREMA TRANSCENDENTAL DESBLOQUEADA!' : 'SHIKAI ÚNICA & AUTORAL DESPERTA!'}</span>
                  </span>

                  <h2 className={`font-title text-4xl sm:text-6xl tracking-widest mt-3 ${
                    aiZkTipo === 'bankai'
                      ? 'text-amber-300 drop-shadow-[0_0_30px_#FFD700]'
                      : 'text-cyan-400 drop-shadow-[0_0_30px_rgba(79,179,232,0.8)]'
                  }`}>
                    {revealedCard.nome}
                  </h2>

                  <div className="mt-3 p-3.5 bg-black/80 border border-white/10 rounded-2xl max-w-xl mx-auto">
                    <div className="text-[10px] text-bleach-muted uppercase tracking-wider font-bold">
                      Comando de Liberação Sagrado
                    </div>
                    <div className={`font-mono text-sm sm:text-base italic font-bold mt-0.5 ${
                      aiZkTipo === 'bankai' ? 'text-yellow-200' : 'text-cyan-200'
                    }`}>
                      "{revealedCard.comando}"
                    </div>
                  </div>
                </div>

                {/* Detalhes da Arma Revelada */}
                {revealedCard.espirito && (
                  <div className="bg-black/80 border border-cyan-500/30 p-4 rounded-2xl shadow-inner">
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5 mb-1">
                      <span>👤</span> Espírito da Zanpakutō & Mundo Interior
                    </div>
                    <p className="text-xs sm:text-sm text-cyan-100/90 italic leading-relaxed">
                      "{revealedCard.espirito}"
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/70 border border-bleach-border p-4 rounded-2xl space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-bleach-orange flex items-center gap-1.5">
                        <span>🗡️</span> Formato da Lâmina
                      </span>
                      <span className="px-2.5 py-0.5 bg-bleach-panel2 border border-bleach-border text-[10px] font-bold text-bleach-creamDim rounded-full">
                        {revealedCard.elemento}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-bleach-cream leading-relaxed">
                      {revealedCard.formatoArma}
                    </p>
                  </div>

                  <div className="bg-black/70 border border-bleach-border p-4 rounded-2xl space-y-1.5 shadow-inner">
                    <div className="text-xs font-bold uppercase tracking-wider text-bleach-orange flex items-center gap-1.5 mb-1">
                      <span>⚡</span> Poder & Efeito Devastador
                    </div>
                    <p className="text-xs sm:text-sm text-bleach-cream leading-relaxed">
                      {revealedCard.poder}
                    </p>
                  </div>
                </div>

                {/* Selo de Exclusividade Garantida */}
                <div className="p-3 bg-green-950/40 border border-green-500/40 rounded-xl text-center text-xs text-green-300 font-semibold flex items-center justify-center gap-2">
                  <span>🔒</span>
                  <span>Lâmina 100% Autoral: Ao selar, esta arma será sua com exclusividade absoluta no RPG! Ninguém mais terá esse nome ou poder.</span>
                </div>

                {/* Ações Finais */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={voltarParaSelecao}
                    className="w-full sm:w-auto px-5 py-3 bg-bleach-panel border border-bleach-border hover:border-bleach-orange text-bleach-cream text-xs font-bold uppercase rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <span>👁️</span>
                    <span>Explorar Outras Lâminas Seladas</span>
                  </button>

                  <button
                    onClick={() => escolherOpcaoAI(revealedCard)}
                    className={`w-full sm:w-auto px-8 py-3.5 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-2xl hover:scale-105 transition active:scale-95 flex items-center justify-center gap-2 ${
                      aiZkTipo === 'bankai'
                        ? 'bg-gradient-to-r from-purple-600 via-amber-400 to-yellow-400 shadow-[0_0_25px_#FFD700]'
                        : 'bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-[0_0_25px_#4FB3E8]'
                    }`}
                  >
                    <span>⚔️</span>
                    <span>Reivindicar & Selar Esta {aiZkTipo.toUpperCase()} na Minha Ficha</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
