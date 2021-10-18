import { getMetricForGraphics } from '../getMetricForGraphics';

const mock = [
  {
    value: 'test',
    clicks: '2',
  },
];

const result = {
  labels: ['test'],
  values: [2],
};

test('it should return metric', () => {
  expect(getMetricForGraphics(mock)).toStrictEqual(result);
});
