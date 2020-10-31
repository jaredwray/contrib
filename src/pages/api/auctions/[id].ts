import { ObjectID } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../util/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        res.status(405).end('Method Not Allowed');
    } else {
        const {
            query: { id }
        } = req;
        try {
            const { docs } = await connectToDatabase();

            const auction = await docs.auctions().findOne({_id: new ObjectID(id.toString())})

            res.status(200).json(auction);
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    }
}