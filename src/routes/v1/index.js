import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { cardRoute } from './cardRoute'
import { boardRoute } from './boardRoute'
import { columnRoute } from './columnRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs V1 are ready to use.'
  })
})

Router.use('/boards', boardRoute)

Router.use('/columns', columnRoute)

Router.use('/cards', cardRoute)

export const APIs_V1 = Router
