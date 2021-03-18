import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import VerifiedStatus from 'src/components/VerifiedStatus';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Row from '../common/Row';
import styles from './styles.module.scss';

const Author: FC<InfluencerProfile> = ({ name, avatarUrl }): ReactElement => {
  return (
    <Row title="This auction by">
      <div className="d-table">
        <Image roundedCircle className={clsx(styles.avatar, 'd-table-cell')} src={ResizedImageUrl(avatarUrl, 120)} />
        <div className={clsx(styles.info, 'pl-4 d-table-cell align-middle')}>
          <div className="text-subhead text-all-cups text-sm text-nowrap">{name}</div>
          <VerifiedStatus />
        </div>
      </div>
    </Row>
  );
};

export default Author;
