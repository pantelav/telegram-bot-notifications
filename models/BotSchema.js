const mongoose = require('mongoose')

const BotSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  userName: String,
}, {
  timestamps: true,
})

exports.BotModel = mongoose.model("Bot", BotSchema);