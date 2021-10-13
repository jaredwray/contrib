export function concatMetrics(incomingMetrics, metricValue) {
  const metricName = Date.parse(metricValue) ? 'date' : 'value';
  const currentMetrics = [...incomingMetrics];
  const objectIndex = currentMetrics.findIndex((metricObject) => metricObject[metricName] === metricValue);

  if (objectIndex >= 0) {
    const currentMetricObject = currentMetrics[objectIndex];
    currentMetrics[objectIndex] = { ...currentMetricObject, clicks: currentMetricObject.clicks + 1 };
    return currentMetrics;
  }

  return [...currentMetrics, { [metricName]: metricValue, clicks: 1 }];
}
