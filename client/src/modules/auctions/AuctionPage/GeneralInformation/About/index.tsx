import { FC, ReactElement } from 'react';

import { Row } from 'react-bootstrap';

import { ReadMore } from 'src/components/buttons/ReadMoreButton';
import { Auction } from 'src/types/Auction';

const About: FC<Auction> = ({ description }): ReactElement => {
  return (
    <Row className="d-flex align-items-center pt-4">
      <Row className="text-label-new">About this item</Row>
      <ReadMore linkClassName="link" text={description} textClassName="text-body-new pt-2" />
    </Row>
  );
};

export default About;
