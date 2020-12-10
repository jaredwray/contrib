import { ObjectID } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'services/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET')
        return res.status(405).end('Method Not Allowed')
    }
    
    const {
        query: { id }
    } = req
    try {
        if (Array.isArray(id) || !ObjectID.isValid(id))
            return res.status(422).json({ statusCode: 422, message: 'Malformed auctionId (expected 24 character hex)'})

        const { docs } = await connectToDatabase()
        const auction = await docs.auctions().findOne({_id: new ObjectID(id)})
        return res.status(200).json(auction)
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message })
    }
}