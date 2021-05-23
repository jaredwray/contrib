import React, { FC } from 'react';

import clsx from 'clsx';
import { Button, Container } from 'react-bootstrap';

import AsyncButton from '../AsyncButton';
import styles from './styles.module.scss';

interface Props {
  prevAction?(): void;
  loading: boolean;
  last?: boolean;
}

const StepByStepRow: FC<Props> = ({ prevAction, loading, last }) => {
  return (
    <div className={styles.root}>
      <Container fluid className="d-flex h-100 justify-content-between align-items-center">
        <Button
          className="text-subhead font-weight-bold"
          disabled={loading || !prevAction}
          variant="link"
          onClick={prevAction}
        >
          Prev
        </Button>
        <AsyncButton
          className={clsx('text-subhead', styles.button, !loading && 'btn-with-arrows')}
          loading={loading}
          type="submit"
        >
          {last ? 'Finish' : 'Next'}
        </AsyncButton>
      </Container>
    </div>
  );
};

export default StepByStepRow;
