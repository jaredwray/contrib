import { FC } from 'react';

import { Col, Row } from 'react-bootstrap';

import { FavoriteCharitiesField } from './FavoriteCharitiesField';

export const CharitiesFormFields: FC = () => {
  return (
    <>
      <Row className="pt-3 pt-md-0">
        <Col md="6">
          <div className="text-subhead">Choose your charities</div>
          <div className="text--body pt-0 pt-md-2">
            Choose a number of charities onboarded with Contrib that you want to access more frequently.
          </div>
        </Col>
        <Col className="pt-2 pt-md-0" md="6">
          <FavoriteCharitiesField name="favoriteCharities" />
        </Col>
      </Row>
      <Row className="buffer d-none d-md-block" />
      {/*
      <hr className="mt-0" />
      <Row className="pt-3 pt-md-0">
        <Col md="6">
          <div className="text-subhead">Don’t see your charity?</div>
          <div className="text--body pt-0 pt-md-2">
            If your charity isn’t listed send us their info and we will add them to Contrib.
          </div>
        </Col>
        <Col className="pt-2 pt-md-0" md="6">
          <BsForm.Group>
            <BsForm.Label>Name</BsForm.Label>
            <BsForm.Control placeholder="Enter charity name" />
          </BsForm.Group>
          <BsForm.Group>
            <BsForm.Label>Contact</BsForm.Label>
            <BsForm.Control placeholder="Enter website or social" />
          </BsForm.Group>
        </Col>
      </Row>
      */}
    </>
  );
};
