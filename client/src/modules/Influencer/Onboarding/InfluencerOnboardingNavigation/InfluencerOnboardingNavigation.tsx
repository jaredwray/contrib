import React, { FC, useMemo } from 'react';

import clsx from 'clsx';
import { Button, Container } from 'react-bootstrap';
import { useFormState } from 'react-final-form';
import { useHistory } from 'react-router-dom';

import styles from './InfluencerOnboardingNavigation.module.scss';

interface Props {
  step: 'basic' | 'charities';
}

export const InfluencerOnboardingNavigation: FC<Props> = ({ step }) => {
  const history = useHistory();
  const { submitting } = useFormState({ subscription: { submitting: true } });

  const handlePrev = useMemo(() => {
    if (step === 'charities') {
      return () => history.replace('/onboarding/basic');
    }
    return null;
  }, [step, history]);

  return (
    <div className={styles.root}>
      <Container fluid className="d-flex flex-row h-100 align-items-center">
        {handlePrev && (
          <Button className="text-subhead" disabled={submitting} variant="link" onClick={handlePrev}>
            Prev
          </Button>
        )}
        <div className="flex-grow-1" />
        <Button className={clsx('btn-with-arrows text-subhead', styles.button)} disabled={submitting} type="submit">
          {step === 'charities' ? 'Finish' : 'Next'}
        </Button>
      </Container>
    </div>
  );
};
