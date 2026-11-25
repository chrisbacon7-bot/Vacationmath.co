import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = Number(process.env.PORT || 4174);
const API_PORT = Number(process.env.TRUTH_API_PORT || 8788);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function safeFile(urlPath) {
  let rel = decodeURIComponent((urlPath || "/").split("?")[0]);
  if (rel === "/") rel = "/index.html";
  if (rel.endsWith("/")) rel += "index.html";
  const full = path.normalize(path.join(ROOT, rel));
  if (!full.startsWith(ROOT)) return null;
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  if (fs.existsSync(full + ".html")) return full + ".html";
  return null;
}

function quiet(stream) {
  if (stream && stream.on) stream.on("error", () => {});
}

const server = http.createServer((req, res) => {
  if ((req.url || "").startsWith("/api/truth")) {
    const proxy = http.request(
      { hostname: "127.0.0.1", port: API_PORT, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${API_PORT}` } },
      (upstream) => { res.writeHead(upstream.statusCode || 502, upstream.headers); upstream.pipe(res); }
    );
    proxy.on("error", () => {
      if (!res.headersSent) res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "The game table is not running." }));
    });
    quiet(proxy); quiet(res); quiet(req);
    req.pipe(proxy);
    return;
  }
  const file = safeFile(req.url);
  if (!file) { res.writeHead(404, { "content-type": "text/plain" }); res.end("Not found"); return; }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(res);
});

server.on("upgrade", (req, socket, head) => {
  if (!(req.url || "").startsWith("/api/truth")) { socket.destroy(); return; }
  const proxy = http.request({ hostname: "127.0.0.1", port: API_PORT, path: req.url, method: req.method, headers: { ...req.headers, host: `127.0.0.1:${API_PORT}` } });
  proxy.on("upgrade", (proxyRes, proxySocket, proxyHead) => {
    const lines = [`HTTP/1.1 ${proxyRes.statusCode} ${proxyRes.statusMessage || ""}`.trim()];
    for (const [key, value] of Object.entries(proxyRes.headers)) {
      if (Array.isArray(value)) value.forEach((v) => lines.push(`${key}: ${v}`));
      else if (value != null) lines.push(`${key}: ${value}`);
    }
    socket.write(lines.join("\r\n") + "\r\n\r\n");
    if (proxyHead.length) socket.write(proxyHead);
    if (head.length) proxySocket.write(head);
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });
  proxy.on("error", () => socket.destroy());
  quiet(socket); quiet(proxy);
  proxy.end();
});
server.on("clientError", (err, socket) => { quiet(socket); socket.destroy(); });

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Truth or Turkey dev site http://127.0.0.1:${PORT}/truth-or-turkey/`);
});
