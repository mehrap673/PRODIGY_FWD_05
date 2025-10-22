import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  media: {
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    }
  },
  caption: {
    type: String,
    maxlength: 200
  },
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 24*60*60*1000) // 24 hours
  }
}, {
  timestamps: true
});

// Auto-delete expired stories
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model('Story', storySchema);

export default Story;
