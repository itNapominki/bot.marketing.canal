// @ts-check

const Command = require("./command.class");
const ApiWeb = require("../utils/api/apiWeb");

class ContactCommand extends Command {
  constructor(bot) {
    super(bot);
  }


  async postUser(phone, tlgId) {
    const request = new ApiWeb(this.bot).botContact(tlgId , phone);
    console.log(request);
    return;
  }

  handle() {
    this.bot.on('contact', async (msg)  => {
      const chatId = msg.chat.id;     
      const contact = msg.contact;
      if (contact) {
          const phoneNumber = contact.phone_number;
          this.bot.sendMessage(chatId, `Ваш номер телефона: ${phoneNumber} , ${chatId}`);
          this.postUser(phoneNumber, chatId);
        }

      return;
    });
  }
}

module.exports = ContactCommand;
