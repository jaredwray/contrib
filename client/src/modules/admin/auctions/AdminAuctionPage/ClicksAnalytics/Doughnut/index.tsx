import { FC } from 'react';

import { Col } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';

import styles from '../styles.module.scss';

interface Props {
  labels: any[];
  values: any[];
}
const DOUGHNUT_LABELS_LIMIT = 3;

export const ChartDoughnut: FC<Props> = ({ labels, values }) => {
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
  const refferersRest: number[] = [];
  const clickNum = values.reduce((acc: number, val: number) => acc + val, 0);
  return (
    <Col>
      <p className="text-all-cups">referrers</p>
      <ul className={styles.doughnutLabelsReferrers}>
        {labels.map((label: string, i: number) => {
          if (i >= DOUGHNUT_LABELS_LIMIT) {
            return null;
          }
          refferersRest.push(values[i]);
          return (
            <li key={label}>
              <div title={label}>{label}</div>
              {values[i]}
            </li>
          );
        })}
        {labels.length > DOUGHNUT_LABELS_LIMIT && (
          <li>
            <div>+{labels.length - DOUGHNUT_LABELS_LIMIT} more</div>
            {clickNum - refferersRest.reduce((acc: number, val: number) => acc + val, 0)}
          </li>
        )}
      </ul>
      <Doughnut
        data={ChartValues(labels, values)}
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
  );
};
