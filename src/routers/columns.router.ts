import express, { Response, Request } from 'express';
import { Column, CreateColumnReq, GetColumnRes } from '../types/columns';
import {
  createColumn,
  deleteColumn,
  getManyColumns,
  getOneColumn,
  updateColumn,
} from '../database/columns-repo';
import { randomUUID } from 'crypto';
import { validateColumnInput } from './validation';
import { BoardIdParams, ColumnIdParams } from '../types/common';

export const columnsRouter = express.Router({ mergeParams: true });

columnsRouter.get(
  '/',
  async (req: Request<BoardIdParams, {}>, res: Response<GetColumnRes>) => {
    const columns = await getManyColumns(req.params.boardId);
    res.send(columns);
  }
);

columnsRouter.get(
  '/:columnId',
  async (
    req: Request<ColumnIdParams, Column | string, {}>,
    res: Response<Column | string>
  ) => {
    const column = await getOneColumn(req.params.columnId, req.params.boardId);
    if (!column) {
      res.status(404).send('Column not found');
      return;
    }
    res.send(column);
  }
);

columnsRouter.post(
  '/',
  validateColumnInput,
  async (
    req: Request<BoardIdParams, Column, CreateColumnReq>,
    res: Response<Column>
  ) => {
    const column: Column = {
      name: req.body.name,
      id: randomUUID(),
      boardId: req.params.boardId,
    };
    await createColumn(column);
    res.send(column);
  }
);

columnsRouter.put(
  '/:columnId',
  validateColumnInput,
  async (
    req: Request<ColumnIdParams, Column, CreateColumnReq>,
    res: Response<Column>
  ) => {
    const column: Column = {
      id: req.params.columnId,
      name: req.body.name,
      boardId: req.params.boardId,
    };
    await updateColumn(column);
    res.send(column);
  }
);

columnsRouter.delete(
  '/:columnId',
  async (req: Request<ColumnIdParams>, res: Response<void>) => {
    await deleteColumn(req.params.columnId, req.params.boardId);
    res.sendStatus(204);
  }
);
