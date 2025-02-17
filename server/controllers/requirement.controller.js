import mongoose from 'mongoose';
import Requirement from '../models/requirement.model.js';
import { APP_NAMES } from '../constants/app-names.js';
import { REQUIREMENT_STATUS } from '../constants/requirement-status.js';

export const newRequirementController = async (req, res) => {
  const session = await mongoose.startSession(); // Start MongoDB transaction session
  session.startTransaction(); // Begin transaction

  try {
    const { title, carName, appName, requirements } = req.body;
    const userId = req.user.id; // Assuming authentication middleware adds `req.user`

    // Validate required fields
    if (!title || !carName || !appName || !requirements) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Ensure app_name is valid
    if (!Object.values(APP_NAMES).includes(appName)) {
      return res.status(400).json({ message: 'Invalid app name' });
    }

    // Create the new requirement within the transaction
    const newRequirement = new Requirement({
      title,
      carName,
      appName,
      requirements,
      userId,
    });

    await newRequirement.save({ session }); // Save requirement within session

    // Commit transaction (save changes)
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: 'Requirement created successfully',
      data: newRequirement,
    });
  } catch (error) {
    console.error('Error creating requirement:', error);

    // Rollback transaction in case of an error
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getPendingRequirementsController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const skip = (pageNumber - 1) * limitNumber;

    // Fetch only pending requirements & populate userId (renamed to "user")
    const pendingRequirements = await Requirement.find({
      status: REQUIREMENT_STATUS.PENDING,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate({
        path: 'userId',
        select: 'name email role',
      })
      .lean(); // Convert documents to plain JavaScript objects

    // Rename `userId` to `user`
    const transformedRequirements = pendingRequirements.map((req) => ({
      ...req,
      user: req.userId, // Rename userId to user
      userId: undefined, // Remove original userId key
    }));

    const totalPending = await Requirement.countDocuments({
      status: REQUIREMENT_STATUS.PENDING,
    });

    const hasMore = skip + pendingRequirements.length < totalPending;

    return res.status(200).json({
      data: transformedRequirements,
      nextPage: hasMore ? pageNumber + 1 : null, // If there are more pages, return next page number
    });
  } catch (error) {
    console.error('Error fetching pending requirements:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateRequirementStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (
      ![REQUIREMENT_STATUS.APPROVED, REQUIREMENT_STATUS.DISAPPROVED].includes(
        status
      )
    ) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update requirement status
    const updatedRequirement = await Requirement.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate({
      path: 'userId',
      select: 'name email role',
    });

    if (!updatedRequirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    return res.status(200).json({
      message: 'Requirement updated successfully',
      data: updatedRequirement,
    });
  } catch (error) {
    console.error('Error updating requirement status:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
