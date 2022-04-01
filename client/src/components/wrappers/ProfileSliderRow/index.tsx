import { FC } from 'react';

import { Container } from 'react-bootstrap';

import Slider from 'src/components/customComponents/Slider';

interface Props {
  items: Object[];
}
export const ProfileSliderRow: FC<Props> = ({ items, children }) => {
  return (
    <Container fluid className="mb-2 mb-md-0">
      <Container>
        <span className="label-with-separator text-label my-4 d-block ">{children}</span>
      </Container>
      <div className="overflow-hidden">
        <Container>
          <Slider items={items} />
        </Container>
      </div>
    </Container>
  );
};
