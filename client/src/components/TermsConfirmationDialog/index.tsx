import { FC, useContext, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Accordion, Button } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import {
  AcceptAccountTermsMutation,
  AcceptInfluencerTermsMutation,
  AcceptAssistantTermsMutation,
} from 'src/apollo/queries/terms';
import Dialog from 'src/components/Dialog';
import DialogContent from 'src/components/DialogContent';
import Checkbox from 'src/components/Form/Checkbox';
import Form from 'src/components/Form/Form';
import PrivacyCard from 'src/components/PrivacyCard';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';

const TermsConfirmationDialog: FC = () => {
  const { addToast } = useToasts();
  const { account } = useContext(UserAccountContext);
  const [acceptAccountTerms] = useMutation(AcceptAccountTermsMutation);
  const [acceptInfluencerTerms] = useMutation(AcceptInfluencerTermsMutation);
  const [acceptAssistantTerms] = useMutation(AcceptAssistantTermsMutation);

  const hasNotAcceptedTerms =
    account?.notAcceptedTerms || account?.influencerProfile?.notAcceptedTerms || account?.assistant?.notAcceptedTerms;

  const onSubmit = useCallback(
    async (values) => {
      if (
        (account?.notAcceptedTerms && !values.usersTerms) ||
        (account?.influencerProfile?.notAcceptedTerms && !values.influencersTerms) ||
        (account?.assistant?.notAcceptedTerms && !values.assistantsTerms)
      ) {
        return;
      }
      try {
        if (values.usersTerms) {
          await acceptAccountTerms({ variables: { version: account?.notAcceptedTerms?.version } });
        }

        if (values.influencersTerms) {
          await acceptInfluencerTerms({
            variables: { version: account?.influencerProfile?.notAcceptedTerms?.version },
          });
        }

        if (values.assistantsTerms) {
          await acceptAssistantTerms({ variables: { version: account?.assistant?.notAcceptedTerms?.version } });
        }

        window.location.reload(false);
      } catch (error) {
        addToast(error.message, { autoDismiss: true, appearance: 'error' });
      }
    },
    [account, acceptAccountTerms, acceptInfluencerTerms, acceptAssistantTerms, addToast],
  );

  if (!hasNotAcceptedTerms) {
    return null;
  }

  return (
    <Dialog open={true} size="lg" title="Privacy and Terms" withCloseButton={false} onClose={() => {}}>
      <DialogContent>
        <Form onSubmit={onSubmit}>
          <p>Please confirm our new terms:</p>
          <Accordion>
            {account?.notAcceptedTerms && (
              <PrivacyCard eventKey="0" role="account" roleInTitle="Users" terms={account?.notAcceptedTerms} />
            )}
            {account?.influencerProfile?.notAcceptedTerms && (
              <PrivacyCard
                eventKey="1"
                role="influencer"
                roleInTitle="Influencers"
                terms={account?.influencerProfile?.notAcceptedTerms}
              />
            )}
            {account?.assistant?.notAcceptedTerms && (
              <PrivacyCard
                eventKey="2"
                role="assistant"
                roleInTitle="Assistants"
                terms={account?.assistant?.notAcceptedTerms}
              />
            )}
          </Accordion>
          <br />
          {account?.notAcceptedTerms && (
            <Checkbox label="I accept terms for Users" name="usersTerms" required={true} wrapperClassName="mb-0" />
          )}
          {account?.influencerProfile?.notAcceptedTerms && (
            <Checkbox
              label="I accept terms for Influencers"
              name="influencersTerms"
              required={true}
              wrapperClassName="mb-0"
            />
          )}
          {account?.assistant?.notAcceptedTerms && (
            <Checkbox
              label="I accept terms for Assistants"
              name="assistantsTerms"
              required={true}
              wrapperClassName="mb-0"
            />
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
