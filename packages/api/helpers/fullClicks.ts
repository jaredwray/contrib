import dayjs, { Dayjs } from 'dayjs';

export const fullClicks = (shortClicks, startDate: Dayjs, flag: string) => {
  const startIntervalHours = dayjs(startDate).utc().minute(0).second(0).millisecond(0);
  const startIntervalDays = dayjs(startDate).utc().hour(0).minute(0).second(0).millisecond(0);
  const endDate = dayjs().utc().hour(23).minute(59).second(0).millisecond(0);
  const diffInHours = endDate.diff(startIntervalHours, 'hour');
  const diffInDays = endDate.diff(startIntervalDays, 'day') + 1;
  const isByHour = flag === 'hour';

  return Array.from({ length: isByHour ? diffInHours : diffInDays }, (_: any, i: number) => {
    const date = dayjs(isByHour ? startIntervalHours : startIntervalDays)
      .add(i, isByHour ? 'hour' : 'day')
      .toISOString();
      
    const data = shortClicks.filter((valueFromShortArray) => {
      const currentDate = isByHour
        ? dayjs(valueFromShortArray.date).utc().minute(0).second(0).millisecond(0)
        : dayjs(valueFromShortArray.date).utc().hour(0).minute(0).second(0).millisecond(0);
      return dayjs(currentDate).isSame(dayjs(date));
    });

    return {
      date,
      clicks: data?.length,
    };
  }).reverse();
};
