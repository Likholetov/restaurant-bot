const mongoose = require('mongoose')

require('../models/order.model')

const Order = mongoose.model('orders')

class OrderController {
    async addMeal(userId, queryId, mealUuid){
        let orderPromise
        const order = await Order.findOne({telegramId: userId})

        if(order){
            orderPromise = order
        } else {
            orderPromise = new Order({
              telegramId: userId,
              meals: [mealUuid]
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
}

module.exports = new OrderController()