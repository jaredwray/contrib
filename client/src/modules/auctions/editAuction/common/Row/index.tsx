import React, { FC } from 'react';

import clsx from 'clsx';
import { Col, Row as RbRow } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  title?: string;
  withTitleSeparator?: boolean;
  description: React.ReactNode;
  childrenWrapperClassName?: string;
  renderRemoveButton?: (() => JSX.Element) | false;
}

const Row: FC<Props> = ({
  title,
  description,
  children,
  childrenWrapperClassName,
  withTitleSeparator,
  renderRemoveButton,
}) => {
  return (
    <RbRow className={clsx('flex-column flex-md-row', styles.divider)}>
      <Col className="p-0">
        {title && <p className={`text-subhead ${withTitleSeparator ? 'label-with-separator' : ''}`}>{title}</p>}
        <p className="text--body">{description}</p>
        {renderRemoveButton && renderRemoveButton()}
      </Col>

      <Col className={clsx('pl-md-5', childrenWrapperClassName)}>{children}</Col>
    </RbRow>
  );
};

export default Row;
