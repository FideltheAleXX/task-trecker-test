import express, { Response, Request } from 'express';
import { Card, CreateCardReq, GetCardsRes } from '../types/cards';
import { IdParams } from '../types/common';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repo';
import { randomUUID } from 'crypto';

export const cardsRouter = express.Router();

cardsRouter.get(
  '/',
  async (req: Request<{}, {}>, res: Response<GetCardsRes>) => {
    const cards = await getManyCards();
    res.send(cards);
  }
);

cardsRouter.get(
  '/:id',
  async (
    req: Request<IdParams, Card | string, {}>,
    res: Response<Card | string>
  ) => {
    const card = await getOneCard(req.params.id);
    if (!card) {
      res.status(404).send('Card not found');
      return;
    }
    res.send(card);
  }
);

cardsRouter.post(
  '/',
  async (req: Request<{}, Card, CreateCardReq>, res: Response<Card>) => {
    const card: Card = {
      text: req.body.text,
      id: randomUUID(),
    };
    await createCard(card);
    res.send(card);
  }
);

cardsRouter.put(
  '/:id',
  async (req: Request<IdParams, Card, CreateCardReq>, res: Response<Card>) => {
    const card: Card = {
      id: req.params.id,
      text: req.body.text,
    };
    await updateCard(card);
    res.send(card);
  }
);

cardsRouter.delete(
  '/:id',
  async (req: Request<IdParams>, res: Response<void>) => {
    await deleteCard(req.params.id);
    res.sendStatus(204);
  }
);
