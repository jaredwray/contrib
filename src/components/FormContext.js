import React, { useState } from 'react';

const FormContext = React.createContext([{}, () => {}]);

const FormProvider = (props) => {
  const [state, setState] = useState({});
  return (
    <FormContext.Provider value={[state, setState]}>
      {props.children}
    </FormContext.Provider>
  );
}

export { FormContext, FormProvider };