/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { pickUser } from '~/utils/formatter'
import { userModel } from '~/models/userModel'
import { boardModel } from '~/models/boardModel'
import { invitationModel } from '~/models/invitationModel'
import { BOARD_INVITATION_STATUS, INVITATION_TYPES } from '~/utils/constants'

const createNewBoardInvitation = async (reqBody, inviterId) => {
  try {
    const inviter = await userModel.findOneById(inviterId)
    const invitee = await userModel.findOneByEmail(reqBody.inviteeEmail)
    const board = await boardModel.findOneById(reqBody.boardId)

    if (!inviter || !invitee || !board) {
      throw new MyError(
        StatusCodes.NOT_FOUND,
        'Inviter, Invitee or Board not found!'
      )
    }

    const newInvitationData = {
      inviterId,
      inviteeId: invitee._id.toString(),
      type: INVITATION_TYPES.BOARD_INVITATION,
      boardInvitation: {
        boardId: board._id.toString(),
        status: BOARD_INVITATION_STATUS.PENDING
      }
    }

    const createdInvitation = await invitationModel.createNewBoardInvitation(
      newInvitationData
    )
    const getInvitation = await invitationModel.findOneById(
      createdInvitation.insertedId
    )

    const resInvitation = {
      ...getInvitation,
      board,
      inviter: pickUser(inviter),
      invitee: pickUser(invitee)
    }
    return resInvitation
  } catch (error) {
    throw error
  }
}

export const invitationService = {
  createNewBoardInvitation
}
