const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MealSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    ingredients: {
        type: [String],
        default: []
    },
    img: {
        type: String
    }
})

mongoose.model('meals', MealSchema)