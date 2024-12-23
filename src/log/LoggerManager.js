const fs = require('fs');

class LoggerManager {
  constructor() {
    this.logFileName = "log.json";
    this.log = [];
  }

  logMessage(type = "error", message = "короткое название события", stack = "отсутствует" ) {
    if (!fs.existsSync(this.logFileName)) {
      fs.writeFileSync(this.logFileName, '[]', 'utf8');
    }

    const fileContent = fs.readFileSync(this.logFileName, 'utf8');
    this.log = JSON.parse(fileContent);

    if (this.log.length >= 200) {  // пример 200
      this.log = this.log.slice(this.log.length - 199); // то срезать до 199
    }

    this.log.push({
      timestamp: new Date().toISOString(),
      type: type,
      message: message,
      stack: JSON.stringify(stack, null, 2)
    });

    fs.writeFileSync(this.logFileName, JSON.stringify(this.log, null, 2), 'utf8');
  }
}

module.exports = LoggerManager;