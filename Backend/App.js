const express = require('express');
const mongoose= require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const chatRouter= require('./routes/chatRoute')
const port = 3001;

app.use(bodyParser.json({ extended: false }));
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(chatRouter)




mongoose.connect('mongodb+srv://kamalesh5112:Kamal2000@cluster0.7yk6gtm.mongodb.net/chatbot?retryWrites=true&w=majority').then(result=>{
  app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
  });
}).catch(err=>console.log(err));