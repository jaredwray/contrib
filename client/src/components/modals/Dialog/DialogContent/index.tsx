import React, { FC } from 'react';

import { ModalBody } from 'react-bootstrap';

interface Props {
  children?: any;
  className?: string;
}

const DialogContent: FC<Props> = ({ children, className }) => <ModalBody className={className}>{children}</ModalBody>;

export default DialogContent;
