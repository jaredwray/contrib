import { BaseSyntheticEvent, SetStateAction } from 'react';

import { format } from 'date-fns';

interface Ref {
  current: HTMLInputElement | null;
}
export const expirationDate = (
  e: BaseSyntheticEvent,
  value: string,
  maxLength: number,
  name: string,
  year: Ref,
  cvc: Ref,
  setMonth: (_: SetStateAction<string>) => void,
  setYear: (_: SetStateAction<string>) => void,
) => {
  const currentYear = format(new Date(), 'yyyy').slice(2);
  if (name === 'expirationDateMonth') {
    setMonth(e.target.value);

    if (Number(value[0]) > 1) {
      e.target.value = `1`;
    }
    if (value[0] !== '0' && Number(value[1]) > 2) {
      e.target.value = `12`;
    }

    if (value[0] === '0' && value[1] === '0') {
      e.target.value = '01';
    }
    if (maxLength === value.length) {
      year.current?.focus();
    }
  }
  if (name === 'expirationDateYear') {
    const tenYearsAfterCurrentYear = (Number(currentYear) + 10).toString();
    setYear(e.target.value);
    if (value[0] < currentYear[0]) {
      e.target.value = currentYear[0];
    }
    if (value < currentYear && value[1] < currentYear[1]) {
      e.target.value = currentYear;
    }
    if (value[0] > tenYearsAfterCurrentYear[0]) {
      e.target.value = tenYearsAfterCurrentYear[0];
    }
    if (value[0] > currentYear[0] && value[1] > tenYearsAfterCurrentYear[1]) {
      e.target.value = tenYearsAfterCurrentYear;
    }
    if (maxLength === value.length) {
      cvc.current?.focus();
    }
  }
};
