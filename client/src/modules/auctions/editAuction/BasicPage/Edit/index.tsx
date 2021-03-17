import { useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { updateAuctionBasics, getAuctionBasics } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import FormUpdateMessages from 'src/components/FormUpdateMessages';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';

import Row from '../../common/Row';
import StepHeader from '../../common/StepHeader';
import BasicForm from '../PageForm';
import styles from './styles.module.scss';

const EditAuctionBasicPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData, error: updateError } = useQuery(getAuctionBasics, {
    variables: { id: auctionId },
  });
  const [updateAuction, { loading: updating }] = useMutation(updateAuctionBasics, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/media`);
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
      <FormUpdateMessages errorMessage={updateError?.message} />

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
