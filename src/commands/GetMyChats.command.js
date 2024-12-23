//@ts-check

const ApiWeb = require("../utils/api/apiWeb");
const Command = require("./command.class");

class GetMyChatsCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.onText(/\/chats/, async (msg) => {
      try {
        const chatId = msg.chat.id;
        new ApiWeb(this.bot).botCommandChats(chatId);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

module.exports = GetMyChatsCommand;
