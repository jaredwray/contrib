export function concatMetrics(currentMetrics, incomingMetrics) {
  const array = [...currentMetrics, ...incomingMetrics];
  const result = array.reduce((prev, current) => {
    prev[current.value] = (prev[current.value] || 0) + current.clicks;
    return prev;
  }, {});
  return Object.entries(result).map((arr) => {
    return { value: arr[0], clicks: arr[1] };
  });
}
