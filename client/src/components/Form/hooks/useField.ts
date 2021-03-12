import { useMemo } from 'react';

import { useField as useFieldFinalForm } from 'react-final-form';
import { single } from 'validate.js';

interface ConfigProps {
  constraints?: { [x: string]: any } | null;
  disabled?: boolean;
  type?: string;
}

const useField = (name: string, { constraints, disabled, type }: ConfigProps) => {
  const validate = useMemo(() => {
    if (constraints) {
      return (value: { [x: string]: any }) => single(value, constraints);
    }
    return null;
  }, [constraints]);

  const fieldConfig: { [x: string]: any } = { validate };

  if (type) {
    Object.assign(fieldConfig, { type });
  }

  const {
    input,
    meta: { submitting, touched, submitFailed, error, submitError },
  } = useFieldFinalForm(name, fieldConfig);

  const hasVisibleErrorState = Boolean((error && (touched || submitFailed)) || submitError);
  const visibleErrorMessage = (hasVisibleErrorState && (submitError || error)) || null;

  return {
    ...input,
    disabled: Boolean(disabled || submitting),
    hasError: hasVisibleErrorState,
    errorMessage: visibleErrorMessage,
  };
};

export default useField;
