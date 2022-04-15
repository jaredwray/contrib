import { ReactElement } from 'react';

import clsx from 'clsx';
import { Col, Row, Image, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { DEFAULT_AVATAR_PATH } from 'src/constants';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';

import styles from './styles.module.scss';

interface PropTypes {
  title: string;
  icon: string;
  avatar?: string;
  firstValue: string | undefined;
  secondValue: string | undefined;
  link?: string;
}

export const TotalAmount = ({ title, secondValue, firstValue, icon, link, avatar }: PropTypes): ReactElement => {
  const withIcon = [DEFAULT_AVATAR_PATH, undefined].includes(avatar);

  return (
    <Row className="text-sm">
      <Col className="d-flex justify-content-center p-0 flex-column text-center">
        <div className={clsx(styles.wrapper, 'p-0 text-center')}>
          <div className={clsx(styles.title, 'text-all-cups')}>{title}</div>
          <div className={clsx(withIcon ? styles.withIcon : styles.withoutIcon, 'pt-2')}>
            <Image roundedCircle={!withIcon} src={withIcon ? icon : ResizedImageUrl(avatar, 32)} />
          </div>
          <div className={clsx(styles.firstValueWrapper, 'text-truncate m-auto')}>
            {link ? (
              <Link className={styles.link} to={link}>
                {firstValue}
              </Link>
            ) : (
              firstValue
            )}
          </div>
          {secondValue ? (
            <div className={clsx(styles.secondValue, 'text-uppercase')}>{secondValue}</div>
          ) : (
            <Spinner animation="border" className={styles.spinner} />
          )}
        </div>
      </Col>
    </Row>
  );
};
