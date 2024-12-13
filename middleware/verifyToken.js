import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'

export const verifyToken = (req, _, next) => {
    try {
        const authorization = req.headers.authorization

        if (!authorization)
            return next(
                createHttpError(401, {
                    message: 'Missing token',
                }),
            )

        const splitedToken = authorization?.split(' ')
        const bearer = splitedToken[0]
        if (!bearer)
            return next(
                createHttpError(401, {
                    message: 'Invalid token',
                }),
            )

        const token = splitedToken[1]
        const secret = process.env.SECRET

        jwt.verify(token, secret, async (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return next(
                        createHttpError(401, {
                            message: 'Expired token',
                        }),
                    )
                }
                return next(
                    createHttpError(401, {
                        message: 'Invalid token',
                    }),
                )
            } else {
                req.user = user
                next()
            }
        })
    } catch (error) {
        next(error)
    }
}
