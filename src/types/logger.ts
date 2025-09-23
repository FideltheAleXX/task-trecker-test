import { Request, Response } from 'express';

export const logger = (req: Request, res: Response, next: () => void): void => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};
