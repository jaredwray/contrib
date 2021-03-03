import { useState, useCallback, SyntheticEvent } from 'react';

import { useMutation } from '@apollo/client';
import { Button, Container, Row, Col, ProgressBar, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { UpdateMyFavoriteCarities } from 'src/apollo/queries/charities';
import CharitiesSeacrhInput from 'src/components/CharitiesSeacrhInput';
import FormUpdateMessages from 'src/components/FormUpdateMessages';
import Layout from 'src/components/Layout';
import URLSearchParam from 'src/helpers/URLSearchParam';
import { Charity } from 'src/types/Charity';

import 'src/components/Layout/Steps.scss';

export default function CharitiesPage() {
  const stepByStep = URLSearchParam('sbs');
  const history = useHistory();

  const [state, setState] = useState({
    updateError: '',
    successUpdateMessage: '',
    searchQuery: '',
    favoriteCharities: [] as Charity[],
  });

  const updateState = (key: string, value: string | Charity[]) => {
    setState((prevState) => {
      return { ...prevState, [key]: value };
    });
  };

  const [updateMyFavoriteCarities] = useMutation(UpdateMyFavoriteCarities);

  const onSubmit = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();

      const favoriteCharityIds = state.favoriteCharities.map((charity: Charity) => charity.id);
      updateMyFavoriteCarities({
        variables: { charities: favoriteCharityIds },
      })
        .then(() => {
          if (stepByStep) {
            history.replace('/welcome');
          } else {
            updateState('successUpdateMessage', 'Your profile has been successfully updated.');
          }
        })
        .catch((error) => updateState('updateError', error.message));
    },
    [state.favoriteCharities, history],
  );

  return (
    <Layout>
      {stepByStep && <ProgressBar now={66} />}
      <section className="charities-page">
        <Form onSubmit={onSubmit}>
          <FormUpdateMessages state={state} updateState={updateState} />

          <Container>
            <Row>
              <Col className="text-label label-with-separator">Create your account</Col>
            </Row>
            <Row className="charities-page-title text-headline">
              <Col sm="9" xs="8">
                Your charities
              </Col>
              {stepByStep && (
                <Col className="text-right step-title" sm="3" xs="4">
                  Step 2
                </Col>
              )}
            </Row>
            <hr />
            <Row className="pt-3 pt-md-0">
              <Col md="6">
                <div className="text-subhead">Choose your charities</div>
                <div className="text-body pt-0 pt-md-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consectetur quis eu amet vitae sitsed
                  facilisi suscipit volutpat.
                </div>
              </Col>
              <Col className="pt-2 pt-md-0" md="6">
                <CharitiesSeacrhInput state={state} updateState={updateState} />
              </Col>
            </Row>
            <Row className="buffer d-none d-md-block" />
            <hr />
            <Row className="pt-3 pt-md-0">
              <Col md="6">
                <div className="text-subhead">Don’t see your charity?</div>
                <div className="text-body pt-0 pt-md-2">
                  If your charity isn’t listed send us their info and we will add them to Contrib.
                </div>
              </Col>
              <Col className="pt-2 pt-md-0" md="6">
                <Form.Group>
                  <Form.Label>Name</Form.Label>
                  <Form.Control placeholder="Enter charity name" />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Contact</Form.Label>
                  <Form.Control placeholder="Enter website or social" />
                </Form.Group>
              </Col>
            </Row>
            {!stepByStep && (
              <Row>
                <Col>
                  <Button className="btn-ochre float-right" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            )}
          </Container>

          {stepByStep && (
            <Container fluid className="steps-navigation-container">
              <Row className="pl-4 pr-4">
                <Col className="steps-navigation-items" xs="6">
                  <a className="steps-prev-btn text-subhead" href="/profile?sbs=true">
                    Prev
                  </a>
                </Col>
                <Col className="steps-navigation-items" xs="6">
                  <Button className="btn-with-arrows steps-next-btn float-right" type="submit">
                    Finish
                  </Button>
                </Col>
              </Row>
            </Container>
          )}
        </Form>
      </section>
    </Layout>
  );
}
