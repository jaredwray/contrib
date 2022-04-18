import { FC } from 'react';

import { Modal, ModalProps } from 'react-bootstrap';

const { Header, Title } = Modal;

interface Props extends ModalProps {
  className?: string;
  classNameHeader?: string;
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'lg' | 'xl';
  withCloseButton?: boolean;
}

const Dialog: FC<Props> = ({
  className,
  classNameHeader,
  open,
  onClose,
  title,
  children,
  size,
  withCloseButton,
  ...rest
}) => {
  return (
    <Modal
      centered
      aria-labelledby="contained-modal"
      className={className}
      show={open}
      size={size}
      onHide={onClose}
      {...rest}
    >
      {title && (
        <Header className={classNameHeader} closeButton={withCloseButton ?? true}>
          <Title id="contained-modal">{title}</Title>
        </Header>
      )}
      {children}
    </Modal>
  );
};

export default Dialog;
