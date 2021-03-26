import React, { FC } from 'react';

import clsx from 'clsx';
import { Button, Spinner, ButtonProps } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props extends ButtonProps {
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

const AsyncButton: FC<Props> = ({ className, loading, disabled, children, ...rest }) => {
  return (
    <Button {...rest} className={clsx(styles.root, className)} disabled={loading || disabled}>
      <div className={clsx(loading && styles.loading)}>{children}</div>
      {loading && (
        <Spinner animation="border" aria-hidden="true" as="span" className={styles.spinner} role="status" size="sm" />
      )}
    </Button>
  );
};

export default AsyncButton;
