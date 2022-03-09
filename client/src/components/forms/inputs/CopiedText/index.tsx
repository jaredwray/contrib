import { FC, useState } from 'react';

import clsx from 'clsx';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styles from './styles.module.scss';

interface Props {
  text: string;
  deliveryPage?: boolean;
}

const CopiedText: FC<Props> = ({ text, deliveryPage }: Props) => {
  const [copied, setCopied] = useState(false);

  return (
    <Form>
      <InputGroup>
        <Form.Control
          disabled
          className={clsx(styles.copyInput, deliveryPage && styles.copyInputOnDeliveryPage)}
          type="text"
          value={text}
        />
        <div className="input-group-append">
          <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
            <Button className={styles.copyBtn}>{(copied && 'Copied') || 'Copy'}</Button>
          </CopyToClipboard>
        </div>
      </InputGroup>
    </Form>
  );
};

export default CopiedText;
