import { FC } from 'react';

import clsx from 'clsx';
import { Button } from 'react-bootstrap';
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
    <CopyToClipboard text={link} onCopy={() => showMessage('link copied')}>
      <div className={clsx(styles.container, 'mt-3 pt-3 pb-3 d-table align-middle w-100')}>
        <Button className={clsx(styles.button)} variant="link">
          <div>
            <ShareIcon />
          </div>
        </Button>
        <div className="d-table-cell pl-4 align-middle">
          <div className={clsx(styles.text, 'text-subhead')}>Share this auction</div>
        </div>
      </div>
    </CopyToClipboard>
  );
};

export default ShareBtn;
