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
        className={`w-full h-84 rounded-3xl relative overflow-hidden group shadow-2xl transition-all duration-500 border-2 ${
          isBankai 
            ? "border-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.4)]" 
            : "border-cyan-400 shadow-[0_0_30px_rgba(79,179,232,0.4)]"
        }`}
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
              {kanji.replace(/[^\p{Script=Han}]/gu, '') || (isBankai ? "卍" : "斬")}
            </div>

            {/* Ambient Reiryoku Waves */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40 animate-pulse"
              style={{
                background: `radial-gradient(circle at 50% 60%, ${auraColor1}33 0%, ${auraColor2}11 70%, transparent 100%)`
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
                  <linearGradient id={`bladeGrad_${isBankai ? 'b' : 's'}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="35%" stopColor="#E2E8F0" />
                    <stop offset="70%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  
                  <linearGradient id={`auraGrad_${isBankai ? 'b' : 's'}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={bladeGlow} stopOpacity="0.9" />
                    <stop offset="50%" stopColor={auraColor1} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={auraColor2} stopOpacity="0.2" />
                  </linearGradient>

                  <filter id={`glow_${isBankai ? 'b' : 's'}`} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Aura Flame / Pressure Trail Behind Sword */}
                <path 
                  d="M 94,15 Q 85,90 88,180 Q 95,230 102,180 Q 112,90 106,15 Z" 
                  fill={`url(#auraGrad_${isBankai ? 'b' : 's'})`} 
                  filter={`url(#glow_${isBankai ? 'b' : 's'})`}
                  className="animate-pulse"
                />

                {/* Blade Kissaki & Body (Curved Shinogi-Zukuri Katana) */}
                <path 
                  d="M 100,20 Q 98,70 98,170 L 102,170 Q 102,70 100,20 Z" 
                  fill={`url(#bladeGrad_${isBankai ? 'b' : 's'})`} 
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
                    points={`100,${193 + i * 9} 98,${197 + i * 9} 100,${201 + i * 9} 102,${197 + i * 9}`}
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
        <span>{hasCustomFoto ? "Alterar Imagem da Lâmina" : "Enviar Arte da Zanpakutō"}</span>
        <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </label>
    </div>
  );
}
