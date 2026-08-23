const fs = require('fs');

// 1. Load kido catalog
const { CATALOGO_KIDOS } = require('./kido_catalog.js');

let content = fs.readFileSync('generate_app.js', 'utf8');

// 2. Inject master kido catalog into generate_app.js
const oldKidoStart = "// Official Kidō Catalog";
const oldKidoEnd = "// =========================================================================";

const newKidoString = `// Official Kidō Catalog (75+ Spells with Incantations & Effects)
const CATALOGO_KIDOS = ${JSON.stringify(CATALOGO_KIDOS, null, 2)};

`;

const kIdx1 = content.indexOf(oldKidoStart);
const kIdx2 = content.indexOf(oldKidoEnd, kIdx1);

if (kIdx1 !== -1 && kIdx2 !== -1) {
  content = content.slice(0, kIdx1) + newKidoString + content.slice(kIdx2);
  console.log("Successfully injected 75+ Kidō master grimoire into generate_app.js!");
}

// 3. Define BleachSwordArt component to render dynamic Bleach-styled blade or custom artwork
const bleachSwordArtComponent = `
// DYNAMIC BLEACH ZANPAKUTŌ VISUAL ART & SWORD GENERATOR
function BleachSwordArt({ arma, nomeZk, isBankai, foto, onUpload }) {
  const elemento = (arma?.elemento || "").toLowerCase();
  const formato = (arma?.formatoArma || "").toLowerCase();
  const nome = arma?.nome || nomeZk || "Zanpakutō";
  const kanji = arma?.kanji || (isBankai ? "卍" : "斬");

  // Determine Elemental Aesthetic Color Schemes
  let auraColor1 = isBankai ? "#FFD700" : "#4FB3E8";
  let auraColor2 = isBankai ? "#9333EA" : "#0284C7";
  let bladeGlow = isBankai ? "#FDE047" : "#67E8F9";
  let particleSymbol = "✦";

  if (elemento.includes("gelo") || elemento.includes("neve") || elemento.includes("frio") || elemento.includes("água") || elemento.includes("espelho")) {
    auraColor1 = "#38BDF8";
    auraColor2 = "#0369A1";
    bladeGlow = "#E0F2FE";
    particleSymbol = "❄";
  } else if (elemento.includes("fogo") || elemento.includes("chama") || elemento.includes("calor") || elemento.includes("brasa") || elemento.includes("solar") || elemento.includes("vulcão")) {
    auraColor1 = "#EF4444";
    auraColor2 = "#991B1B";
    bladeGlow = "#FBBF24";
    particleSymbol = "🔥";
  } else if (elemento.includes("raio") || elemento.includes("trovão") || elemento.includes("elétr")) {
    auraColor1 = "#FBBF24";
    auraColor2 = "#B45309";
    bladeGlow = "#67E8F9";
    particleSymbol = "⚡";
  } else if (elemento.includes("sombra") || elemento.includes("vácuo") || elemento.includes("cinza") || elemento.includes("trevas") || elemento.includes("nanquim") || elemento.includes("negro")) {
    auraColor1 = "#A855F7";
    auraColor2 = "#4C1D95";
    bladeGlow = "#D8B4FE";
    particleSymbol = "🌑";
  } else if (elemento.includes("flor") || elemento.includes("pétala") || elemento.includes("planta") || elemento.includes("sangue")) {
    auraColor1 = "#F43F5E";
    auraColor2 = "#881337";
    bladeGlow = "#FECDD3";
    particleSymbol = "🌸";
  } else if (elemento.includes("gravidade") || elemento.includes("aço") || elemento.includes("peso") || elemento.includes("sísmic") || elemento.includes("rocha")) {
    auraColor1 = "#F97316";
    auraColor2 = "#7C2D12";
    bladeGlow = "#FED7AA";
    particleSymbol = "⚔️";
  }

  const hasCustomFoto = foto && !foto.includes("ichigo-orange.png") && foto.length > 50;

  return (
    <div className="w-full max-w-[290px] flex flex-col items-center">
      <div 
        className={\`w-full h-84 rounded-3xl relative overflow-hidden group shadow-2xl transition-all duration-500 border-2 \${
          isBankai 
            ? "border-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.4)]" 
            : "border-cyan-400 shadow-[0_0_30px_rgba(79,179,232,0.4)]"
        }\`}
        style={{
          background: 'radial-gradient(circle at 50% 30%, #1a1b26 0%, #0a0b10 80%, #000000 100%)'
        }}
      >
        {hasCustomFoto ? (
          <img 
            src={foto} 
            alt={nome} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700" 
          />
        ) : (
          /* AUTORAL BLEACH SWORD ARTWORK SVG RENDERER */
          <div className="w-full h-full flex flex-col items-center justify-between p-4 relative select-none">
            {/* Background Kanji Watermark */}
            <div 
              className="absolute inset-0 flex items-center justify-center font-cinzel text-9xl font-black pointer-events-none opacity-10 leading-none"
              style={{ color: auraColor1 }}
            >
              {kanji.replace(/[^\\p{Script=Han}]/gu, '') || (isBankai ? "卍" : "斬")}
            </div>

            {/* Ambient Reiryoku Waves */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40 animate-pulse"
              style={{
                background: \`radial-gradient(circle at 50% 60%, \${auraColor1}33 0%, \${auraColor2}11 70%, transparent 100%)\`
              }}
            ></div>

            {/* Top Stage & Name Tag */}
            <div className="w-full flex justify-between items-center z-10">
              <span 
                className="px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase tracking-widest border"
                style={{ 
                  backgroundColor: isBankai ? '#451a03' : '#082f49', 
                  borderColor: auraColor1, 
                  color: isBankai ? '#fde047' : '#7dd3fc' 
                }}
              >
                {isBankai ? "卍 Bankai" : "始解 Shikai"}
              </span>

              <span className="text-xs font-mono font-bold" style={{ color: bladeGlow }}>
                {particleSymbol} {particleSymbol}
              </span>
            </div>

            {/* Stylized Zanpakutō Blade Vector Graphic */}
            <div className="relative w-full h-52 flex items-center justify-center z-10 my-1">
              <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <defs>
                  <linearGradient id={\`bladeGrad_\${isBankai ? 'b' : 's'}\`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#E2E8F0" />
                    <stop offset="70%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  
                  <linearGradient id={\`auraGrad_\${isBankai ? 'b' : 's'}\`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={bladeGlow} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={auraColor1} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={auraColor2} stopOpacity="0.2" />
                  </linearGradient>

                  <filter id={\`glow_\${isBankai ? 'b' : 's'}\`} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Aura Flame / Pressure Trail Behind Sword */}
                <path 
                  d="M 94,15 Q 85,90 88,180 Q 95,230 102,180 Q 112,90 106,15 Z" 
                  fill={\`url(#auraGrad_\${isBankai ? 'b' : 's'})\`} 
                  filter={\`url(#glow_\${isBankai ? 'b' : 's'})\`}
                  className="animate-pulse"
                />

                {/* Blade Kissaki & Body (Curved Shinogi-Zukuri Katana) */}
                <path 
                  d="M 100,20 Q 98,70 98,170 L 102,170 Q 102,70 100,20 Z" 
                  fill={\`url(#bladeGrad_\${isBankai ? 'b' : 's'})\`} 
                  stroke={bladeGlow} 
                  strokeWidth="1.5"
                />

                {/* Blade Edge Sharpness Highlight (Ha) */}
                <path 
                  d="M 100,20 Q 97,75 97,170" 
                  fill="none" 
                  stroke="#FFFFFF" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                />

                {/* Hamon Temper Wave Line */}
                <path 
                  d="M 99,28 Q 97,45 100,60 Q 98,75 100,90 Q 97,110 100,130 Q 98,150 99,170" 
                  fill="none" 
                  stroke={bladeGlow} 
                  strokeWidth="1" 
                  strokeOpacity="0.8"
                />

                {/* Habaki (Golden Collar) */}
                <rect x="96" y="170" width="8" height="12" rx="1" fill="#EAB308" stroke="#713F12" strokeWidth="1" />

                {/* Tsuba (Guard) */}
                {isBankai ? (
                  /* Ornate Four-Pronged Bankai Guard (Manji / Lotus Cross) */
                  <g>
                    <rect x="80" y="181" width="40" height="7" rx="3" fill="#18181B" stroke="#F59E0B" strokeWidth="1.5" />
                    <rect x="96.5" y="168" width="7" height="33" rx="2" fill="#18181B" stroke="#F59E0B" strokeWidth="1.5" />
                    <circle cx="100" cy="184.5" r="5" fill="#F59E0B" />
                  </g>
                ) : (
                  /* Circular Floral / Elegant Shikai Guard */
                  <g>
                    <ellipse cx="100" cy="183" rx="20" ry="6" fill="#1E293B" stroke={auraColor1} strokeWidth="1.5" />
                    <circle cx="100" cy="183" r="3.5" fill="#E2E8F0" />
                  </g>
                )}

                {/* Tsuka (Handle with Diamond Ito Wrapping) */}
                <rect x="96.5" y="188" width="7" height="75" rx="2" fill="#09090B" stroke="#27272A" strokeWidth="1" />
                
                {/* Traditional Tsuka-Ito Diamond Wraps */}
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <polygon 
                    key={i} 
                    points={\`100,\${193 + i * 9} 98,\${197 + i * 9} 100,\${201 + i * 9} 102,\${197 + i * 9}\`}
                    fill={isBankai ? "#F59E0B" : auraColor1}
                  />
                ))}

                {/* Kashira (Pommel Cap) */}
                <rect x="95.5" y="263" width="9" height="7" rx="2" fill="#713F12" stroke="#EAB308" strokeWidth="1" />

                {/* Flowing Floating Spirit Particles */}
                <circle cx="75" cy="80" r="2" fill={bladeGlow} className="animate-ping" />
                <circle cx="125" cy="130" r="2.5" fill={auraColor1} className="animate-pulse" />
                <circle cx="80" cy="160" r="1.5" fill="#FFFFFF" />
                <circle cx="120" cy="50" r="2" fill={bladeGlow} />
              </svg>
            </div>

            {/* Bottom Weapon Name Card */}
            <div className="w-full text-center z-10 bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl py-1.5 px-2">
              <div className="font-title text-sm tracking-widest text-white truncate drop-shadow">
                {nome}
              </div>
              <div className="text-[10px] font-mono text-bleach-muted truncate">
                {arma?.elemento || "Reiryoku Condensado"}
              </div>
            </div>
          </div>
        )}

        {/* Hover Upload Overlay */}
        <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 text-xs text-cyan-300 font-bold text-center p-4 z-30">
          <span className="text-2xl mb-1">📷</span>
          <span>{hasCustomFoto ? "Substituir Imagem da Espada" : "Fazer Upload de Arte Própria"}</span>
          <span className="text-[10px] text-bleach-muted mt-1 font-normal">(PNG, JPG ou GIF)</span>
          <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </label>
      </div>

      {/* Button Below Mold */}
      <label className="mt-3 px-4 py-1.5 bg-bleach-panel2 border border-bleach-border hover:border-bleach-orange text-[11px] text-bleach-cream rounded-xl cursor-pointer transition shadow flex items-center gap-1.5">
        <span>📷</span>
        <span>{hasCustomFoto ? "Alterar Foto da Lâmina" : "Enviar Arte Personalizada"}</span>
        <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </label>
    </div>
  );
}
`;

