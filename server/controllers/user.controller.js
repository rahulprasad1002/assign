import User from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

// Fetch all users with pagination
export const getAllUsersController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const skip = (pageNumber - 1) * limitNumber;

    // Fetch paginated users
    const users = await User.find()
      .select('-password -refreshTokens') // Exclude sensitive fields
      .skip(skip)
      .limit(limitNumber);

    const totalUsers = await User.countDocuments();

    const hasMore = skip + users.length < totalUsers;

    return res.status(200).json({
      data: users,
      nextPage: hasMore ? pageNumber + 1 : null,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update user role
export const updateUserRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: 'name email role' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User role updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
