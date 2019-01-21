const TelegramBot = require('node-telegram-bot-api')
const mongoose = require('mongoose')

const config = require('./config')
const keyboard = require('./keyboard')

// controllers
const mealController = require('./controllers/mealController')
const orderController = require('./controllers/orderController')
const tableController = require('./controllers/tableController')

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

// текст для главного меню
const mainText = "Добро пожаловать в ресторан 'Маленькая Италия'"

// обработка команды /start
bot.onText(/\/start/, async msg => {
    bot.sendMessage(msg.chat.id, mainText, {
        reply_markup: keyboard.mainKeyboard
    })    
})


bot.on('message', async msg => {
    console.log('Working', msg.from.first_name)

    const chatId = msg.chat.id

    if(msg.location){
        const text = await orderController.applyOrder(chatId, msg.location)
        bot.sendMessage(chatId, text, {reply_markup: {
            resize_keyboard: true,
            keyboard: [
                [
                    "/start"
                ]
            ],
        }})
    }

})


// обработка инлайн клавиатуры
bot.on('callback_query', async query => {
    const chatId = query.from.id
    const messageId = query.message.message_id
    let data, result, message

    const today = new Date()
    today.setHours(-21,0,0)
    const tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000))
    const tomorrowPlusOne = new Date(today.getTime() + 2*(24 * 60 * 60 * 1000))

    const monthArr=[
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'ноября',
        'декабря',
     ]

    try {
        data = JSON.parse(query.data)
    } catch (e) {
        throw new Error('Data is not an object')
    }

    switch(data.query){
        case "menu":
            const keyboardMenu = await mealController.inlineMealTypesKeyboard()
            bot.editMessageText('Наше меню:', {chat_id:chatId, message_id:messageId, reply_markup:keyboardMenu})
            break
        case "yourOrder":
            const order = await orderController.findOrderById(chatId)
            if(order){
                if (order.meals.length > 0) {
                    let sum = 0
                    order.meals.map(m => {
                        sum = sum + m.price
                    })
                    bot.sendMessage(chatId, `Общая стоимость вашего заказа\nсоставляет: ${sum} руб.`, {reply_markup:keyboard.orderKeyboard})
                } else {
                    bot.sendMessage(chatId, "Вы еще ничего не заказали")
                }
            } else {
                bot.sendMessage(chatId, "Вы еще ничего не заказали")
            }
            break
        case "applyOrder":
            bot.sendMessage(chatId, "Для подтверждения заказа укажите Ваше местоположение", {reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: true,
                keyboard: [
                    [
                        {
                            text: 'Отправить местоположение',
                            request_location: true
                        }
                    ]
                ],
            }})
            break
        case "displayOrder":
            const displayOrder = await orderController.findOrderById(chatId)
            
            bot.sendMessage(chatId, "Ваш заказ:")
            displayOrder.meals.map(m => {
                bot.sendMessage(chatId, m.name + " - " + m.price + " руб.", {reply_markup:{
                    inline_keyboard: [
                        [
                            {
                                text: 'Удалить',
                                callback_data: JSON.stringify({
                                    query: 'remove',
                                    mealUuid: m.uuid
                                })
                            }
                        ]
                    ]
                }})
            })

            break
        case "remove":
            orderController.removeMeal(chatId, data.mealUuid)
            bot.deleteMessage(chatId, messageId)
            break
        case "interier":
            const images = ["https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_1.jpg", 
                            "https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_2.jpg", 
                            "https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_5.jpg", 
                            "https://reston.com.ua/images/img/obzor_spezzo_svyatoshino_4.jpg"]

            images.map(i => {
                bot.sendPhoto(chatId, i)
            })
            break
        case "contacts":
            bot.sendMessage(chatId, `Ресторан "Маленькая Италия"\nтелефон:\n+44 20 7499 4510\nоткрыт с 10:00 до 20:00`)
            bot.sendLocation(chatId, 48.00621141, 37.79709935)
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
            break
        case "back":
            bot.editMessageText(mainText, {chat_id:chatId, message_id:messageId, reply_markup:keyboard.mainKeyboard})
            break
        case "table":
            bot.sendMessage(chatId, "Желаете забронировать столик?", {reply_markup:keyboard.tableKeyboard})
            break
        case "deleteTable":
            tableController.tableDelete(chatId)
            bot.editMessageText("Бронь отменена.", {chat_id:chatId, message_id:messageId})
            break
        default:
            if (data.query == "tableTomorrow" || "tableAfterTomorrow"){
                if (data.query == "tableTomorrow"){
                    result = await tableController.tableSetDate(chatId, tomorrow)
                } else {
                    result = await tableController.tableSetDate(chatId, tomorrowPlusOne)
                }

                if(result == 1){
                    message = "Дата заказа установлена. Выберите время."
                    bot.editMessageText(message, {chat_id:chatId, message_id:messageId, reply_markup:keyboard.timeKeyboard})
                } else {
                    yourTable = await tableController.findTableById(chatId)
                    message = `Вы уже заказали столик.\n${yourTable.date.getDate()+1} ${monthArr[yourTable.date.getMonth()]} ${yourTable.date.getFullYear()}\n${yourTable.date.getUTCHours()} часов\nЖелаете отменить заказ?`
                    bot.editMessageText(message, {chat_id:chatId, message_id:messageId, reply_markup:keyboard.tableDeleteKeyboard})
                }
            }

            if (data.query == 10 || data.query == 12 || data.query == 14 || data.query == 16) {
                result = await tableController.tableSetTime(chatId, data.query)
                yourTable = await tableController.findTableById(chatId)
                message = `Столик забронирован`
                bot.editMessageText(message, {chat_id:chatId, message_id:messageId})
            } else {
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
            }
        break
    }
})