const test = require('tap').test;
const strat = require('..');
const http = require('http');
const request = require('request');
const mkdirp = require('mkdirp');
const path = require('path');

const root = `${__dirname}/public`;
const baseDir = 'base';

mkdirp.sync(`${root}/emptyDir`);

const cases = require('./fixtures/common-cases-error');

test('core', (t) => {
  const filenames = Object.keys(cases);
  const port = Math.floor((Math.random() * ((1 << 16) - 1e4)) + 1e4);

  const server = http.createServer(
    strat({
      root,
      gzip: true,
      baseDir,
      autoIndex: true,
      showDir: true,
      handleError: false,
    })
  );

  server.listen(port, () => {
    let pending = filenames.length;
    filenames.forEach((file) => {
      const uri = `http://localhost:${port}${path.join('/', baseDir, file)}`;
      const headers = cases[file].headers || {};

      request.get({
        uri,
        followRedirect: false,
        headers,
      }, (err, res, body) => {
        if (err) {
          t.fail(err);
        }
        const r = cases[file];
        t.equal(res.statusCode, r.code, `status code for \`${file}\``);

        if (r.type !== undefined) {
          t.equal(
            res.headers['content-type'].split(';')[0], r.type,
            `content-type for \`${file}\``
          );
        }

        if (r.body !== undefined) {
          t.equal(body, r.body, `body for \`${file}\``);
        }

        if (r.location !== undefined) {
          t.equal(res.headers.location, path.join('/', baseDir, r.location), `location for \`${file}\``);
        }

        pending -= 1;
        if (pending === 0) {
          server.close();
          t.end();
        }
      });
    });
  });
});
