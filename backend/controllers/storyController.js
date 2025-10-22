import Story from '../models/Story.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const createStory = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Media file is required' });
    }

    const url = await uploadToCloudinary(req.file, 'stories');
    const type = req.file.mimetype.startsWith('image') ? 'image' : 'video';

    const story = await Story.create({
      author: req.user._id,
      media: { url, type },
      caption
    });

    const populatedStory = await Story.findById(story._id)
      .populate('author', 'username fullName profilePicture');

    // Notify followers
    const user = await User.findById(req.user._id).populate('followers');
    const io = req.app.get('io');
    
    user.followers.forEach(follower => {
      io.to(follower._id.toString()).emit('new story', {
        storyId: story._id,
        author: {
          _id: req.user._id,
          username: req.user.username,
          fullName: req.user.fullName,
          profilePicture: req.user.profilePicture
        }
      });
    });

    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get stories from followed users and own stories
    const stories = await Story.find({
      author: { $in: [...user.following, req.user._id] },
      expiresAt: { $gt: new Date() }
    })
      .populate('author', 'username fullName profilePicture')
      .sort({ createdAt: -1 });

    // Group stories by author
    const groupedStories = stories.reduce((acc, story) => {
      const authorId = story.author._id.toString();
      if (!acc[authorId]) {
        acc[authorId] = {
          author: story.author,
          stories: [],
          hasViewed: false
        };
      }
      
      const viewed = story.views.some(v => v.user.toString() === req.user._id.toString());
      acc[authorId].stories.push({ ...story.toObject(), viewed });
      
      if (!viewed) {
        acc[authorId].hasViewed = false;
      }
      
      return acc;
    }, {});

    const result = Object.values(groupedStories);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserStories = async (req, res) => {
  try {
    const stories = await Story.find({
      author: req.params.userId,
      expiresAt: { $gt: new Date() }
    })
      .populate('author', 'username fullName profilePicture')
      .sort({ createdAt: 1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if already viewed
    const alreadyViewed = story.views.some(
      v => v.user.toString() === req.user._id.toString()
    );

    if (!alreadyViewed) {
      story.views.push({
        user: req.user._id,
        viewedAt: new Date()
      });
      await story.save();

      // Notify story author
      if (story.author.toString() !== req.user._id.toString()) {
        const io = req.app.get('io');
        io.to(story.author.toString()).emit('story viewed', {
          storyId: story._id,
          viewer: {
            _id: req.user._id,
            username: req.user.username,
            fullName: req.user.fullName,
            profilePicture: req.user.profilePicture
          }
        });
      }
    }

    res.json({ message: 'Story viewed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStoryViewers = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('views.user', 'username fullName profilePicture');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(story.views);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
