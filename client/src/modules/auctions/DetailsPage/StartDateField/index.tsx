import React, { FC, useCallback } from 'react';

import { set, getHours } from 'date-fns';
import { format, zonedTimeToUtc, toDate } from 'date-fns-tz';
import { Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import useField from 'src/components/Form/hooks/useField';

import 'react-datepicker/src/stylesheets/datepicker.scss';

interface Props {
  name: string;
}

const StartDateField: FC<Props> = ({ name }) => {
  const { value, onChange } = useField(name, {});

  const currentDate = toDate(value);
  const time = format(currentDate, 'hh:mm');
  const dayPeriod = format(currentDate, 'aaa');
  const currentTimeZone = format(currentDate, 'xx');

  const handleDateChange = useCallback((inputDate) => {
    onChange(toDate(inputDate));
  }, []);

  const handleTimeChange = useCallback((event) => {
    const [hours, minutes] = event.target.value.split(':').map((a: string) => parseInt(a, 10));

    const filteredHours = dayPeriod === 'am' ? hours : hours + 12;
    const newDate = set(currentDate, { hours: filteredHours, minutes });

    onChange(zonedTimeToUtc(newDate, currentTimeZone).toISOString());
  }, []);

  const handleDayPeriodChange = useCallback((dayPeriod) => {
    const hours = getHours(currentDate);
    const changedHours = hours < 12 && dayPeriod === 'pm' ? hours - 12 : hours;

    const newDate = set(currentDate, { hours: changedHours });

    onChange(zonedTimeToUtc(newDate, currentTimeZone).toISOString());
  }, []);

  const handleTimeZoneChange = useCallback((event) => {
    const timeZone = event.target.value;

    onChange(zonedTimeToUtc(currentDate, timeZone).toISOString());
  }, []);

  return (
    <>
      <DatePicker className="form-control" dateFormat="dd/MM/yyyy" selected={currentDate} onChange={handleDateChange} />
      <div className="d-flex mt-4">
        <Form.Control className="text-headline text-center mr-3" type="time" value={time} onChange={handleTimeChange} />

        <ToggleButtonGroup
          className="mr-3"
          defaultValue={dayPeriod}
          name="radio"
          type="radio"
          onChange={handleDayPeriodChange}
        >
          <ToggleButton value="am" variant="outline-primary">
            AM
          </ToggleButton>
          <ToggleButton value="pm" variant="outline-primary">
            PM
          </ToggleButton>
        </ToggleButtonGroup>
        <Form.Control as="select" defaultValue={currentTimeZone} onChange={handleTimeZoneChange}>
          <option value="-1000">HST</option>
          <option value="-0900">AKST</option>
          <option value="-0800">PST</option>
          <option value="-0700">MST</option>
          <option value="-0600">CST</option>
          <option value="-0500">EST</option>
        </Form.Control>
      </div>
    </>
  );
};

export default StartDateField;
