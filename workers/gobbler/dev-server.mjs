// Local play server. Wrangler serves the Durable Object API on :8787.
// This process serves the static site and proxies /api/gobbler to that API,
// including WebSocket upgrades, so phones can share one origin.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PORT = Number(process.env.PORT || 4173);
const API = process.env.GOBBLER_API || "127.0.0.1";
const API_PORT = Number(process.env.GOBBLER_API_PORT || 8787);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

function safeFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  let rel = decoded === "/" ? "/index.html" : decoded;
  if (rel.endsWith("/")) rel += "index.html";
  const full = path.normalize(path.join(ROOT, rel));
  if (!full.startsWith(ROOT)) return null;
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  if (fs.existsSync(full + ".html") && fs.statSync(full + ".html").isFile()) return full + ".html";
  return null;
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/gobbler")) {
    const headers = { ...req.headers, host: `${API}:${API_PORT}` };
    const proxy = http.request(
      { hostname: API, port: API_PORT, path: req.url, method: req.method, headers },
      (upstream) => {
        res.writeHead(upstream.statusCode || 502, upstream.headers);
        upstream.pipe(res);
      }
    );
    proxy.on("error", () => {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "The game table is not running." }));
    });
    req.pipe(proxy);
    return;
  }
  const file = safeFile(req.url || "/");
  if (!file) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(file).pipe(res);
});

server.on("upgrade", (req, socket, head) => {
  if (!req.url.startsWith("/api/gobbler")) {
    socket.destroy();
    return;
  }
  const headers = { ...req.headers, host: `${API}:${API_PORT}` };
  const proxy = http.request({
    hostname: API,
    port: API_PORT,
    path: req.url,
    method: req.method,
    headers,
  });
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
  proxy.end();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Gobbler dev site http://127.0.0.1:${PORT}/gobbler/`);
});
