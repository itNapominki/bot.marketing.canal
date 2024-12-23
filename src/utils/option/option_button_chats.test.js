const optionButtonChats = require("./option_button_chats");

it('Проверка формирования кнопок, требования что бы был имя и телефон на кнопке, сработка по номеру из операционки', () => {
    // Arrange
    const data = [
      { lid: 'lid1', customer_phone: 'phone1', order_number: 'order1' },
      { lid: 'lid2', customer_phone: 'phone2', order_number: 'order2' },
    ];

    // Act
    const result = optionButtonChats(data);

    // Assert
    expect(result).toEqual({
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'lid1 phone1', callback_data: 'order1' },
          ],
          [
            { text: 'lid2 phone2', callback_data: 'order2' },
          ],
        ],
      },
    });
  });