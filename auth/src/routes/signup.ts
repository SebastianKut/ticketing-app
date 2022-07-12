import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Please provide valid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already exist');
    }

    const user = User.build({ email, password });
    await user.save();
    // Generate JWT by passing data and the key signature that is used to verify if the token is valid.
    // in index.ts we should check if JWT_KEY exists when we spin up our server. This still wont satisfy typescript so we can add !
    // to get rid of an error as we are sure that we checked if JWT_KEYY exists
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // Store JWT on the session (cookie) so it gets automatically by browser. Any one can see the information inside jwt but its the fact that we
    // can verify if it was modified that makes it significant
    req.session = {
      jwt: userJwt,
    };
    // To transform JSON that we return to user we can modify it by adding toJSON property in schema definition in user.ts
    res.status(201).send(user);
  }
);

export { router as signupRouter };
