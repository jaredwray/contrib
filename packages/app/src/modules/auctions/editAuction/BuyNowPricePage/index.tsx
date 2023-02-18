import { useCallback, useContext, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import Dinero from 'dinero.js';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';

import Row from '../common/Row';

const BuyNowPricePage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const [submitValue, setSubmitValue] = useState();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const { isActive } = auction || {};
  const startPrice = Dinero(auction?.startPrice);

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    /* istanbul ignore next */
    onCompleted() {
      if (isActive) {
        history.goBack();
      } else {
        history.push(`/auctions/${auctionId}/bids-step`);
      }
    },
  });
  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/price/starting`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitValue(values.itemPrice);

      const itemPrice = Dinero(values.itemPrice);
      if (!itemPrice.isZero() && itemPrice.getAmount() <= startPrice.getAmount()) {
        showWarning(`Buy it Now Price should be greater than Starting Price ${startPrice.toFormat('$0')}`);
        return;
      }

      try {
        await updateAuction({ variables: { id: auctionId, input: values } });
        if (isActive) showMessage('Updated');
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, updateAuction, showMessage, showError, showWarning, isActive, startPrice],
  );

  if (!account?.isAdmin && isActive) {
    history.push(`/`);
    return null;
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined) return null;

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
      step={5}
      title={isActive ? 'Edit Buy it Now Price' : 'Buy it Now'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>{!loadingQuery && <MoneyField name="itemPrice" />}</Row>
    </StepByStepPageLayout>
  );
};

export default BuyNowPricePage;
