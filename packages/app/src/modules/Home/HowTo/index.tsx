import { ReactElement, useState } from 'react';

import clsx from 'clsx';
import { Container, Row } from 'react-bootstrap';

import SpeakerIcon from 'src/assets/images/auction-icon.png';
import CharityIcon from 'src/assets/images/charity-icon.png';
import TicketIcon from 'src/assets/images/rare-item-icon.png';

import Item from './Item';
import styles from './styles.module.scss';

const HowTo = (): ReactElement => {
  const [activeForm, setActiveForm] = useState(0);

  return (
    <div className={clsx(styles.wrapper, activeForm && styles.withActiveForm)}>
      <Container className={styles.container} fluid="xxl">
        <Row className="py-0 py-md-5 justify-content-center position-relative">
          <Item
            activeForm={activeForm}
            btnText="Create your first auction"
            icon={SpeakerIcon}
            index={1}
            invitationType="influencer"
            setActiveForm={setActiveForm}
            text="Auction your memorabilia quickly and hassle-free"
          />
          <Item
            withSeparator
            activeForm={activeForm}
            btnText="Make your first bid"
            icon={TicketIcon}
            index={2}
            setActiveForm={setActiveForm}
            text="Win rare items directly from your favorite influencers"
          />
          <Item
            activeForm={activeForm}
            btnText="Register your charity"
            icon={CharityIcon}
            index={2}
            setActiveForm={setActiveForm}
            text="Partner with an influencer to earn proceeds for your charity"
          />
        </Row>
      </Container>
      <div className={activeForm ? styles.footer : 'd-none'}></div>
    </div>
  );
};

export default HowTo;
