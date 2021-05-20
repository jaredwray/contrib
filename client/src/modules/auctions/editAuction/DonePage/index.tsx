import React, { useCallback, useState } from 'react';

import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Button, InputGroup, Form, Modal, ProgressBar } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
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

  const [showInstagramInstructions, setShowInstagramInstructions] = useState(false);

  const toggleShowInstagramInstructions = useCallback(() => {
    setShowInstagramInstructions((showing) => !showing);
  }, [setShowInstagramInstructions]);

  const [linkCopied, setLinkCopied] = useState(false);

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
              <ShareButton icon={<InstagramIcon />} service="Instagram" onClick={toggleShowInstagramInstructions} />
            </div>
          </div>
        </div>

        <div className={clsx(styles.content, styles.contentRight)}>{<AuctionCard isDonePage auction={auction} />}</div>
      </div>
      <div className="modalWrapper">
        <Modal centered show={showInstagramInstructions} onHide={toggleShowInstagramInstructions}>
          <Modal.Header>
            <Modal.Title>Use following content to create an Instagram post</Modal.Title>
          </Modal.Header>
          <Modal.Body className="modalWrapper">
            <Form>
              <Form.Group>
                <Form.Label className="d-block">Auction link</Form.Label>
                <InputGroup>
                  <Form.Control disabled type="text" value={auction.link} />
                  <InputGroup.Append>
                    <CopyToClipboard text={auction.link} onCopy={() => setLinkCopied(true)}>
                      <Button type="button">{(linkCopied && 'Copied') || 'Copy'}</Button>
                    </CopyToClipboard>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              <Button block type="button" variant="secondary" onClick={toggleShowInstagramInstructions}>
                Close
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </Layout>
  );
};

export default AuctionDonePage;
