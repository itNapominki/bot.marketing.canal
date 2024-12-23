//@ts-check

const GOOGLE_SHEETS_KEY_USERS = process.env.GOOGLE_SHEETS_KEY_USERS;
const GOOGLE_SHEETS_KEY_ORDERS = process.env.GOOGLE_SHEETS_KEY_ORDERS;
const TELEGRAMM_ADMIN_CHAT = process.env.TELEGRAMM_ADMIN_CHAT;
const BOT_API_TOKEN = process.env.BOT_API_TOKEN;

const BOT_API_URL = process.env.BOT_API_URL;
const fetch = require("node-fetch");
const LoggerManager = require("../../log/LoggerManager");
const cacheService = require("../../cache/CacheService");

class Api {
  constructor(bot) {
    this.bot = bot;
  }

  //простой текстовый ответ вынести в apiUse

  /** *
   * @param {string} chatId
   * @param {string} message
   * @param {object} option
   */
  requestMessageOnApi(chatId, message, option = {}) {
    setTimeout(async () => {
      await this.bot.sendMessage(chatId, message, option);
    }, 2000);
  }

  async updateUser(postData) {
    try {
      const response = await fetch(`${GOOGLE_SHEETS_KEY_USERS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify(postData),
      });

      let res = await response.json();
      return res;
    } catch (error) {
      new LoggerManager().logMessage("error", "error", error.message);
      console.error("Ошибка при выполнении запроса updateUser:", error);
      if (!TELEGRAMM_ADMIN_CHAT) {
        return;
      }
      this.requestMessageOnApi(
        TELEGRAMM_ADMIN_CHAT,
        `Ошибка Google sheets при регистрации пользователя ${JSON.stringify(
          postData
        )}`,
        {}
      );
    }
  }

  /**
   *
   * @param {{action: string, tlgId: string}} postData
   * @returns {Promise<{ result: { code: number, message: { rowNumber: number, spzId: number, number: number, name: string, tlgId: number, tlgName: string, status: string, role: string,  sponsor: string, sponsorName: string, }, } } | undefined>}
   *   */

  async checkUser(postData) {
    try {
      //кэш для запросов
      // const { tlgId } = postData;
      // if (cacheService.has(tlgId)) {
      //   console.log("кэш найден", cacheService.get(tlgId));
      //   return cacheService.get(tlgId);
      // }
      //console.log("кэш не найден", tlgId);
      const response = await fetch(`${BOT_API_URL}/api/bot/user/tlg`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization" : BOT_API_TOKEN,
        },
        body: JSON.stringify(postData),
      });

      let res = await response.json();

      console.log(res);

      //cacheService.set(tlgId, res);

      return res;
    } catch (error) {
      new LoggerManager().logMessage("error", "checkUser", error.message);
      console.error("Ошибка при выполнении запроса checkUser:", error);
      if (!TELEGRAMM_ADMIN_CHAT) {
        return;
      }
      this.requestMessageOnApi(
        TELEGRAMM_ADMIN_CHAT,
        `Ошибка Google sheets при проверки пользователя, (выполнен первичный запрос к таблицам) ${JSON.stringify(
          postData
        )}`,
        {}
      );
    }
  }

  async postOrder(postData) {
    try {
      const response = await fetch(`${GOOGLE_SHEETS_KEY_ORDERS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      let res = await response.json();
      
      return res;
    } catch (error) {
      console.error("Ошибка при выполнении запроса postOrder:", error);
      if (!TELEGRAMM_ADMIN_CHAT) {
        return;
      }
      this.requestMessageOnApi(
        TELEGRAMM_ADMIN_CHAT,
        `Ошибка Google sheets при отправке заказа ${JSON.stringify(postData)}`,
        {}
      );
    }
  }
}

module.exports = Api;
