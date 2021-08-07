import { FC } from 'react';

import clsx from 'clsx';
import { Image, Col as BsCol, Row as BsRow } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import NotActiveStatus from 'src/components/statuses/NotActiveStatus';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity, CharityStatus } from 'src/types/Charity';

import Row from '../common/Row';
import styles from './styles.module.scss';

const Benefits: FC<Charity> = ({ avatarUrl = '', status, name, id }) => {
  const isNotActive = status !== CharityStatus.ACTIVE;

  return (
    <>
      <Row childrenClassName="d-flex align-items-center" title="This auction benefits">
        <div className="align-middle">
          <Link
            className={clsx(styles.link, 'text-subhead text-all-cups text-sm break-word d-inline-block')}
            title={name}
            to={`/charity/${id}`}
          >
            <Image
              roundedCircle
              className={clsx(styles.avatar, 'd-inline-block')}
              src={ResizedImageUrl(avatarUrl, 120)}
            />
            <span className="pl-4">{name}</span>
          </Link>
          {isNotActive && <NotActiveStatus />}
        </div>
      </Row>
      <BsRow className="pt-4">
        <BsCol>
          <Link className={clsx(styles.link, 'text-label text-all-cups text-nowrap')} to={`/charity/${id}`}>
            other auctions benefiting this charity &gt;&gt;
          </Link>
        </BsCol>
      </BsRow>
    </>
  );
};

export default Benefits;
