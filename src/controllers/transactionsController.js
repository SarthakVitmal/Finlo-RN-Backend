import {connectDB} from '../config/db.js'

async function getTransactionByUserId(req,res) {
    try {
        const { userId } = req.params;
        const transactions = await connectDB`
            SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `;
        console.log(transactions)
        res.status(200).json(transactions);
    } catch (error) {
        console.log("Error getting the transactions", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function createTransaction(req,res) {
    try {
        const { title, amount, category, user_id } = req.body;
        if (!title || !user_id || !amount || !category) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const transaction = await connectDB`
            INSERT INTO transactions(user_id, title, amount, category)
            VALUES(${user_id},${title},${amount},${category})
            RETURNING *
        `;
        console.log(transaction);
        res.status(201).json("New transaction created")
    } catch (error) {
        console.log("Error creating the transaction", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function deleteTransaction(req,res) {
    try {
        const { id } = req.params;

        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: "Invalid Transaction ID" });
        }

        const transaction = await connectDB`
            DELETE FROM transactions WHERE id = ${id} RETURNING *
        `;
        if (transaction.length == 0) {
            return res.status(404).json({ message: "Transaction does not exist" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" })
    } catch (error) {
        console.log("Error deleting the transactions", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function getSummaryByUserId(req,res) {
    try {
        const { userId } = req.params;
        const balanceResult = await connectDB`
            SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
        `

        const incomeResult = await connectDB`
            SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0
        `

        const expenseResult = await connectDB`
            SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `

        res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expenseResult[0].expenses
        })
    } catch (error) {
        console.log("Error getting the summary", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export { getTransactionByUserId, createTransaction, deleteTransaction, getSummaryByUserId };