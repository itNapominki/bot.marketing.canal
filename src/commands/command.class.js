// @ts-check

const ChatHandle = require("../core/chats/chat-handle");

class Command {
  constructor(bot) {
    this.bot = bot;
  }

  //простой текстовый ответ
  /** *
   * @param {string} chatId
   * @param {string} message
   * @param {object} option
   */
  requestMessage(chatId, message, option = {}) {
    try {
      setTimeout(async () => {
        await this.bot.sendMessage(chatId, message, option);
      }, 500);
    } catch (e) {
      console.error(e);
    }
  }

  //быстрая проверка заполнено ли имя у пользователя телеграмм
  /** *
   * @param {string} chatId
   * @param {string} chatUsername
   * @returns {boolean}
   */

  checkUserName(chatId, chatUsername) {
    let isCheckUserName = true;
    if (!chatUsername) {
      this.requestMessage(
        chatId,
        `Вы не можете пользоваться ботом, заполните имя телеграмм ваш ИД ${chatId}`
      );
      isCheckUserName = false;
    }
    return isCheckUserName;
  }

  /** *
   * @param {number} chatId
   * @returns {Promise<{ status: boolean; message: string; }>}
   */
  async checkinChat(chatId) {
    const inChatData = await new ChatHandle(this.bot).checkInChat(chatId);
    if (inChatData.status) {
      return {
        status: true,
        message:
          "Вы сейчас находитесь в режиме чата, и не можете начать оформление заявки, пожалуйста выйдите из чата командой /logoutchat",
      };
    } else {
      return { status: false, message: "" };
    }
  }
}

module.exports = Command;
