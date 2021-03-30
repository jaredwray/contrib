import React, { FC } from 'react';

import { Form as BsForm } from 'react-bootstrap';

import useField from '../hooks/useField';
import useFieldConstraints from '../hooks/useFieldConstraints';

import './styles.scss';

const { Switch } = BsForm;

interface Props {
  name: string;
  title: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  constraints?: { [key: string]: any };
}

const SwitchField: FC<Props> = ({ name, title, required, disabled, className, constraints: inputConstraints }) => {
  const constraints = useFieldConstraints(inputConstraints, required);
  const { hasError, errorMessage, ...inputProps } = useField(name, { constraints, disabled, type: 'checkbox' });

  return (
    <Switch custom id={name} label={title} {...inputProps} bsCustomPrefix="custom-switch2" className={className} />
  );
};

export default SwitchField;
