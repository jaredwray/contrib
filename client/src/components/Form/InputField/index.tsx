import React, { FC } from 'react';

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
}

const InputField: FC<Props> = ({
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
}) => {
  const constraints = useFieldConstraints(inputConstraints, required);
  const { hasError, errorMessage, ...inputProps } = useField(name, { constraints, disabled });

  return (
    <Group className={wrapperClassName}>
      {title && <Label className="d-block">{title}</Label>}
      <Control
        {...inputProps}
        as={textarea ? 'textarea' : 'input'}
        className={className}
        isInvalid={hasError}
        placeholder={placeholder}
        type={type}
      />
      <Control.Feedback type="invalid">{errorMessage}</Control.Feedback>
      {externalText && <p className="text--body mt-2">{externalText}</p>}
    </Group>
  );
};

export default InputField;
