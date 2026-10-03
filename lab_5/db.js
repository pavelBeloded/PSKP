import { EventEmitter } from 'node:events';
import { data } from './data.js';

const delay = () => new Promise((resolve) => setImmediate(resolve));

class Database extends EventEmitter {
  constructor() {
    super();
    this.DB = [...data];
    this.nextId = 1;
  }

  async select() {
    await delay();

    this.emit('SELECT', this.DB);
    return [...this.DB];
  }

  async insert(row) {
    await delay();

    const id = this.DB.length > 0 ? Math.max(...this.DB.map((r) => r.id)) + 1 : 1;

    const newRow = { id, ...row };
    this.DB.push(newRow);

    this.emit('INSERT', newRow);
    return newRow;
  }
  async update(row) {
    await delay();

    const targetId = Number(row.id);
    const index = this.DB.findIndex((r) => r.id === targetId);

    if (index === -1) {
      return null;
    }

    const updated = { ...row, id: targetId };
    this.DB[index] = updated;
    this.emit('UPDATE', updated);
    return updated;
  }
  async delet(id) {
    await delay();

    const index = this.DB.findIndex((r) => r.id === +id);

    if (index === -1) {
      return null;
    }

    const [deletedRow] = this.DB.splice(index, 1);
    this.emit('DELETE', deletedRow);
    return deletedRow;
  }

  async commit() {
    await delay();
    this.emit('COMMIT', 'DB state successfully committed');
  }
}

export const db = new Database();
