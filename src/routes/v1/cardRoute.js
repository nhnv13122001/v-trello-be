import express from 'express'

import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardController } from '~/controllers/cardController'
import { cardValidation } from '~/validations/cardValidation'

const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  cardValidation.createNew,
  cardController.createNew
)

export const cardRoute = Router
