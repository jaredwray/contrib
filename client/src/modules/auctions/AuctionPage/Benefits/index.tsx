import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity } from 'src/types/Charity';

import Row from '../common/Row';
import styles from './styles.module.scss';

const Benefits: FC<Charity> = ({ avatarUrl = '', name, id }) => {
  return (
    <Row childrenClassName="pb-4 pb-sm-0" title="This auction benefits">
      <Link className="d-flex align-items-center" to={`/charity/${id}`}>
        <Image roundedCircle className={clsx(styles.image)} src={ResizedImageUrl(avatarUrl, 120)} />
        <div className={'text-subhead text-all-cups align-middle pl-4 break-word'}>{name}</div>
      </Link>
      <br />
      <Link className={clsx(styles.link, 'text-label text-all-cups text-nowrap')} to={`/charity/${id}`}>
        other auctions benefiting this charity &gt;&gt;
      </Link>
    </Row>
  );
};

export default Benefits;
