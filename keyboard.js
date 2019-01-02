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
                    text: 'интерьер',
                    callback_data: JSON.stringify({
                        query: 'interier'
                    })
                }
            ]
        ]
    }
}