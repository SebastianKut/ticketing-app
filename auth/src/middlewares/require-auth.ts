import { Request, Response, NextFunction } from 'express';
import { NotAuthorisedError } from '../errors/not-authorised-error';

// We assume it will be used with current-user middleware which will attach currentUser to req object
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorisedError();
  }
  // if current user exists it means they are authorised as currentUser middleware verifies JWT
  // so we can pass to next function
  next();
};
