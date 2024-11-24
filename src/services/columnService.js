import { columnModel } from '~/models/columnModel'
import { boardModel } from '~/models/boardModel'

const createNew = async (reqBody) => {
  try {
    const createdColumn = await columnModel.createNew(reqBody)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      getNewColumn.cards = []

      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = { ...reqBody, updateAt: Date.now() }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) {
    throw new Error(error)
  }
}

export const columnService = {
  createNew,
  update
}
