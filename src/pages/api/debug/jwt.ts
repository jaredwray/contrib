import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'next-auth/jwt'

const secret = process.env.SECRET

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = await jwt.getToken({ req, secret })
  return res.status(200).json(token)
}