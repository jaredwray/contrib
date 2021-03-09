import { useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { createAuctionMutation } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import Layout from 'src/components/Layout';

import StepByStepRow from '../../common/StepByStepRow';
import StepHeader from '../../common/StepHeader';
import BasicForm from '../../Forms/BasicForm';
import styles from './styles.module.scss';

const initialValues = {
  title: null,
  gameWorn: true,
  autographed: false,
  authenticityCertificate: false,
  playedIn: null,
  description: null,
  fullPageDescription: null,
};

const NewAuctionBasicPage = () => {
  const history = useHistory();

  const [createAuction, { loading }] = useMutation(createAuctionMutation, {
    onCompleted({ createAuction }) {
      if (createAuction.id) {
        history.push(`/auctions/${createAuction.id}/media`);
      }
    },
    onError(error) {
      console.log(error);
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/new`);
  }, []);

  const handleSubmit = useCallback((values) => {
    createAuction({ variables: values });
  }, []);

  return (
    <Layout>
      <ProgressBar now={25} />

      <section className={styles.section}>
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
          <Container className={styles.root}>
            <StepHeader step="1" title="Basic info" />

            <Row className="flex-column flex-md-row">
              <Col className="pr-md-5">
                <p className="text-subhead">Details</p>
                <p className="text-body">
                  Provide information about the item you are listing. This affects how the item is shown in social
                  networks and on search results.
                </p>
              </Col>

              <Col className="pl-md-5">
                <BasicForm />
              </Col>
            </Row>
          </Container>

          <StepByStepRow loading={loading} nextAction={handleSubmit} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default NewAuctionBasicPage;
