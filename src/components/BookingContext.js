import React, { useState } from 'react';

const BookingContext = React.createContext([{}, () => { }]);

const BookingProvider = (props) => {
  const [state, setState] = useState({});
  return (
    <BookingContext.Provider value={[state, setState]}>
      {props.children}
    </BookingContext.Provider>
  );
}

export { BookingContext, BookingProvider };