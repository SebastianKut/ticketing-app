import { ValidationError } from 'express-validator';

export class RequestVaidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // Because extending built-in class:
    Object.setPrototypeOf(this, RequestVaidationError.prototype);
  }
}
