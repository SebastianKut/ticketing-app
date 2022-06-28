import { Request, Response, NextFunction } from 'express';
import { RequestVaidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

// To be able to add this middleware as an error handerler to express and in order to express recognize it as error
//  handeler (so then we can use it like "throw new Error") it needs to have 4 arguments like below
export const errorHandeler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestVaidationError) {
    console.log('This is a validation error');
  }

  if (err instanceof DatabaseConnectionError) {
    console.log('This is database connection error');
  }

  res.status(400).send({
    message: err.message,
  });
};
