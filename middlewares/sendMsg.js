const {bot} = require("../bot.js")
const { BotModel } = require('../models/BotSchema')

function createMessage(order) {
  for (let key in order) {
    if (order[key].includes("+")) {
      order[key] = order[key].replace(/\+/g, "\\+", )
    }
  }
  return `*Новая заявка* 📍

    *Имя:* ${order.name}

    *Телефон:* ${order.phone}

    *Описание:* ${order.description}`
}

module.exports = async function (req, res, next) {
  try {
    const order = req.body
    const users = await BotModel.find()
    users.forEach(user => {
      bot.telegram.sendMessage(user.chatId, createMessage(order), {parse_mode: "MarkdownV2"});
    })
  } catch(err) {
    console.log('Bot sending error');
    console.log(err);
    
  }
  next()
}