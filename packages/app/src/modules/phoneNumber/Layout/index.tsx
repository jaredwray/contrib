import clsx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';

import Logo from 'src/assets/images/logo-with-text.svg';

import styles from './styles.module.scss';

export default function PhoneNumberLayout({ children }: { children: any }) {
  return (
    <Container className="h-100 m-0 p-0" fluid="xxl">
      <Row className="m-0 h-100">
        <Col className="p-0 pt-4">
          <Container fluid className="p-0 col-md-9 col-11">
            <a href="/">
              <img alt="Contrib" className={styles.logo} src={Logo} />
            </a>
            <main role="main">{children}</main>
          </Container>
        </Col>
        <Col className={clsx(styles.rightBlock, 'p-0 d-none d-md-block w-100')}>
          <div className={clsx(styles.signature, 'text-label text-all-cups position-absolute')}>Stefan Frei</div>
        </Col>
      </Row>
    </Container>
  );
}
