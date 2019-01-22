const mongoose = require('mongoose')

require('../models/table.model')

const Table = mongoose.model('tables')

class TableController {

    // поиск столика по id пользователя
    findTableById(userId){
        return Table.findOne({telegramId: userId})
    }

    // создание брони
    async tableSetDate(userId, tableDate){
        let tablePromise
        // поиск брони в базе
        const table = await Table.findOne({telegramId: userId})

        // проверка, существует ли бронь
        if(table){
            return false
        } else {
            // создание брони
            tablePromise = new Table({
                telegramId: userId,
                date: tableDate
            })
            // сохраниение
            tablePromise.save()
            return true
        }   
    }

    // установка времени
    async tableSetTime(userId, tableTime){
        // поиск брони в базе
        const table = await Table.findOne({telegramId: userId})

        //проверка, найдена ли бронь
        if(table){
            // изменение времени брони
            const time = new Date(table.date.getTime() + (tableTime * 60 * 60 * 1000))
            table.date = time
            table.save()
            return true
        } else {
            return false
        } 
        
    }

    // удаление брони
    tableDelete(userId){
        Table.deleteOne({telegramId: userId}, function (err) {})
    }
}

module.exports = new TableController()