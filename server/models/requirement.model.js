import mongoose from 'mongoose';

import { APP_NAMES } from '../constants/app-names.js';
import { REQUIREMENT_STATUS } from '../constants/requirement-status.js';

const RequirementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    carName: { type: String, required: true },
    appName: {
      type: String,
      enum: Object.values(APP_NAMES),
      required: true,
    },

    requirements: { type: String, required: true },

    // Relation with User model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Approval status
    status: {
      type: String,
      enum: Object.values(REQUIREMENT_STATUS),
      default: REQUIREMENT_STATUS.PENDING,
    },

    // Admin who approves/disapproves
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Requirement', RequirementSchema);
