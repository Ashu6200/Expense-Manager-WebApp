const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { db } = require('./Database/db');
const userRouter = require('./routes/userRoutes');
const expenseRouter = require('./routes/expenseRoutes');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/expense', expenseRouter)

const PORT = process.env.PORT;
const server = () => {
    db()
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`)
    })
}

server()