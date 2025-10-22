import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  media: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'video', 'file']
    }
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date
  }],
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
