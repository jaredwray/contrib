import React, { FC, SyntheticEvent } from 'react';

import clsx from 'clsx';
import { Button, Container } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  nextAction(event: SyntheticEvent): void;
  prevAction?(): void;
  loading: boolean;
  last?: boolean;
}

const StepByStepRow: FC<Props> = ({ nextAction, prevAction, loading, last }) => {
  return (
    <div className={styles.root}>
      <Container fluid className="d-flex h-100 justify-content-between align-items-center">
        <Button className="text-subhead" disabled={loading} variant="link" onClick={prevAction}>
          Prev
        </Button>
        <Button
          className={clsx('btn-with-arrows text-subhead', styles.button)}
          disabled={loading}
          type="submit"
          onSubmit={nextAction}
        >
          {last ? 'Finish' : 'Next'}
        </Button>
      </Container>
    </div>
  );
};

export default StepByStepRow;
