import { FC } from 'react';

import { Col, Row } from 'react-bootstrap';

import { FavouriteCharitiesField } from './FavouriteCharitiesField';

const CharitiesFormFields: FC = () => {
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
          <FavouriteCharitiesField name="favoriteCharities" />
        </Col>
      </Row>
      <Row className="buffer d-none d-md-block" />
    </>
  );
};
export default CharitiesFormFields;
