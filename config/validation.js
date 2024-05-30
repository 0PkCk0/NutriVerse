// Validation
const Joi = require('@hapi/joi')

//Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        weight: Joi.array().items(
            Joi.object({
                value: Joi.number().min(30)
            })
        ),
        height: Joi.number().min(0),
        age: Joi.number().min(18),
        gender: Joi.string().min(4)
    });

    const { error } = schema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }

    return {
        success: true
    };
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(data);
    if (error) {
        throw new Error(error.details[0].message);
    }

    return {
        success: true
    };
}
module.exports = {
    registerValidation,
    loginValidation
}