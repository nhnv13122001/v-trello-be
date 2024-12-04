import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from '~/utils/validators'

const createNewBoardInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({
    inviteeEmail: Joi.string()
      .required()
      .pattern(EMAIL_RULE)
      .message(EMAIL_RULE_MESSAGE)
      .messages({
        'any.required': 'Invitee Email is required (nhnv13122001)',
        'string.empty':
          'Invitee Email is not allowed to be empty (nhnv13122001)'
      }),
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .messages({
        'any.required': 'Board Id is required (nhnv13122001)',
        'string.empty': 'Board Id is not allowed to be empty (nhnv13122001)'
      })
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

export const invitationValidation = {
  createNewBoardInvitation
}
