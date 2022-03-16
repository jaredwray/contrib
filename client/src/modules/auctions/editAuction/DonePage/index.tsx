import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Container, ProgressBar } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import AuctionCard from 'src/components/customComponents/AuctionCard';
import CopiedText from 'src/components/forms/inputs/CopiedText';
import Layout from 'src/components/layouts/Layout';
import { getShortLink } from 'src/helpers/getShortLink';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

const AuctionDonePage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const { data: auctionData } = useQuery<{ auction: Auction }>(AuctionQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;

  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction?.status === 'DRAFT') {
    history.replace('/');
    return null;
  }
  if (auction === undefined) return null;

  const auctionLink = auction?.bitlyLink || getShortLink(auction.shortLink.slug);

  setPageTitle(`Auction ${auction.title}`);

  return (
    <Layout>
      <ProgressBar now={100} />
      <Container fluid="xxl">
        <div className={styles.contentWrapper}>
          <div className={clsx(styles.content, styles.contentLeft)}>
            <div className={styles.contentRightWrapper}>
              <p className="text-super">Done</p>
              <p className="text-headline">Auction created.</p>
              <p className="text--body">
                Awesome! Let everyone know about this auction by using the link below and sharing it on your social
                networks with the videos and photos you provided.
              </p>
              <div className="pt-3 pt-md-5 pb-3 pb-md-5 w-100">
                <CopiedText text={auctionLink} />
              </div>
            </div>
          </div>
          <div className={clsx(styles.content, styles.contentRight)}>
            {<AuctionCard isDonePage auction={auction} />}
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default AuctionDonePage;
