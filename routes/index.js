import {Router} from "express";
import usersRouter from "./usersRouter.js";
import bookingsRouter from "./bookingsRouter.js";

const indexRouter = Router()

indexRouter.use('/users', usersRouter)
indexRouter.use('/bookings', bookingsRouter)

export default indexRouter
