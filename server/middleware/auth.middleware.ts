import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { logger } from '../logger';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    logger.warn({ path: req.path, method: req.method }, 'Request missing auth token');
    res.status(401).json({ message: 'Missing authentication token.' });
    return;
  }

  try {
    verifyJwt(token);
    logger.debug({ path: req.path, method: req.method }, 'Auth token verified');
    next();
  } catch {
    logger.warn({ path: req.path, method: req.method }, 'Invalid or expired token');
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
