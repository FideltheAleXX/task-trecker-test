import { CreateBoardReq } from '../../types/boards';
import { Board } from '../../types/boards/board';
import { IdParams } from '../../types/common';
import { Request, Response } from 'express';

export const validateBoardInput = (
  { body }: Request<IdParams, Board, CreateBoardReq>,
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
