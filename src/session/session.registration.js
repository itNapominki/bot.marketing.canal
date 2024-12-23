// @ts-check

const Api = require("../utils/api/api");
const AipUse = require("../utils/api/apiUse");
const Session = require("./session");
const SESSION_RESPONSE = require("./session.respons");

class SessionRegistration extends Session {
  constructor(msg, bot) {
    super(bot);
    this.FileName = "registration.json";
    this.message = [];
    this.file = this.getfileJsonFormessage(this.FileName);
    this.step = 0;
    this.msg = msg;
    this.tlgId = `${this.msg.from.id}`;
    this.tlgName = this.msg.from.username;    
  }

  _writeToFile(data, session) {
    // собираем данные другие сесии + новая и записываем обновленный файл
    data.push(session);
    return this.writeTofilesession(this.FileName, data);
  }

  _validationValueMessage(value, step) {    
    return SESSION_RESPONSE.REG[step].validation(value);
  }

  _getTitleStep(step) {
    return SESSION_RESPONSE.REG[step].title;
  }

  _getOptionStep(step) {
    return SESSION_RESPONSE.REG[step].option;
  }

  clear(tlgId) {
    return this.clearSession(this.FileName, tlgId);
  }

  createSession() {
    if (this.file.length < 1) {
      // [] это для первого значения, если сессий нет
      // собираем сессию
      const session = {
        action: "update",
        tlgId: this.tlgId,
        tlgName: this.tlgName,
        step: this.step,
      };
      this._writeToFile([], session);
      let message = this._getTitleStep(this.step);
      return { step: this.step, message: message, option: {}, status: true  };
    }
    
    // если сесии какие то есть то ищем у текущего пользователя
    const itemSession = this.file.find((item) => item.tlgId == this.tlgId);
    // сессию нашли для текущего tlgId получаем  ее и начинаем работать с ней
    if (itemSession) {      
      let message = this._getTitleStep(itemSession.step);
      return { step: itemSession.step, message: message, option: {}, status: true  };
    } else {
      // собираем новую сессию для пользователя если ранее у нт сесии
      const session = {
        action: "update",
        tlgId: this.tlgId,
        tlgName: this.tlgName,
        step: this.step,
      };
      this._writeToFile(this.file, session);
      let message = this._getTitleStep(this.step);
      return { step: this.step, message: message, option: {}, status: true  };
    }
  }

  _handleTextStep(){

  }

  // обновление сессии 

  /**
   * 
   * @returns {{ step: number, message: string, option: object, status: boolean  }}
   */
  handleSession() {    
    const itemSession = this.file.find((item) => item.tlgId == this.tlgId);
    const dataSession = this.file.filter((item) => item.tlgId != this.tlgId);

    if (itemSession) {
      let step = itemSession.step;
      let { text } = this.msg;
      let message;
      let validationMessage;
      switch (step) {
        case 0:
          validationMessage = this._validationValueMessage(text, step);
          if (validationMessage) {
            message = this._getTitleStep(itemSession.step);
            return { step: 1, message: validationMessage, option: {}, status: true  };
          }

          itemSession.step = 1;
          itemSession.name = text;
          this._writeToFile(dataSession, itemSession);

          message = this._getTitleStep(itemSession.step);
          return { step: 1, message: message, option: {}, status: true  };

          break;
        case 1:
          validationMessage = this._validationValueMessage(text, step);

          if (validationMessage) {
            message = this._getTitleStep(itemSession.step);
            return { step: 1, message: validationMessage, option: {}, status: true  };
          }
          itemSession.step = 2;
          itemSession.number = text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);          
          let option = this._getOptionStep(itemSession.step);
          return { step: 2, message: message, option: option, status: true };

          break;

          case 2:           
          this.bot.sendMessage(itemSession.tlgId, "Выберите вариант по кнопке", {});
          return {
            step: 3,
            message: "Выберите вариант по кнопке",
            option: {},
            status: false
          };
          break
          

        default:
          // выполнится, если ни один другой случай не сработал
          console.log("Что делать незнаю");
          break;
      }

      return itemSession;
    } else {
      return {
        step: 3,
        message: "Для оформления заявки вначале введите команду /order",
        option: {},
        status: false
      };
    }
  }

  /**
 * Собрать полное имя пользователя
 * @param {string} command — имя
 * @param {string} chatId — фамилия
 * @param {string} messageId — фамилия
 * @returns {{ step: number, message: string, option: object, status: boolean}} — полное имя
 */

  handleButton(command, chatId, messageId) {
    // получаем данные о текущей сесии
    const itemSession = this.file.find((item) => item.tlgId == chatId);
    // получаем остальные сесии 
    const dataSession = this.file.filter((item) => item.tlgId != chatId);

    if (itemSession) {

      let message;
      switch (command) {
        case "button_reg_employee":
          itemSession.step = 3;
          itemSession.role = "employee";
          this._writeToFile(dataSession, itemSession);
          this.endSession(this.FileName, chatId, "user");
          message = this._getTitleStep(3);
          this.bot.editMessageText(`Вы выбрали Сотрудник СПЗ`, { chat_id: itemSession.tlgId, message_id: messageId });
         
          return { step: 3, message: message, option: {}, status: true  };
          break;
        case "button_reg_agent":
          itemSession.step = 3;
          itemSession.role = "agent";
          this._writeToFile(dataSession, itemSession);
          
          // завершение сесии
          this.endSession(this.FileName, chatId, "user");
          message = this._getTitleStep(3);
          this.bot.editMessageText(`Вы выбрали Агент`, { chat_id: itemSession.tlgId, message_id: messageId });
         
          return { step: 3, message: message, option: {}, status: true  };
          break;
        default:
          console.log("Что делать незнаю");
          // выполнится, если ни один другой случай не сработал
          break;
      }
      return itemSession;
    } else {
      return {
        step: 3,
        message: "Кнопка больше не активна",
        option: {},
        status: false
      };
    }
  }
}

module.exports = SessionRegistration;
