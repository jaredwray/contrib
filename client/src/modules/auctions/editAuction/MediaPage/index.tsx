import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { GetAuctionMedia } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';
import { AuctionAttachment } from 'src/types/Auction';

import Row from '../common/Row';
import StepHeader from '../common/StepHeader';
import AttachmentsStateInterface from './common/AttachmentsStateInterface';
import Dialog from './Dialog';
import styles from './styles.module.scss';
import UploadingDropzone from './UploadingDropzone';

const EditAuctionMediaPage = () => {
  const { addToast } = useToasts();
  const [selectedAttachment, setSelectedAttachment] = useState<AuctionAttachment | null>(null);
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const [attachments, setAttachments] = useState<AttachmentsStateInterface>({
    uploaded: [],
    loading: [],
  });
  const { data: auctionData } = useQuery(GetAuctionMedia, { variables: { id: auctionId } });

  useEffect(() => {
    if (!auctionData) return;

    setAttachments((prevState: any) => {
      return {
        ...prevState,
        uploaded: auctionData.auction.attachments,
        loading: [],
      };
    });
  }, [auctionData]);

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/basic`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(() => {
    history.push(`/auctions/${auctionId}/details`);
  }, [auctionId, history]);

  const closeModal = useCallback(() => {
    setSelectedAttachment(null);
  }, [setSelectedAttachment]);

  const description = (
    <>
      <p>
        Provide a number of photos that show the item off from a couple of angles as well as any standout markings,
        signatures, etc.
      </p>
      <p>
        Provide a single video (preferably portrait mode) that shows the item off and talks to what makes it special.
      </p>
    </>
  );

  return (
    <Layout>
      <ProgressBar now={50} />
      <section className={styles.section}>
        <Form initialValues={{ photos: [], videos: [] }} onSubmit={handleSubmit}>
          <Container>
            <StepHeader step="2" title="Photos & video" />
            <Dialog closeModal={closeModal} selectedAttachment={selectedAttachment} />
            <Row childrenWrapperCLassName={styles.dropzoneWrapper} description={description}>
              <UploadingDropzone
                accepted=".png, .jpeg, .jpg, .webp, .mp4, .webm, .opgg, .mov"
                attachments={attachments}
                auctionId={auctionId}
                name="image and video"
                setAttachments={setAttachments}
                setErrorMessage={(message) => addToast(message, { autoDismiss: true, appearance: 'warning' })}
                setSelectedAttachment={setSelectedAttachment}
              />
            </Row>
          </Container>

          <StepByStepRow loading={!!attachments?.loading.length} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionMediaPage;
