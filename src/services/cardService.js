import { cardModel } from '~/models/cardModel'

const createNew = async (reqBody) => {
  try {
    const createdCard = await cardModel.createNew(reqBody)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    return getNewCard
  } catch (error) {
    throw new Error(error)
  }
}

export const cardService = {
  createNew
}
