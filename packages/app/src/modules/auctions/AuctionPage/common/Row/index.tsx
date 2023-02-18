import React, { FC } from 'react';

import clsx from 'clsx';
import { Col, Row as RbRow } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  title: string;
  childrenClassName?: string;
}

const Row: FC<Props> = ({ title, children, childrenClassName }) => {
  return (
    <>
      <br />
      <RbRow className={clsx(styles.container, 'pt-4')}>
        <Col className="text-label label-with-separator">{title}</Col>
      </RbRow>
      <RbRow>
        <Col className={childrenClassName}>{children}</Col>
      </RbRow>
    </>
  );
};

export default Row;
