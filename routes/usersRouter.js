import {Router} from "express";
import {login, register} from "../controllers/users.js";


const usersRouter = Router()

usersRouter.post('/register', register);
usersRouter.post('/login', login);

export default usersRouter