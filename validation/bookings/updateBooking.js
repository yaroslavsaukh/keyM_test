import Joi from 'joi';

export const updateBookingSchema = Joi.object({
    user: Joi.string()
        .trim()
        .optional()
        .messages({
            'string.base': `"user" should be a string`,
            'string.empty': `"user" cannot be an empty field`,
        }),
    date: Joi.string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/)
        .optional()
        .messages({
            'string.base': `"date" should be a string`,
            'string.pattern.base': `"date" must be in the format YYYY-MM-DD`,
        }),
    startTime: Joi.string()
        .pattern(/^\d{2}:\d{2}$/)
        .optional()
        .messages({
            'string.base': `"startTime" should be a string`,
            'string.pattern.base': `"startTime" must be in the format HH:mm`,
        }),
    endTime: Joi.string()
        .pattern(/^\d{2}:\d{2}$/)
        .optional()
        .messages({
            'string.base': `"endTime" should be a string`,
            'string.pattern.base': `"endTime" must be in the format HH:mm`,
        }),
}).min(1).messages({
    'object.min': `At least one field must be provided for update`,
});
