const mongoose = require('mongoose')
const config = require('../config')

// test database json file
const database = require('./database.json')

require('../models/meal.model')

const Meal = mongoose.model('meals')

// connecting to DB
mongoose.connect(config.DB_URL, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err))

// filling DB with test data
database.meals.forEach(m => new Meal(m).save().catch(e => console.log(e)))