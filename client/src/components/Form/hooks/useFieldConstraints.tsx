import { useMemo } from 'react';

const useFieldConstraints = (constraints?: { [x: string]: any }, required?: boolean): { [x: string]: any } | null => {
  return useMemo(() => {
    const allConstraints = {
      ...constraints,
    };

    if (required) {
      Object.assign(allConstraints, {
        presence: { allowEmpty: false },
      });
    }

    if (allConstraints.length) {
      return null;
    }

    return allConstraints;
  }, [constraints, required]);
};

export default useFieldConstraints;
