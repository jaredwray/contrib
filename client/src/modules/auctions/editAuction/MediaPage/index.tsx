import { useCallback, useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionMedia } from 'src/apollo/queries/auctions';
import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import AddVideoIcon from 'src/assets/images/VideoIcon';
import Form from 'src/components/Form/Form';
import FormUpdateMessages from 'src/components/FormUpdateMessages';
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
  const [selectedAttachment, setSelectedAttachment] = useState<AuctionAttachment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const [attachments, setAttachments] = useState<AttachmentsStateInterface>({
    images: {
      uploaded: [],
      loading: [],
    },
    videos: {
      uploaded: [],
      loading: [],
    },
  });
  const { data: auctionData } = useQuery(GetAuctionMedia, {
    variables: { id: auctionId },
  });

  useEffect(() => {
    if (!auctionData) return;

    const hash = {
      IMAGE: [] as AuctionAttachment[],
      VIDEO: [] as AuctionAttachment[],
    };

    auctionData.auction.attachments.forEach((item: AuctionAttachment) => {
      const type = item.type as 'IMAGE' | 'VIDEO';
      hash[type] = hash[type].concat([item]);
    });

    setAttachments((prevState: any) => {
      return {
        ...prevState,
        images: {
          uploaded: hash.IMAGE,
          loading: [],
        },
        videos: {
          uploaded: hash.VIDEO,
          loading: [],
        },
      };
    });
  }, [auctionData]);

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/basic`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    (values) => {
      history.push(`/auctions/${auctionId}/details`);
    },
    [auctionId, history],
  );

  const closeModal = useCallback(() => {
    setSelectedAttachment(null);
  }, [setSelectedAttachment]);

  return (
    <Layout>
      <ProgressBar now={50} />
      <section className={styles.section}>
        <Form initialValues={{ photos: [], videos: [] }} onSubmit={handleSubmit}>
          <FormUpdateMessages errorMessage={errorMessage} />
          <Container>
            <StepHeader step="2" title="Photos & video" />
            <Dialog closeModal={closeModal} selectedAttachment={selectedAttachment} />
            <Row
              childrenWrapperCLassName={styles.dropzoneWrapper}
              description="Provide a number of photos that show the item off from a couple of angles as well as any standout markings, signatures, etc."
              title="Photos"
            >
              <UploadingDropzone
                accepted={'.png,.jpeg,.jpg,.webp'}
                attachments={attachments.images}
                attachmentsType={'images'}
                auctionId={auctionId}
                icon={<AddPhotoIcon />}
                name={'photos'}
                setAttachments={setAttachments}
                setErrorMessage={setErrorMessage}
                setSelectedAttachment={setSelectedAttachment}
              />
            </Row>

            <Row
              childrenWrapperCLassName={styles.dropzoneWrapper}
              description="Provide a single video (preferably portrait mode) that shows the item off and talks to what makes it special."
              title="Video"
            >
              <UploadingDropzone
                accepted={'.mp4,.webm,.opgg'}
                attachments={attachments.videos}
                attachmentsType={'videos'}
                auctionId={auctionId}
                icon={<AddVideoIcon />}
                name={'video'}
                setAttachments={setAttachments}
                setErrorMessage={setErrorMessage}
                setSelectedAttachment={setSelectedAttachment}
              />
            </Row>
          </Container>

          <StepByStepRow
            loading={!!(attachments?.images.loading.length || attachments?.videos.loading.length)}
            prevAction={handlePrevAction}
          />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionMediaPage;
