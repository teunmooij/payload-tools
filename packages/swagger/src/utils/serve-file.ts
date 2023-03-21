import fs from 'fs/promises';
import path from 'path';
import type { RequestHandler } from 'express';

export const serveFile = (relativePath: string): RequestHandler => {
  let data: string;
  return async (req, res) => {
    try {
      if (!data) {
        data = await fs.readFile(path.join(process.cwd(), relativePath), 'utf-8');
      }

      res.header('Content-Type', 'text/plain; charset=UTF-8').send(data);
    } catch {
      res.status(404).send('The requested resource is not available.');
    }
  };
};
