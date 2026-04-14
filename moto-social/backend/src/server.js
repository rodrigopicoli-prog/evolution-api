const { app } = require('./app');
const { env } = require('./config/env');

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Moto Social backend listening on port ${env.port}`);
});
