// @ts-check

const DataBase = require("../dataBase/dataBase");


/**
 * @typedef GetChatsInfo
 * @type {object}
 * @property {number} id
 * @property {string} order_number
 * @property {string} manager_id
 * @property {number} manager_id_in_chat
 * @property {string} agent_id
 * @property {number} agent_id_in_chat
 * @property {string} curator_id
 * @property {number} curator_in_chat
 * @property {string} msg_text
 * @property {number} msg_id
 * @property {Date} date
 * @property {string} customer_phone
 * @property {string} lid
 */

/**
 * @param {string} order
 * @returns {Promise<[[GetChatsInfo],[]] | undefined>}
 */

async function getOrderForNumber(order = "ошибка") {
  //1 проверяем нет ли в базе данных номера с такой заявкой
  const sql = "SELECT * FROM chats WHERE order_number = ?";
  const res = await new DataBase().query(sql, [order]);
  //@ts-ignore
  return res;
}

// создаме чат
/**
 * @param {string} orderNumber
 * @param {string} managerId
 * @param {string} agentId
 * @param {string} agentId
 * @param {string} customer
 * @param {string} lid
 * @returns {Promise<[[GetChatsInfo],[]] | undefined>}
 */
async function createChat(
  orderNumber = "ошибка",
  managerId = "ошибка",
  agentId = "ошибка",
  customer = "ошибка",
  lid = "ошибка"
) {
  try {
    // возвращает : id в базе данных и номер заказа из операционки
    // если такого канала нет создает новый
    const sql =
      "INSERT INTO `chats`(`order_number`, `manager_id`, `agent_id`, `customer_phone`, `lid`) VALUES (?, ?, ?, ?, ?)";
    const values = [orderNumber, managerId, agentId, customer, lid];
    const result = await new DataBase().query(sql, values);
    const selectSql = "SELECT * FROM chats WHERE id = ?";
    //@ts-ignore
    const res = await new DataBase().query(selectSql, [result[0].insertId]);
    //@ts-ignore
    return res;
  } catch (e) {
    console.error("Ошибка при создании чата", e);
  }
}

// показать мои чаты

/**
 * @typedef GetMyChatsInfo
 * @type {object}
 * @property {number} id
 * @property {string} order_number
 * @property {number} manager_id_in_chat
 * @property {string} agent_id
 * @property {number} agent_id_in_chat
 * @property {string} curator_id
 * @property {number} curator_in_chat
 * @property {string} msg_text
 * @property {number} msg_id
 * @property {Date} date
 * @property {string} customer_phone
 * @property {string} lid
 */

/**
 * @param {number} chatId
 * @returns {Promise<[[GetMyChatsInfo],[]] | undefined>}
 */
async function getMyChats(chatId) {  
  try {
    //1 проверяем нет ли в базе данных номера с такой заявкой
    const sql =
      "SELECT * FROM `chats` WHERE `manager_id` = ? OR `agent_id` = ? ORDER BY id DESC LIMIT 4";
    // const sql =
    // "SELECT * FROM `chats` WHERE `manager_id` = ? OR `agent_id` = ?";
    const res = await new DataBase().query(sql, [`${chatId}`, `${chatId}`]);
    //@ts-ignore
    return res;

    // принимает id и смотрит в каких чатах
    // возвращает id частов и номер от заказа
  } catch (e) {
    console.error("Ошибка при получении списка моих чатов", e);
  }
}

// получить все чаты, для формирования команд кнопок
/**
 * @returns {Promise<[[{order_number: string, lid: string, customer_phone: string }], []] | undefined>}
 */
async function getAllChats() {
  try {
    const sql = "SELECT `order_number`, `lid`, `customer_phone`  FROM `chats`";
    const res = await new DataBase().query(sql, []);

    //@ts-ignore
    return res;
    // возвращет все номера заказов
  } catch (e) {
    console.error("Ошибка при получении списка моих чатов", e);
    return undefined;
  }
}

// вход в чат по КНОПКЕ под сообщением
async function toChat(order = "ошибка", role = "ошибка") {
  try {
    const sql = `UPDATE chats SET ${role}_in_chat = true WHERE order_number = ?;`;
    const res = await new DataBase().query(sql, [order]);

    return res;
    // принимает номер чата и номер ид пользователя и меняет на true
    // возвращает сообшения из чата, думаю все
  } catch (e) {
    console.error("Ошибка при получении списка моих чатов", e);
  }
}

// проверка в чате ли агент или менеджер (любой пользователь)
/** *
 * @param {string} role
 * @param {number} tlgChatId
 * @returns {Promise<[[{order_number: string }], []] | undefined>}
 */
async function checkInChat(role, tlgChatId) {
  try {
    const sql = `SELECT order_number FROM chats WHERE ${role} = ? AND ${role}_in_chat = ?;`;
    //@ts-ignore
    const res = await new DataBase().query(sql, [`${tlgChatId}`, true]);
    
  //@ts-ignore
    return res;
    // ищет по id в колонках у менеджера и агента или куратора находится ли он в чате
    // возвращает: id чата или false
  } catch (e) {
    console.error("Ошибка проверка в чате ли пользователь", e);
    return undefined;
  }
}

// положить сообщение, думаю просто в массив добавить json не важно от кого не привязывая к id, все равно я имя не смогу подгружить из google sheets
async function writeToChat(chatNumber, msg) {
  try {
    // проверяем есть ли вообще ключ согласования (показа сообщения, для сообщение от агента по умолчанию true) в msg
    if (!("approve" in msg)) {
      console.log('Ключ "approve" присутствует в объекте.');
      return;
    }

    // очищаем сам текст от ковычек что бы json не ломать
    msg.text = msg.text.replace(/["']/g, "");
    // console.log("Запись в чат", chatNumber);
    // преобразовываем "" в '' иначе не записывается значение
    const changeQuote = JSON.stringify(msg).replace(/"/g, "'");
    const sql = `UPDATE chats SET msg_text = JSON_ARRAY_APPEND(msg_text, '$', "${changeQuote}") WHERE order_number = ?;`;
    const res = await new DataBase().query(sql, [chatNumber]);
    return res;

    //Возвращает: скорее всего ничего, так как и так вижно в самой переписке
  } catch (e) {
    console.error("Ошибка при редактировании чата", e);
  }
}

// выход из чата по кнопке + при любой команде?
/**
 *
 * @param {string} idUSer
 * @param {string} role
 */
async function logoutChat(idUSer, role = "ошибка") {
  try {
    const sql = `UPDATE chats SET ${role}_in_chat = false WHERE ${role} = ?;`;
    const res = await new DataBase().query(sql, [idUSer]);
    //return res;
    // принимает ид польтзователя ищет во всех полях - куратор - менеджер - агент
    // возвращает сообшения из чата, думаю все
  } catch (e) {
    console.error("Ошибка при получении списка моих чатов", e);
    //return undefined
  }
}

module.exports = {
  createChat,
  getOrderForNumber,
  getMyChats,
  getAllChats,
  toChat,
  checkInChat,
  writeToChat,
  logoutChat,
};
