import { FC, ReactElement, useCallback, useEffect } from 'react';

import clsx from 'clsx';
import { toDate } from 'date-fns-tz';
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

const PrivateContent: FC<Props> = ({ auction }): ReactElement => {
  const [cookies, setCookie] = useCookies([auction.id]);
  const passwordEncrypted = btoa(auction.password || '');

  useEffect(() => {
    if (cookies[auction.id] === passwordEncrypted) window.location.reload();
  }, [auction.id, cookies, passwordEncrypted]);

  const onSubmit = useCallback(
    (values) => {
      if (btoa(values.password) === passwordEncrypted)
        setCookie(auction.id, passwordEncrypted, { secure: true, expires: toDate(auction.endDate) });
    },
    [auction.id, auction.endDate, setCookie, passwordEncrypted],
  );

  setPageTitle('Private content');

  return (
    <CookiesProvider>
      <Layout>
        <Container className="h-100 m-auto" fluid="xs">
          <Row className="px-3 p-md-0">
            <Col>This is private content, please, enter the password to see it</Col>
          </Row>
          <Row className="pt-2">
            <Form className={styles.form} onSubmit={onSubmit}>
              <Col>
                <InputField required name="password" />
              </Col>
              <Col>
                <Button className={clsx(styles.button, 'float-md-end')} type="submit">
                  Submit
                </Button>
              </Col>
            </Form>
          </Row>
        </Container>
      </Layout>
    </CookiesProvider>
  );
};

export default PrivateContent;
