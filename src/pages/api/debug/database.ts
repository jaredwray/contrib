import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'utils/mongodb'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { docs } = await connectToDatabase()

  const collections = (await docs._db.listCollections().toArray()).map(c => ({
    name: c.name,
    count: 0
  }))

  for(const collection of collections)
    collection.count = await docs._db.collection(collection.name).count()

  res.status(200).json(collections)
}