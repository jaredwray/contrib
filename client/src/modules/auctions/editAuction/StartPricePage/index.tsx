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

const StartPricePage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const history = useHistory();
  const [submitValue, setSubmitValue] = useState();

  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const { isActive, startPrice } = auction || {};

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    onCompleted() {
      if (isActive) {
        history.goBack();
        return;
      }
      history.push(`/auctions/${auctionId}/price/buying`);
    },
  });
  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/photo`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitValue(values.startPrice);
      if (values.startPrice.amount === 0) {
        showWarning('Starting Price cannot be zero');
        return;
      }
      try {
        await updateAuction({ variables: { id: auctionId, ...values } });
        if (isActive) {
          showMessage('Updated');
        }
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, updateAuction, showMessage, showError, showWarning, isActive],
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
  const textBlock =
    'The starting price for the item which determines the minimum amount that can be bid. The item will not sell if no bids at or above this price are received.';

  setPageTitle(`Edit Auction ${auction.title} | Starting Price`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ startPrice: Dinero(submitValue ?? startPrice).toObject() }}
      isActive={isActive}
      loading={updating}
      prevAction={handlePrevAction}
      progress={55.55}
      step="5"
      title={isActive ? 'Edit Starting Price' : 'Starting Price'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>{!loadingQuery && <MoneyField name="startPrice" />}</Row>
    </StepByStepPageLayout>
  );
};

export default StartPricePage;
