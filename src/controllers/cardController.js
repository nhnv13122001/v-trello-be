import { StatusCodes } from 'http-status-codes'

import { cardService } from '~/services/cardService'

// req.body
// req.query
// req.params
// req.files
// req.cookies
// req.jwtDecoded
const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) {
    next(error)
  }
}

export const cardController = {
  createNew
}
