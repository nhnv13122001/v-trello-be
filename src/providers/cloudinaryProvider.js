import cloudinary from 'cloudinary'
import { reject } from 'lodash'
import streamifier from 'streamifier'

import { env } from '~/config/environment'

const cloudinaryV2 = cloudinary.v2
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

// Khởi tạo 1 function để thực hiện upload file lên cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // Tạo một luồng 'stream' upload lên cloudinary
    const stream = cloudinaryV2.uploader.upload_stream(
      { folder: folderName },
      (err, result) => {
        if (err) reject(err)
        else resolve(result)
      }
    )
    // Thực hiện upload cái luồng trên bằng lib streamifier
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const cloudinaryProvider = {
  streamUpload
}