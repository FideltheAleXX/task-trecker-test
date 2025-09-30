import express, { Request, Response } from 'express';
import { ADMIN_LOGIN, ADMIN_PASSWORD, PORT } from './config';
import { cardsRouter } from './routers/cards.routers';
import { createTables } from './database/create-tables';
import basicAuth from 'express-basic-auth';
import { logger } from './types/logger';
import { boardsRouter } from './routers/bords.router';
import { columnsRouter } from './routers/columns.router';

async function run() {
  await createTables();

  const server = express();

  server.use(
    basicAuth({
      users: { [ADMIN_LOGIN]: ADMIN_PASSWORD },
      challenge: true,
    })
  );
  server.use(express.json());
  server.use(logger);

  server.get('/', (req, res) => {
    res.send('Server is working.');
  });

  server.use('/boards', boardsRouter);
  server.use('/boards/:boardId/columns', columnsRouter);
  server.use('/boards/:boardId/columns/:columnId/cards', cardsRouter);

  server.listen(PORT);
}

run().catch((err) => {
  console.error(err);
});
