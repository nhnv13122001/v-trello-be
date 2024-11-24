import { StatusCodes } from 'http-status-codes'

import { boardService } from '~/services/boardService'

// req.body
// req.query
// req.params
// req.files
// req.cookies
// req.jwtDecoded
const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.getDetails(boardId)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id
    const board = await boardService.update(boardId, req.body)
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error)
  }
}

const moveCardsToDifferentColumnAPI = async (req, res, next) => {
  try {
    const result = await boardService.moveCardsToDifferentColumnAPI(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardsToDifferentColumnAPI
}
