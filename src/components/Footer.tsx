import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import footerContent from 'src/data/footer.json'
import Logo from 'public/content/svg/logo-light.svg'

const Footer = () => {
    return (
        <footer className="position-relative z-index-10 d-print-none" >
            <div className="py-6 bg-darkgrey text-muted">
                <Container>
                    <Row>
                        {footerContent && footerContent.map(item =>
                            <Col key={item.title} lg={item.lg && item.lg} className="mb-4 mb-lg-0">
                                <img src={Logo} alt="Contrib logo" />
                                <p className="text-lg">Direct athlete-to-fan charity auctions.</p>
                                {item.social &&
                                    <ul className="list-inline">
                                        {item.social.map(socialIcon =>
                                            <li key={socialIcon.title} className="list-inline-item">
                                                <a href={socialIcon.link} target="_blank" title={socialIcon.title} className="text-muted text-hover-primary">
                                                    <i className={`text-white fa-2x fab fa-${socialIcon.title}`} />
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                }
                            </Col>
                        )}
                    </Row>
                    <p className="text-sm text-sage font-bold text-uppercase mb-md-0">&copy; 2021 Contrib Inc.</p>
                </Container>
            </div>
        </footer>
    )
}

export default Footer