import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  getFeedPosts,
  likePost,
  deletePost,
  savePost,
  // Import new controllers
  getTrendingPosts,
  getPostsByTag,
  sharePost,
  reportPost
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.array('media', 5), createPost);
router.get('/', protect, getPosts);
router.get('/feed', protect, getFeedPosts);
router.get('/:id', protect, getPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/save', protect, savePost);
router.delete('/:id', protect, deletePost);
// Add to existing routes
router.get('/trending', protect, getTrendingPosts);
router.get('/tag/:tag', protect, getPostsByTag);
router.post('/:id/share', protect, sharePost);
router.post('/:id/report', protect, reportPost);


export default router;
