import http from "http";
import { fileURLToPath } from "node:url";
import * as path from "node:path";
import * as fs from "node:fs";
import {fibonacci, fibonacciAsync, fibonacciImmediate} from "./fibonacci.mjs";
import { addClient, removeClient, broadcast } from "./sse.mjs";
import { createStateCli } from "./cli.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;

const stateCli = createStateCli({
  onStateChange: (state) => broadcast(state),
});

function sendFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

function sendJson(res, data) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function parseKParam(parsedUrl) {
  const kParam = parsedUrl.searchParams.get("k");
  if (kParam === null || isNaN(+kParam)) return null;
  return parseInt(kParam, 10);
}

function handleSse(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  res.write(`data: ${stateCli.getState()}\n\n`);
  addClient(res);

  req.on("close", () => removeClient(res));
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (url === "/events") {
    handleSse(req, res);
    return;
  }

  if (url === "/" && method === "GET") {
    sendFile(res, path.join(__dirname, "index.html"), "text/html; charset=utf-8");
    return;
  }

  if (url === "/benchmark.js") {
    sendFile(res, path.join(__dirname, "benchmark.js"), "text/javascript; charset=utf-8");
    return;
  }

  if (url === "/status.js") {
    sendFile(res, path.join(__dirname, "status.js"), "text/javascript; charset=utf-8");
    return;
  }

  const parsedUrl = new URL(url, `http://${req.headers.host}`);

  if (parsedUrl.pathname === "/fact" && method === "GET") {
    const k = parseKParam(parsedUrl);

    if (k === null) {
      sendJson(res, { error: "Parameter 'k' is required and must be a number" });
      return;
    }

    sendJson(res, { k, fact: fibonacci(k) });
    return;
  }

  if (parsedUrl.pathname === "/factAsync" && method === "GET") {
    const k = parseKParam(parsedUrl);

    if (k === null) {
      sendJson(res, { error: "Parameter 'k' is required and must be a number" });
      return;
    }

    sendJson(res, { k, fact: await fibonacciAsync(k) });
    return;
  }

  if (parsedUrl.pathname === "/factAsync" && method === "GET") {
    const k = parseKParam(parsedUrl);

    if (k === null) {
      sendJson(res, { error: "Parameter 'k' is required and must be a number" });
      return;
    }

    sendJson(res, { k, fact: await fibonacciAsync(k) });
    return;
  }

  if (parsedUrl.pathname === "/factImmediate" && method === "GET") {
    const k = parseKParam(parsedUrl);

    if (k === null) {
      sendJson(res, { error: "Parameter 'k' is required and must be a number" });
      return;
    }

    sendJson(res, { k, fact: await fibonacciImmediate(k) });
    return;
  }

  if (parsedUrl.pathname === "/factPage" && method === "GET") {
    sendFile(res, path.join(__dirname, "fact.html"), "text/html; charset=utf-8");
    return;
  }

  if (parsedUrl.pathname === "/factPageAsync" && method === "GET") {
    sendFile(res, path.join(__dirname, "factAsync.html"), "text/html; charset=utf-8");
    return;
  }

  if(parsedUrl.pathname === "/factPageImmediate" && method === "GET") {
    sendFile(res, path.join(__dirname, "factImmediate.html"), "text/html; charset=utf-8");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, () => {
  console.log(`Server is started on http://localhost:${PORT}`);
  stateCli.start();
});
