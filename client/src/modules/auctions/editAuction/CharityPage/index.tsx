import { useCallback, useContext, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import {
  GetAuctionDetailsQuery,
  UpdateAuctionMutation,
  FinishAuctionCreationMutation,
} from 'src/apollo/queries/auctions';
import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import StepByStepPageLayout from 'src/components/StepByStepPageLayout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Charity } from 'src/types/Charity';

import Row from '../common/Row';

const CharityPage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showError } = useShowNotification();
  const [charities, setCharities] = useState<Charity[]>([]);
  const history = useHistory();

  const { data: auctionData, loading: loadingQuery } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
    // fetchPolicy: 'cache-and-network',
    onCompleted({ auction }) {
      if (auction?.charity) {
        setCharities([auction.charity]);
      }
    },
  });
  const auction = auctionData?.auction;
  const { isActive } = auction || {};
  const [finishAuctionCreation, { loading: updatingStatus }] = useMutation(FinishAuctionCreationMutation, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/done`);
    },
  });
  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    async onCompleted() {
      try {
        await finishAuctionCreation({ variables: { id: auctionId } });
      } catch (error: any) {
        showError(error.message);
      }
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/duration`);
  }, [auctionId, history]);

  const handleCharityChange = useCallback(
    (charity: Charity, shouldBeFavorite: boolean) => {
      const index = charities.findIndex((c: Charity) => c.id === charity.id);
      const isFavorite = index >= 0;

      if (isFavorite && !shouldBeFavorite) {
        setCharities([...charities.slice(0, index), ...charities.slice(index + 1)]);
      } else if (!isFavorite && shouldBeFavorite) {
        setCharities([charity]);
      }
    },
    [charities, setCharities],
  );
  const { description, itemPrice, startPrice, attachments } = auction || {};
  const videoAttachments = attachments?.filter((attachment: any) => attachment?.type === 'VIDEO');
  const isFullObject = Boolean(description && itemPrice && videoAttachments.length);

  const submitValidationRedirect = useCallback(() => {
    if (!description) {
      history.push(`/auctions/${auctionId}/description`);
      showError('You should fill in description field');
      return;
    }
    if (!videoAttachments?.length) {
      history.push(`/auctions/${auctionId}/video`);
      showError('You need to upload at least one attachment');
      return;
    }
    if (startPrice && !itemPrice) {
      history.push(`/auctions/${auctionId}/price/starting`);
      showError('You should fill in starting price field');
      return;
    }
    return;
  }, [videoAttachments?.length, auctionId, description, history, startPrice, itemPrice, showError]);
  const handleSubmit = useCallback(async () => {
    if (!charities[0]?.id) {
      showError('You should select charity');
      return;
    }
    submitValidationRedirect();
    if (!isFullObject) {
      return;
    }
    try {
      await updateAuction({ variables: { id: auctionId, charity: charities[0]?.id } });
    } catch (error: any) {
      showError(error.message);
    }
  }, [auctionId, updateAuction, showError, charities, isFullObject, submitValidationRedirect]);

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

  const textBlock = 'What charity will benefit from the proceeds of this auction.';

  setPageTitle(`Edit Auction ${auction.title} | Charity`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={auction}
      isActive={isActive}
      loading={updating || updatingStatus}
      prevAction={handlePrevAction}
      progress={88.88}
      step="8"
      title={isActive ? 'Edit Charity' : 'Charity'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>
        {!loadingQuery && (
          <CharitiesAutocomplete
            charities={charities}
            favoriteCharities={auction?.auctionOrganizer?.favoriteCharities}
            onChange={handleCharityChange}
          />
        )}
      </Row>
    </StepByStepPageLayout>
  );
};

export default CharityPage;
