import { useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { updateAuctionBasics, getAuctionBasics } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';

import Row from '../../common/Row';
import StepHeader from '../../common/StepHeader';
import BasicForm from '../PageForm';
import styles from './styles.module.scss';

const EditAuctionBasicPage = () => {
  const { addToast } = useToasts();
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

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await updateAuction({ variables: { id: auctionId, ...values } });
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [auctionId, updateAuction, addToast],
  );

  return (
    <Layout>
      <ProgressBar now={25} />

      <section className={styles.section}>
        <Form initialValues={auctionData?.auction} onSubmit={handleSubmit}>
          <Container>
            <StepHeader step="1" title="Basic info" />

            <Row
              description="Provide information about the item you are listing. This affects how the item is shown in social networks and on search results."
              title="Details"
            >
              {!loadingQuery && <BasicForm />}
            </Row>
          </Container>

          <StepByStepRow loading={updating} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionBasicPage;
