import React, { useCallback, useContext } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import clm from 'country-locale-map';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory, useParams, Link } from 'react-router-dom';

import { CreateOrUpdateUserAddressMutation } from 'src/apollo/queries/accountQuery';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import SelectField from 'src/components/Form/SelectField';
import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { RedirectWithReturnAfterLogin } from 'src/helpers/RedirectWithReturnAfterLogin';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { ModalRow } from 'src/modules/auctions/DeliveryAddressPage/ModalRow';

import styles from './styles.module.scss';

export default function DeliveryAddressPage() {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const [UpdateUserAddress, { loading: updating }] = useMutation(CreateOrUpdateUserAddressMutation);
  const history = useHistory();
  const { data: auctionData } = useQuery(AuctionQuery, {
    variables: { id: auctionId },
  });

  const onSubmit = useCallback(
    ({
      name,
      country,
      state,
      city,
      street,
      zipCode,
    }: {
      name: string;
      country: string;
      state: string;
      city: string;
      street: string;
      zipCode: string;
    }) => {
      if (!name || !country || !state || !city || !street || !zipCode) {
        showWarning('Please, check the data');
        return;
      }
      UpdateUserAddress({
        variables: {
          auctionId,
          name,
          country,
          state,
          city,
          street,
          zipCode,
        },
      })
        .then(() => {
          showMessage('Your address information was updated');
        })
        .catch(() => {
          showError('Cannot update address information');
        });
    },
    [UpdateUserAddress, showMessage, showError, showWarning, auctionId],
  );
  if (!auctionData) {
    return null;
  }
  const { auction } = auctionData;

  if (!account) {
    RedirectWithReturnAfterLogin(`/auctions/${auction.id}/delivery`);
    return null;
  }

  const { title } = auction;
  const isWinner = auction.winner === account?.mongodbId;
  const initialValues = account.address;
  if (!isWinner) {
    history.push(`/`);
  }
  const countries = clm.getAllCountries().map((country) => {
    return { value: country.alpha3, label: country.name };
  });

  const selectedOption = () => {
    const { country } = initialValues;
    const selected = countries.find((option) => option.value === country);
    return selected || countries.find((option) => option.value === 'USA');
  };

  setPageTitle(`Delivery address for ${title} auction`);

  return (
    <Layout>
      <div className={clsx(styles.page, 'w-100')}>
        <Container className="d-md-table p-0">
          <Container className={clsx(styles.container, 'p-0 h-100 d-md-table-cell align-middle')}>
            <Row className="pt-lg-3 pb-2 align-items-center">
              <Col lg="6">
                <div className={clsx(styles.title, 'text-super-headline pb-4 pt-mb-0 pt-4')}>Congratulations!</div>
                <div className={styles.separator} />
                <div className="text-headline pt-4">You won the auction!</div>
                <div className="text-headline pt-4">
                  To receiv4
                  <Link className={styles.auctionTitle} to={`/auctions/${auctionId}`}>
                    {title}
                  </Link>
                  , fill in the delivery form
                </div>
              </Col>
              <Col className="pt-4 pt-lg-0 pb-4 pb-lg-0" lg="6">
                <div className={clsx(styles.rightBlock, 'p-4 p-md-4')}>
                  <div className="d-table w-100">
                    <Form initialValues={initialValues} onSubmit={onSubmit}>
                      <ModalRow title={'name'} />
                      <Row className="d-flex align-items-baseline">
                        <span className="pt-1 pb-1">country</span>
                      </Row>
                      <Row className="d-flex align-items-baseline w-100 mb-1">
                        <div className="w-100">
                          <SelectField
                            className={styles.select}
                            name="country"
                            options={countries}
                            selected={selectedOption()}
                          />
                        </div>
                      </Row>
                      <ModalRow title={'state'} />
                      <ModalRow title={'city'} />
                      <ModalRow title={'street'} />
                      <ModalRow title={'zip code'} />
                      <Button
                        className={clsx(styles.createBtn, 'align-middle w-100 mt-3')}
                        disabled={updating}
                        type="submit"
                        variant="ochre"
                      >
                        Submit
                      </Button>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Container>
      </div>
    </Layout>
  );
}
