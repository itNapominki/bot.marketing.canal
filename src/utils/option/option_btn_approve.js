//@ts-check

const query_btn = require("../const/query_btn");

/** *
 * @param {{ message_id: number, order_number: string, value: string }} param
 * @returns
 */
function buildCallbackData({ message_id, order_number, value }) {
  return `option_btn_approve?${query_btn.approve}=${value},${query_btn.message_id}=${message_id},${query_btn.order_number}=${order_number}`;
}

/** *
 * @param {{ message_id: number, order_number: string }} param
 * @returns
 */
function optionBtnApprove({ message_id, order_number }) {
  
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Согласовано",
            callback_data: buildCallbackData({
              message_id,
              order_number,
              value: "true",
            }),
          },
          {
            text: "Не согласовано",
            callback_data: buildCallbackData({
              message_id,
              order_number,
              value: "false",
            }),
          },
        ],
      ],
    },
  };
}

module.exports = { optionBtnApprove, buildCallbackData };
