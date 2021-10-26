import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Row from '../common/Row';
import styles from './styles.module.scss';

const Author: FC<InfluencerProfile> = ({ id, name, avatarUrl }): ReactElement => {
  return (
    <Row childrenClassName="d-flex align-items-center" title="This auction by">
      <Link
        className={clsx(styles.name, 'text-subhead text-all-cups text-sm break-word d-inline-block')}
        title={name}
        to={`/profiles/${id}`}
      >
        <div className="d-flex align-items-center">
          <Image
            roundedCircle
            className={clsx(styles.avatar, 'd-inline-block')}
            src={ResizedImageUrl(avatarUrl, 120)}
          />
          <span className="pl-4 ">{name}</span>
        </div>
      </Link>
    </Row>
  );
};

export default Author;
