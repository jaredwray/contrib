import { FC } from 'react';

import { Row } from 'react-bootstrap';

import InputField from 'src/components/Form/InputField';

interface Props {
  title: string;
}
export const ModalRow: FC<Props> = ({ title }) => {
  const camelCase = (str: string) => {
    return str.replace(/ ([a-z])/g, function (_, w) {
      return w.toUpperCase();
    });
  };
  return (
    <>
      <Row className="d-flex align-items-baseline">
        <span className="pt-1 pb-1">{title}</span>
      </Row>
      <Row className="d-flex align-items-baseline w-100">
        <div className="w-100">
          <InputField name={camelCase(title)} wrapperClassName="mb-1" />
        </div>
      </Row>
    </>
  );
};
