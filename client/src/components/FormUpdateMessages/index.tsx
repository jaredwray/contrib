import { FC, useEffect, useState } from 'react';

import { Alert } from 'react-bootstrap';

import styles from './styles.module.scss';

const HIDE_ALERT_TIMEOUT_MS = 3500;

interface PropTypes {
  successMessage?: string;
  errorMessage?: string;
}

const FormUpdateMessages: FC<PropTypes> = ({ successMessage, errorMessage }) => {
  const [alertHidden, setAlertHidden] = useState(true);

  useEffect(() => {
    if (successMessage || errorMessage) {
      setAlertHidden(false);

      const timeout = setTimeout(() => {
        setAlertHidden(true);
      }, HIDE_ALERT_TIMEOUT_MS);

      return () => clearTimeout(timeout);
    }
  }, [successMessage, errorMessage]);

  if (alertHidden) {
    return null;
  }

  return (
    <>
      {errorMessage && (
        <Alert className={styles.alert} variant="danger">
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert className={styles.alert} variant="success">
          {successMessage}
        </Alert>
      )}
    </>
  );
};

export default FormUpdateMessages;
