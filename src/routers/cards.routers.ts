import express, { Response, Request } from 'express';
import {
  Card,
  CreateCardReq,
  GetCardsRes,
  UpdateCardReq,
} from '../types/cards';
import {
  createCard,
  deleteCard,
  getManyCards,
  getOneCard,
  updateCard,
} from '../database/cards-repo';
import { randomUUID } from 'crypto';
import { validateCardInput } from './validation/validate-card-input';
import { CardIdParams, ColumnIdParams } from '../types/common';
import { checkCardExistence, checkColumnExistence } from './middleware';
import { getOneColumn } from '../database/columns-repo';

export const cardsRouter = express.Router({ mergeParams: true });

cardsRouter.get(
  '/',
  async (req: Request<ColumnIdParams, {}>, res: Response<GetCardsRes>) => {
    const cards = await getManyCards(req.params);
    res.send(cards);
  }
);

cardsRouter.get(
  '/:cardId',
  async (
    req: Request<CardIdParams, Card | string, {}>,
    res: Response<Card | string>
  ) => {
    const card = await getOneCard(req.params);
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
  checkColumnExistence,
  async (
    req: Request<ColumnIdParams, Card, CreateCardReq>,
    res: Response<Card>
  ) => {
    const card: Card = {
      text: req.body.text,
      id: randomUUID(),
      columnId: req.params.columnId,
    };
    await createCard(card);
    res.send(card);
  }
);

cardsRouter.put(
  '/:cardId',
  validateCardInput,
  checkCardExistence,
  async (
    { body, params }: Request<CardIdParams, Card, UpdateCardReq>,
    res: Response<Card | string>
  ) => {
    if (params.columnId !== body.columnId) {
      const column = await getOneColumn(body.columnId, params.boardId);
      if (!column) {
        res.status(404).send('Column not found');
        return;
      }
    }
    const card: Card = {
      id: params.cardId,
      text: body.text,
      columnId: body.columnId,
    };
    await updateCard(card);
    res.send(card);
  }
);

cardsRouter.delete(
  '/:cardId',
  checkCardExistence,
  async (req: Request<CardIdParams>, res: Response<void>) => {
    await deleteCard(req.params.cardId);
    res.sendStatus(204);
  }
);
