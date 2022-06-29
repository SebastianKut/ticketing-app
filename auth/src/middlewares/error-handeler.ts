import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';
// To be able to add this middleware as an error handerler to express and in order to express recognize it as error
//  handeler (so then we can use it like "throw new Error") it needs to have 4 arguments like below
export const errorHandeler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  return res
    .status(400)
    .send({ errors: [{ message: 'Something went wrong' }] });
};
