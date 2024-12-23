//@ts-check

const copirite_text = require("../const/copirite_admin");

const TELEGRAMM_ADMIN_CHAT = process.env.TELEGRAMM_ADMIN_CHAT;
class AipUse {
  constructor(api) {
    this.api = api;
  }

  async updateUser(postData) {
    let res = await this.api.updateUser(postData);
    if (!res) {
      return;
    }
    if (res.result.code === 200) {
      const { result } = res;
      const { message } = result;
      return message;
    } else if (res.result.code === 403) {
      const { tlgId } = postData;
      this.api.requestMessageOnApi(
        tlgId,
        `Данный номер телефона не зарегистрирован, пожалуйста обратитесь к администратору ${copirite_text.admin}`
      );
      return false;
    } else {
      const { tlgId } = postData;
      this.api.requestMessageOnApi(
        tlgId,
        `Регистрация не удалась, обратитесь к администратору ${copirite_text.admin}`
      );
      return false;
    }
  }

  /**
   *
   * @param {{action: string, tlgId: string}} postData
   * @returns {Promise< {rowNumber: number, spzId: number, number: number, name: string, tlgId: number, tlgName: string, status: string, role: string, sponsor: string, sponsorName: string} | string | boolean >}
   */

  async checkUser(postData) {
    try {
      /**
       * 

@type {{ result: {
    type: string,
    code: number,
    message: {
      rowNumber: number,
      spzId: number,
      number: number,       
      name: string,
      tlgId: number,
      tlgName: string,    
      status: string,
      role: string,
      sponsor: string,
      sponsorName: string
    } | string
  }}}
       */

      let res = await this.api.checkUser(postData);

      if (!res) {
        return false;
      }
      if (res.result.code === 200) {
        const { result } = res;
        const { message } = result;
        return message;
      } else if (res.result.code === 403) {
        const { tlgId } = postData;

        this.api.requestMessageOnApi(
          tlgId,
          `${res.result.message}, для регистрации нажмите: /registration`
        );
        return false;
      } else {
        const { tlgId } = postData;
        this.api.requestMessageOnApi(
          tlgId,
          "Произошла ошибка, обратитесь к администратору 89165692673 или @Andre_roz"
        );
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async postOrder(postData) {
    let res = await this.api.postOrder(postData);
    if (!res) {
      return;
    }

    if (res.result.code === 200) {
      const { result } = res;
      const { message } = result;
      return message;
    } else if (res.result.code === 403) {
      const { tlgId } = postData;
      this.api.requestMessageOnApi(tlgId, res.result.message);
      return false;
    } else {
      const { tlgId } = postData;
      this.api.requestMessageOnApi(
        tlgId,
        `Произошла ошибка, обратитесь к администратору ${copirite_text.admin}`
      );

      this.api.requestMessageOnApi(
        TELEGRAMM_ADMIN_CHAT,
        `Записать в Google Sheets не удалось, возможно гугл таблицы не отвечают, вот информация ${JSON.stringify(
          postData
        )} `
      );
      return false;
    }
  }
}

module.exports = AipUse;
