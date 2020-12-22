import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import footerContent from 'src/data/footer.json'

const Footer = () => {
    return (
        <footer className="position-relative z-index-10 d-print-none" >
            <div className="py-6 bg-gray-200 text-muted">
                <Container>
                    <Row>
                        {footerContent && footerContent.map(item =>
                            <Col key={item.title} lg={item.lg && item.lg} className="mb-5 mb-lg-0">
                                <div className="font-weight-bold text-uppercase text-dark mb-3">
                                    {item.title}
                                </div>
                                {item.content &&
                                    <p>{item.content}</p>
                                }
                                {item.social &&
                                    <ul className="list-inline">
                                        {item.social.map(socialIcon =>
                                            <li key={socialIcon.title} className="list-inline-item">
                                                <a href={socialIcon.link} target="_blank" title={socialIcon.title} className="text-muted text-hover-primary">
                                                    <i className={`fab fa-${socialIcon.title}`} />
                                                </a>
                                            </li>
                                        )}

                                    </ul>
                                }
                            </Col>
                        )}
                    </Row>
                </Container>
            </div>
            <div className="py-4 font-weight-light bg-gray-800 text-gray-300">
                <Container>
                    <Row className="align-items-center">
                        <Col md="6" className="text-center text-md-left">
                            <p className="text-sm mb-md-0">
                                &copy; 2020 Contrib LLC. All rights reserved.
                            </p>
                        </Col>
                        <Col md="6">
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer >
    )
}

export default Footer