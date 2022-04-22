import { useCallback, useContext, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import Dinero from 'dinero.js';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import MoneyField from 'src/components/forms/inputs/MoneyField';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { MIN_BID_STEP_VALUE, MAX_PRICE_VALUE } from 'src/constants';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';

import Row from '../common/Row';

const BidsStepPage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const [submitValue, setSubmitValue] = useState();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const { isActive, bidStep } = auction || {};

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    /* istanbul ignore next */
    onCompleted() {
      if (isActive) {
        history.goBack();
      } else {
        history.push(`/auctions/${auctionId}/price/fmv`);
      }
    },
  });
  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/price/buying`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitValue(values.bidStep);
      if (values.bidStep.amount / 100 < MIN_BID_STEP_VALUE) {
        showWarning(`Minimum value is $${MIN_BID_STEP_VALUE}`);
        return;
      }
      const maxValue = MAX_PRICE_VALUE - auction.startPrice.amount / 100;
      if (values.bidStep.amount > maxValue) {
        showWarning(`Maximum value is $${maxValue}`);
        return;
      }

      try {
        await updateAuction({ variables: { id: auctionId, input: values } });
        if (isActive) showMessage('Updated');
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, updateAuction, showMessage, showError, showWarning, isActive, auction],
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

  const textBlock = `The bids step price for the item which determines the minimum price increase for the next bid. Minimum value is $${MIN_BID_STEP_VALUE}.`;

  setPageTitle(`Edit Auction ${auction.title} | Bids Step`);
  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ bidStep: Dinero(submitValue ?? bidStep).toObject() }}
      isActive={isActive}
      loading={updating}
      prevAction={handlePrevAction}
      step={6}
      title={`${isActive ? 'Edit ' : ''}Bids Step`}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>{!loadingQuery && <MoneyField name="bidStep" />}</Row>
    </StepByStepPageLayout>
  );
};

export default BidsStepPage;
