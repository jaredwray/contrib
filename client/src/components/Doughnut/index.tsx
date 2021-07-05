import { FC } from 'react';

import { Doughnut } from 'react-chartjs-2';

interface Props {
  labels: any[];
  values: any[];
}

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
  return (
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
  );
};
