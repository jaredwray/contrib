import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

const Author: FC<InfluencerProfile> = ({ id, name, avatarUrl }): ReactElement => {
  return (
    <Row className="d-flex align-items-center mb-3">
      <Row className="text-label-new p-0">Auction by</Row>
      <Row className="text-sm d-inline-block pt-2 p-0">
        <div className="d-flex p-0">
          <Image
            roundedCircle
            className={clsx(styles.avatar, 'd-inline-block')}
            src={ResizedImageUrl(avatarUrl, 120)}
          />
          <div className="ps-3">
            <div className="text-body-new">{name}</div>
            <Link className="link" to={`/profiles/${id}`}>
              View Profile
            </Link>
          </div>
        </div>
      </Row>
    </Row>
  );
};

export default Author;
