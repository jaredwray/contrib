import { ReactElement, useState } from 'react';

import clsx from 'clsx';
import { Col, Image, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import InfluencerInvitation from '../InfluencerInvitation';
import styles from './styles.module.scss';

interface PropTypes {
  icon: string;
  text: string;
  btnText: string;
  withSeparator?: boolean;
  invitationType?: string;
}

const Item = ({ icon, text, btnText, withSeparator, invitationType }: PropTypes): ReactElement => {
  const [showForm, setShowForm] = useState(false);

  const InvitationsMap = {
    influencer: <InfluencerInvitation setShowForm={setShowForm} />,
  } as { [key: string]: ReactElement };

  const invitation = invitationType && InvitationsMap[invitationType];

  return (
    <Col
      className={clsx(
        withSeparator && styles.separator,
        'd-flex justify-content-center py-5 py-md-2 flex-column text-center',
      )}
      md={4}
    >
      {showForm && invitation && <div className={clsx(styles.invitation, 'position-absolute p-4')}>{invitation}</div>}
      <div>
        <div>
          <Image className={styles.icon} src={icon} />
        </div>
        <div className={clsx(styles.text, 'text--body py-4 m-auto')}>{text}</div>
        {invitation ? (
          <Button className={clsx(styles.button, 'text-label m-auto px-4 w-100')} onClick={() => setShowForm(true)}>
            {btnText}
          </Button>
        ) : (
          <Link className={clsx(styles.button, 'btn btn-primary text-label m-auto px-4')} to="/log-in">
            {btnText}
          </Link>
        )}
        <Link className={clsx(styles.link, 'text-label pt-3')} to="/log-in">
          Learn More &#62;
        </Link>
      </div>
    </Col>
  );
};

export default Item;
