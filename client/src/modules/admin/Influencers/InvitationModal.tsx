import { useState, useCallback } from 'react';

import { gql, useMutation } from '@apollo/client';
import { ErrorMessage } from '@hookform/error-message';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';

const InviteInfliencerMutation = gql`
  mutation InviteInfliencer($firstName: String!, $lastName: String!, $phoneNumber: String!, $welcomeMessage: String!) {
    inviteInfluencer(
      input: { firstName: $firstName, lastName: $lastName, phoneNumber: $phoneNumber, welcomeMessage: $welcomeMessage }
    ) {
      id
    }
  }
`;

export default function InvitationModal(props: any) {
  const [inviteInfliencer] = useMutation(InviteInfliencerMutation);
  const [invitationError, setInvitationError] = useState();
  const { register, errors, handleSubmit, control } = useForm();

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
        inviteInfliencer({
          variables: { firstName, lastName, phoneNumber: `+${phoneNumber}`, welcomeMessage },
        })
          .then(() => window.location.reload(false))
          .catch((error) => setInvitationError(error.message));
      }
    },
    [inviteInfliencer],
  );

  return (
    <Modal {...props} centered aria-labelledby="contained-modal-title-vcenter" size="md">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Create Invitation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          {invitationError && <Alert variant="danger">{invitationError}</Alert>}

          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              ref={register({ required: 'required' })}
              className={errors.firstName && 'is-invalid'}
              name="firstName"
              placeholder="Enter First Name"
            />
            <ErrorMessage as="div" className="invalid-feedback" errors={errors} name="firstName" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              ref={register({ required: 'required' })}
              className={errors.lastName && 'is-invalid'}
              name="lastName"
              placeholder="Enter Last Name"
            />
            <ErrorMessage as="div" className="invalid-feedback" errors={errors} name="lastName" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Controller
              control={control}
              defaultValue={''}
              name="phoneNumber"
              render={({ onChange }) => {
                return (
                  <PhoneInput
                    copyNumbersOnly={false}
                    country={'us'}
                    inputClass={errors.phoneNumber && 'is-invalid'}
                    inputProps={{ required: true, name: 'phoneNumber' }}
                    placeholder=""
                    specialLabel=""
                    onChange={(v) => onChange(v)}
                  />
                );
              }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Message on the Welcome page</Form.Label>
            <Form.Control
              ref={register({ required: 'required' })}
              as="textarea"
              className={errors.welcomeMessage && 'is-invalid'}
              name="welcomeMessage"
              placeholder="Enter Message on the Welcome page"
              rows={5}
            />
            <ErrorMessage as="div" className="invalid-feedback" errors={errors} name="welcomeMessage" />
          </Form.Group>

          <hr />
          <div className="text-right">
            <Button className="btn-ochre" type="submit">
              Invite
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}
