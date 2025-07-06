import express from 'express'
import { getTransactionByUserId, createTransaction, deleteTransaction, getSummaryByUserId } from '../controllers/transactionsController.js'

const router = express.Router();

router.get("/:user_id", getTransactionByUserId)

router.post("/",createTransaction)

router.delete("/:id", deleteTransaction)

router.get("/summary/:userId", getSummaryByUserId)

export default router 