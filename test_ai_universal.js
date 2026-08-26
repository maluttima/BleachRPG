const https = require('https');

function cleanAndExtractJson(text) {
  if (!text || typeof text !== 'string') return null;
  let clean = text.trim();
  
  // Remove markdown fences
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  
  // Find outermost JSON brackets
  const firstBrace = clean.indexOf('{');
  const firstBracket = clean.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    endIdx = clean.lastIndexOf('}');
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    endIdx = clean.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const jsonSub = clean.slice(startIdx, endIdx + 1);
    try {
      return JSON.parse(jsonSub);
    } catch (e) {
      // Try regex fixes for unescaped newlines or trailing commas
      try {
        const sanitized = jsonSub
          .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => (c === '\n' || c === '\r' || c === '\t') ? c : '');
        return JSON.parse(sanitized);
      } catch (e2) {}
    }
  }

  try {
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

async function requestHttps(urlStr, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 15000
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          headers: res.headers,
          text: async () => data,
          json: async () => JSON.parse(data)
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout de rede atingido (15s)'));
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function callSpiritualAI({ prompt, systemPrompt, temperature = 0.88, apiKey = "", fetchFn = null }) {
  const customFetch = fetchFn || (typeof fetch !== 'undefined' ? fetch : requestHttps);
  const trimmedKey = (apiKey || "").trim();

  if (!trimmedKey) {
    return { ok: false, error: "Nenhuma chave de API fornecida.", provider: "Nenhum" };
  }

  // 1. GROQ (gsk_...)
  if (trimmedKey.startsWith("gsk_")) {
    try {
      const res = await customFetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${trimmedKey}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: (systemPrompt || "Você é um mestre narrador de Bleach RPG. Responda ESTRITAMENTE em formato JSON válido.") },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature
        })
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        const parsed = cleanAndExtractJson(content);
        if (parsed) {
          return { ok: true, data: parsed, provider: "Groq", model: "llama-3.3-70b-versatile" };
        }
      }
      return { ok: false, error: `Groq HTTP ${res.status}: ${await res.text()}`, provider: "Groq" };
    } catch (err) {
      return { ok: false, error: `Groq falhou: ${err.message}`, provider: "Groq" };
    }
  }

  // 2. OPENROUTER (sk-or-...)
  if (trimmedKey.startsWith("sk-or-")) {
    try {
      const res = await customFetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${trimmedKey}`,
          "HTTP-Referer": "https://bleach-rpg.web.app",
          "X-Title": "Bleach RPG Sociedade das Almas"
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            { role: "system", content: (systemPrompt || "Você é um mestre narrador de Bleach RPG. Responda ESTRITAMENTE em formato JSON válido.") },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature
        })
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        const parsed = cleanAndExtractJson(content);
        if (parsed) {
          return { ok: true, data: parsed, provider: "OpenRouter", model: "gemini-2.0-flash-001" };
        }
      }
      return { ok: false, error: `OpenRouter HTTP ${res.status}: ${await res.text()}`, provider: "OpenRouter" };
    } catch (err) {
      return { ok: false, error: `OpenRouter falhou: ${err.message}`, provider: "OpenRouter" };
    }
  }

  // 3. OPENAI STANDARD (sk-...)
  if (trimmedKey.startsWith("sk-")) {
    try {
      const res = await customFetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${trimmedKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: (systemPrompt || "Você é um mestre narrador de Bleach RPG. Responda ESTRITAMENTE em formato JSON válido.") },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature
        })
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        const parsed = cleanAndExtractJson(content);
        if (parsed) {
          return { ok: true, data: parsed, provider: "OpenAI", model: "gpt-4o-mini" };
        }
      }
      return { ok: false, error: `OpenAI HTTP ${res.status}: ${await res.text()}`, provider: "OpenAI" };
    } catch (err) {
      return { ok: false, error: `OpenAI falhou: ${err.message}`, provider: "OpenAI" };
    }
  }

  // 4. GOOGLE GEMINI (AIza... ou formato genérico)
  const geminiModels = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-2.0-flash",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash-8b",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-2.5-flash"
  ];
  let lastErr = "";

  for (const model of geminiModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(trimmedKey)}`;
      const res = await customFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: (systemPrompt ? `${systemPrompt}\n\n` : "") + prompt + "\n\nResponda ESTRITAMENTE em formato JSON válido conforme solicitado." }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature
          }
        })
      });

      if (res.ok) {
        const json = await res.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = cleanAndExtractJson(rawText);
        if (parsed) {
          return { ok: true, data: parsed, provider: "Google Gemini", model };
        }
      } else {
        const errText = await res.text();
        lastErr = `HTTP ${res.status} em ${model}: ${errText.slice(0, 150)}`;
        if (res.status === 401 || res.status === 403) {
          // Key is definitely invalid, no point retrying other models
          break;
        }
      }
    } catch (err) {
      lastErr = `${model} erro: ${err.message}`;
    }
  }

  return { ok: false, error: lastErr || "Não foi possível obter resposta de IA.", provider: "Google Gemini" };
}

console.log("cleanAndExtractJson test:", cleanAndExtractJson("```json\n{\"test\": 123}\n```"));
