const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/api/chat', chatController.sendMessage);
router.post('/api/chat/new', chatController.createChatSession);
router.get('/api/chats', chatController.getAllChatSessions);
router.get('/api/chat/:sessionId', chatController.getChatSession);

module.exports = router;
