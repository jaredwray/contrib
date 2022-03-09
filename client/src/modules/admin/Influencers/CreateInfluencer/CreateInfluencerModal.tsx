import { FC, useCallback, useState } from 'react';

import { useMutation } from '@apollo/client';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { CreateInfluencerMutation } from 'src/apollo/queries/influencers';
import Form from 'src/components/forms/Form/Form';
import InputField from 'src/components/forms/inputs/InputField';
import Dialog from 'src/components/modals/Dialog';
import DialogContent from 'src/components/modals/Dialog/DialogContent';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CreateInfluencerModal: FC<Props> = ({ open, onClose }) => {
  const history = useHistory();

  const [createMutation] = useMutation(CreateInfluencerMutation);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState();

  const onSubmit = useCallback(
    ({ name }: { name: string }) => {
      if (!name) return;

      setCreating(true);
      createMutation({ variables: { name } })
        .then((response) => {
          history.push(`/profiles/${response.data.createInfluencer.id}/edit`);
        })
        .catch((error) => setCreateError(error.message))
        .finally(() => setCreating(false));
    },
    [createMutation, history],
  );

  return (
    <Dialog open={open} title="Create Influencer" onClose={onClose}>
      <DialogContent>
        <Form initialValues={{ name: null }} onSubmit={onSubmit}>
          {createError && <Alert variant="danger">{createError}</Alert>}
          <InputField required name="name" title="Enter Name" />
          <div className="float-end">
            {creating ? (
              <Spinner animation="border" />
            ) : (
              <Button className="text-label" type="submit" variant="secondary">
                Create
              </Button>
            )}
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
