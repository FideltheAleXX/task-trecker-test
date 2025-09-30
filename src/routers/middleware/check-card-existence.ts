import { NextFunction, Request, Response } from 'express';
import { CardIdParams } from '../../types/common';
import { getOneCard } from '../../database/cards-repo';

export const checkCardExistence = async (
  { params }: Request<CardIdParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const card = await getOneCard(params);
  if (card) {
    next();
    return;
  }
  res.status(404).send('Card not found');
};
