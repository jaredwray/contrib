import React, { FC } from 'react';

import { ModalFooter } from 'react-bootstrap';

const DialogActions: FC = ({ children }) => <ModalFooter>{children}</ModalFooter>;

export default DialogActions;
