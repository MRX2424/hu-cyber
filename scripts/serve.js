#!/usr/bin/env node
"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const projectRoot = path.resolve(__dirname, "..");
const port = Number.parseInt(process.env.PORT, 10) || 4173;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function resolvePath(requestUrl) {
  const parsedUrl = url.parse(requestUrl);
  const decodedPath = decodeURIComponent(parsedUrl.pathname || "/");
  let relativePath = decodedPath;

  if (relativePath.endsWith("/")) {
    relativePath = path.join(relativePath, "index.html");
  }

  const absolutePath = path.join(projectRoot, relativePath);

  if (!absolutePath.startsWith(projectRoot)) {
    return null;
  }

  return absolutePath;
}

function sendResponse(res, statusCode, headers, bodyStream) {
  res.writeHead(statusCode, headers);
  if (bodyStream instanceof fs.ReadStream) {
    bodyStream.pipe(res);
  } else if (bodyStream) {
    res.end(bodyStream);
  } else {
    res.end();
  }
}

function serveFile(filePath, res) {
  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === "ENOENT") {
        sendResponse(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "404 Not Found\n");
      } else {
        sendResponse(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "500 Internal Server Error\n");
      }
      return;
    }

    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, "index.html");
      serveFile(indexPath, res);
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";

    const stream = fs.createReadStream(filePath);
    stream.on("open", () => {
      sendResponse(res, 200, { "Content-Type": contentType }, stream);
    });
    stream.on("error", () => {
      sendResponse(res, 500, { "Content-Type": "text/plain; charset=utf-8" }, "500 Internal Server Error\n");
    });
  });
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    sendResponse(res, 400, { "Content-Type": "text/plain; charset=utf-8" }, "400 Bad Request\n");
    return;
  }

  const filePath = resolvePath(req.url);

  if (!filePath) {
    sendResponse(res, 403, { "Content-Type": "text/plain; charset=utf-8" }, "403 Forbidden\n");
    return;
  }

  serveFile(filePath, res);
});

server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});

server.listen(port, () => {
  console.log(`HU Cybersecurity Web Academy running at http://localhost:${port}`);
  console.log(`Serving static files from ${projectRoot}`);
});

function shutdown() {
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
