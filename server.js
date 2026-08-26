const http = require('http');
const fs = require('fs');
const path = require('path');
const engine = require('./spiritual_engine.js');

const PORT = process.env.PORT || 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function readServerSecretKey() {
  let key = (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || "").trim();
  if (!key) {
    try {
      const configPath = path.join(__dirname, 'config.json');
      if (fs.existsSync(configPath)) {
        const cfg = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (cfg.openaiApiKey && cfg.openaiApiKey.trim().length > 15) {
          key = cfg.openaiApiKey.trim();
        }
      }
    } catch(e) {}
  }
  return key;
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // API 1: /api/ai or /api/executarGeracaoIA
  if ((urlPath === '/api/ai' || urlPath === '/api/executarGeracaoIA') && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { prompt, systemPrompt, temperature, apiKey } = payload;
        
        const serverKey = (apiKey && apiKey.trim().length > 15) ? apiKey.trim() : readServerSecretKey();
        if (!serverKey) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: "Nenhuma chave de IA configurada no servidor." }));
          return;
        }

        const result = await engine.callSpiritualAI({
          prompt,
          systemPrompt,
          temperature: typeof temperature === 'number' ? temperature : 0.88,
          apiKey: serverKey
        });

        res.writeHead(result.ok ? 200 : 502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // API 2: /api/statusIA
  if (urlPath === '/api/statusIA' && req.method === 'GET') {
    const key = readServerSecretKey();
    if (!key) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ativa: false, mensagem: "Nenhuma chave configurada no servidor." }));
      return;
    }
    const testRes = await engine.testSpiritualAIConnection(key);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      ativa: testRes.ok,
      provider: testRes.provider,
      model: testRes.model,
      latencyMs: testRes.latencyMs,
      mensagem: testRes.mensagem
    }));
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : urlPath);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Bleach RPG Server running at http://localhost:${PORT}/ (AI Proxy enabled)`);
});

