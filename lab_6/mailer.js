import createMailer from 'sendmail';

export const sendmail = createMailer({
  logger: {
    debug: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
  },
  silent: false,
  devPort: 1025,
  devHost: 'localhost',
});
