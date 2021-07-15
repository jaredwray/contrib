import dayjs, { Dayjs } from 'dayjs';
import { BitlyClick } from '../app/Auction/dto/AuctionMetrics';

export const fullBitlyClicks = (shortBitlyClicks: any, startDate: Dayjs, flag: string) => {
  const startIntervalHours = dayjs(startDate).utc().minute(0).second(0).millisecond(0);
  const startIntervalDays = dayjs(startDate).utc().hour(0).minute(0).second(0).millisecond(0);
  const endDate = dayjs().utc().hour(23).minute(59).second(0).millisecond(0);
  const diffInHours = endDate.diff(startIntervalHours, 'hour');
  const diffInDays = endDate.diff(startIntervalDays, 'day') + 1;
  const isByHour = flag === 'hour';

  return Array.from({ length: isByHour ? diffInHours : diffInDays }, (_: BitlyClick, i: number) => {
    const date = dayjs(isByHour ? startIntervalHours : startIntervalDays)
      .add(i, isByHour ? 'hour' : 'day')
      .toISOString();
    const bitlyData = shortBitlyClicks.find((valueFromShortArray: BitlyClick) =>
      dayjs(valueFromShortArray.date).isSame(dayjs(date)),
    );

    return {
      clicks: bitlyData?.clicks || 0,
      date: date,
    };
  }).reverse();
};
