import express, { Response, Request } from 'express';
import { Card, CreateCardReq, GetCardsRes } from '../types/cards';
import { IdParams } from '../types/common';

export const cardsRouter = express.Router();

cardsRouter.get('/', (req: Request<{}, {}>, res: Response<GetCardsRes>) => {
  //TODO return cards
});

cardsRouter.get('/:id', (req: Request<IdParams, {}>, res: Response<Card>) => {
  //TODO return card
});

cardsRouter.post(
  '/',
  (req: Request<{}, CreateCardReq>, res: Response<Card>) => {
    //TODO create cards
  }
);

cardsRouter.put('/:id', (req: Request<IdParams, Card>, res: Response<Card>) => {
  //TODO update cards
});

cardsRouter.delete('/:id', (req: Request<IdParams>, res: Response<void>) => {
  //TODO delete cards
});
