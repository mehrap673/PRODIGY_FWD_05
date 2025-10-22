import Post from '../models/Post.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    const media = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file, 'posts');
        const type = file.mimetype.startsWith('image') ? 'image' : 'video';
        media.push({ url, type });
      }
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      media,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id }
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username fullName profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username fullName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      });

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: { $in: [...user.following, req.user._id] }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username fullName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
      await post.save();
      return res.json({ message: 'Post unliked', likes: post.likes.length });
    }

    post.likes.push(req.user._id);
    await post.save();

    // Create notification
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'like',
        post: post._id,
        message: `${req.user.username} liked your post`
      });

      const io = req.app.get('io');
      io.to(post.author.toString()).emit('notification', notification);
    }

    res.json({ message: 'Post liked', likes: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: post._id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const savePost = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const postId = req.params.id;

    if (user.savedPosts.includes(postId)) {
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId);
      await user.save();
      return res.json({ message: 'Post unsaved' });
    }

    user.savedPosts.push(postId);
    await user.save();

    res.json({ message: 'Post saved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to existing postController.js

export const getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      tags: { $in: [tag] }
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username fullName profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      });

    const total = await Post.countDocuments({ tags: { $in: [tag] } });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingPosts = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          commentsCount: { $size: { $ifNull: ['$comments', []] } },
          sharesCount: { $size: { $ifNull: ['$shares', []] } }
        }
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              '$likesCount',
              { $multiply: ['$commentsCount', 2] },
              { $multiply: ['$sharesCount', 3] }
            ]
          }
        }
      },
      {
        $sort: { engagementScore: -1 }
      },
      {
        $limit: 20
      }
    ]);

    const populatedPosts = await Post.populate(posts, [
      { path: 'author', select: 'username fullName profilePicture' },
      {
        path: 'comments',
        populate: { path: 'author', select: 'username fullName profilePicture' }
      }
    ]);

    res.json(populatedPosts);
  } catch (error) {
    console.error('Error in getTrendingPosts:', error);
    res.status(500).json({ message: error.message });
  }
};


export const sharePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.shares.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already shared this post' });
    }

    post.shares.push(req.user._id);
    await post.save();

    // Create notification
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'share',
        post: post._id,
        message: `${req.user.username} shared your post`
      });

      const io = req.app.get('io');
      io.to(post.author.toString()).emit('notification', notification);
    }

    res.json({ message: 'Post shared successfully', shares: post.shares.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reportPost = async (req, res) => {
  try {
    const { reason, description } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // In a real app, you would create a Report model and store this
    // For now, just return success
    console.log(`Post ${post._id} reported by ${req.user._id} for: ${reason}`);

    res.json({ message: 'Post reported successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

