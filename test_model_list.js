const https = require('https');

// Test with list models endpoint
async function listModels(key) {
  return new Promise((resolve) => {
    const req = https.request(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`, {
      method: 'GET'
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        resolve({ status: res.statusCode, body });
      });
    });
    req.on('error', err => resolve({ status: 'error', error: err }));
    req.end();
  });
}

(async () => {
  // Let's test
  const testKey = 'AIzaSy...'; // just testing endpoint structure
  console.log('Testing model list endpoint format...');
})();
