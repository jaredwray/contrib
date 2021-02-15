import { useState } from "react";
import { Container, Row, Col, Button, Form, Table, Modal, Dropdown, DropdownButton } from "react-bootstrap";

import Layout from "../../Layout/Layout";
import Checkbox from "../../Common/Checkbox/Checkbox"

import "./Influencers.scss";

function InvitationModal(props: any) {
  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create Invitation
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control placeholder="Enter Name" />
        </Form.Group>

        <Form.Group>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control placeholder="Enter Phone Number" />
        </Form.Group>

        <Form.Group>
          <Form.Label>SMS</Form.Label>
          <Form.Control as="textarea" rows={5} placeholder="Enter invitation" />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide} className="btn-ochre">Invite</Button>
        <Button onClick={props.onHide} className="btn-dark-gray">Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default function Influencers() {
  const [modalShow, setModalShow] = useState(false);

  return (
    <Layout>
      <section className="admin-invitations-page text-label pl-4 pr-4">
        <Container fluid>
          <Row>
            <Col xs="12" md="6">
              <Form.Control placeholder="Search influencer" />
            </Col>
            <Col xs="8" md="5" className="pt-3 pt-md-0">
              <div className="pagination float-left">
                <div className="pagination-btn pagination-btn-prev" />
                <div className="ml-3 mr-2 pagination-btn pagination-btn-next" />
                <div className="ml-3 pagination-status">
                  <span className="pagination-status-current">1-100</span>
                  <span className="ml-2 pagination-status-info">of 4236</span>
                </div>
               </div>
            </Col>
            <Col xs="4" md="1">
              <InvitationModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            <Col md="10">
              <Table className="admin-invitations-table d-block d-sm-table">
                <thead>
                  <tr>
                    <th><Checkbox/></th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="font-weight-normal">
                  <tr className="tr-selected">
                    <td><Checkbox checked={true}/></td>
                    <td>1</td>
                    <td>De’aaron Fox</td>
                    <td>fox@email.com</td>
                    <td>pending</td>
                    <td>
                      <DropdownButton menuAlign="right" title="..." id="influencerActions" className="influencer-actions-dropdown">
                        <Dropdown.Item onClick={() => setModalShow(true)}><i className="icon-add"/>invite</Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                  <tr>
                    <td><Checkbox/></td>
                    <td>2</td>
                    <td>Diego Rossi</td>
                    <td>diegorossi@email.com</td>
                    <td>pending</td>
                    <td>
                      <DropdownButton menuAlign="right" title="..." id="influencerActions" className="influencer-actions-dropdown text-label">
                        <Dropdown.Item onClick={() => setModalShow(true)}><i className="icon-add"/>invite</Dropdown.Item>
                      </DropdownButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md="2">
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
};
