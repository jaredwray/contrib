import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { format, toDate } from 'date-fns-tz';
import { ProgressBar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import FacebookIcon from 'src/assets/images/Facebook';
import InstagramIcon from 'src/assets/images/Instagram';
import TwitterIcon from 'src/assets/images/Twitter';
import AuctionCard from 'src/components/AuctionCard';
import Layout from 'src/components/Layout';

import ShareButton from './ShareButton';
import styles from './styles.module.scss';

const AuctionDonePage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const { data: auctionData } = useQuery(AuctionQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;

  if (!auction) {
    return null;
  }

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
            <div className="pt-2 pt-sm-5">
              <ShareButton icon={<TwitterIcon />} service="Twitter" />
              <ShareButton icon={<FacebookIcon />} service="Facebook" />
              <ShareButton icon={<InstagramIcon />} service="Instagram" />
            </div>
          </div>
        </div>
        <div className={clsx(styles.content, styles.contentRight)}>
          {
            <AuctionCard
              horizontalOnMobile
              auction={auction}
              footer={`starts on ${format(toDate(auction.startDate), 'M.d.yy @ hh:mm aa x')}`}
            />
          }
        </div>
      </div>
    </Layout>
  );
};

export default AuctionDonePage;
