import jwt from "jsonwebtoken";

export const generateAccessToken = ({ id,name }) => {
    return jwt.sign(
        {
            id,
            name,
            date: new Date(),
        },
        process.env.SECRET,
    )
}