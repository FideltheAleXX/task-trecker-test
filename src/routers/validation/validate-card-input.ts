import { CreateCardReq, Card } from '../../types/cards';
import { Request, Response } from 'express';

export const validateCardInput = (
  { body }: Request<unknown, Card, CreateCardReq>,
  res: Response,
  next: () => void
): void => {
  if (typeof body !== 'object' || !body.text || typeof body.text !== 'string') {
    res.status(400).send({
      error: 'Validation error',
    });
    return;
  }
  next();
};
