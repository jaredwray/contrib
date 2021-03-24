import React, { FC, useCallback, useMemo, useState } from 'react';

import { CardElement } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent, StripeCardElement } from '@stripe/stripe-js';
import clsx from 'clsx';

import styles from './styles.module.scss';

interface Props {
  disabled: boolean;
  onChange(event: StripeCardElementChangeEvent): void;
}

const StripeInput: FC<Props> = ({ disabled, onChange }) => {
  const [node, setNode] = useState<StripeCardElement | null>(null);
  const [focused, setFocused] = useState(false);

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
    <div onClick={() => node?.focus()} className={clsx(styles.root, focused && styles.focused)}>
      <CardElement
        options={options}
        onChange={onChange}
        onReady={setNode}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
};

export default StripeInput;
