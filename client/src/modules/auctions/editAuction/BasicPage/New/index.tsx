import { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { createAuctionMutation } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';

import StepHeader from '../../common/StepHeader';
import BasicForm from '../PageForm';
import styles from './styles.module.scss';

const initialValues = {
  title: null,
  gameWorn: false,
  autographed: false,
  authenticityCertificate: false,
  playedIn: null,
  description: null,
  fullPageDescription: null,
};

const NewAuctionBasicPage = () => {
  const history = useHistory();
  const { addToast } = useToasts();

  const [createAuction, { loading }] = useMutation(createAuctionMutation, {
    onCompleted({ createAuction }) {
      if (createAuction.id) {
        history.push(`/auctions/${createAuction.id}/media`);
      }
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/new`);
  }, [history]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await createAuction({ variables: values });
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [createAuction, addToast],
  );

  return (
    <Layout>
      <ProgressBar now={25} />

      <section className={styles.section}>
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
          <Container>
            <StepHeader step="1" title="Basic info" />

            <Row className="flex-column flex-md-row">
              <Col className="pr-md-5">
                <p className="text-subhead">Details</p>
                <p className="text--body">
                  Provide information about the item you are listing. This affects how the item is shown in social
                  networks and on search results.
                </p>
              </Col>

              <Col className="pl-md-5">
                <BasicForm />
              </Col>
            </Row>
          </Container>

          <StepByStepRow loading={loading} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default NewAuctionBasicPage;
