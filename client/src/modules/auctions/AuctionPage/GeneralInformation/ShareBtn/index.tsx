import { FC } from 'react';

import clsx from 'clsx';
import { Row, Col } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import ShareIcon from 'src/assets/icons/ShareIcon';
import { useShowNotification } from 'src/helpers/useShowNotification';

import styles from './styles.module.scss';

interface Props {
  link: string;
}

const ShareBtn: FC<Props> = ({ link }) => {
  const { showMessage } = useShowNotification();

  return (
    <Row>
      <Col className={clsx(styles.shareBtn, 'text-body-new')}>
        Spread the word, make an impact!
        <CopyToClipboard text={link} onCopy={() => showMessage('link copied')}>
          <div className="link">Share this auction with others</div>
        </CopyToClipboard>
      </Col>
      <CopyToClipboard text={link} onCopy={() => showMessage('link copied')}>
        <Col className="clickable" xs="1">
          <ShareIcon />
        </Col>
      </CopyToClipboard>
    </Row>
  );
};

export default ShareBtn;
