const test = require('tap').test;
const strat = require('..');
const http = require('http');
const request = require('request');

test('malformed uri', (t) => {
  const server = http.createServer(strat(__dirname));

  t.plan(2);

  server.listen(0, () => {
    request.get(`http://localhost:${server.address().port}/%`, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 400);
      server.close(() => { t.end(); });
    });
  });
});

