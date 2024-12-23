//@ts-check

const Api = require("../utils/api/api");
const AipUse = require("../utils/api/apiUse");
const Session = require("./session");
const SESSION_RESPONSE = require("./session.respons");

class SessionOrder extends Session {
  constructor(msg, bot) {
    super(bot);
    this.FileName = "order.json";
    this.message = [];
    this.file = this.getfileJsonFormessage(this.FileName);
    this.step = 0;
    this.msg = msg;
    this.tlgId = `${this.msg.from.id}`;
    this.tlgName = this.msg.from.username;
    //this.apiUseMethod = "postOrder";
    //this.requestMethod = "requestOrder";
  }

  clear(tlgId) {
    return this.clearSession(this.FileName, tlgId);
  }

  _writeToFile(data, session) {
    // собираем данные другие сесии + новая и записываем обновленный файл
    data.push(session);
    return this.writeTofilesession(this.FileName, data);
  }

  _validationValueMessage(value, step) {
    return SESSION_RESPONSE.ORDER[step].validation(value);
  }

  _getTitleStep(step) {
    return SESSION_RESPONSE.ORDER[step].title;
  }

  _getOptionStep(step) {
    return SESSION_RESPONSE.ORDER[step].option;
  }

  /** * 
   * @param {string} spzId 
   * @param {string} sponsorName
   * @param {string} name
   * @returns {{ step: number, message: string, option: {reply_markup: any} | {}, status: boolean }}
   */

  createSession(spzId, sponsorName, name) {
    if (this.file.length < 1) {
      // [] это для первого значения, если сессий нет
      // собираем сессию
      const session = {
        action: "order",
        typeOrder: "wake",
        tlgId: this.tlgId,
        tlgName: this.tlgName,
        step: this.step,
        agentIdSPZ: spzId,
        sponsorName: sponsorName,
        comment: `Имя агента ${name}`,
      };
      this._writeToFile([], session);
      let message = this._getTitleStep(this.step);
      return { step: this.step, message: message, option: {}, status: true };
    }

    // если сесии какие то есть то ищем у текущего пользователя
    const itemSession = this.file.find((item) => item.tlgId == this.tlgId);
    // сессию нашли для текущего tlgId получаем  ее и начинаем работать с ней
    if (itemSession) {
      let message = this._getTitleStep(itemSession.step);
      return {
        step: itemSession.step,
        message: message,
        option: {},
        status: true,
      };
    } else {
      // собираем новую сессию для пользователя если ранее у нт сесии
      const session = {
        action: "order",
        typeOrder: "wake",
        tlgId: this.tlgId,
        tlgName: this.tlgName,
        step: this.step,
        agentIdSPZ: spzId,
        sponsorName: sponsorName,
        comment: `Имя агента ${name}`,
      };
      this._writeToFile(this.file, session);
      let message = this._getTitleStep(this.step);
      return { step: this.step, message: message, option: {}, status: true };
    }
  }

  // обновление сессии
  /**
   * 
   * @returns {{ step: number, message: string, option: object, status: boolean }}
   */
  handleSession() {
    const itemSession = this.file.find((item) => item.tlgId == this.tlgId);
    const dataSession = this.file.filter((item) => item.tlgId != this.tlgId);

    if (itemSession) {
      let step = itemSession.step;
      let { text } = this.msg;
      let message;
      let option;
      let chatId = itemSession.tlgId;

      // валидация сообщений
      let validationMessage = this._validationValueMessage(text, step);
      if (validationMessage) {
        message = this._getTitleStep(itemSession.step);
        return {
          step: 1,
          message: validationMessage,
          option: {},
          status: true,
        };
      }

      switch (step) {
        case 0:
          itemSession.step++;
          itemSession.nameContact = text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          option = this._getOptionStep(itemSession.step);
          return { step: 0, message: message, option: {}, status: true };
          break;

        case 1:
          itemSession.step++;
          itemSession.number = text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          option = this._getOptionStep(itemSession.step);
          return {
            step: 2,
            message: message,
            option:  option ,
            status: true,
          };
          break;

        case 2:
          itemSession.step++;
          itemSession.fio = text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          option = this._getOptionStep(itemSession.step);
          return { step: 0, message: message, option: option, status: true };
          break;

        case 3:
          itemSession.step++;
          itemSession.dateLeft = text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          option = this._getOptionStep(itemSession.step);
          return { step: 0, message: message, option: option, status: true };
          break;

        case 4:
          itemSession.step++;
          itemSession.dateWake = text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          option = this._getOptionStep(itemSession.step);
          return { step: 0, message: message, option: option, status: true };
          break;

        case 5:
          itemSession.step++;
          itemSession.timeWake = text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          //option = this._getOptionStep(itemSession.step);
          return { step: 0, message: message, option: {}, status: true };
          break;

          case 7:
            itemSession.step++;
            itemSession.comment = itemSession.comment + " " + text;
            this._writeToFile(dataSession, itemSession);
            message = this._getTitleStep(itemSession.step);
            // завершение сесии  
            option = this._getOptionStep(itemSession.step);          
            return { step: 0, message: message, option: option, status: true };
            break;

        case 8:
          itemSession.step++;
          itemSession.comment = itemSession.comment + " " + text;
          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          // завершение сесии
          option = this._getOptionStep(itemSession.step);
          this.endSession(this.FileName, chatId, "order");
          return { step: 0, message: message, option: option, status: true };
          break;
        ///

        default:
          // выполнится, если ни один другой случай не сработал
          console.log("Что делать незнаю");
          break;
      }

      return itemSession;
    } else {
      return {
        step: 0,
        message: "Если вы хотите оформить заявку нажмите /order",
        option: {},
        status: false,
      };
    }
  }
  
