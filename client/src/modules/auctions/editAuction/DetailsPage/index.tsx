import { useCallback, useMemo, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { addDays, differenceInCalendarDays, max, parseISO } from 'date-fns';
import { format, toDate, utcToZonedTime } from 'date-fns-tz';
import Dinero from 'dinero.js';
import { Container, ProgressBar } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import {
  GetAuctionDetailsQuery,
  UpdateAuctionDetailsMutation,
  FinishAuctionCreationMutation,
} from 'src/apollo/queries/auctions';
import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';
import SelectField from 'src/components/Form/SelectField';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';
import { setPageTitle } from 'src/helpers/setPageTitle';
import { Charity } from 'src/types/Charity';

import Row from '../common/Row';
import StepHeader from '../common/StepHeader';
import { durationOptions, utcTimeZones } from './consts';
import StartDateField from './StartDateField';
import styles from './styles.module.scss';
import { serializeStartDate } from './utils';

const EditAuctionDetailsPage = () => {
  const { addToast } = useToasts();
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const [charities, setCharities] = useState<Charity[]>([]);
  const { loading: loadingQuery, data: auctionData } = useQuery(GetAuctionDetailsQuery, {
    variables: { id: auctionId },
    onCompleted({ auction }) {
      if (auction.charity) {
        setCharities([auction.charity]);
      }
    },
  });
  const auction = auctionData?.auction;
  const [finishAuctionCreation, { loading: updatingStatus }] = useMutation(FinishAuctionCreationMutation, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/done`);
    },
  });

  const [updateAuction, { loading: updating }] = useMutation(UpdateAuctionDetailsMutation, {
    async onCompleted() {
      try {
        await finishAuctionCreation({ variables: { id: auctionId } });
      } catch (error) {
        addToast(error.message, { appearance: 'error', autoDismiss: true });
      }
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/media`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    async (values) => {
      const { startDate, duration, startPrice, itemPrice, ...rest } = values;
      const serializedStartDate = serializeStartDate(startDate);
      const endDate = addDays(toDate(parseISO(serializedStartDate)), duration).toISOString();

      const clearValues = {
        ...rest,
        startPrice: startPrice,
        startDate: serializedStartDate,
        itemPrice: itemPrice.amount === 0 ? null : itemPrice,
        endDate: endDate,
        charity: charities[0]?.id,
        timeZone: utcTimeZones.find((timeZone) => timeZone.value === startDate.timeZone)?.label,
      };

      if (itemPrice.amount > 0 && itemPrice.amount < startPrice.amount) {
        addToast(`'Buy it now' price can't be smaller than Starting price`, { autoDismiss: true, appearance: 'error' });
        return;
      }

      if (!clearValues.charity) {
        addToast('You should select charity', { autoDismiss: true, appearance: 'error' });
        return;
      }

      try {
        await updateAuction({ variables: { id: auctionId, ...clearValues } });
      } catch (error) {
        addToast(error.message, { appearance: 'error', autoDismiss: true });
      }
    },
    [auctionId, charities, updateAuction, addToast],
  );

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

  const selectedOption = useCallback(() => {
    const startDate = max([toDate(auction?.startDate), new Date()]);

    const endDate = max([toDate(auction?.endDate), addDays(startDate, 1)]);
    const duration = differenceInCalendarDays(endDate, startDate);

    return durationOptions.find(({ value }) => parseInt(value, 10) === duration);
  }, [auction]);

  const { startPrice, itemPrice, charity, isActive } = auction ?? {};
  const initialValues = useMemo(() => {
    if (!auction) {
      return undefined;
    }
    const timeZone = utcTimeZones.find((timeZone) => timeZone.label === auction.timeZone)?.value;
    const defaultTimezone = utcTimeZones[0].value;
    const isNew = auction.startPrice.amount === 0;
    let startDate;
    isNew
      ? (startDate = max([toDate(auction.startDate), new Date()]))
      : (startDate = utcToZonedTime(auction.startDate, timeZone || ''));
    const time = format(startDate, 'H:mm');
    return {
      startPrice: Dinero.maximum([Dinero(startPrice), Dinero({ amount: 100 })]).toObject(),
      itemPrice: Dinero(itemPrice).toObject(),
      charity,
      duration: selectedOption()?.value,
      startDate: {
        date: startDate,
        time,
        timeZone: defaultTimezone,
      },
    };
  }, [auction, selectedOption, startPrice, charity, itemPrice]);

  if (loadingQuery || !auctionData) {
    return null;
  }

  if (isActive) {
    history.push(`/`);
  }

  setPageTitle(`Auction ${auction.title} | Details page`);

  return (
    <Layout>
      <ProgressBar now={75} />

      <section className={styles.section}>
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
          <Container>
            <StepHeader step="3" title="Details" />

            <Row
              description="The starting price for the item which determines the minimum amount that can be bid. The item will not sell if no bids at or above this price are received."
              title="Starting price"
            >
              <MoneyField name="startPrice" />
            </Row>
            <Row
              description="The price for which user can buy the product without participating in the promotion. This field is optional"
              title="Price to Buy it now"
            >
              <MoneyField name="itemPrice" />
            </Row>

            <Row description="The day and time your auction will start." title="Start date & time">
              <StartDateField name="startDate" />
            </Row>
            <Row description="How long the auction should run for." title="Duration">
              <SelectField
                name="duration"
                options={durationOptions}
                placeholder="Choose length of time"
                selected={selectedOption()}
              />
            </Row>
            <Row description="What charity will benefit from the proceeds of this auction." title="Charity">
              <CharitiesAutocomplete
                charities={charities}
                favoriteCharities={auction?.auctionOrganizer?.favoriteCharities}
                onChange={handleCharityChange}
              />
              {/*
              <p className="text--body mb-sm-4">Don’t see a charity you’re looking for?</p>
              <Button className={clsx(styles.suggestButton, 'text-label')} variant="secondary">
                Suggest a charity
              </Button>
              */}
            </Row>
          </Container>
          <Field name="charity">{({ input }) => <input type="hidden" {...input} />}</Field>
          <StepByStepRow last loading={updating || updatingStatus} prevAction={handlePrevAction} />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionDetailsPage;
