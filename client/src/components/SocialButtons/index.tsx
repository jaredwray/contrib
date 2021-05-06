import { FC } from 'react';

import clsx from 'clsx';
import { Row } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export const SocialButtons: FC<Props> = ({ facebook, twitter, instagram }) => {
  return (
    <Row className={styles.socialMedia}>
      {facebook && (
        <a className={clsx('d-inline-block mr-4', styles.facebook)} href={facebook} rel="external" title="twitter">
          <i className="d-none" />
        </a>
      )}
      {twitter && (
        <a className={clsx('d-inline-block mr-4', styles.twitter)} href={twitter} rel="external" title="instagram">
          <i className="d-none" />
        </a>
      )}
      {instagram && (
        <a className={clsx('d-inline-block mr-4', styles.instagram)} href={instagram} rel="external" title="facebook">
          <i className="d-none" />
        </a>
      )}
    </Row>
  );
};
