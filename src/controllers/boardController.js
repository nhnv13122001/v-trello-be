import { StatusCodes } from 'http-status-codes'

const createNew = async (req, res) => {
  try {
    res.status(StatusCodes.CREATED).json({
      message: 'POST from Controller: API create new board'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: error.message
    })
  }
}

export const boardController = {
  createNew
}
