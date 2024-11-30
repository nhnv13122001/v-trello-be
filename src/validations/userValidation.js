import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/models/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE)
      .messages({
        'any.required': 'Email is required (nhnv13122001)',
        'string.empty': 'Email is not allowed to be empty (nhnv13122001)'
      }),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE)
      .messages({
        'any.required': 'Password is required (nhnv13122001)',
        'string.empty': 'Password is not allowed to be empty (nhnv13122001)'
      })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new MyError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const verifyAccount = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE)
      .messages({
        'any.required': 'Email is required (nhnv13122001)',
        'string.empty': 'Email is not allowed to be empty (nhnv13122001)'
      }),
    token: Joi.string().required().messages({
      'any.required': 'Token is required (nhnv13122001)',
      'string.empty': 'Token is not allowed to be empty (nhnv13122001)'
    })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new MyError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE)
      .messages({
        'any.required': 'Email is required (nhnv13122001)',
        'string.empty': 'Email is not allowed to be empty (nhnv13122001)'
      }),
    password: Joi.string()
      .required()
      .pattern(PASSWORD_RULE)
      .message(PASSWORD_RULE_MESSAGE)
      .messages({
        'any.required': 'Password is required (nhnv13122001)',
        'string.empty': 'Password is not allowed to be empty (nhnv13122001)'
      })
  })

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new MyError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    displayName: Joi.string().trim().strict(),
    currentPassword: Joi.string()
      .pattern(PASSWORD_RULE)
      .message(`Current password: ${PASSWORD_RULE_MESSAGE}`)
      .messages({
        'any.required': 'Current password is required (nhnv13122001)',
        'string.empty':
          'Current password is not allowed to be empty (nhnv13122001)'
      }),
    newPassword: Joi.string()
      .pattern(PASSWORD_RULE)
      .message(`New password: ${PASSWORD_RULE_MESSAGE}`)
      .messages({
        'any.required': 'New password is required (nhnv13122001)',
        'string.empty': 'New password is not allowed to be empty (nhnv13122001)'
      })
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    next()
  } catch (error) {
    next(
      new MyError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const userValidation = {
  createNew,
  verifyAccount,
  login,
  update
}
