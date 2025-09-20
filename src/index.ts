import express from 'express';
import { PORT } from './config';
import { cardsRouter } from './routers/cards.routers';

const server = express();
//const app = express();
//app.use(express.json());

server.use('/cards', cardsRouter);

server.get('/', (req, res) => {
  res.send('Server is working.');
});

server.listen(PORT);
