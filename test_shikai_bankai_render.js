const fs = require('fs');
const vm = require('vm');

const appJs = fs.readFileSync('app.js', 'utf8');

const sandbox = {
  window: {},
  document: {
    getElementById: (id) => ({ id }),
    addEventListener: () => {},
  },
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Math: Math,
  Date: Date,
  localStorage: {
    getItem: (key) => null,
    setItem: () => {},
  },
  navigator: {
    clipboard: {
      writeText: () => Promise.resolve(),
    }
  },
  React: {
    useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
    useEffect: (fn) => fn && fn(),
    useRef: (init) => ({ current: init }),
    useMemo: (fn) => fn(),
    useCallback: (fn) => fn,
    createElement: (type, props, ...children) => {
      if (typeof type === 'function') {
        try {
          if (type.prototype && type.prototype.render) {
            const inst = new type({ ...(props || {}), children });
            return inst.render ? inst.render() : { type, props, children };
          }
          return type({ ...(props || {}), children });
        } catch (e) {
          console.error(`ERROR rendering component ${type.name}:`, e);
          throw e;
        }
      }
      return { type, props, children };
    },
  },
  ReactDOM: {
    createRoot: () => ({
      render: () => {},
    }),
  },
};
sandbox.window = sandbox;

try {
  vm.createContext(sandbox);
  vm.runInContext(appJs, sandbox);
  console.log("TEST 1 PASSED: app.js loaded!");
} catch (e) {
  console.error("FATAL ERROR in app.js:", e);
  process.exit(1);
}

// Test BleachSwordArt directly
try {
  const code = `
    const shikaiArt = React.createElement(BleachSwordArt, {
      arma: { nome: "Kurotsubaki", elemento: "Camélia / Sombra", formatoArma: "Lâmina fina de ébano com guarda floral", poder: "Absorve movimento" },
      nomeZk: "Kurotsubaki",
      isBankai: false,
      foto: "assets/ichigo-orange.png",
      onUpload: () => {}
    });
    console.log("TEST 2 PASSED: BleachSwordArt rendered Shikai SVG successfully!");

    const bankaiArt = React.createElement(BleachSwordArt, {
      arma: { nome: "Kurotsubaki: Kokuen Jigoku", elemento: "Camélia / Sombra", formatoArma: "Domínio monumental de pétalas negras", poder: "Congelamento cinético absoluto" },
      nomeZk: "Kurotsubaki: Kokuen Jigoku",
      isBankai: true,
      foto: "assets/ichigo-moon.png",
      onUpload: () => {}
    });
    console.log("TEST 3 PASSED: BleachSwordArt rendered Bankai SVG successfully!");
  `;
  vm.runInContext(code, sandbox);
} catch (e) {
  console.error("FAILED testing BleachSwordArt directly:", e);
  process.exit(1);
}

// Test FichaView with various subpages
try {
  const testChars = [
    {
      desc: "Character with active Shikai and active Bankai",
      char: {
        id: "char-1",
        nome: "Byakuya Kuchiki",
        atributos: { pressao: 80, forca: 70, velocidade: 85, resiliencia: 75 },
        zanpakuto: {
          nome: "Senbonzakura",
          shikaiAtiva: {
            nome: "Senbonzakura",
            comando: "Disperse-se",
            elemento: "Pétalas Cortantes",
            formatoArma: "Milhares de lâminas em formato de pétalas de cerejeira",
            poder: "Cortes omnidirecionais",
            espirito: "Um nobre guerreiro de armadura com máscara de cerejeira"
          },
          bankaiAtiva: {
            nome: "Senbonzakura Kageyoshi",
            comando: "Bankai",
            elemento: "Pétalas Cortantes Supremas",
            formatoArma: "Pilares monumentais de espadas que emergem do solo",
            poder: "Milhões de lâminas em velocidade supersônica",
            espirito: "O senhor supremo das flores de cerejeira"
          }
        },
        permissoes: { shikaiLiberada: false, bankaiLiberada: false }
      }
    },
    {
      desc: "Character without Shikai (Locked)",
      char: {
        id: "char-2",
        nome: "Ren Abarai",
        atributos: { pressao: 35, forca: 40, velocidade: 30, resiliencia: 35 },
        zanpakuto: { nome: "Zabimaru" },
        permissoes: { shikaiLiberada: false, bankaiLiberada: false }
      }
    },
    {
      desc: "Character with Shikai authorized for choice",
      char: {
        id: "char-3",
        nome: "Rukia Kuchiki",
        atributos: { pressao: 45, forca: 30, velocidade: 40, resiliencia: 35 },
        zanpakuto: { nome: "Sode no Shirayuki" },
        permissoes: { shikaiLiberada: true, bankaiLiberada: false }
      }
    }
  ];

  testChars.forEach((tc, idx) => {
    sandbox.currentCharTest = tc.char;
    sandbox.currentDbTest = { personagens: [tc.char] };
    
    // We test rendering FichaView in a block scope
    const code = `
      {
        const renderedFicha = React.createElement(FichaView, {
          db: currentDbTest,
          saveDb: () => {},
          personagem: currentCharTest,
          isAdmin: true,
          rankFisico: [{ id: currentCharTest.id, score: 35 }],
          rankPressao: [{ id: currentCharTest.id, score: 35 }]
        });
      }
    `;
    vm.runInContext(code, sandbox);
    console.log(`TEST 4.${idx + 1} PASSED: FichaView rendered with ${tc.desc}!`);
  });
} catch (e) {
  console.error("FAILED testing FichaView subpages:", e);
  process.exit(1);
}

console.log("\n>>> ALL SHIKAI & BANKAI RENDER TESTS PASSED 100%! <<<");
