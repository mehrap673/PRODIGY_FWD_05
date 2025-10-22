import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/suggested', protect, getSuggestedUsers);
router.get('/:id', protect, getUserProfile);
router.put(
  '/profile',
  protect,
  upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]),
  updateUserProfile
);
router.post('/:id/follow', protect, followUser);
router.post('/:id/unfollow', protect, unfollowUser);

export default router;
