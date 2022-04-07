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
      <Row className="text-label-new p-0">This auction benefits</Row>
      <Row className="text-sm d-inline-block pt-2 p-0">
        <div className="d-flex p-0">
          <Image
            roundedCircle
            className={clsx(styles.avatar, 'd-inline-block')}
            src={ResizedImageUrl(avatarUrl, 120)}
          />
          <div className="ps-3">
            <div className="text-body-new text-all-cups fw-normal">{name}</div>
            <Link className="link" to={`/charity/${semanticId || id}`}>
              Visit charity page
            </Link>
          </div>
        </div>
      </Row>
    </Row>
  );
};

export default Benefits;
