import { FC, ReactElement } from 'react';

import clsx from 'clsx';
import { Image } from 'react-bootstrap';

import ResizedImageUrl from 'src/helpers/ResizedImageUrl';
import { InfluencerProfile } from 'src/types/InfluencerProfile';

import Row from '../common/Row';
import styles from './styles.module.scss';

interface Props {
  profile: InfluencerProfile;
}

const Profile: FC<Props> = ({ profile }): ReactElement => {
  return (
    <Row title="This auction by">
      <div className="d-table">
        <Image
          roundedCircle
          className={clsx(styles.avatar, 'd-table-cell')}
          src={ResizedImageUrl(profile.avatarUrl, 120)}
        />
        <div className={clsx(styles.info, 'pl-4 d-table-cell align-middle')}>
          <div className="text-subhead text-all-cups text-sm">{profile.name}</div>
          <div className={clsx(styles.badge, 'text-label pt-2')}>
            <span className={styles.badgeVerified} />
            Verified Athlete
          </div>
        </div>
      </div>
    </Row>
  );
};

export default Profile;
