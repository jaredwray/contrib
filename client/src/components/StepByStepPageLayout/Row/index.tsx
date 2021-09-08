import React, { FC } from 'react';

import clsx from 'clsx';
import { Col, Row as RbRow } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  title?: string;
  description: React.ReactNode;
  childrenWrapperCLassName?: string;
}

const Row: FC<Props> = ({ title, description, children, childrenWrapperCLassName }) => {
  return (
    <RbRow className={clsx('flex-column flex-md-row', styles.divider)}>
      <Col className="p-0">
        {title && <p className="text-subhead">{title}</p>}
        <p className="text--body">{description}</p>
      </Col>

      <Col className={clsx('pl-md-5', childrenWrapperCLassName)}>{children}</Col>
    </RbRow>
  );
};

export default Row;
