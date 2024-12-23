// @ts-check

const ChatHandle = require("../core/chats/chat-handle");
const SessionOrder = require("../session/session.order");
const Api = require("../utils/api/api");
const AipUse = require("../utils/api/apiUse");
const ApiWeb = require("../utils/api/apiWeb");
const copirite_text = require("../utils/const/copirite_admin");
const Command = require("./command.class");

class OrderCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  async _useCheskUser(tlgId) {
    let checkPost = {
      action: "check",
      tlgId: `${tlgId}`,
    };
    const api = new Api(this.bot);
    const request = await new AipUse(api).checkUser(checkPost);

    if (!request) {
      return;
    }

    return request;
  }

  handle() {
    this.bot.onText(/\/order/, async (msg) => {
      const chatId = msg.chat.id;
      //await this.bot.deleteMessage(chatId, msg.message_id);


          // Отправляем сообщение с пустой клавиатурой
          const options = {
            reply_markup: {
              remove_keyboard: true, // Удаляем клавиатуру
            },
          };

      await this.bot.sendMessage(chatId, 'Начало оформления заявки', options );  //Начато оформление заявки, заполняйте информацию по очереди
     new ApiWeb(this.bot).botCommandOrder(chatId);    
    });
  }
}

module.exports = OrderCommand;
