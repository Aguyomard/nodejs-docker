import joi from 'joi'

export const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')),
})

export const signinSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')),
})

export const acceptCodeSchema = joi.object({
  email: joi.string().email().required(),
  code: joi.string().required(),
})

export const changePasswordSchema = joi.object({
  email: joi.string().email().required(),
  newPassword: joi
    .string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')),
  oldPassword: joi
    .string()
    .required()
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')),
})
