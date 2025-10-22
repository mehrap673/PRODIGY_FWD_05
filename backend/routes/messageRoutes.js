import express from 'express';
import {
  getConversations,
  getConversation,
  createConversation,
  getMessages,
  sendMessage,
  deleteMessage,
  createGroupConversation,
  addGroupMembers,
  removeGroupMember,
  leaveGroup
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversation);
router.post('/conversations', protect, createConversation);
router.post('/conversations/group', protect, createGroupConversation);

router.get('/:conversationId', protect, getMessages);
router.post('/', protect, upload.array('media', 5), sendMessage);
router.delete('/:id', protect, deleteMessage);

router.post('/groups/:id/members', protect, addGroupMembers);
router.delete('/groups/:id/members/:userId', protect, removeGroupMember);
router.post('/groups/:id/leave', protect, leaveGroup);

export default router;
