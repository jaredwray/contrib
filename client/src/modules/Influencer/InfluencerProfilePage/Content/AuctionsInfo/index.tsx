import { FC } from 'react';

import { NoAuctionsInfo } from 'src/components/customComponents/AuctionsStatusInfo/NoAuctionsInfo';
import AuctionsList from 'src/components/wrappers/AuctionsList';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

interface Props {
  auctions: Auction[];
  draftAuctions: Auction[];
  influencer: InfluencerProfile;
  showDraftAndStopped: boolean;
  onDeleteDraftAuctions: (auction: Auction) => void;
}

const AuctionsInfo: FC<Props> = ({
  auctions,
  draftAuctions,
  influencer,
  showDraftAndStopped,
  onDeleteDraftAuctions,
}) => {
  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = [...profileAuctions.SETTLED, ...profileAuctions.SOLD];
  const stoppedAuctions = profileAuctions.STOPPED;

  if (auctions.length === 0) return <NoAuctionsInfo name={influencer.name} />;

  return (
    <>
      <AuctionsList auctions={liveAuctions} label={`${influencer.name}'s live auctions`} />
      {showDraftAndStopped && (
        <>
          <AuctionsList auctions={draftAuctions} label={`${influencer.name}'s draft auctions`} />
          <AuctionsList auctions={stoppedAuctions} label={`${influencer.name}'s stopped auctions`} />
        </>
      )}
      <AuctionsList auctions={pastAuctions} label={`${influencer.name}'s ended auctions`} />
    </>
  );
};

export default AuctionsInfo;
