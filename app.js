const express = require('express');
const mongoose = require('mongoose');
const {bot} = require('./bot.js');
const sendMsg = require('./middlewares/sendMsg')
const cors = require('cors');
require('dotenv').config()
const app = express();

mongoose.connect(process.env.DB_URL).then(() => {
  console.log('DB connected');
}).catch(err => {
  console.log('DB connection error: ' + err);
})

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.json({ message: 'HI'})
})

app.post('/api/bot', sendMsg, (req, res) => {
  res.json({ message: "ok" });
})

app.listen(PORT, () => {
  console.log(`Server started on: http://localhost:${PORT}`);
})