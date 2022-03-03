import { FC, ReactElement } from 'react';

import { Row } from 'react-bootstrap';

import { Auction } from 'src/types/Auction';

const About: FC<Auction> = ({ description }): ReactElement => {
  return (
    <Row className="d-flex align-items-center pt-2">
      <Row>About this item</Row>
      <div className="text--body break-word pt-2">{description}</div>
      <div className="link pt-2">Read More</div>
    </Row>
  );
};

export default About;
