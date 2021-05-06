import { FC, useCallback, useState } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import { Alert, Button, Form as RbForm, Spinner } from 'react-bootstrap';
import { Field } from 'react-final-form';
import PhoneInput from 'react-phone-input-2';

import Dialog from 'src/components/Dialog';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';

interface Props {
  open: boolean;
  onClose: () => void;
  mutation: DocumentNode;
  mutationVariables?: Record<string, string>;
}

export const Modal: FC<Props> = ({ open, onClose, mutation, mutationVariables }) => {
  const [inviteMutation] = useMutation(mutation);
  const [creating, setCreating] = useState(false);
  const [invitationError, setInvitationError] = useState();

  const onSubmit = useCallback(
    ({
      firstName,
      lastName,
      phoneNumber,
      welcomeMessage,
    }: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      welcomeMessage: string;
    }) => {
      if (firstName && lastName && phoneNumber && welcomeMessage) {
        setCreating(true);
        inviteMutation({
          variables: { firstName, lastName, phoneNumber: `+${phoneNumber}`, welcomeMessage, ...mutationVariables },
        })
          .then(() => window.location.reload(false))
          .catch((error) => {
            setInvitationError(error.message);
          })
          .finally(() => setCreating(false));
      }
    },
    [inviteMutation, mutationVariables],
  );

  return (
    <Dialog open={open} title="Create Invitation" onClose={onClose}>
      <DialogContent>
        <Form
          initialValues={{ firstName: null, lastName: null, phoneNumber: null, welcomeMessage: null }}
          onSubmit={onSubmit}
        >
          {invitationError && <Alert variant="danger">{invitationError}</Alert>}

          <InputField required name="firstName" title="Enter First Name" />
          <InputField required name="lastName" title="Enter Last Name" />
          <RbForm.Group>
            <RbForm.Label>Phone Number</RbForm.Label>
            <Field name="phoneNumber">
              {({ input }) => (
                <PhoneInput
                  copyNumbersOnly={false}
                  country="us"
                  inputClass="is-invalid"
                  inputProps={{ required: true, name: 'phoneNumber' }}
                  placeholder=""
                  specialLabel=""
                  {...input}
                />
              )}
            </Field>
          </RbForm.Group>

          <InputField required textarea name="welcomeMessage" title="Enter Message on the Welcome page" />

          <hr />
          <div className="float-right">
            {creating ? (
              <Spinner animation="border" />
            ) : (
              <Button className="text-label" type="submit" variant="secondary">
                Invite
              </Button>
            )}
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
