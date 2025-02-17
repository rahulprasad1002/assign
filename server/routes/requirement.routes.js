import { Router } from 'express';

import { authenticate, authorize } from '../middlewares/auth.middleware.js';

import { ROLES } from '../constants/roles.js';
import {
  getPendingRequirementsController,
  newRequirementController,
  updateRequirementStatusController,
} from '../controllers/requirement.controller.js';

const requirementRouter = Router();

requirementRouter.post(
  '/new',
  authenticate,
  authorize(ROLES.OWNER, ROLES.ADMIN, ROLES.USER),
  newRequirementController
);

requirementRouter.get(
  '/pending',
  authenticate,
  authorize(ROLES.OWNER, ROLES.ADMIN),
  getPendingRequirementsController
);

requirementRouter.patch('/update/:id', updateRequirementStatusController);

export default requirementRouter;
