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
                    text: 'бронь столиков',
                    callback_data: JSON.stringify({
                        query: 'table'
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
    },

    // Клавиатура для брони столиков
    tableKeyboard:{
        inline_keyboard: [
            [
                {
                    text: 'завтра',
                    callback_data: JSON.stringify({
                        query: 'tableTomorrow'
                    })
                }
            ],
            [
                {
                    text: 'послезавтра',
                    callback_data: JSON.stringify({
                        query: 'tableAfterTomorrow'
                    })
                }
            ]
        ]
    },

    // Клавиатура для выбора времени
    timeKeyboard:{
        inline_keyboard: [
            [
                {
                    text: '10:00',
                    callback_data: JSON.stringify({
                        query: '10'
                    })
                }
            ],
            [
                {
                    text: '12:00',
                    callback_data: JSON.stringify({
                        query: '12'
                    })
                }
            ],
            [
                {
                    text: '14:00',
                    callback_data: JSON.stringify({
                        query: '14'
                    })
                }
            ],
            [
                {
                    text: '16:00',
                    callback_data: JSON.stringify({
                        query: '16'
                    })
                }
            ]
        ]
    },

    // Клавиатура для отмены брони
    tableDeleteKeyboard:{
        inline_keyboard: [
            [
                {
                    text: 'Отменить бронь',
                    callback_data: JSON.stringify({
                        query: 'deleteTable'
                    })
                }
            ]
        ]
    }
}