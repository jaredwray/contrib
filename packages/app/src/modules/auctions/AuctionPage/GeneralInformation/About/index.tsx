import { FC, ReactElement } from 'react';

import { Row } from 'react-bootstrap';

import { ReadMore } from 'src/components/buttons/ReadMoreButton';
import { Auction } from 'src/types/Auction';

const About: FC<Auction> = ({ description }): ReactElement => {
  return (
    <div className="pt-2">
      <Row className="text-label-new p-0">About this item</Row>
      <Row className="text-body-new pt-2">
        <ReadMore linkClassName="link" text={description} />
      </Row>
    </div>
  );
};

export default About;
