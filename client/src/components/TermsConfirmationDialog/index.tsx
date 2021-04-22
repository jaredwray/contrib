import { FC, useContext, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { AcceptAccountTermsMutation } from 'src/apollo/queries/terms';
import Dialog from 'src/components/Dialog';
import DialogContent from 'src/components/DialogContent';
import Checkbox from 'src/components/Form/Checkbox';
import Form from 'src/components/Form/Form';
import TermsText from 'src/components/TermsText';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

import styles from './styles.module.scss';

const TermsConfirmationDialog: FC = () => {
  const { addToast } = useToasts();
  const { account } = useContext(UserAccountContext);
  const [acceptAccountTerms] = useMutation(AcceptAccountTermsMutation);

  const onSubmit = useCallback(
    async (values) => {
      if (!values.terms) {
        return;
      }

      try {
        await acceptAccountTerms({ variables: { version: account?.notAcceptedTerms } });

        window.location.reload(false);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [account, acceptAccountTerms, addToast],
  );

  if (!account?.notAcceptedTerms) {
    return null;
  }

  return (
    <Dialog open={true} size="lg" title="Privacy and Terms" withCloseButton={false} onClose={() => {}}>
      <DialogContent>
        <Form onSubmit={onSubmit}>
          <div className={styles.terms}>
            <TermsText />
          </div>

          <Checkbox label="I accept terms" name="terms" required={true} wrapperClassName="mb-0" />

          <div className="float-right">
            <Button className="text-label" type="submit" variant="secondary">
              Accept
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TermsConfirmationDialog;
