import { FC } from 'react';

import AuctionCard from 'src/components/customComponents/AuctionCard';
import { NoAuctionsInfo } from 'src/components/customComponents/AuctionsStatusInfo/NoAuctionsInfo';
import { ProfileSliderRow } from 'src/components/wrappers/ProfileSliderRow';
import { profileAuctionsHash } from 'src/helpers/profileAuctionsHash';
import { Auction } from 'src/types/Auction';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

interface Props {
  auctions: Auction[];
  draftAuctions: Auction[];
  influencer: InfluencerProfile;
  isShowDraftAndStopped: boolean;
  onDeleteDraftAuctions: (auction: Auction) => void;
}

export const InfluencerAuctionsInfo: FC<Props> = ({
  auctions,
  draftAuctions,
  influencer,
  isShowDraftAndStopped,
  onDeleteDraftAuctions,
}) => {
  const profileAuctions = profileAuctionsHash(auctions);

  const liveAuctions = profileAuctions.ACTIVE;
  const pastAuctions = [...profileAuctions.SETTLED, ...profileAuctions.SOLD];
  const stoppedAuctions = profileAuctions.STOPPED;

  const liveAuctionsCards = liveAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const draftAuctionsCards = draftAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} onDelete={onDeleteDraftAuctions} />
  ));
  const stoppedAuctionsCards = stoppedAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));
  const pastAuctionsCards = pastAuctions.map((auction: Auction) => (
    <AuctionCard key={auction.id} auction={auction} auctionOrganizer={influencer} />
  ));

  if (auctions.length === 0) return <NoAuctionsInfo name={influencer.name} />;

  return (
    <>
      {Boolean(liveAuctions.length) && (
        <ProfileSliderRow items={liveAuctionsCards}>{influencer.name}'s live auctions</ProfileSliderRow>
      )}
      {isShowDraftAndStopped && (
        <>
          {Boolean(draftAuctions.length) && (
            <ProfileSliderRow items={draftAuctionsCards}>{influencer.name}'s draft auctions</ProfileSliderRow>
          )}
          {Boolean(stoppedAuctions.length) && (
            <ProfileSliderRow items={stoppedAuctionsCards}>{influencer.name}'s stopped auctions</ProfileSliderRow>
          )}
        </>
      )}
      {Boolean(pastAuctions.length) && (
        <ProfileSliderRow items={pastAuctionsCards}>{influencer.name}'s ended auctions</ProfileSliderRow>
      )}
    </>
  );
};
