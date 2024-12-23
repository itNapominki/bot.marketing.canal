//@ts-check

/**
 * @typedef ArrayData
 * @type {object}
 * @property {string} lid
 * @property {string} customer_phone
 * @property {string} order_number
 */


/**
 * @typedef PropertiesData
 * @type {Array<ArrayData>}
 * 
 */

/** 
 * @param {PropertiesData} data 
 * @returns  
 */

function optionButtonChats(data) {
  
  const buttons = [];
  const chunkSize = 1;

  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const formattedChunk = chunk.map((item) => {
      return { text: `${item.lid} ${item.customer_phone}`, callback_data: item.order_number };
    });
    buttons.push(formattedChunk);
  }  

  return {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };
}

module.exports = optionButtonChats;
