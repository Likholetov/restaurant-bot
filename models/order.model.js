const mongoose = require('mongoose')
const Schema = mongoose.Schema

const mealSchema = require('./meal.model')

const OrderSchema = new Schema({
    telegramId: {
        type: Number,
        required: true
    },
    meals: {
        type: [mealSchema],
        default: []
    }
})

mongoose.model('orders', OrderSchema)