//@ts-check

/** Данное преобразование требуется из за того то в 
 * параметр кнопки нельзя записать длинный текст и пришлось 
 * сокращать таким образом  
 * на вход data: 'option_btn_approve?opa1=false,opa2=14203,opa3=33509' на выход 
 * на выход { approve: false, message_id: '14232', order_number: '33509' } 
*/

const query_btn = require("../const/query_btn");

/**
 * @typedef PropertiesQuery
 * @type {object}
 * @property {string} data - колбэк значения кнопки. 
 */

/** 
 * @param {PropertiesQuery} queru 
 * @returns  {{ approve: boolean, message_id: string, order_number: string}} 
 */
 
function parsQueryButton (queru) {    

const buttonValue = queru?.data;
// Получаем все после знака "?"
const afterQuestionMark = buttonValue.split("?")[1];

// Преобразуем оставшуюся часть в JSON объект
const keyValuePairs = afterQuestionMark.split(",");
const params = {};
keyValuePairs.forEach(pair => {
    const [key, value] = pair.split("=");
    params[key.trim()] = value.trim();
});

// собираем исходный объект

const newObject = {approve: false, message_id: '', order_number: ''};
Object.keys(query_btn).forEach(key => {
    if (key === "approve") {
        newObject[key] = params[query_btn[key]] === "true";
    } else {
        newObject[key] = params[query_btn[key]];
    }
});

 return newObject;

}

module.exports = parsQueryButton;