import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'utils/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        res.status(405).end('Method Not Allowed')
    } else {
        try {
            const { docs } = await connectToDatabase()
            const auctions = await docs.auctions()
                .find({})
                .limit(20)
                .toArray()
            res.status(200).json({ auctions })
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message })
        }
    }
}