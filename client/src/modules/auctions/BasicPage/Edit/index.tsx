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
import BasicForm from '../PageForm';
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
    onError(error) {
      console.log(error);
    },
  });

  const handleSubmit = useCallback(
    (values) => {
      updateAuction({ variables: { id: auctionId, ...values } });
    },
    [auctionId, updateAuction],
  );

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

          <StepByStepRow loading={updating} nextAction={handleSubmit} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionBasicPage;
