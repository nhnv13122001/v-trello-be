/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    const createdCard = await cardModel.createNew(reqBody)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    let updatedCard = {}

    if (cardCoverFile) {
      const uploadResult = await cloudinaryProvider.streamUpload(
        cardCoverFile.buffer,
        'card-covers'
      )
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    } else if (reqBody.commentToAdd) {
      // Tạo dữ liệu comment để thêm vào database, cần bổ sung thêm những field cần thiết
      const commentData = {
        ...reqBody.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    } else {
      updatedCard = await cardModel.update(cardId, {
        ...reqBody,
        updatedAt: Date.now()
      })
    }

    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}
