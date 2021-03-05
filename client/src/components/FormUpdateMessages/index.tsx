import { useEffect } from 'react';

import { Alert } from 'react-bootstrap';

import styles from './styles.module.scss';

const HIDE_ALERT_TIMEOUT_MS = 3500;

export default function FormUpdateMessages({ state, updateState }: { state: any; updateState: any }) {
  useEffect(() => {
    state.successUpdateMessage &&
      setTimeout(() => {
        updateState('successUpdateMessage', '');
      }, HIDE_ALERT_TIMEOUT_MS);
  }, [state.successUpdateMessage]);

  useEffect(() => {
    state.updateError &&
      setTimeout(() => {
        updateState('updateError', '');
      }, HIDE_ALERT_TIMEOUT_MS);
  }, [state.updateError]);

  return (
    <>
      {state.updateError && (
        <Alert className={styles.alert} variant="danger">
          {state.updateError}
        </Alert>
      )}
      {state.successUpdateMessage && (
        <Alert className={styles.alert} variant="success">
          {state.successUpdateMessage}
        </Alert>
      )}
    </>
  );
}
