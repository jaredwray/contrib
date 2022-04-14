import { Container, Row } from 'react-bootstrap';

import CharityIcon from 'src/assets/images/charity.svg';
import SpeakerIcon from 'src/assets/images/speaker.svg';
import TicketIcon from 'src/assets/images/ticket.svg';

import Item from './Item';

export default function HowTo() {
  return (
    <Container fluid="xxl">
      <Row className="py-0 justify-content-center">
        <Item
          btnText="Create your first auction"
          icon={SpeakerIcon}
          text="Auction your memorabelia quickly and hassle-free"
        />
        <Item
          withSeparator
          btnText="Make your first bid"
          icon={TicketIcon}
          text="Win rare items directly from your favorite influencers"
        />
        <Item
          btnText="Register your charity"
          icon={CharityIcon}
          text="Partner with an influencer to earn proceeds for your charity"
        />
      </Row>
    </Container>
  );
}
