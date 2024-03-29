const test = require('tap').test;
const http = require('http');
const request = require('request');
const strat = require('..');

test('default default contentType', (t) => {
  let server = null;
  try {
    server = http.createServer(strat({
      root: `${__dirname}/public/`,
      contentType: 'text/plain',
    }));
  } catch (e) {
    t.fail(e.message);
    t.end();
  }

  t.plan(3);

  server.listen(0, () => {
    const port = server.address().port;
    request.get(`http://localhost:${port}/f_f`, (err, res) => {
      t.ifError(err);
      t.equal(res.statusCode, 200);
      t.equal(res.headers['content-type'], 'text/plain');
      server.close(() => { t.end(); });
    });
  });
});
