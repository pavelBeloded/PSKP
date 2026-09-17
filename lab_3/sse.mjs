let clients = [];

export function addClient(res) {
  clients.push(res);
}

export function removeClient(res) {
  clients = clients.filter((client) => client !== res);
}

export function broadcast(message) {
  clients.forEach((client) => client.write(`data: ${message}\n\n`));
}
