import { FC } from 'react';

import { Row } from 'react-bootstrap';

import InputField from 'src/components/Form/InputField';

interface Props {
  title: string;
  disabled?: boolean;
  field?: string;
}
export const ModalRow: FC<Props> = ({ title, disabled, field }) => {
  return (
    <>
      <Row className="d-flex align-items-baseline">
        <span className="pt-1 pb-1 text-label">{title}</span>
      </Row>
      <Row className="d-flex align-items-baseline w-100">
        <div className="w-100">
          <InputField required disabled={disabled} name={field || title} wrapperClassName="mb-1" />
        </div>
      </Row>
    </>
  );
};
