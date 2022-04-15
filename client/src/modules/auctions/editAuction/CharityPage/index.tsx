import { useCallback, useContext, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';

import {
  GetAuctionDetailsQuery,
  UpdateAuctionMutation,
  FinishAuctionCreationMutation,
} from 'src/apollo/queries/auctions';
import { ActiveCharitiesList } from 'src/apollo/queries/charities';
import { CharitySearchSelect, Option } from 'src/components/forms/selects/CharitySearchSelect';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';
import StepByStepPageLayout from 'src/components/layouts/StepByStepPageLayout';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';
import { Charity, CharityStatus } from 'src/types/Charity';

import Row from '../common/Row';

const CharityPage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showError, showWarning } = useShowNotification();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
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
      if (account?.isAdmin) {
        history.push(`/auctions/${auctionId}/private`);
        return;
      }
      try {
        await finishAuctionCreation({ variables: { id: auctionId } });
      } catch (error: any) {
        showError(error.message);
      }
    },
  });

  const { description, itemPrice, startPrice, attachments, fairMarketValue, items, charity } = auction || {};
  const isFullObject = Boolean(description && itemPrice && (fairMarketValue || items?.length) && attachments.length);

  const charityOption = useCallback((charity: Charity): Option => {
    return { label: charity.name, value: charity.id, id: charity.id };
  }, []);
  const handlePrevAction = useCallback(() => history.push(`/auctions/${auctionId}/duration`), [auctionId, history]);
  const submitValidationRedirect = useCallback(() => {
    if (!description) {
      history.push(`/auctions/${auctionId}/description`);
      showWarning('You should fill in description field');
      return;
    }
    if (!attachments?.length) {
      history.push(`/auctions/${auctionId}/attachments`);
      showWarning('You need to upload at least one attachment');
      return;
    }
    if (startPrice && !itemPrice) {
      history.push(`/auctions/${auctionId}/price/starting`);
      showWarning('You should fill in starting price field');
      return;
    }
    if (!fairMarketValue && !items?.length) {
      history.push(`/auctions/${auctionId}/price/fmv`);
      showWarning('You should fill in fair market value field');
      return;
    }
  }, [
    attachments?.length,
    auctionId,
    description,
    history,
    startPrice,
    itemPrice,
    fairMarketValue,
    items?.length,
    showWarning,
  ]);
  const handleSubmit = useCallback(async () => {
    if (!selectedOption) {
      showWarning('You should select charity');
      return;
    }
    submitValidationRedirect();
    if (!isFullObject) return;

    try {
      await updateAuction({ variables: { id: auctionId, charity: selectedOption.id } });
    } catch (error: any) {
      showError(error.message);
    }
  }, [auctionId, updateAuction, showError, showWarning, selectedOption, isFullObject, submitValidationRedirect]);

  useEffect(() => {
    charity && setSelectedOption(charityOption(charity));
  }, [charity, charityOption, setSelectedOption]);

  if (!account?.isAdmin && isActive) {
    history.push(`/`);
    return null;
  }
  if (auction === null) {
    history.replace('/404');
    return null;
  }
  if (auction === undefined || !charitiesListData) return null;

  const favoriteCharities = auction.auctionOrganizer.favoriteCharities;
  const favoriteCharitiesIds = favoriteCharities.map((charity: Charity) => charity.id);
  const options = [
    ...favoriteCharities,
    ...charitiesListData.charitiesList.items.filter((ch: Charity) => !favoriteCharitiesIds.includes(ch.id)),
  ].map((charity: Charity) => charityOption(charity));

  setPageTitle(`Edit Auction ${auction.title} | Charity`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={auction}
      isActive={isActive}
      loading={updating || updatingStatus}
      prevAction={handlePrevAction}
      step={9}
      title={isActive ? 'Edit Charity' : 'Charity'}
      onSubmit={handleSubmit}
    >
      <Row description="What charity will benefit from the proceeds of this auction.">
        {!loadingQuery && (
          <CharitySearchSelect options={options} selectedOption={selectedOption} onChange={setSelectedOption} />
        )}
      </Row>
    </StepByStepPageLayout>
  );
};

export default CharityPage;
