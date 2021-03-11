import { useCallback, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { Container, ProgressBar } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';

import { getAuctionDetails, updateAuctionDetails, updateAuctionStatusMutation } from 'src/apollo/queries/auctions';
import CharitiesAutocomplete from 'src/components/CharitiesAutocomplete';
import Form from 'src/components/Form/Form';
import MoneyField from 'src/components/Form/MoneyField';
import Layout from 'src/components/Layout';
import SelectDuration from 'src/modules/auctions/DetailsPage/SelectDuration';
import { Charity } from 'src/types/Charity';

import Row from '../common/Row';
import StepByStepRow from '../common/StepByStepRow';
import StepHeader from '../common/StepHeader';
import StartDateField from './StartDateField';
import styles from './styles.module.scss';

const EditAuctionDetailsPage = () => {
  const { auctionId } = useParams<{ auctionId: string }>();
  const history = useHistory();

  const [charities, setCharities] = useState<Charity[]>([]);

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
    onCompleted() {
      updateAuctionStatus({ variables: { id: auctionId, status: 'ACTIVE' } });
    },
    onError(error) {
      console.log(error);
    },
  });

  const handlePrevAction = useCallback(() => {
    history.push(`/auctions/${auctionId}/media`);
  }, [auctionId, history]);

  const handleSubmit = useCallback(
    (values) => {
      updateAuction({ variables: { id: auctionId, ...values } });
    },
    [auctionId, updateAuction],
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

  return (
    <Layout>
      <ProgressBar now={75} />

      <section className={styles.section}>
        <Form initialValues={auctionData?.auction} onSubmit={handleSubmit}>
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
              <SelectDuration name="endDate">
                <option value={1}>1 Day</option>
                <option value={2}>2 Days</option>
                <option value={3}>3 Days</option>
                <option value={5}>5 Days</option>
                <option value={8}>8 Days</option>
              </SelectDuration>
            </Row>
            <Row description="What charity will benefit from the proceeds of this auction." title="Charity">
              <CharitiesAutocomplete charities={charities} onChange={handleCharityChange} />
            </Row>
          </Container>
          {/* <input name="charity" type="hidden" value={favoriteCharities} /> */}
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
