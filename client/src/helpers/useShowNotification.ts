import { useToasts } from 'react-toast-notifications';

export const useShowNotification = () => {
  const { addToast } = useToasts();
  const showMessage = (text: string | undefined) => {
    if (text) addToast(text, { autoDismiss: true, appearance: 'success' });
  };
  const showWarning = (text: string | undefined) => {
    if (text) addToast(text, { autoDismiss: true, appearance: 'warning' });
  };
  const showError = (text: string | undefined) => {
    if (text) addToast(text, { autoDismiss: true, appearance: 'error' });
  };
  return { showMessage, showError, showWarning };
};
