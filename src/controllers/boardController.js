import { StatusCodes } from 'http-status-codes'

import { boardService } from '~/services/boardService'

// req.body
// req.query
// req.params
// req.files
// req.cookies
// req.jwtDecoded
const getBoards = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const { page, itemsPerPage, q } = req.query
    const queryFilters = q
    const result = await boardService.getBoards(
      userId,
      page,
      itemsPerPage,
      queryFilters
    )

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const createdBoard = await boardService.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const boardId = req.params.id
    const board = await boardService.getDetails(userId, boardId)
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
  moveCardsToDifferentColumnAPI,
  getBoards
}
