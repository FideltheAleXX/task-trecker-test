import { NextFunction, Request, Response } from 'express';
import { ColumnIdParams } from '../../types/common';
import { getOneColumn } from '../../database/columns-repo';

export const checkColumnExistence = async (
  { params: { columnId, boardId } }: Request<ColumnIdParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const column = await getOneColumn(columnId, boardId);
  if (column) {
    next();
    return;
  }
  res.status(404).send('Column not found');
};
