import express from 'express'

import { authMiddleware } from '~/middlewares/authMiddleware'
import { cardController } from '~/controllers/cardController'
import { cardValidation } from '~/validations/cardValidation'
import { multerMiddleware } from '~/middlewares/multerMiddleware'

const Router = express.Router()

Router.route('/').post(
  authMiddleware.isAuthorized,
  cardValidation.createNew,
  cardController.createNew
)

Router.route('/:id').put(
  authMiddleware.isAuthorized,
  multerMiddleware.upload.single('cardCover'),
  cardValidation.update,
  cardController.update
)

export const cardRoute = Router
