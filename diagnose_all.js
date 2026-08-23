const fs = require('fs');
const vm = require('vm');

const appJs = fs.readFileSync('app.js', 'utf8');

// 1. Check with a comprehensive virtual sandbox
const sandbox = {
  window: {},
  document: {
    getElementById: (id) => ({ id, innerHTML: '', appendChild: () => {} }),
    addEventListener: () => {},
    createElement: (tag) => ({ style: {}, className: '', appendChild: () => {} }),
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
    removeItem: () => {},
    clear: () => {},
  },
  navigator: {
    clipboard: {
      writeText: () => Promise.resolve(),
    }
  },
  AudioContext: function() {
    return {
      state: 'running',
      currentTime: 0,
      createOscillator: () => ({
        type: 'sine',
        frequency: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {},
        start: () => {},
        stop: () => {},
      }),
      createGain: () => ({
        gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
        connect: () => {},
      }),
      destination: {},
      resume: () => Promise.resolve(),
    };
  },
  React: {
    useState: (init) => {
      const val = typeof init === 'function' ? init() : init;
      return [val, () => {}];
    },
    useEffect: (fn) => {
      try {
        if (fn) fn();
      } catch (e) {
        console.error("useEffect error:", e);
        throw e;
      }
    },
    useRef: (init) => ({ current: init }),
    useMemo: (fn) => fn(),
    useCallback: (fn) => fn,
    createElement: (type, props, ...children) => {
      if (typeof type === 'function') {
        try {
          return type({ ...(props || {}), children });
        } catch (e) {
          console.error(`ERROR rendering component ${type.name || 'Anonymous'}:`, e);
          throw e;
        }
      }
      return { type, props, children };
    },
  },
  ReactDOM: {
    createRoot: () => ({
      render: (elem) => {
        // Evaluate the root element
        if (typeof elem.type === 'function') {
          elem.type(elem.props || {});
        }
      },
    }),
  },
};
sandbox.window = sandbox;

try {
  vm.createContext(sandbox);
  vm.runInContext(appJs, sandbox);
  console.log("✓ vm.runInContext loaded without initial syntax/exec error.");
} catch (e) {
  console.error("✗ Initial load failed:", e);
}

// Check all global functions in sandbox
const globalKeys = Object.keys(sandbox);
console.log("Global keys defined:", globalKeys.filter(k => !['window', 'document', 'fetch', 'console', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Math', 'Date', 'localStorage', 'navigator', 'AudioContext', 'React', 'ReactDOM'].includes(k)));

// Run test renders for all components
const testChar = {
  id: "test-001",
  nome: "Kurosaki Test",
  foto: "assets/ichigo-orange.png",
  whatsapp: "11999998888",
  codigo: "TEST-1234",
  raca: "Shinigami",
  esquadrao: "11º Esquadrão",
  faceclaim: "Ichigo",
  idadePlayer: "20",
  aniversarioPlayer: "01/01",
  idadeChar: "18",
  aniversarioChar: "15/07",
  pontosDisponiveis: 10,
  sorteiosComunsRestantes: 5,
  sorteiosEspeciaisRestantes: 2,
  sorteiosDrops: [],
  permissoes: { shikaiLiberada: true, bankaiLiberada: true },
  atributos: { pressao: 45, forca: 30, velocidade: 60, resiliencia: 25 },
  kidosConhecidos: [{ id: "h4", numero: 4, nome: "Byakurai", cat: "Hadō", custoReiatsu: 3 }],
  tecnicas: [{ id: "t-1", nome: "Corte Rápido", categoria: "Zanjutsu" }],
  personalidade: {
    texto: "Determinado", virtudes: "Foco", defeitos: "Orgulho",
    desejos: "Proteger", medos: "Fracasso", conflitos: "Dever", estiloCombate: "Veloz"
  },
  personalidadeTravada: true,
  zanpakuto: {
    nome: "Zangetsu",
    fotoShikai: "assets/ichigo-orange.png",
    fotoBankai: "assets/ichigo-moon.png",
    shikaiAtiva: {
      nome: "Zangetsu", comando: "Corte", elemento: "Energia Espiritual",
      formatoArma: "Cutelo colossal", poder: "Getsuga Tenshō", espirito: "Velho Zangetsu",
      indices: { potencia: 9, alcance: 7, complexidade: 5, versatilidade: 6, custo: 6 }
    },
    bankaiAtiva: {
      nome: "Tensa Zangetsu", comando: "Bankai", tipoEvolucao: "Condensação",
      forma: "Daito negra fina", poder: "Supercompressão de Reiatsu",
      indices: { potencia: 10, alcance: 8, complexidade: 6, versatilidade: 7, custo: 8 }
    }
  },
  estado: "Inteiro",
  treinosHoje: 0,
  historico: [{ id: "h1", data: "01/01/2026", texto: "Criado" }]
};

const mockDb = {
  superAdminUsuario: "Malu123",
  superAdminSenha: "Sociedade2026",
  superAdminNome: "ADM Máximo",
  firebaseUrl: "",
  subAdms: [],
  registrosTarefasAdm: [],
  combatesArena: [],
  rolagensDadosPublicas: [],
  mensagensChat: [],
  zanpakutosVinculadas: [],
  personagens: [testChar]
};

const componentsToTest = [
  'App',
  'HeaderNav',
  'PersonagensView',
  'RankingView',
  'FichaView',
  'KidosView',
  'GachaView',
  'CombateView',
  'ArenaView',
  'MestreView',
  'RegrasView',
  'PatchNotesView',
  'LoreView',
  'ChatView',
  'ModalLogin',
  'BleachSwordArt'
];

for (const compName of componentsToTest) {
  try {
    const code = `
      if (typeof ${compName} !== 'undefined') {
        const props = {
          db: ${JSON.stringify(mockDb)},
          saveDb: () => {},
          personagem: ${JSON.stringify(testChar)},
          usuarioLogado: ${JSON.stringify(testChar)},
          setUsuarioLogado: () => {},
          isAdmin: true,
          isSuperAdmin: true,
          aba: "${compName.toLowerCase()}",
          setAba: () => {},
          rankFisico: [{ id: "test-001", score: 35 }],
          rankPressao: [{ id: "test-001", score: 35 }]
        };
        const el = React.createElement(${compName}, props);
        console.log("✓ Component ${compName} rendered successfully");
      } else {
        console.warn("? Component ${compName} is undefined in scope");
      }
    `;
    vm.runInContext(code, sandbox);
  } catch (err) {
    console.error(`✗ Component ${compName} failed with error:`, err.message);
  }
}
