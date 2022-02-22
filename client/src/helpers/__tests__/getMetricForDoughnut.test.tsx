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

describe('getMetricForGraphics', () => {
  test('it returns metric', () => {
    expect(getMetricForGraphics(mock)).toStrictEqual(result);
  });
});
