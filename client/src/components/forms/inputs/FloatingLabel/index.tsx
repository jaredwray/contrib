import { forwardRef, BaseSyntheticEvent, KeyboardEventHandler, useCallback } from 'react';

import clsx from 'clsx';
import { Form, FloatingLabel as FloatingLabelRb } from 'react-bootstrap';

import useField from '../../Form/hooks/useField';
import useFieldConstraints from '../../Form/hooks/useFieldConstraints';
import styles from './styles.module.scss';

interface Props {
  name: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  label: string;
  errorClassName?: string;
  wrapperClassName?: string;
  constraints?: { [key: string]: any };
  textarea?: boolean;
  externalText?: string;
  type?: string;
  maxLength?: number;
  onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
  onInput?: (event: BaseSyntheticEvent) => void;
  setValueToState?: (name: string, value: string | Dinero.DineroObject) => void;
  valueFromState?: string;
  ref?: HTMLInputElement | null;
  isInvalid?: boolean;
}

const FloatingLabel = forwardRef<HTMLInputElement | null, Props>(
  (
    {
      name,
      title,
      placeholder,
      required,
      disabled,
      className,
      description,
      label,
      errorClassName,
      wrapperClassName,
      textarea,
      constraints: inputConstraints,
      externalText,
      type,
      maxLength,
      isInvalid,
      valueFromState,
      onKeyPress,
      onInput,
      setValueToState,
    },
    ref,
  ) => {
    const constraints = useFieldConstraints(inputConstraints, required);
    const { hasError, errorMessage, value, onChange, ...inputProps } = useField(name, {
      constraints,
      disabled,
    });

    const handleChange = useCallback(
      (e) => {
        onChange(e.target.value);

        if (setValueToState) setValueToState(name, e.target.value);
      },
      [name, setValueToState, onChange],
    );

    return (
      <>
        <FloatingLabelRb
          className={clsx(styles[type as string], className, required && styles.required)}
          controlId={`floating${type}`}
          label={label}
        >
          <Form.Control
            {...inputProps}
            ref={ref}
            as={type as any}
            className={clsx(styles.input, className)}
            isInvalid={hasError || isInvalid}
            maxLength={maxLength}
            placeholder={label}
            type={type}
            value={valueFromState || value}
            onChange={handleChange}
            onInput={onInput ? (e: BaseSyntheticEvent) => onInput(e) : () => {}}
            onKeyPress={() => onKeyPress}
          />
        </FloatingLabelRb>
        {description && <div className="text-label-light text-start mx-3 my-2">{description}</div>}
      </>
    );
  },
);

export default FloatingLabel;
