import { FC, ReactElement, useCallback, useState } from 'react';

import clsx from 'clsx';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { CookiesProvider } from 'react-cookie';

import Form from 'src/components/forms/Form/Form';
import InputField from 'src/components/forms/inputs/InputField';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { usePrivateAuction } from 'src/helpers/usePrivateAuction';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const PrivateContent: FC<Props> = ({ auction }): ReactElement => {
  const [isValid, setIsValid] = useState(true);
  const { hasAccess, giveAccess } = usePrivateAuction(auction);

  if (hasAccess()) window.location.reload();

  const onSubmit = useCallback(
    (values) => {
      if (hasAccess(values.password)) {
        giveAccess();
        window.location.reload();
      } else {
        setIsValid(false);
      }
    },
    [hasAccess, giveAccess, setIsValid],
  );

  setPageTitle('Private content');

  return (
    <CookiesProvider>
      <Layout>
        <Container className="m-auto">
          <Row className="mb-4 justify-content-md-center">
            <Col className="text-center" lg="6" md="8" xl="4">
              <h2 className={styles.h2}>This is a private auction</h2>
              <h4 className={styles.h4}>Please enter your password</h4>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col lg="6" md="8" xl="4">
              <Form onSubmit={onSubmit}>
                <InputField
                  required
                  className={clsx(styles.input, 'text-center')}
                  errorClassName="position-absolute w-auto"
                  isInvalid={!isValid}
                  name="password"
                  type="password"
                  onInput={() => setIsValid(true)}
                />
                <Button className="mt-4 w-100" type="submit">
                  Submit
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </Layout>
    </CookiesProvider>
  );
};

export default PrivateContent;
