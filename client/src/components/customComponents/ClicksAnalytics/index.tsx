import { FC, useState } from 'react';

import clsx from 'clsx';
import { format } from 'date-fns-tz';
import { Row, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

import { getMetricForGraphics } from 'src/helpers/getMetricForGraphics';
import { MetricClick, Metrics } from 'src/types/Metric';

import { ChartDoughnut } from './Doughnut';
import styles from './styles.module.scss';

interface Props {
  metrics: Metrics;
  isAuctionPage?: boolean;
}

export const ClicksAnalytics: FC<Props> = ({ metrics, isAuctionPage }) => {
  const [perDay, setPerDay] = useState(true);
  const ChartValues = (labels: string[], values: string[]) => {
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
          hoverBorderColor: '#5a7864',
          hoverBackgroundColor: '#5a7864',
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

  if (!metrics.clicks) {
    return <div className={clsx('text--body', isAuctionPage && 'pt-3')}>No information yet</div>;
  }

  const {
    clicks: incomingClicks,
    countries: incomingCountries,
    referrers: incomingReferrers,
    clicksByDay: incomingClicksByDay,
    browsers: incomingBrowsers,
    oss: incomingOss,
  } = metrics;

  const clicks = {
    labels: incomingClicks.map((data: MetricClick) => dateFormatterToTime(data.date)).reverse(),
    values: incomingClicks.map((data: MetricClick) => data.clicks).reverse(),
    dates: incomingClicks.map((data: MetricClick) => dateFormatter(data.date)).reverse(),
  };
  const clicksByDay = {
    labels: incomingClicksByDay.map((data: MetricClick) => dateFormatter(data.date)).reverse(),
    values: incomingClicksByDay.map((data: MetricClick) => data.clicks).reverse(),
  };
  const countries = getMetricForGraphics(incomingCountries);
  const referrers = getMetricForGraphics(incomingReferrers);
  const browsers = getMetricForGraphics(incomingBrowsers);
  const oss = getMetricForGraphics(incomingOss);

  let totalClicks = 0;
  if (referrers.values.length) {
    totalClicks = referrers.values.reduce((acc: number, el: number) => acc + el, 0);
  }

  const dayCutter = (days: string[]) => {
    if (days.length <= 4) {
      return days.flatMap(() => ['12AM', '6AM', '12PM', '6PM']);
    } else {
      return days.flatMap(() => ['12AM', '12PM']);
    }
  };
  const type = [
    { value: 1, label: 'per day' },
    { value: 0, label: 'per hour' },
  ];

  return (
    <>
      <Row>
        <ButtonGroup toggle className={clsx(styles.select, 'mb-3', isAuctionPage && 'mx-auto mt-3')}>
          {type.map((radio, idx) => (
            <ToggleButton
              key={idx}
              checked={perDay === Boolean(radio.value)}
              name="radio"
              type="radio"
              value={radio.value}
              variant="outline-primary"
              onChange={(e) => setPerDay(Boolean(Number(e.currentTarget.value)))}
            >
              {radio.label}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Row>
      <p className="text-all-cups">
        total clicks: <b>{totalClicks}</b>
      </p>
      <Row className="mb-4">
        {
          /* istanbul ignore next */ perDay ? (
            <Bar
              data={ChartValues(clicksByDay.labels, clicksByDay.values)}
              height={200}
              options={{
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context: any) => {
                        return `${context.dataset.label}: ${context.parsed.y}`;
                      },
                    },
                  },
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
                    display: false,
                    ticks: {
                      display: false,
                    },
                  },
                  AM_PM: {
                    tooltips: {
                      mode: 'index',
                      intersect: false,
                    },
                    display: clicksByDay.labels.length <= 8,
                    position: 'bottom',
                    labels: dayCutter(clicksByDay.labels),

                    ticks: {
                      beginAtZero: true,

                      display: true,
                      font: {
                        size: 8,
                      },
                    },
                  },
                  Days: {
                    position: 'bottom',
                    labels: clicksByDay.labels,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      title: (context: any) => {
                        return `${context[0].label} ${clicks.dates[context[0].dataIndex]}`;
                      },
                    },
                  },
                },
                responsive: true,
              }}
              type="bar"
              width={600}
            />
          )
        }
      </Row>
      <Row>
        <ChartDoughnut
          isAuctionPage={isAuctionPage}
          labels={referrers.labels}
          name="referrers"
          values={referrers.values}
        />
        <ChartDoughnut
          isAuctionPage={isAuctionPage}
          labels={countries.labels}
          name="countries"
          values={countries.values}
        />
      </Row>
      <Row>
        <ChartDoughnut
          isAuctionPage={isAuctionPage}
          labels={browsers?.labels}
          name="browsers"
          values={browsers?.values}
        />
        <ChartDoughnut
          isAuctionPage={isAuctionPage}
          labels={oss?.labels}
          name="operating systems"
          values={oss?.values}
        />
      </Row>
    </>
  );
};

export default ClicksAnalytics;
