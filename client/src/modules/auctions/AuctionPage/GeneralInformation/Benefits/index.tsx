import { FC } from 'react';

import clsx from 'clsx';
import { Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity } from 'src/types/Charity';

import styles from './styles.module.scss';

const Benefits: FC<Charity> = ({ avatarUrl = '', status, name, id, semanticId }) => {
  return (
    <Row className="d-flex align-items-center">
      <Row className="text-label-new">This auction benefits</Row>
      <Row className={clsx(styles.name, 'text-subhead text-sm d-inline-block pt-2')}>
        <div className="d-flex">
          <Image
            roundedCircle
            className={clsx(styles.avatar, 'd-inline-block')}
            src={ResizedImageUrl(avatarUrl, 120)}
          />
          <div className="pl-4">
            <div className="text-body-new">{name}</div>
            <Link className="link" to={`/charity/${semanticId || id}`}>
              Visit charity page and learn more
            </Link>
          </div>
        </div>
      </Row>
    </Row>
  );
};

export default Benefits;
