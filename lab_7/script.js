import pkg from './package.json' with { type: 'json' };
import useStaticServer from './useStaticServer.js';
import * as http from 'node:http';

const PORT = pkg.config?.port || 5000;
const staticDir = pkg.config?.staticDir || 'static';

const staticHandler = useStaticServer(staticDir);
const server = http.createServer(async (req, res) => {
  staticHandler(req, res);
});

server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
});
