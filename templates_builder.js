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

function CenaDespertarModal({ tipo, modalTipo, onClose, onSubmit, onSubmitScene }) {
  const [texto, setTexto] = useState("");
  const tipoFinal = tipo || modalTipo || "shikai";
  const isBankai = tipoFinal === "bankai";

  function handleSubmeter(e) {
    e.preventDefault();
    if (!texto.trim()) {
      alert("Por favor, descreva a cena ou momento em que seu personagem despertou sua lâmina!");
      return;
    }
    const handler = onSubmit || onSubmitScene;
    if (handler) handler(texto.trim());
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

const AwakeningSceneModal = CenaDespertarModal;
if (typeof window !== 'undefined') {
  window.CenaDespertarModal = CenaDespertarModal;
  window.AwakeningSceneModal = CenaDespertarModal;
}

// 3. 4 SPIRITUAL PATHS / 3 BANKAI EVOLUTIONS SELECTION MODAL (COM IA & ANIMAÇÃO CINEMATOGRÁFICA)
function Zanpakuto4PathsModal({ open, caminhos = [], personagem, isBankai, loading, onClose, onEscolherCaminho }) {
  if (!open) return null;

  const listaCaminhos = Array.isArray(caminhos) ? caminhos : [];
  const isBankaiFinal = isBankai || !!listaCaminhos[0]?.isBankaiEvolucao;
  const [caminhoAtivoIdx, setCaminhoAtivoIdx] = useState(0);
  const [ritualState, setRitualState] = useState(loading || listaCaminhos.length === 0 ? "charging" : "selection");
  const [caminhoSelecionado, setCaminhoSelecionado] = useState(listaCaminhos[0] || null);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [chargeStageText, setChargeStageText] = useState("Sintonizando Pressão Espiritual com o Mundo Interior...");
  const [showConfigApiKey, setShowConfigApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(typeof localStorage !== 'undefined' ? localStorage.getItem("bleach_openai_key") || "" : "");
  const [salvoKey, setSalvoKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const chargeIntervalRef = useRef(null);

  useEffect(() => {
    if (listaCaminhos && listaCaminhos.length > 0) {
      setCaminhoSelecionado(listaCaminhos[caminhoAtivoIdx] || listaCaminhos[0]);
    }
  }, [listaCaminhos, caminhoAtivoIdx]);

  // Continuous charging power ritual while AI generates, or direct selection if already saved
  useEffect(() => {
    if (open) {
      if (!loading && listaCaminhos && listaCaminhos.length > 0) {
        setRitualState("selection");
        setChargeProgress(100);
        if (chargeIntervalRef.current) {
          clearInterval(chargeIntervalRef.current);
          chargeIntervalRef.current = null;
        }
        return;
      }

      setRitualState("charging");
      setChargeProgress(0);
      setChargeStageText("Sintonizando Pressão Espiritual com o Mundo Interior...");
      playReiatsuSound(isBankaiFinal ? 'bankai_charge' : 'shikai_charge');

      let p = 0;
      let stageCounter = 0;
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);

      const dynamicStages = isBankaiFinal ? [
        "Sintonizando a Shikai com a profundidade da alma...",
        "⚡ TENSÃO DE REIATSU: A energia se eleva em chamas monumentais...",
        "💥 VIBRAÇÃO DO REISHI: Os rastros de aura rasgam o véu entre os mundos...",
        "👑 FORJANDO AS 3 EVOLUÇÕES TRANSCENDENTAIS DE BANKAI COM A IA...",
        "卍 A fenda da alma se abre em ressonância absoluta..."
      ] : [
        "Sintonizando Pressão Espiritual com o Mundo Interior...",
        "⚡ TENSÃO DE REIATSU: A aura espiritual se eleva em chamas de energia...",
        "💥 VIBRAÇÃO DO AR & ONDAS DE CHOQUE: Os rastros de Reishi fluem pelo ambiente!",
        "🗡️ FORJANDO AS 4 MANIFESTAÇÕES AUTÊNTICAS DA SHIKAI COM A IA...",
        "✨ A fenda se abre: Revelando as manifestações únicas da alma..."
      ];

      chargeIntervalRef.current = setInterval(() => {
        const isReady = !loading && listaCaminhos && listaCaminhos.length > 0;
        
        if (!isReady) {
          // Progress smoothly up to 92% and oscillate while AI is computing
          if (p < 92) {
            p += 2;
          } else {
            p = 90 + Math.sin(Date.now() / 200) * 3;
          }
          setChargeProgress(Math.floor(p));

          stageCounter++;
          const stageIdx = Math.min(Math.floor(stageCounter / 18), dynamicStages.length - 2);
          setChargeStageText(dynamicStages[stageIdx]);
        } else {
          // AI is done, rush to 100% and reveal
          p += 4;
          if (p < 100) {
            setChargeProgress(p);
            setChargeStageText(dynamicStages[dynamicStages.length - 1]);
          } else {
            setChargeProgress(100);
            clearInterval(chargeIntervalRef.current);
            chargeIntervalRef.current = null;
            playReiatsuSound('shatter');
            playReiatsuSound('crit');
            setTimeout(() => {
              setRitualState("selection");
              playReiatsuSound(isBankaiFinal ? 'bankai_reveal' : 'win');
            }, 300);
          }
        }
      }, 80);
    }

    return () => {
      if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
    };
  }, [open, loading, listaCaminhos.length]);

  function salvarApiKey(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
      localStorage.setItem("bleach_openai_key", apiKeyInput.trim());
      setSalvoKey(true);
      setTimeout(() => setSalvoKey(false), 3000);
    } catch(err) {}
  }

  async function testarConexaoIA() {
    setIsTestingKey(true);
    setTestResult(null);
    try {
      const fn = (typeof testSpiritualAIConnection === 'function') ? testSpiritualAIConnection : (typeof window !== 'undefined' ? window.testSpiritualAIConnection : null);
      if (!fn) {
        setTestResult({ ok: false, msg: "Função de teste não encontrada no escopo." });
        return;
      }
      const res = await fn(apiKeyInput.trim());
      if (res.ok) {
        setTestResult({ ok: true, msg: res.mensagem });
      } else {
        setTestResult({ ok: false, msg: res.mensagem || res.error });
      }
    } catch (e) {
      setTestResult({ ok: false, msg: "Erro ao testar: " + e.message });
    } finally {
      setIsTestingKey(false);
    }
  }

  function confirmarEscolhaFinal(caminho) {
    setCaminhoSelecionado(caminho);
    setRitualState("revealed");
    playReiatsuSound(isBankaiFinal ? 'bankai_reveal' : 'win');
  }

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      {/* Rising Ambient Aura Flames & Energy Trails Across the Site */}
      {ritualState === "charging" && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className={isBankaiFinal ? "aura-flame-surge-bankai" : "aura-flame-surge"}></div>
          <div className="absolute w-3 h-48 rounded-full bg-gradient-to-t from-transparent via-cyan-400 to-white blur-sm energy-trail-1 shadow-[0_0_25px_#4FB3E8]"></div>
          <div className="absolute w-3.5 h-56 rounded-full bg-gradient-to-t from-transparent via-bleach-orange to-yellow-300 blur-sm energy-trail-2 shadow-[0_0_30px_#FF6A13]"></div>
          <div className="absolute w-4 h-60 rounded-full bg-gradient-to-t from-transparent via-yellow-400 to-purple-400 blur-sm energy-trail-3 shadow-[0_0_35px_#FFD700]"></div>
        </div>
      )}

      <div className={`relative w-full max-w-5xl bg-bleach-panel border-2 rounded-2xl p-4 sm:p-6 shadow-2xl text-left transition-all z-10 ${
        isBankaiFinal ? "border-yellow-500/80 bankai-supreme-card" : "border-bleach-orange/80 reiatsu-glow"
      } my-auto`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-bleach-borderSoft pb-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                isBankaiFinal ? "bg-amber-950 border-yellow-400 text-yellow-300" : "bg-orange-950 border-bleach-orange text-bleach-orange"
              }`}>
                {isBankaiFinal ? "卍 ZGE V5.0 • TRANSCENDÊNCIA DE BANKAI" : "✨ ZGE V5.0 • GÊNESE DE SHIKAI"}
              </span>
              <span className="text-xs text-bleach-muted">Alma: <strong className="text-white">{personagem?.nome || "Shinigami"}</strong></span>
              <span className="text-[10px] bg-green-950 text-green-300 border border-green-500/40 px-2 py-0.5 rounded-full">
                ✓ DNA Espiritual Analisado
              </span>
            </div>
            <h2 className="font-title text-2xl sm:text-3xl text-white tracking-wider mt-1">
              {isBankaiFinal ? "卍 3 EVOLUÇÕES DIRETAS DA SUA SHIKAI (BANKAI)" : "始解 4 MANIFESTAÇÕES ÚNICAS DA ALMA (SHIKAI)"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfigApiKey(!showConfigApiKey)}
              className="px-3 py-1.5 bg-black/60 border border-white/10 hover:border-yellow-400 text-yellow-300 rounded-lg text-xs font-mono transition flex items-center gap-1.5"
              title="Configurar Chave Google Gemini / ChatGPT / Groq"
            >
              <span>⚙️</span> Chave IA
            </button>
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
          <div className="p-4 bg-black/90 border-2 border-yellow-500/60 rounded-xl mb-4 space-y-3 text-xs shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
              <span className="text-yellow-300 font-bold flex items-center gap-1.5">
                <span>🤖</span> Provedores de IA Suportados:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-500/50 text-blue-300">Google Gemini (AIza...)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">Groq (gsk_...)</span>
                <span className="px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/50 text-purple-300">OpenRouter (sk-or-...)</span>
                <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300">OpenAI (sk-...)</span>
              </div>
            </div>

            <form onSubmit={salvarApiKey} className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="password"
                placeholder="Cole sua chave de API aqui (Google Gemini, OpenAI, Groq ou OpenRouter)"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 w-full bg-bleach-panel2 border border-bleach-border focus:border-yellow-400 rounded-lg p-2.5 text-white font-mono text-xs focus:outline-none"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase rounded-lg shadow transition"
              >
                Salvar Chave
              </button>
              <button
                type="button"
                onClick={testarConexaoIA}
                disabled={isTestingKey || !apiKeyInput.trim()}
                className="w-full sm:w-auto px-4 py-2.5 bg-bleach-panel2 border border-cyan-500/60 hover:bg-cyan-950 text-cyan-300 font-bold rounded-lg transition disabled:opacity-50"
              >
                {isTestingKey ? "🧪 Testando..." : "🧪 Testar Conexão"}
              </button>
            </form>

            {salvoKey && (
              <p className="text-green-400 font-bold">✓ Chave de IA salva com sucesso no navegador!</p>
            )}

            {testResult && (
              <div className={`p-2.5 rounded-lg border text-xs font-mono ${
                testResult.ok ? "bg-green-950/70 border-green-500 text-green-300" : "bg-red-950/70 border-red-500 text-red-300"
              }`}>
                {testResult.ok ? "✅ " : "❌ "} {testResult.msg}
              </div>
            )}
          </div>
        )}

        {/* RITUAL CHARGING SCREEN COM CORTE HORIZONTAL, AURA SUBINDO & VIBRAÇÃO DO AR */}
        {ritualState === "charging" && (
          <div className="py-10 flex flex-col items-center justify-center space-y-6 text-center overflow-hidden relative">
            
            {/* Air Vibration & Cosmic Reiatsu Canvas */}
            <div className={`relative w-full max-w-xl p-8 rounded-2xl bg-black/90 border-2 ${
              isBankaiFinal ? "border-yellow-500/60" : "border-bleach-orange/60"
            } shadow-2xl flex flex-col items-center justify-center space-y-5 air-vibration-active`}>
              
              {/* Central Glowing Kanji / Symbol */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-bleach-orange spin-runes"></div>
                <div className="absolute inset-2 rounded-full border border-dotted border-yellow-400 spin-runes-fast"></div>
                <span className="font-title text-6xl kanji-pulse-glow text-white select-none">
                  {isBankaiFinal ? "卍" : "始"}
                </span>
              </div>

              {/* Dynamic Horizontal Sword Slash Line across Screen */}
              <div className="w-full relative h-6 flex items-center justify-center overflow-hidden my-2">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent slash-horizontal-beam"></div>
                <div className="absolute w-24 h-4 bg-bleach-orange/80 blur-md slash-horizontal-beam"></div>
              </div>

              {/* Ritual Stage Header */}
              <div className="space-y-2 w-full">
                <h3 className="font-title text-2xl text-white tracking-widest">
                  {isBankaiFinal ? "卍 TRANSCENDENDO A SHIKAI PARA A BANKAI..." : "🗡️ FORJANDO MANIFESTAÇÕES DA ALMA..."}
                </h3>
                <p className="text-xs text-yellow-300 font-mono animate-pulse min-h-[32px] px-2 leading-relaxed">
                  {chargeStageText}
                </p>
              </div>

              {/* Reiatsu Siphon Progress Bar */}
              <div className="w-full max-w-md bg-black/80 h-3.5 rounded-full overflow-hidden border border-white/20 p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-100 ${
                    isBankaiFinal 
                      ? "bg-gradient-to-r from-yellow-500 via-amber-400 to-red-500 shadow-[0_0_15px_rgba(255,215,0,0.8)]" 
                      : "bg-gradient-to-r from-cyan-400 via-bleach-orange to-red-500 shadow-[0_0_15px_rgba(255,106,19,0.8)]"
                  }`}
                  style={{ width: `${chargeProgress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-center w-full max-w-md text-[11px] text-bleach-muted pt-1">
                <span>Ressonância de Reiatsu: <strong className="text-yellow-400 font-mono">{chargeProgress}%</strong></span>
              </div>

            </div>
          </div>
        )}

        {/* SELECTION TABS & DETAILED DISPLAY */}
        {ritualState === "selection" && listaCaminhos.length > 0 && (
          <div className="space-y-4 card-pop-reveal">
            
            {/* Tabs Header */}
            <div className={`grid gap-2 mb-4 ${isBankaiFinal ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 md:grid-cols-4"}`}>
              {caminhos.map((c, idx) => {
                const isSelected = caminhoAtivoIdx === idx;
                const bankaiData = c.bankai || c;
                const shikaiData = c.shikai || {};

                return (
                  <button
                    key={idx}
                    onClick={() => setCaminhoAtivoIdx(idx)}
                    className={`p-3.5 rounded-xl border text-left transition relative overflow-hidden ${
                      isSelected
                        ? isBankaiFinal
                          ? "bg-gradient-to-r from-yellow-950/90 to-amber-950/90 border-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.4)] ring-1 ring-yellow-400"
                          : "bg-gradient-to-r from-orange-950/90 to-black border-bleach-orange shadow-[0_0_20px_rgba(255,106,19,0.4)] ring-1 ring-bleach-orange"
                        : "bg-bleach-panel2/90 border-bleach-borderSoft opacity-70 hover:opacity-100"
                    }`}
                  >
                    <span className={`text-[10px] font-extrabold uppercase block tracking-wider ${
                      isBankaiFinal 
                        ? idx === 0 ? "text-amber-400" : idx === 1 ? "text-cyan-400" : "text-purple-400"
                        : "text-bleach-orange"
                    }`}>
                      {isBankaiFinal ? `卍 ${bankaiData.tipoEvolucao || `Opção ${idx + 1}`}` : `Caminho ${idx + 1}`}
                    </span>
                    <h4 className="font-title text-lg text-white truncate mt-0.5">
                      {isBankaiFinal ? bankaiData.nome : shikaiData.nome}
                    </h4>
                    <p className="text-[11px] text-bleach-creamDim truncate">
                      {isBankaiFinal ? (bankaiData.subtitulo || bankaiData.traducao) : c.tipoCaminho.replace(/Opção \d+ — /, '')}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* BANKAI 3-EVOLUTION DISPLAY */}
            {isBankaiFinal ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Left: Bankai Detailed View (8 cols) */}
                <div className="lg:col-span-8 bg-black/80 border-2 border-yellow-500/60 rounded-xl p-5 space-y-4 shadow-2xl">
                  
                  {/* Bankai Name & Type Header */}
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-yellow-500/30 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-yellow-950 border border-yellow-400 text-yellow-300">
                        {caminhoSelecionado.bankai?.tipoEvolucao || caminhoSelecionado.tipoEvolucao || "Evolução de Bankai"}
                      </span>
                      <h3 className="font-title text-3xl text-yellow-300 tracking-wider flex items-center gap-2 mt-1">
                        <span>{caminhoSelecionado.bankai?.nome || caminhoSelecionado.nome}</span>
                        <span className="text-base font-cinzel text-yellow-400 font-normal">{caminhoSelecionado.bankai?.kanji || caminhoSelecionado.kanji}</span>
                      </h3>
                      <p className="text-xs text-yellow-200 italic mt-0.5">
                        "{caminhoSelecionado.bankai?.comando || caminhoSelecionado.comando}"
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-yellow-400/90 font-mono block">
                        Tradução: <strong>{caminhoSelecionado.bankai?.traducao || caminhoSelecionado.traducao}</strong>
                      </span>
                      <span className="text-[10px] bg-green-950 border border-green-500 text-green-300 px-2 py-0.5 rounded-full inline-block mt-1">
                        ✦ 100% Exclusiva no RPG
                      </span>
                    </div>
                  </div>

                  {/* Breakpoint Box (Ponto de Ruptura da Shikai) */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-950/60 to-black rounded-xl border-2 border-yellow-500/70 space-y-1">
                    <strong className="text-yellow-400 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span>💥</span> PONTO DE RUPTURA (LIMITE DA SHIKAI SUPERADO):
                    </strong>
                    <p className="text-xs text-bleach-cream leading-relaxed font-sans">
                      {caminhoSelecionado.bankai?.pontoRuptura || caminhoSelecionado.pontoRuptura}
                    </p>
                  </div>

                  {/* Ponto Fraco & Brecha Estratégica (Como Lidar/Contragolpear) */}
                  {(caminhoSelecionado.bankai?.pontoFraco || caminhoSelecionado.pontoFraco) && (
                    <div className="p-3.5 bg-gradient-to-r from-red-950/70 via-black to-red-950/50 rounded-xl border-2 border-red-500/70 space-y-1 shadow-lg">
                      <strong className="text-red-400 block text-xs uppercase tracking-wider flex items-center gap-1.5 font-bold">
                        <span>🎯</span> BRECHA ESTRATÉGICA & PONTO FRACO (COMO CONTRAGOLPEAR):
                      </strong>
                      <p className="text-xs text-red-200/90 leading-relaxed font-sans">
                        {caminhoSelecionado.bankai?.pontoFraco || caminhoSelecionado.pontoFraco}
                      </p>
                    </div>
                  )}

                  {/* Forma Monumental & Poder */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1">
                      <strong className="text-yellow-400 block text-xs">👑 Domínio Territorial & Forma:</strong>
                      <p className="text-bleach-creamDim text-[11px] leading-relaxed">
                        {caminhoSelecionado.bankai?.formaMonumental || caminhoSelecionado.formaMonumental}
                      </p>
                    </div>
                    <div className="p-3.5 bg-bleach-panel2 rounded-xl border border-white/10 space-y-1">
                      <strong className="text-cyan-300 block text-xs">⚡ Poder Transcendental:</strong>
                      <p className="text-bleach-creamDim text-[11px] leading-relaxed">
                        {caminhoSelecionado.bankai?.poder || caminhoSelecionado.poder}
                      </p>
                    </div>
                  </div>

                  {/* Manifestação do Espírito & Domínio do Mundo Interior na Bankai */}
                  {((caminhoSelecionado.bankai?.manifestacaoEspiritoBankai || caminhoSelecionado.manifestacaoEspiritoBankai) || (caminhoSelecionado.bankai?.mundoInternoBankai || caminhoSelecionado.mundoInternoBankai)) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {(caminhoSelecionado.bankai?.manifestacaoEspiritoBankai || caminhoSelecionado.manifestacaoEspiritoBankai) && (
                        <div className="p-3.5 bg-gradient-to-br from-purple-950/60 via-bleach-panel2 to-black rounded-xl border border-purple-500/40 space-y-1">
                          <strong className="text-purple-300 block text-xs flex items-center gap-1">
                            <span>🐉</span> Manifestação do Espírito (Bankai):
                          </strong>
                          <p className="text-bleach-creamDim text-[11px] leading-relaxed">
                            {caminhoSelecionado.bankai?.manifestacaoEspiritoBankai || caminhoSelecionado.manifestacaoEspiritoBankai}
                          </p>
                        </div>
                      )}
                      {(caminhoSelecionado.bankai?.mundoInternoBankai || caminhoSelecionado.mundoInternoBankai) && (
                        <div className="p-3.5 bg-gradient-to-br from-cyan-950/60 via-bleach-panel2 to-black rounded-xl border border-cyan-500/40 space-y-1">
                          <strong className="text-cyan-300 block text-xs flex items-center gap-1">
                            <span>🌌</span> Domínio do Mundo Interior:
                          </strong>
                          <p className="text-bleach-creamDim text-[11px] leading-relaxed">
                            {caminhoSelecionado.bankai?.mundoInternoBankai || caminhoSelecionado.mundoInternoBankai}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Limitações & Significado */}
                  <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-xs space-y-2">
                    <div className="flex flex-wrap gap-x-4 text-[11px]">
                      <span className="text-red-300"><strong>⚠️ Limitações & Desgaste:</strong> {caminhoSelecionado.bankai?.limitacoes || caminhoSelecionado.limitacoes}</span>
                    </div>
                    <p className="text-[11px] text-bleach-muted border-t border-white/5 pt-1.5">
                      <strong>Significado Filosófico:</strong> <em className="text-yellow-200">"{caminhoSelecionado.bankai?.significadoEspiritual || caminhoSelecionado.significadoEspiritual}"</em>
                    </p>
                  </div>

                  {/* Indices (1-10) */}
                  {(caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices) && (
                    <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-bleach-muted block">
                        Índice de Potência & Balanço Espiritual da Bankai (1 a 10)
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px]">
                        {[
                          { label: "Potência", val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).potencia, color: C.red },
                          { label: "Abrangência", val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).abrangencia, color: C.blue },
                          { label: "Complexidade", val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).complexidade, color: C.purple },
                          { label: "Versatilidade", val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).versatilidade, color: C.green },
                          { label: "Custo", val: (caminhoSelecionado.bankai?.indices || caminhoSelecionado.indices).custo, color: C.yellow },
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

                {/* Right: Shikai Origin & Final Confirmation (4 cols) */}
                <div className="lg:col-span-4 bg-gradient-to-b from-yellow-950/40 via-bleach-panel2 to-black border-2 border-yellow-500/50 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl">
                  <div className="space-y-3">
                    <div className="border-b border-white/10 pb-2">
                      <span className="text-[10px] font-bold uppercase text-cyan-300 block">
                        ⚡ SHIKAI DE ORIGEM
                      </span>
                      <h4 className="font-title text-xl text-white">
                        {caminhoSelecionado.shikai?.nome || personagem.zanpakuto?.shikaiAtiva?.nome || "Zanpakutō"}
                      </h4>
                      <p className="text-xs text-bleach-creamDim italic">
                        "{caminhoSelecionado.shikai?.comando || personagem.zanpakuto?.shikaiAtiva?.comando}"
                      </p>
                    </div>

                    <div className="p-3 bg-black/60 rounded-lg border border-white/5 text-xs space-y-1.5 text-bleach-creamDim">
                      <strong className="text-white block text-[11px]">Evolução de Alma:</strong>
                      <p className="text-[11px] leading-relaxed">
                        Esta Bankai foi forjada como a transcendência autêntica da sua Shikai, manifestando a maturidade definitiva da sua Reiatsu.
                      </p>
                    </div>

                    <div className="p-3 bg-black/60 rounded-lg border border-white/5 text-xs space-y-1 text-bleach-muted">
                      <div>Dominante: <strong className="text-white">{caminhoSelecionado.dnaEspiritual?.dominante}</strong></div>
                      <div>Virtude: <strong className="text-green-300">{caminhoSelecionado.dnaEspiritual?.virtudePrincipal}</strong></div>
                      <div>Defeito: <strong className="text-purple-300">{caminhoSelecionado.dnaEspiritual?.defeitoPrincipal}</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <button
                      onClick={() => confirmarEscolhaFinal(caminhoSelecionado)}
                      className="w-full py-3.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-2xl hover:brightness-110 transition"
                    >
                      卍 Despertar & Selar Esta Bankai na Alma
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* SHIKAI 4-PATH DISPLAY */
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
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-green-950/80 border border-green-500 text-green-300 tracking-wider">
                        ✦ {caminhoSelecionado.indiceExclusividade || 100}% Exclusiva no RPG
                      </span>
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

                  {/* Espírito da Lâmina & Mundo Interior */}
                  {(caminhoSelecionado.shikai.espirito || caminhoSelecionado.shikai.mundoInterno) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {caminhoSelecionado.shikai.espirito && (
                        <div className="p-3 bg-gradient-to-br from-purple-950/50 via-bleach-panel2 to-black rounded-lg border border-purple-500/30 space-y-1">
                          <strong className="text-purple-300 block text-[11px] flex items-center gap-1">
                            <span>🐉</span> Espírito da Zanpakutō:
                          </strong>
                          <p className="text-bleach-creamDim text-[11px] leading-relaxed">{caminhoSelecionado.shikai.espirito}</p>
                        </div>
                      )}
                      {caminhoSelecionado.shikai.mundoInterno && (
                        <div className="p-3 bg-gradient-to-br from-blue-950/50 via-bleach-panel2 to-black rounded-lg border border-blue-500/30 space-y-1">
                          <strong className="text-blue-300 block text-[11px] flex items-center gap-1">
                            <span>🌌</span> Mundo Interior (Jinzen):
                          </strong>
                          <p className="text-bleach-creamDim text-[11px] leading-relaxed">{caminhoSelecionado.shikai.mundoInterno}</p>
                        </div>
                      )}
                    </div>
                  )}

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

                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <button
                      onClick={() => confirmarEscolhaFinal(caminhoSelecionado)}
                      className="w-full py-3 bg-gradient-to-r from-bleach-orange via-bleach-orangeDeep to-red-600 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
                    >
                      🗡️ Despertar & Selar Este Caminho Espiritual
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

        {/* Ritual Complete / Revealed Screen */}
        {ritualState === "revealed" && (
          <div className="py-8 text-center space-y-6 card-pop-reveal">
            <div className="text-5xl animate-pulse">✨</div>
            
            <div className="max-w-lg mx-auto p-6 rounded-2xl bg-black/90 border-2 border-bleach-orange shadow-2xl space-y-4">
              <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                isBankaiFinal ? "bg-amber-950 border-yellow-400 text-yellow-300" : "bg-orange-950 border-bleach-orange text-bleach-orange"
              }`}>
                {isBankaiFinal ? "卍 TRANSCENDÊNCIA DE BANKAI CONCLUÍDA" : "始解 VINCULAÇÃO DE SHIKAI CONFIRMADA"}
              </span>
              
              <h3 className="font-title text-3xl text-white tracking-wider">
                {isBankaiFinal ? (caminhoSelecionado.bankai?.nome || caminhoSelecionado.nome) : caminhoSelecionado.shikai.nome}
              </h3>
              
              <p className="text-xs text-bleach-orange italic">
                "{isBankaiFinal ? (caminhoSelecionado.bankai?.comando || caminhoSelecionado.comando) : caminhoSelecionado.shikai.comando}"
              </p>

              <p className="text-xs text-bleach-creamDim leading-relaxed">
                Esta manifestação espiritual foi vinculada permanentemente ao personagem <strong>{personagem.nome}</strong>. Sua assinatura espiritual foi gravada com exclusividade e nenhuma outra alma poderá possuir a mesma lâmina.
              </p>

              <button
                onClick={() => onEscolherCaminho(caminhoSelecionado)}
                className="w-full py-3.5 bg-gradient-to-r from-bleach-orange to-yellow-500 text-black font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:brightness-110 transition"
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

// 4. MODAL DE REVELAÇÃO PROGRESSIVA DE CAPACIDADES TÁTICAS (SHIKAI & BANKAI)
function CapacidadesZanpakutoModal({ modalData, onClose }) {
  if (!modalData) return null;

  const { isBankai, arma, statsZk, caps } = modalData;
  const nomeZk = arma?.nome || (isBankai ? "Bankai Soberana" : "Shikai Desperta");
  const elemento = arma?.elemento || "Espiritual";

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`relative w-full max-w-3xl bg-bleach-panel border-2 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-5 my-auto ${
        isBankai ? "border-yellow-500/80 bankai-supreme-card" : "border-cyan-500/80 reiatsu-glow"
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border tracking-wider ${
                isBankai 
                  ? "bg-amber-950 text-yellow-300 border-yellow-400" 
                  : "bg-blue-950 text-cyan-300 border-cyan-400"
              }`}>
                {isBankai ? "卍 Domínio & Transcendência de Bankai" : "始解 Capacidades & Maestria Tática de Shikai"}
              </span>
              <Badge color={isBankai ? C.yellow : C.blue}>{elemento}</Badge>
            </div>
            <h3 className="font-title text-2xl sm:text-3xl text-white tracking-wider flex items-center gap-2">
              <span>{nomeZk}</span>
              <span className="text-xs font-sans text-bleach-creamDim">
                (Média Zanpakutō: <strong className={isBankai ? "text-yellow-400 font-mono" : "text-cyan-400 font-mono"}>{statsZk?.media || 100} pts</strong>)
              </span>
            </h3>
            <p className="text-xs text-bleach-creamDim mt-1 leading-relaxed">
              {isBankai
                ? "Conforme a magnitude e a ressonância da Bankai se elevam, novos graus de controle territorial e compressão de regras são desbloqueados."
                : "Conforme os atributos da Zanpakutō evoluem, o Shinigami domina nuances táticas profundas de moldagem, fragmentação e penetração da lâmina sem alterar o poder base."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-bleach-panel2 text-bleach-creamDim hover:text-white border border-white/10 hover:border-bleach-orange transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Resumo de Progresso */}
        <div className="p-3 bg-black/60 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-bleach-muted">Grau de Despertar:</span>
            <span className={`font-mono font-extrabold px-2.5 py-0.5 rounded-full text-xs border ${
              isBankai
                ? "bg-yellow-950/80 text-yellow-300 border-yellow-400"
                : "bg-cyan-950/80 text-cyan-300 border-cyan-400"
            }`}>
              {caps?.desbloqueadosCount || 1} de {caps?.totalNiveis || 5} Níveis Despertados
            </span>
          </div>

          {caps?.proximoNivel ? (
            <div className="text-[11px] text-amber-300">
              🔒 Próximo Nível (Nv. {caps.proximoNivel.nivel}): Necessário média de <strong className="font-mono">{caps.proximoNivel.req} pts</strong> (Faltam <strong className="font-mono">{Math.max(0, caps.proximoNivel.req - (statsZk?.media || 0))} pts</strong>)
            </div>
          ) : (
            <div className="text-[11px] text-green-400 font-bold flex items-center gap-1">
              <span>✨</span> MAESTRIA SUPREMA TOTALMENTE CONQUISTADA!
            </div>
          )}
        </div>

        {/* Lista dos Níveis de Capacidade Tática */}
        <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
          {(caps?.niveis || []).map((n) => (
            <div
              key={n.nivel}
              className={`p-4 rounded-xl border-2 transition ${
                n.desbloqueado
                  ? isBankai
                    ? "bg-gradient-to-r from-amber-950/40 via-black to-bleach-panel border-yellow-500/60 shadow-lg"
                    : "bg-gradient-to-r from-cyan-950/30 via-black to-bleach-panel border-cyan-500/60 shadow-lg"
                  : "bg-black/50 border-white/10 opacity-60"
              }`}
            >
              {/* Header do Nível */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{n.icone}</span>
                  <div>
                    <h4 className={`text-sm font-bold tracking-wide ${n.desbloqueado ? "text-white" : "text-bleach-muted"}`}>
                      {n.titulo}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] uppercase font-bold" style={{ color: n.corAtributo }}>
                        Atributo Chave: {n.atributoChave}
                      </span>
                      <span className="text-[10px] text-bleach-muted font-mono">
                        (Requer média {n.req} pts)
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {n.desbloqueado ? (
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-green-950 text-green-300 border border-green-500 flex items-center gap-1">
                      <span>✓</span> Desperto
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-500/50 flex items-center gap-1">
                      <span>🔒</span> Bloqueado ({n.req} pts)
                    </span>
                  )}
                </div>
              </div>

              {/* Descrição e Aplicação Tática */}
              <div className="space-y-2 text-xs">
                <p className="text-bleach-creamDim leading-relaxed">
                  {n.descricao}
                </p>

                <div className="p-2.5 bg-black/70 rounded-lg border border-white/5 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-bleach-orange flex items-center gap-1">
                    <span>💡</span> Aplicação em Combate / Narração em ON:
                  </span>
                  <p className="text-[11px] text-bleach-cream leading-snug">
                    {n.aplicacaoTatica}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-bleach-panel2 hover:bg-bleach-border text-white text-xs font-bold rounded-xl transition border border-white/10"
          >
            Fechar Janela
          </button>
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// 6. MODAL INTERATIVO DE KIDŌ DETALHADO (HADŌ, BAKUDŌ & KAIDŌ)
// Com Fórmula de Escalamento por Pressão Espiritual, Custo Anti-Spam & Simulador
// =========================================================================
function KidoDetailModal({ kido, personagem, isOpen, onClose, onConjurar, pressaoRestante }) {
  if (!isOpen || !kido) return null;

  const [incantado, setIncantado] = useState(false);
  const [extraReiatsu, setExtraReiatsu] = useState(0);
  const [simTargetStat, setSimTargetStat] = useState(80);
  const [simEstadoInicial, setSimEstadoInicial] = useState("Debilitado");

  const pressaoTotal = Number(personagem?.atributos?.pressao || 30);
  const custoInfo = calcularCustoKido(kido, pressaoTotal, extraReiatsu);
  const poderCalculadoObj = calcularPoderKido(kido, pressaoTotal, custoInfo.custoTotal, incantado, extraReiatsu);
  const poderCalculado = poderCalculadoObj.poderFinal || poderCalculadoObj;
  const poderSemEncanto = poderCalculadoObj.poderSemEncanto || Math.round(poderCalculado / 1.3);
  const poderComEncanto = poderCalculadoObj.poderComEncanto || (poderSemEncanto + Math.round((pressaoTotal + extraReiatsu) * 0.30));
  const bonusEncantamento = poderCalculadoObj.bonusEncantamento || Math.round((pressaoTotal + extraReiatsu) * 0.30);

  const isHado = kido.cat === "Hadō";
  const isBakudo = kido.cat === "Bakudō";
  const isKaido = kido.cat === "Kaidō";

  const efeitoHado = isHado ? calcularEfeitoHado(poderCalculado, simTargetStat) : null;
  const efeitoBakudo = isBakudo ? calcularEfeitoBakudo(poderCalculado, simTargetStat) : null;
  const efeitoKaido = isKaido ? calcularEfeitoKaido(poderCalculado, simEstadoInicial, kido) : null;

  const podeConjurar = pressaoRestante >= custoInfo.custoTotal;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className={`relative w-full max-w-2xl bg-bleach-panel border-2 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 my-6 max-h-[92vh] flex flex-col justify-between overflow-hidden ${
        isHado
          ? "border-red-500/80 shadow-[0_0_40px_rgba(239,68,68,0.25)]"
          : isBakudo
          ? "border-blue-500/80 shadow-[0_0_40px_rgba(59,130,246,0.25)]"
          : "border-emerald-500/80 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
      }`}>
        
        {/* Header do Modal */}
        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                isHado
                  ? "bg-red-950 text-red-300 border-red-500"
                  : isBakudo
                  ? "bg-blue-950 text-cyan-300 border-cyan-500"
                  : "bg-emerald-950 text-emerald-300 border-emerald-500"
              }`}>
                {kido.cat} #{kido.numero}
              </span>
              <span className="text-xs text-bleach-muted">Grimório de Feitiços de Seireitei</span>
            </div>
            <h3 className="font-title text-2xl sm:text-3xl text-white tracking-wide flex items-center gap-2">
              <span>{isHado ? "💥" : isBakudo ? "🛡️" : "🌿"}</span> {kido.nome}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:border-white flex items-center justify-center text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="space-y-4 overflow-y-auto pr-1">
          
          {/* Encantamento Poético */}
          {kido.incant && kido.incant !== "—" && (
            <div className="p-3.5 bg-black/70 rounded-xl border border-white/10 relative overflow-hidden">
              <div className="text-[10px] uppercase font-bold text-bleach-orange tracking-widest mb-1 flex items-center gap-1.5">
                <span>📜</span> Encantamento Ancestral (Eishō)
              </div>
              <p className="text-xs sm:text-sm text-cyan-200 italic font-serif leading-relaxed">
                "{kido.incant}"
              </p>
            </div>
          )}

          {/* Descrição Oficial */}
          <div className="p-3 bg-bleach-panel2 rounded-xl border border-white/5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-bleach-creamDim tracking-wider">
              📖 Efeito Oficial do Feitiço
            </span>
            <p className="text-xs text-bleach-cream leading-relaxed">
              {kido.desc}
            </p>
          </div>

          {/* Breakdown de Custo de Reiatsu & Poder Calculado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cartão de Custo Anti-Spam */}
            <div className="p-3.5 bg-black/80 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-bleach-muted">Custo de Conjuração</span>
                <span className="text-xs font-mono font-bold text-bleach-orange">
                  {custoInfo.custoTotal} pts de Reiatsu
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-bleach-creamDim border-t border-white/5 pt-1.5 font-mono">
                <div className="flex justify-between">
                  <span>• Custo Base Flat:</span>
                  <span className="text-white">+{custoInfo.custoFlat} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>• Custo de Escala ({custoInfo.pctTaxaStr} da Pressão):</span>
                  <span className="text-cyan-300">+{custoInfo.custoPercentual} pts</span>
                </div>
                {extraReiatsu > 0 && (
                  <div className="flex justify-between text-yellow-300">
                    <span>• Pressão Extra Investida:</span>
                    <span>+{extraReiatsu} pts</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-bleach-muted/80 leading-tight pt-1">
                ⚙️ O feitiço consome uma fração proporcional da sua Reiatsu Total ({pressaoTotal} pts).
              </div>
            </div>

            {/* Cartão de Poder Espiritual com e sem Encantamento */}
            <div className={`p-3.5 bg-black/80 rounded-xl border space-y-2 ${
              isHado ? "border-red-500/40" : isBakudo ? "border-blue-500/40" : "border-emerald-500/40"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-bleach-muted">Potência de Feitiço</span>
                <span className="text-base font-mono font-black text-white">
                  ⚡ {poderCalculado} pts
                </span>
              </div>

              <div className="space-y-1 text-[10px] font-mono text-bleach-creamDim border-t border-white/5 pt-1.5">
                <div className="flex justify-between items-center">
                  <span>Sem Encantamento:</span>
                  <span className="text-white font-bold">{poderSemEncanto} pts</span>
                </div>
                <div className="flex justify-between items-center text-yellow-300">
                  <span>Com Encantamento (+30% PE):</span>
                  <span className="font-bold">{poderComEncanto} pts (+{bonusEncantamento})</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none bg-black/50 p-1.5 rounded-lg border border-white/5 hover:border-white/20 transition">
                  <input
                    type="checkbox"
                    checked={incantado}
                    onChange={(e) => setIncantado(e.target.checked)}
                    className="accent-orange-500 w-4 h-4 rounded"
                  />
                  <span className="text-[11px] text-yellow-300 font-bold">
                    Recitar Encantamento (+30% Pressão Espiritual)
                  </span>
                </label>

                {/* Slider / Injeção de Pressão Extra */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[10px] text-bleach-muted font-bold">Pressão Extra:</span>
                  <div className="flex gap-1">
                    {[0, 10, 25, 50, 100].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setExtraReiatsu(v)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                          extraReiatsu === v
                            ? "bg-bleach-orange text-black font-bold"
                            : "bg-bleach-panel2 text-bleach-creamDim hover:text-white"
                        }`}
                      >
                        +{v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULADOR INTERATIVO DE EFICÁCIA EM COMBATE */}
          <div className="p-4 bg-gradient-to-r from-black via-bleach-panel2 to-black rounded-xl border-2 border-white/10 space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <h5 className="font-title text-lg text-white flex items-center gap-1.5">
                <span>🎯</span> Simulador de Impacto em Combate
              </h5>

              {!isKaido && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-bleach-muted">
                    {isHado ? "Resiliência do Alvo:" : "Força do Alvo:"}
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={simTargetStat}
                    onChange={(e) => setSimTargetStat(Math.max(1, Number(e.target.value) || 1))}
                    className="w-20 px-2.5 py-1 bg-black border border-white/20 rounded-lg text-white font-mono font-bold text-xs text-center focus:outline-none focus:border-bleach-orange"
                  />
                  <span className="text-xs font-mono text-bleach-muted">pts</span>
                </div>
              )}
            </div>

            {/* Presets Rápidos */}
            {!isKaido && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-bleach-muted uppercase mr-1">Presets:</span>
                {[
                  { label: "💀 Hollow", val: 30 },
                  { label: "⚔️ Sentinela", val: 80 },
                  { label: "⚡ Tenente", val: 250 },
                  { label: "👑 Capitão", val: 650 },
                  { label: "🩸 Espada Top 4", val: 1200 },
                  { label: "🌟 Comandante", val: 2500 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSimTargetStat(preset.val)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition ${
                      simTargetStat === preset.val
                        ? "bg-bleach-orange text-black font-bold"
                        : "bg-black/60 text-bleach-creamDim hover:text-white border border-white/5"
                    }`}
                  >
                    {preset.label} ({preset.val})
                  </button>
                ))}
              </div>
            )}

            {/* Resultado do Hadō */}
            {isHado && efeitoHado && (
              <div className="p-3 bg-black/90 rounded-xl border space-y-2" style={{ borderColor: efeitoHado.cor }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-black"
                    style={{ backgroundColor: efeitoHado.cor }}
                  >
                    {efeitoHado.categoria}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Poder ({poderCalculado}) / Resiliência ({simTargetStat}) = <strong style={{ color: efeitoHado.cor }}>{efeitoHado.pct}%</strong>
                  </span>
                </div>
                <div className="text-xs text-bleach-cream leading-relaxed">{efeitoHado.descricao}</div>
                <div className="p-2 bg-bleach-panel rounded-lg border border-white/5 text-[11px] text-bleach-creamDim">
                  <strong className="text-bleach-orange">💡 Narração Sugerida:</strong> {efeitoHado.dicaTatica}
                </div>
              </div>
            )}

            {/* Resultado do Bakudō */}
            {isBakudo && efeitoBakudo && (
              <div className="p-3 bg-black/90 rounded-xl border space-y-2" style={{ borderColor: efeitoBakudo.cor }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-black"
                    style={{ backgroundColor: efeitoBakudo.cor }}
                  >
                    {efeitoBakudo.categoria}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    Poder ({poderCalculado}) / Força ({simTargetStat}) = <strong style={{ color: efeitoBakudo.cor }}>{efeitoBakudo.pct}%</strong> ({efeitoBakudo.duracaoStr})
                  </span>
                </div>
                <div className="text-xs text-bleach-cream leading-relaxed">{efeitoBakudo.descricao}</div>
                <div className="p-2 bg-bleach-panel rounded-lg border border-white/5 text-[11px] text-bleach-creamDim">
                  <strong className="text-cyan-400">💡 Narração Sugerida:</strong> {efeitoBakudo.dicaTatica}
                </div>
              </div>
            )}

            {/* Resultado do Kaidō */}
            {isKaido && efeitoKaido && (
              <div className="p-3.5 bg-black/90 rounded-xl border space-y-3" style={{ borderColor: efeitoKaido.cor }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full text-black"
                    style={{ backgroundColor: efeitoKaido.cor }}
                  >
                    {efeitoKaido.categoria}
                  </span>
                  <span className="text-xs font-mono font-bold" style={{ color: efeitoKaido.cor }}>
                    {efeitoKaido.curaHpStr}
                  </span>
                </div>

                {/* Seletor do Estado do Aliado */}
                <div className="p-2.5 bg-bleach-panel rounded-lg border border-white/10 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-bleach-creamDim uppercase">
                      Estado Atual do Aliado:
                    </span>
                    <div className="flex gap-1 flex-wrap">
                      {[
                        { id: "Derrotado", label: "💀 Derrotado", desc: "Crítico" },
                        { id: "Debilitado", label: "🩸 Debilitado", desc: "Grave" },
                        { id: "Ferido", label: "🩹 Ferido", desc: "Moderado" }
                      ].map(st => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setSimEstadoInicial(st.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                            simEstadoInicial === st.id
                              ? "bg-emerald-500 text-black border-white shadow-lg font-black"
                              : "bg-black/60 text-bleach-creamDim border-white/10 hover:border-white/30"
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Diagnóstico de Cenas e Evolução do Estado */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="p-2.5 bg-black/70 rounded-lg border border-emerald-500/50 flex items-center gap-2.5">
                      <span className="text-2xl">⏳</span>
                      <div>
                        <span className="text-[10px] text-bleach-muted uppercase block font-bold">Cenas Necessárias no ON:</span>
                        <strong className="text-emerald-300 font-mono text-sm font-black">
                          {efeitoKaido.cenasNecessarias} {efeitoKaido.cenasNecessarias === 1 ? "Cena Contínua" : "Cenas de Tratamento"}
                        </strong>
                      </div>
                    </div>

                    <div className="p-2.5 bg-black/70 rounded-lg border border-white/10 flex items-center gap-2.5">
                      <span className="text-2xl">✨</span>
                      <div>
                        <span className="text-[10px] text-bleach-muted uppercase block font-bold">Evolução do Estado:</span>
                        <strong className="text-white text-xs font-bold">
                          {efeitoKaido.estadoInicial} ➔ <span className="text-emerald-400 font-black">{efeitoKaido.estadoFinal}</span>
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Roteiro de Narração por Cena */}
                {efeitoKaido.roteiroCenas && efeitoKaido.roteiroCenas.length > 0 && (
                  <div className="p-2.5 bg-black/60 rounded-lg border border-white/5 space-y-1.5 text-xs">
                    <strong className="text-emerald-300 block text-[11px] uppercase">
                      📋 Roteiro de Narração para o WhatsApp:
                    </strong>
                    {efeitoKaido.roteiroCenas.map((r, rIdx) => (
                      <p key={rIdx} className="text-bleach-cream leading-relaxed pl-2 border-l-2 border-emerald-500">
                        {r}
                      </p>
                    ))}
                  </div>
                )}

                <div className="p-2 bg-bleach-panel rounded-lg border border-white/5 text-[11px] text-bleach-creamDim">
                  <strong className="text-emerald-400">🌿 Diagnóstico do 4º Esquadrão:</strong> {efeitoKaido.dicaTatica}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer do Modal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="text-xs font-mono text-bleach-creamDim">
            Reserva na Cena: <strong className={podeConjurar ? "text-green-400" : "text-red-400 font-bold"}>{pressaoRestante} pts</strong> (Custo: {custoInfo.custoTotal} pts)
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-black/60 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/5 transition"
            >
              Fechar
            </button>

            <button
              onClick={() => {
                if (onConjurar) onConjurar(kido, custoInfo.custoTotal, poderCalculado, incantado);
                onClose();
              }}
              disabled={!podeConjurar}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed ${
                isHado
                  ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110"
                  : isBakudo
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"
              }`}
            >
              ⚡ Conjurar Feitiço ({custoInfo.custoTotal} pts)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// MODAL: ÁRVORE DE APRENDIZAGEM DE KIDŌS & GUIA DE CONHECIMENTO (SKILL TREE)
// =========================================================================
function KidoSkillTreeModal({ isOpen, onClose, personagem, onAbrirLoja }) {
  if (!isOpen) return null;

  const conhecimento = Number(personagem?.conhecimento || 0);
  const pressao = Number(personagem?.atributos?.pressao || 10);
  const kidosAprendidos = personagem?.kidosConhecidos || [];

  const trilhas = [
    {
      id: "hado",
      titulo: "💥 Trilha Hadō (Destruição & Ofensiva)",
      cor: "#D6483F",
      bgBadge: "bg-red-950 text-red-300 border-red-500",
      niveis: [
        {
          tier: "Nível I: Feitiços Iniciais (#1 a #20)",
          req: "Pressão: 10–30 | Conhecimento: 80–230 pts",
          desc: "Disparos concentrados lineares, eletricidade estática e pequenas faíscas de Reishi.",
          exemplos: "Hadō #1 Hibana, Hadō #4 Byakurai, Hadō #11 Tsuzuri Raiden"
        },
        {
          tier: "Nível II: Canhões Elementais (#21 a #60)",
          req: "Pressão: 35–120 | Conhecimento: 250–850 pts",
          desc: "Projéteis massivos de fogo carmesim, ondas concussivas e torrentes de calor.",
          exemplos: "Hadō #31 Shakkahō, Hadō #33 Sōkatsui, Hadō #54 Haien"
        },
        {
          tier: "Nível III: Tempestades Espirituais (#61 a #89)",
          req: "Pressão: 150–400 | Conhecimento: 1.000–2.800 pts",
          desc: "Descargas titânicas de eletricidade dourada, tempestades cônicas e dragões voadores.",
          exemplos: "Hadō #63 Raikōhō, Hadō #73 Sōren Sōkatsui, Hadō #88 Hiryū Gekizoku"
        },
        {
          tier: "Nível IV: Feitiços Supremos & Proibidos (#90 a #99)",
          req: "Pressão: 500–1.200+ | Conhecimento: 3.500–6.000 pts",
          desc: "Distorção gravitacional absoluta, mil armas celestes e aniquilação territorial.",
          exemplos: "Hadō #90 Kurohitsugi, Hadō #91 Senju Kōten Taihō, Hadō #99 Goryūtenbō"
        }
      ]
    },
    {
      id: "bakudo",
      titulo: "🛡️ Trilha Bakudō (Contenção, Barreira & Ilusão)",
      cor: "#4FB3E8",
      bgBadge: "bg-blue-950 text-cyan-300 border-cyan-500",
      niveis: [
        {
          tier: "Nível I: Amarras Físicas (#1 a #20)",
          req: "Pressão: 10–30 | Conhecimento: 80–230 pts",
          desc: "Bloqueio muscular de membros, cordas luminosas e repulsão de impacto.",
          exemplos: "Bakudō #1 Sai, Bakudō #4 Hainawa, Bakudō #9 Geki"
        },
        {
          tier: "Nível II: Escudos & Ocultação (#21 a #60)",
          req: "Pressão: 35–120 | Conhecimento: 250–850 pts",
          desc: "Refratação de luz invisível, estacas triangulares e discos de defesa móvel.",
          exemplos: "Bakudō #26 Kyokkō, Bakudō #30 Shitotsu Sanshin, Bakudō #39 Enkōsen"
        },
        {
          tier: "Nível III: Selos de Alta Densidade (#61 a #89)",
          req: "Pressão: 150–400 | Conhecimento: 1.000–2.800 pts",
          desc: "Prisão de feixes de luz, correntes de areia, transmissão mental e anulação mágica.",
          exemplos: "Bakudō #61 Rikujōkōrō, Bakudō #77 Tenteikūra, Bakudō #81 Dankū"
        },
        {
          tier: "Nível IV: Grandes Selos Proibidos (#90 a #99)",
          req: "Pressão: 500–1.200+ | Conhecimento: 3.500–6.000 pts",
          desc: "Aprisionamento eterno com faixas espirituais, estacas de ferro e monólitos esmagadores.",
          exemplos: "Bakudō #99 Kin, Bakudō #99 Bankin (Songoku)"
        }
      ]
    },
    {
      id: "kaido",
      titulo: "🌿 Trilha Kaidō (Cura Médica & Restauração da Alma)",
      cor: "#5FA96B",
      bgBadge: "bg-emerald-950 text-emerald-300 border-emerald-500",
      niveis: [
        {
          tier: "Nível I: Socorro Básico (#1 a #10)",
          req: "Pressão: 15–45 | Conhecimento: 90–290 pts",
          desc: "Alívio de dores, purificação de venenos superficiais e estancamento de sangramentos.",
          exemplos: "Kaidō #1 Chiyaku, Kaidō #6 Seika, Kaidō #9 Kekkai Seimei"
        },
        {
          tier: "Nível II: Cirurgia & Regeneração (#11 a #30)",
          req: "Pressão: 50–180 | Conhecimento: 320–970 pts",
          desc: "Fios de luz suturando tecidos e reconstrução de fibras musculares dilaceradas.",
          exemplos: "Kaidō #10 Chiyu, Kaidō #16 Hikari no Ito, Kaidō #20 Shōmei Seikai"
        },
        {
          tier: "Nível III: Reanimação Celular (#31 a #70)",
          req: "Pressão: 200–550 | Conhecimento: 1.200–3.500 pts",
          desc: "Regeneração de órgãos vitais e recuperação acelerada de combatentes debilitados.",
          exemplos: "Kaidō #30 Sōshō, Kaidō #50 Hanshō, Kaidō #70 Saisei"
        },
        {
          tier: "Nível IV: Transcendência da Alma (#71 a #90)",
          req: "Pressão: 600–1.200+ | Conhecimento: 4.000–6.000 pts",
          desc: "Milagre médico supremo restaurando Shinigamis do limiar da morte para o estado Inteiro.",
          exemplos: "Kaidō #90 Shōkatsu Rinne"
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-bleach-panel border-2 border-yellow-500/80 rounded-2xl p-5 sm:p-7 max-w-4xl w-full shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-yellow-500/30 pb-4">
          <div>
            <span className="px-3 py-0.5 bg-yellow-950 text-yellow-300 border border-yellow-500 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
              Sistema Acadêmico do Seireitei • Árvore de Habilidades
            </span>
            <h3 className="font-title text-2xl sm:text-3xl text-yellow-400 mt-1.5 flex items-center gap-2">
              <span>🌳</span> Árvore de Aprendizagem de Kidōs
            </h3>
            <p className="text-xs text-bleach-creamDim mt-1 leading-relaxed">
              Entenda como funciona a progressão de feitiços e como utilizar o seu <strong>Conhecimento</strong> acumulado para desbloquear novos feitiços no RPG.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-bleach-muted hover:text-white text-2xl font-bold p-1 leading-none"
          >
            ✕
          </button>
        </div>

        {/* Guia de Conhecimento (Dinheiro de Kidō) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-black/80 to-yellow-950/40 border border-yellow-500/40 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-yellow-300 text-sm flex items-center gap-2">
              <span>📚</span> O que é o Conhecimento Espiritual?
            </h4>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-bleach-creamDim">Seu Saldo: <strong className="text-yellow-400 text-base">{conhecimento}</strong> ₪</span>
              <span className="text-bleach-muted">|</span>
              <span className="text-bleach-creamDim">Pressão: <strong className="text-cyan-400 text-base">{pressao}</strong> pts</span>
            </div>
          </div>
          <p className="text-xs text-bleach-creamDim leading-relaxed">
            O <strong>Conhecimento</strong> é a moeda oficial de aprendizagem no Seireitei gerada a partir da sua <strong>atividade semanal em cenas no WhatsApp</strong> e avaliações do ADM. Ele representa suas horas de estudo na Academia Shinigami. Quanto mais cenas você produzir com seu <strong>Código Identificador</strong>, mais Conhecimento você acumulará para comprar novos Kidōs e subir no Ranking Semanal!
          </p>
        </div>

        {/* 3 Trilhas Visuais de RPG */}
        <div className="space-y-6">
          {trilhas.map(trilha => (
            <div key={trilha.id} className="p-4 bg-black/60 rounded-xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm" style={{ color: trilha.cor }}>
                  {trilha.titulo}
                </h4>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${trilha.bgBadge}`}>
                  Progressão I ➔ IV
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {trilha.niveis.map((lvl, idx) => (
                  <div key={idx} className="p-3 bg-bleach-panel2/80 rounded-lg border border-white/5 space-y-1.5 hover:border-white/20 transition">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs text-white block">{lvl.tier}</strong>
                      <span className="text-[10px] font-mono text-yellow-400">{lvl.req}</span>
                    </div>
                    <p className="text-[11px] text-bleach-creamDim leading-relaxed">{lvl.desc}</p>
                    <div className="text-[10px] text-bleach-muted italic">Exemplos: {lvl.exemplos}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer com Ação para Loja */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="text-xs text-bleach-muted">
            Feitiços já aprendidos na sua ficha: <strong className="text-white font-mono">{kidosAprendidos.length}</strong>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-black/60 border border-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/5"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                onClose();
                if (onAbrirLoja) onAbrirLoja();
              }}
              className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5"
            >
              <span>📖</span> Abrir Loja de Kidōs
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// =========================================================================
// MODAL: LOJA DE KIDŌS DO SEIREITEI (COMPRA COM CONHECIMENTO)
// =========================================================================
function KidoShopModal({ isOpen, onClose, personagem, updateChar }) {
  if (!isOpen) return null;

  const [categoria, setCategoria] = useState("Todos");
  const [busca, setBusca] = useState("");
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false);
  const [modalDetalhesKido, setModalDetalhesKido] = useState(null);

  const conhecimento = Number(personagem?.conhecimento || 0);
  const pressao = Number(personagem?.atributos?.pressao || 10);
  const kidosAprendidos = personagem?.kidosConhecidos || [];
  const capacidade = (typeof getCapacidadeKidos === 'function') ? getCapacidadeKidos(pressao) : { limiteMaximo: 4, tierNome: "Iniciante", limiteEquipadosStr: "Até 4 Feitiços", cor: "#10B981" };

  function comprarKido(kido) {
    const jaPossui = kidosAprendidos.some(k => k.id === kido.id || k.nome === kido.nome || (k.numero === kido.numero && k.cat === kido.cat));
    if (jaPossui) {
      alert("Você já possui este feitiço registrado na sua ficha!");
      return;
    }

    if (kidosAprendidos.length >= capacidade.limiteMaximo) {
      alert(`⚠️ Limite de feitiços atingido para o seu Patamar (${kidosAprendidos.length}/${capacidade.limiteMaximo} feitiços)!\n\nPatamar Atual: ${capacidade.tierNome}\nCapacidade: ${capacidade.limiteEquipadosStr}\n\nPara desbloquear novos slots de Kidō, aumente sua Pressão Espiritual!`);
      return;
    }

    if (conhecimento < kido.custoConhecimento) {
      alert(`Conhecimento insuficiente! Você possui ${conhecimento} ₪, mas o feitiço exige ${kido.custoConhecimento} ₪.`);
      return;
    }

    const confirma = confirm(`Deseja aprender "${kido.nome}" por ${kido.custoConhecimento} de Conhecimento?\n\nSaldo Atual: ${conhecimento} ₪\nSaldo Após Compra: ${conhecimento - kido.custoConhecimento} ₪\nSlots Utilizados: ${kidosAprendidos.length + 1} de ${capacidade.limiteMaximo}`);
    if (!confirma) return;

    const novosConhecidos = [...kidosAprendidos, kido];
    const novasTecnicas = [...(personagem.tecnicas || []), { id: uid(), nome: kido.nome, categoria: kido.cat }];

    updateChar({
      conhecimento: Math.max(0, conhecimento - kido.custoConhecimento),
      kidosConhecidos: novosConhecidos,
      tecnicas: novasTecnicas
    }, `📖 Aprendeu [${kido.cat} #${kido.numero}] ${kido.nome} por ${kido.custoConhecimento} de Conhecimento`);

    playReiatsuSound('win');
    alert(`✨ Parabéns! Você dominou "${kido.nome}" com maestria!\n\nO feitiço foi registrado na sua ficha oficial e já está pronto para uso e simulações.`);
  }

  const kidosFiltrados = CATALOGO_KIDOS.filter(k => {
    const jaPossui = kidosAprendidos.some(ap => ap.id === k.id || ap.nome === k.nome || (ap.numero === k.numero && ap.cat === k.cat));
    const temCapacidade = kidosAprendidos.length < capacidade.limiteMaximo;
    const temConhecimento = conhecimento >= k.custoConhecimento;
    const podeComprar = !jaPossui && temCapacidade && temConhecimento;

    if (apenasDisponiveis && !podeComprar) return false;
    if (categoria !== "Todos" && k.cat !== categoria) return false;

    const query = busca.toLowerCase();
    return (k.nome || "").toLowerCase().includes(query) ||
           (k.desc || "").toLowerCase().includes(query) ||
           (k.incant || "").toLowerCase().includes(query) ||
           String(k.numero).includes(query);
  });

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-bleach-panel border-2 border-bleach-orange rounded-2xl p-5 sm:p-7 max-w-5xl w-full shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-bleach-border pb-4">
          <div>
            <span className="px-3 py-0.5 bg-orange-950 text-bleach-orange border border-bleach-orange text-[10px] font-extrabold uppercase rounded-full tracking-wider">
              Mercado Acadêmico do Seireitei • Aprender Magias
            </span>
            <h3 className="font-title text-2xl sm:text-3xl text-white mt-1.5 flex items-center gap-2">
              <span>📖</span> Biblioteca de Kidōs & Feitiços
            </h3>
            <p className="text-xs text-bleach-creamDim mt-1">
              Adquira e registre novos feitiços na sua ficha usando <strong>exclusivamente seu Conhecimento (₪)</strong>. Recitar o encantamento (+30% PE) potencializa todos os feitiços!
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-bleach-muted hover:text-white text-2xl font-bold p-1 leading-none"
          >
            ✕
          </button>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-black/60 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-xl">
              📚
            </div>
            <div>
              <span className="text-[10px] text-bleach-muted block uppercase font-bold">Conhecimento Disponível:</span>
              <span className="text-lg font-mono font-black text-yellow-400">{conhecimento} ₪</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500 flex items-center justify-center text-xl">
              🌀
            </div>
            <div>
              <span className="text-[10px] text-bleach-muted block uppercase font-bold">Pressão & Patamar:</span>
              <span className="text-sm font-mono font-black text-cyan-400 block">{pressao} pts ({capacidade.tierNome.split('/')[0].trim()})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-xl">
              📜
            </div>
            <div>
              <span className="text-[10px] text-bleach-muted block uppercase font-bold">Capacidade de Feitiços:</span>
              <span className="text-sm font-mono font-black text-emerald-400 block">
                {kidosAprendidos.length} / {capacidade.limiteMaximo} <span className="text-[11px] font-sans font-normal text-bleach-muted">({capacidade.limiteEquipadosStr})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <input
            type="text"
            placeholder="🔍 Buscar feitiço por nome, número ou encantamento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full sm:flex-1 bg-bleach-panel2 border border-bleach-border rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-bleach-orange"
          />

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  categoria === cat ? "bg-bleach-orange text-black font-extrabold" : "bg-bleach-panel2 border border-bleach-border text-bleach-creamDim"
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setApenasDisponiveis(!apenasDisponiveis)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1 border ${
                apenasDisponiveis
                  ? "bg-yellow-500 text-black border-yellow-400 font-extrabold"
                  : "bg-black/50 border-white/10 text-yellow-300 hover:border-yellow-400"
              }`}
            >
              <span>✨</span> Apenas Compráveis
            </button>
          </div>
        </div>

        {/* Grid de Feitiços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pr-1">
          {kidosFiltrados.map((k) => {
            const jaPossui = kidosAprendidos.some(ap => ap.id === k.id || ap.nome === k.nome || (ap.numero === k.numero && ap.cat === k.cat));
            const temConhecimento = conhecimento >= k.custoConhecimento;
            const temCapacidade = kidosAprendidos.length < capacidade.limiteMaximo;
            const podeComprar = !jaPossui && temConhecimento && temCapacidade;

            const isHado = k.cat === "Hadō";
            const isBakudo = k.cat === "Bakudō";

            return (
              <div
                key={k.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                  jaPossui
                    ? "bg-emerald-950/20 border-emerald-500/40 opacity-80"
                    : podeComprar
                    ? "bg-gradient-to-b from-yellow-950/30 to-black/80 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.25)] ring-1 ring-yellow-400/40 hover:scale-[1.02]"
                    : "bg-black/40 border-white/10 opacity-60 hover:opacity-90"
                }`}
              >
                <div className="space-y-2.5 mb-3">
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

                    {jaPossui ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 border border-emerald-500">
                        ✓ Aprendido
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-yellow-400">
                        {k.custoConhecimento} ₪
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-white text-sm leading-snug">
                    {k.nome}
                  </h4>

                  <p className="text-xs text-bleach-creamDim leading-relaxed line-clamp-2">
                    {k.desc}
                  </p>

                  {/* Requisitos */}
                  {!jaPossui && (
                    <div className="p-2 bg-black/60 rounded-lg border border-white/5 text-[11px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-bleach-muted">Custo em Conhecimento:</span>
                        <strong className={temConhecimento ? "text-yellow-400 font-mono font-bold" : "text-red-400 font-mono font-bold"}>
                          {k.custoConhecimento} ₪ {temConhecimento ? "✓ (Disponível)" : `(Faltam ${k.custoConhecimento - conhecimento} ₪)`}
                        </strong>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-bleach-muted border-t border-white/5 pt-1">
                        <span>Bônus de Encantamento:</span>
                        <span className="text-cyan-300 font-mono font-bold">+30% da sua Pressão</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setModalDetalhesKido(k)}
                    className="w-full py-1 rounded-lg bg-black/50 border border-white/10 text-xs font-bold text-bleach-creamDim hover:text-white hover:border-bleach-orange transition"
                  >
                    👁️ Ver Detalhes & Encantamento
                  </button>

                  {jaPossui ? (
                    <div className="w-full py-2 text-center text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/40 rounded-xl border border-emerald-500/30">
                      ✓ Já Registrado na Ficha
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => comprarKido(k)}
                      disabled={!podeComprar}
                      className={`w-full py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition shadow-lg disabled:opacity-30 disabled:cursor-not-allowed ${
                        podeComprar
                          ? "bg-gradient-to-r from-yellow-500 to-amber-600 hover:brightness-110 text-black font-black"
                          : "bg-bleach-panel border border-white/10 text-bleach-muted"
                      }`}
                    >
                      {podeComprar ? `✨ Aprender Feitiço (${k.custoConhecimento} ₪)` : (!temCapacidade ? `🔒 Limite de Slots (${capacidade.limiteMaximo})` : `🔒 Faltam ${k.custoConhecimento - conhecimento} ₪`)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal de Detalhes embutido se clicado */}
        {modalDetalhesKido && (
          <KidoDetailModal
            kido={modalDetalhesKido}
            personagem={personagem}
            isOpen={!!modalDetalhesKido}
            onClose={() => setModalDetalhesKido(null)}
            pressaoRestante={pressao}
          />
        )}

      </div>
    </div>
  );
}
