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
    <SwipeableLink className={clsx(styles.link, 'pb-2 d-flex')} title={profile.name} to={link}>
      <div>{isCharity && defaultAvatar && <CharityIcon className={clsx(styles.charityIcon, 'charity')} />}</div>
      {(!isCharity || !defaultAvatar) && (
        <Image roundedCircle className={clsx(styles.avatar)} src={ResizedImageUrl(profile.avatarUrl, 32)} />
      )}
      <div
        className={clsx(
          styles.name,
          className,
          'ps-2',
          isCharity ? [styles.charityName, 'text-all-cups'] : 'text-truncate',
        )}
      >
        {profile.name}
      </div>
    </SwipeableLink>
  );
};

export default ProfileInfo;
