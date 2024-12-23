const options_btn = require("../../utils/option/options_btn");
const responseTemplate = require("../responseTemplate/responseTemplate");
const TELEGRAMM_ADMIN_CHAT = process.env.TELEGRAMM_ADMIN_CHAT;

class RequestInChatAdmin {
     constructor(bot, request) {
        this.bot = bot;
        this.request = request; 
      }

       //простой текстовый ответ
  requestOrder(post, user) {   

    setTimeout(async () => {
      await this.bot.sendMessage(TELEGRAMM_ADMIN_CHAT, responseTemplate.responseToAdminChat(this.request, post, user));
      await this.bot.sendMessage(post.tlgId, responseTemplate.responseToAgentChat(this.request, post, user), options_btn);

      let sponsor = user?.sponsor ? user?.sponsor : false;
      if(sponsor && sponsor == "89039718590") {
        await this.bot.sendMessage("427671786", responseTemplate.responseToAgentChat(this.request, post, user), options_btn);
        await this.bot.sendMessage("931824462", responseTemplate.responseToAgentChat(this.request, post, user), options_btn);

      }  



        console.log(post, user);
      

    }, 500);    
  }

  requestUSer(post) {    
    setTimeout(async () => {
      await this.bot.sendMessage(TELEGRAMM_ADMIN_CHAT,  responseTemplate.responseToAdminChatAboutRegostration(post));
      await this.bot.sendMessage(post.tlgId, `${this.request}`);
    }, 1000);    
  }

}
   
module.exports = RequestInChatAdmin;