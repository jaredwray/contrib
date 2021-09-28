import { render } from '@testing-library/react';

import { ActionsDropdown } from 'src/components/selects/ActionsDropdown';
const props: any = {
  title: 'test',
};
test('renders without crashing', () => {
  render(<ActionsDropdown {...props} />);
});
