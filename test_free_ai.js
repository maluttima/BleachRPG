const https = require('https');

const prompt = 'Gere um objeto JSON com o campo status igual a ok';

const postData = JSON.stringify({
  messages: [
    { role: 'system', content: 'Você é um narrador de Bleach RPG. Responda APENAS em JSON válido.' },
    { role: 'user', content: prompt }
  ],
  model: 'openai',
  jsonMode: true
});

const req = https.request('https://text.pollinations.ai/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Pollinations Status:', res.statusCode);
    console.log('Pollinations Response:', body);
  });
});

req.on('error', err => {
  console.log('Pollinations Error:', err);
});

req.write(postData);
req.end();
