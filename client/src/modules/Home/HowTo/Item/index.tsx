import { ReactElement, SetStateAction } from 'react';

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
  activeForm: number;
  setActiveForm: (_: SetStateAction<number>) => void;
  index: number;
}

const Item = ({
  icon,
  text,
  btnText,
  withSeparator,
  invitationType,
  index,
  activeForm,
  setActiveForm,
}: PropTypes): ReactElement => {
  const InvitationsMap = {
    influencer: <InfluencerInvitation setActiveForm={setActiveForm} />,
  } as { [key: string]: ReactElement };

  const invitation = invitationType && InvitationsMap[invitationType];
  const showForm = activeForm === index;

  return (
    <Col
      className={clsx(
        withSeparator && styles.separator,
        'd-flex justify-content-center py-5 py-md-2 flex-column text-center invitation-form',
      )}
    >
      {showForm && invitation && <div className={clsx(styles.invitation, 'position-absolute p-4')}>{invitation}</div>}
      <div>
        <div>
          <Image className={styles.icon} src={icon} />
        </div>
        <div className={clsx(styles.text, 'text--body py-4 m-auto')}>{text}</div>
        {invitation ? (
          <Button className={clsx(styles.button, 'text-label m-auto px-4')} onClick={() => setActiveForm(index)}>
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
