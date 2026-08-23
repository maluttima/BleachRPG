const https = require('https');

async function testPollinationsGET() {
  const prompt = encodeURIComponent('Gere em JSON estrito: {"nome":"Kurokaze","comando":"Corte, Kurokaze"}');
  https.get(`https://text.pollinations.ai/${prompt}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('GET Status:', res.statusCode);
      console.log('GET Data:', data.slice(0, 300));
    });
  }).on('error', err => console.log('GET err:', err.message));
}

testPollinationsGET();
