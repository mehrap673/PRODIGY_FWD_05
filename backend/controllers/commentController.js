import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import Notification from '../models/Notification.js';

export const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
      parentComment: parentCommentId || null
    });

    if (parentCommentId) {
      await Comment.findByIdAndUpdate(parentCommentId, {
        $push: { replies: comment._id }
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: comment._id }
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username fullName profilePicture');

    // Create notification
    if (post.author.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: postId,
        comment: comment._id,
        message: `${req.user.username} commented on your post`
      });

      const io = req.app.get('io');
      io.to(post.author.toString()).emit('notification', notification);
    }

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId, parentComment: null })
      .populate('author', 'username fullName profilePicture')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture'
        }
      })
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.likes.includes(req.user._id)) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      comment.likes.push(req.user._id);
    }

    await comment.save();
    res.json({ message: 'Comment like toggled', likes: comment.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: comment._id }
      });
    } else {
      await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: comment._id }
      });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
