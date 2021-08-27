import { useCallback, useContext, useState, KeyboardEvent } from 'react';

import { useQuery, useMutation } from '@apollo/client';
import clsx from 'clsx';
import { Row, Spinner } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { useHistory, useParams, Link } from 'react-router-dom';

import { CreateOrUpdateUserAddressMutation } from 'src/apollo/queries/accountQuery';
import { AuctionQuery } from 'src/apollo/queries/auctions';
import Form from 'src/components/Form/Form';
import InputField from 'src/components/Form/InputField';
import SelectField from 'src/components/Form/SelectField';
import { SubmitButton } from 'src/components/SubmitButton/SubmitButton';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { UserDialogLayout } from 'src/components/UserDialogLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useRedirectWithReturnAfterLogin } from 'src/helpers/useRedirectWithReturnAfterLogin';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { ModalRow } from 'src/modules/auctions/delivery/DeliveryAddressPage/ModalRow';
import { USAStates } from 'src/modules/auctions/delivery/DeliveryAddressPage/USAStates';
import { AuctionDeliveryStatus } from 'src/types/Auction';

import styles from './styles.module.scss';

export default function DeliveryAddressPage() {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const [phoneInputValue, setPhoneInputValue] = useState('');
  const [UpdateUserAddress, { loading: updating }] = useMutation(CreateOrUpdateUserAddressMutation);
  const history = useHistory();
  const RedirectWithReturnAfterLogin = useRedirectWithReturnAfterLogin();

  const { data: auctionData } = useQuery(AuctionQuery, {
    variables: { id: auctionId },
    fetchPolicy: 'cache-and-network',
  });

  const onSubmit = useCallback(
    ({
      name,
      state,
      city,
      street,
      zipCode,
    }: {
      name: string;
      state: string;
      city: string;
      street: string;
      zipCode: string;
    }) => {
      if (!name || !state || !city || !street || !zipCode) {
        showWarning('Please, check the data');
        return;
      }
      UpdateUserAddress({
        variables: {
          auctionId,
          name,
          state,
          city,
          street,
          zipCode,
          phoneNumber:
            phoneInputValue ||
            auctionData?.auction?.delivery?.address.phoneNumber.substring(1) ||
            auctionData?.auction?.winner?.phoneNumber.substring(1),
        },
      })
        .then(() => {
          showMessage('Your address information was updated');
          history.push(`/auctions/${auctionId}/delivery/payment`);
        })
        .catch((error) => {
          showError(error.message);
        });
    },
    [
      UpdateUserAddress,
      showMessage,
      showError,
      showWarning,
      auctionId,
      history,
      phoneInputValue,
      auctionData?.auction?.winner?.phoneNumber,
      auctionData?.auction?.delivery?.address.phoneNumber,
    ],
  );

  if (!auctionData) {
    return null;
  }

  if (!account) {
    RedirectWithReturnAfterLogin(`/auctions/${auctionId}/delivery/address`);
    return null;
  }

  const { auction } = auctionData;
  const isWinner = auction?.winner?.mongodbId === account.mongodbId;

  if (!isWinner) {
    history.goBack();
    return null;
  }

  if (auction.delivery.status === AuctionDeliveryStatus.PAID) {
    history.push(`/auctions/${auctionId}/delivery/status`);
    return null;
  }

  const { title } = auction;
  const initialValues = auction.winner.address;

  const selectedOption = () => {
    const selected = USAStates.find((option) => option.value === initialValues.state);
    return selected || USAStates[0];
  };

  const textBlock = (
    <>
      <div className="text-headline pt-4">You won the auction!</div>
      <div className="text-headline pt-4">
        To receive
        <Link className={styles.auctionTitle} to={`/auctions/${auctionId}`}>
          {title}
        </Link>
        , fill in the delivery form
      </div>
    </>
  );

  const handleChange = (value: string) => {
    setPhoneInputValue(value);
  };
  setPageTitle(`Delivery address for ${title} auction`);

  return (
    <UserDialogLayout textBlock={textBlock} title="Congratulations!">
      <Form
        initialValues={{
          ...initialValues,
          state: initialValues?.state || USAStates[0].value,
        }}
        onSubmit={onSubmit}
      >
        <ModalRow field="name" title="Recepient" />
        <Row className="d-flex align-items-baseline">
          <span className="pt-1 pb-1 text-label">State</span>
        </Row>
        <Row className="d-flex align-items-baseline w-100 mb-1">
          <div className="w-100">
            <SelectField className={styles.select} name="state" options={USAStates} selected={selectedOption()} />
          </div>
        </Row>
        <ModalRow field="city" title="City" />
        <ModalRow field="street" title="Address" />
        <Row className="d-flex align-items-baseline">
          <span className="pt-1 pb-1 text-label">Post code</span>
        </Row>
        <Row className="d-flex align-items-baseline w-100">
          <div className="w-100">
            <InputField
              required
              maxLength={5}
              name="zipCode"
              type="tel"
              wrapperClassName={clsx(styles.numberInput, 'mb-1')}
              onKeyPress={(event: KeyboardEvent) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
          </div>
        </Row>
        <Row className="d-flex align-items-baseline">
          <span className="pt-1 pb-1 text-label">Phone number</span>
        </Row>

        <PhoneInput
          copyNumbersOnly={false}
          country="us"
          inputProps={{ required: true, name: 'phoneNumber', country: 'us' }}
          placeholder=""
          specialLabel=""
          value={auction.delivery.address.phoneNumber || auction.winner.phoneNumber}
          onChange={handleChange}
        />

        <SubmitButton className="w-100"> {updating ? <Spinner animation="border" size="sm" /> : 'Submit'}</SubmitButton>
      </Form>
    </UserDialogLayout>
  );
}
