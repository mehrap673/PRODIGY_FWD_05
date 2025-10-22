import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('posts')
      .populate('followers', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.bio = req.body.bio || user.bio;
    user.username = req.body.username || user.username;

    if (req.files) {
      if (req.files.profilePicture) {
        const profileUrl = await uploadToCloudinary(req.files.profilePicture[0], 'profile_pictures');
        user.profilePicture = profileUrl;
      }
      if (req.files.coverPhoto) {
        const coverUrl = await uploadToCloudinary(req.files.coverPhoto[0], 'cover_photos');
        user.coverPhoto = coverUrl;
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
      coverPhoto: updatedUser.coverPhoto
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    // Create notification
    const notification = await Notification.create({
      recipient: userToFollow._id,
      sender: currentUser._id,
      type: 'follow',
      message: `${currentUser.username} started following you`
    });

    // Emit socket event
    const io = req.app.get('io');
    io.to(userToFollow._id.toString()).emit('notification', notification);

    res.json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ message: 'User unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q
      ? {
          $or: [
            { username: { $regex: req.query.q, $options: 'i' } },
            { fullName: { $regex: req.query.q, $options: 'i' } }
          ]
        }
      : {};

    const users = await User.find(keyword)
      .select('-password')
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    const suggestedUsers = await User.find({
      _id: { $nin: [...currentUser.following, req.user._id] }
    })
      .select('-password')
      .limit(5);

    res.json(suggestedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
