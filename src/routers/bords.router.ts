import express, { Response, Request } from 'express';
import { Board, CreateBoardReq, GetBoardsRes } from '../types/boards';
import { IdParams } from '../types/common';
import {
  createBoard,
  deleteBoard,
  getManyBoards,
  getOneBoard,
  updateBoard,
} from '../database/boards-repo';
import { randomUUID } from 'crypto';
import { validateBoardInput } from './validation';

export const boardsRouter = express.Router();

boardsRouter.get(
  '/',
  async (req: Request<{}, {}>, res: Response<GetBoardsRes>) => {
    const boards = await getManyBoards();
    res.send(boards);
  }
);

boardsRouter.get(
  '/:id',
  async (
    req: Request<IdParams, Board | string, {}>,
    res: Response<Board | string>
  ) => {
    const board = await getOneBoard(req.params.id);
    if (!board) {
      res.status(404).send('Board not found');
      return;
    }
    res.send(board);
  }
);

boardsRouter.post(
  '/',
  validateBoardInput,
  async (req: Request<{}, Board, CreateBoardReq>, res: Response<Board>) => {
    const board: Board = {
      name: req.body.name,
      id: randomUUID(),
    };
    await createBoard(board);
    res.send(board);
  }
);

boardsRouter.put(
  '/:id',
  validateBoardInput,
  async (
    req: Request<IdParams, Board, CreateBoardReq>,
    res: Response<Board>
  ) => {
    const board: Board = {
      id: req.params.id,
      name: req.body.name,
    };
    await updateBoard(board);
    res.send(board);
  }
);

boardsRouter.delete(
  '/:id',
  async (req: Request<IdParams>, res: Response<void>) => {
    await deleteBoard(req.params.id);
    res.sendStatus(204);
  }
);
