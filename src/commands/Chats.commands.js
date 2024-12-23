//@ts-check
const ApiWeb = require("../utils/api/apiWeb");
const Command = require("./command.class");
const TELEGRAMM_ADMIN_CHAT = process.env.TELEGRAMM_ADMIN_CHAT;

class ChatsCommands extends Command {
  constructor(bot) {
    super(bot);
  }

  _getWhoAgent(text) {
    function findProject(search) {
      const regex = new RegExp(search, "i"); 
      return regex.test(text);
    }

    const findAgent = [
      { id: "682", search: "Андрющенко", phone: "89999999682", typeOrder: "wake" }, // "feast"
      { id: "683", search: "Гринюк", phone: "89999999683", typeOrder: "wake"  },
      { id: "684", search: "Матисен" , phone: "89999999684" , typeOrder: "wake" },
      { id: "685", search: "Аарон" , phone: "89999999685" , typeOrder: "wake" },
      { id: "686", search: "Брусанова" , phone: "89999999686" , typeOrder: "wake" },
      { id: "687", search: "Борисенко" , phone: "89999999687" , typeOrder: "wake" },
      { id: "688", search: "Шалимова" , phone: "89999999688" , typeOrder: "wake" },
      { id: "689", search: "Оглезнева" , phone: "89999999689" , typeOrder: "wake" },
      { id: "690", search: "Белинская" , phone: "89999999690" , typeOrder: "wake" },
      { id: "691", search: "Крылова" , phone: "89999999691" , typeOrder: "wake" },
      { id: "693", search: "Галицкая", phone: "89999999693"  , typeOrder: "wake" },
      { id: "roistat", search: "Проект: Новый проект" , phone: "89999999991" , typeOrder: "wake" },
      { id: "marketing", search: "napominki.ru", phone: "89999999999" , typeOrder: "wake" },
      { id: "marketing", search: "24catering.ru", phone: "89999999999" , typeOrder: "feast" }, 
    ];   

    const foundAgents = findAgent.filter((item) => findProject(item.search));

    return foundAgents.length > 0
      ? foundAgents[0]
      : false;
  }

  handle() {
    this.bot.on("channel_post", async (msg) => {
      try {
        const message = msg.text;

        if (message == "/start") {
          this.bot.sendMessage(
            msg.sender_chat.id,
            `Ваш ид: ${msg.sender_chat.id}`
          );
        } else {         

          const agent = this._getWhoAgent(message);

          if (agent) {

            this.bot.sendMessage(TELEGRAMM_ADMIN_CHAT, "Временно не записываю");
            // this.bot.sendMessage(
            //   TELEGRAMM_ADMIN_CHAT,
            //   `Информация об агенте, id ${agent.id}, ключ ${agent.search}, ожидайте в операционке, уведомление придет в главный чат в течении 5 минут`
            // );


            if(agent.typeOrder == "feast") {
              this.bot.sendMessage(TELEGRAMM_ADMIN_CHAT, "Регистрирую запись в таблицу БАНКЕТЫ инфо (запишется сразу)");
                new ApiWeb(this.bot).sheetsWrite(message);
            } 

            if(agent.typeOrder == "wake") {
              //  new ApiWeb(this.bot).botWriteRoistat(agent.phone, message);
              this.bot.sendMessage(TELEGRAMM_ADMIN_CHAT, "Регистрирую запись в таблицу ЛИДЫ инфо (ожидайте в операционке, уведомление придет в главный чат в течении 5 минут)");
            }            
           
          } else {
          //  this.bot.sendMessage(TELEGRAMM_ADMIN_CHAT, "Не смог определить агента (подобрать ключ) и НЕ записал в таблицу");
          }

         
        }

        console.log(msg);
      } catch (e) {
        if (!TELEGRAMM_ADMIN_CHAT) {
          return;
        }
        console.error(e);
      }
    });
  }
}

module.exports = ChatsCommands;
