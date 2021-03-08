import { useCallback } from 'react';

import { Container, Form as RbForm, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';

import Row from '../common/Row';
import StepByStepRow from '../common/StepByStepRow';
import StepHeader from '../common/StepHeader';
import styles from './styles.module.scss';

const EditAuctionMediaPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/basic`);
  }, []);

  const handleSubmit = useCallback((values) => {
    console.log(values);
    history.push(`/auctions/${auctionId}/details`);
  }, []);

  return (
    <Layout>
      <ProgressBar now={50} />

      <section className={styles.section}>
        <Form initialValues={{ photo: null, video: null }} onSubmit={handleSubmit}>
          <Container className={styles.root}>
            <StepHeader step="2" title="Photos & video" />

            <Row
              description="Provide a number of photos that show the item off from a couple of angles as well as any standout
                  markings, signatures, etc."
              title="Photos"
            >
              <RbForm.File
                feedbackTooltip
                className="position-relative"
                id="validationFormik107"
                label="photo"
                name="photo"
                onChange={console.log}
              />
            </Row>
            <Row
              description="Provide a single video (perferably portrait mode) that shows the item off and talks to what makes it
                  special."
              title="Video"
            >
              <RbForm.File
                feedbackTooltip
                className="position-relative"
                id="validationFormik107"
                label="video"
                name="video"
                onChange={console.log}
              />
            </Row>
          </Container>

          <StepByStepRow loading={false} nextAction={handleSubmit} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionMediaPage;
