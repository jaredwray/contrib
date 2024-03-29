import React, { FC } from 'react';

import clsx from 'clsx';
import { Col, Row as RbRow } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  title?: string;
  description: React.ReactNode;
  childrenWrapperClassName?: string;
}

const Row: FC<Props> = ({ title, description, children, childrenWrapperClassName }) => {
  return (
    <RbRow className={clsx('flex-column flex-md-row', styles.divider)}>
      <Col className="p-0">
        {title && <p className="text-subhead">{title}</p>}
        <p className="text--body">{description}</p>
      </Col>

      <Col className={clsx('p-0 ps-md-5', childrenWrapperClassName)}>{children}</Col>
    </RbRow>
  );
};

export default Row;
