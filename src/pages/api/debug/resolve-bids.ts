import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { AutoBidder } from 'src/services/autobidder'
import { connectToDatabase } from 'src/services/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { docs } = await connectToDatabase()
  const autoBidder = new AutoBidder(docs)

  const {
    query: { id }
  } = req

  const auction = await docs.auctions().findOne({ _id: new ObjectId(id.toString()) })
  const result = autoBidder.ResolveMaxBids(auction)
  return res.status(200).json(result)
}