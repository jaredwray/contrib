import { FC } from 'react';

import { Row, Col } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ShareIcon from 'src/assets/icons/ShareIcon';
import { useShowNotification } from 'src/helpers/useShowNotification';

interface Props {
  link: string;
}

const ShareBtn: FC<Props> = ({ link }) => {
  const { showMessage } = useShowNotification();

  return (
    <CopyToClipboard text={link} onCopy={() => showMessage('link copied')}>
      <Row className="clickable">
        <Col>
          Spread the word, make an impact!
          <div className="link">Share this auction with others</div>
        </Col>
        <Col xs="1">
          <ShareIcon />
        </Col>
      </Row>
    </CopyToClipboard>
  );
};

export default ShareBtn;
