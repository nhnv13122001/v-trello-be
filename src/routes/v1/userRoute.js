import express from 'express'

import { authMiddleware } from '~/middlewares/authMiddleware'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'
import { multerMiddleware } from '~/middlewares/multerMiddleware'

const Router = express.Router()

Router.route('/register').post(
  userValidation.createNew,
  userController.createNew
)

Router.route('/verify').put(
  userValidation.verifyAccount,
  userController.verifyAccount
)

Router.route('/login').post(userValidation.login, userController.login)

Router.route('/logout').delete(userController.logout)

Router.route('/refresh_token').get(userController.refreshToken)

Router.route('/update').put(
  authMiddleware.isAuthorized,
  multerMiddleware.upload.single('avatar'),
  userValidation.update,
  userController.update
)

export const userRoute = Router
