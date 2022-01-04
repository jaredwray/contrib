import React, { FC, useCallback, useMemo } from 'react';

import { FORM_ERROR } from 'final-form';
import { Form as FinalForm } from 'react-final-form';
import { validate as validateJs } from 'validate.js';

interface Props {
  constraints?: any;
  initialValues?: object;
  onSubmit(data: object): void;
  className?: string;
}

const Form: FC<Props> = ({ constraints, children, initialValues = {}, onSubmit, className }) => {
  const validate = useMemo(() => {
    if (constraints) {
      return (values: object) => {
        if (!constraints) return null;

        return validateJs(values, constraints);
      };
    }
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

  return (
    <FinalForm initialValues={initialValues} validate={validate} onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <form className={className} onSubmit={handleSubmit}>
          {children}
        </form>
      )}
    </FinalForm>
  );
};

export default Form;
