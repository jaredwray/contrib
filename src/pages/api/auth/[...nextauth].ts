import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  database: process.env.MONGODB_URI,
  providers: [
    Providers.Facebook({
      clientId: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET
    }),
    Providers.Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: process.env.SESSION_SECRET,
  session: {
    jwt: false
  },
  callbacks: {
    session: async (session, user) => {
      session.user['id'] = user['id']
      return Promise.resolve(session)
    }
  }
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)