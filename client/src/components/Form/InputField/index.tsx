import { forwardRef, BaseSyntheticEvent, KeyboardEventHandler } from 'react';

import { Form as BsForm } from 'react-bootstrap';

import useField from '../hooks/useField';
import useFieldConstraints from '../hooks/useFieldConstraints';

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
      onKeyPress,
      onInput,
      isInvalid,
    },
    ref,
  ) => {
    const constraints = useFieldConstraints(inputConstraints, required);
    const { hasError, errorMessage, ...inputProps } = useField(name, { constraints, disabled });

    return (
      <Group className={wrapperClassName}>
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
          onInput={onInput ? (e: BaseSyntheticEvent) => onInput(e) : () => {}}
          onKeyPress={onKeyPress}
        />
        <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
        {externalText && <p className="text--body mt-2">{externalText}</p>}
      </Group>
    );
  },
);

export default InputField;
