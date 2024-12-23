//@ts-check

const RequestInChatAdmin = require("../commands/handle/RequestInChatAdmin");
const Api = require("../utils/api/api");
const AipUse = require("../utils/api/apiUse");
const Session = require("./session");
class SessionServisPostOrder extends Session {
  constructor(bot) {
    super(bot);
    this.bot = bot;
    this.FileName = "heaporders.json";
  }

  async _post(postData) {
    let checkPost = {
      action: "check",
      tlgId: postData.tlgId,
    };

    const api = new Api(this.bot);
    const user = await new AipUse(api).checkUser(checkPost);
    if (!user) {
      return;
    }

    const request = await new AipUse(api).postOrder(postData);
    if (!request) {
      return;
    }    

    await new RequestInChatAdmin(this.bot, request).requestOrder(
      postData,
      user
    );

    return;
  }

  start() {
    setTimeout(() => {
      let file = this.getfileJsonFormessage(this.FileName);
      console.log(file.length);
      if (file.length < 1) {
        console.log("Нет данных к отправке");
        this.start();
        return;
      }
      // первая по счету заявка
      let postData = file[0];
      // выбераю все кроме первой
      let dataHeap = file.splice(1);

      this.writeTofilesession(this.FileName, dataHeap);
      // запускаем цикл повторно после ответа
      this._post(postData).then(() => this.start());

      console.log("Проверка тайм");
    }, 20000);
  }
}

module.exports = SessionServisPostOrder;
