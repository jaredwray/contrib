import { render } from '@testing-library/react';

import Form from 'src/components/forms/Form/Form';
import { SubmitButton } from '..';

const mockedSumbit = jest.fn();

describe('SubmitButton', () => {
  describe('with default params', () => {
    it('renders component', () => {
      render(
        <Form onSubmit={mockedSumbit}>
          <SubmitButton text="text" />
        </Form>,
      );
    });
  });
  describe('with all params', () => {
    it('renders component', () => {
      render(
        <Form onSubmit={mockedSumbit}>
          <SubmitButton text="text" className="pb-0" disabled={true} />
        </Form>,
      );
    });
  });
});
