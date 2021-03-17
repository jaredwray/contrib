import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import styles from './styles.module.scss';

interface Props {
  data: null;
}

const Testimonial: FC<Props> = ({ data }) => {
  return (
    <div className={styles.review}>
      <div className={styles.avatarWrapper}>
        <Image roundedCircle className={styles.avatar} src="/content/img/users/reviewer-1.webp" />
      </div>
      <div className={styles.quotesSign} />
      <div className={clsx(styles.reviewsQuote, 'text-subhead pt-2')}>
        With Contrib’s direct approach I can get game-worn memorabelia into hands fans. No delay, no middleman, all for
        charity.
      </div>
      <div className={clsx(styles.reviewersName, 'text-subhead text-all-cups text-sm mb-md-0 mt-5 mt-sm-0')}>
        De’aaron Fox
      </div>
      <div className={clsx(styles.badge, 'text-label pt-2')}>
        <span className={styles.badgeVerified} />
        Verified Athlete
      </div>
    </div>
  );
};

export default Testimonial;
