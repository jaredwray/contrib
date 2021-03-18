import React, { FC } from 'react';

import clsx from 'clsx';
import { Col, Row as RbRow } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  title: string;
}

const Row: FC<Props> = ({ title, children }) => {
  return (
    <>
      <br />
      <RbRow className={clsx(styles.container, 'pt-4')}>
        <Col className="text-label label-with-separator">{title}</Col>
      </RbRow>
      <RbRow>
        <Col>{children}</Col>
      </RbRow>
    </>
  );
};

export default Row;
