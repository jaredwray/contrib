import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

const Author: FC<InfluencerProfile> = ({ id, name, avatarUrl }): ReactElement => {
  return (
    <Row className="d-flex align-items-center">
      <Row>Auction by</Row>
      <Row className={clsx(styles.name, 'text-subhead text-sm break-word d-inline-block pt-2')} title={name}>
        <div className="d-flex align-items-center">
          <Image
            roundedCircle
            className={clsx(styles.avatar, 'd-inline-block')}
            src={ResizedImageUrl(avatarUrl, 120)}
          />
          <div className="pl-4">
            <div>{name}</div>
            <Link className={clsx('text-label link')} to={`/profiles/${id}`}>
              View Profile
            </Link>
          </div>
        </div>
      </Row>
    </Row>
  );
};

export default Author;
