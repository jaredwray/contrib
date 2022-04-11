import { FC } from 'react';

import { NoAuctionsInfo } from 'src/components/customComponents/AuctionsStatusInfo/NoAuctionsInfo';
import AuctionsList from 'src/components/wrappers/AuctionsList';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import { Auction } from 'src/types/Auction';

interface Props {
  auctions: Auction[];
  name: string;
}

const AuctionsInfo: FC<Props> = ({ auctions, name }) => {
  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = [...profileAuctions.SETTLED, ...profileAuctions.SOLD];

  if (auctions.length === 0) return <NoAuctionsInfo name={name} />;

  return (
    <>
      <AuctionsList auctions={liveAuctions} label={`Live auctions benefiting ${name}`} />
      <AuctionsList auctions={pastAuctions} label={`Ended auctions benefiting ${name}`} />
    </>
  );
};
export default AuctionsInfo;
