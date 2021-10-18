import { MetricEntity, MetricForDoughnut } from 'src/types/Metric';

export function getMetricForGraphics(metricData: MetricEntity[]): MetricForDoughnut {
  return {
    labels: metricData.map((data: MetricEntity) => data.value),
    values: metricData.map((data: MetricEntity) => Number(data.clicks)),
  };
}
