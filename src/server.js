import express from 'express'
import dotenv from 'dotenv'
import {connectDB, initDB} from './config/db.js'
import ratelimiter from './middleware/rateLimiter.js';
import transactionRoute from './routes/transactionsRoutes.js'

dotenv.config();
const app = express();
app.use(ratelimiter)
app.use(express.json());
const PORT = process.env.PORT;

app.use("/api/transactions",transactionRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up and running on PORT: ${PORT}`)
    })
})