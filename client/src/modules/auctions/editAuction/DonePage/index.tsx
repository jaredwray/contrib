/* eslint-disable react/jsx-sort-props */
import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { ProgressBar } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
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

  const encodedLink = encodeURIComponent(`${window.location.origin}/auctions/${auctionId}`);

  if (!auction) {
    return null;
  }

  return (
    <Layout>
      {auction && (
        <Helmet defer={true}>
          {<meta property="og:url" content={encodedLink} />}
          {<meta property="og:type" content="article" />}
          {<meta property="og:image:height" content="400" />}
          {<meta property="og:image:width" content="400" />}
          {auction.title && <meta property="og:title" content={auction.title} />}
          {auction.description && <meta property="og:description" content={auction.description} />}
          {auction.attachments[0]?.url && <meta property="og:image:url" content={auction.attachments[0]?.url} />}
          {auction.attachments[0]?.url && <meta property="og:image:secure_url" content={auction.attachments[0]?.url} />}
          {/* <meta name="twitter:title" content={auction.title} />
          <meta name="twitter:description" content={auction.description} />
          <meta name="twitter:image" content={auction.attachments[0]?.url} />
          <meta name="twitter:url" content={encodedLink} /> */}
        </Helmet>
      )}
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
                href={`https://www.facebook.com/sharer.php?s=100&p[url]=${encodedLink}`}
                icon={<FacebookIcon />}
                service="Facebook"
              />
              <ShareButton
                href={`https://twitter.com/intent/tweet?url=${encodedLink}`}
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
