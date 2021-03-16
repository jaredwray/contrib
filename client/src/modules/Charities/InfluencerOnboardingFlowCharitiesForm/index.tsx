import { FC, useCallback, useState } from 'react';

import clsx from 'clsx';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useHistory } from 'react-router';

import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import FormUpdateMessages from 'src/components/FormUpdateMessages';
import StepByStepRow from 'src/components/StepByStepRow';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

interface Props {
  isStepByStep: boolean;
  initialFavoriteCharities: Charity[];
  onSubmit: (favoriteCharities: Charity[]) => Promise<void>;
  submitSuccessMessage?: string;
  submitErrorMessage?: string;
}

export const InfluencerOnboardingFlowCharitiesForm: FC<Props> = ({
  isStepByStep,
  initialFavoriteCharities,
  onSubmit,
  submitSuccessMessage,
  submitErrorMessage,
}) => {
  const history = useHistory();
  const [isSubmitting, setSubmitting] = useState(false);
  const [favoriteCharities, setFavoriteCharities] = useState(initialFavoriteCharities);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        await onSubmit(favoriteCharities);
      } catch (error) {
        console.error('error submitting favorite charities: ', error);
      } finally {
        setSubmitting(false);
      }
    },
    [favoriteCharities, onSubmit],
  );

  const handleFavoriteCharityChange = useCallback(
    (charity: Charity, shouldBeFavorite: boolean) => {
      const index = favoriteCharities.findIndex((c) => c.id === charity.id);
      const isFavorite = index >= 0;

      if (isFavorite && !shouldBeFavorite) {
        setFavoriteCharities([...favoriteCharities.slice(0, index), ...favoriteCharities.slice(index + 1)]);
      } else if (!isFavorite && shouldBeFavorite) {
        setFavoriteCharities([...favoriteCharities, charity]);
      }
    },
    [favoriteCharities, setFavoriteCharities],
  );

  return (
    <section className="pb-0">
      <Form onSubmit={handleSubmit}>
        <FormUpdateMessages errorMessage={submitErrorMessage} successMessage={submitSuccessMessage} />

        <Container>
          <Row>
            <Col className="text-label label-with-separator">Create your account</Col>
          </Row>
          <Row className="charities-page-title text-headline">
            <Col sm="9" xs="8">
              Your charities
            </Col>
            {isStepByStep && (
              <Col className="text-right step-title" sm="3" xs="4">
                Step 2
              </Col>
            )}
          </Row>
          <hr />
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <div className="text-subhead">Choose your charities</div>
              <div className="text--body pt-0 pt-md-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consectetur quis eu amet vitae sitsed facilisi
                suscipit volutpat.
              </div>
            </Col>
            <Col className="pt-2 pt-md-0" md="6">
              <CharitiesAutocomplete charities={favoriteCharities} onChange={handleFavoriteCharityChange} />
            </Col>
          </Row>
          <Row className="buffer d-none d-md-block" />
          <hr className="mt-0" />
          <Row className="pt-3 pt-md-0">
            <Col md="6">
              <div className="text-subhead">Don’t see your charity?</div>
              <div className="text--body pt-0 pt-md-2">
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

          {!isStepByStep && (
            <Row>
              <Col>
                <Button
                  className={clsx('float-right', styles.submitBtn)}
                  disabled={isSubmitting}
                  type="submit"
                  variant="secondary"
                >
                  Submit
                </Button>
              </Col>
            </Row>
          )}
        </Container>
        {isStepByStep && <StepByStepRow last loading={false} prevAction={() => history.push('/profile?sbs=true')} />}
      </Form>
    </section>
  );
};
