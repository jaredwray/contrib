import { FC } from 'react';

import { sub, isSameDay, differenceInCalendarDays } from 'date-fns';
import { format } from 'date-fns-tz';
import { Col, Row } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import { ChartDoughnut } from 'src/components/Doughnut';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  bitly: any;
  auction: Auction;
}

export const ClicksAnalytics: FC<Props> = ({ bitly, auction }) => {
  const maxBid = Math.max(...auction.bids.map(({ bid }) => bid.amount));
  const maxBidDate = auction.bids.filter(({ bid }) => bid.amount === maxBid)[0]?.createdAt;

  const daysLimit = 30;
  const endDate = auction.isSold ? maxBidDate : auction.endDate;
  const bitlyStartDate = sub(new Date(), { days: daysLimit });

  const dayStartDiff = differenceInCalendarDays(new Date(auction.startDate), bitlyStartDate);
  const dayEndDiff = differenceInCalendarDays(new Date(endDate), bitlyStartDate);

  if (dayEndDiff <= 0) {
    return <span>The auction link expired, no data for metric </span>;
  }
  const startOfInterval = sub(new Date(), { days: dayStartDiff > 0 ? daysLimit - dayStartDiff : daysLimit });
  const endOfInterval = dayEndDiff > 0 && dayEndDiff <= daysLimit ? new Date(endDate) : new Date();

  const doughnutLabelsLimit = 3;
  const ChartValues = (labels: any, values: any) => {
    return {
      labels: labels,
      datasets: [
        {
          cutout: 90,
          label: 'Clicks',
          data: values,
          backgroundColor: ['#476585', '#0f81b7', '#2492c9', '#27a7e0'],
          borderColor: ['#476585', '#0f81b7', '#2492c9', '#27a7e0'],
          borderWidth: 1,
        },
      ],
    };
  };
  const dateFormatter = (date: string) => {
    return format(new Date(date.split('+')[0]), 'MM.dd');
  };

  const chosenStartDate = bitly.clicksByDay.filter((x: any) => isSameDay(new Date(x.date), startOfInterval))[0];
  const chosenEndDate = bitly.clicksByDay.filter((x: any) => isSameDay(new Date(x.date), endOfInterval))[0];

  const startInterval = bitly.clicksByDay.map((x: any) => x.date).indexOf(chosenStartDate?.date || 0) + 1;
  const endInterval = bitly.clicksByDay.map((x: any) => x.date).indexOf(chosenEndDate?.date || 0);

  const countries = {
    labels: bitly.countries.map((x: any) => x.value),
    values: bitly.countries.map((x: any) => Number(x.clicks)),
  };

  const referrers = {
    labels: bitly.referrers.map((x: any) => x.value),
    values: bitly.referrers.map((x: any) => Number(x.clicks)),
  };

  const clicksByDay = {
    labels: bitly.clicksByDay
      .map((day: any) => dateFormatter(day.date))
      .slice(endInterval, startInterval)
      .reverse(),
    values: bitly.clicksByDay
      .map((day: any) => day.clicks)
      .slice(endInterval, startInterval)
      .reverse(),
  };

  let totalClicks = 0;
  if (referrers.values.length) {
    totalClicks = referrers.values.reduce((acc: number, el: number) => acc + el, 0);
  }

  const refferersRest: number[] = [];
  const countriesRest: number[] = [];
  const clickNum = referrers.values.reduce((acc: number, val: number) => acc + val, 0);

  return (
    <>
      {dayStartDiff <= 0 && (
        <div className="mb-2">
          The auction started before the link began its life. Metric starts at {format(bitlyStartDate, 'mm.dd.yy')}
        </div>
      )}
      <p className="text-all-cups">
        total clicks: <b>{totalClicks}</b>
      </p>
      {totalClicks !== 0 && (
        <>
          <Row>
            <Bar
              data={ChartValues(clicksByDay.labels, clicksByDay.values)}
              height={200}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                responsive: true,
              }}
              type="bar"
              width={600}
            />
          </Row>
          <Row className="pt-4 pb-3">
            <Col>
              <p className="text-all-cups">referrers</p>
              <ul className={styles.doughnutLabelsReferrers}>
                {referrers.labels.map((label: string, i: number) => {
                  if (i < doughnutLabelsLimit) {
                    refferersRest.push(referrers.values[i]);
                    return (
                      <li key={label}>
                        <div title={label}>{label}</div>
                        {referrers.values[i]}
                      </li>
                    );
                  }
                  return null;
                })}
                {referrers.labels.length > doughnutLabelsLimit ? (
                  <li>
                    <div>+{referrers.labels.length - doughnutLabelsLimit} more</div>
                    {clickNum - refferersRest.reduce((acc: number, val: number) => acc + val, 0)}
                  </li>
                ) : (
                  ''
                )}
              </ul>
              <ChartDoughnut labels={referrers.labels} values={referrers.values} />
            </Col>
            <Col>
              <p className="text-all-cups mb-2">countries</p>
              <ul className={styles.doughnutLabelsCountries}>
                {countries.labels.map((label: string, i: number) => {
                  if (i < doughnutLabelsLimit) {
                    refferersRest.push(countries.values[i]);
                    return (
                      <li key={label}>
                        <div title={label}>{label}</div>
                        {countries.values[i]}
                      </li>
                    );
                  }
                  return null;
                })}
                {countries.labels.length > doughnutLabelsLimit && countries.labels.length !== totalClicks ? (
                  <li>
                    <div>+{countries.labels.length - doughnutLabelsLimit} more</div>
                    {clickNum - countriesRest.reduce((acc: number, val: number) => acc + val, 0)}
                  </li>
                ) : (
                  ''
                )}
              </ul>
              <ChartDoughnut labels={countries.labels} values={countries.values} />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ClicksAnalytics;
