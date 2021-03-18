import { FC, ReactElement } from 'react';

import clsx from 'clsx';

import { Auction } from 'src/types/Auction';

import Row from '../common/Row';
import Status from './Status';
import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const About: FC<Props> = ({ auction }): ReactElement => {
  return (
    <Row title="About this item">
      <div className="text--body">{auction.fullPageDescription}</div>
      <div className={clsx(styles.details, 'pt-4 text-label')}>
        <Status text="Signed" value={auction.autographed} />
        <Status text="Certificate included" value={auction.authenticityCertificate} />
        <Status text="Game worn" value={auction.gameWorn} />
      </div>
    </Row>
  );
};

export default About;
