import { useCallback, useContext, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import {
  GetAuctionDetailsQuery,
  UpdateAuctionMutation,
  FinishAuctionCreationMutation,
} from 'src/apollo/queries/auctions';
import { ActiveCharitiesList } from 'src/apollo/queries/charities';
import { CharitySearchSelect } from 'src/components/forms/selects/CharitySearchSelect';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Charity, CharityStatus } from 'src/types/Charity';

import Row from '../common/Row';

const CharityPage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showError } = useShowNotification();
  const [selectedOption, setselectedOption] = useState<any>(null);
  const history = useHistory();

  const { data: charitiesListData } = useQuery(ActiveCharitiesList, {
    variables: { filters: { status: [CharityStatus.ACTIVE] } },
  });

  const { data: auctionData, loading: loadingQuery } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const { isActive } = auction || {};
  const [finishAuctionCreation, { loading: updatingStatus }] = useMutation(FinishAuctionCreationMutation, {
    /* istanbul ignore next */
    onCompleted() {
      history.push(`/auctions/${auctionId}/done`);
    },
  });
  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    /* istanbul ignore next */
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

  const { description, itemPrice, startPrice, attachments, fairMarketValue } = auction || {};
  const videoAttachments = attachments?.filter((attachment: any) => attachment?.type === 'VIDEO');
  const isFullObject = Boolean(description && itemPrice && fairMarketValue && videoAttachments.length);

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
    if (!fairMarketValue) {
      history.push(`/auctions/${auctionId}/price/fmv`);
      showError('You should fill in fair market value field');
      return;
    }
    return;
  }, [videoAttachments?.length, auctionId, description, history, startPrice, itemPrice, fairMarketValue, showError]);
  const handleSubmit = useCallback(async () => {
    if (!selectedOption) {
      showError('You should select charity');
      return;
    }
    submitValidationRedirect();
    if (!isFullObject) return;

    try {
      await updateAuction({ variables: { id: auctionId, charity: selectedOption.id } });
    } catch (error: any) {
      showError(error.message);
    }
  }, [auctionId, updateAuction, showError, selectedOption, isFullObject, submitValidationRedirect]);

  if (!account?.isAdmin && isActive) {
    history.push(`/`);
    return null;
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined || !charitiesListData) return null;

  const favouriteCharities = auction.auctionOrganizer.favoriteCharities.map((charity: { id: string; name: string }) => {
    return { label: charity.name, value: charity.name, id: charity.id };
  });
  const notFavouriteCharities = charitiesListData.charitiesList.items
    .filter(
      (charity: Charity) =>
        !favouriteCharities
          .map((charity: { label: string; value: string; id: string }) => charity.id)
          .includes(charity.id),
    )
    .map((charity: Charity) => {
      return { label: charity.name, value: charity.name, id: charity.id };
    });

  const handleChange = (selectedOption: { label: string; value: string; id: string } | null) => {
    setselectedOption(selectedOption);
  };
  const options = favouriteCharities.concat(notFavouriteCharities);
  const textBlock = 'What charity will benefit from the proceeds of this auction.';

  setPageTitle(`Edit Auction ${auction.title} | Charity`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={auction}
      isActive={isActive}
      loading={updating || updatingStatus}
      prevAction={handlePrevAction}
      progress={90}
      step="9"
      title={isActive ? 'Edit Charity' : 'Charity'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>
        {!loadingQuery && (
          <CharitySearchSelect options={options} selectedOption={selectedOption} onChange={handleChange} />
        )}
      </Row>
    </StepByStepPageLayout>
  );
};

export default CharityPage;
