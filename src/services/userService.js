/* eslint-disable no-useless-catch */
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { pickUser } from '~/utils/formatter'
import { userModel } from '~/models/userModel'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { brevoProvider } from '~/providers/brevoProvider'

const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new MyError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const subject = 'Trello: Please verify your email before using our services'
    const htmlContent = `
    <h3>Here is your verification link:</h3>
    <h3>${verificationLink}</h3>
    <h3>Sincerely,<br/> - Nhnv13122001 - </h3>
    `

    await brevoProvider.sendEmail(getNewUser.email, subject, htmlContent)

    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNew
}
