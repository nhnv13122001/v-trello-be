import { StatusCodes } from 'http-status-codes'

import MyError from '~/utils/MyError'
import { env } from '~/config/environment'
import { WHITELIST_DOMAINS } from '~/utils/constants'

export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin && env.BUILD_MODE === 'dev') {
      return callback(null, true)
    }

    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    return callback(
      new MyError(
        StatusCodes.FORBIDDEN,
        `${origin} not allowed by our CORS Policy.`
      )
    )
  },

  optionsSuccessStatus: 200,

  credentials: true
}
