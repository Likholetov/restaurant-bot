const mongoose = require('mongoose')

require('../models/table.model')

const Table = mongoose.model('tables')

class TableController {

    findTableById(userId){
        return Table.findOne({telegramId: userId})
    }

    async tableSetDate(userId, tableDate){
        let tablePromise
        const table = await Table.findOne({telegramId: userId})

        if(table){
            return 0
        } else {
            tablePromise = new Table({
                telegramId: userId,
                date: tableDate
            })
            tablePromise.save()
            return 1
        }   
    }

    async tableSetTime(userId, tableTime){
        const table = await Table.findOne({telegramId: userId})
        if(table){
            const time = new Date(table.date.getTime() + (tableTime * 60 * 60 * 1000))
            table.date = time
            table.save()
        } else {
            return 0
        } 
        
    }

    tableDelete(userId){
        Table.deleteOne({telegramId: userId}, function (err) {})
    }
}

module.exports = new TableController()