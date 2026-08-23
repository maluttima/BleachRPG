const https = require('https');

async function testAI() {
  const prompt = 'Gere uma resposta em formato JSON estrito: {"status":"sucesso","zanpakuto":{"nome":"Kurokaze","kanji":"黒風","traducao":"Vento Negro","comando":"Corte a escuridão, Kurokaze"}}';
  
  const body = JSON.stringify({
    messages: [{ role: 'user', content: prompt }],
    model: 'openai',
    jsonMode: true
  });

  const req = https.request('https://text.pollinations.ai/openai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    },
    timeout: 10000
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      try {
        const parsed = JSON.parse(data);
        console.log('Choices Content:', parsed.choices?.[0]?.message?.content);
      } catch (e) {
        console.log('Raw output:', data.slice(0, 200));
      }
    });
  });

  req.on('error', (err) => console.log('Fetch error:', err.message));
  req.write(body);
  req.end();
}

testAI();
