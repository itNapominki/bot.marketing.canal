// @ts-check

const Command = require("./command.class");
const ApiWeb = require("../utils/api/apiWeb");

class PhotoCommand extends Command {
  constructor(bot) {
    super(bot);
  }

  handle() {
    this.bot.on("photo", async (msg) => {
      console.log(msg);
      const tlgId = msg.chat.id;
      const photo = msg.photo;
      if (photo) {
        const largestPhoto = photo[photo.length - 1];
        const fileId = largestPhoto.file_id;
        const customersId = msg.from.id;
        const caption = msg.caption ? msg.caption : false;
        new ApiWeb(this.bot).botFile(tlgId, customersId, fileId, caption);
      }
      return;
    });
  }
}

module.exports = PhotoCommand;


// {
//   message_id: 63, 
//   from: {
//     id: 931824462,
//     is_bot: false,
//     first_name: 'Михаил',
//     username: 'MihailDiper',
//     language_code: 'ru'
//   },
//   chat: {
//     id: -1002377541646,
//     title: 'DEBUGGING_SPZ_REVIEW',
//     type: 'supergroup'
//   },
//   date: 1730875159,
//   photo: [
//     {
//     id: -1002377541646,
//     title: 'DEBUGGING_SPZ_REVIEW',
//     type: 'supergroup'
//   },
//   date: 1730875159,
//   photo: [
//     {
//     title: 'DEBUGGING_SPZ_REVIEW',
//     type: 'supergroup'
//   },
//   date: 1730875159,
//   photo: [
//     {
//     type: 'supergroup'
//   },
//   date: 1730875159,
//   photo: [
//     {
//   },
//   date: 1730875159,
//   photo: [
//     {
//   date: 1730875159,
//   photo: [
//     {
//       file_id: 'AgACAgIAAyEFAASNtmgOAAM_ZysPF8JeiUWvRKSg0jln6ZxALjAAAoDnMRuhTlhJ2b63RzLBXjEBAAMCAANzAAM2BA',
//   photo: [
//     {
//       file_id: 'AgACAgIAAyEFAASNtmgOAAM_ZysPF8JeiUWvRKSg0jln6ZxALjAAAoDnMRuhTlhJ2b63RzLBXjEBAAMCAANzAAM2BA',
//       file_unique_id: 'AQADgOcxG6FOWEl4',
//       file_size: 1213,
//       file_id: 'AgACAgIAAyEFAASNtmgOAAM_ZysPF8JeiUWvRKSg0jln6ZxALjAAAoDnMRuhTlhJ2b63RzLBXjEBAAMCAANzAAM2BA',
//       file_unique_id: 'AQADgOcxG6FOWEl4',
//       file_size: 1213,
//       width: 90,
//       file_unique_id: 'AQADgOcxG6FOWEl4',
//       file_size: 1213,
//       width: 90,
//       width: 90,
//       height: 90
//       height: 90
//     },
//     {
//       file_id: 'AgACAgIAAyEFAASNtmgOAAM_ZysPF8JeiUWvRKSg0jln6ZxALjAAAoDnMRuhTlhJ2b63RzLBXjEBAAMCAANtAAM2BA',
//       file_unique_id: 'AQADgOcxG6FOWEly',
//       file_size: 3057,
//       width: 120,
//       height: 120
//     }
//   ],
//   caption: 'nrnrnrn'
// }