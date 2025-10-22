import express from 'express';
import {
  createComment,
  getComments,
  likeComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createComment);
router.get('/:postId', protect, getComments);
router.post('/:id/like', protect, likeComment);
router.delete('/:id', protect, deleteComment);

export default router;
