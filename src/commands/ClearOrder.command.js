//@ts-check

const SessionOrder = require("../session/session.order");
const ApiWeb = require("../utils/api/apiWeb");
const Command = require("./command.class");

class ClearOrderCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.onText(/\/clear/, async (msg) => {


      const chatId = msg.chat.id;
      //await this.bot.deleteMessage(chatId, msg.message_id);
      new ApiWeb(this.bot).botCommandClear(chatId);
      // const chatUsername = msg.chat.username;

      // // let isCheckUserName = this.checkUserName(chatId, chatUsername);
      // // // проверка заполнено ли имя
      // // if (!isCheckUserName) {
      // //   return;
      // // }

      // const message = new SessionOrder(msg, this.bot).clear(chatId);

      // this.requestMessage(chatId, message, {});
      // return;
    });
  }
}

module.exports = ClearOrderCommand;
