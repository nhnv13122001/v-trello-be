import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { cardRoute } from './cardRoute'
import { userRoute } from './userRoute'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'
import { invitationRoute } from './invitationRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs V1 are ready to use.'
  })
})

Router.use('/cards', cardRoute)
Router.use('/users', userRoute)
Router.use('/boards', boardRoute)
Router.use('/columns', columnRoute)
Router.use('/invitations', invitationRoute)

export const APIs_V1 = Router
