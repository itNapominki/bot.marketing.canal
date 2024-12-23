const options_role = {
    reply_markup: {
      inline_keyboard: [          
        [
          // { text: "Сотрудник СПЗ", callback_data: "button_reg_employee" }, 
        { text: "Агент", callback_data: "button_reg_agent" }],
      ],
    },
  };

  module.exports = options_role;