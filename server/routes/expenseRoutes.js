const expenseRouter = require("express").Router();
const ExpenseSchema = require("../model/expenseModel");

expenseRouter.post("/add", async (req, res) => {
    const { title, amount, category, description, budget } = req.body
    const income = ExpenseSchema({
        title,
        amount,
        category,
        description,
        budget
    })

    try {
        if (!title || !category || !description || !budget) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (amount <= 0 || !amount === 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }
        await income.save()
        res.status(200).json(income)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}
);
expenseRouter.get("/all", async (req, res) => {
    try {
        const incomes = await ExpenseSchema.find().sort({ createdAt: -1 })
        res.status(200).json(incomes)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
});
expenseRouter.put("/update/:id", async (req, res) => {
    const income = await ExpenseSchema.findById(req.params.id);
    if (income) {
        income.title = req.body.title || income.title,
            income.description = req.body.description || income.description,
            income.amount = req.body.amount || income.amount,
            income.budget = req.body.budget || income.budget,
            income.category = req.body.category || income.category

        const updateIncome = await income.save()
        res.status(200).json(updateIncome)
    }
});
expenseRouter.delete("/remove/:id", async (req, res) => {
    const { id } = req.params;
    await ExpenseSchema.findByIdAndDelete(id)
        .then((income) => {
            res.status(200).json({ message: 'Expense Deleted' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Server Error' })
        })
});


module.exports = expenseRouter