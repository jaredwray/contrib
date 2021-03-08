import { useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { updateAuctionBasics, getAuctionBasics } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';

import Row from '../../common/Row';
import StepByStepRow from '../../common/StepByStepRow';
import StepHeader from '../../common/StepHeader';
import BasicForm from '../../Forms/BasicForm';
import styles from './styles.module.scss';

const EditAuctionBasicPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData } = useQuery(getAuctionBasics, {
    variables: { id: auctionId },
  });
  const [updateAuction, { loading: updating }] = useMutation(updateAuctionBasics, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/media`);
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}`);
  }, []);

  const handleSubmit = useCallback((values) => {
    console.log(values);
    updateAuction({ variables: { id: auctionId, ...values } });
  }, []);

  return (
    <Layout>
      <ProgressBar now={25} />

      <section className={styles.section}>
        <Form initialValues={auctionData?.auction} onSubmit={handleSubmit}>
          <Container className={styles.root}>
            <StepHeader step="1" title="Basic info" />

            <Row
              description="Provide information about the item you are listing. This affects how the item is shown in social networks and on search results."
              title="Details"
            >
              {!loadingQuery && <BasicForm />}
            </Row>
          </Container>

          <StepByStepRow loading={updating} nextAction={handleSubmit} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionBasicPage;
