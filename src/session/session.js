// @ts-check

const fs = require("fs");
const Api = require("../utils/api/api");
const AipUse = require("../utils/api/apiUse");
const RequestInChatAdmin = require("../commands/handle/RequestInChatAdmin");

class Session {
  constructor(bot) {
    this.bot = bot;
  }

  clearSession(fileName, tlgId) {
    let file = this.getfileJsonFormessage(fileName);
    // получаем нужный объект
    const itemSession = file.find((item) => item.tlgId == tlgId);

   // console.log(itemSession);

    if (!itemSession) {
      return "Данных для очистки нет, для оформления заказа введите /order";
    }
    // фильтруем файд
    const dataSession = file.filter((item) => item.tlgId != tlgId);
    // перезаписываем файл
    this.writeTofilesession(fileName, dataSession);
    return "Данных по заказу сброшены, для оформления нового заказа введите /order";
  }

  getfileJsonFormessage(fileName) {
    if (!fs.existsSync(fileName)) {
      fs.writeFileSync(fileName, "[]", "utf8");
    }

    const fileContent = fs.readFileSync(fileName, "utf8");
    const session = JSON.parse(fileContent);
    return session;
  }

  async _postSession(postData, apiUseMethod, requestMethod) {
    // удаляем лишний ключ
    delete postData.step;

    const api = new Api(this.bot);
    const request = await new AipUse(api)[apiUseMethod](postData); // updateUser

    if (!request) {
      return;
    }

    await new RequestInChatAdmin(this.bot, request)[requestMethod](postData);
    return;
  }

  async _postSessionUser(postData) {
    // удаляем лишний ключ
    delete postData.step;

    const api = new Api(this.bot);
    const request = await new AipUse(api).updateUser(postData); // updateUser

    if (!request) {
      return;
    }

    await new RequestInChatAdmin(this.bot, request).requestUSer(postData);
    return;
  }

  async _postSessionOrder(postData) {
    // удаляем лишний ключ
    delete postData.step;

    // записываем в буфер, а буфер сам отправляет по очереди

    let buffer = this.getfileJsonFormessage("heaporders.json");

    buffer.push(postData);

    this.writeTofilesession("heaporders.json", buffer);
  }

  //endSession(fileName, tlgId, type = this._cheskParam("type")) {
/**
 * Собрать полное имя пользователя
 * @param {string} fileName — имя
 * @param {string} tlgId — фамилия
 * @param {string} type — фамилия * 
 */

  endSession(fileName, tlgId, type) {
   
    // получаем файл
    let file = this.getfileJsonFormessage(fileName);
    
    // получаем нужный объект
    const itemSession = file.find((item) => item.tlgId == tlgId);
    // фильтруем файд
    const dataSession = file.filter((item) => item.tlgId != tlgId);
    // перезаписываем файл
    this.writeTofilesession(fileName, dataSession);
    // отправляем API для записи в google sheets
    // выбираем что постим пользователя или заказ

    if (type == "order") {
      this._postSessionOrder(itemSession);
    } else if (type == "user") {
      this._postSessionUser(itemSession);
    } else {
      console.error(
        "Не определен тим заказ или пользователь в функции endSession"
      );
    }
  }

  writeTofilesession(fileName, session) {
    fs.writeFileSync(fileName, JSON.stringify(session, null, 2), "utf8");
  }
}

module.exports = Session;
