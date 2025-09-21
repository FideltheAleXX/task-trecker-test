import express from 'express';
import { PORT } from './config';
import { cardsRouter } from './routers/cards.routers';
import { createTables } from './database/create-tables';

async function run() {
  await createTables();

  const server = express();
  server.use(express.json());

  server.get('/', (req, res) => {
    res.send('Server is working.');
  });

  server.use('/cards', cardsRouter);

  server.listen(PORT);
}

run().catch((err) => {
  console.error(err);
});
