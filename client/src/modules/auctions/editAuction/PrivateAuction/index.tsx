import { useCallback } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import {
  FinishAuctionCreationMutation,
  GetAuctionDetailsQuery,
  UpdateAuctionMutation,
} from 'src/apollo/queries/auctions';
import InputField from 'src/components/forms/inputs/InputField';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { useShowNotification } from 'src/helpers/useShowNotification';

import Row from '../common/Row';

const PrivateAuction = () => {
  const history = useHistory();
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showError } = useShowNotification();

  const { data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });

  const auction = auctionData?.auction;
  const [updateAuction, { loading }] = useMutation(UpdateAuctionMutation, {
    async onCompleted() /* istanbul ignore next */ {
      try {
        await finishAuctionCreation({ variables: { id: auctionId } });
      } catch (error: any) {
        showError(error.message);
      }
    },
  });
  const [finishAuctionCreation, { loading: updating }] = useMutation(FinishAuctionCreationMutation, {
    onCompleted() /* istanbul ignore next */ {
      history.push(`/auctions/${auctionId}/done`);
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/charity`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      try {
        await updateAuction({ variables: { ...values, id: auctionId } });
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, showError, updateAuction],
  );

  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined) return null;

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ password: auction.password }}
      loading={loading || updating}
      prevAction={handlePrevAction}
      step={9}
      title="Private Auction"
      onSubmit={handleSubmit}
    >
      <Row description="Enter any password here and this auction will be private. Only user with this password and direct link will see it.">
        <InputField name="password" />
      </Row>
    </StepByStepPageLayout>
  );
};

export default PrivateAuction;
