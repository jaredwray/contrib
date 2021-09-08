import { useCallback, useContext, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import Dinero from 'dinero.js';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import MoneyField from 'src/components/Form/MoneyField';
import StepByStepPageLayout from 'src/components/StepByStepPageLayout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';

import Row from '../common/Row';

const BuyNowPricePage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError } = useShowNotification();
  const [submitValue, setSubmitValue] = useState();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const { isActive } = auction || {};

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    onCompleted() {
      if (isActive) {
        history.goBack();
        return;
      }
      history.push(`/auctions/${auctionId}/duration`);
    },
  });
  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/price/starting`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitValue(values.itemPrice);
      try {
        await updateAuction({ variables: { id: auctionId, ...values } });
        if (isActive) {
          showMessage('Updated');
        }
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, updateAuction, showMessage, showError, isActive],
  );

  if (!account?.isAdmin && isActive) {
    history.push(`/`);
    return null;
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined) {
    return null;
  }
  const auctionPrice = auction.itemPrice ?? {
    amount: Number((auction?.startPrice?.amount * 20).toFixed(2)),
    currency: 'USD',
  };

  const textBlock =
    "We usually suggested making the 'Buy it now' button 20x what you starting price is so that bidders have to ability to purchase the item before the auction time closes. If you do not want a 'Buy it Now' option just enter $0";

  setPageTitle(`Edit Auction ${auction.title} | Buy it Now Price`);
  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ itemPrice: Dinero(submitValue ?? auctionPrice).toObject() }}
      isActive={isActive}
      loading={updating}
      prevAction={handlePrevAction}
      progress={66.66}
      step="6"
      title={isActive ? 'Edit Buy it Now Price' : 'Buy it Now'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>{!loadingQuery && <MoneyField name="itemPrice" />}</Row>
    </StepByStepPageLayout>
  );
};

export default BuyNowPricePage;
