import { StatusCodes } from 'http-status-codes'

import { invitationService } from '~/services/invitationService'

const createNewBoardInvitation = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    const resInvitation = await invitationService.createNewBoardInvitation(
      req.body,
      inviterId
    )

    res.status(StatusCodes.CREATED).json(resInvitation)
  } catch (error) {
    next(error)
  }
}

const getInvitations = async (req, res, next) => {
  try {
    const inviterId = req.jwtDecoded._id
    const resInvitations = await invitationService.getInvitations(inviterId)

    res.status(StatusCodes.OK).json(resInvitations)
  } catch (error) {
    next(error)
  }
}

const updateBoardInvitation = async (req, res, next) => {
  try {
    const { status } = req.body
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params
    const updatedInvitation = await invitationService.updateBoardInvitation(
      userId,
      invitationId,
      status
    )

    res.status(StatusCodes.OK).json(updatedInvitation)
  } catch (error) {
    next(error)
  }
}

export const invitationController = {
  createNewBoardInvitation,
  getInvitations,
  updateBoardInvitation
}