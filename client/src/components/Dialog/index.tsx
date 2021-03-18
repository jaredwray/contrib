import React, { FC } from 'react';

import { Modal } from 'react-bootstrap';

const { Header, Title } = Modal;

interface Props {
  open: boolean;
  onClose(): void;
  title?: string;
  size?: 'sm' | 'lg' | 'xl';
}

const Dialog: FC<Props> = ({ open, onClose, title, children, size }) => {
  return (
    <Modal centered aria-labelledby="contained-modal" show={open} size={size} onHide={onClose}>
      {title && (
        <Header closeButton>
          <Title id="contained-modal">{title}</Title>
        </Header>
      )}
      {children}
    </Modal>
  );
};

export default Dialog;
