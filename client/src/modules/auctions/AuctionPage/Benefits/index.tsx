import { FC } from 'react';

import clsx from 'clsx';
import { Image, Col as BsCol, Row as BsRow } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import NotActiveStatus from 'src/components/statuses/NotActiveStatus';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity, CharityStatus } from 'src/types/Charity';

import Row from '../common/Row';
import styles from './styles.module.scss';

const Benefits: FC<Charity> = ({ avatarUrl = '', status, name, id, semanticId }) => {
  const isNotActive = status !== CharityStatus.ACTIVE;
  const charityPagePath = `/charity/${semanticId || id}`;

  return (
    <>
      <Row childrenClassName="d-flex align-items-center" title="This auction benefits">
        <Link
          className={clsx(styles.link, 'text-subhead text-all-cups text-sm break-word d-inline-block')}
          title={name}
          to={charityPagePath}
        >
          <div className="d-flex align-items-center">
            <Image
              roundedCircle
              className={clsx(styles.avatar, 'd-inline-block')}
              src={ResizedImageUrl(avatarUrl, 120)}
            />
            <span className="pl-4">{name}</span>
          </div>
        </Link>
        {isNotActive && <NotActiveStatus />}
      </Row>
      <BsRow className="pt-4">
        <BsCol>
          <Link className={clsx(styles.link, 'text-label text-all-cups')} to={charityPagePath}>
            other auctions benefiting this charity &gt;&gt;
          </Link>
        </BsCol>
      </BsRow>
    </>
  );
};

export default Benefits;
