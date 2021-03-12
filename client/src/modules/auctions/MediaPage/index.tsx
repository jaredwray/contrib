import { useCallback, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionMedia, UpdateAuctionMedia } from 'src/apollo/queries/auctions';
import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import AddVideoIcon from 'src/assets/images/VideoIcon';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import { AuctionAttachment } from 'src/types/Auction';

import Row from '../common/Row';
import StepByStepRow from '../common/StepByStepRow';
import StepHeader from '../common/StepHeader';
import AttachmentPreview from './AttachmentPreview';
import styles from './styles.module.scss';
import UploadingDropzone from './UploadingDropzone';

const EditAuctionMediaPage = () => {
  const [attachments, setAttachments] = useState({
    images: [],
    videos: [],
  });

  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const { data: auctionData } = useQuery(GetAuctionMedia, {
    variables: { id: auctionId },
  });

  const assignAttachments = (array: AuctionAttachment[]) => {
    if (!array) return;

    const hash = {} as any;

    array.forEach((item: AuctionAttachment) => {
      hash[item.type] = (hash[item.type] || []).concat([item]);
    });

    setAttachments((prevState: any) => {
      return { ...prevState, images: hash['IMAGE'] || [], videos: hash['VIDEO'] || [] };
    });
  };

  useEffect(() => {
    assignAttachments(auctionData?.auction.attachments);
  }, [auctionData]);

  const [updateAuctionMedia, { loading: updating }] = useMutation(UpdateAuctionMedia, {
    onError(error) {
      // TODO: show error
      console.log(error);
    },
    onCompleted(data: any) {
      assignAttachments(data.addAuctionAttachment.attachments);
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/basic`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    (values) => {
      history.push(`/auctions/${auctionId}/details`);
    },
    [auctionId, history],
  );

  return (
    <Layout>
      <ProgressBar now={50} />

      <section className={styles.section}>
        <Form initialValues={{ photos: [], videos: [] }} onSubmit={handleSubmit}>
          <Container>
            <StepHeader step="2" title="Photos & video" />

            <Row
              childrenWrapperCLassName={styles.dropzoneWrapper}
              description="Provide a number of photos that show the item off from a couple of angles as well as any standout markings, signatures, etc."
              title="Photos"
            >
              <div id="images">
                {attachments.images.map((attachment: AuctionAttachment, index: number) => (
                  <AttachmentPreview
                    key={index}
                    assignAttachments={assignAttachments}
                    attachment={attachment}
                    auctionId={auctionId}
                  />
                ))}
              </div>
              <UploadingDropzone
                accepted={'.png,.jpeg,.jpg,.webp'}
                auctionId={auctionId}
                icon={<AddPhotoIcon className="mb-2" />}
                name={'photos'}
                updateAuctionMedia={updateAuctionMedia}
              />
            </Row>

            <Row
              childrenWrapperCLassName={styles.dropzoneWrapper}
              description="Provide a single video (preferably portrait mode) that shows the item off and talks to what makes it special."
              title="Video"
            >
              <div id="videos">
                {attachments.videos.map((attachment: AuctionAttachment, index: number) => (
                  <AttachmentPreview
                    key={index}
                    assignAttachments={assignAttachments}
                    attachment={attachment}
                    auctionId={auctionId}
                  />
                ))}
              </div>
              <UploadingDropzone
                accepted={'.mp4,.webm,.opgg'}
                auctionId={auctionId}
                icon={<AddVideoIcon className="mb-2" />}
                name={'videos'}
                updateAuctionMedia={updateAuctionMedia}
              />
            </Row>
          </Container>

          <StepByStepRow loading={updating} nextAction={handleSubmit} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionMediaPage;
