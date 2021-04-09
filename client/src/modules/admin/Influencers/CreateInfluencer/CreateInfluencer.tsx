import { FC, useCallback, useState } from 'react';

import { Button } from 'react-bootstrap';

import { CreateInfluencerModal } from './CreateInfluencerModal';

export const CreateInfluencer: FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, []);

  return (
    <>
      <Button className="w-100 text-label" variant="dark" onClick={() => setShowDialog(true)}>
        Create +
      </Button>
      <CreateInfluencerModal open={showDialog} onClose={handleClose} />
    </>
  );
};
