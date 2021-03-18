jest.mock('dayjs', () =>
  jest.fn(() => {
    const dayjs = jest.requireActual('dayjs');
    dayjs.local = jest.fn(() => jest.requireActual('dayjs')(`2020-08-10 12:00:00`));
    dayjs.toISOString = jest.fn(() => jest.requireActual('dayjs')(`2020-08-10 12:00:00`).toISOString());
    return dayjs;
  }),
);
