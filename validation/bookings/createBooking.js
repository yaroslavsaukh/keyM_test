import Joi from 'joi';

export const createBookingSchema = Joi.object({
    user: Joi.string()
        .trim()
        .required()
        .messages({
            'string.base': `"user" should be a string`,
            'string.empty': `"user" cannot be an empty field`,
            'any.required': `"user" is a required field`,
        }),
    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .required()
        .messages({
            'string.base': `"date" should be a string`,
            'string.pattern.base': `"date" must be in the format YYYY-MM-DD`,
            'any.required': `"date" is a required field`,
        }),
    startTime: Joi.string()
        .pattern(/^\d{2}:\d{2}$/)
        .required()
        .messages({
            'string.base': `"startTime" should be a string`,
            'string.pattern.base': `"startTime" must be in the format HH:mm`,
            'any.required': `"startTime" is a required field`,
        }),
    endTime: Joi.string()
        .pattern(/^\d{2}:\d{2}$/)
        .required()
        .messages({
            'string.base': `"endTime" should be a string`,
            'string.pattern.base': `"endTime" must be in the format HH:mm`,
            'any.required': `"endTime" is a required field`,
        }),
});
