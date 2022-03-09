import { FC, useCallback, useState, useEffect } from 'react';

import { DocumentNode, useMutation } from '@apollo/client';
import { Alert, Button, Form as RbForm, Spinner } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { useToasts } from 'react-toast-notifications';

import Form from 'src/components/forms/Form/Form';
import InputField from 'src/components/forms/inputs/InputField';
import PhoneInput from 'src/components/forms/inputs/PhoneInput';
import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';
import { ALLOWED_COUNTRY_NAME } from 'src/types/Country';

interface Props {
  open: boolean;
  onClose: () => void;
  mutation: DocumentNode;
  updateEntitisList: () => void;
  mutationVariables?: Record<string, string>;
}

export const Modal: FC<Props> = ({ open, onClose, mutation, mutationVariables, updateEntitisList }) => {
  const { addToast } = useToasts();
  const [inviteMutation] = useMutation(mutation);
  const [creating, setCreating] = useState(false);
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [phoneInputIsValid, setPhoneInputIsValid] = useState(false);
  const [invitationError, setInvitationError] = useState('');
  const allowedCountryName = ALLOWED_COUNTRY_NAME;

  useEffect(() => {
    if (!phoneInputValue) setPhoneInputValue('1');
    if (phoneInputValue[0] !== '1') {
      const passedValue = phoneInputValue.toString().split('');
      passedValue.unshift('1');
      setPhoneInputValue(passedValue.join(''));
    }
  }, [phoneInputValue]);

  const handleOnClose = useCallback(() => {
    setPhoneInputValue('');
    setInvitationError('');
    onClose();
  }, [onClose]);

  const onSubmit = useCallback(
    ({ firstName, lastName, welcomeMessage }: { firstName: string; lastName: string; welcomeMessage: string }) => {
      if (!firstName || !lastName || !welcomeMessage) return;

      setCreating(true);
      inviteMutation({
        variables: { firstName, lastName, phoneNumber: `+${phoneInputValue}`, welcomeMessage, ...mutationVariables },
      })
        .then(() => {
          updateEntitisList();
          handleOnClose();
          addToast('Invited', { autoDismiss: true, appearance: 'success' });
        })
        .catch((error) => setInvitationError(error.message))
        .finally(() => setCreating(false));
    },
    [inviteMutation, mutationVariables, updateEntitisList, addToast, phoneInputValue, handleOnClose],
  );
  interface Country {
    countryCode: string;
    dialCode: string;
    format: string;
    name: string;
  }

  const handleChange = (value: string, country: Country) => {
    setPhoneInputValue(value);
    setPhoneInputIsValid(country.name === allowedCountryName && value.length === 11);
  };

  return (
    <Dialog open={open} title="Create Invitation" onClose={handleOnClose}>
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
                  otherProps={{ ...input }}
                  value={phoneInputValue}
                  valueIsValid={phoneInputIsValid}
                  onChange={handleChange}
                />
              )}
            </Field>
          </RbForm.Group>
          <InputField required textarea name="welcomeMessage" title="Enter Message on the Welcome page" />
          <div className="float-end pt-2">
            {creating ? (
              <Spinner animation="border" />
            ) : (
              <Button className="text-label" disabled={!phoneInputIsValid} type="submit" variant="secondary">
                Invite
              </Button>
            )}
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
