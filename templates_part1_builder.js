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
            localStorage.setItem("bleachDB", JSON.stringify(freshData));
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
      // Must match identifier explicitly if supplied
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

// ADMIN LOGIN SCREEN & MODAL
function AdminLoginScreen({ db, onLoginAdmin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  function entrar(e) {
    e.preventDefault();
    const u = usuario.trim().toLowerCase();
    const s = senha.trim();

    if (u === "admin" && s === (db.superAdminSenha || "maximo2026")) {
      playReiatsuSound('win');
      onLoginAdmin("super_admin", { nome: db.superAdminNome || "Comandante Supremo" });
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
              placeholder="Ex: admin ou kisuke"
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

    if (u === "admin" && s === (db.superAdminSenha || "maximo2026")) {
      playReiatsuSound('win');
      onSuccess("super_admin", { nome: db.superAdminNome || "Comandante Supremo" });
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
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-bleach-creamDim mb-1 font-bold">Senha</label>
            <input
              type="password"
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

// KIDOS VIEW
function KidosView({ personagem, isAdmin }) {
  const [filtroCat, setFiltroCat] = useState("Todos");
  const [busca, setBusca] = useState("");

  const filtrados = CATALOGO_KIDOS.filter(k => {
    const matchCat = filtroCat === "Todos" || k.cat === filtroCat;
    const matchBusca = k.nome.toLowerCase().includes(busca.toLowerCase()) || (k.incant || "").toLowerCase().includes(busca.toLowerCase());
    return matchCat && matchBusca;
  });

  return (
    <div className="space-y-6">
      <Section title="Grimório Oficial de Kidō" subtitle="Catálogo milenar de Hadō, Bakudō e Kaidō">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar feitiço por nome ou encantamento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-bleach-orange"
          />
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => (
              <button
                key={cat}
                onClick={() => setFiltroCat(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  filtroCat === cat ? "bg-bleach-orange text-black font-extrabold" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtrados.map(k => (
            <div key={k.id} className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  k.cat === "Hadō" ? "bg-red-950 text-red-300 border-red-500" :
                  k.cat === "Bakudō" ? "bg-blue-950 text-cyan-300 border-cyan-500" : "bg-emerald-950 text-emerald-300 border-emerald-500"
                }`}>
                  {k.cat} #{k.numero}
                </span>
                <span className="text-xs font-mono text-bleach-muted">Custo: <strong className="text-bleach-orange">{k.custoReiatsu} Reiatsu</strong></span>
              </div>
              <h4 className="font-bold text-white text-base">{k.nome}</h4>
              <p className="text-xs text-bleach-creamDim leading-relaxed">{k.desc}</p>
              {k.incant && k.incant !== "—" && (
                <div className="p-2 bg-black/60 rounded border border-white/5 text-[11px] text-bleach-muted italic">
                  "{k.incant}"
                </div>
              )}
            </div>
          ))}
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
`;

fs.writeFileSync('templates/views_part1.jsx', CodeContent);
console.log("Written templates/views_part1.jsx!");
