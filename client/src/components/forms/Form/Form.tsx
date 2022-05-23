import React, { FC, useCallback, useMemo, useRef } from 'react';

import { FORM_ERROR } from 'final-form';
import { Form as BSForm } from 'react-bootstrap';
import { Form as FinalForm } from 'react-final-form';
import { validate as validateJs } from 'validate.js';

import { VALID_PHONENUMBER_LENGTH } from 'src/constants';

interface Props {
  constraints?: any;
  initialValues?: object;
  onSubmit(data: object): void;
  className?: string;
  onFill?: () => void;
  onUnfill?: () => void;
  requiredFields?: string[];
}

const Form: FC<Props> = ({
  constraints,
  children,
  initialValues = {},
  onSubmit,
  className,
  onFill,
  onUnfill,
  requiredFields = [],
}) => {
  const formRef = useRef<any>();

  const validate = useMemo(() => {
    if (!constraints) return;

    return (values: object) => {
      if (!constraints) return null;

      return validateJs(values, constraints);
    };
  }, [constraints]);

  const handleSubmit = useCallback(
    async (formData) => {
      try {
        await onSubmit(formData);
      } catch (error) {
        if (error.baseError || error.fieldErrors) {
          return {
            [FORM_ERROR]: error.baseError,
            ...error.fieldErrors,
          };
        }

        return {
          [FORM_ERROR]: 'Something went wrong, please try again later',
        };
      }
    },
    [onSubmit],
  );

  const onChange = useCallback(() => {
    const formData = new FormData(formRef.current);
    const values = Object.fromEntries(formData);
    const completedFields = Object.keys(values).filter((key) => {
      const value = values[key].toString().trim();
      if (key === 'phoneNumber') {
        const isInvalid = formRef.current.querySelector('input[name="phoneNumber"].invalid-number');
        if (isInvalid) return false;

        return value && value.replaceAll(/[^0-9]/g, '').length >= VALID_PHONENUMBER_LENGTH;
      }

      return !!value;
    });
    const missedFields = requiredFields.filter((field) => !completedFields.includes(field));
    const completed = missedFields.length > 0;

    completed ? onUnfill && onUnfill() : onFill && onFill();
  }, [requiredFields, formRef, onUnfill, onFill]);

  return (
    <FinalForm initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <BSForm ref={formRef} className={className} onChange={onChange} onSubmit={handleSubmit}>
          {children}
        </BSForm>
      )}
    </FinalForm>
  );
};

export default Form;
