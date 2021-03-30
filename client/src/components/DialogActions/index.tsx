import React, { FC } from 'react';

import clsx from 'clsx';
import { ModalFooter } from 'react-bootstrap';

interface Props {
  className?: string;
}

const DialogActions: FC<Props> = ({ children, className }) => (
  <ModalFooter className={clsx('flex-row flex-wrap flex-sm-nowrap', className)}>{children}</ModalFooter>
);

export default DialogActions;
