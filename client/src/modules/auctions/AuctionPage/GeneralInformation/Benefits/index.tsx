import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import NotActiveStatus from 'src/components/statuses/NotActiveStatus';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity, CharityStatus } from 'src/types/Charity';

import Row from '../../common/Row';
import styles from './styles.module.scss';

const Benefits: FC<Charity> = ({ avatarUrl = '', status, name, id, semanticId }) => {
  const isNotActive = status !== CharityStatus.ACTIVE;
  const charityPagePath = `/charity/${semanticId || id}`;

  return (
    <Row
      childrenClassName="d-flex align-items-center text-subhead text-sm break-word d-inline-block"
      title="This auction benefits"
    >
      <div className="d-flex align-items-center">
        <Image roundedCircle className={clsx(styles.avatar, 'd-inline-block')} src={ResizedImageUrl(avatarUrl, 120)} />
        <div>
          <div className="pl-4">{name}</div>
          <Link className={clsx(styles.link, 'text-label')} to={charityPagePath}>
            Visit charity page and learn more
          </Link>
        </div>
      </div>
      {isNotActive && <NotActiveStatus />}
    </Row>
  );
};

export default Benefits;
