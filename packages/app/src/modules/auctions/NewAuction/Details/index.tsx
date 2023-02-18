import { FC, ReactElement, useContext } from 'react';

import clsx from 'clsx';

import FloatingLabel from 'src/components/forms/inputs/FloatingLabel';
import { UserAccountContext } from 'src/components/helpers/UserAccountProvider/UserAccountContext';

import { IFormError } from '../IFormState';
import Charities from './Charities';
import Duration from './Duration';
import Prices from './Prices';
import styles from './styles.module.scss';

interface Props {
  disabled?: boolean;
  errors?: IFormError;
  checkMissed: (name: string, value: string | Dinero.DineroObject) => void;
}

const Details: FC<Props> = ({ disabled, checkMissed, errors }): ReactElement => {
  const { account } = useContext(UserAccountContext);
  return (
    <div>
      <div className={clsx(styles.title, 'pb-4')}>AUCTION DETAILS</div>
      <FloatingLabel
        required
        className={styles.input}
        description="What are you auctioning? Share key details like who the benefitting Charity is, and the type of impact your auction is making."
        disabled={disabled}
        label="Title"
        name="title"
        setValueToState={checkMissed}
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
      <Prices checkMissed={checkMissed} disabled={disabled} errors={errors} />
      <Duration disabled={disabled} />
      <Charities checkMissed={checkMissed} disabled={disabled} />
      {account?.isAdmin && (
        <FloatingLabel
          className={clsx(styles.input, 'mt-3')}
          description="Enter any password here and this auction will be private. Only user with this password and direct link will see it."
          disabled={disabled}
          label="Password"
          name="password"
          type="input"
        />
      )}
    </div>
  );
};

export default Details;
