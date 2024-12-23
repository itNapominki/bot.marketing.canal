function optionToChat(order_number, customer_phone, lid) {

  return {
      reply_markup: {
        inline_keyboard: [[{ text: `${lid} ${customer_phone}` , callback_data: order_number }]],
      },
    };
  }
  
  module.exports = optionToChat;