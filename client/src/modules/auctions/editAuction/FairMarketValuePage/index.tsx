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

const FairMarketValuePage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showMessage, showError, showWarning } = useShowNotification();
  const history = useHistory();
  const [submitValue, setSubmitValue] = useState();

  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const { isActive, fairMarketValue } = auction || {};

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    /* istanbul ignore next */
    onCompleted() {
      if (isActive) {
        history.goBack();
        return;
      }
      history.push(`/auctions/${auctionId}/duration`);
    },
  });
  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/price/buying`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      setSubmitValue(values.fairMarketValue);
      if (values.fairMarketValue.amount === 0) {
        showWarning('Fair Market Value cannot be zero');
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
    'The fair market value is the price something would sell for on the open market. A good example of this is a jersey signed or not would have a fair market value of $99 dollars which is what it is online.';

  setPageTitle(`Edit Auction ${auction.title} | Fair Market Value`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ fairMarketValue: Dinero(submitValue ?? fairMarketValue).toObject() }}
      isActive={isActive}
      loading={updating}
      prevAction={handlePrevAction}
      progress={70}
      step="7"
      title={isActive ? 'Edit Fair Market Value' : 'Fair Market Value'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>{!loadingQuery && <MoneyField name="fairMarketValue" />}</Row>
    </StepByStepPageLayout>
  );
};

export default FairMarketValuePage;
