module.exports = {
    
    // Клавиатура для главного меню
    mainKeyboard: {
        inline_keyboard: [
            [
                {
                    text: 'меню',
                    callback_data: JSON.stringify({
                        query: 'menu'
                    })
                }
            ],
            [
                {
                    text: 'ваш заказ',
                    callback_data: JSON.stringify({
                        query: 'yourOrder'
                    })
                }
            ],
            [
                {
                    text: 'интерьер',
                    callback_data: JSON.stringify({
                        query: 'interier'
                    })
                }
            ],
            [
                {
                    text: 'контакты',
                    callback_data: JSON.stringify({
                        query: 'contacts'
                    })
                }
            ]
        ]
    },

    // Клавиатура для заказа
    orderKeyboard:{
        inline_keyboard: [
            [
                {
                    text: 'подтвердить',
                    callback_data: JSON.stringify({
                        query: 'applyOrder'
                    })
                }
            ],
            [
                {
                    text: 'изменить',
                    callback_data: JSON.stringify({
                        query: 'displayOrder'
                    })
                }
            ]
        ]
    }
}