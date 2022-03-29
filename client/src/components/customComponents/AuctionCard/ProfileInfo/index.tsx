import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import SwipeableLink from 'src/components/wrappers/SwipeableLink';
import { DEFAULT_AVATAR_PATH } from 'src/constants';
import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import CharityIcon from './CharityIcon';
import styles from './styles.module.scss';

type Props = {
  profile: InfluencerProfile | Charity;
  link: string;
  className?: string;
  isCharity?: boolean;
};

const ProfileInfo: FC<Props> = ({ profile, link, className, isCharity }) => {
  const defaultAvatar = profile.avatarUrl === DEFAULT_AVATAR_PATH;

  return (
    <SwipeableLink className={styles.link} title={profile.name} to={link}>
      {isCharity && defaultAvatar && <CharityIcon className="float-start pt-1" />}
      {(!isCharity || !defaultAvatar) && (
        <Image
          roundedCircle
          className={clsx(styles.avatar, 'position-absolute')}
          height={12}
          src={ResizedImageUrl(profile.avatarUrl, 32)}
          width={12}
        />
      )}
      <div
        className={clsx(
          styles.name,
          className,
          'text-body-new fw-normal',
          isCharity ? [styles.charity, 'text-all-cups'] : 'text-truncate',
        )}
      >
        {profile.name}
      </div>
    </SwipeableLink>
  );
};

export default ProfileInfo;
