import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Row from '../../common/Row';
import styles from './styles.module.scss';

const Author: FC<InfluencerProfile> = ({ id, name, avatarUrl }): ReactElement => {
  return (
    <Row childrenClassName="d-flex align-items-center" title="Auction by">
      <div className={clsx(styles.name, 'text-subhead text-sm break-word d-inline-block')} title={name}>
        <div className="d-flex align-items-center">
          <Image
            roundedCircle
            className={clsx(styles.avatar, 'd-inline-block')}
            src={ResizedImageUrl(avatarUrl, 120)}
          />
          <div>
            <div className="pl-4 ">{name}</div>
            <Link className={clsx('text-label text-all-cups')} to={`/profiles/${id}`}>
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </Row>
  );
};

export default Author;
