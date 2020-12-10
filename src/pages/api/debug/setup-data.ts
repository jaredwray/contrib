import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'services/mongodb'

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomEntry<T>(values: T[]) {
  return values[getRandomInt(0, values.length - 1)]
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { docs } = await connectToDatabase()

  const auctions = await docs.auctions().find().toArray()
  
  // Make all auctions still running by some amount
  for(const auction of auctions) {
    const endingInHours = getRandomInt(1, 4 * 24)
    auction.endAt = new Date()
    auction.endAt.setHours(auction.endAt.getHours() + endingInHours) 
    const auctionLength = getRandomEntry([3,5,7])
    auction.startAt = new Date()
    auction.startAt.setDate(auction.startAt.getDate() - auctionLength)
    console.log(endingInHours, auction.startAt, auction.endAt)
    const result = await docs.auctions().replaceOne({ _id: auction._id }, auction)
  }

  // Specifically end just one for now for testing
  const closedAuction = await docs.auctions().findOne({ _id: new ObjectId('5fc11a27db5ad27a0860af23') })
  closedAuction.endAt = new Date()
  await docs.auctions().replaceOne({ _id: closedAuction._id }, closedAuction)
  
  return res.status(200).json(auctions)
}