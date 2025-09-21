import { sqliteRun, sqliteGet, sqliteAll } from './db-connection';

export const createTables = async (): Promise<void> => {
  await sqliteRun(`
    CREATE TABLE IF NOT EXISTS cards(
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL)
    `);
};
