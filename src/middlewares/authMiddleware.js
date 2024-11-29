import { StatusCodes } from 'http-status-codes'
import { jwtProvider } from '~/providers/jwtProvider'

import MyError from '~/utils/MyError'
import { env } from '~/config/environment'

// Middleware này sẽ đảm bảo nhiệm vụ quan trọng
// Xác thực JWT nhận được từ FE có hợp lệ không

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken

  if (!clientAccessToken) {
    next(
      new MyError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Token not found!')
    )
    return
  }

  try {
    const accessTokenDecoded = await jwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )
    req.jwtDecoded = accessTokenDecoded

    next()
  } catch (error) {
    if (error?.message?.includes('jwt expired')) {
      next(new MyError(StatusCodes.GONE, 'Need to refresh token!'))
      return
    }
    next(
      new MyError(StatusCodes.UNAUTHORIZED, 'Unauthorized! Token not found!')
    )
  }
}

export const authMiddleware = {
  isAuthorized
}
