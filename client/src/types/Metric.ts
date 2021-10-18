export interface Click {
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
