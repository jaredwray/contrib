import { FC, ReactElement } from 'react';

interface Props {
  text: string;
  value: boolean;
}

const Status: FC<Props> = ({ text, value }): ReactElement => (
  <div className="pt-1">
    <span>{text}</span>
    <span className="float-right">{value ? 'Yes' : 'No'}</span>
  </div>
);

export default Status;
