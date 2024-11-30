/* eslint-disable no-useless-catch */
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { env } from '~/config/environment'
import { pickUser } from '~/utils/formatter'
import { userModel } from '~/models/userModel'
import { WEBSITE_DOMAIN } from '~/utils/constants'
import { jwtProvider } from '~/providers/jwtProvider'
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

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) {
      throw new MyError(StatusCodes.NOT_FOUND, 'Account not found!')
    }
    if (existUser.isActive) {
      throw new MyError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is already active!'
      )
    }
    if (reqBody.token !== existUser.verifyToken) {
      throw new MyError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')
    }
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (
      !existUser ||
      !bcryptjs.compareSync(reqBody.password, existUser.password)
    ) {
      throw new MyError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your Email or Password is incorrect!'
      )
    }
    if (!existUser.isActive) {
      throw new MyError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your account is not active!'
      )
    }

    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }
    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await jwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) {
    throw error
  }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await jwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await jwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) {
    throw error
  }
}

const update = async (userId, reqBody) => {
  const existUser = await userModel.findOneById(userId)
  if (!existUser) throw new MyError(StatusCodes.NOT_FOUND, 'Account not found!')
  if (!existUser.isActive)
    throw new MyError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

  let updatedUser = {}

  if (reqBody.currentPassword && reqBody.newPassword) {
    if (!bcryptjs.compareSync(reqBody.currentPassword, existUser.password)) {
      throw new MyError(
        StatusCodes.NOT_ACCEPTABLE,
        'Your current password is incorrect!'
      )
    }
    updatedUser = await userModel.update(existUser._id, {
      password: bcryptjs.hashSync(reqBody.newPassword, 8)
    })
  } else {
    updatedUser = await userModel.update(existUser._id, reqBody)
  }
  return pickUser(updatedUser)
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}
