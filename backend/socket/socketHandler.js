import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

const userSockets = new Map(); // Map userId to socketId

export const initializeSocket = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);
    
    // Store user socket
    userSockets.set(socket.userId, socket.id);

    // Update user online status
    updateUserStatus(socket.userId, true);

    // Join user's personal room
    socket.join(socket.userId);

    // Join user's conversations
    socket.on('join conversations', async () => {
      try {
        const conversations = await Conversation.find({
          participants: socket.userId
        });
        
        conversations.forEach(conv => {
          socket.join(`conversation:${conv._id}`);
        });
      } catch (error) {
        console.error('Error joining conversations:', error);
      }
    });

    // Send message
    socket.on('send message', async (data) => {
      try {
        const { conversationId, content, media } = data;

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          content,
          media
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username fullName profilePicture');

        // Update conversation last message
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          updatedAt: new Date()
        });

        // Emit to all participants in the conversation
        io.to(`conversation:${conversationId}`).emit('new message', populatedMessage);

        // Send notification to offline users
        const conversation = await Conversation.findById(conversationId);
        const offlineUsers = conversation.participants.filter(
          p => p.toString() !== socket.userId && !userSockets.has(p.toString())
        );

        // Here you would send push notifications to offline users

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user typing', {
        userId: socket.userId,
        conversationId: data.conversationId
      });
    });

    socket.on('stop typing', (data) => {
      socket.to(`conversation:${data.conversationId}`).emit('user stopped typing', {
        userId: socket.userId,
        conversationId: data.conversationId
      });
    });

    // Mark messages as read
    socket.on('mark read', async (data) => {
      try {
        const { conversationId, messageIds } = data;

        await Message.updateMany(
          { _id: { $in: messageIds }, sender: { $ne: socket.userId } },
          {
            isRead: true,
            $push: {
              readBy: {
                user: socket.userId,
                readAt: new Date()
              }
            }
          }
        );

        io.to(`conversation:${conversationId}`).emit('messages read', {
          conversationId,
          userId: socket.userId,
          messageIds
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Video call signaling
    socket.on('call user', (data) => {
      const { to, offer, callType } = data;
      const recipientSocket = userSockets.get(to);
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('incoming call', {
          from: socket.userId,
          offer,
          callType
        });
      }
    });

    socket.on('answer call', (data) => {
      const { to, answer } = data;
      const recipientSocket = userSockets.get(to);
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('call answered', {
          from: socket.userId,
          answer
        });
      }
    });

    socket.on('ice candidate', (data) => {
      const { to, candidate } = data;
      const recipientSocket = userSockets.get(to);
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('ice candidate', {
          from: socket.userId,
          candidate
        });
      }
    });

    socket.on('end call', (data) => {
      const { to } = data;
      const recipientSocket = userSockets.get(to);
      
      if (recipientSocket) {
        io.to(recipientSocket).emit('call ended', {
          from: socket.userId
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      userSockets.delete(socket.userId);
      updateUserStatus(socket.userId, false);
    });
  });
};

const updateUserStatus = async (userId, isOnline) => {
  try {
    await User.findByIdAndUpdate(userId, {
      isOnline,
      lastSeen: new Date()
    });
  } catch (error) {
    console.error('Error updating user status:', error);
  }
};

export { userSockets };
