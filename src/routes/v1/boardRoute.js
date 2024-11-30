import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { authMiddleware } from '~/middlewares/authMiddleware'
import { boardController } from '~/controllers/boardController'
import { boardValidation } from '~/validations/boardValidation'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({
      message: 'GET: API get list boards'
    })
  })
  .post(
    authMiddleware.isAuthorized,
    boardValidation.createNew,
    boardController.createNew
  )

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(
    authMiddleware.isAuthorized,
    boardValidation.update,
    boardController.update
  )

Router.route('/supports/moving_card').put(
  authMiddleware.isAuthorized,
  boardValidation.moveCardsToDifferentColumnAPI,
  boardController.moveCardsToDifferentColumnAPI
)

export const boardRoute = Router
