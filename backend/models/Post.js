import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2200
  },
  media: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video']
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;
