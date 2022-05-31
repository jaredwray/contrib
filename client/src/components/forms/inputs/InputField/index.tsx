import { forwardRef, BaseSyntheticEvent, KeyboardEventHandler, useCallback, useEffect } from 'react';

import clsx from 'clsx';
import { Form as BsForm } from 'react-bootstrap';

import useField from '../../Form/hooks/useField';
import useFieldConstraints from '../../Form/hooks/useFieldConstraints';
import styles from './styles.module.scss';

const { Group, Label, Control } = BsForm;

interface Props {
  name: string;
  title?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
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
  hidden?: boolean;
  displayError?: boolean;
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
      hidden = false,
      displayError = true,
      setValueToState,
    },
    ref,
  ) => {
    const constraints = useFieldConstraints(inputConstraints, required);
    const { hasError, errorMessage, value, onChange, ...inputProps } = useField(name, {
      constraints,
      disabled,
    });

    const updateValue = useCallback(
      (value) => {
        onChange(value);

        if (setValueToState) setValueToState(name, value);
      },
      [name, setValueToState, onChange],
    );

    const handleChange = useCallback((e) => updateValue(e.target.value), [updateValue]);

    useEffect(() => {
      hidden && updateValue(valueFromState || value);
    }, [hidden, updateValue, valueFromState, value]);

    return (
      <Group className={clsx(wrapperClassName, !hidden && 'pb-2')}>
        {title && <Label className="d-block">{title}</Label>}
        <Control
          {...inputProps}
          ref={ref}
          as={textarea ? 'textarea' : 'input'}
          className={clsx(
            styles.input,
            !displayError && styles.inputWithoutError,
            textarea && styles.textarea,
            className,
          )}
          isInvalid={hasError || isInvalid}
          maxLength={maxLength}
          placeholder={placeholder}
          type={hidden ? 'hidden' : type}
          value={valueFromState || value}
          onChange={handleChange}
          onInput={onInput ? (e: BaseSyntheticEvent) => onInput(e) : () => {}}
          onKeyPress={() => onKeyPress}
        />
        {!hidden && displayError && (
          <Control.Feedback className={errorClassName} type="invalid">
            {errorMessage || (isInvalid && 'invalid')}
          </Control.Feedback>
        )}
        {externalText && <p className="text--body mt-2">{externalText}</p>}
      </Group>
    );
  },
);

export default InputField;
