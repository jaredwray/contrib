import { FC, useCallback, useState } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import styles from './CreateInfluencer.module.scss';
import { CreateInfluencerModal } from './CreateInfluencerModal';

export const CreateInfluencer: FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleClose = useCallback(() => {
    setShowDialog(false);
  }, []);

  return (
    <>
      <Button
        className={clsx(styles.btn, 'd-inline-block text--body')}
        variant="dark"
        onClick={() => setShowDialog(true)}
      >
        Create +
      </Button>
      <CreateInfluencerModal open={showDialog} onClose={handleClose} />
    </>
  );
};
