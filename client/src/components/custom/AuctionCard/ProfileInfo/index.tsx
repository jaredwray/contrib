import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import SwipeableLink from 'src/components/wrappers/SwipeableLink';
import { DEFAULT_AVATAR_PATH } from 'src/constants';
import resizedImageUrl from 'src/helpers/resizedImageUrl';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import CharityIcon from './CharityIcon';
import styles from './styles.module.scss';

type Props = {
  profile: InfluencerProfile | Charity;
  link: string;
  profileClassName?: string;
  charityClassName?: string;
  isCharity?: boolean;
};

const ProfileInfo: FC<Props> = ({ profile, link, profileClassName, charityClassName, isCharity }) => {
  const defaultAvatar = profile.avatarUrl === DEFAULT_AVATAR_PATH;

  return (
    <SwipeableLink
      className={clsx(
        styles.link,
        isCharity && styles.charityWrapper,
        isCharity && 'p-3',
        !isCharity && styles.isNotCharity,
        'd-flex',
      )}
      title={profile.name}
      to={link}
    >
      <div>{isCharity && defaultAvatar && <CharityIcon />}</div>
      {!isCharity && (
        <Image
          roundedCircle
          className={clsx(styles.avatarUser, profileClassName)}
          src={resizedImageUrl(profile.avatarUrl, 120)}
        />
      )}
      <div
        className={clsx(
          styles.name,
          charityClassName,
          profileClassName,
          'd-flex justify-content-between align-items-center',
          isCharity ? [styles.charityName, 'text-all-cups'] : [styles.profileNameWrapper],
        )}
      >
        <div>
          <div className={styles.supportingLabel}>{isCharity && 'SUPPORTING'}</div>
          <div className={styles.profileName}>{profile.name}</div>
        </div>
        <div>
          {isCharity && !defaultAvatar && (
            <Image roundedCircle className={clsx(styles.avatarCharity)} src={resizedImageUrl(profile.avatarUrl, 120)} />
          )}
        </div>
      </div>
    </SwipeableLink>
  );
};

export default ProfileInfo;
