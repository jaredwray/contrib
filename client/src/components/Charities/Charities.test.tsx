import { render } from '@testing-library/react';
import { when } from 'jest-when';

import Charities from './Charities';
import URLSearchParam from '../../helpers/URLSearchParam';

jest.mock('../../helpers/URLSearchParam');
const mockedSearchParam = jest.fn();
when(mockedSearchParam).calledWith('sbs').mockReturnValue(false);

test('renders without crashing', () => {
  render(<Charities />);
});
