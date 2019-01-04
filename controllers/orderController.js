const mongoose = require('mongoose')

require('../models/order.model')
require('../models/meal.model')

const Meal = mongoose.model('meals')
const Order = mongoose.model('orders')

class OrderController {
    async addMeal(userId, queryId, mealUuid){
        let orderPromise
        const order = await Order.findOne({telegramId: userId})
        const meal = await Meal.findOne({uuid: mealUuid})

        if(order){
            order.meals.push(meal)
            orderPromise = order
        } else {
            orderPromise = new Order({
              telegramId: userId,
              meals: [meal]
            })
        }

        const answerText = 'Блюдо добавлено в Ваш заказ'
        orderPromise.save()

        const result = {
            callback_query_id: queryId,
            text: answerText
        }
        return result
    }

    async removeMeal(userId, mealUuid){
        const order = await Order.findOne({telegramId: userId})

        for (let index = 0; index < order.meals.length; index++) {
            if(order.meals[index].uuid == mealUuid)
            {
                order.meals.splice(index, 1)
                break
            }
        }

        order.save()
    }


    findOrderById(userId){
        return Order.findOne({telegramId: userId})
    }
}

module.exports = new OrderController()