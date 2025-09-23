import express from 'express';
import { ADMIN_LOGIN, ADMIN_PASSWORD, PORT } from './config';
import { cardsRouter } from './routers/cards.routers';
import { createTables } from './database/create-tables';
import basicAuth from 'express-basic-auth';

async function run() {
  await createTables();

  const server = express();
  server.use(express.json());
  server.use(
    basicAuth({
      users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
      challenge: true,
    })
  );

  server.get('/', (req, res) => {
    res.send('Server is working.');
  });

  server.use('/cards', cardsRouter);

  server.listen(PORT);
}

run().catch((err) => {
  console.error(err);
});
