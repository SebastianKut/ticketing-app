// Instead of defining iterface, we define abstract class that works in similar way but it gets carried over to JavaScript.
// Interface stays in ts. Abstract classes connot be instantiated but we can extend classes with them
// This will give us precise definition of custom error that we create, similar to interface but in the middleware we can only do one check with if statement fro this abstract class insted of checking for every custom error we wll implement in the future
export abstract class CustomError extends Error {
  // abstract keyword means object has to have it
  abstract statusCode: number;

  // everytime we throw an Error we can pass a string like throw new Error('Something went wrong'), so to account for that functionality we can pass message argument to constructor
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
  // we do not define method here, it means it has to have this method and what structure the method returns
  abstract serializeErrors(): { message: string; field?: string }[];
}
