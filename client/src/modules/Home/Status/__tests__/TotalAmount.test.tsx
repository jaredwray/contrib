import { render } from '@testing-library/react';

import { BrowserRouter as Router } from 'react-router-dom';

import { TotalAmount } from '../Badges/TotalAmount';

jest.mock('src/components/modals/TermsConfirmationDialog', () => () => <></>);

describe('TotalAmount', () => {
  describe('with title only', () => {
    test('renders without crashing', () => {
      render(<TotalAmount icon="" title="test" />);
    });
  });

  describe('with all arguments', () => {
    test('renders without crashing', () => {
      render(<TotalAmount firstValue="1" icon="" secondValue="info" title="test" />);
    });
  });
});
