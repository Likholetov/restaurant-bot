const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OrderSchema = new Schema({
    telegramId: {
        type: Number,
        required: true
    },
    meals: {
        type: [String],
        default: []
    }
})

mongoose.model('orders', OrderSchema)