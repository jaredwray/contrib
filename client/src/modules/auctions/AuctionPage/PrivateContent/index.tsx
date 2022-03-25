import { FC, ReactElement, useCallback, useEffect } from 'react';

import clsx from 'clsx';
import { Col, Container, Row, Button } from 'react-bootstrap';
import { CookiesProvider, useCookies } from 'react-cookie';

import Form from 'src/components/forms/Form/Form';
import InputField from 'src/components/forms/inputs/InputField';
import Layout from 'src/components/layouts/Layout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  auction: Auction;
}

const COOKIES_MAX_AGE_SEC = 86400; // one day

const PrivateContent: FC<Props> = ({ auction }): ReactElement => {
  const [cookies, setCookie] = useCookies([auction.id]);
  const passwordEncrypted = btoa(auction.password || '');

  useEffect(() => {
    if (cookies[auction.id] === passwordEncrypted) window.location.reload();
  }, [auction.id, cookies, passwordEncrypted]);

  const onSubmit = useCallback(
    (values) => {
      if (btoa(values.password) === passwordEncrypted)
        setCookie(auction.id, passwordEncrypted, { secure: true, maxAge: COOKIES_MAX_AGE_SEC });
    },
    [auction.id, setCookie, passwordEncrypted],
  );

  setPageTitle('Private content');

  return (
    <CookiesProvider>
      <Layout>
        <Container className="m-auto">
          <Row className="mb-4 justify-content-md-center">
            <Col className="col-md-4 text-center">
              <h2>This is a private auction</h2>
              <h4>Please enter your password</h4>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col className="col-md-4">
              <Form className={styles.form} onSubmit={onSubmit}>
                <InputField required name="password" />
                <Button className={clsx(styles.button, 'mt-1')} type="submit">
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
