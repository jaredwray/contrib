import { FC } from 'react';

import clsx from 'clsx';
import { useFormState } from 'react-final-form';

import AsyncButton from 'src/components/AsyncButton';

import styles from './SubmitButton.module.scss';

interface Props {
  text?: string;
  className?: string;
  disabled?: boolean;
}
export const SubmitButton: FC<Props> = ({ text, children, className, disabled }) => {
  const { submitting } = useFormState({ subscription: { submitting: true } });

  return (
    <div className={clsx(styles.buttonWrapper, 'pt-3 pb-3 float-right pb-sm-5')}>
      <AsyncButton
        className={clsx('text-subhead', className, styles.button)}
        disabled={disabled}
        loading={submitting}
        type="submit"
      >
        {text || children}
      </AsyncButton>
    </div>
  );
};
