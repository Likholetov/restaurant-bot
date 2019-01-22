const mongoose = require('mongoose')
const _ = require('lodash')

require('../models/meal.model')

const Meal = mongoose.model('meals')

class MealController {

    // Поиск блюда по uuid
    findMealByUuid(query) {
      return Meal.findOne({uuid: query})
    }

    // Поиск блюд по типу
    findMealsByTypeQuery(query) {
      return Meal.find({type: query})
    }

    // Формирование клавиатуры с типами блюд
    async inlineMealTypesKeyboard() {
      // получение полного списка блюд
      const meals = await Meal.find({})
      
      let types = []

      // формирование массива типов блюд
      meals.map(m => types.push(m.type))
      // удаление повторяющихся типов
      types = _.uniq(types);
      
      // формирование кнопок
      types = types.map(t => [
        { text: t, 
          callback_data: JSON.stringify({
          query: t
        })}
      ])

      // добавление кнопки "назад"
      types.push([
        { text: 'назад', 
          callback_data: JSON.stringify({
          query: 'back'
        })}
      ])

      // формирование клавиатуры 
      types = {
          inline_keyboard: types
      }

      // возврат клавиатуры типов
      return types
    }
    
}

module.exports = new MealController()