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
    <Row className="text-sm p-0 pe-1">
      <Col className="d-flex justify-content-center justify-content-lg-end p-0">
        <div>
          <Image className={clsx(styles.icon, 'pt-1')} src={icon} />
        </div>
        <div className={clsx(styles.wrapper, 'ps-2 text-lg-end text-center')}>
          <div className={clsx(styles.title, 'text-all-cups')}>{title}</div>
          <div className="text-subhead">
            {link ? (
              <Link className={styles.link} to={link}>
                {firstValue}
              </Link>
            ) : (
              firstValue
            )}
          </div>
          {secondValue && <div className={clsx(styles.secondValue, 'text-label text-uppercase')}>{secondValue}</div>}
        </div>
      </Col>
    </Row>
  );
};
