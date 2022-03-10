import React, { FC } from 'react';

import clsx from 'clsx';
import { Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import AsyncButton from '../../../buttons/AsyncButton';
import styles from './styles.module.scss';

interface Props {
  disabled?: boolean;
  prevAction?(): void;
  loading: boolean;
  last?: boolean;
  isActive?: boolean;
}

const StepByStepPageRow: FC<Props> = ({ prevAction, disabled, loading, last, isActive }) => {
  const history = useHistory();
  return (
    <div className={styles.root}>
      <Container fluid className="d-flex h-100 justify-content-between align-items-center">
        <Button
          className="text-subhead fw-bold"
          disabled={(!isActive && (loading || !prevAction)) || disabled}
          variant="link"
          onClick={isActive ? () => history.goBack() : prevAction}
        >
          {isActive ? 'Back' : 'Prev'}
        </Button>
        <AsyncButton
          className={clsx('text-subhead', styles.button, !loading && 'btn-with-arrows')}
          disabled={disabled}
          loading={loading}
          type="submit"
        >
          {last ? 'Finish' : isActive ? 'Edit' : 'Next'}
        </AsyncButton>
      </Container>
    </div>
  );
};

export default StepByStepPageRow;
