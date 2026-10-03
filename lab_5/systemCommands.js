import readline from 'node:readline';
import { state } from './state.js';
import { db } from './db.js';

function parseArg(raw) {
  if (raw === undefined || raw === '') return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : NaN;
}

function handleSd(x, server) {
  if (state.sdTimer !== null) {
    clearTimeout(state.sdTimer);
    state.sdTimer = null;
    console.log('Previous [sd] command was canceled');
  }

  if (x === null) {
    console.log('Server stopping was canceled');
    return;
  }

  console.log('Server will be stopped in ' + x + ' seconds');

  state.sdTimer = setTimeout(() => {
    state.sdTimer = null;
    server.close(() => {
      console.log('Stopped');
    });
    state.rl?.close();
  }, x * 1000);
}

function handleSc(x) {
  if (x === null) {
    if (state.scTimer === null) {
      console.log('There is no interval to cancel');
      return;
    }
    clearInterval(state.scTimer);
    state.scTimer = null;
    console.log('Commit interval was cancelled');
    return;
  }

  if (state.scTimer !== null) {
    console.log('Commit interval already exist');
    return;
  }

  console.log(`Commit will be executed every ${x} seconds`);
  state.scTimer = setInterval(() => {
    db.commit();
  }, x * 1000);
  state.scTimer.unref();
}

function finishStats() {
  state.stats.active = false;
  state.stats.finish = new Date().toISOString();
}

function handleSs(x) {
  if (x === null) {
    if (state.ssTimer === null) {
      console.log('There is no timer to cancel');
      return;
    }
    clearTimeout(state.ssTimer);
    state.ssTimer = null;
    finishStats();
    console.log('Ss timer was cancelled');
    return;
  }

  if (state.ssTimer !== null) {
    console.log('Ss interval already exist');
    return;
  }

  state.stats = {
    active: true,
    start: new Date().toISOString(),
    finish: null,
    request: 0,
    commit: 0,
  };
  console.log(`Ss started for ${x} seconds...`);
  state.ssTimer = setTimeout(() => {
    state.ssTimer = null;
    finishStats();
    console.log('Ss stopped.');
  }, x * 1000);
  state.ssTimer.unref();
}

export function initSystemCommands(server) {
  state.server = server;

  const rl = readline.createInterface({ input: process.stdin });
  state.rl = rl;

  rl.on('line', (line) => {
    const [cmd, raw] = line.trim().split(/\s+/);
    if (!cmd) return;

    const x = parseArg(raw);
    if (Number.isNaN(x)) {
      console.log('Parameter must be a positive number');
      return;
    }

    switch (cmd) {
      case 'sd':
        handleSd(x, server);
        break;
      case 'sc':
        handleSc(x);
        break;
      case 'ss':
        handleSs(x);
        break;
      default:
        console.log('Unknown command. Available: sd [x], sc [x], ss [x]');
    }
  });
}
