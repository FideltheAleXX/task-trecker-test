import { Database } from 'sqlite3';
import { SQLITE_PATH } from '../config';

const db = new Database(SQLITE_PATH, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log('Database connected');
});

export const sqliteRun = (
  sql: string,
  params?: unknown[]
): Promise<unknown> => {
  return new Promise((res, rej) => {
    db.run(sql, params, (error: unknown, data: unknown) => {
      if (error) {
        return rej(error);
      }
      res(data);
    });
  });
};

export const sqliteGet = (
  sql: string,
  params?: unknown[]
): Promise<unknown> => {
  return new Promise((res, rej) => {
    db.get(sql, params, (error: unknown, data: unknown) => {
      if (error) {
        return rej(error);
      }
      res(data);
    });
  });
};

export const sqliteAll = (sql: string, params?: any[]): Promise<unknown> => {
  return new Promise((res, rej) => {
    db.all(sql, params, (error: unknown, data: unknown) => {
      if (error) {
        return rej(error);
      }
      res(data);
    });
  });
};
