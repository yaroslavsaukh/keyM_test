import createHttpError from "http-errors";
import Users from "../db/models/Users.js";

export const userCreate = async (data) => {
    try{
        const {username, password, name} = data
        return await Users.create({username, password, name})
    } catch (e) {
        throw createHttpError(e)
    }
}

export const findUserByUsername = async (username) => {
    try {
        return await Users.findOne({username})
    } catch (e) {
        throw createHttpError(e)
    }
}