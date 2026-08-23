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

  async function salvarUrlFirebase() {
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

          <div className="flex flex-wrap gap-2">
            {["fichas", "novo", "subadms", "dados", "nuvem", "ia"].map(t => (
              <button
                key={t}
                onClick={() => setTabAdm(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                  tabAdm === t ? "bg-yellow-500 text-black font-extrabold shadow" : "bg-black/60 border border-yellow-500/30 text-yellow-200"
                }`}
              >
                {t === "fichas" ? "Fichas" : t === "novo" ? "+ Criar" : t === "subadms" ? "Avaliadores" : t === "dados" ? "Dados" : t === "nuvem" ? "☁️ Firebase" : "🤖 IA & ChatGPT"}
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

      {/* SUBTAB: CONEXÃO FIREBASE & SINCRONIZAÇÃO EM TEMPO REAL */}
      {tabAdm === "nuvem" && (
        <Section title="Sincronização em Nuvem — Firebase Realtime Database" subtitle="Configuração de persistência global e sincronização instantânea de fichas">
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

      {/* SUBTAB: CONFIGURAÇÃO IA (GOOGLE GEMINI / CHATGPT) */}
      {tabAdm === "ia" && (
        <Section title="Motor de Inteligência Artificial — Google Gemini, ChatGPT & Motor Cognitivo" subtitle="Conecte a API gratuita do Google Gemini, OpenAI ou utilize o Motor Cognitivo autoral">
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
                    { faixa: "1–10", patamar: "Inexperiente", cor: C.muted },
                    { faixa: "11–30", patamar: "Iniciante", cor: C.green },
                    { faixa: "31–60", patamar: "Treinado", cor: C.blue },
                    { faixa: "61–100", patamar: "Experiente", cor: C.purple },
                    { faixa: "101–150", patamar: "Elite", cor: C.yellow },
                    { faixa: "151–250", patamar: "Alto Nível", cor: "#FFA500" },
                    { faixa: "251–400", patamar: "Monstruoso", cor: C.red },
                    { faixa: "401–600", patamar: "Lendário", cor: "#E0B34C" },
                    { faixa: "601+", patamar: "Transcendente", cor: "#FFD700" }
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
                    { diff: "0–10 pts", desc: "Equivalentes" },
                    { diff: "11–30 pts", desc: "Pequena vantagem" },
                    { diff: "31–75 pts", desc: "Vantagem clara" },
                    { diff: "76–150 pts", desc: "Grande vantagem" },
                    { diff: "151–250 pts", desc: "Abismo" },
                    { diff: "251+ pts", desc: "Diferença monstruosa" }
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
