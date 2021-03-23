import { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';
import { useFormState } from 'react-final-form';

import styles from './SubmitButton.module.scss';

export const SubmitButton: FC = () => {
  const { submitting } = useFormState({ subscription: { submitting: true } });

  return (
    <div className="pt-3 pb-5 float-right">
      <Button className={clsx('text-subhead', styles.button)} disabled={submitting} type="submit">
        Save
      </Button>
    </div>
  );
};
