import cslx from 'clsx';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

import Logo from 'src/assets/images/logo-with-text.svg';
import { useUrlQueryParams } from 'src/helpers/useUrlQueryParams';

import AuthBtn from './AuthBtn';
import styles from './styles.module.scss';

export default function LogInPage() {
  const history = useHistory();
  const queryParams = useUrlQueryParams();

  const returnQuery = queryParams.get('returnURL') || queryParams.get('invite') || '';

  return (
    <Container fluid className="h-100 p-0">
      <Row className="m-0 h-100">
        <Col className="p-0 pt-4 login-box">
          <Container className="p-0 col-md-9 col-11">
            <Link to="/">
              <img alt="Contrib" src={Logo} />
            </Link>
            <div className={cslx(styles.backLink, 'text-label text-all-cups d-block pt-5')} onClick={history.goBack}>
              <span className={cslx(styles.arrows)}>&#171;&#32;&#32;</span>
              back
            </div>
            <h1 className="text-headline font-weight-bold">Log in</h1>
            <div className={cslx(styles.authBtns, 'pt-4')}>
              <AuthBtn provider="facebook" returnQuery={returnQuery} />
              <AuthBtn provider="twitter" returnQuery={returnQuery} />
              <AuthBtn provider="google" returnQuery={returnQuery} />
              <AuthBtn provider="sms" returnQuery={returnQuery} text="SMS code" />
            </div>
          </Container>
        </Col>
        <Col className={cslx(styles.rightBlock, 'p-0 d-none d-md-block')}>
          <div className={cslx(styles.signature, 'text-label')}>Stefan Frei</div>
        </Col>
      </Row>
    </Container>
  );
}
