import { FC, ReactElement } from 'react';

import { Auction } from 'src/types/Auction';

import Row from '../../common/Row';

const About: FC<Auction> = ({ description }): ReactElement => {
  return (
    <Row title="About this item">
      <div className="text--body break-word">{description}</div>
    </Row>
  );
};

export default About;
