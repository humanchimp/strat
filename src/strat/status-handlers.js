import he from "he";

export default {
  // not modified
  304: res => {
    res.statusCode = 304;
    res.end();
  },

  // access denied
  403: (res, next) => {
    res.statusCode = 403;
    if (typeof next === "function") {
      next();
    } else if (res.writable) {
      res.setHeader("content-type", "text/plain");
      res.end("ACCESS DENIED");
    }
  },

  // disallowed method
  405: (res, next, opts) => {
    res.statusCode = 405;
    if (typeof next === "function") {
      next();
    } else {
      res.setHeader("allow", (opts && opts.allow) || "GET, HEAD");
      res.end();
    }
  },

  // not found
  404: (res, next) => {
    res.statusCode = 404;
    if (typeof next === "function") {
      next();
    } else if (res.writable) {
      res.setHeader("content-type", "text/plain");
      res.end("File not found. :(");
    }
  },

  // range error
  416: (res, next) => {
    res.statusCode = 416;
    if (typeof next === "function") {
      next();
    } else if (res.writable) {
      res.setHeader("content-type", "text/plain");
      res.end("Requested range not satisfiable");
    }
  },

  // flagrant error
  500: (res, next, opts) => {
    res.statusCode = 500;

    if (!opts.handleError && next) {
      next(opts.error);
      return;
    }

    if (res.headersSent) {
      res.destroy();
      return;
    }

    res.setHeader("content-type", "text/html");
    const error = String(
      opts.error.stack || opts.error || "No specified error"
    );
    const html = `${[
      "<!doctype html>",
      "<html>",
      "  <head>",
      '    <meta charset="utf-8">',
      "    <title>500 Internal Server Error</title>",
      "  </head>",
      "  <body>",
      "    <p>",
      `      ${he.encode(error)}`,
      "    </p>",
      "  </body>",
      "</html>"
    ].join("\n")}\n`;
    res.end(html);
  },

  // bad request
  400: (res, next, opts) => {
    res.statusCode = 400;
    if (typeof next === "function") {
      next();
    } else {
      res.setHeader("content-type", "text/html");
      const error =
        opts && opts.error ? String(opts.error) : "Malformed request.";
      const html = `${[
        "<!doctype html>",
        "<html>",
        "  <head>",
        '    <meta charset="utf-8">',
        "    <title>400 Bad Request</title>",
        "  </head>",
        "  <body>",
        "    <p>",
        `      ${he.encode(error)}`,
        "    </p>",
        "  </body>",
        "</html>"
      ].join("\n")}\n`;
      res.end(html);
    }
  }
};
