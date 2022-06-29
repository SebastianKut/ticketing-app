import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestVaidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Validation Error');

    // Because extending built-in class we use following:
    Object.setPrototypeOf(this, RequestVaidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
