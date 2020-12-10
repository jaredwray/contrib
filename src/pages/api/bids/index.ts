import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from 'services/mongodb'
import { AutoBidder, getMaxBidErrorMessage } from 'services/autobidder'
import { getSession } from 'next-auth/client'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).end('Method Not Allowed')
    }

    try {
        // Check session
        const session = await getSession({ req })
        if (session === null)
            return res.status(401).json({ statusCode: 422, message: 'User not authenticated'})
        const buyerUserId = new ObjectId(session.user['id'])

        // Check parameters
        const { auctionId, maxPrice } = req.body 
        if (Array.isArray(auctionId) || !ObjectId.isValid(auctionId))
            return res.status(422).json({ statusCode: 422, message: 'Malformed auctionId (expected 24 character hex)'})
        if (Array.isArray(maxPrice) || !Number.isInteger(maxPrice))
            return res.status(422).json({ statusCode: 422, message: 'Malformed maxPrice (expected integer)'})        

        // Place bid
        const { docs } = await connectToDatabase()
        const autoBidder = new AutoBidder(docs)    
        const result = autoBidder.PlaceMaxBid(new ObjectId(auctionId), Number.parseInt(maxPrice, 10), buyerUserId)
        if (typeof result === 'string')
            return res.status(400).json({ statusCode: 400, message: getMaxBidErrorMessage(result) })

        return res.status(200).json({ result })
    } catch (err) {
        return res.status(500).json({ statusCode: 500, message: err.message })
    }
}