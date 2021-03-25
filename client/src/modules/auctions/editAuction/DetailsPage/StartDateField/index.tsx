import React, { FC } from 'react';

import { Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Field, useFormState } from 'react-final-form';

import SelectField from 'src/components/Form/SelectField';

import { timeZones } from '../consts';
import styles from './styles.module.scss';

interface Props {
  name: string;
}

const StartDateField: FC<Props> = ({ name }) => {
  const { values } = useFormState();

  const selectedOption = () => {
    const { startDate } = values;
    const selected = timeZones.find((option) => option.value === startDate.timeZone);

    return selected || {};
  };

  return (
    <>
      <Field name={`${name}.date`}>
        {({ input }) => (
          <DatePicker
            className="form-control"
            dateFormat="dd/MM/yyyy"
            selected={input.value}
            {...input}
            minDate={new Date()}
          />
        )}
      </Field>

      <div className="d-flex mt-4">
        <Field name={`${name}.time`}>
          {({ input }) => (
            <Form.Control className="text-headline text-center mr-2 mr-sm-3 p-1 p-sm-2" type="time" {...input} />
          )}
        </Field>

        <Field name={`${name}.dayPeriod`}>
          {({ input }) => (
            <ToggleButtonGroup className="mr-2 mr-sm-3" {...input} type="radio">
              <ToggleButton
                className="h-100 text-subhead pr-sm-3 pr-2 pl-sm-3 pl-2"
                value="am"
                variant="outline-primary"
              >
                AM
              </ToggleButton>
              <ToggleButton
                className="h-100 text-subhead pr-sm-3 pr-2 pl-sm-3 pl-2"
                value="pm"
                variant="outline-primary"
              >
                PM
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Field>

        <SelectField
          small
          className={styles.timeZone}
          name={`${name}.timeZone`}
          options={timeZones}
          selected={selectedOption()}
        />
      </div>
    </>
  );
};

export default StartDateField;
