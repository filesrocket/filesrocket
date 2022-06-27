import dotenv from 'dotenv'

dotenv.config()

export const environments = {
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET
}
