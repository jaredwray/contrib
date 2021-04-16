import { FC, MouseEventHandler, ReactElement } from 'react';

import clsx from 'clsx';
import { Button, ButtonGroup } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  service: string;
  icon: ReactElement;
  href?: string;
  onClick?: MouseEventHandler;
}

const ShareButton: FC<Props> = ({ service, onClick, icon, href }): ReactElement => {
  return (
    <ButtonGroup className="mb-2 w-100">
      <Button
        as={(href && 'a') || undefined}
        className={clsx(styles.button, styles.buttonIcon)}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        onClick={onClick}
      >
        {icon}
      </Button>
      <Button
        as={(href && 'a') || undefined}
        className={clsx(styles.button, styles.shareButton, 'text-label pl-4 pl-md-5')}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
        variant="secondary"
        onClick={onClick}
      >
        Share on {service}
      </Button>
    </ButtonGroup>
  );
};

export default ShareButton;
