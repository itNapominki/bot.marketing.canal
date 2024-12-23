// @ts-check

const cacheService = require("../cache/CacheService");
const ChatHandle = require("../core/chats/chat-handle");
const Command = require("./command.class");

class RegisrtationCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.onText(/\/registration/, (msg) => {
      const chatId = msg.chat.id;

      if (msg.chat.type !== 'private') {
        this.requestMessage(chatId, `Эта команда доступна только в личных сообщениях. ${chatId}`);
        return;
      }  

     // new ChatHandle(this.bot).logoutChat(chatId);

      const options = {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Регистрация, НАЖМИТЕ СЮДА 🚨",
                request_contact: true,
              },
            ],
          ],
          one_time_keyboard: true,
        },
      };

      this.requestMessage(
        chatId,
        "Пожалуйста, поделитесь своим номером телефона, НАЖМИТЕ <<Регистрация, нажмите сюда>>:",
        options
      );

      return;
    });
  }
}

module.exports = RegisrtationCommand;
