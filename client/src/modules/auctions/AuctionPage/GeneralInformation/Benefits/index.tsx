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
      <Row>This auction benefits</Row>
      <Row className={clsx(styles.name, 'text-subhead text-sm break-word d-inline-block pt-2')} title={name}>
        <div className="d-flex align-items-center">
          <Image
            roundedCircle
            className={clsx(styles.avatar, 'd-inline-block')}
            src={ResizedImageUrl(avatarUrl, 120)}
          />
          <div className="pl-4">
            <div>{name}</div>
            <Link className={clsx('text-label link')} to={`/charity/${semanticId || id}`}>
              Visit charity page and learn more
            </Link>
          </div>
        </div>
      </Row>
    </Row>
  );
};

export default Benefits;
