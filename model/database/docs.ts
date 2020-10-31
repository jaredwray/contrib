import { Collection, Db } from 'mongodb'
import { Auction } from './auction'

export class ContribDocuments {
  _db: Db

  constructor(db: Db) {
    this._db = db;
  }

  auctions(): Collection<Auction> {
    return this._db.collection('auctions') as Collection<Auction>;
  }
}
