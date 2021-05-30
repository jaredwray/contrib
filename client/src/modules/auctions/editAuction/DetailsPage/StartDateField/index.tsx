import React, { FC } from 'react';

import { Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Field, useFormState } from 'react-final-form';

import SelectField from 'src/components/Form/SelectField';

import { utcTimeZones } from '../consts';
import styles from './styles.module.scss';

interface Props {
  name: string;
}

const StartDateField: FC<Props> = ({ name }) => {
  const { values } = useFormState();
  const selectedOption = () => {
    const { startDate } = values;
    const selected = utcTimeZones.find((option) => option.value === startDate.timeZone);
    return selected || {};
  };

  return (
    <>
      <Field name={`${name}.date`}>
        {({ input }) => (
          <div className="DatePickerMainWrapper">
            <DatePicker className="form-control" selected={input.value} {...input} minDate={new Date()} />
          </div>
        )}
      </Field>
      <div className="d-flex mt-4">
        <Field name={`${name}.time`}>
          {({ input }) => {
            let selectedTime = input.value;

            if (selectedTime.split(':')[0].length === 1) {
              selectedTime = `0${selectedTime}`;
            }

            delete input.value;
            return (
              <Form.Control
                className="text-subhead font-weight-bold text-center mr-2 mr-sm-3 p-1 p-sm-2 font-weight-normal"
                defaultValue={selectedTime}
                type="time"
                {...input}
              />
            );
          }}
        </Field>
        <SelectField
          small
          className={styles.timeZone}
          name={`${name}.timeZone`}
          options={utcTimeZones}
          selected={selectedOption()}
        />
      </div>
    </>
  );
};

export default StartDateField;
