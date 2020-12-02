import { Collection, Db } from 'mongodb'
import { Account } from './account'
import { Athlete } from './athlete'
import { Auction } from './auction'
import { MaxBid } from './maxbid'
import { Charity } from './charity'
import { User } from './user'
import { Watch } from './watch'
import { HighBid as HighBid } from './highbid'

// Primary strongly-typed version of MongoDB 'Db' option to facilitate TypeScript.
export class ContribDocuments {
  _db: Db

  constructor(db: Db) {
    this._db = db
  }

  accounts(): Collection<Account> {
    return this._db.collection('accounts') as Collection<Account>
  }

  athletes(): Collection<Athlete> {
    return this._db.collection('athletes') as Collection<Athlete>
  }

  auctions(): Collection<Auction> {
    return this._db.collection('auctions') as Collection<Auction>
  }

  highBids(): Collection<HighBid> {
    return this._db.collection('highBids') as Collection<HighBid>
  }

  charities(): Collection<Charity> {
    return this._db.collection('charities') as Collection<Charity>
  }

  maxBids(): Collection<MaxBid> {
    return this._db.collection('maxBids') as Collection<MaxBid>
  }

  users(): Collection<User> {
    return this._db.collection('users') as Collection<User>
  }

  watches(): Collection<Watch> {
    return this._db.collection('watches') as Collection<Watch>
  }
}
