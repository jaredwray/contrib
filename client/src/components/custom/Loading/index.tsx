import { FC } from 'react';

import { Spinner } from 'react-bootstrap';

const Loading: FC = () => {
  return (
    <>
      <span className="text-label">... Loading</span>
      <Spinner animation="border" className="ms-2" size="sm" />
    </>
  );
};

export default Loading;