// Insert BleachSwordArt component before the main character profile components
const markerBeforeProfile = "function PerfilCharView({";
if (content.includes(markerBeforeProfile) && !content.includes("function BleachSwordArt({")) {
  content = content.replace(markerBeforeProfile, bleachSwordArtComponent + "\n\n" + markerBeforeProfile);
  console.log("Injected BleachSwordArt visual generator component!");
}

// 4. Fix KidosView where misplaced spirit block caused black screen
const oldKidosViewStart = "function KidosView({ personagem }) {";
const oldKidosViewEnd = "function PerfilCharView({";

const newKidosViewCode = `function KidosView({ personagem }) {
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
      alert("Limite de Kidōs atingido para esta cena! Sua Reiatsu precisa se estabilizar antes de novo feitiço.");
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
            Biblioteca oficial contendo todos os encantamentos e feitiços de <strong>Hadō (Destruição)</strong>, <strong>Bakudō (Aprisionamento & Defesa)</strong> e <strong>Kaidō (Cura & Suporte)</strong>. Gerencie o gasto de Reiatsu em combate na lâmina espiritual abaixo!
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
                    height: \\\`\\\${pctRestante}%\\\`,
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
            <div className="bg-bleach-panel2 border border-bleach-border rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-bleach-orange mb-2">
                ✍️ Rascunho de Narrativa da Cena (WhatsApp)
              </h4>
              <p className="text-xs text-bleach-creamDim mb-2">
                Rascunhe sua ação antes de postar no grupo:
              </p>
              <textarea
                rows={4}
                value={relatoCena}
                onChange={(e) => setRelatoCena(e.target.value)}
                placeholder="Ex: Concentrei minha Reiatsu ao longo do fio da Zanpakutō liberando Hadō #4 Byakurai em linha reta..."
                className="w-full bg-black/60 border border-bleach-border rounded-xl p-3 text-xs text-white placeholder-bleach-muted/50 focus:border-bleach-orange outline-none resize-none font-sans"
              />
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
              className={\`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition \${
                categoriaAtiva === cat
                  ? cat === "Hadō" ? "bg-red-600 text-white shadow-lg"
                    : cat === "Bakudō" ? "bg-blue-600 text-white shadow-lg"
                    : cat === "Kaidō" ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-bleach-orange text-black font-extrabold shadow-lg"
                  : "bg-bleach-panel border border-bleach-border text-bleach-creamDim hover:text-white"
              }\`}
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

      {/* GRID DE KIDŌS */}
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
              className={\`bg-bleach-panel border \${borderColor} rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:border-bleach-orange transition space-y-3\`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={\`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border \${tagBg}\`}>
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
                className={\`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition disabled:opacity-40 disabled:cursor-not-allowed \${
                  isHado ? "bg-gradient-to-r from-red-600 to-orange-600 text-white hover:brightness-110" 
                  : isBakudo ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110"
                }\`}
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

`;

