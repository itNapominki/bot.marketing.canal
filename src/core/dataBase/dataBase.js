const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
dotenv.config();

class DataBase {
  constructor() {    
  }

  async _connect() {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,      
    });
    
    return connection;
  }

  async initial() {
    try {
      await this._connect(); 
      console.log("Подключился к базе без ошибок!");
    } catch (err) {
      console.log(err);
    }
  }

  /** * 
   * @param {string} sql 
   * @param {any[]} values
   * @returns 
   */

  async query(sql, values) {
    try {
      
      const connection = await this._connect(); 
      const result = await connection.execute(sql, values);     
      await connection.end();
      console.log("Запрос к базе данных!");      
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = DataBase;

// CREATE TABLE `chats` (
//   `id` int(11) NOT NULL,
//   `order_number` varchar(255) NOT NULL,
//   `manager_id` varchar(255) NOT NULL,
//   `manager_id_in_chat` tinyint(1) NOT NULL,
//   `agent_id` varchar(255) NOT NULL,
//   `agent_id_in_chat` tinyint(1) NOT NULL,
//   `curator_id` varchar(255) NOT NULL,
//   `curator_in_chat` tinyint(1) NOT NULL,
//   `msg_text` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
//   `msg_id` int(11) NOT NULL,
//   `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
//   `customer_phone` varchar(255) NOT NULL DEFAULT 'ошибка'
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
