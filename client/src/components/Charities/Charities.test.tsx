import { render } from '@testing-library/react';
import { when } from 'jest-when';

import Charities from './Charities';
import SearchParam from '../../helpers/SearchParam';

jest.mock('../../helpers/SearchParam');
const mockedSearchParam = jest.fn();
when(mockedSearchParam).calledWith('sbs').mockReturnValue(false);

test('renders without crashing', () => {
  render(<Charities />);
});