const kView1 = content.indexOf(oldKidosViewStart);
const kView2 = content.indexOf(oldKidosViewEnd);

if (kView1 !== -1 && kView2 !== -1) {
  content = content.slice(0, kView1) + newKidosViewCode + content.slice(kView2);
  console.log("Replaced KidosView with clean, safe version!");
}

// 5. Update Shikai and Bankai tabs to use BleachSwordArt and safe optional chaining
const oldShikaiTabStart = "{/* SUB-PÁGINA 2: SHIKAI DESPERTA */}";
const oldBankaiTabEnd = "{/* UNALLOCATED POINTS BANNER WITH 1, 5, 10 STEP SELECTOR */}";

// Let's find the range in generate_app.js
const sIdx1 = content.indexOf(oldShikaiTabStart);
const bIdx2 = content.indexOf(oldBankaiTabEnd);

const newShikaiBankaiTabs = `{/* SUB-PÁGINA 2: SHIKAI DESPERTA */}
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
                    {(personagem?.zanpakuto?.shikaiAtiva?.espirito || personagem?.zanpakuto?.bankaiAtiva?.espirito) && (
                      <div className="bg-black/70 border-2 border-purple-500/60 rounded-2xl p-5 shadow-[0_0_20px_rgba(139,111,214,0.3)]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-purple-300 mb-1 flex items-center gap-2">
                          <span>👤</span> Ressonância do Espírito & Mundo Interior
                        </h4>
                        <p className="text-xs sm:text-sm text-purple-100/90 italic leading-relaxed whitespace-pre-line">
                          "{personagem?.zanpakuto?.shikaiAtiva?.espirito || personagem?.zanpakuto?.bankaiAtiva?.espirito}"
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

      `;

if (sIdx1 !== -1 && bIdx2 !== -1) {
  content = content.slice(0, sIdx1) + newShikaiBankaiTabs + content.slice(bIdx2);
  console.log("Safely updated Shikai and Bankai tabs with BleachSwordArt mold!");
}

fs.writeFileSync('generate_app.js', content);
console.log("generate_app.js updated successfully!");
