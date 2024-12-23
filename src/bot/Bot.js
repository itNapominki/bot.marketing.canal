// @ts-check

const TelegramBot = require("node-telegram-bot-api");
const responseTemplate = require("../commands/responseTemplate/responseTemplate");
const AipUse = require("../utils/api/apiUse");
const Api = require("../utils/api/api");
const SessionRegistration = require("../session/session.registration");
const cacheService = require("../cache/CacheService");
const express = require("express");
const ApiWeb = require("../utils/api/apiWeb");
const port = process.env.EXPRESS_PORT || 8000;

class Bot {
  /**
   * @param {string} token
   */
  constructor(token) {
    this.bot = new TelegramBot(token, { polling: true }); 
  }  

  start() {
    try {
      this.bot.onText(/\/start/, async (msg) => {
        // this.bot.setMyCommands([
        //   { command: "/start", description: "Начальное приветствие" },
        //   { command: "/help", description: "Получить справку" },
        //   { command: "/order", description: "Оформить заявку" },
        //   {
        //     command: "/clear",
        //     description: "Отменить заполнение заявки/выйти из чатов",
        //   },
        //   { command: "/chats", description: "Мои чаты" },
        //   // { command: "/logoutchat", description: "Выйти из чатов" },
        //   { command: "/myid", description: "Запросить мой id" },
        // ]);
        // const chatId = msg.chat.id;
        console.log(msg);

        console.log(' console.log(msg);');

        this.bot.sendMessage(msg.message_id, `Ваш ид: ${msg.message_id}`);

       // new ApiWeb(this.bot).botCommandStart(chatId);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = Bot;
