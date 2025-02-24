import joi from 'joi'

export const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')),
})
