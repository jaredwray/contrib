import React, { useCallback, useContext, FC } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { CreateOrUpdateUserAddressMutation } from 'src/apollo/queries/accountQuery';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';
import Layout from 'src/components/Layout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';

import './styles.scss';

export default function DeliveryAddressPage() {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const [UpdateUserAddress, { loading: updating }] = useMutation(CreateOrUpdateUserAddressMutation);
  const history = useHistory();
  const linkToAuction = `/auctions/${auctionId}`;
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

  if (!auctionData || !account) {
    return null;
  }
  const { auction } = auctionData;
  const { title } = auction;
  const isWinner = auction.winner === account?.mongodbId;
  const initialValues = account.address;
  if (!isWinner) {
    history.push(`/`);
  }

  setPageTitle(`Delivery address for ${title} auction`);

  interface Props {
    title: string;
    children: React.ReactNode;
  }
  const ModalRow: FC<Props> = ({ title, children }) => (
    <>
      <Row className="d-flex align-items-baseline">
        <span className="pt-1 pb-1">{title}</span>
      </Row>
      <Row className="d-flex align-items-baseline w-100">
        <div className="w-100">{children}</div>
      </Row>
    </>
  );
  return (
    <Layout>
      <div className="w-100 invitation-page">
        <Container className="d-md-table">
          <Container className="h-100 d-md-table-cell align-middle">
            <Row className="pt-lg-3 pb-2 align-items-center">
              <Col lg="6">
                <div className="text-super pt-4">Hello</div>

                <div className="invitation-page-separator" />
                <div className="text-headline pt-4" data-test-id="invitation-page-welcome-message">
                  You won the auction!
                </div>
                <div className="text-headline pt-4" data-test-id="invitation-page-welcome-message">
                  To get the{' '}
                  <a className="invitation-auction-title " href={linkToAuction}>
                    {title}
                  </a>
                  , fill in the delivery form
                </div>
              </Col>
              <Col className="pt-5 pt-lg-0 pb-4 pb-lg-0" lg="6">
                <div className="invitation-page-right-block p-4 p-md-4">
                  <div className="d-table w-100">
                    <Form initialValues={initialValues} onSubmit={onSubmit}>
                      <div className="mb-3">
                        <ModalRow title={`name`}>
                          <InputField name="name" />
                        </ModalRow>
                        <ModalRow title={`country `}>
                          <InputField name="country" />
                        </ModalRow>
                        <ModalRow title={`state`}>
                          <InputField name="state" />
                        </ModalRow>
                        <ModalRow title={`city`}>
                          <InputField name="city" />
                        </ModalRow>
                        <ModalRow title={`street `}>
                          <InputField name="street" />
                        </ModalRow>
                        <ModalRow title={`zip code `}>
                          <InputField name="zipCode" />
                        </ModalRow>
                      </div>
                      <Button
                        className="btn-with-arrows d-table-cell align-middle w-100 invitation-page-create-btn"
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
