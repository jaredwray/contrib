import { FC } from 'react';

import { Spinner } from 'react-bootstrap';

const Loading: FC = () => {
  return (
    <>
      <span>...Loading</span>
      <Spinner animation="border" className="ml-2" />
    </>
  );
};

export default Loading;
