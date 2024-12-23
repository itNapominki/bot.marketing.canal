//@ts-check

const cacheService = require("../cache/CacheService");
const Command = require("./command.class");

class CleanCacheCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.onText(/\/cleancache/, (msg) => {
      try {
        const chatId = msg.chat.id;
        // очистить кэш, так как после регистрации данные изменятся
        cacheService.flushAll();        

        this.requestMessage(chatId, "Кэш сброшен");
      } catch (e) {
        console.error(e);
      }
    });
  }
}

module.exports = CleanCacheCommand;
