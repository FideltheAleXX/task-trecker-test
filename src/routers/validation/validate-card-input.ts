import { CreateCardReq } from '../../types/cards';
import { Card } from '../../types/cards/card';
import { IdParams } from '../../types/common';
import { Request, Response } from 'express';

export const validateCardInput = (
  { body }: Request<IdParams, Card, CreateCardReq>,
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
