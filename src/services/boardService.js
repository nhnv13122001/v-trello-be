import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { slugify } from '~/utils/formatter'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    const newBoard = { ...reqBody, slug: slugify(reqBody.title) }
    const createdBoard = await boardModel.createNew(newBoard)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    return getNewBoard
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new MyError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const resBoard = cloneDeep(board)

    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter(
        (card) => card.columnId.toString() === column._id.toString()
      )
    })
    delete resBoard.cards
    return resBoard
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = { ...reqBody, updateAt: Date.now() }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw new Error(error)
  }
}

export const boardService = {
  createNew,
  getDetails,
  update
}
