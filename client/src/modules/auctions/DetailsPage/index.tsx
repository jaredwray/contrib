import { useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Button, ButtonGroup, Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { getAuctionDetails, updateAuctionDetails } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';
import MoneyField from 'src/components/Form/MoneyField';
import Layout from 'src/components/Layout';

import Row from '../common/Row';
import StepByStepRow from '../common/StepByStepRow';
import StepHeader from '../common/StepHeader';
import StartDateField from './StartDateField';
import styles from './styles.module.scss';

const EditAuctionDetailsPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData } = useQuery(getAuctionDetails, {
    variables: { id: auctionId },
  });
  const [updateAuction, { loading: updating }] = useMutation(updateAuctionDetails, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/done`);
    },
    onError(error) {
      console.log(error);
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/media`);
  }, []);

  const handleSubmit = useCallback((values) => {
    // updateAuction({ variables: { id: auctionId, ...values } });
  }, []);

  if (loadingQuery) {
    return null;
  }

  return (
    <Layout>
      <ProgressBar now={75} />

      <section className={styles.section}>
        <Form initialValues={auctionData?.auction} onSubmit={handleSubmit}>
          <Container className={styles.root}>
            <StepHeader step="3" title="Details" />

            <Row
              description="The starting price for the item which determines the minimum amount that can be bid. The item will not sell if no bids at or above this price are received."
              title="Starting price"
            >
              <MoneyField name="initialPrice" />
            </Row>

            <Row description="The day and time your auction will start." title="Start date & time">
              {/* <InputField name="startDate" type="date" />
              <div className="d-flex">
                <InputField name="startDate" type="time" />

                <ButtonGroup aria-label="First group" className="mr-2">
                  <Button>AM</Button> <Button>PM</Button>
                </ButtonGroup>
              </div> */}
              <StartDateField name="startDate" />
            </Row>
            <Row description="How long the auction should run for." title="Duration"></Row>
            <Row description="What charity will benefit from the proceeds of this auction." title="Charity"></Row>
          </Container>

          <StepByStepRow last loading={updating} nextAction={handleSubmit} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionDetailsPage;
