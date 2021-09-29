import React, { FC, useMemo, useState } from 'react';

import { CardElement } from '@stripe/react-stripe-js';
import type { StripeCardElementChangeEvent, StripeCardElement } from '@stripe/stripe-js';
import clsx from 'clsx';
import { Button } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  inputClassName?: string;
  cancelButtonClassName?: string;
  disabled: boolean;
  showCancelBtn: boolean;
  onChange?(event: StripeCardElementChangeEvent): void;
  onCancel: () => void;
}

const StripeInput: FC<Props> = ({
  disabled,
  onChange,
  onCancel,
  showCancelBtn,
  inputClassName,
  cancelButtonClassName,
}) => {
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
          fontFamily: 'Montserrat, sans-serif',

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
    <div
      className={clsx(inputClassName || styles.root, 'mb-4 mb-sm-0', focused && styles.focused)}
      onClick={() => node?.focus()}
    >
      <CardElement
        options={options}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onReady={setNode}
      />
      {showCancelBtn && (
        <Button
          className={clsx(cancelButtonClassName || styles.newCardCancelBtn, 'pr-0')}
          disabled={disabled}
          size="sm"
          variant="link"
          onClick={onCancel}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default StripeInput;
