import { render } from '@testing-library/react';

// import InputField from '../InputField';
import Form from 'src/components/Form/Form';

const mockedSumbit = jest.fn();

test('renders without crashing', () => {
  render(<Form onSubmit={mockedSumbit} />);
});
