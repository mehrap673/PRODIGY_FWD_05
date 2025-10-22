import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'username fullName profilePicture isOnline lastSeen')
      .populate('lastMessage')
      .populate('groupAdmin', 'username fullName profilePicture')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id
    })
      .populate('participants', 'username fullName profilePicture isOnline lastSeen')
      .populate('lastMessage')
      .populate('groupAdmin', 'username fullName profilePicture');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, participantId] }
    });

    if (conversation) {
      return res.json(conversation);
    }

    conversation = await Conversation.create({
      participants: [req.user._id, participantId]
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'username fullName profilePicture isOnline lastSeen');

    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createGroupConversation = async (req, res) => {
  try {
    const { groupName, participantIds } = req.body;

    const conversation = await Conversation.create({
      isGroup: true,
      groupName,
      groupAdmin: req.user._id,
      participants: [req.user._id, ...participantIds]
    });

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'username fullName profilePicture')
      .populate('groupAdmin', 'username fullName profilePicture');

    res.status(201).json(populatedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      conversation: conversationId,
      deletedFor: { $ne: req.user._id }
    })
      .populate('sender', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({
      conversation: conversationId,
      deletedFor: { $ne: req.user._id }
    });

    res.json({
      messages: messages.reverse(),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMessages: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const media = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file, 'messages');
        const type = file.mimetype.startsWith('image') ? 'image' : 'video';
        media.push({ url, type });
      }
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      content,
      media
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username fullName profilePicture');

    // Update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: new Date()
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    message.deletedFor.push(req.user._id);
    await message.save();

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addGroupMembers = async (req, res) => {
  try {
    const { memberIds } = req.body;
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (conversation.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can add members' });
    }

    conversation.participants.push(...memberIds);
    await conversation.save();

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'username fullName profilePicture');

    res.json(populatedConversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeGroupMember = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (conversation.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only admin can remove members' });
    }

    conversation.participants = conversation.participants.filter(
      p => p.toString() !== req.params.userId
    );
    await conversation.save();

    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);

    if (!conversation || !conversation.isGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }

    conversation.participants = conversation.participants.filter(
      p => p.toString() !== req.user._id.toString()
    );

    if (conversation.groupAdmin.toString() === req.user._id.toString()) {
      // Transfer admin rights to another member
      conversation.groupAdmin = conversation.participants[0];
    }

    await conversation.save();
    res.json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
