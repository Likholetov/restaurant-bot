const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TableSchema = new Schema({
    telegramId: {
        type: Number,
        required: true
    },
    date: { 
        type: Date
    }
})

mongoose.model('tables', TableSchema)