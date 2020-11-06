import { Collection, Db } from 'mongodb'
import { Athlete } from './athlete'
import { Auction } from './auction'
import { Charity } from './charity'

export class ContribDocuments {
  _db: Db

  constructor(db: Db) {
    this._db = db
  }

  atheletes(): Collection<Athlete> {
    return this._db.collection('athletes') as Collection<Athlete>
  }

  auctions(): Collection<Auction> {
    return this._db.collection('auctions') as Collection<Auction>
  }

  charities(): Collection<Charity> {
    return this._db.collection('charities') as Collection<Charity>
  }
}
