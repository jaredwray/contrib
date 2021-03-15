import { FC, useEffect, useState } from 'react';

import { Alert } from 'react-bootstrap';

import styles from './styles.module.scss';

const HIDE_ALERT_TIMEOUT_MS = 5000;

interface PropTypes {
  successMessage?: string;
  errorMessage?: string;
}

const FormUpdateMessages: FC<PropTypes> = ({ successMessage, errorMessage }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (successMessage || errorMessage) {
      setShowAlert(true);

      const timeout = setTimeout(() => {
        setShowAlert(false);
      }, HIDE_ALERT_TIMEOUT_MS);

      return () => clearTimeout(timeout);
    }
  }, [successMessage, errorMessage]);

  if (!showAlert) {
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
