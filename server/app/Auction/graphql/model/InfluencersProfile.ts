import { InfluencerProfile } from '../../../Influencer/dto/InfluencerProfile';
import { Auction } from '../../dto/Auction';

export interface Influencer extends InfluencerProfile {
  auctions: Auction[];
}
