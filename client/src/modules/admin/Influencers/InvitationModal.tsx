import { useState, useCallback } from 'react';

import { useMutation } from '@apollo/client';
import { Alert, Button, Spinner, Modal, Form as RbForm } from 'react-bootstrap';
import { Field } from 'react-final-form';
import PhoneInput from 'react-phone-input-2';

import { InviteInfluencerMutation } from 'src/apollo/queries/influencers';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';

export default function InvitationModal(props: any) {
  const [inviteInfluencer] = useMutation(InviteInfluencerMutation);
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
        inviteInfluencer({
          variables: { firstName, lastName, phoneNumber: `+${phoneNumber}`, welcomeMessage },
        })
          .then(() => window.location.reload(false))
          .catch((error) => setInvitationError(error.message));
      }
    },
    [inviteInfluencer],
  );

  return (
    <Modal {...props} centered aria-labelledby="contained-modal-title-vcenter" size="md">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create Invitation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
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
                  country={'us'}
                  inputClass={'is-invalid'}
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
          <div className="text-right">
            {creating ? (
              <Spinner animation="border" />
            ) : (
              <Button className="text-label" type="submit" variant="secondary">
                Invite
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
