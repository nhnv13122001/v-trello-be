import { StatusCodes } from 'http-status-codes'

import { columnService } from '~/services/columnService'

// req.body
// req.query
// req.params
// req.files
// req.cookies
// req.jwtDecoded
const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew
}
