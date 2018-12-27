const mongoose = require('mongoose')
const _ = require('lodash')

require('../models/meal.model')

const Meal = mongoose.model('meals')

class MealController {

    //Поиск блюд по запросу
    findMealsByQuery(query) {
      return Meal.find(query)
    }

    //Формирование клавиатуры с типами блюд
    async inlineMealTypesKeyboard() {
      const meals = await Meal.find({})
      let types = []

      meals.map(m => types.push(m.type))
      types = _.uniq(types);

      types = types.map(t => [
        { text: t, 
          callback_data: JSON.stringify({
          query: t
        })}
      ])


      types = {
        reply_markup: {
          inline_keyboard: types
        }
      }
      return types
    }
    
}

module.exports = new MealController()