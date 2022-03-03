import { FC, ReactElement } from 'react';

import { Row, Button } from 'react-bootstrap';

import Dialog from 'src/components/modals/Dialog';
import DialogActions from 'src/components/modals/Dialog/DialogActions';
import DialogContent from 'src/components/modals/Dialog/DialogContent';

interface Props {
  open: boolean;
  onClose: () => void;
  text: string;
  title: string;
}

const InformationModal: FC<Props> = ({ open, onClose, text, title }): ReactElement => {
  return (
    <Dialog backdrop="static" keyboard={false} open={open} title={title} onClose={onClose}>
      <DialogContent className="pt-0 pb-0">
        <Row>{text}</Row>
      </DialogContent>

      <DialogActions className="d-block pt-0 pt-sm-2">
        <Button className="float-right" size="sm" variant="link" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InformationModal;