 /**
   * 
   * @returns {{ step: number, message: string, option: object, status: boolean }}
   */
  handleButton(command, chatId, messageId) {

   // console.log(command, chatId, messageId);
    // получаем данные о текущей сесии
    const itemSession = this.file.find((item) => item.tlgId == chatId);
    // получаем остальные сесии
    const dataSession = this.file.filter((item) => item.tlgId != chatId);
    //console.log(itemSession, command, chatId, messageId);
    if (itemSession) {
      let message;
      let option;
      switch (command) {
        // кнопки по городам
        case "button_order_moscow":
        case "button_order_mo":
        case "button_order_cpb":
        case "button_order_lo":
        case "button_order_nn":
          const cityMap = {
            button_order_moscow: "Москва",
            button_order_mo: "МО",
            button_order_cpb: "СПб",
            button_order_lo: "ЛО",
            button_order_nn: "НН",
          };

          itemSession.step++;
          itemSession.city = cityMap[command];
          // при выборе по кнопке написать в чат что выбрано

          this.bot.editMessageText(`Вы выбрали ${itemSession.city}`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });

          this._writeToFile(dataSession, itemSession);
          message = this._getTitleStep(itemSession.step);
          option = this._getOptionStep(itemSession.step);
          return { step: 6, message: message, option: option, status: true };
          break;
        // кнопки времени поминок

        case "9:00-9:30":
        case "9:30-10:00":
        case "10:00-10:30":
        case "10:30-11:00":
        case "11:00-11:30":
        case "11:30-12:00":
        case "12:00-12:30":
        case "12:30-13:00":
        case "13:00-13:30":
        case "13:30-14:00":
        case "14:00-14:30":
        case "14:30-15:00":
        case "15:00-15:30":
        case "15:30-16:00":
        case "16:00-16:30":
        case "16:30-17:00":
        case "17:00-17:30":
        case "17:30-18:00":
        case "18:00-18:30":
        case "18:30-19:00":
        case "19:00-19:30":
        case "19:30-20:00":
        case "20:00-20:30":
        case "20:30-21:00":
        case "21:00-21:30":
        case "21:30-22:00":
        case  "option_order_timeWake_empty":          
          const timeWake = {
            "9:00-9:30": "9:00-9:30",
            "9:30-10:00": "9:30-10:00",
            "10:00-10:30": "10:00-10:30",
            "10:30-11:00": "10:30-10:00",
            "11:00-11:30": "11:00-11:30",
            "11:30-12:00": "11:30-12:00",
            "12:00-12:30": "12:00-12:30",
            "12:30-13:00": "12:30-13:00",
            "13:00-13:30": "13:00-13:30",
            "13:30-14:00": "13:30-14:00",
            "14:00-14:30": "14:00-14:30",
            "14:30-15:00": "14:30-15:00",
            "15:00-15:30": "15:00-15:30",
            "15:30-16:00": "15:30-16:00",
            "16:00-16:30": "16:00-16:30",
            "16:30-17:00": "16:30-17:00",
            "17:00-17:30": "17:00-17:30",
            "17:30-18:00": "17:30-18:00",
            "18:00-18:30": "18:00-18:30",
            "18:30-19:00": "18:30-19:00",
            "19:00-19:30": "19:00-19:30",
            "19:30-20:00": "19:30-20:00",
            "20:00-20:30": "20:00-20:30",
            "20:30-21:00": "20:30-21:00",
            "21:00-21:30": "21:00-21:30",
            "21:30-22:00": "21:30-22:00",
            "option_order_timeWake_empty": "пропущено",            
          };

          itemSession.step++;
          itemSession.timeWake = timeWake[command];
          this._writeToFile(dataSession, itemSession);
          option = this._getOptionStep(itemSession.step);
          message = this._getTitleStep(itemSession.step);
          this.bot.editMessageText(`Вы выбрали ${itemSession.timeWake}`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });
          return { step: 0, message: message, option: option, status: true };
          break;

        case "option_data_dateLeft_empty":
          // это связано с тем что бы кнопка срабатывала только если относится к шагу, иначе значение записшется в другое поле
          if (itemSession.step != 3) {
            return { step: 3, message: "кнопка не активна", option: {}, status: false };
          }
          itemSession.step++;
          itemSession.dateLeft = "неизвестна";
          this._writeToFile(dataSession, itemSession);
          option = this._getOptionStep(itemSession.step);
          message = this._getTitleStep(itemSession.step);
          this.bot.editMessageText(`Дата смерти неизвестна`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });
          return { step: 0, message: message, option: option, status: true };
          break;

