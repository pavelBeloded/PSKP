import http from "http";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url"


const server = http.createServer((req, res) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const {method, url} = req;

  if(url === '/html' && method === "GET") {
    const filePath = path.join(__dirname, 'index.html');
    fs.readFile(filePath, (err, data) => {

      if(err) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end('File Not Found');
        return;
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);

    })
  }

  if(url === '/png' && method === "GET") {
    const imgPath = path.join(__dirname, 'image.png');

    fs.readFile(imgPath, (err, data) => {
      if(err) {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end('File Not Found');
        return;
      }

      res.writeHead(200, {"Content-Type": "image/png"});
      res.end(data);
    })
  }

})


server.listen(5000, ()=> {
  console.log("Server started on port 5000");
})