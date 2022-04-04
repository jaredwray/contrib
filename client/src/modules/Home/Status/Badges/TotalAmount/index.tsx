import { ReactElement } from 'react';

import clsx from 'clsx';
import { Col, Row, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

interface PropTypes {
  title: string;
  icon: string;
  firstValue: string | undefined;
  secondValue: string | undefined;
  link?: string;
}

export const TotalAmount = ({ title, secondValue, firstValue, icon, link }: PropTypes): ReactElement => {
  return (
    <Row className="text-sm pb-4">
      <Col className="d-flex justify-content-center p-0 flex-column text-center">
        <div className="pb-2">
          <Image className={clsx(styles.icon, 'pt-1')} src={icon} />
        </div>
        <div className={clsx(styles.wrapper, 'p-0 text-center')}>
          <div className={clsx(styles.title, 'text-all-cups')}>{title}</div>
          <div className={clsx(styles.firstValueWrapper, 'text-truncate m-auto')}>
            {link ? (
              <Link className={styles.link} to={link}>
                {firstValue}
              </Link>
            ) : (
              firstValue
            )}
          </div>
          {secondValue && <div className={clsx(styles.secondValue, 'text-uppercase')}>{secondValue}</div>}
        </div>
      </Col>
    </Row>
  );
};
