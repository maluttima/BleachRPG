const fs = require('fs');
const https = require('https');
const vm = require('vm');

console.log("Running generate_app.js...");
require('./generate_app.js');

const BABEL_CACHE_FILE = 'babel.min.js';
const url = "https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js";

function compileWithBabel(babelCode) {
  const sandbox = { window: {}, console: console };
  vm.createContext(sandbox);
  vm.runInContext(babelCode, sandbox);
  
  const Babel = sandbox.Babel || sandbox.window.Babel;
  const jsxCode = fs.readFileSync('app_source.jsx', 'utf8');
  
  try {
    const result = Babel.transform(jsxCode, { presets: ['react'] });
    console.log("SUCCESS! Transformed code size:", result.code.length);
    fs.writeFileSync('app.js', result.code);
    console.log("Written app.js!");
    
    // Update index.html with smoke & bankai styles and error recovery safeguards
    const html = `<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bleach RPG · Sociedade das Almas</title>
  
  <!-- Google Fonts: Bebas Neue, Cinzel, Outfit -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cinzel:wght@600;700;900&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            bleach: {
              bg: '#0A0908',
              bg2: '#0F0D0B',
              panel: '#16130F',
              panel2: '#1C1712',
              border: '#2E2519',
              borderSoft: '#221C15',
              orange: '#FF6A13',
              orangeDeep: '#C94E0A',
              orangeGlow: 'rgba(255, 106, 19, 0.4)',
              cream: '#F3EEE3',
              creamDim: '#C9C1AF',
              blue: '#4FB3E8',
              blueDeep: '#1E4C63',
              muted: '#8C8375',
              red: '#D6483F',
              green: '#5FA96B',
              yellow: '#E0B34C',
              purple: '#8B6FD6',
            }
          },
          fontFamily: {
            title: ['Bebas Neue', 'Impact', 'sans-serif'],
            cinzel: ['Cinzel', 'serif'],
            sans: ['Outfit', 'system-ui', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <style>
    /* Custom Styling & Reiatsu Glow FX */
    body {
      background-color: #0A0908;
      color: #F3EEE3;
      font-family: 'Outfit', system-ui, -apple-system, sans-serif;
      background-image: 
        radial-gradient(circle at 50% 0%, rgba(255, 106, 19, 0.15) 0%, transparent 65%),
        linear-gradient(180deg, #0A0908 0%, #0F0D0B 100%);
      background-attachment: fixed;
      min-height: 100vh;
    }

    .reiatsu-glow {
      box-shadow: 0 0 25px rgba(255, 106, 19, 0.25);
      border-color: rgba(255, 106, 19, 0.6);
    }
    
    .reiatsu-text-glow {
      text-shadow: 0 0 16px rgba(255, 106, 19, 0.5), 0 0 32px rgba(255, 106, 19, 0.2);
    }

    .blue-reiatsu-glow {
      box-shadow: 0 0 25px rgba(79, 179, 232, 0.25);
      border-color: rgba(79, 179, 232, 0.6);
    }

    .purple-reiatsu-glow {
      box-shadow: 0 0 30px rgba(139, 111, 214, 0.35);
      border-color: rgba(139, 111, 214, 0.7);
    }

    /* Shikai White Smoke Loop Animation */
    @keyframes smokeFlow {
      0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.35; filter: blur(10px); }
      50% { transform: translateY(-12px) scale(1.06) rotate(2deg); opacity: 0.65; filter: blur(6px); }
      100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 0.35; filter: blur(10px); }
    }
    .shikai-smoke-overlay {
      position: absolute;
      inset: -15px;
      background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.25) 0%, rgba(180, 220, 255, 0.15) 45%, transparent 75%);
      animation: smokeFlow 4.5s infinite ease-in-out;
      pointer-events: none;
      border-radius: 1.5rem;
    }

    /* Bankai Supreme Transcendental Aura */
    @keyframes bankaiPulse {
      0% { box-shadow: 0 0 25px rgba(255, 106, 19, 0.5), 0 0 50px rgba(139, 111, 214, 0.4), inset 0 0 25px rgba(255, 215, 0, 0.2); border-color: #FFD700; }
      50% { box-shadow: 0 0 50px rgba(255, 106, 19, 0.8), 0 0 90px rgba(139, 111, 214, 0.7), inset 0 0 45px rgba(255, 215, 0, 0.4); border-color: #FFA500; }
      100% { box-shadow: 0 0 25px rgba(255, 106, 19, 0.5), 0 0 50px rgba(139, 111, 214, 0.4), inset 0 0 25px rgba(255, 215, 0, 0.2); border-color: #FFD700; }
    }
    .bankai-supreme-card {
      animation: bankaiPulse 3.5s infinite ease-in-out;
      background: radial-gradient(circle at 50% 0%, rgba(139, 111, 214, 0.25) 0%, rgba(22, 19, 15, 0.95) 70%);
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 7px;
      height: 7px;
    }
    ::-webkit-scrollbar-track {
      background: #0F0D0B;
    }
    ::-webkit-scrollbar-thumb {
      background: #2E2519;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #FF6A13;
    }

    /* Background Wallpapers */
    .bg-banner-overlay {
      background-image: linear-gradient(180deg, rgba(10,9,8,0.85) 0%, rgba(10,9,8,0.95) 100%), url('assets/bleach-banner.png');
      background-size: cover;
      background-position: center top;
    }

    .bg-card-ichigo {
      background-image: linear-gradient(135deg, rgba(22,19,15,0.92) 0%, rgba(28,23,18,0.95) 100%), url('assets/ichigo-orange.png');
      background-size: cover;
      background-position: right top;
    }

    .bg-card-moon {
      background-image: linear-gradient(135deg, rgba(10,9,8,0.9) 0%, rgba(22,19,15,0.96) 100%), url('assets/ichigo-moon.png');
      background-size: cover;
      background-position: center;
    }

    /* Bleach Avatar Frame */
    .bleach-avatar-frame {
      position: relative;
      border: 3px solid #FF6A13;
      box-shadow: 0 0 18px rgba(255, 106, 19, 0.4), inset 0 0 15px rgba(0,0,0,0.8);
      clip-path: polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
    }

    /* Tension Dice Animation */
    @keyframes tenseDice {
      0% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 10px #FF6A13); }
      25% { transform: scale(1.15) rotate(180deg); filter: drop-shadow(0 0 25px #4FB3E8); }
      50% { transform: scale(0.9) rotate(360deg); filter: drop-shadow(0 0 15px #FF6A13); }
      75% { transform: scale(1.2) rotate(540deg); filter: drop-shadow(0 0 35px #D6483F); }
      100% { transform: scale(1) rotate(720deg); filter: drop-shadow(0 0 20px #FF6A13); }
    }
    .dice-suspense {
      animation: tenseDice 0.7s infinite linear;
    }

    /* Air Vibration / Reiatsu Heat Distortion Effect */
    @keyframes reiatsuAirVibrate {
      0% { transform: scale(1.02) translate(0px, 0px) skew(0deg); filter: blur(4px) brightness(1.15) contrast(1.1) drop-shadow(0 0 15px rgba(79, 179, 232, 0.7)); }
      20% { transform: scale(1.025) translate(-2px, 1.5px) skew(-0.8deg, 0.4deg); filter: blur(3.5px) brightness(1.3) contrast(1.15) drop-shadow(0 0 25px rgba(255, 106, 19, 0.8)); }
      40% { transform: scale(1.03) translate(2px, -1.8px) skew(0.7deg, -0.5deg); filter: blur(5px) brightness(1.35) contrast(1.2) drop-shadow(0 0 35px rgba(79, 179, 232, 0.9)); }
      60% { transform: scale(1.025) translate(-1.5px, -1.2px) skew(-0.5deg, 0.6deg); filter: blur(3.8px) brightness(1.25) contrast(1.1) drop-shadow(0 0 25px rgba(139, 111, 214, 0.8)); }
      80% { transform: scale(1.03) translate(1.8px, 1.2px) skew(0.6deg, -0.4deg); filter: blur(4.5px) brightness(1.4) contrast(1.25) drop-shadow(0 0 40px rgba(255, 106, 19, 0.9)); }
      100% { transform: scale(1.02) translate(0px, 0px) skew(0deg); filter: blur(4px) brightness(1.15) contrast(1.1) drop-shadow(0 0 15px rgba(79, 179, 232, 0.7)); }
    }

    @keyframes reiatsuAirVibrateBankai {
      0% { transform: scale(1.02) translate(0px, 0px) skew(0deg); filter: blur(4px) brightness(1.2) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
      25% { transform: scale(1.03) translate(-2.5px, 2px) skew(-1deg, 0.6deg); filter: blur(5px) brightness(1.45) drop-shadow(0 0 35px rgba(139, 111, 214, 0.9)); }
      50% { transform: scale(1.025) translate(2px, -2px) skew(0.8deg, -0.7deg); filter: blur(3.5px) brightness(1.5) drop-shadow(0 0 45px rgba(255, 106, 19, 1)); }
      75% { transform: scale(1.035) translate(-1.5px, -1.5px) skew(-0.6deg, 0.8deg); filter: blur(4.8px) brightness(1.4) drop-shadow(0 0 35px rgba(255, 215, 0, 0.9)); }
      100% { transform: scale(1.02) translate(0px, 0px) skew(0deg); filter: blur(4px) brightness(1.2) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); }
    }

    .air-vibrating-card {
      animation: reiatsuAirVibrate 0.18s infinite ease-in-out;
      cursor: pointer;
      box-shadow: 0 0 35px rgba(79, 179, 232, 0.6), inset 0 0 25px rgba(255, 106, 19, 0.3);
      border-color: #4FB3E8 !important;
    }

    .air-vibrating-card-bankai {
      animation: reiatsuAirVibrateBankai 0.16s infinite ease-in-out;
      cursor: pointer;
      box-shadow: 0 0 45px rgba(255, 215, 0, 0.8), inset 0 0 30px rgba(139, 111, 214, 0.5);
      border-color: #FFD700 !important;
    }

    /* Heat Wave Shimmer Overlay */
    @keyframes heatHazeWaves {
      0% { background-position: 0% 0%; opacity: 0.3; }
      50% { background-position: 100% 100%; opacity: 0.7; }
      100% { background-position: 0% 0%; opacity: 0.3; }
    }
    .heat-haze-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(255, 106, 19, 0.15), transparent 70%),
                  repeating-linear-gradient(0deg, transparent, rgba(255,255,255,0.05) 2px, transparent 4px);
      background-size: 200% 200%;
      animation: heatHazeWaves 1.5s infinite linear;
      pointer-events: none;
      border-radius: inherit;
    }

    /* Screen shake */
    @keyframes reiatsuScreenShake {
      0% { transform: translate(0, 0); }
      15% { transform: translate(-3px, 2px); }
      30% { transform: translate(3px, -2px); }
      45% { transform: translate(-2px, -3px); }
      60% { transform: translate(3px, 2px); }
      75% { transform: translate(-3px, 1px); }
      90% { transform: translate(2px, -1px); }
      100% { transform: translate(0, 0); }
    }
    .reiatsu-screen-shake {
      animation: reiatsuScreenShake 0.12s infinite;
    }

    /* Spin runes */
    @keyframes runeRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    @keyframes runeRotateRev { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
    .spin-runes { animation: runeRotate 8s infinite linear; }
    .spin-runes-fast { animation: runeRotateRev 3.5s infinite linear; }

    /* Mystic Kanji Glow */
    @keyframes kanjiPulse {
      0% { transform: scale(1); opacity: 0.7; text-shadow: 0 0 10px rgba(79,179,232,0.5); }
      50% { transform: scale(1.08); opacity: 1; text-shadow: 0 0 30px rgba(79,179,232,0.9), 0 0 50px rgba(255,106,19,0.7); }
      100% { transform: scale(1); opacity: 0.7; text-shadow: 0 0 10px rgba(79,179,232,0.5); }
    }
    .kanji-pulse-glow { animation: kanjiPulse 2s infinite ease-in-out; }

    /* Seal Shatter Flash */
    @keyframes sealFlash {
      0% { opacity: 0; transform: scale(0.9); }
      40% { opacity: 1; transform: scale(1.05); }
      100% { opacity: 0; transform: scale(1.2); }
    }
    .seal-flash-anim { animation: sealFlash 0.6s ease-out forwards; }

    /* Card Pop Reveal */
    @keyframes cardPopReveal {
      0% { opacity: 0; transform: scale(0.85) translateY(20px); }
      60% { opacity: 1; transform: scale(1.03) translateY(-4px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .card-pop-reveal { animation: cardPopReveal 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

    @keyframes pulseSpinner {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
    }
  </style>

  <!-- React 18, ReactDOM 18 -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js" crossorigin></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js" crossorigin></script>

  <!-- Global Pre-React Error Recovery Script (Definitive Black Screen Protection) -->
  <script>
    window.addEventListener('error', function(e) {
      console.error("CRITICAL WINDOW ERROR DETECTED:", e.error || e.message);
      var loader = document.getElementById('initial-loader');
      if (loader) {
        loader.innerHTML = '<div style="max-width: 520px; padding: 28px; background: #16130F; border: 2px solid #D6483F; border-radius: 20px; text-align: center; box-shadow: 0 0 50px rgba(214,72,63,0.4);"><div style="font-size: 48px; margin-bottom: 12px;">⚠️</div><div style="font-family: \'Bebas Neue\', Impact, sans-serif; font-size: 28px; color: #fff; letter-spacing: 1px;">ANOMALIA ESPIRITUAL DETECTADA</div><p style="font-size: 13px; color: #C9C1AF; margin: 12px 0 16px 0; line-height: 1.5;">Ocorreu uma instabilidade na inicialização do sistema. Você pode recarregar ou limpar o cache local para restabelecer a conexão.</p><div style="font-family: monospace; font-size: 11px; color: #D6483F; background: #000; padding: 10px; border-radius: 10px; margin-bottom: 20px; max-height: 90px; overflow: auto; text-align: left;">' + (e.message || 'Erro inesperado') + '</div><div style="display: flex; gap: 12px; justify-content: center;"><button onclick="window.location.reload()" style="padding: 10px 20px; background: #FF6A13; color: #000; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 13px; box-shadow: 0 0 15px rgba(255,106,19,0.4);">🔄 Recarregar</button><button onclick="try{localStorage.clear();}catch(x){} window.location.reload();" style="padding: 10px 20px; background: #0A0908; color: #D6483F; border: 1px solid #D6483F; border-radius: 10px; font-weight: 700; cursor: pointer; font-size: 13px;">🧹 Limpar Cache</button></div></div>';
      }
    });
  </script>
</head>
<body class="bg-[#0A0908] text-[#F3EEE3] antialiased">
  <div id="root">
    <!-- Initial Loading State while Scripts Settle -->
    <div id="initial-loader" style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0A0908; color: #F3EEE3; font-family: 'Outfit', sans-serif;">
      <div style="width: 54px; height: 54px; border: 3px solid rgba(255,106,19,0.2); border-top-color: #FF6A13; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 20px;"></div>
      <div style="font-family: 'Bebas Neue', Impact, sans-serif; font-size: 32px; letter-spacing: 2px; color: #FF6A13; text-shadow: 0 0 20px rgba(255,106,19,0.5);">BLEACH RPG</div>
      <div style="font-size: 11px; color: #8C8375; margin-top: 6px; letter-spacing: 2px; font-weight: 600;">SINTONIZANDO REIATSU COM A SOCIEDADE DAS ALMAS...</div>
    </div>
  </div>

  <style>
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>

  <!-- Ultra-fast native JS with instant loading -->
  <script src="app.js"></script>
</body>
</html>
`;
    fs.writeFileSync('index.html', html);
    console.log("Written index.html!");
  } catch (err) {
    console.error("BABEL COMPILE ERROR:", err.message);
    if (err.loc) {
      console.error("Location: line " + err.loc.line + ", col " + err.loc.column);
      const lines = jsxCode.split('\n');
      for (let l = Math.max(0, err.loc.line - 4); l <= Math.min(lines.length - 1, err.loc.line + 4); l++) {
        console.error((l + 1) + ": " + lines[l]);
      }
    }
  }
}

if (fs.existsSync(BABEL_CACHE_FILE)) {
  console.log("Using cached babel.min.js...");
  const babelCode = fs.readFileSync(BABEL_CACHE_FILE, 'utf8');
  compileWithBabel(babelCode);
} else {
  console.log("Fetching Babel standalone from CDN to compile app_source.jsx...");
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log("Babel downloaded! Size:", data.length);
      fs.writeFileSync(BABEL_CACHE_FILE, data);
      compileWithBabel(data);
    });
  }).on('error', (e) => {
    console.error("Failed to download Babel:", e);
  });
}
