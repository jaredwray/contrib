import React, { FC } from 'react';

import { Form, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Field } from 'react-final-form';

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
              <ToggleButton value="am" variant="outline-primary">
                AM
              </ToggleButton>
              <ToggleButton value="pm" variant="outline-primary">
                PM
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Field>

        <Field name={`${name}.timeZone`}>
          {({ input }) => (
            <Form.Control as="select" {...input}>
              <option value="-1000">HST</option>
              <option value="-0900">AKST</option>
              <option value="-0800">PST</option>
              <option value="-0700">MST</option>
              <option value="-0600">CST</option>
              <option value="-0500">EST</option>
              <option value="+0800">888</option>
              <option value="+0300">333</option>
            </Form.Control>
          )}
        </Field>
      </div>
    </>
  );
};

export default StartDateField;
