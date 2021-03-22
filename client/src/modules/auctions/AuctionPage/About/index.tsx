import { FC, ReactElement } from 'react';

import clsx from 'clsx';

import { Auction } from 'src/types/Auction';

import Row from '../common/Row';
import Status from './Status';
import styles from './styles.module.scss';

const About: FC<Auction> = ({ fullPageDescription, autographed, authenticityCertificate, gameWorn }): ReactElement => {
  return (
    <Row title="About this item">
      <div className="text--body break-word">{fullPageDescription}</div>
      <div className={clsx(styles.details, 'pt-4 text-label')}>
        <Status text="Signed" value={autographed} />
        <Status text="Certificate included" value={authenticityCertificate} />
        <Status text="Game worn" value={gameWorn} />
      </div>
    </Row>
  );
};

export default About;
