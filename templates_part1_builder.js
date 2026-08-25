// =========================================================================
// VIEWS PART 1: TOPBAR, SUBTLE ADMIN, LIVE CHAT, LOGIN, RANKINGS, KIDOS & ARENA
// =========================================================================

// TOP NAVIGATION BAR (WITH SUBTLE ADMIN SEAL, CHAT & PATCH NOTES)
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
            { id: "chat", label: "Chat dos Shinigamis", icon: "💬" },
            { id: "rankings", label: "Rankings", icon: "🏆" },
            { id: "kidos", label: "Grimório de Kidō", icon: "📕" },
            { id: "arena", label: "Arena de Duelos", icon: "⚔️" },
            { id: "patchnotes", label: "Patch Notes", icon: "📰" },
            ...(isAdmin ? [
              { id: "tramas_adm", label: "Tramas & Arcos (IA)", icon: "🎭" },
              { id: "admin", label: "Painel ADM", icon: "👑" }
            ] : [])
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

        {/* User Session / Cloud & Subtle Admin Seal */}
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
            </div>
          )}

          {/* SUBTLE AESTHETIC SEAL FOR ADMIN ACCESS */}
          <button
            onClick={onOpenAdminLogin}
            className="w-7 h-7 flex items-center justify-center rounded-full text-bleach-border hover:text-bleach-orange/60 hover:bg-white/5 transition text-xs select-none"
            title="Selo Espiritual do Seireitei"
          >
            ❖
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="md:hidden flex items-center justify-around border-t border-bleach-borderSoft/60 px-2 py-1.5 overflow-x-auto bg-black/40">
        {[
          { id: "sistemas", label: "Regras", icon: "📜" },
          { id: "ficha", label: "Ficha", icon: "👤" },
          { id: "chat", label: "Chat", icon: "💬" },
          { id: "rankings", label: "Rankings", icon: "🏆" },
          { id: "kidos", label: "Kidō", icon: "📕" },
          { id: "arena", label: "Arena", icon: "⚔️" },
          { id: "patchnotes", label: "Patch", icon: "📰" },
          ...(isAdmin ? [
            { id: "tramas_adm", label: "Tramas", icon: "🎭" },
            { id: "admin", label: "ADM", icon: "👑" }
          ] : [])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`px-2 py-1 rounded text-[11px] font-semibold whitespace-nowrap ${
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

// LIVE CHAT ROOM FOR SHINIGAMIS
function ChatView({ db, saveDb, session, myChar }) {
  const [mensagem, setMensagem] = useState("");
  const chatBottomRef = useRef(null);

  const mensagens = db?.mensagensChat || [
    {
      id: "msg-welcome-1",
      autorNome: "Comandante Supremo",
      charFoto: "assets/ichigo-moon.png",
      esquadrao: "1º Esquadrão",
      texto: "Bem-vindos ao canal de comunicação direta da Sociedade das Almas. Mantenham o decoro e compartilhem suas jornadas!",
      timestamp: "10:00",
      data: "Hoje"
    }
  ];

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
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
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      data: nowStr()
    };

    const novasMensagens = [...mensagens, novaMsg].slice(-100); // manter últimas 100 mensagens
    saveDb({ ...db, mensagensChat: novasMensagens });
    setMensagem("");
    playReiatsuSound('roll');
  }

  return (
    <div className="space-y-6">
      <Section
        title="💬 Comunicação Espiritual dos Shinigamis"
        subtitle="Canal de convivência, anúncios e interação entre todos os membros da Sociedade das Almas"
        className="border-2 border-bleach-orange/40 shadow-2xl"
      >
        <div className="flex flex-col h-[520px] bg-black/70 border border-bleach-border rounded-2xl overflow-hidden shadow-inner">
          {/* Header Bar */}
          <div className="p-3 bg-bleach-panel2/80 border-b border-bleach-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-xs font-bold text-bleach-cream uppercase tracking-wider">Canal Geral de Karakura & Seireitei</span>
            </div>
            <span className="text-[11px] text-bleach-muted font-mono">{mensagens.length} mensagens gravadas</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {mensagens.map((msg) => {
              const isMe = session && (msg.charId === myChar?.id || (session.role === "super_admin" && msg.autorNome.includes("ADM")));
              return (
                <div key={msg.id} className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
                  <img src={msg.charFoto || 'assets/ichigo-orange.png'} className="w-9 h-9 rounded-xl object-cover border border-bleach-border shrink-0 mt-0.5" />
                  <div className={`max-w-[75%] rounded-2xl p-3 text-xs space-y-1 ${
                    isMe ? "bg-orange-950/70 border border-bleach-orange/60 text-white rounded-tr-none" : "bg-bleach-panel2 border border-white/10 text-bleach-cream rounded-tl-none"
                  }`}>
                    <div className="flex items-center justify-between gap-3 text-[10px]">
                      <strong className={isMe ? "text-bleach-orange" : "text-cyan-300"}>{msg.autorNome}</strong>
                      <span className="text-bleach-muted font-mono">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.texto}</p>
                    {msg.esquadrao && (
                      <span className="text-[9px] text-bleach-muted block pt-0.5 border-t border-white/5 uppercase font-mono">
                        {msg.esquadrao}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Box */}
          <form onSubmit={enviarMensagem} className="p-3 bg-bleach-panel2 border-t border-bleach-border flex gap-2">
            <input
              type="text"
              placeholder={session ? "Escreva sua mensagem para todos os Shinigamis..." : "Faça login na sua ficha para interagir no chat..."}
              disabled={!session}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              className="flex-1 bg-black/80 border border-bleach-border focus:border-bleach-orange rounded-xl px-4 py-2.5 text-xs text-white placeholder-bleach-muted outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!session || !mensagem.trim()}
              className="px-5 py-2.5 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase rounded-xl shadow hover:brightness-110 disabled:opacity-40 transition"
            >
              Enviar ➔
            </button>
          </form>
        </div>
      </Section>
    </div>
  );
}

// PLAYER LOGIN SCREEN
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
        const cleanUrl = cloudUrl.endsWith('/') ? cloudUrl.slice(0, -1) : cloudUrl;
        const endpoint = cleanUrl.endsWith('.json') ? cleanUrl : cleanUrl + '/bleachDB.json';
        const res = await fetch(endpoint + '?t=' + Date.now());
        if (res.ok) {
          const freshData = await res.json();
          if (freshData && freshData.personagens) {
            currentPersonagens = freshData.personagens;
            if (setDb) setDb(prev => ({ ...prev, ...freshData }));
            try { localStorage.setItem("bleachDB", JSON.stringify(freshData)); } catch(e) {}
          }
        }
      } catch (err) {
        console.warn("Direct cloud fetch failed, checking local data...", err);
      }
    }

    const digitsOnly = termo.replace(/\D/g, "");

    const matchingChars = currentPersonagens.filter((c) => {
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
      p = matchingChars.find((c) => {
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
        </form>
      </Section>
    </div>
  );
}

// ADMIN LOGIN SCREEN & MODAL (CLEAN & SUBTLE)
function AdminLoginScreen({ db, onLoginAdmin }) {
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
      onLoginAdmin("super_admin", { nome: db.superAdminNome || "ADM Máximo (Comandante Supremo)" });
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
            <label className="block text-xs font-bold text-yellow-400 mb-1 uppercase">Usuário de Acesso</label>
            <input
              type="text"
              placeholder="Digite seu usuário..."
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded-xl p-3 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-yellow-400 mb-1 uppercase">Senha de Acesso</label>
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
            Entrar no Painel Administrativo
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

    const superUser = (db.superAdminUsuario || "Malu123").toLowerCase().trim();
    const superPass = (db.superAdminSenha || "Sociedade2026").trim();

    const isUserOk = u === superUser || u === "malu123" || u === "admin";
    const isPassOk = s === superPass || s === "Sociedade2026" || s.toLowerCase() === "sociedade2026";

    if (isUserOk && isPassOk) {
      playReiatsuSound('win');
      onSuccess("super_admin", { nome: db.superAdminNome || "ADM Máximo (Comandante Supremo)" });
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

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-bleach-panel border-2 border-yellow-500/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-bleach-borderSoft pb-2">
          <h3 className="font-title text-xl text-yellow-400">ACESSO DO SEIREITEI</h3>
          <button onClick={onClose} className="text-bleach-muted hover:text-white font-bold">✕</button>
        </div>

        <form onSubmit={submit} className="space-y-3 text-xs">
          <div>
            <label className="block text-bleach-creamDim mb-1 font-bold">Usuário</label>
            <input
              type="text"
              placeholder="Usuário..."
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-bleach-creamDim mb-1 font-bold">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
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
            Autenticar
          </button>
        </form>
      </div>
    </div>
  );
}

// RANKINGS VIEW WITH PHYSICAL, REIATSU AND WEEKLY ACTIVITY / KNOWLEDGE RANKING
function RankingsView({ db, saveDb, session, rankFisico, rankPressao, myCharId }) {
  const [tab, setTab] = useState("fisico");
  const isAdmin = session?.role === "super_admin" || session?.role === "sub_admin";

  const rankAtividade = useMemo(() => {
    const list = [...(db?.personagens || [])];
    return list.sort((a, b) => {
      const diffCenas = (b.cenasSemana || 0) - (a.cenasSemana || 0);
      if (diffCenas !== 0) return diffCenas;
      return (b.conhecimento || 0) - (a.conhecimento || 0);
    });
  }, [db?.personagens]);

  // Cálculo dinâmico do contador de dias do ciclo semanal (7, 6, 5, 4, 3, 2, 1, Dia da Recompensa)
  const cicloInfo = useMemo(() => {
    let baseTime = db?.cicloSemanalInicio ? new Date(db.cicloSemanalInicio).getTime() : 0;
    if (!baseTime || isNaN(baseTime)) {
      baseTime = Date.now();
    }
    const msDecorridos = Math.max(0, Date.now() - baseTime);
    const diasPassados = Math.floor(msDecorridos / (1000 * 60 * 60 * 24));
    const diaNoCiclo = (diasPassados % 7) + 1; // 1 a 7
    const diasRestantes = 7 - (diasPassados % 7); // 7, 6, 5, 4, 3, 2, 1

    return {
      diasPassados,
      diaNoCiclo,
      diasRestantes,
      isDiaRecompensa: diasRestantes === 1 || diasRestantes === 7 && diasPassados > 0
    };
  }, [db?.cicloSemanalInicio]);

  function finalizarCicloSemanal() {
    if (!rankAtividade || rankAtividade.length === 0) {
      alert("Nenhum personagem cadastrado para premiar.");
      return;
    }

    const top1 = rankAtividade[0];
    const top2 = rankAtividade[1];
    const top3 = rankAtividade[2];

    const confirma = confirm(
      `🏆 Deseja finalizar o Ciclo Semanal de Atividade e conceder as recompensas?\n\n` +
      `🥇 1º Lugar (+15 pts livres): ${top1 ? `${top1.nome} (${top1.cenasSemana || 0} cenas)` : 'Nenhum'}\n` +
      `🥈 2º Lugar (+10 pts livres): ${top2 ? `${top2.nome} (${top2.cenasSemana || 0} cenas)` : 'Nenhum'}\n` +
      `🥉 3º Lugar (+5 pts livres): ${top3 ? `${top3.nome} (${top3.cenasSemana || 0} cenas)` : 'Nenhum'}\n\n` +
      `Ao confirmar, os pontos serão creditados e o contador de 7 dias será reiniciado.`
    );
    if (!confirma) return;

    const novosPersonagens = (db.personagens || []).map(p => {
      let bonusPts = 0;
      let posStr = "";

      if (top1 && p.id === top1.id) {
        bonusPts = 15;
        posStr = "1º Lugar no Ranking Semanal de Atividade";
      } else if (top2 && p.id === top2.id) {
        bonusPts = 10;
        posStr = "2º Lugar no Ranking Semanal de Atividade";
      } else if (top3 && p.id === top3.id) {
        bonusPts = 5;
        posStr = "3º Lugar no Ranking Semanal de Atividade";
      }

      return {
        ...p,
        pontosDisponiveis: (p.pontosDisponiveis || 0) + bonusPts,
        cenasSemana: 0, // Reseta o contador para a nova semana
        historico: bonusPts > 0 ? [
          {
            id: uid(),
            data: nowStr(),
            texto: `🏆 PREMIAÇÃO SEMANAL: Conquistou o ${posStr}! (+${bonusPts} Pontos de Atributos Livres creditados)`
          },
          ...(p.historico || [])
        ] : (p.historico || [])
      };
    });

    saveDb({
      ...db,
      personagens: novosPersonagens,
      cicloSemanalInicio: new Date().toISOString()
    });

    playReiatsuSound('win');
    alert(`🎉 Ciclo Semanal finalizado com sucesso!\n\nRecompensas distribuídas para os Top 3 e contador de 7 dias reiniciado.`);
  }

  return (
    <div className="space-y-6">
      <Section
        title="Quadro Geral de Honra & Classificação"
        subtitle="Rankings oficiais de combate e atividade da Sociedade das Almas"
      >
        <div className="flex gap-2 mb-6 border-b border-bleach-borderSoft pb-3 overflow-x-auto">
          <button
            onClick={() => setTab("fisico")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
              tab === "fisico"
                ? "bg-bleach-orange text-black font-extrabold shadow"
                : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"
            }`}
          >
            ⚔️ Ranking Físico Geral (Força, Vel, Res)
          </button>
          <button
            onClick={() => setTab("pressao")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
              tab === "pressao"
                ? "bg-bleach-blue text-black font-extrabold shadow"
                : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim hover:text-white"
            }`}
          >
            🌀 Ranking de Pressão Espiritual (Reiatsu)
          </button>
          <button
            onClick={() => setTab("atividade")}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition whitespace-nowrap ${
              tab === "atividade"
                ? "bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-extrabold shadow-lg"
                : "bg-bleach-panel2 border border-yellow-500/40 text-yellow-300 hover:text-white"
            }`}
          >
            📜 Ranking de Conhecimento (Atividade Semanal)
          </button>
        </div>

        {/* TAB 3: RANKING DE ATIVIDADE & CONHECIMENTO */}
        {tab === "atividade" ? (
          <div className="space-y-5">
            {/* Banner do Ciclo de 7 Dias & Premiações */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/60 via-black/80 to-yellow-950/60 border-2 border-yellow-500/70 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-yellow-500/30 pb-4">
                <div>
                  <span className="px-3 py-0.5 bg-yellow-950 border border-yellow-500 text-yellow-300 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                    Ciclo Semanal de Atividade no WhatsApp • 7 Dias
                  </span>
                  <h4 className="font-title text-2xl sm:text-3xl text-yellow-400 mt-1">
                    CONTADOR DO CICLO DE RECOMPENSAS
                  </h4>
                  <p className="text-xs text-bleach-creamDim mt-0.5">
                    A cada 7 dias de atividade no ON, os 3 Shinigamis com maior produção de cenas são consagrados com pontos de atributos livres!
                  </p>
                </div>

                {/* Contador de Dias */}
                <div className="flex items-center gap-3 bg-black/80 border-2 border-yellow-500 rounded-2xl px-5 py-3 shadow-inner">
                  <span className="text-3xl">⏳</span>
                  <div>
                    <span className="text-[10px] text-bleach-muted uppercase font-bold block">Tempo Restante:</span>
                    <span className="text-xl sm:text-2xl font-title font-black text-yellow-300 tracking-wider">
                      {cicloInfo.diasRestantes === 1 ? "Último Dia!" : `${cicloInfo.diasRestantes} Dias Restantes`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid das Premiações dos 3 Primeiros */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 bg-black/60 rounded-xl border-2 border-yellow-500/70 flex items-center gap-3 shadow-lg">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500 text-black font-title text-xl font-black flex items-center justify-center shadow-[0_0_15px_#E0B34C]">
                    1º
                  </div>
                  <div>
                    <strong className="text-xs text-yellow-300 uppercase block">1º Lugar Geral</strong>
                    <span className="text-sm font-mono font-bold text-white">+15 Pontos Livres</span>
                  </div>
                </div>

                <div className="p-3.5 bg-black/60 rounded-xl border border-slate-400/60 flex items-center gap-3 shadow">
                  <div className="w-10 h-10 rounded-xl bg-slate-300 text-black font-title text-xl font-black flex items-center justify-center">
                    2º
                  </div>
                  <div>
                    <strong className="text-xs text-slate-300 uppercase block">2º Lugar Geral</strong>
                    <span className="text-sm font-mono font-bold text-white">+10 Pontos Livres</span>
                  </div>
                </div>

                <div className="p-3.5 bg-black/60 rounded-xl border border-amber-700/60 flex items-center gap-3 shadow">
                  <div className="w-10 h-10 rounded-xl bg-amber-700 text-white font-title text-xl font-black flex items-center justify-center">
                    3º
                  </div>
                  <div>
                    <strong className="text-xs text-amber-400 uppercase block">3º Lugar Geral</strong>
                    <span className="text-sm font-mono font-bold text-white">+5 Pontos Livres</span>
                  </div>
                </div>
              </div>

              {/* Botão para ADMs encerrarem o ciclo */}
              {isAdmin && (
                <div className="pt-2 border-t border-yellow-500/20 flex justify-end">
                  <button
                    type="button"
                    onClick={finalizarCicloSemanal}
                    className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
                  >
                    🏆 Finalizar Ciclo Semanal & Conceder Recompensas (ADM)
                  </button>
                </div>
              )}
            </div>

            {/* Tabela do Ranking de Atividade */}
            <div className="space-y-3">
              {rankAtividade.map((p, idx) => {
                const isMe = p.id === myCharId;
                const pos = idx + 1;
                const isPodium = pos <= 3;
                const cod = getCodigoAtividade(p);

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition ${
                      isMe
                        ? "bg-yellow-950/40 border-yellow-500 shadow-lg ring-1 ring-yellow-400/40"
                        : isPodium
                        ? "bg-bleach-panel2 border-yellow-500/40"
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
                          {isMe && <span className="text-[10px] bg-yellow-500 text-black px-1.5 py-0.2 rounded font-bold">VOCÊ</span>}
                        </h4>
                        <div className="text-[11px] text-bleach-muted font-mono flex gap-2">
                          <span>Código: <strong className="text-yellow-400">{cod}</strong></span>
                          <span>•</span>
                          <span>Conhecimento: <strong className="text-yellow-300">{p.conhecimento || 0} ₪</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-bleach-muted block uppercase">
                        Cenas na Semana:
                      </span>
                      <span className="font-mono text-lg font-black text-yellow-400">
                        {p.cenasSemana || 0} <span className="text-xs text-bleach-muted font-sans font-normal">cenas</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TAB 1 & 2: RANKINGS FÍSICO E REIATSU */
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
        )}
      </Section>
    </div>
  );
}

// RESTORED FULL INTERACTIVE KIDŌS CATALOG & REIATSU SWORD METER
function KidosView({ personagem, isAdmin }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [modalKido, setModalKido] = useState(null);
  const [kaidoSimEstado, setKaidoSimEstado] = useState("Debilitado");
  const [kaidoExtraReiatsu, setKaidoExtraReiatsu] = useState(0);
  const [kaidoIncantado, setKaidoIncantado] = useState(false);
  
  const pressaoTotal = Number(personagem?.atributos?.pressao || 30);
  const [reiatsuGastaCena, setReiatsuGastaCena] = useState(0);
  const [relatoCena, setRelatoCena] = useState("");
  const [registroConjuracoes, setRegistroConjuracoes] = useState([]);

  const pressaoRestante = Math.max(0, pressaoTotal - reiatsuGastaCena);
  const pctRestante = Math.round((pressaoRestante / Math.max(1, pressaoTotal)) * 100);

  function conjurarKidoDireto(kido, custoGasto, poderCalculado, incantado = false) {
    const custo = custoGasto !== undefined ? custoGasto : calcularCustoKido(kido, pressaoTotal).custoTotal;
    const poder = poderCalculado !== undefined ? poderCalculado : calcularPoderKido(kido, pressaoTotal, custo, incantado);

    if (pressaoRestante < custo) {
      alert(`Reiatsu insuficiente nesta cena! O feitiço requer ${custo} pts, mas você possui apenas ${pressaoRestante} pts disponíveis.`);
      return;
    }
    playReiatsuSound('kido');
    setReiatsuGastaCena(prev => prev + custo);
    setRegistroConjuracoes(prev => [
      { id: uid(), nome: kido.nome, cat: kido.cat, custo, poder, incantado, hora: new Date().toLocaleTimeString("pt-BR") },
      ...prev
    ]);
  }

  function resetarReiatsu() {
    setReiatsuGastaCena(0);
    setRegistroConjuracoes([]);
  }

  const kidosFiltrados = CATALOGO_KIDOS.filter(k => {
    const matchesCat = categoriaAtiva === "Todos" || k.cat === categoriaAtiva;
    const matchesBusca = (k.nome || "").toLowerCase().includes(busca.toLowerCase()) || 
                         (k.desc || "").toLowerCase().includes(busca.toLowerCase()) ||
                         (k.incant || "").toLowerCase().includes(busca.toLowerCase()) ||
                         (k.cat || "").toLowerCase().includes(busca.toLowerCase());
    return matchesCat && matchesBusca;
  });

  return (
    <div className="space-y-6">
      <div className="bg-banner-overlay border border-bleach-border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-bleach-blue/20 border border-bleach-blue text-bleach-blue text-xs font-bold rounded-full uppercase tracking-wider">
            Grimório Completo da Sociedade das Almas • Hadō, Bakudō & Kaidō
          </span>
          <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow">
            COMPÊNDIO SUPREMO DE KIDŌS
          </h2>
          <p className="text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed">
            Explore o compêndio oficial de <strong>Hadō (Destruição)</strong>, <strong>Bakudō (Aprisionamento & Defesa)</strong> e <strong>Kaidō (Cura & Suporte)</strong>. Clique em qualquer Kidō para abrir sua análise tática completa com encantamento poético e simulador de impacto!
          </p>
        </div>
      </div>

      {/* LÂMINA ESPIRITUAL INTERATIVA DE REIATSU */}
      <Section 
        title="⚔️ Lâmina Espiritual da Zanpakutō & Gerenciador de Reiatsu" 
        subtitle="Acompanhe a energia espiritual que percorre sua lâmina conforme você conjura feitiços na cena"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="bg-black/60 border border-bleach-border rounded-2xl p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <div className="text-xs uppercase font-bold tracking-widest text-bleach-orange mb-3 flex items-center gap-1.5">
              <span>🗡️</span> Lâmina da Zanpakutō
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-14 bg-gradient-to-b from-[#111] via-[#222] to-[#111] border-2 border-[#C94E0A] rounded-t-lg relative flex flex-col items-center justify-center shadow-lg">
                <div className="w-full h-1 bg-amber-500/80 my-0.5"></div>
                <div className="w-full h-1 bg-amber-500/80 my-0.5"></div>
                <div className="w-full h-1 bg-amber-500/80 my-0.5"></div>
                <div className="text-[10px] font-black text-amber-400 font-cinzel">卍</div>
              </div>

              <div className="w-20 h-4 bg-gradient-to-r from-[#C94E0A] via-[#FF6A13] to-[#C94E0A] rounded-full border border-black shadow-[0_0_12px_#FF6A13] z-20 -my-0.5 flex items-center justify-center">
                <div className="w-16 h-1 bg-black/60 rounded-full"></div>
              </div>

              <div className="w-12 h-64 border-x-2 border-b-2 border-bleach-blue/70 bg-black/90 relative overflow-hidden flex flex-col justify-end shadow-[0_0_20px_rgba(79,179,232,0.3)]"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 88%, 50% 100%, 0% 88%)' }}
              >
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2 pointer-events-none z-20"></div>

                <div className="absolute inset-0 flex flex-col justify-between py-3 px-1 pointer-events-none z-20 text-[8px] font-mono text-white/50 text-center">
                  <span>100% 卍</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>

                <div 
                  className="w-full transition-all duration-700 relative overflow-hidden flex items-center justify-center"
                  style={{
                    height: `${pctRestante}%`,
                    background: pctRestante > 50 
                      ? 'linear-gradient(180deg, #4FB3E8 0%, #1E4C63 80%, #0A2233 100%)' 
                      : pctRestante > 20 
                      ? 'linear-gradient(180deg, #FF6A13 0%, #C94E0A 80%, #4A1A02 100%)'
                      : 'linear-gradient(180deg, #D6483F 0%, #7A1711 80%, #300502 100%)',
                    boxShadow: '0 0 25px rgba(79, 179, 232, 0.8)'
                  }}
                >
                  <div className="text-white font-title text-2xl font-black drop-shadow z-10">
                    {pctRestante}%
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-bleach-muted">Pressão Disponível na Cena:</div>
              <div className="text-2xl font-mono font-bold text-bleach-orange mt-0.5">
                {pressaoRestante} / {pressaoTotal} <span className="text-xs text-bleach-muted">pts</span>
              </div>
              <button
                onClick={resetarReiatsu}
                className="mt-3 px-4 py-1.5 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange transition"
              >
                🔄 Restaurar Reiatsu da Lâmina
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bleach-orange mb-2">
                ✍️ Rascunho de Narrativa da Cena (WhatsApp)
              </h4>
              <p className="text-xs text-bleach-creamDim mb-2">
                Espaço livre para rascunhar como utilizou seus Kidōs na sua narração antes de enviar no grupo:
              </p>
              <textarea
                rows={4}
                value={relatoCena}
                onChange={(e) => setRelatoCena(e.target.value)}
                placeholder="Ex: Concentrei minha Reiatsu ao longo do fio da Zanpakutō liberando Hadō #4 Byakurai em linha reta..."
                className="w-full bg-black/60 border border-bleach-border rounded-xl p-3 text-xs text-white placeholder-bleach-muted/50 focus:border-bleach-orange outline-none resize-none font-sans"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[11px] text-bleach-muted">
                  {relatoCena.length} caracteres
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(relatoCena);
                    alert("Texto da cena copiado para a área de transferência!");
                  }}
                  className="px-3 py-1 bg-bleach-panel border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-bleach-orange transition"
                >
                  📋 Copiar Rascunho
                </button>
              </div>
            </div>

            <div className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bleach-cream mb-2">
                📜 Feitiços Conjurados Nesta Cena ({registroConjuracoes.length})
              </h4>
              {registroConjuracoes.length === 0 ? (
                <p className="text-xs text-bleach-muted">Nenhum Kidō conjurado na cena atual.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {registroConjuracoes.map((c) => (
                    <div key={c.id} className="p-2 bg-black/50 border border-white/5 rounded-lg text-xs flex justify-between items-center">
                      <span className="font-semibold text-cyan-300">
                        ⚡ {c.nome} {c.incantado ? '(Eishō)' : ''}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="text-bleach-orange">-{c.custo} Reiatsu</span>
                        <span className="text-bleach-muted">|</span>
                        <span className="text-white">Poder: {c.poder}</span>
                        <span className="text-bleach-muted font-mono">{c.hora}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* SEÇÃO DEDICADA: SIMULADOR DE KAIDŌ & REDUÇÃO DE CENAS POR REIATSU */}
      {(() => {
        const pressaoTotalCura = pressaoRestante + kaidoExtraReiatsu;
        const bonusEncanto = Math.round(pressaoTotalCura * 0.30);
        const poderCuraFinal = kaidoIncantado ? (pressaoTotalCura + bonusEncanto) : pressaoTotalCura;

        const analiseKaido = (typeof calcularEfeitoKaido === 'function')
          ? calcularEfeitoKaido(poderCuraFinal, kaidoSimEstado)
          : { categoria: "Tratamento Tático", cor: "#10B981", cenasNecessarias: 1, curaHpStr: "Recuperação de 80%", estadoFinal: "Inteiro", diagnostico: "Estabilizado", dicaTatica: "Manter canalização", roteiroCenas: [] };

        return (
          <Section
            title="🌿 Simulador Médico de Kaidō & Redução de Cenas por Infusão de Reiatsu"
            subtitle="Calcule exatamente quantas cenas no WhatsApp são necessárias para curar um aliado com base na sua Pressão Espiritual"
            className="border-2 border-emerald-500/40"
          >
            <div className="p-4 sm:p-6 bg-gradient-to-b from-emerald-950/30 via-bleach-panel2 to-black rounded-xl border-2 border-emerald-500/50 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                      Hospital Geral do 4º Esquadrão • Cálculo de Cenas
                    </span>
                    <span className="text-xs font-mono text-cyan-400 font-bold">
                      Pressão Investida: {pressaoTotalCura} pts {kaidoIncantado ? `(+${bonusEncanto} Encanto)` : ''} = <strong className="text-emerald-300">{poderCuraFinal} Poder</strong>
                    </span>
                  </div>
                  <h4 className="font-title text-2xl text-emerald-400 mt-1 flex items-center gap-2">
                    <span>💚</span> Simulação de Tratamento & Desintoxicação
                  </h4>
                  <p className="text-xs text-bleach-creamDim">
                    Imbuir mais Reiatsu e recitar o encantamento (+30% PE) reduz drasticamente as cenas exigidas no WhatsApp para curar e purificar toxinas.
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
                        onClick={() => setKaidoSimEstado(est.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                          kaidoSimEstado === est.id
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
                    checked={kaidoIncantado}
                    onChange={(e) => setKaidoIncantado(e.target.checked)}
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
                        onClick={() => setKaidoExtraReiatsu(pe)}
                        className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition border ${
                          kaidoExtraReiatsu === pe
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
                <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-500/40 text-center">
                  <span className="text-[10px] text-bleach-muted uppercase font-bold block">Tempo de Tratamento no ON:</span>
                  <span className="text-2xl font-mono font-black text-emerald-400 block mt-0.5">
                    ⏳ {analiseKaido.cenasNecessarias} {analiseKaido.cenasNecessarias === 1 ? 'Cena' : 'Cenas'}
                  </span>
                  <span className="text-[11px] text-emerald-200/70">
                    {analiseKaido.cenasNecessarias === 1 ? '✨ Cura Acelerada por Reiatsu!' : 'Manutenção contínua de Reiki'}
                  </span>
                </div>

                <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-500/40 text-center">
                  <span className="text-[10px] text-bleach-muted uppercase font-bold block">Evolução do Paciente:</span>
                  <span className="text-base font-extrabold text-white block mt-1">
                    {analiseKaido.estadoInicial || kaidoSimEstado} ➔ <span className="text-emerald-400">{analiseKaido.estadoFinal}</span>
                  </span>
                  <span className="text-[11px] text-yellow-300/80 font-mono">{analiseKaido.curaHpStr}</span>
                </div>

                <div className="p-3.5 bg-black/70 rounded-xl border border-emerald-500/40 text-center">
                  <span className="text-[10px] text-bleach-muted uppercase font-bold block">Classificação Médica:</span>
                  <span className="text-sm font-extrabold text-emerald-300 block mt-1">
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

              {/* Recomendação de Roleplay */}
              <div className="p-3 bg-bleach-panel rounded-xl border border-white/10 text-xs">
                <strong className="text-emerald-400 block text-[10px] uppercase font-bold">🌿 Diagnóstico do 4º Esquadrão:</strong>
                <p className="text-bleach-cream mt-0.5 leading-relaxed">{analiseKaido.dicaTatica}</p>
              </div>
            </div>
          </Section>
        );
      })()}

      {/* CATALOG FILTERS & SPELLS GRID */}
      <Section title="Grimório de Feitiços de Seireitei" subtitle="Clique em qualquer magia para abrir os detalhes completos, encantamento e simulador">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar feitiço por nome, número, encantamento ou efeito..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-bleach-orange"
          />
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  categoriaAtiva === cat ? "bg-bleach-orange text-black font-extrabold" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kidosFiltrados.map((k) => {
            const isHado = k.cat === "Hadō";
            const isBakudo = k.cat === "Bakudō";
            const custo = calcularCustoKido(k, pressaoTotal);

            return (
              <div 
                key={k.id}
                onClick={() => setModalKido(k)}
                className={`bg-bleach-panel2 border rounded-xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                  isHado 
                    ? "border-red-500/40 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]" 
                    : isBakudo 
                    ? "border-blue-500/40 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" 
                    : "border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                }`}
              >
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-start gap-2">
                    <span 
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                        isHado ? "bg-red-950 text-red-300 border-red-500" 
                        : isBakudo ? "bg-blue-950 text-cyan-300 border-cyan-500" 
                        : "bg-emerald-950 text-emerald-300 border-emerald-500"
                      }`}
                    >
                      {k.cat} #{k.numero}
                    </span>

                    <span className="text-[11px] font-mono text-bleach-muted">
                      Custo: <strong className="text-bleach-orange font-bold">{custo.custoTotal} pts</strong>
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-base leading-snug">
                    {k.nome}
                  </h4>

                  {k.incant && k.incant !== "—" && (
                    <div className="p-2.5 bg-black/60 rounded-lg border border-white/5 text-[11px] text-cyan-200/80 italic leading-relaxed">
                      "{k.incant}"
                    </div>
                  )}

                  <p className="text-xs text-bleach-creamDim leading-relaxed line-clamp-3">
                    {k.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalKido(k);
                    }}
                    className="w-full py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs font-bold text-bleach-creamDim hover:text-white hover:border-bleach-orange transition flex items-center justify-center gap-1.5"
                  >
                    <span>👁️</span> Abrir Detalhes & Simulador
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      conjurarKidoDireto(k);
                    }}
                    disabled={pressaoRestante < custo.custoTotal}
                    className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed ${
                      isHado ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110" 
                      : isBakudo ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110" 
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"
                    }`}
                  >
                    ⚡ Conjurar Rápido ({custo.custoTotal} pts)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* KIDO DETAIL MODAL */}
      {modalKido && (
        <KidoDetailModal
          kido={modalKido}
          personagem={personagem}
          isOpen={!!modalKido}
          onClose={() => setModalKido(null)}
          pressaoRestante={pressaoRestante}
          onConjurar={(kido, custoGasto, poder, incantado) => {
            conjurarKidoDireto(kido, custoGasto, poder, incantado);
          }}
        />
      )}
    </div>
  );
}

// ARENA VIEW (WITH TURN LOG TIMELINE & DUEL RESET)
function ArenaView({ db, saveDb, session, myChar }) {
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
    setDadoRolado({ res, cat });
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
        return { ...d, turnos: [novoTurno, ...(d.turnos || [])] };
      }
      return d;
    });

    saveDb({ ...db, combatesArena: novosDuelos });
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

    saveDb({ ...db, combatesArena: novosDuelos });
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
    saveDb({ ...db, combatesArena: novosDuelos });
  }

  return (
    <div className="space-y-6">
      <Section
        title="⚔️ Arena Oficial de Duelos & Linha do Tempo"
        subtitle="Espaço de combate com julgamento narrativo por turnos, regra do 1d6 e registro contínuo"
        right={
          <button
            onClick={resetarDuelo}
            className="px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 border border-red-500 text-red-200 text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
          >
            <span>🔄</span> Resetar Duelo
          </button>
        }
      >
        {p1 && p2 ? (
          <div className="space-y-6">
            {/* Fighter Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-bleach-panel2 border-2 border-red-500/50 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <img src={p1.foto || 'assets/ichigo-orange.png'} className="w-16 h-16 rounded-xl object-cover border border-red-500" />
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase">Combatente 1</span>
                    <h4 className="font-title text-2xl text-white">{p1.nome}</h4>
                    <div className="text-xs text-bleach-muted font-mono flex gap-2 mt-1">
                      <span>FOR: {p1.atributos?.forca}</span>
                      <span>VEL: {p1.atributos?.velocidade}</span>
                      <span>RES: {p1.atributos?.resiliencia}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] text-bleach-muted block uppercase">Estado Atual</span>
                  <select
                    value={duelo.estadoP1 || "Inteiro"}
                    onChange={(e) => alterarEstadoCombatente(1, e.target.value)}
                    className="bg-black border border-red-500/60 rounded-lg p-1.5 text-xs text-white font-bold"
                  >
                    {ESTADOS.map(st => <option key={st.key} value={st.key}>{st.key}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-5 bg-bleach-panel2 border-2 border-blue-500/50 rounded-2xl flex items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <img src={p2.foto || 'assets/ichigo-moon.png'} className="w-16 h-16 rounded-xl object-cover border border-blue-500" />
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">Combatente 2</span>
                    <h4 className="font-title text-2xl text-white">{p2.nome}</h4>
                    <div className="text-xs text-bleach-muted font-mono flex gap-2 mt-1">
                      <span>FOR: {p2.atributos?.forca}</span>
                      <span>VEL: {p2.atributos?.velocidade}</span>
                      <span>RES: {p2.atributos?.resiliencia}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-[10px] text-bleach-muted block uppercase">Estado Atual</span>
                  <select
                    value={duelo.estadoP2 || "Inteiro"}
                    onChange={(e) => alterarEstadoCombatente(2, e.target.value)}
                    className="bg-black border border-cyan-500/60 rounded-lg p-1.5 text-xs text-white font-bold"
                  >
                    {ESTADOS.map(st => <option key={st.key} value={st.key}>{st.key}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Registrar Novo Turno Form */}
            <form onSubmit={registrarTurno} className="p-4 bg-black/60 border border-bleach-border rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h4 className="text-xs font-bold text-bleach-orange uppercase flex items-center gap-2">
                  <span>✍️</span> Registrar Novo Turno de Combate
                </h4>
                <button
                  type="button"
                  onClick={rolarDadoDuelo}
                  className="px-3 py-1 bg-bleach-panel border border-bleach-border hover:border-yellow-400 text-yellow-300 text-xs font-bold rounded-lg transition"
                >
                  🎲 Rolar 1d6 (Regra Oficial)
                </button>
              </div>

              {dadoRolado && (
                <div className="p-2.5 bg-yellow-950/60 border border-yellow-500/50 rounded-xl flex items-center justify-between text-xs">
                  <span className="text-yellow-200">Resultado do Dado: <strong>1d6 = {dadoRolado.res}</strong></span>
                  <span className="font-bold text-yellow-300 uppercase">{dadoRolado.cat}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-bleach-muted font-bold mb-1">Ação de {p1.nome}</label>
                  <input
                    type="text"
                    placeholder="Ex: Avançou com Shunpo e desferiu corte vertical..."
                    value={acaoP1}
                    onChange={(e) => setAcaoP1(e.target.value)}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-bleach-muted font-bold mb-1">Ação de {p2.nome}</label>
                  <input
                    type="text"
                    placeholder="Ex: Ergueu Bakudō #39 e contra-atacou com Hadō..."
                    value={acaoP2}
                    onChange={(e) => setAcaoP2(e.target.value)}
                    className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-bleach-creamDim font-bold mb-1 text-xs uppercase">Decisão do Juiz / Consequência Narrativa *</label>
                <input
                  type="text"
                  placeholder="Ex: O corte rompeu a barreira mas causou apenas dano superficial; ambos recuam..."
                  value={vereditoJuiz}
                  onChange={(e) => setVereditoJuiz(e.target.value)}
                  className="w-full bg-bleach-panel2 border border-bleach-border rounded-lg p-2.5 text-xs text-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-bleach-orange to-red-600 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow"
                >
                  ✓ Gravar Turno na Linha do Tempo
                </button>
              </div>
            </form>

            {/* Turn Timeline Log */}
            <div className="space-y-3">
              <h4 className="font-title text-lg text-bleach-cream flex items-center gap-2">
                <span>📜</span> REGISTRO CRONOLÓGICO DOS TURNOS ({(duelo.turnos || []).length})
              </h4>

              {(duelo.turnos || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-bleach-muted bg-black/40 rounded-xl border border-white/5">
                  Nenhum turno registrado neste combate ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  {(duelo.turnos || []).map((t) => (
                    <div key={t.id} className="p-4 bg-bleach-panel2 border border-bleach-border rounded-xl space-y-2">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1 text-xs">
                        <span className="font-title text-bleach-orange text-base">TURNO #{t.numero}</span>
                        <span className="text-bleach-muted font-mono text-[11px]">{t.data} — Juiz: {t.autor}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-bleach-creamDim">
                        <div className="p-2 bg-black/40 rounded-lg">
                          <strong className="text-red-400 block">{p1.nome}:</strong>
                          <p>{t.acaoP1}</p>
                        </div>
                        <div className="p-2 bg-black/40 rounded-lg">
                          <strong className="text-cyan-400 block">{p2.nome}:</strong>
                          <p>{t.acaoP2}</p>
                        </div>
                      </div>

                      <div className="p-2.5 bg-black/70 border border-yellow-500/30 rounded-lg text-xs space-y-1">
                        <span className="font-bold text-yellow-300 block uppercase text-[10px]">Consequência do Turno:</span>
                        <p className="text-white">{t.veredito}</p>
                        {t.dado && <span className="text-[10px] text-yellow-400 font-mono block">🎲 {t.dado}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-bleach-muted">Nenhum combatente selecionado.</p>
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
