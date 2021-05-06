import { FC, useContext, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { AcceptAccountTermsMutation } from 'src/apollo/queries/terms';
import Dialog from 'src/components/Dialog';
import DialogContent from 'src/components/Dialog/DialogContent';
import Checkbox from 'src/components/Form/Checkbox';
import Form from 'src/components/Form/Form';
import TermsText from 'src/components/TermsText';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { CharityStatus } from 'src/types/Charity';

import styles from './styles.module.scss';

const TermsConfirmationDialog: FC = () => {
  const { addToast } = useToasts();
  const { account } = useContext(UserAccountContext);
  const [acceptAccountTerms] = useMutation(AcceptAccountTermsMutation);
  const charity = account?.charity;
  const pendingOnboardingChariry = charity?.status === CharityStatus.PENDING_ONBOARDING;

  const onSubmit = useCallback(
    async (values) => {
      if (!values.terms) {
        return;
      }

      try {
        if (account?.notAcceptedTerms) {
          await acceptAccountTerms({ variables: { version: account?.notAcceptedTerms } });
        }

        if (charity && pendingOnboardingChariry) {
          window.location.replace(charity.stripeAccountLink);
        } else {
          window.location.reload(false);
        }
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [account, acceptAccountTerms, addToast, charity, pendingOnboardingChariry],
  );

  const checkboxLabel = (
    <>
      I accept terms and&#160;
      <Link target="_blank" to="/privacy-policy">
        privacy policy
      </Link>
    </>
  );

  if (
    (!account?.notAcceptedTerms && !pendingOnboardingChariry) ||
    ['/privacy-policy', '/terms'].includes(window.location.pathname)
  ) {
    return null;
  }

  return (
    <Dialog open={true} size="lg" title="Privacy and Terms" withCloseButton={false} onClose={() => {}}>
      <DialogContent>
        <Form onSubmit={onSubmit}>
          <div className={styles.terms}>
            <TermsText />
          </div>

          <Checkbox label={checkboxLabel} name="terms" required={true} wrapperClassName="mb-0" />

          {pendingOnboardingChariry && (
            <>
              <div className="pt-2">You need to create a stripe account to continue work in our system.</div>
              <div>
                You will be redirected to the&nbsp;
                <a href="https://stripe.com" rel="noreferrer" target="_blank">
                  stripe.com
                </a>
                &nbsp;after our terms confirmation.
              </div>
            </>
          )}

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
