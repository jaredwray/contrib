import { FC, useContext, useCallback, useState, useEffect } from 'react';

import { useMutation } from '@apollo/client';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { AcceptAccountTermsMutation } from 'src/apollo/queries/terms';
import Form from 'src/components/forms/Form/Form';
import Checkbox from 'src/components/forms/inputs/Checkbox';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import TermsText from 'src/components/modals/TermsConfirmationDialog/TermsText';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './styles.module.scss';

const IGNORED_PAGES = ['/privacy-policy', '/terms', '/privacy'];

const TermsConfirmationDialog: FC = () => {
  const [show, setShow] = useState(false);
  const { showError } = useShowNotification();
  const { account } = useContext(UserAccountContext);
  const [acceptAccountTerms] = useMutation(AcceptAccountTermsMutation);

  const onSubmit = useCallback(
    async (values) => {
      if (!values.terms) return;

      try {
        await acceptAccountTerms({ variables: { version: account?.notAcceptedTerms } });
        window.location.reload();
      } catch (error) {
        showError(error.message);
      }
    },
    [account, acceptAccountTerms, showError],
  );

  useEffect(() => {
    // to cover other modals
    const timer = setTimeout(() => setShow(true), 1);

    return () => {
      clearTimeout(timer);
    };
  }, [setShow]);

  const checkboxLabel = (
    <>
      I accept terms and&#160;
      <Link target="_blank" to="/privacy-policy">
        privacy policy
      </Link>
    </>
  );

  if (!account?.notAcceptedTerms || IGNORED_PAGES.includes(window.location.pathname)) return null;

  return (
    <Dialog open={show} size="lg" title="Privacy and Terms" withCloseButton={false} onClose={() => {}}>
      <DialogContent>
        <Form onSubmit={onSubmit}>
          <div className={styles.terms}>
            <TermsText />
          </div>

          <Checkbox label={checkboxLabel} name="terms" required={true} wrapperClassName="mb-0" />

          <div className="float-end">
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
