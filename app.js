const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')
const geolib = require('geolib')

const config = require('./config')

// controllers
const mealController = require('./controllers/mealController')
const orderController = require('./controllers/orderController')

// подключаем базу данных
mongoose.connect(config.DB_URL, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

// создаем объект бот
const bot = new TelegramBot(config.TOKEN, {
    polling: true
})

// обработка команды /start
bot.onText(/\/start/, async msg => {
    const text = `Здравствуйте, ${msg.from.first_name}\nВыберите команду для начала работы:`

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

// обработка инлайн клавиатуры
bot.on('callback_query', async query => {
    const chatId = query.from.id
    const messageId = query.message.message_id
    let data

    try {
        data = JSON.parse(query.data)
    } catch (e) {
        throw new Error('Data is not an object')
    }

    switch(data.query){
        case "menu":
            let keyboard = await mealController.inlineMealTypesKeyboard()
            bot.editMessageText('Наше меню:', {chat_id:chatId, message_id:messageId, reply_markup:keyboard})
            break
        case "more":
            const meal = await mealController.findMealByUuid(data.mealUuid)
            const orderKeyboard = {
                inline_keyboard: [
                    [
                        {
                            text: 'Заказать',
                            callback_data: JSON.stringify({
                                query: 'order',
                                mealUuid: meal.uuid
                            })
                        }
                    ]
                ]
            }
            bot.editMessageCaption(`${meal.name}\nЦена: ${meal.price} руб.\nИнгридиенты: ${meal.ingredients.join(', ')}\nВес: ${meal.weight} г.`, {chat_id:chatId, message_id:messageId, reply_markup:orderKeyboard})
            break
        case "order":
            result = await orderController.addMeal(chatId, query.id, data.mealUuid)
            bot.answerCallbackQuery(result)
            console.log(result)
            break
        default:
            const meals = await mealController.findMealsByTypeQuery(data.query)
            meals.map(m => {
                const text = `${m.name}\nЦена: ${m.price} руб.` 
                bot.sendPhoto(chatId, m.img, {
                    caption: text,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: 'Подробнее',
                                    callback_data: JSON.stringify({
                                        query: 'more',
                                        mealUuid: m.uuid
                                    })
                                }
                            ],
                            [
                                {
                                    text: 'Заказать',
                                    callback_data: JSON.stringify({
                                        query: 'order',
                                        mealUuid: m.uuid
                                    })
                                }
                            ]
                        ]
                    }
                })
            })
            break
    }
})