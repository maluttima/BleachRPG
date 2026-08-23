// TAB: KIDŌS CATALOG & ZANPAKUTŌ SWORD VISUALIZER
function KidosView({ personagem, isAdmin }) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");
  
  const pressaoBase = personagem?.atributos?.pressao || 30;
  const maxKidosCena = Math.max(3, Math.floor(pressaoBase / 7) + 1);
  const [kidosUsados, setKidosUsados] = useState(0);
  const [relatoCena, setRelatoCena] = useState("");
  const [registroConjuracoes, setRegistroConjuracoes] = useState([]);

  const restantes = Math.max(0, maxKidosCena - kidosUsados);
  const pctRestante = Math.round((restantes / maxKidosCena) * 100);

  function conjurarKido(kido) {
    if (restantes <= 0) {
      alert("Limite de Kidōs atingido para esta cena! Sua Reiatsu precisa se estabilizar.");
      return;
    }
    playReiatsuSound('kido');
    setKidosUsados(prev => prev + 1);
    setRegistroConjuracoes(prev => [
      { id: uid(), nome: kido.nome, cat: kido.cat, custo: kido.custoReiatsu, hora: new Date().toLocaleTimeString("pt-BR") },
      ...prev
    ]);
  }

  function resetarReiatsu() {
    setKidosUsados(0);
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
            Grimório Completo da Sociedade das Almas • 75+ Feitiços Oficiais & Autorais
          </span>
          <h2 className="font-title text-4xl sm:text-5xl tracking-widest text-bleach-orange mt-3 reiatsu-text-glow">
            COMPÊNDIO SUPREMO DE KIDŌS
          </h2>
          <p className="text-xs sm:text-sm text-bleach-creamDim mt-2 leading-relaxed">
            Explore o compêndio oficial de <strong>Hadō (Destruição)</strong>, <strong>Bakudō (Aprisionamento & Defesa)</strong> e <strong>Kaidō (Cura & Suporte)</strong>. Gerencie a energia espiritual liberada na sua lâmina através do medidor de Reiatsu abaixo!
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
              <div className="text-xs text-bleach-muted">Feitiços Restantes na Lâmina:</div>
              <div className="text-2xl font-mono font-bold text-bleach-orange mt-0.5">
                {restantes} / {maxKidosCena}
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
            {personagem?.zanpakuto?.shikaiAtiva?.espirito && (
              <div className="bg-black/60 border border-cyan-500/40 rounded-xl p-5 shadow-inner">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-1 flex items-center gap-2">
                  <span>👤</span> Representação do Espírito da Zanpakutō
                </h4>
                <p className="text-xs sm:text-sm text-cyan-100/90 italic leading-relaxed whitespace-pre-line">
                  "{personagem.zanpakuto.shikaiAtiva.espirito}"
                </p>
              </div>
            )}
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
                      <span className="font-semibold text-cyan-300">⚡ {c.nome}</span>
                      <span className="text-[10px] text-bleach-muted font-mono">{c.hora}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* FILTROS & BUSCA DE KIDŌS */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["Todos", "Hadō", "Bakudō", "Kaidō"].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaAtiva(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                categoriaAtiva === cat
                  ? cat === "Hadō" ? "bg-red-600 text-white shadow-lg"
                    : cat === "Bakudō" ? "bg-blue-600 text-white shadow-lg"
                    : cat === "Kaidō" ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-bleach-orange text-black font-extrabold shadow-lg"
                  : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"
              }`}
            >
              {cat === "Hadō" ? "🔥 Hadō (Ofensivo)" : cat === "Bakudō" ? "📕 Bakudō (Contenção)" : cat === "Kaidō" ? "🌿 Kaidō (Cura)" : "✨ Todos os Kidōs"}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Buscar por nome, número ou efeito..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full sm:w-72 bg-bleach-panel2 border border-bleach-border rounded-xl px-4 py-2 text-xs text-white placeholder-bleach-muted focus:border-bleach-orange outline-none"
        />
      </div>

      {/* GRID DE KIDŌS (75+ SPELLS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kidosFiltrados.map((k) => {
          const isHado = k.cat === "Hadō";
          const isBakudo = k.cat === "Bakudō";
          const isKaido = k.cat === "Kaidō";
          const borderColor = isHado ? "border-red-500/40" : isBakudo ? "border-blue-500/40" : "border-emerald-500/40";
          const tagBg = isHado ? "bg-red-950 text-red-300 border-red-500/50" : isBakudo ? "bg-blue-950 text-cyan-300 border-blue-500/50" : "bg-emerald-950 text-emerald-300 border-emerald-500/50";

          return (
            <div 
              key={k.id}
              className={`bg-bleach-panel border ${borderColor} rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-bleach-orange transition space-y-3`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${tagBg}`}>
                    {k.cat} • #{k.numero}
                  </span>
                  <span className="text-[10px] font-mono text-bleach-muted bg-black/60 px-2 py-0.5 rounded border border-white/5">
                    Custo: {k.custoReiatsu} Reiatsu
                  </span>
                </div>

                <h4 className="font-title text-xl tracking-wider text-white">
                  {k.nome}
                </h4>
                
                <div className="text-[11px] text-amber-400 font-mono mb-2">
                  Nível: {k.nivel}
                </div>

                {k.incant && k.incant !== "—" && (
                  <div className="p-2.5 bg-black/60 border border-white/10 rounded-xl my-2 text-[11px] text-bleach-creamDim italic leading-relaxed">
                    "{k.incant}"
                  </div>
                )}

                <p className="text-xs text-bleach-creamDim leading-relaxed">
                  {k.desc}
                </p>
              </div>

              <button
                onClick={() => conjurarKido(k)}
                disabled={restantes <= 0}
                className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed ${
                  isHado ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110" 
                  : isBakudo ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"
                }`}
              >
                ⚡ Conjurar em Cena
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
