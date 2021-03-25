import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Button, ButtonGroup } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  service: string;
  icon: ReactElement;
}

const ShareButton: FC<Props> = ({ service, icon }): ReactElement => {
  return (
    <ButtonGroup className="mb-2 w-100">
      <Button className={clsx(styles.buttonIcon)} size="lg">
        {icon}
      </Button>
      <Button className={clsx(styles.button, 'text-label pl-4 pl-md-5')} size="lg" variant="secondary">
        Share on {service}
      </Button>
    </ButtonGroup>
  );
};

export default ShareButton;
