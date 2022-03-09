import { forwardRef, BaseSyntheticEvent, KeyboardEventHandler, useCallback } from 'react';

import clsx from 'clsx';
import { Form as BsForm } from 'react-bootstrap';

import useField from '../../Form/hooks/useField';
import useFieldConstraints from '../../Form/hooks/useFieldConstraints';

const { Group, Label, Control } = BsForm;

interface Props {
  name: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
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

const InputField = forwardRef<HTMLInputElement | null, Props>(
  (
    {
      name,
      title,
      placeholder,
      required,
      disabled,
      className,
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
      <Group className={clsx(wrapperClassName, 'pb-2')}>
        {title && <Label className="d-block">{title}</Label>}
        <Control
          {...inputProps}
          ref={ref}
          as={textarea ? 'textarea' : 'input'}
          className={className}
          isInvalid={hasError || isInvalid}
          maxLength={maxLength}
          placeholder={placeholder}
          type={type}
          value={valueFromState || value}
          onChange={handleChange}
          onInput={onInput ? (e: BaseSyntheticEvent) => onInput(e) : () => {}}
          onKeyPress={() => onKeyPress}
        />
        <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
        {externalText && <p className="text--body mt-2">{externalText}</p>}
      </Group>
    );
  },
);

export default InputField;
