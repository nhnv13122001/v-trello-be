import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/models/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .messages({
        'any.required': 'boardId is required (nhnv13122001)'
      }),
    columnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .messages({
        'any.required': 'columnId is required (nhnv13122001)'
      }),
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (nhnv13122001)',
      'string.empty': 'Title is not allowed to be empty (nhnv13122001)',
      'string.min':
        'Title length must be at least 3 characters long (nhnv13122001)',
      'string.max':
        'Title length must be less than or equal to 50 characters long (nhnv13122001)',
      'string.trim':
        'Title must not have leading or trailing whitespace (nhnv13122001)'
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

export const cardValidation = {
  createNew
}
