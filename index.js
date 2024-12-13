import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import {connectDB} from "./db/connect.js";
import indexRouter from "./routes/index.js";
import {errorHandler} from "./middleware/errorHandler.js";

dotenv.config()

const PORT = process.env.PORT || 5000

const app = express()

try {
    connectDB()
    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({extended: true}))
    app.use('/', indexRouter)
    app.use(errorHandler)
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`)
    })
} catch (e) {
    console.log(e)
}