import { Board, GetBoardRes, GetBoardResColumn } from '../types/boards';
import { sqliteGet, sqliteRun, sqliteAll } from './db-connection';

type OneBoardDataBaseResult = {
  boardId: string;
  boardName: string;
  columnId: string | null;
  columnName: string | null;
  cardId: string | null;
  cardText: string | null;
};

//CREATE board in DB
export const createBoard = async (board: Board): Promise<void> => {
  await sqliteRun(
    `
        INSERT INTO boards (id, name)
        VALUES (?, ?);
        `,
    [board.id, board.name]
  );
};

//UPDATE board in DB
export const updateBoard = async (board: Board): Promise<void> => {
  await sqliteRun(
    `
        UPDATE boards SET name = ?
        WHERE id = ?;
        `,
    [board.name, board.id]
  );
};

//DELETE board from DB
export const deleteBoard = async (id: string): Promise<void> => {
  await sqliteRun(
    `
       DELETE FROM boards
       WHERE id = ?;
        `,
    [id]
  );
};

export const getOneBoard = async (id: string): Promise<GetBoardRes | null> => {
  const data = await sqliteAll(
    `
        SELECT 
          boards.id AS "boardId",
          boards.name AS "boardName",
          columns.id AS "columnId",
          columns.name AS "columnName",
          cards.id AS "cardId",
          cards.text AS "cardText"
        FROM boards
        LEFT JOIN columns ON boards.id = columns.board_id
        LEFT JOIN cards ON columns.id = cards.column_id
        WHERE boards.id = ?
        ORDER BY columns.name ASC NULLS LAST, columns.id ASC, cards.text ASC NULLS LAST;
        `,
    [id]
  );

  if (!isOneBoardResult(data) || !data.length) {
    return null;
  }
  return mapOneBoardResult(data);
};

//Return result of get One Board
const mapOneBoardResult = (data: OneBoardDataBaseResult[]): GetBoardRes => {
  const columns: GetBoardResColumn[] = [];
  let column: GetBoardResColumn | undefined;

  for (const row of data) {
    if (!row.columnId) break;
    if (!column) {
      column = {
        id: row.columnId!,
        name: row.columnName!,
        cards: [],
      };
    }

    if (column.id !== row.columnId) {
      columns.push(column);
      column = {
        id: row.columnId!,
        name: row.columnName!,
        cards: [],
      };
    }
    if (!row.cardId) {
      continue;
    }
    column.cards.push({ id: row.cardId!, text: row.cardText! });
  }

  if (column) {
    columns.push(column);
  }

  return {
    id: data[0]!.boardId,
    name: data[0]!.boardName,
    columns,
  };
};

export const getManyBoards = async (): Promise<Board[]> => {
  const data = await sqliteAll(
    `
        SELECT * FROM boards
        `
  );
  if (!Array.isArray(data)) {
    console.error(`Unknown data format on getMany: ${data}`);
    throw new Error('Unknown data format on getMany');
  }
  return data
    .map((one) => {
      if (isBoard(one)) {
        return one;
      }
      return undefined;
    })
    .filter((one) => one !== undefined);
};

const isBoard = (data: unknown): data is Board => {
  const board = data as Board;
  return Boolean(board && typeof board === 'object' && board.id && board.name);
};

const isOneBoardResult = (data: unknown): data is OneBoardDataBaseResult[] => {
  if (!Array.isArray(data)) {
    console.error(`Unknown data format on get board: ${data}`);
    throw new Error('Unknown data format');
  }

  const board = data as OneBoardDataBaseResult[];

  for (const row of board) {
    if (!row || !row.boardId || !row.boardName) {
      return false;
    }
  }
  return true;
};
