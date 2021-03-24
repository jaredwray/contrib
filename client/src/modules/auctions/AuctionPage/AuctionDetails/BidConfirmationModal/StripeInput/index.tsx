import React, { FC, useMemo } from 'react';

import { CardElement } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent } from '@stripe/stripe-js';

import styles from './styles.module.scss';

interface Props {
  disabled: boolean;
  onChange(event: StripeCardElementChangeEvent): void;
}

const StripeInput: FC<Props> = ({ disabled, onChange }) => {
  const options = useMemo(
    () => ({
      disabled: disabled,
      style: {
        base: {
          color: '#5a7864',
          fontSize: '16px',
          fontWeight: 500,

          '::placeholder': {
            color: '#caccc6',
          },
        },

        invalid: {
          color: '#e1825f',

          '::placeholder': {
            color: '#caccc6',
          },
        },
      },
    }),
    [disabled],
  );

  return (
    <div className={styles.root}>
      <CardElement options={options} onChange={onChange} />{' '}
    </div>
  );
};

export default StripeInput;
