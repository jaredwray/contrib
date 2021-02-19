import { useState, useCallback } from 'react';
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { gql, useMutation } from '@apollo/client';
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import PhoneInput from 'react-phone-input-2';

const InviteInfliencerMutation = gql`
  mutation InviteInfliencer(
    $firstName: String!,
    $lastName: String!,
    $phoneNumber: String!,
    $welcomeMessage: String!
  ) {
    inviteInfluencer(input: {
      firstName: $firstName,
      lastName: $lastName,
      phoneNumber: $phoneNumber,
      welcomeMessage: $welcomeMessage
    }) {
      id
    }
  }
`;

export default function InvitationModal(props: any) {
  const [inviteInfliencer] = useMutation(InviteInfliencerMutation);
  const [invitationError, setInvitationError] = useState();
  const { register, errors, handleSubmit, control } = useForm();

  const onSubmit = useCallback(
    ({ firstName, lastName, phoneNumber, welcomeMessage }: { firstName: string, lastName: string, phoneNumber: string, welcomeMessage: string }) => {
      if (firstName && lastName && phoneNumber && welcomeMessage) {
        inviteInfliencer({
          variables: { firstName, lastName, phoneNumber: `+${phoneNumber}`, welcomeMessage },
        })
        .then(() => window.location.reload(false))
        .catch((error) => setInvitationError(error.message));
      }
    },
    [inviteInfliencer]
  );

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Invitation
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          {invitationError && <Alert variant="danger">{invitationError}</Alert>}

          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control placeholder="Enter First Name" className={errors.firstName && "is-invalid"} name="firstName" ref={register({required: "required"})} />
            <ErrorMessage className="invalid-feedback" name="firstName" as="div" errors={errors} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control placeholder="Enter Last Name" className={errors.lastName && "is-invalid"} name="lastName" ref={register({required: "required"})} />
            <ErrorMessage className="invalid-feedback" name="lastName" as="div" errors={errors} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Controller
              name="phoneNumber"
              control={control}
              defaultValue={""}
              render={({ onChange }) => {
                return (
                  <PhoneInput
                    country={'us'}
                    onChange={(v) => onChange(v)}
                    inputClass={errors.phoneNumber && "is-invalid"}
                    copyNumbersOnly={false}
                    specialLabel=""
                    placeholder=""
                    inputProps={{ required: true, name: "phoneNumber" }}
                  />
                );
              }}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Message on the Welcome page</Form.Label>
            <Form.Control placeholder="Enter Message on the Welcome page" as="textarea" rows={5} className={errors.welcomeMessage && "is-invalid"} name="welcomeMessage" ref={register({required: "required"})} />
            <ErrorMessage className="invalid-feedback" name="welcomeMessage" as="div" errors={errors} />
          </Form.Group>

          <hr/>
          <div className="text-right">
            <Button type="submit" className="btn-ochre">Invite</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};
