const https = require('https');
const key = 'AQ.Ab8RN6I0r1qN15nnRQd-JIGbEngIBLFHI7-7A8S6NEgAfR_3QA';

async function testGemini(model) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      contents: [
        {
          parts: [{ text: 'Gere um JSON simples: {"mensagem": "Gemini Funcionando 100%"}' }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });

    const req = https.request(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        resolve({ model, status: res.statusCode, body });
      });
    });

    req.on('error', err => resolve({ model, status: 'error', error: err }));
    req.write(postData);
    req.end();
  });
}

(async () => {
  const models = ['gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest', 'gemini-2.5-flash-lite'];
  for (const m of models) {
    const res = await testGemini(m);
    console.log(`Model: ${res.model} -> Status: ${res.status}`);
    if (res.status === 200) {
      console.log(`✓ SUCESSO NO MODELO ${res.model}! Resposta:`, JSON.parse(res.body).candidates?.[0]?.content?.parts?.[0]?.text);
      break;
    }
  }
})();
