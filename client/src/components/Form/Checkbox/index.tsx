import React, { ReactElement, FC } from 'react';

import { Form as BsForm } from 'react-bootstrap';

import useField from '../hooks/useField';
import useFieldConstraints from '../hooks/useFieldConstraints';

import './styles.scss';

interface Props {
  constraints?: { [key: string]: any };
  checked?: boolean;
  required?: boolean;
  name: string;
  label?: ReactElement | string;
  disabled?: boolean;
  wrapperClassName?: string;
}

const Checkbox: FC<Props> = ({
  disabled,
  name,
  required,
  label,
  checked,
  wrapperClassName,
  constraints: checkboxConstraints,
}) => {
  const constraints = useFieldConstraints(checkboxConstraints, required);
  const { hasError, errorMessage, type, ...checkboxProps } = useField(name, {
    constraints,
    disabled,
    type: 'checkbox',
  });

  return (
    <BsForm.Group className={wrapperClassName}>
      <BsForm.Check
        {...checkboxProps}
        custom
        className="clickable d-inline-block"
        id={name}
        label={label}
        name={name}
        required={required}
      />
    </BsForm.Group>
  );
};

export default Checkbox;
