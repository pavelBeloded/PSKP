export function socket(req, res) {
  const clientSock = { ip: req.socket.remoteAddress, port: req.socket.remotePort };
  const serverSock = { ip: req.socket.localAddress, port: req.socket.localPort };

  const responseData = {
    client: clientSock,
    server: serverSock,
  };

  sendJson(res, responseData, 200);
}
