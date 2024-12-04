/* eslint-disable no-console */
import cors from 'cors'
import http from 'http'
import express from 'express'
import socketIo from 'socket.io'
import exitHook from 'async-exit-hook'
import cookieParser from 'cookie-parser'

import { APIs_V1 } from '~/routes/v1'
import { env } from '~/config/environment'
import { corsOptions } from './config/cors'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb.js'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { inviteUserToBoardSocket } from './sockets/inviteUserToBoardSocket'

const START_SERVER = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', APIs_V1)

  app.use(errorHandlingMiddleware)

  const server = http.createServer(app)
  // Khởi tạo biến io với server và cors
  const io = socketIo(server, { cors: corsOptions })

  io.on('connection', (socket) => {
    inviteUserToBoardSocket(socket)
  })

  // Dùng server.listen thay vì app.listen vì lúc này server đã bao gồm express app và đã config socket.io
  server.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(
      `3. Hello ${env.AUTHOR}, I am running at ${env.APP_HOST}:${env.APP_PORT}/`
    )
  })

  exitHook(() => {
    console.log('4. Server is shutting down...')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

;(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()
