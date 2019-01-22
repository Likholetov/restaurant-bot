const mongoose = require('mongoose')

require('../models/order.model')
require('../models/meal.model')

const Meal = mongoose.model('meals')
const Order = mongoose.model('orders')

class OrderController {
    
    // добавление блюда в заказ
    async addMeal(userId, queryId, mealUuid){
        let orderPromise

        // поиск заказа данного пользователя
        const order = await Order.findOne({telegramId: userId})
        // поиск блюда в базе данных
        const meal = await Meal.findOne({uuid: mealUuid})

        // проверка, существует ли заказ
        if(order){
            // если заказ существует, добавление
            // блюда в заказ
            order.meals.push(meal)
            orderPromise = order
        } else {
            // если заказа не существует
            // создание заказа
            orderPromise = new Order({
              telegramId: userId,
              meals: [meal]
            })
        }

        // сохраниение изменений или нового заказа
        orderPromise.save()

        // текст всплывающего сообщения
        const answerText = 'Блюдо добавлено в Ваш заказ'

        // формирование ответа пользователю
        const result = {
            callback_query_id: queryId,
            text: answerText
        }
        return result
    }

    // удаление блюда из заказа
    async removeMeal(userId, mealUuid){
        // получение заказа из БД
        const order = await Order.findOne({telegramId: userId})

        // поиск блюда в списке заказанных
        for (let index = 0; index < order.meals.length; index++) {
            if(order.meals[index].uuid == mealUuid)
            {
                // удаление блюда
                order.meals.splice(index, 1)
                break
            }
        }

        // сохранение изменений
        order.save()
    }

    // поиск заказа по id пользователя
    findOrderById(userId){
        return Order.findOne({telegramId: userId})
    }

    // подтверждение заказа
    async applyOrder(userId, location){
        const order = await Order.findOne({telegramId: userId})
        let msg = "Вы еще ничего не заказали"

        // проверка на наличие заказа
        if (order) {
            // проверка на содержание в заказе блюд
            if(order.meals.length > 0){
                // проверка подтвержден ли заказ
                if (order.location) {
                    msg = "Вы уже сообщили свое местоположение, дождитесь, пока с Вами свяжется оператор"
                    return msg
                } else {
                    // подтверждение заказа
                    order.location = location
                    order.save()
    
                    msg = "Местоположение успешно задано, дождитесь, пока с Вами свяжется оператор, чтобы подтвердить заказ"
                    return msg
                }
            } else {
                return msg
            }
        } else {
            return msg
        }
    }
}

module.exports = new OrderController()