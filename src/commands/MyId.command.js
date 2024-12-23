// @ts-check

const TELEGRAMM_ADMIN_CHAT = process.env.TELEGRAMM_ADMIN_CHAT;
//const WEBAPPURL = process.env.WEBAPPURL;
const ChatHandle = require("../core/chats/chat-handle");
const Command = require("./command.class");
const responseTemplate = require("./responseTemplate/responseTemplate");

class MyIdCommand extends Command {
  constructor(bot) {
    super(bot);
  }
  handle() {
    try {
      this.bot.onText(/\/myid/, (msg) => {
        const chatId = msg.chat.id;
        const firstName = msg.chat.first_name
          ? msg.chat.first_name
          : ", имя отсутствует";
        const userName = msg.chat.username
          ? msg.chat.username
          : ", имя телеграм отсутствует";

        new ChatHandle(this.bot).logoutChat(chatId);

        // const options = {
        //   reply_markup: {
        //     inline_keyboard: [
        //       [
        //         {
        //           text: 'Оформить заявку',
        //           web_app: { url: WEBAPPURL } // Замените на URL вашего веб-приложения
        //         }
        //       ]
        //     ]
        //   }
        // };

        // this.bot.sendMessage(chatId, `Ваш id ${chatId}`, options);

     
        
        this.bot.sendMessage(
          TELEGRAMM_ADMIN_CHAT,
          `Пользователь запросил свой id ${chatId}, имя: ${firstName} , имя телеграм ${userName}`
        );
      });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = MyIdCommand;
