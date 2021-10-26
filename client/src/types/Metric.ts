export interface MetricClick {
  date: string;
  clicks: string;
}

export interface MetricEntity {
  value: string;
  clicks: string;
}

export interface MetricForDoughnut {
  labels: string[];
  values: number[];
}

export interface Metrics {
  clicks: MetricClick[];
  clicksByDay: MetricClick[];
  browsers: MetricEntity[];
  countries: MetricEntity[];
  oss: MetricEntity[];
  referrers: MetricEntity[];
}
