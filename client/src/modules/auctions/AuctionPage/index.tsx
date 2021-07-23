/* eslint-disable react/jsx-sort-props */
import { useContext, useEffect, useState, useCallback } from 'react';

import { useLazyQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { AuctionQuery } from 'src/apollo/queries/auctions';
import AttachmentModal from 'src/components/AttachmentModal';
import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { AuctionAttachment } from 'src/types/Auction';
import { CharityStatus } from 'src/types/Charity';

import About from './About';
import AttachmentsSlider from './AttachmentsSlider';
import AuctionDetails from './AuctionDetails';
import Author from './Author';
import Benefits from './Benefits';
import SimilarAuctions from './SimilarAuctions';

const AuctionPage = () => {
  const [attachmentToDisplay, setAttachmentToDisplay] = useState<AuctionAttachment | null>(null);
  const auctionId = useParams<{ auctionId: string }>().auctionId ?? 'me';
  const history = useHistory();
  const { account } = useContext(UserAccountContext);

  const [executeAuctionQuery, { data: auctionData, error }] = useLazyQuery(AuctionQuery, {
    variables: { id: auctionId },
  });
  useEffect(() => {
    executeAuctionQuery();
  }, [executeAuctionQuery]);

  const auction = auctionData?.auction;
  const isActiveCharity = auction?.charity?.status === CharityStatus.ACTIVE;

  const closeModal = useCallback(() => {
    setAttachmentToDisplay(null);
  }, [setAttachmentToDisplay]);

  const onAttachmentClick = useCallback(
    (attachment: AuctionAttachment) => {
      if (attachment.type === 'IMAGE') {
        setAttachmentToDisplay(attachment);
      }
    },
    [setAttachmentToDisplay],
  );

  if (error || !auction) {
    return null;
  }
  const isMyProfile = [account?.influencerProfile?.id, account?.assistant?.influencerId].includes(
    auction.auctionOrganizer.id,
  );

  if (!account?.isAdmin && !isMyProfile && (auction?.isDraft || auction?.isStopped)) {
    history.push(`/`);
  }
  const attachments = [...auction?.attachments].sort((a, b) => (a.type > b.type ? -1 : 1));
  setPageTitle(`${auction.title} auction`);

  return (
    <Layout>
      <Container className="pt-0 pt-md-5 pb-0 pb-md-5">
        <Row>
          <Col md="1" />
          <Col md="6">
            <AttachmentsSlider attachments={attachments} onAttachmentClick={onAttachmentClick} />
          </Col>
          <Col md="1" />
          <Col md="4">
            <AuctionDetails auction={auction} executeQuery={executeAuctionQuery} />
          </Col>
          <Col md="1" />
        </Row>
        <AttachmentModal closeModal={closeModal} attachment={attachmentToDisplay} />
        <Row>
          <Col md="1" />
          <Col md="6">
            <Author {...auction.auctionOrganizer} />
            <About {...auction} />
            {(auction?.charity && account?.isAdmin) || isActiveCharity ? (
              <Benefits {...auction.charity} />
            ) : (
              <p className="pb-2 d-md-none" />
            )}
          </Col>
          <Col md="7" />
        </Row>
      </Container>
      <SimilarAuctions />
    </Layout>
  );
};

export default AuctionPage;
