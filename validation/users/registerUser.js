import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `"username" should be a string`,
            'string.empty': `"username" cannot be an empty field`,
            'string.min': `"username" should have a minimum length of 3`,
            'string.max': `"username" should have a maximum length of 30`,
            'any.required': `"username" is a required field`,
        }),
    password: Joi.string()
        .min(8)
        .max(128)
        .required()
        .messages({
            'string.base': `"password" should be a string`,
            'string.empty': `"password" cannot be an empty field`,
            'string.min': `"password" should have a minimum length of 8`,
            'string.max': `"password" should have a maximum length of 128`,
            'any.required': `"password" is a required field`,
        }),
    name: Joi.string()
        .trim()
        .max(50)
        .required()
        .messages({
            'string.base': `"name" should be a string`,
            'string.empty': `"name" cannot be an empty field`,
            'string.max': `"name" should have a maximum length of 50`,
            'any.required': `"name" is a required field`,
        }),
});