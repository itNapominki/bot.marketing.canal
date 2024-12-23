// const Session = require("./session");

// class SessionAgentToManager extends Session {
//     constructor(bot){
//         super(bot)
//     this.FileName = "agentToManager.json";
//     this.message = [];
//     this.file = this.getfileJsonFormessage(this.FileName);
//     this.step = 0;
//     this.msg = msg;
//     this.tlgId = `${this.msg.from.id}`;
//     this.tlgName = this.msg.from.username;
//     }

//     _writeToFile(data, session) {
//         // собираем данные другие сесии + новая и записываем обновленный файл
//         data.push(session);
//         return this.writeTofilesession(this.FileName, data);
//       }   
    
    
//       _getTitleStep(step) {
//         return SESSION_RESPONSE.CHAT_AGENT_MANAGER[step].title;
//       }   

//     createSession() {
//         if (this.file.length < 1) {
//           // [] это для первого значения, если сессий нет
//           // собираем сессию
//           const session = {
//             tlgIdManager: "",            
//             tlgId: this.tlgId,
//             step: this.step,
            
//           };
//           this._writeToFile([], session);
//           let message = this._getTitleStep(this.step);
//           return { step: this.step, message: message, option: {}, status: true };
//         }
    
//         // если сесии какие то есть то ищем у текущего пользователя
//         const itemSession = this.file.find((item) => item.tlgId == this.tlgId);
//         // сессию нашли для текущего tlgId получаем  ее и начинаем работать с ней
//         if (itemSession) {
//           let message = this._getTitleStep(itemSession.step);
//           return {
//             step: itemSession.step,
//             message: message,
//             option: {},
//             status: true,
//           };
//         } else {
//           // собираем новую сессию для пользователя если ранее у нт сесии
//           const session = {
//             tlgIdManager: "",            
//             tlgId: this.tlgId,
//             step: this.step
            
//           };
//           this._writeToFile(this.file, session);
//           let message = this._getTitleStep(this.step);
//           return { step: this.step, message: message, option: {}, status: true };
//         }
//       }



// }