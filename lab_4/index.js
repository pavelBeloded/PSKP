import http from "http";
import { insert, select, update, delet } from "./db.js";
import {parseParams, parseUrl, sendError, sendJson, readJsonBody, serveFile} from "http-lab-kit";
import {fileURLToPath} from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async (req, res) => {
    const url = parseUrl(req);

  if (url.pathname === "/page.js") {
    serveFile(res, path.join(__dirname, "page.js"), "text/javascript; charset=utf-8");
    return;
  }

  if (url.pathname === "/pageActions.js") {
    serveFile(res, path.join(__dirname, "pageActions.js"), "text/javascript; charset=utf-8");
    return;
  }

    if (url.pathname === '/') {

      const filepath = path.join(__dirname, 'index.html')
      serveFile(res, filepath, "text/html")
      return;
    }
  try {
    if (url.pathname === '/api/db') {

      if (req.method === 'GET') {
        const db = await select();
        sendJson(res, db);
        return;
      }

      if (req.method === 'POST') {
        try {
          const body_json = await readJsonBody(req);
          console.log(body_json);
          const newRow = await insert(body_json);
          sendJson(res, newRow);
        } catch (err) {
          sendError(res, err.message, 400);
        }
        return;
      }

      if (req.method === 'PUT') {
        try {
          const row = await readJsonBody(req);
          const updatedRow = await update(row);

          if (!updatedRow) {
            return sendError(res, `Instance not found`, 404);
          }

          sendJson(res, updatedRow);
        } catch (err) {
          sendError(res, err.message, 400);
        }
        return;
      }

      if (req.method === 'DELETE') {
        const { id } = parseParams(url, { id: 'int' });

        if (id === null) {
          return sendError(res, "Missing parameter 'id' or wrong format", 400);
        }

        const deleted = await delet(id);
        if (deleted === null || deleted === false) {
          return sendError(res, `Instance with id ${id} not found`, 404);
        }

        sendJson(res, deleted);
        return;
      }
    }


    sendError(res, "Not Found", 404);

  } catch (globalError) {
    sendError(res, "Internal Server Error", 500);
  }
});

server.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
