// Validation
const Joi = require('@hapi/joi')

//Register Validation
const registerValidation = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
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
    })
    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data)
}

module.exports = {
    registerValidation,
    loginValidation
}