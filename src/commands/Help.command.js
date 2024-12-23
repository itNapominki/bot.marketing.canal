//@ts-check

const ChatHandle = require("../core/chats/chat-handle");
const Command = require("./command.class");
const responseTemplate = require("./responseTemplate/responseTemplate");

class HelpCommand extends Command {
  constructor(bot) {
    super(bot)
  }
  handle() {
      this.bot.onText(/\/help/, (msg) => {
        const chatId = msg.chat.id;
        new ChatHandle(this.bot).logoutChat(chatId);
        this.bot.sendMessage(chatId, responseTemplate.help);
      });
    }
  }
  
  module.exports = HelpCommand;