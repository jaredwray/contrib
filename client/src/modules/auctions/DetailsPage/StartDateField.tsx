import React, { FC, useCallback, useState } from 'react';

import { format, set, formatISO } from 'date-fns';
import { Button, ButtonGroup, Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import useField from 'src/components/Form/hooks/useField';
import InputField from 'src/components/Form/InputField';

interface Props {
  name: string;
}
const StartDateField: FC<Props> = ({ name }) => {
  const { hasError, errorMessage, value, onChange } = useField(name, {});
  const [fullDate, setFullDate] = useState<Date | string>(value);

  const date = format(new Date(fullDate), 'yyyy-MM-dd');
  const time = format(new Date(fullDate), 'hh:mm');
  const dayPeriod = format(new Date(fullDate), 'aaa');
  const timeZone = format(new Date(fullDate), 'X');

  const handleDateChange = useCallback((event) => {
    const inputDate = event.target.value;
    if (inputDate) {
      const [year, month, day] = inputDate.split('-').map((a: string) => parseInt(a, 10));

      setFullDate((prev) => set(new Date(prev), { year, month, date: day }).toISOString());
    }
  }, []);

  const handleTimeChange = useCallback((event) => {
    const [hours, minutes] = event.target.value.split(':').map((a: string) => parseInt(a, 10));
    setFullDate((prev) => set(new Date(prev), { hours, minutes }).toISOString());
  }, []);

  const handleDayPeriodChange = useCallback((event) => {
    console.log(event);
  }, []);

  const handleTimeZoneChange = useCallback((event) => {
    const timeZone = event.target.value;
  }, []);

  return (
    <>
      <Form.Control placeholder="Choose date" type="date" onChange={handleDateChange} />
      <input className="form-control" placeholder="Choose date" type="date" value={date} onChange={handleDateChange} />
      <div className="d-flex mt-4">
        <Form.Control className="text-headline text-center mr-3" type="time" value={time} onChange={handleTimeChange} />
        <ToggleButtonGroup
          className="mr-3"
          defaultValue={dayPeriod}
          name="radio"
          type="radio"
          onChange={handleDayPeriodChange}
        >
          <ToggleButton value="am">AM</ToggleButton> <ToggleButton value="pm">PM</ToggleButton>
        </ToggleButtonGroup>

        <Form.Control as="select" defaultValue={timeZone} onChange={handleTimeZoneChange}>
          <option value="-10">HST</option>
          <option value="-09">AKST</option>
          <option value="-08">PST</option>
          <option value="-07">MST</option>
          <option value="-06">CST</option>
          <option value="-05">EST</option>
        </Form.Control>
      </div>
    </>
  );
};

export default StartDateField;
