const fs = require('fs');
const vm = require('vm');

const appJs = fs.readFileSync('app.js', 'utf8');

// Mock browser globals
const sandbox = {
  window: {},
  document: {
    getElementById: () => null,
    addEventListener: () => {},
  },
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  Math: Math,
  Date: Date,
  localStorage: {
    getItem: () => null,
    setItem: () => {},
  },
  navigator: {
    clipboard: {
      writeText: () => Promise.resolve(),
    }
  },
  React: {
    useState: (init) => [init, () => {}],
    useEffect: () => {},
    useRef: (init) => ({ current: init }),
    useMemo: (fn) => fn(),
    useCallback: (fn) => fn,
    createElement: (type, props, ...children) => ({ type, props, children }),
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
  console.log("SUCCESS: app.js loaded and evaluated in virtual browser context without any syntax or initialization errors!");
} catch (e) {
  console.error("RUNTIME ERROR in app.js:", e);
  process.exit(1);
}
