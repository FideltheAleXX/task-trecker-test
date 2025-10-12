import express, { Response, Request } from 'express';
import {
  Board,
  CreateBoardReq,
  GetBoardRes,
  GetBoardsRes,
} from '../types/boards';
import { BoardIdParams } from '../types/common';
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
  '/:boardId',
  async (
    req: Request<BoardIdParams, GetBoardRes | string, {}>,
    res: Response<GetBoardRes | string>
  ) => {
    const board = await getOneBoard(req.params.boardId);
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
  '/:boardId',
  validateBoardInput,
  async (
    req: Request<BoardIdParams, Board, CreateBoardReq>,
    res: Response<Board>
  ) => {
    const board: Board = {
      id: req.params.boardId,
      name: req.body.name,
    };
    await updateBoard(board);
    res.send(board);
  }
);

boardsRouter.delete(
  '/:boardId',
  async (req: Request<BoardIdParams>, res: Response<void>) => {
    await deleteBoard(req.params.boardId);
    res.sendStatus(204);
  }
);
