import React, { FC } from 'react';

import { Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Field } from 'react-final-form';

import SelectField from 'src/components/Form/SelectField';

import { timeZoneOptions } from '../consts';

interface Props {
  name: string;
}

const StartDateField: FC<Props> = ({ name }) => {
  return (
    <>
      <Field name={`${name}.date`}>
        {({ input }) => (
          <DatePicker className="form-control" dateFormat="dd/MM/yyyy" selected={input.value} {...input} />
        )}
      </Field>

      <div className="d-flex mt-4">
        <Field name={`${name}.time`}>
          {({ input }) => <Form.Control className="text-headline text-center mr-3" type="time" {...input} />}
        </Field>

        <Field name={`${name}.dayPeriod`}>
          {({ input }) => (
            <ToggleButtonGroup className="mr-3" {...input} type="radio">
              <ToggleButton className="h-100" value="am" variant="outline-primary">
                AM
              </ToggleButton>
              <ToggleButton className="h-100" value="pm" variant="outline-primary">
                PM
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Field>

        <SelectField small name={`${name}.timeZone`} options={timeZoneOptions} />
      </div>
    </>
  );
};

export default StartDateField;
