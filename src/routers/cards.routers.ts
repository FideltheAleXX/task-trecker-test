import express, { Response, Request } from 'express';
import { Card, CreateCardReq, GetCardsRes } from '../types/cards';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repo';
import { randomUUID } from 'crypto';
import { validateCardInput } from './validation/validate-card-input';
import { CardIdParams } from '../types/common';

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
    req: Request<CardIdParams, Card | string, {}>,
    res: Response<Card | string>
  ) => {
    const card = await getOneCard(req.params.cardId);
    if (!card) {
      res.status(404).send('Card not found');
      return;
    }
    res.send(card);
  }
);

cardsRouter.post(
  '/',
  validateCardInput,
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
  validateCardInput,
  async (
    req: Request<CardIdParams, Card, CreateCardReq>,
    res: Response<Card>
  ) => {
    const card: Card = {
      id: req.params.cardId,
      text: req.body.text,
    };
    await updateCard(card);
    res.send(card);
  }
);

cardsRouter.delete(
  '/:id',
  async (req: Request<CardIdParams>, res: Response<void>) => {
    await deleteCard(req.params.cardId);
    res.sendStatus(204);
  }
);
