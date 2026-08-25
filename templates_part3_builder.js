// =========================================================================
// VIEWS PART 3: ADMIN PANEL, FULL OFFICIAL SISTEMAS VIEW & LOL-STYLE PATCH NOTES
// =========================================================================

// TAB: PAINEL DE CONTROLE DA ADMINISTRAÇÃO
function AdminPanel({ db, saveDb, session, cloudStatus, setCloudStatus, activeCloudUrl, setActiveCloudUrl, onAbrirFicha }) {
  const isSuper = session?.role === "super_admin";
  const [tabAdm, setTabAdm] = useState("fichas");
  const [novoSubUser, setNovoSubUser] = useState("");
  const [novoSubPass, setNovoSubPass] = useState("");
  const [novoSubNome, setNovoSubNome] = useState("");
  const [novoSubCargo, setNovoSubCargo] = useState("Avaliador de Cenas & Fichas");

  // OpenAI ChatGPT Key State
  const [openAiKey, setOpenAiKey] = useState(() => (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") || "" : ""));
  const [keyStatusMsg, setKeyStatusMsg] = useState("");

  // Firebase Realtime Database State
  const [urlNuvemInput, setUrlNuvemInput] = useState(() => activeCloudUrl || db?.firebaseUrl || (typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_firebase_url") || "" : "https://bleach-rpg-6894c-default-rtdb.firebaseio.com/"));
  const [msgNuvem, setMsgNuvem] = useState("");
  const [loadingNuvem, setLoadingNuvem] = useState(false);

  // Super-ADM Master Credentials State (Exclusivo ADM Máximo)
  const [masterUser, setMasterUser] = useState(() => db?.superAdminUsuario || "Malu123");
  const [masterPass, setMasterPass] = useState(() => db?.superAdminSenha || "Sociedade2026");
  const [masterNome, setMasterNome] = useState(() => db?.superAdminNome || "ADM Máximo (Comandante Supremo)");
  const [msgMasterCreds, setMsgMasterCreds] = useState("");

  // Dados para Novo Personagem
  const [novoNome, setNovoNome] = useState("");
  const [novoWhats, setNovoWhats] = useState("");
  const [novoCodigo, setNovoCodigo] = useState("");
  const [novoRaca, setNovoRaca] = useState("Shinigami");
  const [novoEsquadrao, setNovoEsquadrao] = useState("11º Esquadrão");

  // Dados de Rolagem de Dados
  const [dadoTipo, setDadoTipo] = useState("d6");
  const [dadoChar, setDadoChar] = useState(db.personagens?.[0]?.nome || "Geral");

  // Dados de Lançamento de Atividade & Cenas em Lote
  const [atvCharId, setAtvCharId] = useState("");
  const [atvBuscaCodigo, setAtvBuscaCodigo] = useState("");
  const [atvQtdCenas, setAtvQtdCenas] = useState(5);
  const [atvValorPorCena, setAtvValorPorCena] = useState(100);
  const [atvMotivo, setAtvMotivo] = useState("");

  // Auto-correção caso sub-adm tente acessar aba restrita
  useEffect(() => {
    if (!isSuper && ["subadms", "nuvem", "ia", "seguranca"].includes(tabAdm)) {
      setTabAdm("fichas");
    }
  }, [isSuper, tabAdm]);

  function salvarCredenciaisMaster(e) {
    e.preventDefault();
    if (!isSuper) {
      alert("⛔ Acesso Negado: Apenas o ADM Máximo (Comandante Supremo) possui autorização para alterar as credenciais mestre.");
      return;
    }
    if (!masterUser.trim() || !masterPass.trim() || !masterNome.trim()) {
      alert("Por favor, preencha todos os campos das credenciais master!");
      return;
    }

    saveDb({
      ...db,
      superAdminUsuario: masterUser.trim(),
      superAdminSenha: masterPass.trim(),
      superAdminNome: masterNome.trim()
    });

    playReiatsuSound('win');
    setMsgMasterCreds("✓ Credenciais do ADM Máximo atualizadas e protegidas com sucesso!");
    setTimeout(() => setMsgMasterCreds(""), 4500);
  }

  function lancarAtividadeCenas(targetCharId, qtd, valPorCena, motivo) {
    const pId = targetCharId || atvCharId || (db.personagens && db.personagens[0] ? db.personagens[0].id : "");
    if (!pId) {
      alert("Selecione um personagem para lançar as cenas.");
      return;
    }
    const numCenas = Math.max(1, Number(qtd !== undefined ? qtd : atvQtdCenas) || 1);
    const taxaCena = Number(valPorCena !== undefined ? valPorCena : atvValorPorCena) || 100;
    const ganhoConhecimento = numCenas * taxaCena;

    let charNome = "";
    const novosP = (db.personagens || []).map(p => {
      if (p.id === pId) {
        charNome = p.nome;
        const cSem = Number(p.cenasSemana) || 0;
        const cTot = Number(p.cenasTotal) || 0;
        const conAtual = Number(p.conhecimento) || 0;
        return {
          ...p,
          codigoAtividade: p.codigoAtividade || getCodigoAtividade(p),
          cenasSemana: cSem + numCenas,
          cenasTotal: cTot + numCenas,
          conhecimento: conAtual + ganhoConhecimento,
          historico: [
            {
              id: uid(),
              data: nowStr(),
              texto: `📊 +${numCenas} cenas no WhatsApp registradas pela Staff (+${ganhoConhecimento} ₪ Conhecimento)${motivo ? ` — ${motivo}` : ''}`
            },
            ...(p.historico || [])
          ]
        };
      }
      return p;
    });

    saveDb({ ...db, personagens: novosP });
    playReiatsuSound('win');
    alert(`✓ Sucesso! Foram lançadas +${numCenas} cenas para [${charNome}].\n\n+${ganhoConhecimento} ₪ de Conhecimento creditado com sucesso!`);
    setAtvMotivo("");
  }

  function criarPersonagem(e) {
    e.preventDefault();
    if (!novoNome.trim() || !novoCodigo.trim()) {
      alert("Nome e Código de Acesso são obrigatórios!");
      return;
    }

    const whatsDigits = novoWhats.trim().replace(/\D/g, "").slice(-4) || String(Math.floor(1000 + Math.random() * 9000));
    const codAtividade = `ACT-${whatsDigits.padStart(4, '0')}`;

    const novoP = {
      id: "char-" + uid(),
      nome: novoNome.trim(),
      foto: "assets/ichigo-orange.png",
      whatsapp: novoWhats.trim(),
      codigo: novoCodigo.trim(),
      codigoAtividade: codAtividade,
      raca: novoRaca,
      esquadrao: novoEsquadrao,
      faceclaim: novoNome.trim(),
      idadePlayer: "20",
      aniversarioPlayer: "01/01",
      idadeChar: "18",
      aniversarioChar: "15/07",
      pontosDisponiveis: 20,
      conhecimento: novoRaca === "Shinigami" ? 450 : 150,
      cenasSemana: 0,
      cenasTotal: 0,
      sorteiosComunsRestantes: 2,
      sorteiosEspeciaisRestantes: 0,
      sorteiosDrops: [],
      permissoes: { shikaiLiberada: false, bankaiLiberada: false },
      atributos: { pressao: 10, forca: 10, velocidade: 10, resiliencia: 10 },
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
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo (Comandante Supremo) possui autorização para excluir fichas permanentemente.");
      return;
    }

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
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo pode cadastrar ou alterar avaliadores.");
      return;
    }
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
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo pode remover avaliadores.");
      return;
    }
    if (!confirm("Deseja remover este avaliador?")) return;
    saveDb({ ...db, subAdms: (db.subAdms || []).filter(s => s.id !== subId) });
  }

  function rolarDadoPublico() {
    const lados = dadoTipo === "d6" ? 6 : dadoTipo === "d20" ? 20 : 100;
    const res = Math.floor(Math.random() * lados) + 1;
    let cat = "Sucesso";
    if (dadoTipo === "d6") {
      cat = res <= 2 ? "Falha (1–2)" : res <= 4 ? "Sucesso Parcial (3–4)" : "Sucesso Total (5–6)";
    } else if (dadoTipo === "d20") {
      if (res === 20) cat = "🌟 Crítico Absoluto (20)";
      else if (res >= 16) cat = "✨ Extremo Sucesso (+80%)";
      else if (res >= 10) cat = "✓ Sucesso Médio (+50%)";
      else if (res === 1) cat = "💀 Falha Crítica (1)";
      else cat = "✗ Falha";
    }

    const rollLog = {
      id: uid(),
      autor: session?.nome || (isSuper ? "ADM Máximo" : "Sub-ADM"),
      personagem: dadoChar,
      dado: dadoTipo,
      resultado: res,
      categoria: cat,
      data: nowStr()
    };

    saveDb({ ...db, rolagensDadosPublicas: [rollLog, ...(db.rolagensDadosPublicas || []).slice(0, 30)] });
    playReiatsuSound('roll');
  }

  async function salvarUrlFirebase() {
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo pode reconfigurar os parâmetros do banco de dados em nuvem.");
      return;
    }
    const url = urlNuvemInput.trim();
    if (!url) {
      if (confirm("Deseja desconectar a nuvem e operar apenas em modo local?")) {
        try { localStorage.removeItem("bleach_firebase_url"); } catch(e) {}
        if (setActiveCloudUrl) setActiveCloudUrl("");
        if (setCloudStatus) setCloudStatus("local");
        saveDb({ ...db, firebaseUrl: "" });
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
        try { localStorage.setItem("bleach_firebase_url", url); } catch(e) {}
        if (setActiveCloudUrl) setActiveCloudUrl(url);
        if (setCloudStatus) setCloudStatus("connected");
        saveDb({ ...db, firebaseUrl: url });
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
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo pode forçar upload global para a nuvem.");
      return;
    }
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
        headers: { 'Content-Type': 'application/json' },
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
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo pode puxar dados da nuvem.");
      return;
    }
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
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo pode exportar o backup JSON completo.");
      return;
    }
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
    if (!isSuper) {
      alert("⛔ Acesso Restrito: Apenas o ADM Máximo pode restaurar backups JSON.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
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

  // Lista Dinâmica de Abas de Acordo com o Cargo (Super-ADM vs Sub-ADM)
  const tabsDisponiveis = [
    { id: "fichas", label: "Fichas", icon: "👤" },
    { id: "tramas", label: "🎭 Tramas & Arcos (IA)", icon: "🎭" },
    { id: "atividade", label: "📊 Cenas & Conhecimento", icon: "📊" },
    { id: "novo", label: "+ Criar Ficha", icon: "✨" },
    { id: "dados", label: "Mesa de Dados", icon: "🎲" },
    ...(isSuper ? [
      { id: "subadms", label: "👥 Avaliadores (Sub-ADMs)", icon: "👥" },
      { id: "nuvem", label: "☁️ Firebase Nuvem", icon: "☁️" },
      { id: "ia", label: "🤖 IA & ChatGPT", icon: "🤖" },
      { id: "seguranca", label: "👑 Credenciais Master", icon: "🔒" }
    ] : [])
  ];

  return (
    <div className="space-y-6">
      <div className="bg-banner-overlay border-2 border-yellow-500/70 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 bg-yellow-950 border border-yellow-400 text-yellow-300 text-xs font-bold rounded-full uppercase tracking-wider">
              {isSuper ? "👑 Painel Central de Comando • Comandante Supremo (ADM Máximo)" : "🛡️ Painel de Avaliação & Gestão • Avaliador Autorizado (Sub-ADM)"}
            </span>
            <h2 className="font-title text-3xl sm:text-4xl tracking-widest text-yellow-400 mt-2">
              GERENCIADOR DE FICHAS & NARRATIVA
            </h2>
            <p className="text-xs text-bleach-creamDim mt-1">
              {isSuper
                ? "Controle supremo irrestrito sobre fichas, arcos narrativos com IA, avaliadores, credenciais master e banco de dados."
                : "Painel de avaliação de treinos, gestão de tramas com IA, lançamento de cenas e criação de personagens."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabsDisponiveis.map(t => (
              <button
                key={t.id}
                onClick={() => setTabAdm(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition flex items-center gap-1 ${
                  tabAdm === t.id ? "bg-yellow-500 text-black font-extrabold shadow" : "bg-black/60 border border-yellow-500/30 text-yellow-200 hover:border-yellow-400"
                }`}
              >
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUBTAB: GESTÃO DE TRAMAS & ARCOS COM IA (INTEGRADO NO ADMIN PANEL) */}
      {tabAdm === "tramas" && (
        <TramasArcosAdmView
          db={db}
          saveDb={saveDb}
          session={session}
          onAbrirFicha={onAbrirFicha}
        />
      )}

      {/* SUBTAB: REGISTRO DE ATIVIDADE & CENAS EM LOTE */}
      {tabAdm === "atividade" && (
        <div className="space-y-6">
          <Section 
            title="📊 Lançamento de Atividade & Cenas em Lote" 
            subtitle="Registre as cenas feitas no WhatsApp pelo código do player para somar atividade e creditar Conhecimento semanal"
            className="border-2 border-yellow-500/60"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Painel do Formulário */}
              <div className="lg:col-span-1 p-5 bg-black/70 rounded-xl border border-yellow-500/40 space-y-4 shadow-xl">
                <h4 className="font-title text-base text-yellow-400 border-b border-white/10 pb-2 flex items-center gap-2">
                  <span>⚡</span> Lançar Cenas para Jogador
                </h4>

                {/* Busca Rápida */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-bleach-creamDim uppercase">
                    🔍 Buscar por Nome ou Código (ON):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Ichigo ou ACT-4321..."
                    value={atvBuscaCodigo}
                    onChange={(e) => {
                      const q = e.target.value;
                      setAtvBuscaCodigo(q);
                      if (q.trim()) {
                        const found = (db.personagens || []).find(p => 
                          p.nome.toLowerCase().includes(q.toLowerCase()) || 
                          getCodigoAtividade(p).toLowerCase().includes(q.toLowerCase())
                        );
                        if (found) setAtvCharId(found.id);
                      }
                    }}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-white placeholder:text-bleach-muted focus:border-yellow-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-bleach-creamDim uppercase mb-1">
                    Selecione o Personagem:
                  </label>
                  <select
                    value={atvCharId || (db.personagens?.[0]?.id || "")}
                    onChange={(e) => setAtvCharId(e.target.value)}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white focus:border-yellow-400 focus:outline-none"
                  >
                    {(db.personagens || []).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} — [{getCodigoAtividade(p)}] ({p.cenasSemana || 0} cenas • {p.conhecimento || 0} ₪)
                      </option>
                    ))}
                  </select>
                </div>

                {(() => {
                  const targetPId = atvCharId || (db.personagens?.[0]?.id || "");
                  const selChar = (db.personagens || []).find(p => p.id === targetPId);
                  if (!selChar) return null;
                  return (
                    <div className="p-3 bg-bleach-panel2 rounded-lg border border-white/5 space-y-1 text-xs font-mono">
                      <div className="flex justify-between text-bleach-muted">
                        <span>Código ON:</span>
                        <strong className="text-yellow-400">{getCodigoAtividade(selChar)}</strong>
                      </div>
                      <div className="flex justify-between text-bleach-muted">
                        <span>Cenas na Semana:</span>
                        <strong className="text-white">{selChar.cenasSemana || 0} cenas</strong>
                      </div>
                      <div className="flex justify-between text-bleach-muted">
                        <span>Saldo Conhecimento:</span>
                        <strong className="text-yellow-300">{selChar.conhecimento || 0} ₪</strong>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-[11px] font-bold text-bleach-creamDim uppercase mb-1">
                    Quantidade de Cenas a Lançar:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={atvQtdCenas}
                      onChange={(e) => setAtvQtdCenas(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-white font-mono"
                    />
                    <div className="flex gap-1 shrink-0">
                      {[1, 3, 5, 10].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAtvQtdCenas(val)}
                          className="px-2 py-1 bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500/50 text-yellow-300 text-[10px] font-bold rounded"
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-bleach-creamDim uppercase mb-1">
                    Conhecimento Concedido por Cena:
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={atvValorPorCena}
                    onChange={(e) => setAtvValorPorCena(Math.max(0, Number(e.target.value) || 0))}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-yellow-300 font-mono"
                  />
                  <span className="text-[10px] text-bleach-muted mt-0.5 block">
                    Total a creditar: <strong className="text-yellow-400 font-mono">+{atvQtdCenas * atvValorPorCena} ₪ Conhecimento</strong>
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-bleach-creamDim uppercase mb-1">
                    Motivo / Observação (Opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Treino em Karakura com 45 linhas / Missão do 11º Esquadrão"
                    value={atvMotivo}
                    onChange={(e) => setAtvMotivo(e.target.value)}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-white"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => lancarAtividadeCenas(atvCharId, atvQtdCenas, atvValorPorCena, atvMotivo)}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
                >
                  ✓ Lançar +{atvQtdCenas} Cenas & Creditar Conhecimento
                </button>
              </div>

              {/* Tabela Geral de Atividade dos Personagens */}
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-title text-base text-white">
                    Quadro Semanal de Atividade dos Jogadores ({db.personagens?.length || 0})
                  </h4>
                  <span className="text-xs text-bleach-muted">Clique nos botões rápidos para somar cenas instantaneamente</span>
                </div>

                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {(db.personagens || []).map((p) => {
                    const cod = getCodigoAtividade(p);
                    return (
                      <div
                        key={p.id}
                        className="p-3.5 bg-bleach-panel2 border border-white/10 hover:border-yellow-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.foto || 'assets/ichigo-orange.png'}
                            className="w-10 h-10 rounded-lg object-cover border border-white/10"
                          />
                          <div>
                            <h5 className="font-bold text-white text-sm">{p.nome}</h5>
                            <div className="flex items-center gap-2 text-xs font-mono text-bleach-muted">
                              <span>Código: <strong className="text-yellow-400">{cod}</strong></span>
                              <span>•</span>
                              <span>Conhecimento: <strong className="text-yellow-300">{p.conhecimento || 0} ₪</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-[10px] text-bleach-muted uppercase block">Cenas Semana:</span>
                            <span className="text-base font-mono font-black text-white">{p.cenasSemana || 0} cenas</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {[1, 3, 5].map((qtd) => (
                              <button
                                key={qtd}
                                type="button"
                                onClick={() => lancarAtividadeCenas(p.id, qtd, 100, `Lançamento rápido +${qtd} cenas`)}
                                className="px-2.5 py-1.5 bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500 text-yellow-300 text-xs font-bold font-mono rounded-lg transition"
                                title={`Adicionar +${qtd} cena(s) e +${qtd * 100} Conhecimento`}
                              >
                                +{qtd}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const val = prompt(`Definir saldo exato de Conhecimento (₪) para [${p.nome}]:`, String(p.conhecimento || 0));
                                if (val !== null && !isNaN(Number(val))) {
                                  const novoCon = Math.max(0, Number(val));
                                  const novosP = (db.personagens || []).map(cp => cp.id === p.id ? { ...cp, conhecimento: novoCon } : cp);
                                  saveDb({ ...db, personagens: novosP });
                                  playReiatsuSound('win');
                                }
                              }}
                              className="px-2 py-1.5 bg-black/80 border border-white/10 hover:border-yellow-400 text-bleach-cream text-xs rounded-lg transition"
                              title="Editar saldo de Conhecimento manualmente"
                            >
                              ✏️ ₪
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </Section>
        </div>
      )}

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

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        copiarFichaFormatadaWhatsApp(p, () => {
                          playReiatsuSound('win');
                          alert(`📋 Ficha Oficial de ${p.nome} copiada com sucesso para a área de transferência com formato WhatsApp (Made By Malutti)!`);
                        });
                      }}
                      className="w-full py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-1.5"
                    >
                      <span>📋</span> Copiar Ficha WhatsApp (Malutti)
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onAbrirFicha(p.id)}
                        className="flex-1 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase rounded-lg shadow"
                      >
                        ✏️ Gerenciar Ficha
                      </button>
                      {isSuper && (
                        <button
                          onClick={() => apagarPersonagem(p.id, p.nome)}
                          className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-lg"
                          title="Excluir Ficha (Exclusivo ADM Máximo)"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
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

      {/* SUBTAB: SUB-ADMS (EXCLUSIVO SUPER-ADM) */}
      {tabAdm === "subadms" && isSuper && (
        <Section title="Gerenciador de Avaliadores & Sub-Administradores" subtitle="Área exclusiva do ADM Máximo para cadastrar avaliadores com senhas individuais">
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
        <Section title="Mesa de Rolagem de Dados de Alta Tensão" subtitle="Rolagens públicas de 1d6, d20 e d100 para julgamento de cenas">
          <div className="p-4 bg-black/60 rounded-xl border border-bleach-border flex flex-wrap gap-3 items-center mb-6">
            <select value={dadoTipo} onChange={(e) => setDadoTipo(e.target.value)} className="bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white">
              <option value="d6">🎲 Dado 1d6 (Regra Oficial de Combate)</option>
              <option value="d20">🎲 Dado d20 (Testes Críticos)</option>
              <option value="d100">🎲 Dado d100 (Porcentagens)</option>
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

      {/* SUBTAB: CONEXÃO FIREBASE & SINCRONIZAÇÃO EM TEMPO REAL (EXCLUSIVO SUPER-ADM) */}
      {tabAdm === "nuvem" && isSuper && (
        <Section title="Sincronização em Nuvem — Firebase Realtime Database" subtitle="Configuração de persistência global e sincronização instantânea de fichas (Exclusivo ADM Máximo)">
          <div className="space-y-6">
            <div className="p-5 bg-black/60 border-2 border-yellow-500/50 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-950 border border-yellow-500 flex items-center justify-center text-xl">
                    ☁️
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Banco de Dados Firebase em Tempo Real</h4>
                    <p className="text-xs text-bleach-muted">Permite que todos os jogadores e mestres vejam alterações em tempo real</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                    cloudStatus === "connected"
                      ? "bg-green-950/80 border-green-500 text-green-300"
                      : cloudStatus === "error"
                      ? "bg-red-950/80 border-red-500 text-red-300"
                      : cloudStatus === "syncing"
                      ? "bg-yellow-950/80 border-yellow-500 text-yellow-300"
                      : "bg-blue-950/80 border-blue-500 text-blue-300"
                  }`}>
                    {cloudStatus === "connected"
                      ? "🟢 Conectado em Tempo Real"
                      : cloudStatus === "error"
                      ? "🔴 Erro de Conexão"
                      : cloudStatus === "syncing"
                      ? "🟡 Sincronizando..."
                      : "⚪ Modo Local (Offline)"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-yellow-300 uppercase">
                  URL do Firebase Realtime Database:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="https://seu-projeto-default-rtdb.firebaseio.com/"
                    value={urlNuvemInput}
                    onChange={(e) => setUrlNuvemInput(e.target.value)}
                    className="flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    disabled={loadingNuvem}
                    onClick={salvarUrlFirebase}
                    className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow disabled:opacity-50"
                  >
                    {loadingNuvem ? "Conectando..." : "Salvar & Conectar"}
                  </button>
                </div>
                {msgNuvem && (
                  <p className="text-xs font-bold mt-1 text-yellow-400">{msgNuvem}</p>
                )}
              </div>

              {/* Botões de Ação de Sincronização */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  disabled={loadingNuvem}
                  onClick={forcarUploadNuvem}
                  className="p-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <span>⬆️</span> Forçar Upload para Nuvem (Salvar Tudo)
                </button>
                <button
                  type="button"
                  disabled={loadingNuvem}
                  onClick={puxarDadosNuvem}
                  className="p-3 bg-bleach-panel2 hover:bg-white/10 border border-yellow-500/40 text-yellow-300 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>⬇️</span> Puxar Dados da Nuvem (Atualizar Fichas)
                </button>
              </div>
            </div>

            {/* Backup & Restauração Manual */}
            <div className="p-5 bg-bleach-panel2 border border-bleach-border rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-black border border-bleach-border flex items-center justify-center text-lg">
                  💾
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Backup Local & Restauração de Segurança (JSON)</h4>
                  <p className="text-xs text-bleach-muted">Exporte ou restaure todo o estado do RPG a qualquer momento em arquivo</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={baixarBackupJson}
                  className="px-5 py-2.5 bg-black/80 hover:bg-black border border-bleach-orange text-bleach-orange font-bold text-xs rounded-xl transition flex items-center gap-2"
                >
                  <span>📦</span> Baixar Arquivo de Backup (JSON)
                </button>

                <label className="px-5 py-2.5 bg-bleach-panel hover:bg-white/10 border border-bleach-border text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-2">
                  <span>📂</span> Restaurar Backup de Arquivo JSON
                  <input
                    type="file"
                    accept=".json"
                    onChange={importarBackupJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* SUBTAB: CONFIGURAÇÃO IA (EXCLUSIVO SUPER-ADM) */}
      {tabAdm === "ia" && isSuper && (
        <Section title="Motor de Inteligência Artificial — Google Gemini, ChatGPT & Motor Cognitivo" subtitle="Configuração de chaves de API globais (Exclusivo ADM Máximo)">
          <div className="space-y-6">
            <div className="p-5 bg-black/60 border-2 border-yellow-500/50 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-950 border border-yellow-500 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Geração de Zanpakutō com Inteligência Artificial</h4>
                    <p className="text-xs text-bleach-muted">Compatível com Google Gemini (Gratuito), OpenAI ChatGPT e Motor Cognitivo Local</p>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                  openAiKey && (openAiKey.startsWith("AIza") || openAiKey.startsWith("aiza"))
                    ? "bg-green-950/80 border-green-500 text-green-300"
                    : openAiKey && openAiKey.startsWith("sk-") 
                    ? "bg-green-950/80 border-green-500 text-green-300" 
                    : "bg-blue-950/80 border-cyan-500 text-cyan-300"
                }`}>
                  {openAiKey && (openAiKey.startsWith("AIza") || openAiKey.startsWith("aiza"))
                    ? "🟢 Google Gemini 2.0 Flash Online (Google AI)"
                    : openAiKey && openAiKey.startsWith("sk-")
                    ? "🟢 OpenAI ChatGPT Online (GPT-4o-mini)"
                    : "🔵 Motor Cognitivo ZGE v5.0 Nativo Ativo"}
                </span>
              </div>

              <p className="text-xs text-bleach-creamDim leading-relaxed">
                O sistema analisa automaticamente os <strong>atributos</strong> (dominante e deficiente), <strong>personalidade selada</strong> (virtudes, defeitos, desejos, medos, conflitos e estilo de combate) e a <strong>cena de despertar narrada</strong>.
              </p>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-yellow-300 uppercase">
                  Chave de API (Google Gemini ou OpenAI):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="password"
                    placeholder="Chave Google Gemini (AIzaSy...) ou OpenAI (sk-...)"
                    value={openAiKey}
                    onChange={(e) => setOpenAiKey(e.target.value)}
                    className="flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      try {
                        localStorage.setItem("bleach_openai_key", openAiKey.trim());
                        setKeyStatusMsg("✓ Chave de API salva com sucesso!");
                        setTimeout(() => setKeyStatusMsg(""), 4000);
                      } catch(e) {}
                    }}
                    className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow"
                  >
                    Salvar Chave
                  </button>
                  {openAiKey && (
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          localStorage.removeItem("bleach_openai_key");
                          setOpenAiKey("");
                          setKeyStatusMsg("✓ Chave removida. Usando Motor Cognitivo Nativo.");
                          setTimeout(() => setKeyStatusMsg(""), 4000);
                        } catch(e) {}
                      }}
                      className="px-4 py-2.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-xl transition"
                    >
                      Remover
                    </button>
                  )}
                </div>
                {keyStatusMsg && (
                  <p className="text-xs text-green-400 font-bold mt-1">{keyStatusMsg}</p>
                )}
              </div>
            </div>

            {/* Como Funciona a Estrutura dos 4 Caminhos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-bleach-orange font-bold">
                  <span>🔥</span> Opção 1: Elemental / Temperamento (~45% Peso)
                </div>
                <p className="text-bleach-creamDim leading-relaxed">
                  Manifestação da emoção central e virtudes da alma. Escala com o <strong>Atributo Dominante</strong> do personagem (Pressão, Força, Velocidade ou Resiliência).
                </p>
              </div>

              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <span>⚖️</span> Opção 2: Conceitual / Regras / Progressivo (~20% Peso)
                </div>
                <p className="text-bleach-creamDim leading-relaxed">
                  Mecânica tática por etapas e imposição de leis invioláveis no campo de batalha, refletindo a disciplina e o raciocínio tático.
                </p>
              </div>

              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-green-400 font-bold">
                  <span>🛡️</span> Opção 3: Compensatório / Defesa da Alma
                </div>
                <p className="text-bleach-creamDim leading-relaxed">
                  Compensa o <strong>Atributo Deficiente</strong> e ergue uma muralha protetora contra o <strong>maior medo</strong> do Shinigami.
                </p>
              </div>

              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <span>🌑</span> Opção 4: Opositivo / Abstrato / Sombra
                </div>
                <p className="text-bleach-creamDim leading-relaxed">
                  Explora a dualidade, conflitos internos e o paradoxo oculto do subconsciente, invertendo regras e percepções de combate.
                </p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* SUBTAB: CREDENCIAIS & SEGURANÇA DO ADM MÁXIMO (EXCLUSIVO SUPER-ADM) */}
      {tabAdm === "seguranca" && isSuper && (
        <Section 
          title="👑 Credenciais de Acesso do ADM Máximo (Comandante Supremo)" 
          subtitle="Área estritamente restrita para alteração de senha mestre, login e nome do ADM Máximo"
          className="border-2 border-yellow-500/80 shadow-2xl"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-4 bg-yellow-950/40 border border-yellow-500 rounded-xl space-y-2">
              <span className="px-2.5 py-0.5 bg-yellow-900 text-yellow-300 border border-yellow-400 text-[10px] font-extrabold uppercase rounded-full">
                🔒 Nível de Segurança: Autoridade Suprema (Selo da Central 46)
              </span>
              <h4 className="font-title text-xl text-yellow-300">
                Proteção de Credenciais do ADM Máximo
              </h4>
              <p className="text-xs text-bleach-creamDim leading-relaxed">
                Sub-Administradores e Avaliadores <strong>não possuem acesso a este painel</strong> e são tecnicamente impedidos de visualizar ou alterar a senha e o login do ADM Máximo.
              </p>
            </div>

            <form onSubmit={salvarCredenciaisMaster} className="p-6 bg-black/80 rounded-2xl border-2 border-yellow-500/50 space-y-4 shadow-xl">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-yellow-400 uppercase">
                  Nome de Exibição do ADM Máximo:
                </label>
                <input
                  type="text"
                  value={masterNome}
                  onChange={(e) => setMasterNome(e.target.value)}
                  placeholder="Ex: ADM Máximo (Comandante Supremo)"
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-yellow-400 uppercase">
                  Usuário de Login do ADM Máximo:
                </label>
                <input
                  type="text"
                  value={masterUser}
                  onChange={(e) => setMasterUser(e.target.value)}
                  placeholder="Ex: Malu123"
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono focus:border-yellow-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-yellow-400 uppercase">
                  Nova Senha Master do ADM Máximo:
                </label>
                <input
                  type="text"
                  value={masterPass}
                  onChange={(e) => setMasterPass(e.target.value)}
                  placeholder="Digite a nova senha master..."
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono focus:border-yellow-400 focus:outline-none"
                />
                <span className="text-[10px] text-bleach-muted">
                  Dica: Guarde esta senha em local seguro. Ela concede controle irrestrito sobre todo o banco de dados do RPG.
                </span>
              </div>

              {msgMasterCreds && (
                <div className="p-3 bg-green-950/80 border border-green-500 text-green-300 text-xs font-bold rounded-xl text-center shadow">
                  {msgMasterCreds}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
              >
                💾 Salvar Novas Credenciais do ADM Máximo
              </button>
            </form>
          </div>
        </Section>
      )}
    </div>
  );
}


// =========================================================================
// VIEW: GERENCIADOR DE TRAMAS, ARCOS & NARRATIVA COM IA (ÁREA ADM)
// =========================================================================
function TramasArcosAdmView({ db, saveDb, session, onAbrirFicha }) {
  const [subAba, setSubAba] = useState("individuais"); // "individuais", "conjuntas", "fichas", "nivelamento"
  
  // Estado para Tramas Individuais
  const [selectedCharId, setSelectedCharId] = useState(db.personagens?.[0]?.id || "");
  const [buscaChar, setBuscaChar] = useState("");
  const [novaCenaTitulo, setNovaCenaTitulo] = useState("");
  const [novaCenaTexto, setNovaCenaTexto] = useState("");
  const [gerandoIaIndividual, setGerandoIaIndividual] = useState(false);
  const [opcaoIndivIndex, setOpcaoIndivIndex] = useState(0);
  const [copiadoMsg, setCopiadoMsg] = useState("");

  // Estado para Tramas Conjuntas (Multi-Player)
  const [selectedConjId, setSelectedConjId] = useState("");
  const [modalCriarConj, setModalCriarConj] = useState(false);
  const [conjTitulo, setConjTitulo] = useState("");
  const [conjSelectedCharIds, setConjSelectedCharIds] = useState([]);
  const [novaCenaConjAutor, setNovaCenaConjAutor] = useState("");
  const [novaCenaConjTitulo, setNovaCenaConjTitulo] = useState("");
  const [novaCenaConjTexto, setNovaCenaConjTexto] = useState("");
  const [gerandoIaConjunta, setGerandoIaConjunta] = useState(false);
  const [opcaoConjIndex, setOpcaoConjIndex] = useState(0);

  const openAiKey = (typeof localStorage !== 'undefined') ? localStorage.getItem("bleach_openai_key") || "" : "";

  // Helper para copiar texto
  function copiarTexto(txt, msg = "✓ Copiado com sucesso para a área de transferência!") {
    if (!txt) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(() => {
        setCopiadoMsg(msg);
        setTimeout(() => setCopiadoMsg(""), 3500);
        playReiatsuSound('roll');
      }).catch(() => {});
    }
  }

  // Obter personagem ativo na aba individual
  const activeChar = (db.personagens || []).find(p => p.id === selectedCharId) || db.personagens?.[0] || null;

  // Obter ou criar registro de trama individual para o personagem
  const tramasIndividuaisList = db.tramasIndividuais || [];
  const tramaIndivAtual = tramasIndividuaisList.find(t => t.charId === activeChar?.id) || {
    id: "trama-" + (activeChar?.id || "default"),
    charId: activeChar?.id || "",
    charNome: activeChar?.nome || "",
    cenasArco: [],
    tramaAtual: null
  };

  // Obter registro de tramas conjuntas
  const tramasConjuntasList = db.tramasConjuntas || [];
  const tramaConjAtual = tramasConjuntasList.find(c => c.id === selectedConjId) || tramasConjuntasList[0] || null;

  // 1. Adicionar Nova Cena de Arco Individual
  function handleAdicionarCenaIndividual(e) {
    e.preventDefault();
    if (!activeChar) return;
    if (!novaCenaTitulo.trim() || !novaCenaTexto.trim()) {
      alert("Por favor, informe o Título e o Texto da Cena de Arco!");
      return;
    }

    const novaCena = {
      id: uid(),
      titulo: novaCenaTitulo.trim(),
      texto: novaCenaTexto.trim(),
      data: nowStr()
    };

    const updatedCenas = [novaCena, ...(tramaIndivAtual.cenasArco || [])];
    const updatedTrama = {
      ...tramaIndivAtual,
      charId: activeChar.id,
      charNome: activeChar.nome,
      cenasArco: updatedCenas
    };

    const novasTramasIndiv = tramasIndividuaisList.filter(t => t.charId !== activeChar.id);
    novasTramasIndiv.push(updatedTrama);

    saveDb({ ...db, tramasIndividuais: novasTramasIndiv });
    setNovaCenaTitulo("");
    setNovaCenaTexto("");
    playReiatsuSound('win');
    alert("✓ Cena de arco registrada com sucesso para " + activeChar.nome + "!");
  }

  // 2. Apagar Cena de Arco Individual
  function handleApagarCenaIndividual(cenaId) {
    if (!confirm("Tem certeza que deseja apagar esta cena de arco?")) return;
    const updatedCenas = (tramaIndivAtual.cenasArco || []).filter(c => c.id !== cenaId);
    const updatedTrama = { ...tramaIndivAtual, cenasArco: updatedCenas };
    const novasTramasIndiv = tramasIndividuaisList.map(t => t.charId === activeChar.id ? updatedTrama : t);
    saveDb({ ...db, tramasIndividuais: novasTramasIndiv });
    playReiatsuSound('shatter');
  }

  // 3. Sintetizar Trama Individual com IA (Gera 3 Opções de Trama Possíveis)
  async function handleGerarIaIndividual() {
    if (!activeChar) return;
    setGerandoIaIndividual(true);
    try {
      const generator = (typeof gerarTramaIndividualAI === 'function')
        ? gerarTramaIndividualAI
        : (typeof sintetizarTramaIndividualHeuristica === 'function' ? sintetizarTramaIndividualHeuristica : null);

      let resultado = null;
      if (generator) {
        resultado = await generator({
          player: activeChar,
          cenas: tramaIndivAtual.cenasArco || [],
          openAiKey
        });
      }

      if (resultado) {
        const updatedTrama = {
          ...tramaIndivAtual,
          charId: activeChar.id,
          charNome: activeChar.nome,
          tramaAtual: resultado,
          ultimaAtualizacao: nowStr()
        };

        const novasTramasIndiv = tramasIndividuaisList.filter(t => t.charId !== activeChar.id);
        novasTramasIndiv.push(updatedTrama);

        saveDb({ ...db, tramasIndividuais: novasTramasIndiv });
        setOpcaoIndivIndex(0);
        playReiatsuSound('bankai_charge');
        setCopiadoMsg("✨ 3 Opções de Trama geradas com sucesso pela IA a partir das cenas do jogador!");
        setTimeout(() => setCopiadoMsg(""), 4500);
      }
    } catch (err) {
      alert("Erro ao sintetizar trama individual: " + err.message);
    } finally {
      setGerandoIaIndividual(false);
    }
  }

  // 4. Remover / Limpar Sugestão de Trama Individual
  function handleRemoverSugestaoIndividual() {
    if (!confirm("Deseja remover as sugestões de trama da IA para este jogador? (As cenas de arco cadastradas continuarão salvas)")) return;
    const updatedTrama = { ...tramaIndivAtual, tramaAtual: null };
    const novasTramasIndiv = tramasIndividuaisList.map(t => t.charId === activeChar.id ? updatedTrama : t);
    saveDb({ ...db, tramasIndividuais: novasTramasIndiv });
    playReiatsuSound('shatter');
    alert("✓ Sugestão de trama removida com sucesso!");
  }

  // 5. Adotar Opção Específica de Trama Individual
  function handleAdotarOpcaoIndividual(idx) {
    if (!tramaIndivAtual.tramaAtual || !tramaIndivAtual.tramaAtual.opcoesTramas) return;
    const opEscolhida = tramaIndivAtual.tramaAtual.opcoesTramas[idx];
    if (!opEscolhida) return;

    const updatedTramaAtual = {
      ...tramaIndivAtual.tramaAtual,
      opcaoAtivaId: opEscolhida.id,
      tituloArco: opEscolhida.tituloArco,
      ganchoImediato: opEscolhida.focoNarrativo,
      eventos: opEscolhida.eventos,
      antagonista: opEscolhida.antagonista,
      briefingWhatsApp: opEscolhida.briefingWhatsApp
    };

    const updatedTrama = { ...tramaIndivAtual, tramaAtual: updatedTramaAtual };
    const novasTramasIndiv = tramasIndividuaisList.map(t => t.charId === activeChar.id ? updatedTrama : t);
    saveDb({ ...db, tramasIndividuais: novasTramasIndiv });
    playReiatsuSound('win');
    setCopiadoMsg("✓ Trama [" + opEscolhida.nomeOpcao + "] adotada como oficial para narração!");
    setTimeout(() => setCopiadoMsg(""), 3500);
  }

  // 6. Criar Nova Ficha de Trama Conjunta (Cruzar 2 ou mais Players)
  function handleCriarTramaConjunta(e) {
    e.preventDefault();
    if (conjSelectedCharIds.length < 2) {
      alert("Selecione pelo menos 2 jogadores para criar uma trama conjunta / cruzada!");
      return;
    }
    if (!conjTitulo.trim()) {
      alert("Defina um título para a trama conjunta!");
      return;
    }

    const selectedPlayers = (db.personagens || []).filter(p => conjSelectedCharIds.includes(p.id));
    const nomesDupla = selectedPlayers.map(p => p.nome).join(" & ");

    // Coletar cenas pré-existentes dos players selecionados
    const cenasIniciais = [];
    selectedPlayers.forEach(p => {
      const pTrama = tramasIndividuaisList.find(t => t.charId === p.id);
      if (pTrama && Array.isArray(pTrama.cenasArco)) {
        pTrama.cenasArco.slice(0, 2).forEach(c => {
          cenasIniciais.push({
            id: uid(),
            autorCharId: p.id,
            autorNome: p.nome,
            titulo: c.titulo,
            texto: c.texto,
            data: c.data
          });
        });
      }
    });

    const novaConjId = "conj-" + uid();
    const novaTramaConj = {
      id: novaConjId,
      titulo: conjTitulo.trim(),
      charIds: selectedPlayers.map(p => p.id),
      charNomes: selectedPlayers.map(p => p.nome),
      cenasCompartilhadas: cenasIniciais,
      tramaCruzada: null,
      dataCriacao: nowStr()
    };

    saveDb({ ...db, tramasConjuntas: [novaTramaConj, ...(db.tramasConjuntas || [])] });
    setSelectedConjId(novaConjId);
    setModalCriarConj(false);
    setConjTitulo("");
    setConjSelectedCharIds([]);
    playReiatsuSound('win');
    alert("✓ Ficha de Trama Conjunta criada com sucesso para [" + nomesDupla + "]!");
  }

  // 7. Adicionar Cena Compartilhada na Trama Conjunta
  function handleAdicionarCenaConjunta(e) {
    e.preventDefault();
    if (!tramaConjAtual) return;
    if (!novaCenaConjTitulo.trim() || !novaCenaConjTexto.trim()) {
      alert("Preencha o título e o texto da cena compartilhada!");
      return;
    }

    const autorChar = (db.personagens || []).find(p => p.id === (novaCenaConjAutor || tramaConjAtual.charIds[0]));
    const novaCena = {
      id: uid(),
      autorCharId: autorChar?.id || "",
      autorNome: autorChar?.nome || "Dupla",
      titulo: novaCenaConjTitulo.trim(),
      texto: novaCenaConjTexto.trim(),
      data: nowStr()
    };

    const updatedCenas = [novaCena, ...(tramaConjAtual.cenasCompartilhadas || [])];
    const updatedConj = { ...tramaConjAtual, cenasCompartilhadas: updatedCenas };
    const novasConjuntas = tramasConjuntasList.map(c => c.id === tramaConjAtual.id ? updatedConj : c);

    saveDb({ ...db, tramasConjuntas: novasConjuntas });
    setNovaCenaConjTitulo("");
    setNovaCenaConjTexto("");
    playReiatsuSound('win');
    alert("✓ Cena compartilhada registrada na Trama Conjunta!");
  }

  // 8. Sintetizar Trama Cruzada com IA (Gera 3 Opções de Trama Cruzadas)
  async function handleGerarIaConjunta() {
    if (!tramaConjAtual) return;
    setGerandoIaConjunta(true);
    try {
      const playersDupla = (db.personagens || []).filter(p => (tramaConjAtual.charIds || []).includes(p.id));
      const generator = (typeof gerarTramaConjuntaAI === 'function')
        ? gerarTramaConjuntaAI
        : (typeof sintetizarTramaConjuntaHeuristica === 'function' ? sintetizarTramaConjuntaHeuristica : null);

      let resultado = null;
      if (generator) {
        resultado = await generator({
          players: playersDupla,
          cenasConjuntas: tramaConjAtual.cenasCompartilhadas || [],
          openAiKey
        });
      }

      if (resultado) {
        const updatedConj = {
          ...tramaConjAtual,
          tramaCruzada: resultado,
          ultimaAtualizacao: nowStr()
        };
        const novasConjuntas = tramasConjuntasList.map(c => c.id === tramaConjAtual.id ? updatedConj : c);
        saveDb({ ...db, tramasConjuntas: novasConjuntas });
        setOpcaoConjIndex(0);
        playReiatsuSound('bankai_charge');
        setCopiadoMsg("✨ 3 Opções de Trama Cruzada geradas com sucesso para a dupla!");
        setTimeout(() => setCopiadoMsg(""), 4500);
      }
    } catch (err) {
      alert("Erro ao sintetizar trama conjunta: " + err.message);
    } finally {
      setGerandoIaConjunta(false);
    }
  }

  // 9. Remover / Limpar Sugestão de Trama Conjunta
  function handleRemoverSugestaoConjunta() {
    if (!confirm("Deseja remover as sugestões de trama conjunta da IA? (As cenas compartilhadas continuarão salvas)")) return;
    const updatedConj = { ...tramaConjAtual, tramaCruzada: null };
    const novasConjuntas = tramasConjuntasList.map(c => c.id === tramaConjAtual.id ? updatedConj : c);
    saveDb({ ...db, tramasConjuntas: novasConjuntas });
    playReiatsuSound('shatter');
    alert("✓ Sugestão de trama conjunta removida com sucesso!");
  }

  // Obter opção de trama individual ativa
  const opIndivAtiva = (tramaIndivAtual.tramaAtual?.opcoesTramas && tramaIndivAtual.tramaAtual.opcoesTramas[opcaoIndivIndex])
    ? tramaIndivAtual.tramaAtual.opcoesTramas[opcaoIndivIndex]
    : tramaIndivAtual.tramaAtual;

  // Obter opção de trama conjunta ativa
  const opConjAtiva = (tramaConjAtual?.tramaCruzada?.opcoesTramas && tramaConjAtual.tramaCruzada.opcoesTramas[opcaoConjIndex])
    ? tramaConjAtual.tramaCruzada.opcoesTramas[opcaoConjIndex]
    : tramaConjAtual?.tramaCruzada;

  return (
    <div className="space-y-6">
      
      {/* Banner Principal */}
      <div className="bg-banner-overlay border-2 border-purple-500/70 purple-reiatsu-glow rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-purple-950 border border-purple-400 text-purple-300 text-xs font-bold rounded-full uppercase tracking-wider">
                🎭 Sistema Exclusivo da Administração • Arcos & Narrativa com IA
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {tramasIndividuaisList.length} Tramas Individuais • {tramasConjuntasList.length} Arcos Cruzados
              </span>
            </div>
            <h2 className="font-title text-3xl sm:text-4xl tracking-widest text-purple-300 mt-2">
              GERENCIADOR DE TRAMAS & ARCOS COM IA
            </h2>
            <p className="text-xs text-bleach-creamDim mt-1 max-w-3xl leading-relaxed">
              A IA analisa profundamente as cenas de arco e momentos de impacto narrativo dos jogadores, gerando múltiplas opções de tramas sob medida para o ADM ou Sub-ADM escolher e narrar.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "individuais", label: "👤 Tramas Individuais", icon: "👤" },
              { id: "conjuntas", label: "🔗 Tramas Cruzadas / Duplas", icon: "🔗" },
              { id: "fichas", label: "📊 Visão Geral de Players", icon: "📊" },
              { id: "nivelamento", label: "⚖️ Nivelamento ADM/Sub-ADM", icon: "⚖️" }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubAba(tab.id)}
                className={"px-3 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 " + (
                  subAba === tab.id
                    ? "bg-purple-500 text-black font-black shadow-[0_0_15px_rgba(139,111,214,0.6)]"
                    : "bg-black/70 border border-purple-500/30 text-purple-200 hover:border-purple-400"
                )}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {copiadoMsg && (
        <div className="p-3 bg-green-950/80 border border-green-500 text-green-200 text-xs font-bold rounded-xl text-center shadow-lg animate-pulse">
          {copiadoMsg}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 1: TRAMAS INDIVIDUAIS DE JOGADORES */}
      {/* ========================================================================= */}
      {subAba === "individuais" && (
        <div className="space-y-6">
          <Section
            title="👤 Dossiê Narrativo & Tramas Individuais por Player"
            subtitle="Selecione um personagem para registrar suas cenas de arco e acionar a IA para analisar o texto e gerar as opções de tramas para o ADM narrar"
            className="border-2 border-purple-500/50"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Coluna Esquerda: Seletor e Ficha do Jogador (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Seletor & Busca */}
                <div className="p-4 bg-black/80 rounded-xl border border-purple-500/30 space-y-3">
                  <label className="block text-[11px] font-bold text-purple-300 uppercase">
                    🔍 Selecionar Jogador para Gestão de Trama:
                  </label>
                  <input
                    type="text"
                    placeholder="Buscar por nome ou código (ex: ACT-4321)..."
                    value={buscaChar}
                    onChange={(e) => {
                      const q = e.target.value;
                      setBuscaChar(q);
                      if (q.trim()) {
                        const found = (db.personagens || []).find(p =>
                          p.nome.toLowerCase().includes(q.toLowerCase()) ||
                          getCodigoAtividade(p).toLowerCase().includes(q.toLowerCase())
                        );
                        if (found) setSelectedCharId(found.id);
                      }
                    }}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-white placeholder:text-bleach-muted focus:border-purple-400 focus:outline-none font-sans"
                  />

                  <select
                    value={activeChar?.id || ""}
                    onChange={(e) => setSelectedCharId(e.target.value)}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white focus:border-purple-400 focus:outline-none"
                  >
                    {(db.personagens || []).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.nome} [{getCodigoAtividade(p)}] — {p.esquadrao}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cartão de Identidade do Jogador */}
                {activeChar && (
                  <div className="p-4 bg-gradient-to-b from-purple-950/40 via-bleach-panel2 to-black rounded-xl border-2 border-purple-500/40 space-y-3 shadow-xl">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <img
                        src={activeChar.foto || 'assets/ichigo-orange.png'}
                        className="w-14 h-14 rounded-xl object-cover border border-purple-400/50"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-purple-300 block">
                          {activeChar.raca} • {activeChar.esquadrao}
                        </span>
                        <h4 className="font-title text-xl text-white truncate">{activeChar.nome}</h4>
                        <span className="text-xs font-mono text-yellow-400 font-bold">
                          Código: {getCodigoAtividade(activeChar)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 bg-black/60 rounded border border-white/5">
                        <span className="text-bleach-muted block text-[10px]">Patamar:</span>
                        <strong className="text-white">{getPowerTier(Object.values(activeChar.atributos || {}).reduce((a, b) => a + b, 0)).title}</strong>
                      </div>
                      <div className="p-2 bg-black/60 rounded border border-white/5">
                        <span className="text-bleach-muted block text-[10px]">Cenas Totais:</span>
                        <strong className="text-purple-300 font-bold">{activeChar.cenasTotal || 0} cenas</strong>
                      </div>
                      <div className="p-2 bg-black/60 rounded border border-white/5">
                        <span className="text-bleach-muted block text-[10px]">Zanpakutō:</span>
                        <strong className="text-cyan-300 truncate block">{activeChar.zanpakuto?.shikaiAtiva?.nome || activeChar.zanpakuto?.nome || 'Em despertar'}</strong>
                      </div>
                      <div className="p-2 bg-black/60 rounded border border-white/5">
                        <span className="text-bleach-muted block text-[10px]">Conhecimento:</span>
                        <strong className="text-yellow-400">{activeChar.conhecimento || 0} ₪</strong>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setConjSelectedCharIds([activeChar.id]);
                          setConjTitulo("Arco de " + activeChar.nome + " & Parceiro");
                          setModalCriarConj(true);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition text-center"
                      >
                        🔗 Cruzar Trama com Outro Player
                      </button>
                    </div>
                  </div>
                )}

                {/* Formulário: Inserir Nova Cena de Arco */}
                <form onSubmit={handleAdicionarCenaIndividual} className="p-4 bg-black/80 rounded-xl border border-purple-500/30 space-y-3">
                  <h5 className="font-title text-sm text-purple-300 flex items-center gap-1.5 border-b border-white/10 pb-2">
                    <span>✍️</span> Registrar Cena de Arco do Jogador
                  </h5>
                  <div>
                    <label className="block text-[10px] font-bold text-bleach-muted uppercase mb-1">
                      Título / Momento da Cena:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Treino em Karakura com a Shikai / Confronto no Portão Sul"
                      value={novaCenaTitulo}
                      onChange={(e) => setNovaCenaTitulo(e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-bleach-muted uppercase mb-1">
                      Conteúdo da Cena / Ação no ON:
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Cole aqui o texto da cena de arco narrada pelo jogador no WhatsApp..."
                      value={novaCenaTexto}
                      onChange={(e) => setNovaCenaTexto(e.target.value)}
                      className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white focus:border-purple-400 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition"
                  >
                    + Salvar Cena de Arco na Ficha
                  </button>
                </form>

              </div>

              {/* Coluna Direita: Cenas Registradas & Análise com IA (8 cols) */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Gatilho da IA para Sintetizar Trama */}
                <div className="p-4 bg-gradient-to-r from-purple-950/60 via-black to-purple-950/40 rounded-xl border-2 border-purple-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-purple-900 border border-purple-400 text-purple-200">
                      Motor de Análise Semântica de Cenas & IA Narrativa
                    </span>
                    <h4 className="font-title text-xl text-white mt-1">
                      Analisar Cenas & Gerar Tramas Possíveis
                    </h4>
                    <p className="text-xs text-bleach-creamDim">
                      A IA lê o conteúdo das cenas registradas de <strong>{activeChar?.nome}</strong>, identifica inimigos, locais e clímax, e gera <strong>3 opções de tramas</strong> para a Staff escolher e narrar.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGerarIaIndividual}
                    disabled={gerandoIaIndividual}
                    className="px-5 py-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2 shrink-0"
                  >
                    {gerandoIaIndividual ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analisando Cenas com IA...</span>
                      </>
                    ) : (
                      <>
                        <span>🧠</span>
                        <span>Analisar Cenas & Gerar Tramas</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Exibição da Trama Sintetizada com IA */}
                {tramaIndivAtual.tramaAtual ? (
                  <div className="p-5 bg-black/90 rounded-xl border-2 border-purple-500/60 space-y-4 shadow-2xl">
                    
                    {/* Header do Card com Botões de Ação */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
                      <div>
                        <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-400 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                          ✨ Análise Cognitiva Concluída • {tramaIndivAtual.tramaAtual.opcoesTramas?.length || 3} Opções de Tramas Disponíveis
                        </span>
                        <h3 className="font-title text-2xl text-purple-300 mt-1">
                          {opIndivAtiva?.tituloArco || tramaIndivAtual.tramaAtual.tituloArco}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAdotarOpcaoIndividual(opcaoIndivIndex)}
                          className="px-3 py-1.5 bg-yellow-950/90 hover:bg-yellow-900 border border-yellow-500 text-yellow-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
                          title="Definir esta opção como a trama oficial do personagem"
                        >
                          <span>👑</span>
                          <span>Adotar Esta Trama</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => copiarTexto(opIndivAtiva?.briefingWhatsApp || tramaIndivAtual.tramaAtual.briefingWhatsApp, "✓ Dossiê do WhatsApp copiado!")}
                          className="px-3 py-1.5 bg-green-950 hover:bg-green-900 border border-green-500 text-green-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
                        >
                          <span>📋</span>
                          <span>Copiar WhatsApp</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleRemoverSugestaoIndividual}
                          className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
                          title="Remover as sugestões de trama da IA"
                        >
                          <span>🗑️</span>
                          <span>Remover Sugestão</span>
                        </button>
                      </div>
                    </div>

                    {/* SELETOR DE OPÇÕES DE TRAMAS GERADAS PELA IA */}
                    {Array.isArray(tramaIndivAtual.tramaAtual.opcoesTramas) && tramaIndivAtual.tramaAtual.opcoesTramas.length > 0 && (
                      <div className="p-3 bg-purple-950/30 rounded-xl border border-purple-500/40 space-y-2">
                        <span className="text-[11px] font-extrabold uppercase text-purple-300 tracking-wider block">
                          🎯 Escolha a Opção de Trama para Narrar:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {tramaIndivAtual.tramaAtual.opcoesTramas.map((op, idx) => (
                            <button
                              key={op.id || idx}
                              type="button"
                              onClick={() => setOpcaoIndivIndex(idx)}
                              className={"p-2.5 rounded-lg border text-left text-xs font-bold transition " + (
                                opcaoIndivIndex === idx
                                  ? "bg-purple-600 border-purple-300 text-white shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                                  : "bg-black/60 border-white/10 text-bleach-creamDim hover:border-purple-400"
                              )}
                            >
                              <span className="text-[10px] text-purple-300 block uppercase font-mono">Opção {idx + 1}</span>
                              <span className="block truncate">{op.nomeOpcao || ("Opção " + (idx + 1))}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Box de Diagnóstico Semântico da Cena */}
                    {tramaIndivAtual.tramaAtual.analiseCenas && (
                      <div className="p-3.5 bg-bleach-panel2 rounded-xl border border-cyan-500/30 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-cyan-300 font-bold uppercase text-[10px]">
                          <span>🔍 Elementos Extraídos das Cenas do Jogador:</span>
                          <span>{tramaIndivAtual.tramaAtual.analiseCenas.qtdCenas} cena(s) analisada(s)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                          <span className="px-2 py-0.5 bg-red-950/80 border border-red-500 text-red-300 rounded">
                            💀 Inimigo: {tramaIndivAtual.tramaAtual.analiseCenas.oponentePrincipal}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-950/80 border border-blue-500 text-blue-300 rounded">
                            📍 Local: {tramaIndivAtual.tramaAtual.analiseCenas.localPrincipal}
                          </span>
                          {(tramaIndivAtual.tramaAtual.analiseCenas.elementosDetectados || []).slice(0, 2).map((elem, eIdx) => (
                            <span key={eIdx} className="px-2 py-0.5 bg-purple-950/80 border border-purple-500 text-purple-300 rounded">
                              ⚡ {elem}
                            </span>
                          ))}
                        </div>
                        <p className="text-bleach-creamDim text-[11px] leading-relaxed pt-1 border-t border-white/5">
                          <strong>Momento Chave Analisado:</strong> "{tramaIndivAtual.tramaAtual.analiseCenas.momentoChave}"
                        </p>
                      </div>
                    )}

                    {/* Foco Narrativo da Opção Selecionada */}
                    <div className="p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1 text-xs">
                      <strong className="text-yellow-400 block text-xs uppercase font-bold">
                        ⚡ Sinopse & Gancho Narrativo ({opIndivAtiva?.nomeOpcao || "Opção Selecionada"}):
                      </strong>
                      <p className="text-bleach-creamDim leading-relaxed font-sans">
                        {opIndivAtiva?.focoNarrativo || opIndivAtiva?.ganchoImediato || tramaIndivAtual.tramaAtual.ganchoImediato}
                      </p>
                    </div>

                    {/* Trilha dos 3 Eventos Planejados */}
                    <div className="space-y-3 pt-2">
                      <h5 className="font-title text-base text-purple-300 flex items-center gap-1.5">
                        <span>⚔️</span> Trilha de Eventos Planejados para o Arco ({opIndivAtiva?.eventos?.length || 3} Etapas):
                      </h5>
                      <div className="grid grid-cols-1 gap-3">
                        {(opIndivAtiva?.eventos || tramaIndivAtual.tramaAtual.eventos || []).map((ev, idx) => (
                          <div key={idx} className="p-3.5 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="px-2 py-0.5 bg-purple-900 text-purple-300 border border-purple-500 font-mono font-bold text-[10px] rounded uppercase">
                                {ev.fase || ("Evento " + (idx + 1))}
                              </span>
                              <strong className="text-white text-xs font-bold">{ev.titulo}</strong>
                            </div>
                            <p className="text-xs text-bleach-cream leading-relaxed">{ev.descricao}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/5">
                              <span className="text-yellow-300"><strong>Objetivo:</strong> {ev.objetivoCena}</span>
                              <span className="text-cyan-300"><strong>Desafio Tático:</strong> {ev.desafioSugerido}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Antagonista Desenvolvido Sob Medida */}
                    {(opIndivAtiva?.antagonista || tramaIndivAtual.tramaAtual.antagonista) && (
                      <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-xl space-y-2">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-red-900 border border-red-500 text-red-200">
                          Antagonista / Força Opositora
                        </span>
                        <h5 className="font-title text-lg text-red-400">
                          {(opIndivAtiva?.antagonista || tramaIndivAtual.tramaAtual.antagonista).nome} — <span className="text-xs text-bleach-muted">{(opIndivAtiva?.antagonista || tramaIndivAtual.tramaAtual.antagonista).titulo}</span>
                        </h5>
                        <p className="text-xs text-bleach-creamDim leading-relaxed">
                          <strong>Motivação:</strong> {(opIndivAtiva?.antagonista || tramaIndivAtual.tramaAtual.antagonista).motivacao}
                        </p>
                        <p className="text-xs text-red-300">
                          <strong>Brecha / Ponto Fraco:</strong> {(opIndivAtiva?.antagonista || tramaIndivAtual.tramaAtual.antagonista).fraquezaChave}
                        </p>
                      </div>
                    )}

                    {/* Recompensa Nivelada */}
                    <div className="p-3 bg-yellow-950/30 border border-yellow-500/40 rounded-lg flex items-center justify-between text-xs text-yellow-300">
                      <span><strong>🎁 Recompensa Nivelada ao Concluir o Arco:</strong> 15 Pontos de Atributo + 2 Giros Comuns + 1 Especial</span>
                      <span className="font-mono text-[10px] text-bleach-muted">Garantido Oficial</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-black/60 rounded-xl border border-white/10 text-center space-y-2 text-bleach-muted">
                    <span className="text-3xl block">📖</span>
                    <p className="text-sm font-bold text-white">Nenhuma trama individual sintetizada para {activeChar?.nome} ainda.</p>
                    <p className="text-xs text-bleach-creamDim max-w-md mx-auto">
                      Registre as cenas de arco do jogador e clique no botão acima para a IA analisar a narrativa e gerar as 3 opções de tramas.
                    </p>
                  </div>
                )}

                {/* Histórico de Cenas de Arco Armazenadas */}
                <div className="p-4 bg-black/80 rounded-xl border border-purple-500/30 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h5 className="font-title text-base text-purple-300 flex items-center gap-1.5">
                      <span>📚</span> Cenas de Arco Armazenadas de {activeChar?.nome} ({tramaIndivAtual.cenasArco?.length || 0})
                    </h5>
                    <span className="text-xs text-bleach-muted font-mono">Total de Registros: {tramaIndivAtual.cenasArco?.length || 0}</span>
                  </div>

                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {(tramaIndivAtual.cenasArco || []).length === 0 ? (
                      <p className="text-xs text-bleach-muted py-4 text-center">Nenhuma cena de arco registrada para este jogador ainda.</p>
                    ) : (
                      (tramaIndivAtual.cenasArco || []).map((cena, idx) => (
                        <div key={cena.id || idx} className="p-3 bg-bleach-panel2 rounded-lg border border-white/5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <span>📜</span> {cena.titulo}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-bleach-muted font-mono">{cena.data}</span>
                              <button
                                type="button"
                                onClick={() => handleApagarCenaIndividual(cena.id)}
                                className="text-red-400 hover:text-red-300 text-xs px-1.5 py-0.5 rounded hover:bg-red-950"
                                title="Excluir cena"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-bleach-creamDim leading-relaxed font-sans max-h-24 overflow-y-auto whitespace-pre-wrap">
                            {cena.texto}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>
          </Section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 2: TRAMAS CONJUNTAS & ARCOS CRUZADOS (MULTI-PLAYER) */}
      {/* ========================================================================= */}
      {subAba === "conjuntas" && (
        <div className="space-y-6">
          <Section
            title="🔗 Fichas de Tramas Conjuntas & Arcos Cruzados (Multi-Player)"
            subtitle="Quando as histórias de dois ou mais jogadores se cruzam, crie uma ficha conjunta armazenando as cenas de ambos e forje um arco cooperativo com IA"
            className="border-2 border-indigo-500/50"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Coluna Esquerda: Lista de Tramas Conjuntas (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 bg-black/80 rounded-xl border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-title text-sm text-indigo-300 uppercase">
                      Tramas Conjuntas Existentes
                    </h5>
                    <button
                      type="button"
                      onClick={() => setModalCriarConj(true)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition shadow"
                    >
                      + Nova Trama
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {tramasConjuntasList.length === 0 ? (
                      <p className="text-xs text-bleach-muted py-3 text-center">Nenhuma trama conjunta criada ainda.</p>
                    ) : (
                      tramasConjuntasList.map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedConjId(c.id);
                            setOpcaoConjIndex(0);
                          }}
                          className={"w-full p-3 rounded-xl border text-left transition " + (
                            tramaConjAtual?.id === c.id
                              ? "bg-indigo-950/80 border-indigo-400 text-white shadow"
                              : "bg-bleach-panel2 border-white/5 text-bleach-creamDim hover:border-white/20"
                          )}
                        >
                          <span className="text-[10px] font-mono text-indigo-300 block uppercase">
                            Arco Compartilhado
                          </span>
                          <strong className="text-sm font-bold block text-white truncate">{c.titulo}</strong>
                          <span className="text-xs text-bleach-muted block truncate">
                            👥 {c.charNomes?.join(" & ") || "Jogadores"}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Se Trama Ativa: Adicionar Cena Compartilhada */}
                {tramaConjAtual && (
                  <form onSubmit={handleAdicionarCenaConjunta} className="p-4 bg-black/80 rounded-xl border border-indigo-500/30 space-y-3">
                    <h5 className="font-title text-sm text-indigo-300 border-b border-white/10 pb-2 flex items-center gap-1.5">
                      <span>✍️</span> Registrar Cena na Trama Conjunta
                    </h5>
                    <div>
                      <label className="block text-[10px] font-bold text-bleach-muted uppercase mb-1">
                        Autor / Protagonista da Cena:
                      </label>
                      <select
                        value={novaCenaConjAutor}
                        onChange={(e) => setNovaCenaConjAutor(e.target.value)}
                        className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-white"
                      >
                        {(tramaConjAtual.charIds || []).map(pId => {
                          const pObj = (db.personagens || []).find(p => p.id === pId);
                          return (
                            <option key={pId} value={pId}>
                              {pObj?.nome || pId}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-bleach-muted uppercase mb-1">
                        Título da Cena Conjunta:
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Diálogo no Mundo Humano / Duelo Combinado"
                        value={novaCenaConjTitulo}
                        onChange={(e) => setNovaCenaConjTitulo(e.target.value)}
                        className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-xs text-white focus:border-indigo-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-bleach-muted uppercase mb-1">
                        Texto da Cena Compartilhada:
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Cole aqui a cena conjunta narrada no WhatsApp..."
                        value={novaCenaConjTexto}
                        onChange={(e) => setNovaCenaConjTexto(e.target.value)}
                        className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white focus:border-indigo-400 focus:outline-none resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow transition"
                    >
                      + Adicionar Cena ao Arco Conjunto
                    </button>
                  </form>
                )}
              </div>

              {/* Coluna Direita: Análise com IA & Cenas Compartilhadas (8 cols) */}
              <div className="lg:col-span-8 space-y-5">
                {tramaConjAtual ? (
                  <>
                    {/* Botão de Síntese Cruzada com IA */}
                    <div className="p-4 bg-gradient-to-r from-indigo-950/60 via-black to-purple-950/40 rounded-xl border-2 border-indigo-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                      <div>
                        <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded bg-indigo-900 border border-indigo-400 text-indigo-200">
                          Motor de Narrativa Cruzada • Multi-Player
                        </span>
                        <h4 className="font-title text-xl text-white mt-1">
                          {tramaConjAtual.titulo}
                        </h4>
                        <p className="text-xs text-bleach-creamDim">
                          Jogadores Interligados: <strong className="text-indigo-300">{tramaConjAtual.charNomes?.join(" & ")}</strong>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleGerarIaConjunta}
                        disabled={gerandoIaConjunta}
                        className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition disabled:opacity-50 flex items-center gap-2 shrink-0"
                      >
                        {gerandoIaConjunta ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Gerando Opções de Trama Cruzada...</span>
                          </>
                        ) : (
                          <>
                            <span>⚡</span>
                            <span>Analisar Cenas & Gerar Tramas Cruzadas</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Exibição da Trama Cruzada Gerada */}
                    {tramaConjAtual.tramaCruzada ? (
                      <div className="p-5 bg-black/90 rounded-xl border-2 border-indigo-500/60 space-y-4 shadow-2xl">
                        
                        {/* Header com Ações */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-400 text-[10px] font-extrabold uppercase rounded-full">
                              {opConjAtiva?.dinamicaDupla || tramaConjAtual.tramaCruzada.dinamicaDupla || "Aliança de Esquadrões"}
                            </span>
                            <h3 className="font-title text-2xl text-indigo-300 mt-1">
                              {opConjAtiva?.tituloArco || tramaConjAtual.tramaCruzada.tituloArco}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => copiarTexto(opConjAtiva?.briefingWhatsApp || tramaConjAtual.tramaCruzada.briefingWhatsApp, "✓ Briefing conjunto copiado!")}
                              className="px-3 py-1.5 bg-green-950 hover:bg-green-900 border border-green-500 text-green-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
                            >
                              <span>📋</span>
                              <span>Copiar WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={handleRemoverSugestaoConjunta}
                              className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-300 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
                              title="Remover as sugestões de trama conjunta da IA"
                            >
                              <span>🗑️</span>
                              <span>Remover Sugestão</span>
                            </button>
                          </div>
                        </div>

                        {/* SELETOR DE OPÇÕES DE TRAMAS CONJUNTAS */}
                        {Array.isArray(tramaConjAtual.tramaCruzada.opcoesTramas) && tramaConjAtual.tramaCruzada.opcoesTramas.length > 0 && (
                          <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-500/40 space-y-2">
                            <span className="text-[11px] font-extrabold uppercase text-indigo-300 tracking-wider block">
                              🎯 Escolha a Opção de Trama Cruzada para Narrar:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {tramaConjAtual.tramaCruzada.opcoesTramas.map((op, idx) => (
                                <button
                                  key={op.id || idx}
                                  type="button"
                                  onClick={() => setOpcaoConjIndex(idx)}
                                  className={"p-2.5 rounded-lg border text-left text-xs font-bold transition " + (
                                    opcaoConjIndex === idx
                                      ? "bg-indigo-600 border-indigo-300 text-white shadow-[0_0_12px_rgba(99,102,241,0.7)]"
                                      : "bg-black/60 border-white/10 text-bleach-creamDim hover:border-indigo-400"
                                  )}
                                >
                                  <span className="text-[10px] text-indigo-300 block uppercase font-mono">Opção {idx + 1}</span>
                                  <span className="block truncate">{op.nomeOpcao || ("Opção " + (idx + 1))}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1 text-xs">
                          <strong className="text-indigo-300 block text-xs uppercase font-bold">📖 Sinopse da Trama Compartilhada:</strong>
                          <p className="text-bleach-cream leading-relaxed">{opConjAtiva?.sinopse || tramaConjAtual.tramaCruzada.sinopse}</p>
                        </div>

                        {/* Fases Cruzadas */}
                        <div className="space-y-3 pt-2">
                          <h5 className="font-title text-base text-indigo-300 flex items-center gap-1.5">
                            <span>⚔️</span> Fases da Provação Cruzada (Ações Interdependentes):
                          </h5>
                          <div className="grid grid-cols-1 gap-3">
                            {(opConjAtiva?.eventosCruzados || tramaConjAtual.tramaCruzada.eventosCruzados || []).map((fase, idx) => (
                              <div key={idx} className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-xl space-y-2">
                                <span className="px-2 py-0.5 bg-indigo-900 text-indigo-300 border border-indigo-500 font-mono font-bold text-[10px] rounded uppercase">
                                  {fase.fase || ("Fase " + (idx + 1))}
                                </span>
                                <p className="text-xs text-bleach-cream leading-relaxed">{fase.descricao}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/5">
                                  <span className="text-yellow-300"><strong>Papel Player 1:</strong> {fase.papelPlayer1}</span>
                                  <span className="text-cyan-300"><strong>Papel Player 2:</strong> {fase.papelPlayer2}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Ameaça Comum */}
                        {(opConjAtiva?.ameacaComum || tramaConjAtual.tramaCruzada.ameacaComum) && (
                          <div className="p-3.5 bg-red-950/30 border border-red-500/40 rounded-xl text-xs space-y-1">
                            <strong className="text-red-400 block text-xs uppercase font-bold">💀 Ameaça / Chefe Coletivo:</strong>
                            <p className="text-white font-bold">{(opConjAtiva?.ameacaComum || tramaConjAtual.tramaCruzada.ameacaComum).nome}</p>
                            <p className="text-bleach-creamDim">{(opConjAtiva?.ameacaComum || tramaConjAtual.tramaCruzada.ameacaComum).perigo}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-8 bg-black/60 rounded-xl border border-white/10 text-center space-y-2 text-bleach-muted">
                        <span className="text-3xl block">⚡</span>
                        <p className="text-sm font-bold text-white">Nenhum arco compartilhado gerado com IA para esta dupla ainda.</p>
                        <p className="text-xs text-bleach-creamDim max-w-md mx-auto">
                          Clique no botão "Analisar Cenas & Gerar Tramas Cruzadas" para entrelaçar as histórias dos jogadores selecionados.
                        </p>
                      </div>
                    )}

                    {/* Cenas Compartilhadas Armazenadas */}
                    <div className="p-4 bg-black/80 rounded-xl border border-indigo-500/30 space-y-3">
                      <h5 className="font-title text-base text-indigo-300 flex items-center gap-1.5 border-b border-white/10 pb-2">
                        <span>📚</span> Cenas Integradas desta Trama Conjunta ({tramaConjAtual.cenasCompartilhadas?.length || 0})
                      </h5>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {(tramaConjAtual.cenasCompartilhadas || []).map((c, idx) => (
                          <div key={c.id || idx} className="p-3 bg-bleach-panel2 rounded-lg border border-white/5 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-2">
                                <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 rounded text-[10px] font-mono">{c.autorNome}</span>
                                <span>{c.titulo}</span>
                              </span>
                              <span className="text-[10px] text-bleach-muted font-mono">{c.data}</span>
                            </div>
                            <p className="text-xs text-bleach-creamDim leading-relaxed whitespace-pre-wrap">{c.texto}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 bg-black/60 rounded-xl border border-white/10 text-center space-y-3 text-bleach-muted">
                    <span className="text-4xl block">👥</span>
                    <h4 className="font-title text-xl text-white">Nenhuma Trama Conjunta Selecionada</h4>
                    <p className="text-xs text-bleach-creamDim max-w-md mx-auto">
                      Crie uma nova trama conjunta para cruzar o destino de dois ou mais jogadores no RPG.
                    </p>
                    <button
                      type="button"
                      onClick={() => setModalCriarConj(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                    >
                      + Criar Nova Trama Conjunta
                    </button>
                  </div>
                )}
              </div>

            </div>
          </Section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 3: VISÃO GERAL DE FICHAS DOS PLAYERS */}
      {/* ========================================================================= */}
      {subAba === "fichas" && (
        <div className="space-y-6">
          <Section
            title="📊 Visão Geral de Fichas dos Players & Códigos de Atividade"
            subtitle="Fiscalize rapidamente os dados vitais, atributos, patamares e atividade de todos os jogadores"
            className="border-2 border-yellow-500/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(db.personagens || []).map(p => {
                const total = Object.values(p.atributos || {}).reduce((a, b) => a + b, 0);
                const tier = getPowerTier(total);
                const cod = getCodigoAtividade(p);
                const pTrama = tramasIndividuaisList.find(t => t.charId === p.id);
                const qtdCenasArco = pTrama?.cenasArco?.length || 0;

                return (
                  <div
                    key={p.id}
                    className="p-4 bg-bleach-panel2 border-2 border-white/10 hover:border-yellow-500/60 rounded-2xl space-y-3 shadow-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={p.foto || 'assets/ichigo-orange.png'}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-yellow-400 truncate">{p.esquadrao}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-yellow-300 border border-white/10">{cod}</span>
                        </div>
                        <h4 className="font-bold text-white text-base truncate">{p.nome}</h4>
                        <span className="text-xs text-bleach-muted">{p.raca} • {tier.title}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center font-mono text-[11px]">
                      <div className="p-1 bg-black/60 rounded border border-blue-500/20 text-cyan-300">
                        <span className="text-[9px] text-bleach-muted block">PE</span>{p.atributos?.pressao || 10}
                      </div>
                      <div className="p-1 bg-black/60 rounded border border-red-500/20 text-red-300">
                        <span className="text-[9px] text-bleach-muted block">FOR</span>{p.atributos?.forca || 10}
                      </div>
                      <div className="p-1 bg-black/60 rounded border border-green-500/20 text-green-300">
                        <span className="text-[9px] text-bleach-muted block">VEL</span>{p.atributos?.velocidade || 10}
                      </div>
                      <div className="p-1 bg-black/60 rounded border border-purple-500/20 text-purple-300">
                        <span className="text-[9px] text-bleach-muted block">RES</span>{p.atributos?.resiliencia || 10}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-white/5">
                      <span className="text-bleach-muted">Cenas Semana: <strong className="text-white">{p.cenasSemana || 0}</strong></span>
                      <span className="text-purple-300">Cenas de Arco: <strong>{qtdCenasArco}</strong></span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCharId(p.id);
                          setSubAba("individuais");
                        }}
                        className="flex-1 py-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-500 text-purple-200 text-xs font-bold rounded-lg transition text-center"
                      >
                        🎭 Tramas
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (onAbrirFicha) onAbrirFicha(p.id);
                        }}
                        className="flex-1 py-1.5 bg-yellow-950/80 hover:bg-yellow-900 border border-yellow-500 text-yellow-200 text-xs font-bold rounded-lg transition text-center"
                      >
                        👁️ Ver Ficha
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-ABA 4: NIVELAMENTO JUSTO DE RECOMPENSAS ADM / SUB-ADM */}
      {/* ========================================================================= */}
      {subAba === "nivelamento" && (
        <div className="space-y-6">
          <Section
            title="⚖️ Nivelamento Sagrado de Recompensas de ADM / Sub-ADM"
            subtitle="Regulamento oficial que impede inflação de atributos e garante paridade absoluta entre a Staff e os Players"
            className="border-2 border-emerald-500/50"
          >
            <div className="p-6 bg-black/80 rounded-2xl border-2 border-emerald-500/40 space-y-6 shadow-2xl">
              
              <div className="p-4 bg-emerald-950/40 border border-emerald-500 rounded-xl space-y-2">
                <span className="px-2.5 py-0.5 bg-emerald-900 text-emerald-300 border border-emerald-400 text-[10px] font-extrabold uppercase rounded-full">
                  ✦ Diretriz da Central 46 & Staff
                </span>
                <h4 className="font-title text-xl text-emerald-300">
                  Paridade Marcial: Como ADMs e Sub-ADMs Ganham Pontos no RPG
                </h4>
                <p className="text-xs text-bleach-creamDim leading-relaxed">
                  Como Administradores e Sub-Administradores podem cenar em ON e realizar os mesmos treinos que qualquer jogador, <strong>é terminantemente proibido atribuir pontos a cada micro-tarefa administrativa</strong> (avaliar fichas, checar relatórios ou responder tickets). Caso contrário, a Staff escalaria rápido demais e desbalancearia as batalhas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 bg-bleach-panel2 rounded-xl border border-yellow-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold">
                    <span>👑</span> 1. Narração de Missão Principal
                  </div>
                  <p className="text-bleach-creamDim leading-relaxed">
                    Quando o ADM/Sub-ADM narrar ou concluir a Missão Principal da semana, recebe <strong>exatamente o mesmo prêmio garantido que os jogadores</strong>:
                  </p>
                  <div className="p-2.5 bg-black/60 rounded border border-yellow-500/20 font-mono text-yellow-300 font-bold">
                    +15 Pontos de Atributo + 2 Giros Comuns + 1 Giro Especial
                  </div>
                </div>

                <div className="p-4 bg-bleach-panel2 rounded-xl border border-purple-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <span>📜</span> 2. Análise & Conclusão de Cenas de Arco
                  </div>
                  <p className="text-bleach-creamDim leading-relaxed">
                    Ao estruturar e avaliar as Cenas de Arco dos jogadores (com o mínimo exigido de 90 linhas no ON), a Staff é bonificada de forma padronizada:
                  </p>
                  <div className="p-2.5 bg-black/60 rounded border border-purple-500/20 font-mono text-purple-300 font-bold">
                    +15 Pontos de Atributo + 2 Giros Comuns + 1 Giro Especial
                  </div>
                </div>

              </div>

              <div className="p-4 bg-red-950/30 border border-red-500/40 rounded-xl space-y-2 text-xs">
                <strong className="text-red-400 block text-xs uppercase font-bold">🚫 Proibições Expressas de Balanceamento:</strong>
                <ul className="list-disc list-inside space-y-1 text-bleach-creamDim">
                  <li>Proibido criar pontos do nada para si mesmo sem cenas em ON ou narração oficial de arco.</li>
                  <li>Treinos individuais da Staff seguem a mesma regra dos players (mínimo de 30 linhas por cena no WhatsApp).</li>
                  <li>Todos os registros de evolução passam pelo histórico público da ficha auditável.</li>
                </ul>
              </div>

            </div>
          </Section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR NOVA TRAMA CONJUNTA */}
      {/* ========================================================================= */}
      {modalCriarConj && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-bleach-panel border-2 border-indigo-500 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-400">Multi-Player Arc Engine</span>
                <h4 className="font-title text-xl text-white">Criar Nova Trama Conjunta</h4>
              </div>
              <button
                type="button"
                onClick={() => setModalCriarConj(false)}
                className="text-bleach-muted hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCriarTramaConjunta} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-bleach-creamDim uppercase mb-1">
                  Título da Trama Conjunta:
                </label>
                <input
                  type="text"
                  placeholder="Ex: Arco do Eclipse das Lâminas / Missão Conjunta de Karakura"
                  value={conjTitulo}
                  onChange={(e) => setConjTitulo(e.target.value)}
                  className="w-full bg-black/80 border border-bleach-border rounded-lg p-2.5 text-xs text-white focus:border-indigo-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-bleach-creamDim uppercase mb-1">
                  Selecione os Jogadores Envolvidos (Mínimo 2):
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 bg-black/50 p-2 rounded-lg border border-white/5">
                  {(db.personagens || []).map(p => {
                    const isChecked = conjSelectedCharIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={"flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition text-xs " + (
                          isChecked ? "bg-indigo-950/80 border border-indigo-500 text-white" : "hover:bg-white/5 text-bleach-creamDim"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConjSelectedCharIds(prev => [...prev, p.id]);
                            } else {
                              setConjSelectedCharIds(prev => prev.filter(id => id !== p.id));
                            }
                          }}
                          className="accent-indigo-500"
                        />
                        <span className="font-bold">{p.nome}</span>
                        <span className="text-[10px] text-bleach-muted">({p.esquadrao} • {getCodigoAtividade(p)})</span>
                      </label>
                    );
                  })}
                </div>
                <span className="text-[10px] text-bleach-muted mt-1 block">
                  {conjSelectedCharIds.length} jogadores selecionados
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalCriarConj(false)}
                  className="flex-1 py-2.5 bg-black/80 border border-white/20 text-bleach-muted text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                  Criar Ficha Conjunta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}


// FULL OFFICIAL SISTEMAS & REGRAS VIEW (100% CANONICAL BLEACH RPG BASE SYSTEM)
function SistemasView() {
  const [tabSis, setTabSis] = useState("conceito");

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-bleach-orange/20 border border-bleach-orange text-bleach-orange text-xs font-bold rounded-full uppercase tracking-wider">
            Regulamento Oficial da Sociedade das Almas • Versão 5.0
          </span>
          <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-bleach-cream mt-3 reiatsu-text-glow">
            BLEACH RPG — SISTEMA BASE
          </h2>
          <p className="text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed">
            O RPG é focado principalmente em Narrativa, Desenvolvimento de personagem, Combate, Power scaling e Evolução gradual. Evita excesso de rolagens — dados só aparecem quando existe dúvida real!
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto border-b border-bleach-borderSoft pb-2">
        {[
          { id: "conceito", label: "1–4. Conceito, Raças & Kidō Inicial", icon: "⚔️" },
          { id: "atributos", label: "5–9. Atributos & Power Scaling", icon: "⚡" },
          { id: "combate", label: "10–14. Combate, 1d6 & Estados", icon: "🩸" },
          { id: "treinamento", label: "15–21. Treinos OFF & Fadiga", icon: "🏋️" },
          { id: "missoes", label: "22–27. Missões, Miscelâneas & Drops", icon: "📜" },
          { id: "filosofia", label: "28–30. Técnicas, Zanpakutō & Filosofia", icon: "🗡️" },
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

      {/* TAB 1: CONCEITO, RAÇAS & KIDŌ INICIAL */}
      {tabSis === "conceito" && (
        <div className="space-y-6">
          <Section title="1. Conceito do Sistema" subtitle="A essência da interpretação e resolução de ações">
            <div className="space-y-3 text-xs text-bleach-creamDim leading-relaxed">
              <p>O RPG é focado principalmente em: <strong>Narrativa, Desenvolvimento de Personagem, Combate, Power Scaling e Evolução Gradual</strong>.</p>
              <p>O sistema deve evitar excesso de rolagens. <strong>Dados só aparecem quando existe uma dúvida real.</strong></p>
              <div className="p-3 bg-black/60 border border-bleach-orange/40 rounded-xl text-white font-mono text-center">
                Resultado = Atributos + Técnicas + Experiência + Circunstâncias + Narrativa
              </div>
            </div>
          </Section>

          <Section title="2 & 3. Raças Disponíveis & Diferença de Origens" subtitle="Shinigami da Sociedade das Almas vs Shinigami Ex-Humano">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-cyan-400 uppercase">⚔️ Shinigami (Nativo)</h4>
                <p className="text-bleach-creamDim">Personagem que já pertence à Sociedade das Almas e possui formação básica como Shinigami na Academia Shinō.</p>
                <ul className="list-disc list-inside text-[11px] text-bleach-muted space-y-0.5">
                  <li>Possui Zanpakutō e formação inicial</li>
                  <li>Começa com 4 Kidōs básicos à escolha</li>
                  <li>Pode aprender Zanjutsu, Hakuda, Hohō e técnicas</li>
                </ul>
              </div>

              <div className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-purple-400 uppercase">👤 Shinigami Ex-Humano</h4>
                <p className="text-bleach-creamDim">Personagem que teve uma vida humana antes de se tornar Shinigami. A origem influencia personalidade, memórias, relações e motivações.</p>
                <ul className="list-disc list-inside text-[11px] text-bleach-muted space-y-0.5">
                  <li>Não fornece bônus automático de atributos (origem narrativa)</li>
                  <li>Aprende Kidō posteriormente através de treino e história</li>
                  <li>Evolução, Zanpakutō e atributos operam de forma idêntica</li>
                </ul>
              </div>
            </div>

            {/* Tabela Comparativa */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-bleach-border">
                <thead className="bg-black text-bleach-orange font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 border-b border-bleach-border">Característica</th>
                    <th className="p-2.5 border-b border-bleach-border">Shinigami</th>
                    <th className="p-2.5 border-b border-bleach-border">Shinigami Ex-Humano</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-bleach-creamDim">
                  <tr><td className="p-2 font-semibold text-white">Origem</td><td className="p-2">Sociedade das Almas</td><td className="p-2">Mundo Humano</td></tr>
                  <tr><td className="p-2 font-semibold text-white">Vida humana anterior</td><td className="p-2">Não</td><td className="p-2">Sim</td></tr>
                  <tr><td className="p-2 font-semibold text-white">Atributos & Evolução</td><td className="p-2 text-green-400 font-bold">Iguais (10 + 20 livres)</td><td className="p-2 text-green-400 font-bold">Iguais (10 + 20 livres)</td></tr>
                  <tr><td className="p-2 font-semibold text-white">Zanpakutō</td><td className="p-2">Sim</td><td className="p-2">Sim</td></tr>
                  <tr><td className="p-2 font-semibold text-white">Kidō Inicial</td><td className="p-2 text-cyan-300">4 Kidōs Básicos</td><td className="p-2 text-yellow-300">Aprende na narrativa</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Kidō Inicial & Kaidō" subtitle="Distribuição dos feitiços iniciais e diretrizes de cura">
            <div className="space-y-3 text-xs text-bleach-creamDim leading-relaxed">
              <p>Um Shinigami nativo começa com <strong>4 Kidō Básicos</strong> distribuídos livremente entre <strong>Hadō (Ataque)</strong>, <strong>Bakudō (Defesa/Contenção)</strong> e <strong>Kaidō (Cura)</strong>.</p>
              <div className="p-3.5 bg-bleach-panel2 border-l-4 border-green-500 rounded-xl space-y-1">
                <strong className="text-green-400 block font-bold">🌿 Diretrizes de Kaidō (Cura Espiritual):</strong>
                <p>Kaidō representa técnicas de tratamento e cura espiritual para tratar ferimentos, estabilizar aliados e aliviar danos. Porém, <strong>Kaidō não substitui descanso nem recuperação narrativa</strong>. Ferimentos graves podem exigir repouso ou técnicas médicas avançadas.</p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 2: ATRIBUTOS & POWER SCALING */}
      {tabSis === "atributos" && (
        <div className="space-y-6">
          <Section title="5, 6 & 7. Atributos & Criação Inicial" subtitle="Regra fundamental: O número na ficha É o atributo">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-4">
              {ATTRS.map(a => (
                <div key={a.key} className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                  <h4 className="font-bold uppercase tracking-wider text-xs" style={{ color: a.color }}>{a.label}</h4>
                  <p className="text-[11px] text-bleach-creamDim leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-black/70 border border-yellow-500/50 rounded-xl text-xs space-y-2 text-bleach-creamDim">
              <strong className="text-yellow-400 block font-bold">✨ Criação & Regra Fundamental:</strong>
              <p>Todos os atributos começam em <strong>10</strong> e o jogador recebe <strong>20 Pontos de Atributo</strong> para distribuir livremente sem limite inicial.</p>
              <p className="text-white font-mono font-bold">O número da ficha É o atributo. Não existe conversão, multiplicador, nível escondido ou escala secundária.</p>
            </div>
          </Section>

          <Section title="8 & 9. Escala Oficial de Power Scaling & Diferenças" subtitle="Hierarquia e distâncias relativas entre atributos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-title text-sm text-bleach-orange uppercase">Escala de Referência</h4>
                <div className="space-y-1.5">
                  {[
                    { faixa: "1–200", patamar: "Inexperiente", cor: C.muted },
                    { faixa: "201–450", patamar: "Iniciante", cor: C.green },
                    { faixa: "451–750", patamar: "Treinado", cor: C.blue },
                    { faixa: "751–1100", patamar: "Experiente", cor: C.purple },
                    { faixa: "1101–1500", patamar: "Elite", cor: C.yellow },
                    { faixa: "1501–2000", patamar: "Alto Nível", cor: "#FFA500" },
                    { faixa: "2001–2600", patamar: "Monstruoso", cor: C.red },
                    { faixa: "2601–3300", patamar: "Lendário", cor: "#E0B34C" },
                    { faixa: "3300+", patamar: "Transcendente", cor: "#FFD700" }
                  ].map(p => (
                    <div key={p.patamar} className="p-2 bg-bleach-panel2 border border-white/5 rounded-lg flex justify-between">
                      <span className="font-mono font-bold text-white">{p.faixa} pts</span>
                      <span className="font-bold uppercase" style={{ color: p.cor }}>{p.patamar}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-title text-sm text-cyan-400 uppercase">Diferença em Combate</h4>
                <div className="space-y-1.5">
                  {[
                    { diff: "0–50 pts", desc: "Equivalentes" },
                    { diff: "51–150 pts", desc: "Pequena vantagem" },
                    { diff: "151–300 pts", desc: "Vantagem clara" },
                    { diff: "301–600 pts", desc: "Grande vantagem" },
                    { diff: "601–1000 pts", desc: "Abismo de poder" },
                    { diff: "1001+ pts", desc: "Diferença monstruosa" }
                  ].map(d => (
                    <div key={d.diff} className="p-2 bg-bleach-panel2 border border-white/5 rounded-lg flex justify-between">
                      <span className="font-mono text-bleach-muted">{d.diff}</span>
                      <strong className="text-white">{d.desc}</strong>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-bleach-muted italic mt-2">Quanto maior a diferença, mais difícil é superar a inferioridade através de técnica pura.</p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 3: COMBATE, 1D6 & ESTADOS */}
      {tabSis === "combate" && (
        <div className="space-y-6">
          <Section title="10 & 11. Estrutura de Combate & O Dado 1d6" subtitle="Processo de 3 etapas e resolução simplificada">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-4">
              <div className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                <span className="font-bold text-bleach-orange uppercase block text-[10px]">1. Intenção</span>
                <p>O jogador declara claramente o que pretende fazer em sua narração.</p>
              </div>
              <div className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                <span className="font-bold text-cyan-400 uppercase block text-[10px]">2. Comparação</span>
                <p>O narrador compara os atributos, técnicas e contexto dos envolvidos.</p>
              </div>
              <div className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                <span className="font-bold text-green-400 uppercase block text-[10px]">3. Consequência</span>
                <p>O narrador determina o desfecho sem rolagem obrigatória.</p>
              </div>
            </div>

            <div className="p-4 bg-black/60 border border-yellow-500/40 rounded-xl text-xs space-y-2">
              <h4 className="font-bold text-yellow-300 uppercase">🎲 Regra do Dado 1d6 (Apenas em Dúvida Real)</h4>
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 bg-red-950/60 border border-red-500/50 rounded-lg text-red-300">1–2: Falha</div>
                <div className="p-2 bg-yellow-950/60 border border-yellow-500/50 rounded-lg text-yellow-300">3–4: Sucesso Parcial</div>
                <div className="p-2 bg-green-950/60 border border-green-500/50 rounded-lg text-green-300">5–6: Sucesso Total</div>
              </div>
            </div>
          </Section>

          <Section title="12 & 13. Estados de Combate & Pressão Espiritual" subtitle="Sem barra de HP tradicional">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs text-center mb-4">
              <div className="p-3 bg-green-950/40 border border-green-500/40 rounded-xl">
                <strong className="text-green-400 block font-bold">🟢 Inteiro</strong>
                <span className="text-[10px] text-bleach-muted">Condição normal</span>
              </div>
              <div className="p-3 bg-yellow-950/40 border border-yellow-500/40 rounded-xl">
                <strong className="text-yellow-400 block font-bold">🟡 Ferido</strong>
                <span className="text-[10px] text-bleach-muted">Danos afetam desempenho</span>
              </div>
              <div className="p-3 bg-orange-950/40 border border-orange-500/40 rounded-xl">
                <strong className="text-orange-400 block font-bold">🟠 Debilitado</strong>
                <span className="text-[10px] text-bleach-muted">Gravemente prejudicado</span>
              </div>
              <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl">
                <strong className="text-red-400 block font-bold">🔴 Derrotado</strong>
                <span className="text-[10px] text-bleach-muted">Incapacitado de lutar</span>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 4: TREINOS OFF & FADIGA */}
      {tabSis === "treinamento" && (
        <div className="space-y-6">
          <Section title="15–21. Treinamento em OFF, Ganhos & Sistema de Fadiga" subtitle="Máximo de 3 treinos diários e penalidades por desgaste">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl">
                  <span className="font-bold text-white block uppercase text-[10px]">1º Período</span>
                  <p className="text-bleach-muted">Manhã (0–3 pts)</p>
                </div>
                <div className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl">
                  <span className="font-bold text-white block uppercase text-[10px]">2º Período</span>
                  <p className="text-bleach-muted">Tarde (0–3 pts)</p>
                </div>
                <div className="p-3.5 bg-bleach-panel2 border border-bleach-border rounded-xl">
                  <span className="font-bold text-white block uppercase text-[10px]">3º Período</span>
                  <p className="text-bleach-muted">Noite (0–3 pts)</p>
                </div>
              </div>

              <div className="p-4 bg-red-950/40 border-2 border-red-500/50 rounded-xl space-y-2">
                <h4 className="font-bold text-red-300 uppercase">⚠️ Regras de Fadiga Temporária</h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-white">
                  <li><strong>1 Treino:</strong> Nenhuma redução obrigatória.</li>
                  <li><strong>2 Treinos:</strong> −5% temporário nos atributos treinados.</li>
                  <li><strong>3 Treinos:</strong> −15% temporário nos atributos treinados + <strong>bloqueio de recompensas de Miscelânea</strong> naquele dia.</li>
                  <li><strong>Descanso:</strong> Um novo dia remove 100% da fadiga acumulada sem perda de pontos permanentes da ficha.</li>
                </ul>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 5: MISSÕES, MISCELÂNEAS & DROPS */}
      {tabSis === "missoes" && (
        <div className="space-y-6">
          <Section title="22–27. Recompensas de Cenas ON & Drops Extras" subtitle="Tabela oficial de ganhos por tipo de cena">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
              <div className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                <strong className="text-cyan-400 block uppercase font-bold">Missões (ON)</strong>
                <p className="text-[11px] text-bleach-muted">Simples: 1–2 pts<br/>Normal: 2–4 pts<br/>Importante: 3–6 pts<br/>Excepcional: 5–8 pts</p>
              </div>
              <div className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                <strong className="text-green-400 block uppercase font-bold">Miscelâneas (ON)</strong>
                <p className="text-[11px] text-bleach-muted">Simples: 0–1 pt<br/>Relevante: 1–2 pts<br/>Excepcional: 2–3 pts</p>
              </div>
              <div className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                <strong className="text-purple-400 block uppercase font-bold">Cenas de Arco</strong>
                <p className="text-[11px] text-bleach-muted">Comum: 1–3 pts<br/>Importante: 2–4 pts<br/>Decisiva: 4–6 pts</p>
              </div>
              <div className="p-3 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-1">
                <strong className="text-yellow-400 block uppercase font-bold">Combates (ON)</strong>
                <p className="text-[11px] text-bleach-muted">Menor: 1–2 pts<br/>Relevante: 2–4 pts<br/>Importante: 3–6 pts</p>
              </div>
            </div>

            <div className="p-3.5 bg-black/60 border border-white/10 rounded-xl text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-bleach-orange block uppercase">Bônus Semanal de Constância:</span>
                <span className="text-bleach-creamDim">Jogadores muito ativos recebem +2 a +3 Pontos de Atributo ao final da semana.</span>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 6: FILOSOFIA & ZANPAKUTŌ */}
      {tabSis === "filosofia" && (
        <div className="space-y-6">
          <Section title="28, 29 & 30. Técnicas, Zanpakutō & Filosofia Geral" subtitle="Os 4 princípios do Bleach RPG">
            <div className="space-y-4 text-xs text-bleach-creamDim leading-relaxed">
              <div className="p-4 bg-bleach-panel2 border-l-4 border-yellow-500 rounded-xl space-y-2">
                <h4 className="font-bold text-sm text-yellow-400 uppercase">Os Quatro Princípios</h4>
                <ul className="list-disc list-inside space-y-1 font-mono text-white">
                  <li>Números determinam a escala.</li>
                  <li>Técnicas determinam como o poder é utilizado.</li>
                  <li>Narrativa determina o contexto.</li>
                  <li>Dados só aparecem quando existe incerteza real.</li>
                </ul>
              </div>

              <div className="p-3.5 bg-black/60 border border-cyan-500/40 rounded-xl text-[11px] text-cyan-200">
                <strong>🗡️ Evolução da Zanpakutō:</strong> A Zanpakutō evolui através da história: descoberta do espírito, nome, Shikai e Bankai. Não são poderes comprados com pontos, mas conquistados narrativamente.
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  );
}

// LEAGUE OF LEGENDS STYLE PATCH NOTES COMPONENT
function PatchNotesView() {
  const [patchAtivo, setPatchAtivo] = useState(PATCH_NOTES_HISTORY[0].versao);
  const patch = PATCH_NOTES_HISTORY.find(p => p.versao === patchAtivo) || PATCH_NOTES_HISTORY[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-yellow-950 border border-yellow-500 text-yellow-300 text-xs font-bold rounded-full uppercase tracking-wider">
            Histórico Oficial de Atualizações • Estilo League of Legends
          </span>
          <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-bleach-cream mt-3 reiatsu-text-glow">
            NOTAS DE ATUALIZAÇÃO & BALANCEAMENTO
          </h2>
          <p className="text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed">
            Acompanhe a evolução contínua do Bleach RPG: mudanças de regras, buffs, nerfs, novos sistemas e ajustes no motor de almas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Version Selector Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-bleach-muted px-2 block">Versões Anteriores (10 Patches)</span>
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {PATCH_NOTES_HISTORY.map((p) => {
              const isCurrent = p.versao === patchAtivo;
              return (
                <button
                  key={p.versao}
                  onClick={() => setPatchAtivo(p.versao)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isCurrent
                      ? "bg-bleach-orange text-black font-extrabold border-bleach-orange shadow-lg"
                      : "bg-bleach-panel2 border-bleach-border text-bleach-creamDim hover:text-white hover:border-white/20"
                  }`}
                >
                  <div>
                    <span className="font-title text-base block leading-tight">PATCH {p.versao}</span>
                    <span className={`text-[10px] block ${isCurrent ? "text-black/80 font-bold" : "text-bleach-muted"}`}>{p.data}</span>
                  </div>
                  {p.versao === "5.0" && (
                    <span className="px-2 py-0.5 rounded bg-black text-bleach-orange text-[9px] font-bold uppercase">ATUAL</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Patch Content Details */}
        <div className="lg:col-span-3 space-y-5">
          <Section
            title={`PATCH ${patch.versao} — ${patch.titulo}`}
            subtitle={`Lançado oficialmente em ${patch.data}`}
            className="border-2 border-yellow-500/40 shadow-2xl"
          >
            {/* Highlights Box */}
            <div className="p-4 bg-black/80 border border-yellow-500/40 rounded-2xl mb-6 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 block">Destaques da Atualização</span>
              <p className="text-sm font-semibold text-white leading-relaxed">{patch.destaque}</p>
              <p className="text-xs text-bleach-creamDim pt-1 border-t border-white/5">{patch.resumo}</p>
            </div>

            {/* Sections (Buffs, Nerfs, New Features, Rules) */}
            <div className="space-y-5">
              {patch.secoes.map((sec, idx) => (
                <div key={idx} className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-3">
                  <h4 className="font-title text-lg text-bleach-orange uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                    {sec.titulo}
                  </h4>
                  <div className="space-y-2 text-xs text-bleach-creamDim leading-relaxed">
                    {sec.itens.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-2.5 bg-black/40 rounded-lg border border-white/5 whitespace-pre-wrap">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
