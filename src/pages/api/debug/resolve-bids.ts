import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { AutoBidder } from 'services/autobidder'
import { connectToDatabase } from 'services/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { docs } = await connectToDatabase()
  const autoBidder = new AutoBidder(docs)

  const {
    query: { id }
  } = req

  const result = autoBidder.ResolveMaxBids(new ObjectId(id.toString()))
  return res.status(200).json(result)
}