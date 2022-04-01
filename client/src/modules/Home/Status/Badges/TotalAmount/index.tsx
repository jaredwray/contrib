import { ReactElement } from 'react';

import clsx from 'clsx';
import { Col, Row, Image } from 'react-bootstrap';

import styles from './styles.module.scss';

interface PropTypes {
  title: string;
  value: string | undefined;
  icon: string;
  info?: string;
}

export const TotalAmount = ({ title, info, value, icon }: PropTypes): ReactElement => {
  return (
    <Row className="text-sm p-0">
      <Col className="d-flex p-0 justify-content-center justify-content-md-end">
        <div>
          <Image className="pt-1" src={icon} />
        </div>
        <div className={clsx(styles.wrapper, 'ps-3 text-md-end text-center')}>
          <div className={clsx(styles.title, 'text-all-cups')}>{title}</div>
          <div className="text-subhead">{value}</div>
          {info && <div className={clsx(styles.info, 'text-label')}>{info}</div>}
        </div>
      </Col>
    </Row>
  );
};
