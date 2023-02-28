const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 50
    },
    budget: {
        type: Number,
        required: true,
        maxLength: 20,
        
    },
    amount: {
        type: Number,
        required: true,
        maxLength: 20,
        
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Expense', expenseSchema)