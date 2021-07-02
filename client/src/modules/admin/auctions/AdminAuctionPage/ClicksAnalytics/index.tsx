import { FC, useState } from 'react';

import clsx from 'clsx';
import { sub, isSameDay } from 'date-fns';
import { format } from 'date-fns-tz';
import { Col, Row, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';

import { type, time } from './consts';
import styles from './styles.module.scss';

interface Props {
  bitly: any;
}

export const ClicksAnalytics: FC<Props> = ({ bitly }) => {
  const [radioValue, setRadioValue] = useState(1);
  const [startOfInterval, setStartOfInterval] = useState(sub(new Date(), { days: 29 }));
  const [endOfInterval, setEndOfInterval] = useState(new Date());
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
  const dateFormatterToTime = (date: string) => {
    return format(new Date(date.split('+')[0]), 'p').replace(':00', '');
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

  const clicks = {
    labels: bitly.clicks.map((x: any) => dateFormatterToTime(x.date)).slice(endInterval * 24, startInterval * 24),
    values: bitly.clicks.map((x: any) => x.clicks).slice(endInterval * 24, startInterval * 24),
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

  const BarValues = time.map((x: any) =>
    clicks.labels.length
      ? clicks.labels
          .reduce((acc: string, el: string, i: number) => (el === x ? [...acc, Number(clicks.values[i])] : acc), [])
          .reduce((acc: number, el: number) => acc + el)
      : '',
  );

  const totalClicks = BarValues.reduce((acc: number, el: number) => acc + el);

  const refferersRest: number[] = [];
  const countriesRest: number[] = [];
  const clickNum = referrers.values.length ? referrers.values.reduce((acc: number, val: number) => acc + val) : 0;

  return (
    <>
      <Row>
        <label>Choose metrick type</label>
        <ButtonGroup toggle className={clsx(styles.select, 'mt-2 mb-3 w-100')}>
          {type.map((radio, idx) => (
            <ToggleButton
              key={idx}
              checked={radioValue === radio.value}
              name="radio"
              type="radio"
              value={radio.value}
              variant="outline-primary"
              onChange={(e) => setRadioValue(Number(e.currentTarget.value))}
            >
              {radio.label}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Row>
      <Row>
        <Col className={clsx(styles.datePickerWrapper)}>
          <div className="DatePickerMainWrapper mt-2 mb-3">
            <label>from</label>
            <DatePicker
              className={clsx(styles.datePicker, 'form-control ')}
              maxDate={endOfInterval}
              minDate={sub(new Date(), { days: 29 })}
              selected={startOfInterval}
              onChange={(date: any) => {
                if (isSameDay(date, endOfInterval)) {
                  setRadioValue(0);
                }
                setStartOfInterval(date);
              }}
            />
          </div>
        </Col>
        <Col className={clsx(styles.datePickerWrapper)}>
          <div className="DatePickerMainWrapper mt-2 mb-3 d-block ">
            <label>to</label>
            <DatePicker
              className={clsx(styles.datePicker, 'form-control ')}
              maxDate={new Date()}
              minDate={startOfInterval}
              selected={endOfInterval}
              onChange={(date: any) => {
                if (isSameDay(date, startOfInterval)) {
                  setRadioValue(0);
                }
                setEndOfInterval(date);
              }}
            />
          </div>
        </Col>
      </Row>

      <span className="text-all-cups pb-2">{totalClicks} total clicks</span>

      {totalClicks !== 0 && (
        <>
          <Row>
            {radioValue ? (
              <Bar
                data={ChartValues(clicksByDay.labels, clicksByDay.values)}
                height={200}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
                type="bar"
                width={600}
              />
            ) : (
              <Bar
                data={ChartValues(time, BarValues)}
                height={200}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
                type="bar"
                width={600}
              />
            )}
          </Row>
          <Row className="pt-4 pb-3">
            <Col>
              <span className="text-all-cups">referrers</span>
              {
                <ul className={clsx(styles.doughnutLabelsReferrers)}>
                  {referrers.labels.map((x: string, i: number) => {
                    if (i < doughnutLabelsLimit) {
                      refferersRest.push(referrers.values[i]);
                      return (
                        <li key={x}>
                          <span>{x}</span>
                          {referrers.values[i]}
                        </li>
                      );
                    }
                    return null;
                  })}
                  {referrers.labels.length > doughnutLabelsLimit ? (
                    <li>
                      <span>+{referrers.labels.length - doughnutLabelsLimit} more</span>
                      {clickNum - refferersRest.reduce((acc: number, val: number) => acc + val, 0)}
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              }
              <Doughnut
                className="mb-2"
                data={ChartValues(referrers.labels, referrers.values)}
                height={250}
                options={{
                  responsive: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
                type="doughnut"
                width={250}
              />
            </Col>
            <Col>
              <span className="text-all-cups">countries</span>
              {
                <ul className={clsx(styles.doughnutLabelsCountries)}>
                  {countries.labels.map((x: string, i: number) => {
                    if (i < doughnutLabelsLimit) {
                      refferersRest.push(countries.values[i]);
                      return (
                        <li key={x}>
                          <span>{x}</span>
                          {countries.values[i]}
                        </li>
                      );
                    }
                    return null;
                  })}
                  {countries.labels.length > doughnutLabelsLimit && countries.labels.length !== totalClicks ? (
                    <li>
                      <span>+{countries.labels.length - doughnutLabelsLimit} more</span>
                      {clickNum - countriesRest.reduce((acc: number, val: number) => acc + val, 0)}
                    </li>
                  ) : (
                    ''
                  )}
                </ul>
              }
              <Doughnut
                data={ChartValues(countries.labels, countries.values)}
                height={250}
                options={{
                  responsive: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
                type="doughnut"
                width={250}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ClicksAnalytics;
