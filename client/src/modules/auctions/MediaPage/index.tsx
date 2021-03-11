import { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useHistory, useParams } from 'react-router-dom';

import { updateAuctionMedia } from 'src/apollo/queries/auctions';
import AddPhotoIcon from 'src/assets/images/ProtoIcon';
import AddVideoIcon from 'src/assets/images/VideoIcon';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';

import Row from '../common/Row';
import StepByStepRow from '../common/StepByStepRow';
import StepHeader from '../common/StepHeader';
import styles from './styles.module.scss';

const EditAuctionMediaPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const [updateAuction, { data, loading: updating }] = useMutation(updateAuctionMedia, {
    onError(error) {
      console.log(error);
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: ([file]) =>
      updateAuction({
        variables: { id: auctionId, file },
      }),
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
        <Form initialValues={{ photo: null, video: null }} onSubmit={handleSubmit}>
          <Container className={styles.root}>
            <StepHeader step="2" title="Photos & video" />

            <Row
              description="Provide a number of photos that show the item off from a couple of angles as well as any standout markings, signatures, etc."
              title="Photos"
            >
              <div {...getRootProps({ className: 'dropzone' })} className={styles.dropzone}>
                <input {...getInputProps()} name="photo" />
                <AddPhotoIcon className="mb-2" />
                <p className="text-center">
                  Drag photos here or
                  <br />
                  click to upload
                </p>
              </div>
            </Row>
            <Row
              description="Provide a single video (perferably portrait mode) that shows the item off and talks to what makes it special."
              title="Video"
            >
              <div {...getRootProps({ className: 'dropzone' })} className={styles.dropzone}>
                <input {...getInputProps()} name="video" />
                <AddVideoIcon className="mb-2" />
                <p className="text-center">
                  Drag video here or
                  <br />
                  click to upload
                </p>
              </div>
            </Row>
          </Container>

          <StepByStepRow loading={updating} nextAction={handleSubmit} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionMediaPage;
