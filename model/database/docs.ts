import { Collection, Db } from 'mongodb'
import { Athlete } from './athlete'
import { Auction } from './auction'
import { Bid } from './bid'
import { Charity } from './charity'
import { Watch } from './watch'

// Primary strongly-typed version of MongoDB 'Db' option to facilitate better
// typescript.
export class ContribDocuments {
  _db: Db

  constructor(db: Db) {
    this._db = db
  }

  athletes(): Collection<Athlete> {
    return this._db.collection('athletes') as Collection<Athlete>
  }

  auctions(): Collection<Auction> {
    return this._db.collection('auctions') as Collection<Auction>
  }

  bids(): Collection<Bid> {
    return this._db.collection('bids') as Collection<Bid>
  }

  charities(): Collection<Charity> {
    return this._db.collection('charities') as Collection<Charity>
  }

  watches(): Collection<Watch> {
    return this._db.collection('watches') as Collection<Watch>
  }
}
