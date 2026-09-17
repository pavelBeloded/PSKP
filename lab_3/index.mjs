import http from "http";
import {fileURLToPath} from "node:url";
import * as path from "node:path";
import * as fs from "node:fs";
import * as readline from "node:readline";


const STATES = ['norm', 'stop', 'test', 'idle']

let serverState = STATES[0];

let sseClients = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function updatePrompt() {
  rl.setPrompt(`${serverState} --> `)
  rl.prompt();
}

rl.on("line", (line) => {
  const input = line.trim();

  if (input === "exit") {
    console.log("Stopping the server...");
    process.exit(0)
  }

  if (STATES.includes(input)) {
    serverState = input;

    sseClients.forEach(client => {
      client.write(`data: ${serverState}\n\n`);
    })
  } else {
    console.log(`Error unknown state : ${input}`);
  }

  updatePrompt();
})

const server = http.createServer((req, res) => {

  const {method, url} = req;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  if(url === '/events') {
    res.writeHead(200, {
      "Content-Type": 'text/event-stream',
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    })

    res.write(`data: ${serverState}\n\n`);

    sseClients.push(res);

    req.on('close', ()=> {
      sseClients = sseClients.filter(client => client !== res);
    })
    return
  }

  if(url === '/' && method === 'GET') {
    const filePath = path.join(__dirname, 'index.html');
      fs.readFile(filePath, (err, data) => {
      res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
      res.end(data);
    })
    return
  }

  res.writeHead(404, {"Content-Type": "text/plain"});
  res.end("Not Found");

})


server.listen(5000, ()=> {
  console.log("Server is started on http://localhost:5000 ");
  updatePrompt();
});
