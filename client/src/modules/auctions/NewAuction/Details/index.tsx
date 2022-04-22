import { FC, ReactElement } from 'react';

import clsx from 'clsx';

import FloatingLabel from 'src/components/forms/inputs/FloatingLabel';

import Charities from './Charities';
import Duration from './Duration';
import Prices from './Prices';
import styles from './styles.module.scss';

interface Props {
  disabled?: boolean;
}

const Details: FC<Props> = ({ disabled }): ReactElement => {
  return (
    <div>
      <div className={clsx(styles.title, 'pb-4')}>AUCTION DETAILS</div>
      <FloatingLabel
        required
        description="What are you auctioning? Share key details like who the benefitting Charity is, and the type of impact your auction is making."
        disabled={disabled}
        label="Title"
        name="title"
        type="input"
      />
      <FloatingLabel
        className="mt-3"
        description="(Optional) Tell viewers about your auction by describing the Charity, and impact it will make."
        disabled={disabled}
        label="Description"
        name="description"
        type="textarea"
      />
      <Prices disabled={disabled} />
      <Duration disabled={disabled} />
      <Charities disabled={disabled} />
    </div>
  );
};

export default Details;
