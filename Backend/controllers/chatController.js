const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
const ChatSession = require('../models/ChatSession');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function startNewChat() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  return model.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });
}

// Send a message and get a response
async function generateResponse(chat, message) {
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}

// Create a new chat session
exports.createChatSession = async (req, res) => {
  const { message } = req.body;
  const sessionId = uuidv4();

  try {
    const chat = await startNewChat();
    const responseText = await generateResponse(chat, message);

    const newSession = new ChatSession({
      sessionId,
      initialMessage: message,
      messages: [{ text: message, sender: 'user' }, { text: responseText, sender: 'bot' }]
    });

    await newSession.save();

    res.json({ sessionId, response: responseText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
};

// Send a message in an existing chat session
exports.sendMessage = async (req, res) => {
  const { sessionId, message } = req.body;
  console.log()

  try {
    if(!sessionId){
        
        let newSessionId = uuidv4();

        try {
            const chat = await startNewChat();
            const responseText = await generateResponse(chat, message);

            const newSession = new ChatSession({
            sessionId:newSessionId,
            initialMessage: message,
            messages: [{ text: message, sender: 'user' }, { text: responseText, sender: 'bot' }]
            });

            await newSession.save();

            return res.json({ sessionId:newSessionId, response: responseText });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create chat session' });
        }

    }
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Initialize chat with the existing history
    const chat = await startNewChat();
    for (const msg of chatSession.messages) {
      await chat.sendMessage(msg.text);
    }

    // Send the new message
    const responseText = await generateResponse(chat, message);

    chatSession.messages.push({ text: message, sender: 'user' });
    chatSession.messages.push({ text: responseText, sender: 'bot' });

    await chatSession.save();

    return res.json({ sessionId, response: responseText });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all chat sessions
exports.getAllChatSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find();
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
};

// Get a specific chat session
exports.getChatSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const chatSession = await ChatSession.findOne({ sessionId });
    if (!chatSession) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json(chatSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
};
