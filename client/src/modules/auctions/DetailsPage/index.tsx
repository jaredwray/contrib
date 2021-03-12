import { useCallback, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { toDate, format } from 'date-fns-tz';
import { Container, Dropdown, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { getAuctionDetails, updateAuctionDetails, updateAuctionStatusMutation } from 'src/apollo/queries/auctions';
import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';
import SelectField from 'src/components/Form/SelectField';
import Layout from 'src/components/Layout';
import { Charity } from 'src/types/Charity';

import Row from '../common/Row';
import StepByStepRow from '../common/StepByStepRow';
import StepHeader from '../common/StepHeader';
import StartDateField from './StartDateField';
import styles from './styles.module.scss';
import { serializeStartDate } from './utils';

const EditAuctionDetailsPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();
  const [charities, setCharities] = useState<Charity[]>([]);
  console.log('🚀 ~ file: index.tsx ~ line 28 ~ EditAuctionDetailsPage ~ charities', charities);

  const { loading: loadingQuery, data: auctionData } = useQuery(getAuctionDetails, {
    variables: { id: auctionId },
  });
  const [updateAuctionStatus, { loading: updatingStatus }] = useMutation(updateAuctionStatusMutation, {
    onCompleted() {
      history.push(`/auctions/${auctionId}/done`);
    },
    onError(error) {
      console.log(error);
    },
  });

  const [updateAuction, { loading: updating }] = useMutation(updateAuctionDetails, {
    // onCompleted() {
    //   updateAuctionStatus({ variables: { id: auctionId, status: 'ACTIVE' } });
    // },
    onError(error) {
      console.log(error);
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/media`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    (values) => {
      const { startDate, ...rest } = values;
      const clearValues = { ...rest, startDate: serializeStartDate(startDate), charity: charities[0] };

      console.log('🚀 ~ file: index.tsx ~ line 60 ~ EditAuctionDetailsPage ~ clearValues', clearValues);
      updateAuction({ variables: { id: auctionId, ...clearValues } });
    },
    [auctionId, charities, updateAuction],
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

  if (loadingQuery) {
    return null;
  }

  const { startDate, ...rest } = auctionData?.auction;

  const currentDate = toDate(startDate);
  const time = format(currentDate, 'hh:mm');
  const dayPeriod = format(currentDate, 'aaa');
  const currentTimeZone = format(currentDate, 'xx');

  const initialValues = {
    ...rest,
    startDate: {
      date: currentDate,
      time: time,
      dayPeriod: dayPeriod,
      timeZone: currentTimeZone,
    },
  };

  return (
    <Layout>
      <ProgressBar now={75} />

      <section className={styles.section}>
        <Form initialValues={initialValues} onSubmit={handleSubmit}>
          <Container className={styles.root}>
            <StepHeader step="3" title="Details" />

            <Row
              description="The starting price for the item which determines the minimum amount that can be bid. The item will not sell if no bids at or above this price are received."
              title="Starting price"
            >
              <MoneyField name="initialPrice" />
            </Row>

            <Row description="The day and time your auction will start." title="Start date & time">
              <StartDateField name="startDate" />
            </Row>
            <Row description="How long the auction should run for." title="Duration">
              <SelectField name="endDate">
                <Dropdown.Item eventKey="1">1 Day</Dropdown.Item>
                <Dropdown.Item eventKey="2">2 Days</Dropdown.Item>
                <Dropdown.Item eventKey="3">3 Days</Dropdown.Item>
                <Dropdown.Item eventKey="5">5 Days</Dropdown.Item>
                <Dropdown.Item eventKey="8">8 Days</Dropdown.Item>
              </SelectField>
            </Row>
            <Row description="What charity will benefit from the proceeds of this auction." title="Charity">
              <CharitiesAutocomplete charities={charities} onChange={handleCharityChange} />
            </Row>
          </Container>
          {/* <Field name="charity">{({ input }) => <input type="hidden" value={favoriteCharities} {...input} />}</Field> */}
          <StepByStepRow
            last
            loading={updating || updatingStatus}
            nextAction={handleSubmit}
            prevAction={handlePrevAction}
          />
        </Form>
      </section>
    </Layout>
  );
};

export default EditAuctionDetailsPage;
