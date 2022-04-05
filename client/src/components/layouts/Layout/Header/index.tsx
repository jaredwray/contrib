import clsx from 'clsx';
import { Container, Image, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import Logo from 'src/assets/images/contrib-logo-horizontal-white.svg';
import { DEFAULT_AVATAR_PATH } from 'src/constants';
import { useAuth } from 'src/helpers/useAuth';

import Menu from './Menu';
import styles from './styles.module.scss';

export default function Header() {
  const { user, isAuthenticated } = useAuth();

  const avatar = <Image roundedCircle className={styles.avatar} src={user?.picture || DEFAULT_AVATAR_PATH} />;

  return (
    <header className={clsx(styles.header, 'p-0 px-sm-3')}>
      <Container className="p-0" fluid="xxl">
        <Row className="top px-0">
          <Col md className="p-0">
            <Navbar collapseOnSelect className="p-0" expand={false}>
              <Menu avatar={avatar} />
              <Link className={clsx(styles.logoWrapper, 'flex-grow-1 d-flex p-2 p-md-0')} to="/">
                <Image alt="Contrib" className={styles.logo} src={Logo} />
              </Link>
              <Navbar className={clsx(styles.navbar, 'p-0 d-md-block d-none desktop-navbar flex-grow-1')}>
                <Nav className="justify-content-center">
                  <Nav.Link className="px-3 py-3" href="/auctions">
                    Auctions
                  </Nav.Link>
                  <Nav.Link className="px-3 py-3" href="/influencers">
                    Influencers
                  </Nav.Link>
                  <Nav.Link className="px-3 py-3" href="/charities">
                    Charities
                  </Nav.Link>
                </Nav>
              </Navbar>
              <div className={clsx(styles.avatarWrapper, 'flex-grow-1 me-2 me-md-0 d-md-none')}>
                <Link className="d-flex justify-content-end" to={isAuthenticated ? '/profile' : '/log-in'}>
                  {avatar}
                </Link>
              </div>
            </Navbar>
          </Col>
        </Row>
      </Container>
    </header>
  );
}
