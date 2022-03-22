import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import SwipeableLink from 'src/components/wrappers/SwipeableLink';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

type Props = {
  profile: InfluencerProfile | Charity;
  link: string;
  className?: string;
};

const ProfileInfo: FC<Props> = ({ profile, link, className }) => {
  return (
    <SwipeableLink className={styles.link} title={profile.name} to={link}>
      <div className="d-flex align-items-start">
        <Image
          roundedCircle
          className={clsx(styles.avatar, 'position-absolute')}
          height={12}
          src={profile.avatarUrl && ResizedImageUrl(profile.avatarUrl, 32)}
          width={12}
        />
        <span className={clsx(styles.name, className, 'text-label text-truncate')}>{profile.name}</span>
      </div>
    </SwipeableLink>
  );
};

export default ProfileInfo;
