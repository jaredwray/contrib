import { useCallback, useContext } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { useHistory, useParams } from 'react-router-dom';

import { GetAuctionDetailsQuery, UpdateAuctionMutation } from 'src/apollo/queries/auctions';
import SelectField from 'src/components/Form/SelectField';
import StepByStepPageLayout from 'src/components/StepByStepPageLayout';
import { UserAccountContext } from 'src/components/UserAccountProvider/UserAccountContext';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { useShowNotification } from 'src/helpers/useShowNotification';

import Row from '../common/Row';
import { durationOptions } from './consts';

const DurationPage = () => {
  const { account } = useContext(UserAccountContext);
  const { auctionId } = useParams<{ auctionId: string }>();
  const { showError } = useShowNotification();
  const history = useHistory();

  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
  });
  const auction = auctionData?.auction;
  const { isActive } = auction || {};

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionMutation, {
    onCompleted() {
      if (isActive) {
        history.goBack();
        return;
      }
      history.push(`/auctions/${auctionId}/charity`);
    },
  });
  const selectedOption = useCallback(() => {
    const duration = differenceInCalendarDays(parseISO(auction?.endDate), parseISO(auction?.startDate)) || 3;
    return durationOptions.find(({ value }) => parseInt(value, 10) === duration);
  }, [auction]);
  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/price/buying`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      const { duration } = values;

      try {
        await updateAuction({ variables: { id: auctionId, duration: Number(duration) } });
      } catch (error: any) {
        showError(error.message);
      }
    },

    [auctionId, updateAuction, showError],
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
  const textBlock = 'How long the auction should run for? Our recommended time is usually 3 days';

  setPageTitle(`Edit Auction ${auction.title} | Duration`);

  return (
    <StepByStepPageLayout
      header="Auction an item"
      initialValues={{ duration: selectedOption()?.value }}
      isActive={isActive}
      loading={updating}
      prevAction={handlePrevAction}
      progress={77.77}
      step="7"
      title={isActive ? 'Edit Duration' : 'Duration'}
      onSubmit={handleSubmit}
    >
      <Row description={textBlock}>
        {!loadingQuery && (
          <SelectField
            name="duration"
            options={durationOptions}
            placeholder="Choose length of time"
            selected={selectedOption()}
          />
        )}
      </Row>
    </StepByStepPageLayout>
  );
};

export default DurationPage;
