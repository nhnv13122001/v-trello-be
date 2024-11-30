import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (nhnv13122001)',
      'string.empty': 'Title is not allowed to be empty (nhnv13122001)',
      'string.min':
        'Title length must be at least 3 characters long (nhnv13122001)',
      'string.max':
        'Title length must be less than or equal to 50 characters long (nhnv13122001)',
      'string.trim':
        'Title must not have leading or trailing whitespace (nhnv13122001)'
    }),
    description: Joi.string()
      .required()
      .min(3)
      .max(256)
      .trim()
      .strict()
      .messages({
        'any.required': 'Description is required (nhnv13122001)',
        'string.empty': 'Description is not allowed to be empty (nhnv13122001)',
        'string.min':
          'Description length must be at least 3 characters long (nhnv13122001)',
        'string.max':
          'Description length must be less than or equal to 256 characters long (nhnv13122001)',
        'string.trim':
          'Description must not have leading or trailing whitespace (nhnv13122001)'
      }),
    type: Joi.string()
      .valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE)
      .required()
      .messages({
        'any.required': 'type is required (nhnv13122001)',
        'any.only': 'type must be one of [public, private] (nhnv13122001)'
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
    title: Joi.string().min(3).max(50).trim().strict().messages({
      'any.required': 'Title is required (nhnv13122001)',
      'string.empty': 'Title is not allowed to be empty (nhnv13122001)',
      'string.min':
        'Title length must be at least 3 characters long (nhnv13122001)',
      'string.max':
        'Title length must be less than or equal to 50 characters long (nhnv13122001)',
      'string.trim':
        'Title must not have leading or trailing whitespace (nhnv13122001)'
    }),
    description: Joi.string().min(3).max(256).trim().strict().messages({
      'any.required': 'Description is required (nhnv13122001)',
      'string.empty': 'Description is not allowed to be empty (nhnv13122001)',
      'string.min':
        'Description length must be at least 3 characters long (nhnv13122001)',
      'string.max':
        'Description length must be less than or equal to 256 characters long (nhnv13122001)',
      'string.trim':
        'Description must not have leading or trailing whitespace (nhnv13122001)'
    }),
    type: Joi.string().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVATE).messages({
      'any.required': 'type is required (nhnv13122001)',
      'any.only': 'type must be one of [public, private] (nhnv13122001)'
    }),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
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

const moveCardsToDifferentColumnAPI = async (req, res, next) => {
  const correctCondition = Joi.object({
    currentCardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    prevCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),
    nextColumnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
  })

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    next()
  } catch (error) {
    next(
      new MyError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardsToDifferentColumnAPI
}
