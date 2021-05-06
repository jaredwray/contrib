import { FC } from 'react';

import clsx from 'clsx';
import { useFormState } from 'react-final-form';

import AsyncButton from 'src/components/AsyncButton';

import styles from './SubmitButton.module.scss';

export const SubmitButton: FC = () => {
  const { submitting } = useFormState({ subscription: { submitting: true } });

  return (
    <div className="pt-3 pb-3 pb-sm-5 float-right">
      <AsyncButton className={clsx('text-subhead', styles.button)} loading={submitting} type="submit">
        Save
      </AsyncButton>
    </div>
  );
};
