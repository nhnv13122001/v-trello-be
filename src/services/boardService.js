import { cloneDeep } from 'lodash'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { slugify } from '~/utils/formatter'
import { cardModel } from '~/models/cardModel'
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'

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

const moveCardsToDifferentColumnAPI = async (reqBody) => {
  try {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updateAt: Date.now()
    })

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updateAt: Date.now()
    })

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully!' }
  } catch (error) {
    throw new Error(error)
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardsToDifferentColumnAPI
}
