import { FC, useCallback, useState } from 'react';

import { useMutation } from '@apollo/client';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { CreateInfluencerMutation } from 'src/apollo/queries/influencers';
import Dialog from 'src/components/Dialog';
import DialogContent from 'src/components/Dialog/DialogContent';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';

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
      if (name) {
        setCreating(true);
        createMutation({ variables: { name } })
          .then((response) => {
            history.push(`/profiles/${response.data.createInfluencer.id}/edit`);
          })
          .catch((error) => setCreateError(error.message))
          .finally(() => setCreating(false));
      }
    },
    [createMutation, history],
  );

  return (
    <Dialog open={open} title="Create Influencer" onClose={onClose}>
      <DialogContent>
        <Form initialValues={{ name: null }} onSubmit={onSubmit}>
          {createError && <Alert variant="danger">{createError}</Alert>}

          <InputField required name="name" title="Enter Name" />

          <hr />
          <div className="float-right">
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
