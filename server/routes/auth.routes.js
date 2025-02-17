import { Router } from 'express';

import {
  signInController,
  signOutController,
  signUpController,
  userController,
} from '../controllers/auth.controller.js';

import {
  validateSignIn,
  validateSignUp,
} from '../middlewares/validate.auth.middleware.js';

import { authenticate } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/sign-in', validateSignIn, signInController);
authRouter.post('/sign-up', validateSignUp, signUpController);
authRouter.post('/sign-out', validateSignUp, signOutController);
authRouter.get('/me', authenticate, userController);

export default authRouter;
