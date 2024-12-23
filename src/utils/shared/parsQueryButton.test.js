const parsQueryButton = require("./parsQueryButton");

test("Проверка формирования кнопки согласования заявки", () => {
  expect(
    parsQueryButton({
      data: "option_btn_approve?opa1=false,opa2=14203,opa3=33509",
    })
  ).toEqual({ approve: false, message_id: "14203", order_number: "33509" });

  expect(
    parsQueryButton({
      data: "option_btn_approve?opa1=true,opa2=14203,opa3=33509",
    })
  ).toEqual({ approve: true, message_id: "14203", order_number: "33509" });
});

