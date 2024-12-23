const {buildCallbackData} = require("./option_btn_approve");


test("Проверка формирования кнопки сошласования заявки", ()=> {
    expect(buildCallbackData({message_id: 14181, order_number: "33509", value: "false"})).toBe("option_btn_approve?opa1=false,opa2=14181,opa3=33509");
    expect(buildCallbackData({message_id: 14181, order_number: "33509", value: "true"})).toBe("option_btn_approve?opa1=true,opa2=14181,opa3=33509");
})