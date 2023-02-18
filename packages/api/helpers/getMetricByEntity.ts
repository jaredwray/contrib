export function getMetricByEntity(metricData, metricEntity) {
  const currentMetric = metricData.reduce((acc, cur) => {
    const value = cur[metricEntity];
    if (acc[value]) {
      acc[value] += 1;
      return acc;
    }
    return { ...acc, [value]: 1 };
  }, {});

  return Object.keys(currentMetric)
    .map((key) => {
      return {
        value: key,
        clicks: currentMetric[key],
      };
    })
    .sort((prev, cur) => cur['clicks'] - prev['clicks']);
}
