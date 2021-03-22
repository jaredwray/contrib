import { useCallback, useMemo, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { addDays, differenceInCalendarDays, parseISO } from 'date-fns';
import { format, toDate, utcToZonedTime } from 'date-fns-tz';
import { Button, Container, ProgressBar } from 'react-bootstrap';
import { Field } from 'react-final-form';
import { useHistory, useParams } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';

import { getAuctionDetails, updateAuctionDetails, updateAuctionStatusMutation } from 'src/apollo/queries/auctions';
import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';
import SelectField from 'src/components/Form/SelectField';
import Layout from 'src/components/Layout';
import StepByStepRow from 'src/components/StepByStepRow';
import { Charity } from 'src/types/Charity';

import Row from '../common/Row';
import StepHeader from '../common/StepHeader';
import { durationOptions, timeZones } from './consts';
import StartDateField from './StartDateField';
import styles from './styles.module.scss';
import { serializeStartDate } from './utils';

const EditAuctionDetailsPage = () => {
  const { addToast } = useToasts();
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const [charities, setCharities] = useState<Charity[]>([]);
  const { loading: loadingQuery, data: auctionData } = useQuery(getAuctionDetails, {
    variables: { id: auctionId },
    onCompleted({ auction }) {
      if (auction.charity) {
        setCharities([auction.charity]);
      }
    },
  });
  const [updateAuctionStatus, { loading: updatingStatus }] = useMutation(updateAuctionStatusMutation, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/done`);
    },
  });

  const [updateAuction, { loading: updating }] = useMutation(updateAuctionDetails, {
    async onCompleted() {
      try {
        await updateAuctionStatus({ variables: { id: auctionId, status: 'ACTIVE' } });
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
      const { startDate, duration, ...rest } = values;

      const serializedStartDate = serializeStartDate(startDate);
      const endDate = addDays(toDate(parseISO(serializedStartDate)), duration).toISOString();

      const clearValues = { ...rest, startDate: serializedStartDate, endDate: endDate, charity: charities[0]?.id };

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
    const { startDate, endDate } = auctionData?.auction;
    const duration = differenceInCalendarDays(toDate(parseISO(endDate)), toDate(parseISO(startDate)));
    return durationOptions.find(({ value }) => parseInt(value, 10) === duration);
  }, [auctionData?.auction]);

  const { startDate, endDate, startPrice, charity } = auctionData?.auction ?? {};

  const initialValues = useMemo(() => {
    if (!startDate) {
      return undefined;
    }

    const defaultTimezone = timeZones[0].value;

    const currentTimeZone = format(new Date(), 'x');
    const knownTimezone = timeZones.find(({ value }) => currentTimeZone === value);

    const date = knownTimezone ? toDate(startDate) : utcToZonedTime(startDate, defaultTimezone);

    const time = format(date, 'hh:mm');
    const dayPeriod = format(date, 'aaa');
    const duration = differenceInCalendarDays(toDate(parseISO(endDate)), toDate(parseISO(startDate)));

    return {
      startPrice,
      charity,
      startDate: {
        date: date,
        time: time,
        dayPeriod: dayPeriod,
        timeZone: knownTimezone?.value || defaultTimezone,
      },
      duration: duration,
    };
  }, [startDate, endDate, startPrice, charity]);

  if (loadingQuery) {
    return null;
  }
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
              <CharitiesAutocomplete charities={charities} onChange={handleCharityChange} />
              <p className="text--body mb-sm-4">Don’t see a charity you’re looking for?</p>
              <Button className={styles.suggestButton} variant="secondary">
                Suggest a charity
              </Button>
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
