import express from 'express';
import {
  getAllUsersController,
  updateUserRoleController,
} from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { ROLES } from '../constants/roles.js';

const userRouter = express.Router();

userRouter.get(
  '/all',
  authenticate,
  authorize(ROLES.OWNER),
  getAllUsersController
);

userRouter.patch(
  '/update-role/:id',
  authenticate,
  authorize(ROLES.OWNER),
  updateUserRoleController
);

export default userRouter;
