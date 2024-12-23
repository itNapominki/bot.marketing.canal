//@ts-check

const BOT_API_TOKEN = process.env.BOT_API_TOKEN;
//const BOT_API_TOKEN = process.env.BOT_API_TOKEN;

const BOT_API_URL = process.env.BOT_API_URL;

const GROUP_MANAGER = process.env.GROUP_MANAGER;

const TELEGRAMM_ADMIN_CHAT = process.env.TELEGRAMM_ADMIN_CHAT;


const GOOGLE_SHEETS_KEY_ORDERS = process.env.GOOGLE_SHEETS_KEY_ORDERS;
const fetch = require("node-fetch");

class ApiWeb {
  constructor(bot) {
    this.bot = bot;
  }

  requestMessageOnApi(chatId, message, option = {}) {
    setTimeout(async () => {
      await this.bot.sendMessage(chatId, message, option);
    }, 2000);
  }

  // для записи в банкеты напрямую
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

      console.log(res);

      await this.bot.sendMessage(TELEGRAMM_ADMIN_CHAT, `Записано в банкеты, номер заказа, ${res.result.rowA}`);

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

  async sheetsWrite(comment) {
    let number = "Посмотрите в комментарии";
    let city = "Москва";
    let agentIdSPZ = "маркетинг";
    let nameContact = "Посмотрите в комментарии";
    let customerSource = "Заявка";
    let typeOrder = "feast";
    let sponsorName = "Андрей";

    const postData = {
      number: number,
      city: city,
      agentIdSPZ: agentIdSPZ,
      typeOrder: typeOrder,
      sponsorName: sponsorName,
      nameContact:nameContact,
      comment: comment,
      customerSource: customerSource
    };

    console.log(postData, "ssssssssssssssssss");
    this.postOrder(postData);
  }

  // для отправки в админку бота
  async postData(postData, url) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: BOT_API_TOKEN,
        },
        body: JSON.stringify(postData),
      });

      // Получаем данные из ответа
      const data = await response.json();

     

      if (response.status !== 200) {
        // await this.bot.sendMessage(GROUP_MANAGER, `Ошибка сервера ${response.status}`);
      } else {
        // await this.bot.sendMessage(GROUP_MANAGER, `ИД Агента ${data.data.opera_id}`);
        // await this.bot.sendMessage(GROUP_MANAGER, `Заказ будет записан в операционку, уведомление будет в группе телеграм`);
      }
    } catch (error) {
      await this.bot.sendMessage(GROUP_MANAGER, error.message);
    }
  }

  async botWriteRoistat(phone, comment) {
    let url = BOT_API_URL + "/api/bot/whatsapp/user/phone";
    const post = { phone: phone, comment: comment };
    this.postData(post, url);
  }
}
module.exports = ApiWeb;
