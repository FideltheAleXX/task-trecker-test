import { CreateColumnReq } from '../../types/columns';
import { Column } from '../../types/columns/column';
import { Request, Response } from 'express';

export const validateColumnInput = (
  { body }: Request<unknown, Column, CreateColumnReq>,
  res: Response,
  next: () => void
): void => {
  if (typeof body !== 'object' || !body.name || typeof body.name !== 'string') {
    res.status(400).send({
      error: 'Validation error',
    });
    return;
  }
  next();
};
