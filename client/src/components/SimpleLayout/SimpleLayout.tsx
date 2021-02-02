import { Container, Row, Col } from 'react-bootstrap'

import Logo from './logo.svg'

import 'bootstrap/dist/css/bootstrap.min.css'
import './SimpleLayout.scss'

export default function SimpleLayout({children}: {children: any}) {
  return (
    <Container fluid className="h-100">
      <Row className="m-0 h-100">
        <Col className="p-0 pt-4">
          <Container fluid className="p-0 login-container container col-md-9 col-11">
            <a href="/">
              <img src={Logo} alt="Contrib" className="logo"/>
            </a>
            <main role='main'>{children}</main>
          </Container>
        </Col>
        <Col className="p-0 h-100 d-none d-md-block right-block">
          <div className="text-label text-all-cups position-absolute right-block-signature">
            Stephan Frei<br/>
            Total raised: $248,000
          </div>
        </Col>
      </Row>
    </Container>
  )
}
