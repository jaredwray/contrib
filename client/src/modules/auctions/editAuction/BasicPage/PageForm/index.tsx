import React, { FC } from 'react';

import InputField from 'src/components/Form/InputField';
import SwitchField from 'src/components/Form/SwitchField';

import styles from './styles.module.scss';

interface Props {
  isActive?: boolean;
}

const BasicForm: FC<Props> = ({ isActive }) => {
  return (
    <div>
      <InputField required name="title" placeholder="Enter auction title" title="Auction title" />
      <InputField required disabled={isActive} name="sport" placeholder="Select a sport" title="Sport" />
      <SwitchField className="mb-2" disabled={isActive} name="gameWorn" title="Game worn" />
      <SwitchField className="mb-2" disabled={isActive} name="autographed" title="Autographed" />
      <SwitchField
        className="mb-4"
        disabled={isActive}
        name="authenticityCertificate"
        title="Certificate of authenticity"
      />
      <InputField disabled={isActive} name="playedIn" placeholder="Enter teams and date" title="Game played in" />
      <InputField
        required
        textarea
        className={styles.description}
        externalText="This is the short one or two sentence description that will be used to describe the item when shared on social networks like Twitter and Facebook."
        name="description"
        placeholder="Enter short description"
        title="Short description"
      />
      <InputField
        required
        textarea
        className={styles.fullPageDescription}
        externalText="This is the full description that will appear on the Contrib auction page along side the bidding box etc."
        name="fullPageDescription"
        placeholder="Enter full description"
        title="Full description"
      />
    </div>
  );
};

export default BasicForm;
