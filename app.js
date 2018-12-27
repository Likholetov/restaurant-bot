const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const geolib = require('geolib')

const config = require('./config')

//controllers
const mealController = require('./controllers/mealController')
const orderController = require('./controllers/orderController')


//подключаем базу данных
mongoose.connect(config.DB_URL, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

//создаем объект бот
const bot = new TelegramBot(config.TOKEN, {
    polling: true
})

//обработка команды /start
bot.onText(/\/start/, async msg => {
    const text = `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы:`
    //let keyboard = await mealController.inlineMealTypesKeyboard()

    //bot.sendMessage(msg.chat.id, text, keyboard)

    bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
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
    })    
})

//обработка инлайн клавиатуры
bot.on('callback_query', async query => {
    const userId = query.from.id
    let data

    try {
        console.log(query.data)
        data = JSON.parse(query.data)
    } catch (e) {
        throw new Error('Data is not an object')
    }

    switch(data.query){
        case "menu":
            let keyboard = await mealController.inlineMealTypesKeyboard()
            bot.sendMessage(userId, "Меню ресторана:", keyboard)
            break
    }
})