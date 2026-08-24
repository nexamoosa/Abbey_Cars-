const http = require('http');
const data = JSON.stringify({ email: 'admin@abbeycars.com', password: 'password' });
const opts = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/login.php',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};
const req = http.request(opts, (res) => {
  let body = '';
  console.log('LOGIN_STATUS', res.statusCode);
  console.log('LOGIN_HEADERS', res.headers);
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('LOGIN_BODY', body);
    let parsed;
    try { parsed = JSON.parse(body); } catch (e) { console.error('PARSE_ERROR', e); return; }
    const sid = parsed.session_id;
    const opts2 = {
      hostname: '127.0.0.1',
      port: 8000,
      path: '/api/bookings.php?status=active',
      method: 'GET',
      headers: { 'X-Session-Id': sid },
    };
    const req2 = http.request(opts2, (res2) => {
      let body2 = '';
      console.log('BOOKINGS_STATUS', res2.statusCode);
      console.log('BOOKINGS_HEADERS', res2.headers);
      res2.on('data', (chunk2) => body2 += chunk2);
      res2.on('end', () => console.log('BOOKINGS_BODY', body2));
    });
    req2.on('error', (e) => console.error('BOOKINGS_ERROR', e));
    req2.end();
  });
});
req.on('error', (err) => console.error('REQUEST_ERROR', err));
req.write(data);
req.end();
