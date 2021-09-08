import { useCallback, useContext, useEffect } from 'react';

import { useMutation, useLazyQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionDetailsQuery, UpdateAuctionMutation, CreateAuctionMutation } from 'src/apollo/queries/auctions';
import InputField from 'src/components/Form/InputField';
import StepByStepPageLayout from 'src/components/StepByStepPageLayout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
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
    if (auctionId) {
      getAuctionsDetails({ variables: { id: auctionId } });
    }
  }, [auctionId, getAuctionsDetails]);

  const auction = auctionData?.auction;
  const { isActive } = auction || {};

  const [createAuction, { loading }] = useMutation(CreateAuctionMutation, {
    onCompleted({ createAuction }) {
      if (createAuction.id) {
        const newUrl = `/auctions/${createAuction.id}/description`;
        history.push(newUrl);
      }
    },
  });
  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    onCompleted() {
      if (isActive) {
        history.goBack();
        return;
      }
      history.push(`/auctions/${auctionId}/description`);
    },
  });

  const handleSubmit = useCallback(
    async (values) => {
      if (auctionId) {
        try {
          await updateAuction({ variables: { id: auctionId, title: values.title } });
          if (isActive) {
            showMessage('Updated');
          }
        } catch (error: any) {
          showError(error.message);
        }
        return;
      }
      try {
        const variables = ownerId ? { ...values, organizerId: ownerId } : values;
        await createAuction({ variables });
      } catch (error: any) {
        showError(error.message);
      }
    },
    [auctionId, updateAuction, showMessage, showError, isActive, ownerId, createAuction],
  );
  if (auctionId) {
    if (!account?.isAdmin && isActive) {
      history.push(`/`);
    }
    if (auction === null) {
      history.replace('/404');
      return null;
    }
    if (auction === undefined) {
      return null;
    }
  }
  setPageTitle(auction?.title ? `Edit Auction ${auction?.title} | Auction Title` : 'New Auction | Auction Title');

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ title: auction?.title || null, description: auction?.description || null }}
      isActive={isActive}
      loading={updating || loading}
      progress={11.11}
      step="1"
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
