import { Container, Row, Col } from 'react-bootstrap';

import Logo from 'src/assets/images/logo-with-text.svg';

import './styles.scss';

export default function PhoneNumberLayout({ children }: { children: any }) {
  return (
    <Container fluid className="h-100">
      <Row className="m-0 h-100">
        <Col className="p-0 pt-4">
          <Container fluid className="p-0 login-container container col-md-9 col-11">
            <a href="/">
              <img alt="Contrib" className="logo" src={Logo} />
            </a>
            <main role="main">{children}</main>
          </Container>
        </Col>
        <Col className="p-0 h-100 d-none d-md-block right-block w-100">
          <div className="text-label text-all-cups position-absolute right-block-signature">
            Stephan Frei
            <br />
            Total raised: $248,000
          </div>
        </Col>
      </Row>
    </Container>
  );
}
