import { FC } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import SwipeableLink from 'src/components/wrappers/SwipeableLink';
import resizedImageUrl from 'src/helpers/resizedImageUrl';
import { Charity } from 'src/types/Charity';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import styles from './styles.module.scss';

type Props = {
  profile: InfluencerProfile | Charity;
  link: string;
  profileClassName?: string;
  charityClassName?: string;
  isCharity?: boolean;
};

const ProfileInfo: FC<Props> = ({ profile, link, profileClassName, charityClassName, isCharity }) => {
  return (
    <SwipeableLink
      className={clsx(styles.link, isCharity && styles.charityWrapper, !isCharity && styles.isNotCharity, 'd-flex')}
      title={profile.name}
      to={link}
    >
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
        {!isCharity && (
          <div>
            {/* <div className={styles.supportingLabel}>{isCharity && 'SUPPORTING'}</div> */}
            <div className={styles.profileName}>{profile.name}</div>
          </div>
        )}
        {/* <div>
          {isCharity && !defaultAvatar && (
            <Image roundedCircle className={clsx(styles.avatarCharity)} src={resizedImageUrl(profile.avatarUrl, 120)} />
          )}
        </div> */}
      </div>
    </SwipeableLink>
  );
};

export default ProfileInfo;