          case  "option_order_others_empty":          
          itemSession.step = 9;
          itemSession.timeWake = "пропущено";
          itemSession.city = "Москва";
          itemSession.comment = itemSession.comment + " комментариев нет ";
          message = this._getTitleStep(itemSession.step);
          option = this._getOptionStep(itemSession.step);
          this._writeToFile(dataSession, itemSession);
          this.bot.editMessageText(`Вы пропустили остальные поля`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });
          this.endSession(this.FileName, chatId, "order");
          return { step: 0, message: message, option: option, status: true };
          break;

        case "option_data_dateWake_empty":
          // это связано с тем что бы кнопка срабатывала только если относится к шагу, иначе значение записшется в другое поле
          if (itemSession.step != 4) {
            return { step: 4, message: "кнопка не активна", option: {}, status: false };
          }
          itemSession.step++;
          itemSession.dateWake = " неизвестна";
          this._writeToFile(dataSession, itemSession);
          option = this._getOptionStep(itemSession.step);
          message = this._getTitleStep(itemSession.step);
          this.bot.editMessageText(`Дата прощания неизвестна`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });
          return { step: 0, message: message, option: option, status: true };
          break;

        // это связано с тем что бы кнопка срабатывала только если относится к шагу, иначе значение записшется в другое поле
        case "button_order_place_wake_empty":
          if (itemSession.step != 7) {
            return { step: 7, message: "кнопка не активна", option: {}, status: false };
          }
          itemSession.step++;
          itemSession.comment = itemSession.comment + "место прощания неизвестно";
          this._writeToFile(dataSession, itemSession);
          option = this._getOptionStep(itemSession.step);
          message = this._getTitleStep(itemSession.step);
          this.bot.editMessageText(` место прощания пропущено`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });
          return { step: 0, message: message, option: option, status: true };
          break;

          // пропустить ФИО
          case "button_order_fio_empty":

          
          if(itemSession.step != 2) {
            return { step: 2, message: "кнопка не активна", option: {}, status: false };
          }

          itemSession.step++;
          itemSession.fio = " ФИО усопшего пропущено";
          this._writeToFile(dataSession, itemSession);
          option = this._getOptionStep(itemSession.step);
          message = this._getTitleStep(itemSession.step);
          this.bot.editMessageText(` ФИО усопшего пропущено`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });
          return { step: 0, message: message, option: option, status: true };
          break;
        

        case "button_order_comment_empty":
          itemSession.step++;
          itemSession.comment = itemSession.comment + " комментарий пропущен";
          this._writeToFile(dataSession, itemSession);
          option = this._getOptionStep(itemSession.step);
          message = this._getTitleStep(itemSession.step);

          this.bot.editMessageText(`Комментариев нет`, {
            chat_id: itemSession.tlgId,
            message_id: messageId,
          });

          // завершение сесии
          this.endSession(this.FileName, chatId, "order");
          return { step: 0, message: message, option: option, status: true };

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
        status: false,
      };
    }
  }
}

module.exports = SessionOrder;
