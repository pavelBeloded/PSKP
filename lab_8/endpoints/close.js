import { sendJson } from 'http-lab-kit';

export function close(res) {
  sendJson(res, { message: 'Server will be stopped in 10 seconds' });
  console.log('Server will be stopped in 10 seconds');
  setTimeout(() => {
    process.exit();
  }, 10_000);
}
