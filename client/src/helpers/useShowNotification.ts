import { useToasts } from 'react-toast-notifications';

export const useShowNotification = () => {
  const { addToast } = useToasts();
  const showMessage = (text: string) => addToast(text, { autoDismiss: true, appearance: 'success' });
  const showWarning = (text: string) => addToast(text, { autoDismiss: true, appearance: 'warning' });
  const showError = (text: string) => addToast(text, { autoDismiss: true, appearance: 'error' });
  return { showMessage, showError, showWarning };
};
