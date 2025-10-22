import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  profileViews: {
    type: Number,
    default: 0
  },
  postImpressions: {
    type: Number,
    default: 0
  },
  postEngagements: {
    type: Number,
    default: 0
  },
  newFollowers: {
    type: Number,
    default: 0
  },
  topPosts: [{
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    views: Number,
    likes: Number,
    comments: Number
  }]
}, {
  timestamps: true
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
