const http = require('http');
const data = JSON.stringify({
  email: 'admin@abbeycars.com',
  password: 'password'
});

const options = {
  hostname: 'localhost',
  port: 80,
  path: '/Abbey_Cars/api/login.php',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('HEADERS', res.headers);
    console.log('BODY', body);
  });
});

req.on('error', (err) => {
  console.error('ERROR', err.message);
});

req.write(data);
req.end();
