import dotenv from 'dotenv'

dotenv.config()

export const environments = {
  BUCKET: process.env.BUCKET,
  REGION: process.env.REGION,
  ACCESS_KEY_API: process.env.ACCESS_KEY_API,
  SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY
}
