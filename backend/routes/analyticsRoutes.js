import express from 'express';
import {
  getUserAnalytics,
  getPostAnalytics,
  getDashboardStats,
  getAudienceInsights,
  getEngagementRate
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/user', protect, getUserAnalytics);
router.get('/post/:postId', protect, getPostAnalytics);
router.get('/dashboard', protect, getDashboardStats);
router.get('/audience', protect, getAudienceInsights);
router.get('/engagement', protect, getEngagementRate);

export default router;
