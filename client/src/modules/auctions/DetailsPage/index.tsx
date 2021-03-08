import { useCallback } from 'react';

import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';

import Row from '../common/Row';
import StepByStepRow from '../common/StepByStepRow';
import StepHeader from '../common/StepHeader';
import styles from './styles.module.scss';

const EditAuctionDetailsPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/details`);
  }, []);

  const handleSubmit = useCallback((values) => {
    console.log(values);
    history.push(`/auctions/${auctionId}/done`);
  }, []);
  return (
    <Layout>
      <ProgressBar now={75} />

      <section className={styles.section}>
        <Form initialValues={{ photo: null, video: null }} onSubmit={handleSubmit}>
          <Container className={styles.root}>
            <StepHeader step="3" title="Details" />

            <Row
              description="The starting price for the item which determines the minimum amount that can be bid. The item will not
                  sell if no bids at or above this price are received."
              title="Starting price"
            ></Row>

            <Row description="The day and time your auction will start." title="Start date & time"></Row>
            <Row description="How long the auction should run for." title="Duration"></Row>
            <Row description="What charity will benefit from the proceeds of this auction." title="Charity"></Row>
          </Container>

          <StepByStepRow last loading={false} nextAction={handleSubmit} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionDetailsPage;
