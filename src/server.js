import express from 'express'
import dotenv from 'dotenv'
import {connectDB, initDB} from './config/db.js'
import ratelimiter from './middleware/rateLimiter.js';
import transactionRoute from './routes/transactionsRoutes.js'
import job from './config/cron.js';

dotenv.config();
const app = express();
if(process.env.NODE_ENV === "production")job.start()
app.use(ratelimiter)
app.use(express.json());
const PORT = process.env.PORT;

app.get("/api/health",(req,res) => {
    res.status(200).json({status : "ok"})
})

app.use("/api/transactions",transactionRoute);

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is up and running on PORT: ${PORT}`)
    })
})