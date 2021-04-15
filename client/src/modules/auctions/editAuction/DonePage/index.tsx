/* eslint-disable react/jsx-sort-props */
import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { ProgressBar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import FacebookIcon from 'src/assets/images/Facebook';
import InstagramIcon from 'src/assets/images/Instagram';
import TwitterIcon from 'src/assets/images/Twitter';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';
import { Auction } from 'src/types/Auction';

import ShareButton from './ShareButton';
import styles from './styles.module.scss';

const AuctionDonePage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { data: auctionData } = useQuery<{ auction: Auction }>(AuctionQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;

  if (!auction) {
    return null;
  }

  const encodedAuctionLink = encodeURIComponent(auction.link);

  return (
    <Layout>
      <ProgressBar now={100} />
      <div className={styles.contentWrapper}>
        <div className={clsx(styles.content, styles.contentLeft)}>
          <div className={styles.contentRightWrapper}>
            <p className="text-super">Done</p>
            <p className="text-headline">Auction created.</p>
            <p className="text--body">
              Thank you! Your listing is now viewable and will start at the specified time. Now, let everyone know about
              the auction.
            </p>
            <div className="pt-3 pt-md-5">
              <ShareButton
                href={`https://www.facebook.com/sharer.php?s=100&p[url]=${encodedAuctionLink}`}
                icon={<FacebookIcon />}
                service="Facebook"
              />
              <ShareButton
                href={`https://twitter.com/intent/tweet?url=${encodedAuctionLink}`}
                icon={<TwitterIcon />}
                service="Twitter"
              />
              <ShareButton href="#" icon={<InstagramIcon />} service="Instagram" />
            </div>
          </div>
        </div>
        <div className={clsx(styles.content, styles.contentRight)}>{<AuctionCard isDonePage auction={auction} />}</div>
      </div>
    </Layout>
  );
};

export default AuctionDonePage;
