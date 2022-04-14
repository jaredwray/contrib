import { ReactElement } from 'react';

import clsx from 'clsx';
import { Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import styles from './styles.module.scss';

interface PropTypes {
  icon: string;
  text: string;
  btnText: string;
  withSeparator?: boolean;
}

const Item = ({ icon, text, btnText, withSeparator }: PropTypes): ReactElement => {
  return (
    <Col
      className={clsx(
        withSeparator && styles.separator,
        withSeparator && 'py-5',
        'd-flex justify-content-center py-5 p-md-0 m-md-0 flex-column text-center',
      )}
    >
      <div>
        <Image className={styles.icon} src={icon} />
      </div>
      <div className={clsx(styles.text, 'text--body py-4 m-auto')}>{text}</div>
      <Link className={clsx(styles.button, 'btn btn-primary text-label m-auto px-4')} to="/log-in">
        {btnText}
      </Link>
      <Link className={clsx(styles.link, 'text-label pt-3')} to="/log-in">
        Learn More &#62;
      </Link>
    </Col>
  );
};

export default Item;
