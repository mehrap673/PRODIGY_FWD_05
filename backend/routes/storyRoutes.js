import express from 'express';
import {
  createStory,
  getStories,
  getUserStories,
  viewStory,
  deleteStory,
  getStoryViewers
} from '../controllers/storyController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('media'), createStory);
router.get('/', protect, getStories);
router.get('/user/:userId', protect, getUserStories);
router.post('/:id/view', protect, viewStory);
router.get('/:id/viewers', protect, getStoryViewers);
router.delete('/:id', protect, deleteStory);

export default router;
