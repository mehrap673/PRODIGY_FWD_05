import Analytics from '../models/Analytics.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getUserAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { user: req.user._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Analytics.find(query)
      .sort({ date: -1 })
      .limit(30);

    const summary = {
      totalProfileViews: analytics.reduce((sum, a) => sum + a.profileViews, 0),
      totalImpressions: analytics.reduce((sum, a) => sum + a.postImpressions, 0),
      totalEngagements: analytics.reduce((sum, a) => sum + a.postEngagements, 0),
      totalNewFollowers: analytics.reduce((sum, a) => sum + a.newFollowers, 0),
      averageEngagementRate: 0
    };

    if (summary.totalImpressions > 0) {
      summary.averageEngagementRate = (
        (summary.totalEngagements / summary.totalImpressions) * 100
      ).toFixed(2);
    }

    res.json({ analytics, summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostAnalytics = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'username fullName')
      .populate('likes', 'username fullName profilePicture')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username fullName' }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const analytics = {
      postId: post._id,
      likes: post.likes.length,
      comments: post.comments.length,
      shares: post.shares.length,
      totalEngagements: post.likes.length + post.comments.length + post.shares.length,
      topLikers: post.likes.slice(0, 10),
      recentComments: post.comments.slice(-5).reverse()
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture');

    const posts = await Post.find({ author: req.user._id });

    // Calculate 7-day growth
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentFollowers = user.followers.filter(
      f => f.createdAt > sevenDaysAgo
    );

    const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.shares.length, 0);

    const stats = {
      followers: {
        total: user.followers.length,
        weekGrowth: recentFollowers.length,
        percentageGrowth: user.followers.length > 0 
          ? ((recentFollowers.length / user.followers.length) * 100).toFixed(2)
          : 0
      },
      following: user.following.length,
      posts: {
        total: posts.length,
        totalLikes,
        totalComments,
        totalShares,
        averageLikes: posts.length > 0 ? (totalLikes / posts.length).toFixed(2) : 0
      },
      engagement: {
        total: totalLikes + totalComments + totalShares,
        rate: posts.length > 0 
          ? (((totalLikes + totalComments + totalShares) / (posts.length * user.followers.length)) * 100).toFixed(2)
          : 0
      }
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAudienceInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('followers', 'createdAt');

    // Follower growth over time
    const followerGrowth = user.followers.reduce((acc, follower) => {
      const date = new Date(follower.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Most active followers (based on interactions)
    const posts = await Post.find({ author: req.user._id })
      .populate('likes', 'username fullName profilePicture')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username fullName profilePicture' }
      });

    const interactions = {};
    
    posts.forEach(post => {
      post.likes.forEach(user => {
        const userId = user._id.toString();
        interactions[userId] = interactions[userId] || { user, count: 0 };
        interactions[userId].count++;
      });

      post.comments.forEach(comment => {
        const userId = comment.author._id.toString();
        interactions[userId] = interactions[userId] || { user: comment.author, count: 0 };
        interactions[userId].count++;
      });
    });

    const topEngagers = Object.values(interactions)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    res.json({
      followerGrowth,
      topEngagers,
      totalFollowers: user.followers.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEngagementRate = async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period);
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const posts = await Post.find({
      author: req.user._id,
      createdAt: { $gte: startDate }
    });

    const user = await User.findById(req.user._id);

    const dailyEngagement = {};

    posts.forEach(post => {
      const date = new Date(post.createdAt).toISOString().split('T')[0];
      const engagements = post.likes.length + post.comments.length + post.shares.length;
      
      if (!dailyEngagement[date]) {
        dailyEngagement[date] = {
          posts: 0,
          engagements: 0,
          impressions: 0
        };
      }

      dailyEngagement[date].posts++;
      dailyEngagement[date].engagements += engagements;
      dailyEngagement[date].impressions += user.followers.length;
    });

    // Calculate engagement rate for each day
    Object.keys(dailyEngagement).forEach(date => {
      const data = dailyEngagement[date];
      data.rate = data.impressions > 0 
        ? ((data.engagements / data.impressions) * 100).toFixed(2)
        : 0;
    });

    res.json(dailyEngagement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
