import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import VerifiedStatus from 'src/components/VerifiedStatus';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Row from '../common/Row';
import styles from './styles.module.scss';

const Author: FC<InfluencerProfile> = ({ id, name, avatarUrl }): ReactElement => {
  return (
    <Row childrenClassName="d-flex align-items-center" title="This auction by">
      <Image roundedCircle className={clsx(styles.avatar, 'd-inline-block')} src={ResizedImageUrl(avatarUrl, 120)} />
      <div className={'pl-4 align-middle'}>
        <Link
          className={clsx(styles.name, 'text-subhead text-all-cups text-sm  break-word')}
          title={name}
          to={`/profiles/${id}`}
        >
          {name}
        </Link>
        <VerifiedStatus />
      </div>
    </Row>
  );
};

export default Author;
