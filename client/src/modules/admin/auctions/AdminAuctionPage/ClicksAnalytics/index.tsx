import { FC, useState } from 'react';

import clsx from 'clsx';
import { isSameDay } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';

import { ChartDoughnut } from 'src/modules/admin/auctions/AdminAuctionPage/ClicksAnalytics/Doughnut';
import { Auction } from 'src/types/Auction';

import styles from './styles.module.scss';

interface Props {
  bitly: any;
  auction: Auction;
}

export const ClicksAnalytics: FC<Props> = ({ bitly, auction }) => {
  const auctionStartDate = utcToZonedTime(auction.startDate, auction.timeZone);

  const [startOfInterval, setStartOfInterval] = useState(auctionStartDate);
  const [perDay, setPerDay] = useState(true);
  const [endOfInterval, setEndOfInterval] = useState(utcToZonedTime(new Date().toISOString(), auction.timeZone));

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
  const dateFormatterToTime = (date: string) => {
    return format(utcToZonedTime(new Date(date.split('+')[0]).toISOString(), auction.timeZone), 'p').replace(':00', '');
  };
  const dateFormatter = (date: string) => {
    return format(utcToZonedTime(new Date(date.split('+')[0]).toISOString(), auction.timeZone), 'MM.dd');
  };

  const chosenStartDate = bitly.clicksByDay.filter((x: any) => isSameDay(new Date(x.date), startOfInterval))[0];
  const chosenEndDate = bitly.clicksByDay.filter((x: any) =>
    isSameDay(utcToZonedTime(x.date, auction.timeZone), endOfInterval),
  )[0];

  const startInterval = bitly.clicksByDay.map((x: any) => x.date).indexOf(chosenStartDate?.date || 0) + 1;
  const endInterval = bitly.clicksByDay.map((x: any) => x.date).indexOf(chosenEndDate?.date || 0);

  const clicks = {
    labels: bitly.clicks
      .map((x: any) => `${dateFormatterToTime(x.date)} ${dateFormatter(x.date)}`)
      .slice(endInterval * 24, startInterval * 24)
      .reverse(),
    values: bitly.clicks
      .map((x: any) => x.clicks)
      .slice(endInterval * 24, startInterval * 24)
      .reverse(),
  };

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

  return (
    <>
      <Row>
        <Col className="p-0">
          <p className={clsx(styles.link, perDay ? styles.active : styles.normal)} onClick={() => setPerDay(true)}>
            Per day
          </p>
          <p className={clsx(styles.link, !perDay ? styles.active : styles.normal)} onClick={() => setPerDay(false)}>
            Per hour
          </p>
        </Col>
      </Row>
      <Row>
        <Col className={clsx(styles.datePickerWrapper)}>
          <div className="DatePickerMainWrapper mt-2 mb-3">
            <label>from</label>
            <DatePicker
              className={clsx(styles.datePicker, 'form-control ')}
              maxDate={endOfInterval}
              minDate={auctionStartDate}
              selected={startOfInterval}
              onChange={(date: any) => setStartOfInterval(date)}
            />
          </div>
        </Col>
        <Col className={clsx(styles.datePickerWrapper)}>
          <div className="DatePickerMainWrapper mt-2 mb-3 d-block ">
            <label>to</label>
            <DatePicker
              className={clsx(styles.datePicker, 'form-control ')}
              maxDate={utcToZonedTime(new Date().toISOString(), auction.timeZone)}
              minDate={startOfInterval}
              selected={endOfInterval}
              onChange={(date: any) => setEndOfInterval(date)}
            />
          </div>
        </Col>
      </Row>
      <p className="text-all-cups">
        total clicks: <b>{totalClicks}</b>
      </p>
      {totalClicks !== 0 && (
        <>
          <Row>
            {perDay ? (
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
            ) : (
              <Bar
                data={ChartValues(clicks.labels, clicks.values)}
                height={200}
                options={{
                  scales: {
                    y: {
                      display: false,
                    },
                    x: {
                      display: true,
                    },
                  },
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
            )}
          </Row>
          <Row className="pt-4 pb-3">
            <ChartDoughnut labels={referrers.labels} values={referrers.values} />
            <ChartDoughnut labels={countries.labels} values={countries.values} />
          </Row>
        </>
      )}
    </>
  );
};

export default ClicksAnalytics;
