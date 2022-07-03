import { useCallback, useContext, useEffect } from 'react';

import { useMutation, useLazyQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionDetailsQuery, UpdateAuctionMutation, CreateAuctionMutation } from 'src/apollo/queries/auctions';
import InputField from 'src/components/forms/inputs/InputField';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';

import Row from '../common/Row';
import styles from './styles.module.scss';

const EditAuctionPage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { ownerId } = useParams<{ ownerId: string }>();
  const { showError, showMessage } = useShowNotification();
  const history = useHistory();

  const [getAuctionsDetails, { data: auctionData, error: loadingQuery }] = useLazyQuery(GetAuctionDetailsQuery);

  useEffect(() => {
    if (auctionId) getAuctionsDetails({ variables: { id: auctionId } });
  }, [auctionId, getAuctionsDetails]);

  const auction = auctionData?.auction;
  const { isActive } = auction || {};

  const [createAuction, { loading }] = useMutation(CreateAuctionMutation, {
    onCompleted({ createAuction }) /* istanbul ignore next */ {
      if (createAuction.id) history.push(`/auctions/${createAuction.id}/description`);
    },
  });
  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    onCompleted() /* istanbul ignore next */ {
      if (isActive) {
        history.goBack();
      } else {
        history.push(`/auctions/${auctionId}/description`);
      }
    },
  });

  const tryToUpdateAuction = useCallback(
    async (values) => {
      try {
        await updateAuction({ variables: { id: auctionId, input: values } });
      } catch (error: any) {
        showError(error.message);
      }

      if (isActive) showMessage('Updated');
    },
    [updateAuction, showError, showMessage, auctionId, isActive],
  );

  const handleSubmit = useCallback(
    async (values) => {
      if (auctionId) {
        tryToUpdateAuction(values);
        return;
      }
      const input = ownerId ? { ...values, organizerId: ownerId } : values;

      try {
        await createAuction({ variables: { input } });
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, showError, ownerId, createAuction, tryToUpdateAuction],
  );

  if (auctionId) {
    if (!account?.isAdmin && isActive) {
      history.push(`/`);
      return null;
    }
    if (auction === null) {
      history.replace('/404');
      return null;
    }
    if (auction === undefined) return null;
  }

  setPageTitle(auction?.title ? `Edit Auction ${auction?.title} | Auction Title` : 'New Auction | Auction Title');

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ title: auction?.title, description: auction?.description }}
      isActive={isActive}
      loading={updating || loading}
      step={1}
      title={isActive ? 'Edit Auction Info' : 'Auction Title'}
      onSubmit={handleSubmit}
    >
      <Row description="Describe in a couple of words what this auction is for. An example could be 'Autographed Game Worn Jersey'. Please make sure to add some detail to it.">
        {!loadingQuery && (
          <>
            <InputField required name="title" placeholder="Enter auction title" />
            {isActive && (
              <InputField
                required
                textarea
                className={styles.description}
                externalText="This is the full description that will appear on the Contrib auction page along side the bidding box etc."
                name="description"
                placeholder="Enter full description"
                title="Full description"
              />
            )}
          </>
        )}
      </Row>
    </StepByStepPageLayout>
  );
};

export default EditAuctionPage;
