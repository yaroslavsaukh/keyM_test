import bcrypt from "bcrypt";
import {findUserByUsername, userCreate} from "../services/usersService.js";
import {generateAccessToken} from "../utils/generateToken.js";
import createHttpError from "http-errors";
import {registerSchema} from "../validation/users/registerUser.js";

export const register = async (req, res, next) => {
    try {
        const { error, value } = registerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            throw createHttpError(400, error.details.map(detail => detail.message).join(', '));
        }

        const { username, password, name } = value;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userCreate({ username, password: hashedPassword, name });

        if (user) {
            const token = await generateAccessToken({ id: user._id, name: user.name });
            return res.status(200).json({ token });
        }

        return res.status(401).json({});
    } catch (e) {
        next(e);
    }
};
export const login = async (req, res, next) => {
    try{
        const {username, password} = req.body
        console.log(username, password)
        const user = await findUserByUsername(username)
        console.log(user)
        if (user && await bcrypt.compare(password, user.password)) {
            const token = await generateAccessToken({id: user._id, name: user.name})
            return res.status(200).json({token})
        }
        return res.status(401).json({})
    } catch (e) {
        next(e)
    }
}