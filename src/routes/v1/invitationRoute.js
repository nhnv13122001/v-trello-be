import express from 'express'

import { authMiddleware } from '~/middlewares/authMiddleware'
import { invitationController } from '~/controllers/invitationController'
import { invitationValidation } from '~/validations/invitationValidation'

const Router = express.Router()

Router.route('/').get(
  authMiddleware.isAuthorized,
  invitationController.getInvitations
)

Router.route('/board').post(
  authMiddleware.isAuthorized,
  invitationValidation.createNewBoardInvitation,
  invitationController.createNewBoardInvitation
)

Router.route('/board/:invitationId').put(
  authMiddleware.isAuthorized,
  invitationController.updateBoardInvitation
)

export const invitationRoute = Router
