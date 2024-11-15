import { MongoClient, ServerApiVersion } from 'mongodb'

import { env } from '~/config/environment'

let trelloDatabaseInstance = null

const client = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await client.connect()

  trelloDatabaseInstance = client.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await client.close()
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance)
    throw new Error('Must connect to Database first!')
  return trelloDatabaseInstance
}
