import { render } from '@testing-library/react';

import { SocialButtons } from '..';

const props = {
  facebook: 'string',
  twitter: 'string',
  instagram: 'string',
};

test('renders without crashing', () => {
  render(<SocialButtons {...props} />);
});
