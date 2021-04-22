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
import { toFullHumanReadableDatetime } from 'src/helpers/timeFormatters';
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

  const [titleCopied, setTitleCopied] = useState(false);
  const [descriptionCopied, setDescriptionCopied] = useState(false);
  const [dateCopied, setDateCopied] = useState(false);

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

      <Modal show={showInstagramInstructions} onHide={toggleShowInstagramInstructions}>
        <Modal.Header>
          <Modal.Title>Use following content to create an Instagram post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="d-block">Auction Title</Form.Label>
              <InputGroup>
                <Form.Control disabled type="text" value={auction.title} />
                <InputGroup.Append>
                  <CopyToClipboard text={auction.title} onCopy={() => setTitleCopied(true)}>
                    <Button type="button">{(titleCopied && 'Copied') || 'Copy'}</Button>
                  </CopyToClipboard>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <Form.Label className="d-block">Description</Form.Label>
              <InputGroup>
                <Form.Control disabled type="text" value={auction.description} />
                <InputGroup.Append>
                  <CopyToClipboard text={auction.description} onCopy={() => setDescriptionCopied(true)}>
                    <Button type="button">{(descriptionCopied && 'Copied') || 'Copy'}</Button>
                  </CopyToClipboard>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <Form.Label className="d-block">Starts at</Form.Label>
              <InputGroup>
                <Form.Control disabled type="text" value={toFullHumanReadableDatetime(auction.startDate) || ''} />
                <InputGroup.Append>
                  <CopyToClipboard
                    text={toFullHumanReadableDatetime(auction.startDate) || ''}
                    onCopy={() => setDateCopied(true)}
                  >
                    <Button type="button">{(dateCopied && 'Copied') || 'Copy'}</Button>
                  </CopyToClipboard>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            {Boolean(auction.attachments.length) && (
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <img
                  alt={auction.title}
                  className="w-100"
                  src={auction.attachments[0].cloudflareUrl || auction.attachments[0].url}
                />
              </Form.Group>
            )}

            <Button block type="button" variant="secondary" onClick={toggleShowInstagramInstructions}>
              Close
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Layout>
  );
};

export default AuctionDonePage;
