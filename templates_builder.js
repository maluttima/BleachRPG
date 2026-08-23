// =========================================================================
// MODAL COMPONENTS: GACHA CHEST, AWAKENING SCENE & 4 SPIRITUAL PATHS (WITH CHATGPT & DYNAMIC SOUL AI)
// =========================================================================

// 1. GACHA CHEST OPENING MODAL (COM MECÂNICA DE SUSPENSE ~7S)
function SpiritualChestModal({ modal, onClose, onColetar }) {
  if (!modal || !modal.open) return null;

  const isSuspense = !!modal.isSuspense;
  const progress = modal.progress || 0;
  const isRevealed = progress >= 100 && modal.resultado;
  const isEspecial = modal.tipo === "especial";

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-lg bg-bleach-panel border-2 rounded-2xl p-6 shadow-2xl text-center overflow-hidden transition-all duration-300 ${
        isEspecial ? "border-purple-500/80 purple-reiatsu-glow" : "border-bleach-orange/80 reiatsu-glow"
      } ${isSuspense && !isRevealed ? "reiatsu-screen-shake" : ""}`}>
        
        {/* Heat haze & ambient aura */}
        <div className="heat-haze-overlay"></div>

        {/* Dynamic Header */}
        <div className="relative z-10 mb-4">
          <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border tracking-widest ${
            isEspecial 
              ? "bg-purple-950/80 border-purple-400 text-purple-300" 
              : "bg-orange-950/80 border-bleach-orange text-bleach-orange"
          }`}>
            {isEspecial ? "🌟 Baú de Reishi Especial de Seireitei" : "🎲 Caixa Espiritual de Recompensa"}
          </span>
          <h3 className="font-title text-2xl sm:text-3xl text-white tracking-wider mt-2">
            {isRevealed 
              ? (isEspecial ? "CONQUISTA TRANSCENDENTAL REVELADA!" : "RECOMPENSA LIBERADA!") 
              : (isSuspense ? "⚡ ALERTA: TENSÃO ESPIRITUAL EXTREMA!" : "CANALIZANDO REIRYOKU...")}
          </h3>
        </div>

        {/* Central Visual: The Spiritual Chest */}
        {!isRevealed ? (
          <div className="relative z-10 py-6 flex flex-col items-center justify-center min-h-[220px]">
            {/* Spinning Concentric Magic Runes */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className={`absolute inset-0 rounded-full border-2 border-dashed ${
                isEspecial ? "border-purple-400/40" : "border-bleach-orange/40"
              } spin-runes`}></div>
              <div className={`absolute inset-3 rounded-full border border-dotted ${
                isSuspense ? "border-red-400/60" : isEspecial ? "border-cyan-400/40" : "border-amber-400/40"
              } spin-runes-fast`}></div>

              {/* The Mystic 3D Chest / Orb */}
              <div className={`relative w-28 h-28 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
                isEspecial 
                  ? "bg-gradient-to-br from-purple-900 via-indigo-950 to-black border-2 border-purple-400 shadow-[0_0_40px_rgba(139,111,214,0.6)]" 
                  : "bg-gradient-to-br from-orange-900 via-stone-950 to-black border-2 border-bleach-orange shadow-[0_0_40px_rgba(255,106,19,0.5)]"
              } ${isSuspense ? "scale-110 rotate-1 animate-pulse" : "scale-100"}`}>
                
                <div className="text-5xl select-none filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-bounce">
                  {isEspecial ? "💎" : "📦"}
                </div>

                {/* Energy Rings */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping opacity-30"></div>
              </div>
            </div>

            {/* Suspense Warning Callout */}
            {isSuspense && (
              <div className="mt-4 px-4 py-2 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs font-bold animate-pulse shadow-lg">
                ⚠️ O selo de contenção está em alta turbulência! A revelação está sendo forjada no limite da alma...
              </div>
            )}

            {/* Progress Bar & Stage Description */}
            <div className="w-full mt-5 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-bleach-creamDim">{modal.stageText || "Ressonando frequência espiritual..."}</span>
                <span className={`font-bold ${isEspecial ? "text-purple-300" : "text-bleach-orange"}`}>{progress}%</span>
              </div>
              <div className="w-full bg-black/70 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-100 ${
                    isEspecial 
                      ? "bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-300 shadow-[0_0_15px_#8B6FD6]" 
                      : "bg-gradient-to-r from-orange-600 via-bleach-orange to-yellow-400 shadow-[0_0_15px_#FF6A13]"
                  }`}
                  style={{ width: `${Math.min(100, progress)}%` }}
                ></div>
              </div>
            </div>

            {/* Skip Animation Button */}
            <div className="mt-4">
              <button
                onClick={modal.onSkip}
                className="px-4 py-1.5 rounded-lg bg-black/60 border border-white/10 hover:border-white/40 text-bleach-creamDim hover:text-white text-xs font-mono transition"
              >
                ⚡ Pular Animação (Revelar Já)
              </button>
            </div>
          </div>
        ) : (
          /* Revealed Stage */
          <div className="relative z-10 py-4 space-y-4 card-pop-reveal">
            <div className="p-6 rounded-2xl bg-black/80 border border-white/10 space-y-3">
              <span 
                className="text-xs font-black uppercase px-3 py-1 rounded-full border inline-block tracking-widest"
                style={{ color: modal.resultado.cor, borderColor: modal.resultado.cor, backgroundColor: `${modal.resultado.cor}20` }}
              >
                {modal.resultado.raridade || modal.resultado.nome}
              </span>

              <h2 className="font-title text-3xl sm:text-4xl text-white tracking-wider">
                {modal.resultado.nome}
              </h2>

              <p className="text-xs sm:text-sm text-bleach-creamDim leading-relaxed max-w-md mx-auto">
                {modal.resultado.desc}
              </p>

              {modal.resultado.tipo === "pontos" && modal.resultado.valorGanho && (
                <div className="p-3 bg-gradient-to-r from-orange-950/60 to-black rounded-xl border border-bleach-orange/40 text-sm font-mono text-bleach-orange font-bold">
                  +{modal.resultado.valorGanho} Pontos adicionados aos seus Pontos Livres!
                </div>
              )}
            </div>

            <button
              onClick={() => onColetar(modal.resultado)}
              className="w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
            >
              ✓ Resgatar Recompensa & Salvar na Ficha
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// 2. AWAKENING SCENE SUBMISSION MODAL
function CenaDespertarModal({ tipo, onClose, onSubmit }) {
  const [texto, setTexto] = useState("");
  const isBankai = tipo === "bankai";

  function handleSubmeter(e) {
    e.preventDefault();
    if (!texto.trim()) {
      alert("Por favor, descreva a cena ou momento em que seu personagem despertou sua lâmina!");
      return;
    }
    onSubmit(texto.trim());
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-2xl bg-bleach-panel border-2 rounded-2xl p-6 shadow-2xl text-left ${
        isBankai ? "border-yellow-500/80" : "border-bleach-orange/80"
      }`}>
        <div className="flex items-center justify-between border-b border-bleach-borderSoft pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-bleach-orange">
              {isBankai ? "卍 RITUAL DA LIBERAÇÃO FINAL" : "始解 RITUAL DE DESPERTAR DA SHIKAI"}
            </span>
            <h3 className="font-title text-2xl text-white tracking-wider mt-0.5">
              {isBankai ? "CENA DE DESPERTAR DA BANKAI" : "CENA DE DESPERTAR DA SHIKAI"}
            </h3>
          </div>
          <button onClick={onClose} className="text-bleach-muted hover:text-white font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmeter} className="space-y-4">
          <p className="text-xs text-bleach-creamDim leading-relaxed">
            Descreva como foi o momento em que você ouviu a voz do seu espírito pela primeira vez ou como a lâmina se manifestou na sua história (ou cole sua cena de treino/arco):
          </p>

          <textarea
            rows={6}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ex: Em meio à tempestade de Karakura, quando as lâminas se cruzaram e o silêncio tomou conta da minha mente, escutei uma voz grave ecoando em meu mundo interior..."
            className="w-full bg-black/80 border border-bleach-border focus:border-bleach-orange rounded-xl p-4 text-xs text-white placeholder-bleach-muted focus:outline-none leading-relaxed resize-none"
          />

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-bleach-muted font-mono">{texto.length} caracteres</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-bleach-panel2 border border-bleach-border text-xs text-bleach-cream rounded-lg hover:border-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow hover:brightness-110 transition"
              >
                ✨ Analisar Alma & Gerar 4 Caminhos com IA ➔
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. 4 SPIRITUAL PATHS SELECTION MODAL (COM IA / CHATGPT & PERSONALIZAÇÃO COMPLETA)
function Zanpakuto4PathsModal({ open, caminhos, personagem, isBankai, onClose, onEscolherCaminho, onRegenerar }) {
  if (!open || !caminhos || caminhos.length === 0) return null;

  const [caminhoAtivoIdx, setCaminhoAtivoIdx] = useState(0);
  const [ritualState, setRitualState] = useState("selection"); // "selection" | "charging" | "revealed"
  const [caminhoSelecionado, setCaminhoSelecionado] = useState(caminhos[0]);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargeStageText, setChargeStageText] = useState("Canalizando Reiryoku no Mundo Interior...");
  const [showConfigApiKey, setShowConfigApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(localStorage.getItem("bleach_openai_key") || "");
  const [salvoKey, setSalvoKey] = useState(false);
  const chargeIntervalRef = useRef(null);

  useEffect(() => {
    if (caminhos && caminhos.length > 0) {
      setCaminhoSelecionado(caminhos[caminhoAtivoIdx] || caminhos[0]);
    }
  }, [caminhos, caminhoAtivoIdx]);

  useEffect(() => {
    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, []);

  function salvarApiKey(e) {
    e.preventDefault();
    localStorage.setItem("bleach_openai_key", apiKeyInput.trim());
    setSalvoKey(true);
    setTimeout(() => setSalvoKey(false), 3000);
  }

  function iniciarRitual(caminho) {
    setCaminhoSelecionado(caminho);
    setRitualState("charging");
    setChargeProgress(0);
    playReiatsuSound(isBankai ? 'bankai_charge' : 'shikai_charge');

    let p = 0;
    chargeIntervalRef.current = setInterval(() => {
      p += 2;
      setChargeProgress(p);

      if (p === 24) {
        setChargeStageText("A barreira do mundo interior está se desfazendo...");
        playReiatsuSound(isBankai ? 'bankai_charge' : 'shikai_charge');
      } else if (p === 54) {
        setChargeStageText("O espírito da Zanpakutō sussurra seu verdadeiro nome...");
        playReiatsuSound(isBankai ? 'bankai_charge' : 'shikai_charge');
      } else if (p === 84) {
        setChargeStageText("Pressão Espiritual crítica! O selo milenar foi destruído!");
        playReiatsuSound('shatter');
      } else if (p >= 100) {
        clearInterval(chargeIntervalRef.current);
        chargeIntervalRef.current = null;
        setRitualState("revealed");
        playReiatsuSound(isBankai ? 'bankai_reveal' : 'shikai_reveal');
      }
    }, 45);
  }

  function pularCarregamento() {
    if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    chargeIntervalRef.current = null;
    setChargeProgress(100);
    setRitualState("revealed");
    playReiatsuSound(isBankai ? 'bankai_reveal' : 'shikai_reveal');
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className={`relative w-full max-w-5xl bg-bleach-panel border-2 rounded-2xl p-4 sm:p-6 shadow-2xl text-left transition-all ${
        isBankai ? "border-yellow-500/80 bankai-supreme-card" : "border-bleach-orange/80 reiatsu-glow"
      } my-auto`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bleach-borderSoft pb-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                isBankai ? "bg-amber-950 border-yellow-400 text-yellow-300" : "bg-orange-950 border-bleach-orange text-bleach-orange"
              }`}>
                ✨ ZGE V5.0 • IA DE GÊNESE ESPIRITUAL
              </span>
              <span className="text-xs text-bleach-muted">Alma: <strong className="text-white">{personagem.nome}</strong></span>
              <span className="text-[10px] bg-green-950 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full">
                ✓ Personalidade Analisada
              </span>
            </div>
            <h2 className="font-title text-2xl sm:text-3xl text-white tracking-wider mt-1">
              {isBankai ? "卍 ESCOLHA DO CAMINHO DE BANKAI" : "始解 4 MANIFESTAÇÕES ÚNICAS DA ALMA (SHIKAI)"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigApiKey(!showConfigApiKey)}
              className="px-3 py-1.5 bg-black/60 border border-white/10 hover:border-yellow-400 text-yellow-300 rounded-lg text-xs font-mono transition"
              title="Configurar Chave ChatGPT (OpenAI)"
            >
              ⚙️ ChatGPT API
            </button>
            {onRegenerar && (
              <button
                onClick={onRegenerar}
                className="px-3 py-1.5 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-bleach-orange rounded-lg text-xs font-bold transition"
                title="Gerar 4 novas variações com a IA"
              >
                🔄 Novas Variações
              </button>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-bleach-panel2 border border-bleach-border hover:border-white text-bleach-creamDim hover:text-white rounded-lg text-xs font-bold"
            >
              ✕ Fechar
            </button>
          </div>
        </div>

        {/* API Key Modal / Form Bar */}
        {showConfigApiKey && (
          <form onSubmit={salvarApiKey} className="p-3.5 bg-black/80 border border-yellow-500/40 rounded-xl mb-4 flex flex-wrap gap-2 items-center text-xs">
            <span className="text-yellow-300 font-bold">Chave OpenAI (ChatGPT):</span>
            <input
              type="password"
              placeholder="sk-proj-... (Opcional - caso queira usar sua cota do ChatGPT)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="flex-1 min-w-[200px] bg-bleach-panel2 border border-bleach-border rounded p-2 text-white font-mono"
            />
            <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded shadow">
              Salvar Chave
            </button>
            {salvoKey && <span className="text-green-400 font-bold">✓ Salvo!</span>}
          </form>
        )}

        {/* 4 Path Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {caminhos.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (ritualState === "selection") setCaminhoAtivoIdx(idx);
              }}
              disabled={ritualState !== "selection"}
              className={`p-3 rounded-xl border text-left transition ${
                caminhoAtivoIdx === idx
                  ? isBankai
                    ? "bg-yellow-950/80 border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                    : "bg-orange-950/80 border-bleach-orange shadow-[0_0_15px_rgba(255,106,19,0.4)]"
                  : "bg-bleach-panel2 border-bleach-borderSoft opacity-70 hover:opacity-100"
              }`}
            >
              <span className="text-[10px] font-extrabold uppercase block text-bleach-muted">
                Caminho {idx + 1}
              </span>
              <h4 className="font-title text-base sm:text-lg text-white truncate">
                {c.shikai.nome}
              </h4>
              <p className="text-[10px] text-bleach-creamDim truncate">
                {c.tipoCaminho.replace(/Opção \d+ — /, '')}
              </p>
            </button>
          ))}
        </div>

        {/* Path Details & Ritual Stages */}
        {ritualState === "selection" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Shikai Detailed Card (7 cols) */}
              <div className="lg:col-span-7 bg-black/60 border border-bleach-border rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-bleach-orange">
                      {caminhoSelecionado.tipoCaminho}
                    </span>
                    <h3 className="font-title text-2xl sm:text-3xl text-white tracking-wider flex items-center gap-2">
                      <span>{caminhoSelecionado.shikai.nome}</span>
                      <span className="text-sm font-cinzel text-bleach-orange font-normal">{caminhoSelecionado.shikai.kanji}</span>
                      <span className="text-xs text-bleach-creamDim font-sans">({caminhoSelecionado.shikai.traducao})</span>
                    </h3>
                    <p className="text-xs text-bleach-creamDim italic mt-0.5">
                      "{caminhoSelecionado.shikai.comando}"
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {caminhoSelecionado.indiceExclusividade && (
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-950/80 border border-green-500 text-green-300 tracking-wider">
                        ✦ {caminhoSelecionado.indiceExclusividade}% Exclusiva no RPG
                      </span>
                    )}
                    <Badge color={C.blue}>
                      {caminhoSelecionado.shikai.elemento}
                    </Badge>
                  </div>
                </div>

                {/* Shikai Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-bleach-panel2/80 rounded-lg border border-white/5 space-y-1">
                    <strong className="text-bleach-orange block text-[11px]">⚔️ Manifestação da Arma:</strong>
                    <p className="text-bleach-creamDim text-[11px] leading-relaxed">{caminhoSelecionado.shikai.aparencia}</p>
                  </div>
                  <div className="p-3 bg-bleach-panel2/80 rounded-lg border border-white/5 space-y-1">
                    <strong className="text-cyan-400 block text-[11px]">🧠 Relação com a Alma:</strong>
                    <p className="text-bleach-creamDim text-[11px] leading-relaxed">{caminhoSelecionado.shikai.relacaoPersonalidade}</p>
                  </div>
                </div>

                {/* Power & Mechanics */}
                <div className="p-3.5 bg-black/80 rounded-lg border border-bleach-orange/30 space-y-2">
                  <strong className="text-bleach-orange block text-xs uppercase tracking-wider">
                    ⚡ Poder & Mecânica Espiritual:
                  </strong>
                  <p className="text-xs text-bleach-cream leading-relaxed font-sans">
                    {caminhoSelecionado.shikai.poder}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-bleach-muted pt-1 border-t border-white/5">
                    <span>Custo: <strong className="text-white">{caminhoSelecionado.shikai.custoReiatsu}</strong></span>
                    <span>Limitações: <strong className="text-amber-300">{caminhoSelecionado.shikai.limitacoes}</strong></span>
                  </div>
                </div>

                {/* Complexity Indices (1-10) */}
                {caminhoSelecionado.shikai.indices && (
                  <div className="p-3 bg-black/50 rounded-lg border border-white/10 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-bleach-muted block">
                      Índice de Complexidade & Balanço Espiritual (1 a 10)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
                      {[
                        { label: "Potência", val: caminhoSelecionado.shikai.indices.potencia, color: C.red },
                        { label: "Abrangência", val: caminhoSelecionado.shikai.indices.abrangencia, color: C.blue },
                        { label: "Complexidade", val: caminhoSelecionado.shikai.indices.complexidade, color: C.purple },
                        { label: "Versatilidade", val: caminhoSelecionado.shikai.indices.versatilidade, color: C.green },
                        { label: "Custo", val: caminhoSelecionado.shikai.indices.custo, color: C.yellow },
                      ].map(stat => (
                        <div key={stat.label} className="p-1.5 bg-bleach-panel2 rounded border border-white/5 text-center">
                          <span className="text-bleach-muted block">{stat.label}</span>
                          <span className="font-mono font-bold text-xs" style={{ color: stat.color }}>{stat.val}/10</span>
                          <div className="w-full bg-black/60 h-1 rounded-full overflow-hidden mt-1">
                            <div className="h-full rounded-full" style={{ width: `${stat.val * 10}%`, backgroundColor: stat.color }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Corresponding Bankai Preview (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-yellow-950/30 via-bleach-panel2 to-black border-2 border-yellow-500/40 rounded-xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-yellow-500/30 pb-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-500">
                        BANKAI CORRESPONDENTE
                      </span>
                      <h4 className="font-title text-xl text-yellow-300 tracking-wider mt-1">
                        {caminhoSelecionado.bankai.nome}
                      </h4>
                    </div>
                    <span className="text-xs text-yellow-400/80 font-mono">
                      {caminhoSelecionado.bankai.tipoEvolucao}
                    </span>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-yellow-500/20 text-xs space-y-1.5">
                    <strong className="text-yellow-400 block text-[11px]">👑 Domínio & Evolução:</strong>
                    <p className="text-bleach-creamDim text-[11px] leading-relaxed">
                      {caminhoSelecionado.bankai.formaMonumental}
                    </p>
                  </div>

                  <div className="p-3 bg-black/60 rounded-lg border border-yellow-500/20 text-xs space-y-1.5">
                    <strong className="text-yellow-400 block text-[11px]">⚡ Poder Transcendental da Bankai:</strong>
                    <p className="text-bleach-cream text-[11px] leading-relaxed">
                      {caminhoSelecionado.bankai.poder}
                    </p>
                  </div>

                  <div className="p-2.5 bg-black/40 rounded-lg border border-white/5 text-[11px] text-bleach-muted">
                    <span>Significado Espiritual: <em className="text-yellow-200">"{caminhoSelecionado.bankai.significadoEspiritual}"</em></span>
                  </div>
                </div>

                {/* Exclusivity & Selection Button */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="text-[10px] text-bleach-muted flex items-center justify-between">
                    <span>🔒 Regra de Exclusividade:</span>
                    <strong className="text-green-400">Assinatura Única Registrada</strong>
                  </div>

                  <button
                    onClick={() => iniciarRitual(caminhoSelecionado)}
                    className="w-full py-3 bg-gradient-to-r from-bleach-orange via-bleach-orangeDeep to-red-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
                  >
                    🗡️ Despertar & Selar Este Caminho Espiritual
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Ritual Charging Screen */}
        {ritualState === "charging" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-bleach-orange spin-runes"></div>
              <div className="absolute inset-2 rounded-full border border-dotted border-yellow-400 spin-runes-fast"></div>
              <div className="text-5xl animate-bounce">🗡️</div>
            </div>

            <div className="max-w-md w-full space-y-3">
              <h3 className="font-title text-2xl text-white tracking-wider">
                FORJANDO ASSINATURA DA ALMA...
              </h3>
              <p className="text-xs text-bleach-orange font-mono animate-pulse">
                {chargeStageText}
              </p>

              <div className="w-full bg-black/80 h-3 rounded-full overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-bleach-orange to-yellow-400 transition-all duration-100"
                  style={{ width: `${chargeProgress}%` }}
                ></div>
              </div>

              <div className="pt-2">
                <button
                  onClick={pularCarregamento}
                  className="px-4 py-1.5 rounded-lg bg-black border border-white/20 text-xs text-bleach-creamDim hover:text-white"
                >
                  ⚡ Pular Ritual
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ritual Complete / Revealed Screen */}
        {ritualState === "revealed" && (
          <div className="py-8 text-center space-y-6 card-pop-reveal">
            <div className="text-5xl animate-pulse">✨</div>
            
            <div className="max-w-lg mx-auto p-6 rounded-2xl bg-black/90 border-2 border-bleach-orange shadow-2xl space-y-4">
              <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-orange-950 border border-bleach-orange text-bleach-orange">
                VINCULAÇÃO ESPIRITUAL CONFIRMADA
              </span>
              
              <h3 className="font-title text-3xl text-white tracking-wider">
                {caminhoSelecionado.shikai.nome}
              </h3>
              
              <p className="text-xs text-bleach-orange italic">
                "{caminhoSelecionado.shikai.comando}"
              </p>

              <p className="text-xs text-bleach-creamDim leading-relaxed">
                Esta manifestação espiritual foi vinculada permanentemente ao personagem <strong>{personagem.nome}</strong>. Sua assinatura espiritual foi gravada com exclusividade e nenhuma outra alma poderá possuir a mesma lâmina.
              </p>

              <button
                onClick={() => onEscolherCaminho(caminhoSelecionado)}
                className="w-full py-3 bg-gradient-to-r from-bleach-orange to-bleach-orangeDeep text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
              >
                ✓ Entrar na Sociedade das Almas com sua Zanpakutō
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
