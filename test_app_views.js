const fs = require('fs');
const vm = require('vm');

const appJs = fs.readFileSync('app.js', 'utf8');

// Virtual browser DOM and React environment
let rootRendered = null;

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
          if (type.prototype && (type.prototype.render || type.prototype.isReactComponent)) {
            const inst = new type({ ...(props || {}), children });
            return inst.render ? inst.render() : inst;
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
      render: (element) => {
        rootRendered = element;
      },
    }),
  },
};
sandbox.window = sandbox;

try {
  vm.createContext(sandbox);
  vm.runInContext(appJs, sandbox);
  console.log("TEST 1 PASSED: Full app.js loaded and evaluated in virtual DOM!");
} catch (e) {
  console.error("FATAL ERROR in app.js:", e);
  process.exit(1);
}

// TEST 2: Test KidosView with null character (visitor logged out)
try {
  const code = `
    const renderedKidosNull = React.createElement(KidosView, { personagem: null, isAdmin: false });
    console.log("TEST 2 PASSED: KidosView rendered successfully with null character (logged out)!");
  `;
  vm.runInContext(code, sandbox);
} catch (e) {
  console.error("TEST 2 FAILED:", e);
  process.exit(1);
}

// TEST 3: Test KidosView with character
try {
  const code = `
    const testChar = {
      id: "ren-001",
      nome: "Ren Abarai",
      atributos: { pressao: 35, forca: 40, velocidade: 30, resiliencia: 35 },
      zanpakuto: { nome: "Zabimaru", shikai: true, bankai: false }
    };
    const renderedKidosRen = React.createElement(KidosView, { personagem: testChar, isAdmin: false });
    console.log("TEST 3 PASSED: KidosView rendered successfully for character Ren!");
  `;
  vm.runInContext(code, sandbox);
} catch (e) {
  console.error("TEST 3 FAILED:", e);
  process.exit(1);
}

// TEST 4: Test FichaView with Shikai and Bankai states
try {
  const code = `
    const testCharFull = {
      id: "ren-001",
      nome: "Ren Abarai",
      atributos: { pressao: 35, forca: 40, velocidade: 30, resiliencia: 35 },
      zanpakuto: { 
        nome: "Zabimaru", 
        shikaiAtiva: {
          nome: "Zabimaru",
          comando: "Uive",
          elemento: "Aço Articulado",
          formatoArma: "Lâmina segmentada em dentes de serpente",
          poder: "Extensão e chicotada de longo alcance",
          espirito: "Um babuíno branco com cauda de serpente"
        },
        bankaiAtiva: null
      },
      permissoes: { shikaiLiberada: true, bankaiLiberada: true }
    };
    const dbTest = { personagens: [testCharFull] };
    const renderedFicha = React.createElement(FichaView, {
      db: dbTest,
      saveDb: () => {},
      personagem: testCharFull,
      isAdmin: true,
      rankFisico: [{ id: "ren-001", score: 35 }],
      rankPressao: [{ id: "ren-001", score: 35 }]
    });
    console.log("TEST 4 PASSED: FichaView rendered successfully with Shikai and Bankai states!");
  `;
  vm.runInContext(code, sandbox);
} catch (e) {
  console.error("TEST 4 FAILED:", e);
  process.exit(1);
}

console.log("\n>>> ALL VERIFICATION TESTS COMPLETED WITH 100% SUCCESS! <<<");
